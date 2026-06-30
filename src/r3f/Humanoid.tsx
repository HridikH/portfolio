import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { stations, type Region } from '../data/stations';
import { state } from '../store';
import { prefersReducedMotion } from '../lib/webgl';

const MODEL_URL = `${import.meta.env.BASE_URL}models/robot.glb`;

// Map the GLB node names -> body regions used by the stations.
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

// 'face' (Grogu) has no dedicated mesh, so it borrows the head + eyes.
const FACE_MESHES = new Set(['head', 'eye_l', 'eye_r']);

const STEEL = new THREE.Color('#6c7480');
const AMBER = new THREE.Color('#e8a33d');

// Fit the model into the camera's y-range (head ~+3.7, feet ~-3.9).
const TOP_Y = 3.7;
const TARGET_HEIGHT = 7.6;

export default function Humanoid() {
  const group = useRef<THREE.Group>(null!);
  const meshes = useRef<THREE.Mesh[]>([]);
  const reduce = useMemo(prefersReducedMotion, []);
  const { scene } = useGLTF(MODEL_URL);

  useLayoutEffect(() => {
    const list: THREE.Mesh[] = [];
    // tag + restyle every mesh, and remember which region(s) it belongs to
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const region = regionOf(m.name);
      const mat = new THREE.MeshStandardMaterial({
        color: STEEL.clone(),
        emissive: AMBER.clone(),
        emissiveIntensity: 0,
        metalness: 0.25,
        roughness: 0.62,
      });
      m.material = mat;
      m.castShadow = m.receiveShadow = true;
      const regions = new Set<Region>();
      if (region) regions.add(region);
      if (FACE_MESHES.has(m.name.toLowerCase())) regions.add('face');
      m.userData.regions = [...regions];
      list.push(m);
    });
    meshes.current = list;

    // normalize scale + position so the figure spans the camera's traverse range
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const s = TARGET_HEIGHT / (size.y || 1);
    group.current.scale.setScalar(s);
    group.current.position.set(-center.x * s, TOP_Y - box.max.y * s, -center.z * s);
  }, [scene]);

  useFrame((_, dt) => {
    const active = stations[Math.max(0, Math.min(stations.length - 1, state.active))];
    const activeRegion = active?.region;
    const pulse = reduce ? 0.95 : 0.8 + Math.sin(performance.now() * 0.004) * 0.2;
    const k = 1 - Math.pow(0.0012, dt);

    for (const mesh of meshes.current) {
      const on = (mesh.userData.regions as Region[]).includes(activeRegion as Region);
      const targetI = on ? pulse : 0;
      const targetScale = on ? 1.04 : 1;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity += (targetI - mat.emissiveIntensity) * k;
      mat.color.lerp(on ? AMBER : STEEL, k * 0.35);
      const next = mesh.scale.x + (targetScale - mesh.scale.x) * k;
      mesh.scale.setScalar(next);
    }
  });

  return <primitive ref={group} object={scene} dispose={null} />;
}

useGLTF.preload(MODEL_URL);
