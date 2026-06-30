import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { stations, type Region } from '../data/stations';
import { state } from '../store';
import { prefersReducedMotion } from '../lib/webgl';

const MODEL_URL = `${import.meta.env.BASE_URL}models/robot.glb`;

function regionOf(name: string): Region | null {
  const n = name.toLowerCase();
  if (n === 'head') return 'brain';
  if (n.startsWith('eye')) return 'eyes';
  if (n === 'mouth') return 'jaw';
  if (n === 'neck' || n === 'spine') return 'spine';
  if (n === 'chest' || n === 'pelvis') return 'core';
  if (n.startsWith('shoulder') || n.startsWith('arm') || n.startsWith('elbow') || n.startsWith('hand'))
    return 'arms';
  if (n.startsWith('leg') || n.startsWith('knee') || n.startsWith('foot')) return 'legs';
  return null;
}

const FACE_MESHES = new Set(['head', 'eye_l', 'eye_r', 'visor']);
// two-tone android: brushed silver panels + dark joints/extremities, glowing visor
const SILVER = new THREE.Color('#c6cad0');
const DARK = new THREE.Color('#16181c');
const BLUE = new THREE.Color('#4f7bff'); // active-region tech-blue glow
const CYAN = new THREE.Color('#28d6ef'); // always-on visor / sensors
const SILVER_PARTS = new Set([
  'chest', 'chest_plate', 'pelvis', 'shoulder_l', 'shoulder_r',
  'arm_upper_l', 'arm_upper_r', 'arm_lower_l', 'arm_lower_r',
  'leg_upper_l', 'leg_upper_r', 'leg_lower_l', 'leg_lower_r',
]);
const GLOW_PARTS = new Set(['visor', 'eye_l', 'eye_r']);

const TOP_Y = 3.7;
const TARGET_HEIGHT = 7.6;
const ROT_SPEED = 0.2; // rad/s, continuous Y rotation
const BOB_AMP = 0.12;
const BOB_SPEED = 1.1;

// scratch objects (avoid per-frame allocation)
const _c = new THREE.Vector3();
const _box = new THREE.Box3();
const _tmpBox = new THREE.Box3();
const _sphere = new THREE.Sphere();

export default function Humanoid() {
  const group = useRef<THREE.Group>(null!);
  const meshes = useRef<THREE.Mesh[]>([]);
  const byRegion = useRef<Record<string, THREE.Mesh[]>>({});
  const baseY = useRef(0);
  const worldScale = useRef(1);
  const t = useRef(0);
  const reduce = useMemo(prefersReducedMotion, []);
  const { scene } = useGLTF(MODEL_URL);

  useLayoutEffect(() => {
    const list: THREE.Mesh[] = [];
    const map: Record<string, THREE.Mesh[]> = {};
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const lname = m.name.toLowerCase();
      const glow = GLOW_PARTS.has(lname);
      const silver = SILVER_PARTS.has(lname);
      m.material = new THREE.MeshStandardMaterial({
        color: silver ? SILVER.clone() : DARK.clone(),
        emissive: glow ? CYAN.clone() : BLUE.clone(),
        emissiveIntensity: glow ? 0.95 : 0,
        metalness: silver ? 0.92 : glow ? 0.2 : 0.55,
        roughness: silver ? 0.26 : glow ? 0.35 : 0.46,
        envMapIntensity: silver ? 1.5 : 1.0,
      });
      m.userData.baseEmissive = glow ? 0.95 : 0;
      if (!m.geometry.attributes.normal) m.geometry.computeVertexNormals();
      m.geometry.computeBoundingSphere();
      m.userData.r = m.geometry.boundingSphere?.radius ?? 0.2;
      m.castShadow = m.receiveShadow = true;
      const regions = new Set<Region>();
      const region = regionOf(lname);
      if (region) regions.add(region);
      if (FACE_MESHES.has(lname)) regions.add('face');
      if (lname === 'visor') regions.add('eyes'); // visor flares on the vision station
      if (lname === 'chest_plate') regions.add('core');
      m.userData.regions = [...regions];
      list.push(m);
      for (const r of regions) (map[r] ??= []).push(m);
    });
    meshes.current = list;
    byRegion.current = map;

    // fit into the camera's range
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const s = TARGET_HEIGHT / (size.y || 1);
    worldScale.current = s;
    group.current.scale.setScalar(s);
    baseY.current = TOP_Y - box.max.y * s;
    group.current.position.set(-center.x * s, baseY.current, -center.z * s);

    // whole-body framing reference (for the wide shot)
    group.current.updateWorldMatrix(true, true);
    const wb = new THREE.Box3().setFromObject(group.current);
    const sph = new THREE.Sphere();
    wb.getBoundingSphere(sph);
    state.bodyCenter.copy(sph.center);
    state.bodyRadius = sph.radius;
  }, [scene]);

  useFrame((_, dt) => {
    t.current += dt;

    // the robot is ALWAYS in motion (unless reduced motion)
    if (!reduce) {
      group.current.rotation.y += ROT_SPEED * dt;
      group.current.position.y = baseY.current + Math.sin(t.current * BOB_SPEED) * BOB_AMP;
    }
    // refresh child world matrices AFTER moving, so focus reads live positions
    group.current.updateWorldMatrix(true, true);

    // amber-on-steel highlight (unchanged behaviour)
    const active = stations[Math.max(0, Math.min(stations.length - 1, state.active))];
    const activeRegion = active?.region;
    const activeI = reduce ? 1.4 : 1.25 + Math.sin(t.current * 4) * 0.45;
    const k = 1 - Math.pow(0.0012, dt);
    for (const mesh of meshes.current) {
      const on = (mesh.userData.regions as Region[]).includes(activeRegion as Region);
      const base = (mesh.userData.baseEmissive as number) ?? 0;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      // emissive only — base material colours (silver / dark) stay intact
      mat.emissiveIntensity += ((on ? activeI : base) - mat.emissiveIntensity) * k;
      const next = mesh.scale.x + ((on ? 1.03 : 1) - mesh.scale.x) * k;
      mesh.scale.setScalar(next);
    }

    // LIVE focus: union the active part's GEOMETRY bounding boxes in world space.
    // (Reading node origins is wrong here — this GLB's part nodes share the root origin
    // and the geometry carries the offset, so node positions all collapse to one point.)
    const arr = byRegion.current[activeRegion as string];
    if (arr && arr.length) {
      _box.makeEmpty();
      for (const m of arr) {
        if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
        _tmpBox.copy(m.geometry.boundingBox as THREE.Box3).applyMatrix4(m.matrixWorld);
        _box.union(_tmpBox);
      }
      _box.getCenter(_c);
      _box.getBoundingSphere(_sphere);
      state.focus.lerp(_c, 0.5); // light smoothing to avoid micro-jitter
      state.radius = _sphere.radius;
    }
  });

  return <primitive ref={group} object={scene} dispose={null} />;
}

useGLTF.preload(MODEL_URL);
