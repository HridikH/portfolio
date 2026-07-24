import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import type { Region } from '../data/stations';
import { buildMaterials, palette, regionMatchers } from './materials';

const BASE = import.meta.env.BASE_URL;
const MODEL_URL = `${BASE}models/g1.glb`;
const DRACO_PATH = `${BASE}draco/`; // bundled decoder, no CDN dependency

useGLTF.preload(MODEL_URL, DRACO_PATH);

export type RobotHandle = {
  height: number;
};

type Props = {
  activeRegion: Region | null;
  idle?: boolean; // servo micro-motion + breathing
  onReady?: (info: RobotHandle) => void;
};

// Idle articulation targets (node name -> axis + amplitude rad + frequency Hz)
const IDLE_JOINTS: Array<{ node: string; axis: 'x' | 'y' | 'z'; amp: number; freq: number; phase: number }> = [
  { node: 'torso_link', axis: 'y', amp: 0.006, freq: 0.24, phase: 0.0 },   // breathing pitch
  { node: 'head_link', axis: 'z', amp: 0.012, freq: 0.11, phase: 1.7 },    // slow look-around yaw
  { node: 'head_link', axis: 'y', amp: 0.005, freq: 0.19, phase: 0.4 },
  { node: 'left_elbow_link', axis: 'y', amp: 0.008, freq: 0.16, phase: 2.9 },
  { node: 'right_elbow_link', axis: 'y', amp: 0.008, freq: 0.18, phase: 0.9 },
  { node: 'left_wrist_roll_link', axis: 'x', amp: 0.01, freq: 0.13, phase: 4.1 },
  { node: 'right_wrist_roll_link', axis: 'x', amp: 0.01, freq: 0.15, phase: 2.2 },
];

export default function RobotModel({ activeRegion, idle = true, onReady }: Props) {
  const gltf = useGLTF(MODEL_URL, DRACO_PATH);
  const group = useRef<THREE.Group>(null!);
  const mats = useMemo(buildMaterials, []);

  // Per-mesh cloned materials so region highlight can touch emissive per node.
  const meshes = useRef<Map<string, THREE.Mesh[]>>(new Map());
  const baseQuats = useRef<Map<string, THREE.Quaternion>>(new Map());
  const highlight = useRef<Map<string, number>>(new Map()); // node -> 0..1

  const scene = useMemo(() => {
    const root = gltf.scene;

    // Assign materials by URDF group + node overrides, clone per mesh.
    root.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;
      const mesh = obj as THREE.Mesh;
      const nodeName = mesh.name || mesh.parent?.name || '';
      const urdfMat = (mesh.material as THREE.Material)?.name ?? 'white';

      let src: THREE.Material;
      if (nodeName === 'head_link') src = mats.visor;
      else if (nodeName.startsWith('logo_link')) src = mats.logo;
      else if (urdfMat === 'dark') src = mats.polymer;
      else src = mats.aluminum;

      // debug: ?mat=normal | ?mat=basic | ?mat=standard isolates shading issues
      const dbg = new URLSearchParams(window.location.search).get('mat');
      if (dbg === 'normal') src = new THREE.MeshNormalMaterial();
      else if (dbg === 'basic') src = new THREE.MeshBasicMaterial({ color: '#888' });
      else if (dbg === 'standard') src = new THREE.MeshStandardMaterial({ color: '#999', roughness: 0.5, metalness: 0 });

      mesh.material = src.clone();
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const list = meshes.current.get(nodeName) ?? [];
      list.push(mesh);
      meshes.current.set(nodeName, list);
    });

    // LED strip on the face, parented to the head so idle motion carries it.
    const head = root.getObjectByName('head_link');
    if (head) {
      const headMesh = head as THREE.Mesh;
      const bbox = new THREE.Box3().setFromObject(headMesh);
      // compute in head-local space
      const local = new THREE.Box3();
      headMesh.updateWorldMatrix(true, false);
      const inv = headMesh.matrixWorld.clone().invert();
      local.copy(bbox).applyMatrix4(inv);
      const size = new THREE.Vector3();
      local.getSize(size);
      const center = new THREE.Vector3();
      local.getCenter(center);

      // URDF head local frame: +X forward, +Y left, +Z up
      const geo = new THREE.BoxGeometry(0.006, size.y * 0.42, size.z * 0.055);
      const ledMesh = new THREE.Mesh(geo, mats.led);
      ledMesh.name = 'face_led';
      ledMesh.position.set(local.max.x - 0.004, center.y, center.z + size.z * 0.14);
      head.add(ledMesh);
      meshes.current.set('face_led', [ledMesh]);
    }

    // Save base orientations for idle articulation.
    for (const j of IDLE_JOINTS) {
      const node = root.getObjectByName(j.node);
      if (node && !baseQuats.current.has(j.node)) {
        baseQuats.current.set(j.node, node.quaternion.clone());
      }
    }

    // Feet on the floor.
    const bbox = new THREE.Box3().setFromObject(root);
    root.position.y -= bbox.min.y;
    const height = bbox.max.y - bbox.min.y;
    onReady?.({ height });

    return root;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gltf]);

  // Region highlight + idle motion.
  const accent = useMemo(() => new THREE.Color(palette.accent), []);
  const euler = useMemo(() => new THREE.Euler(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);

  useEffect(() => {
    // reset highlight targets when region changes
  }, [activeRegion]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const match = activeRegion ? regionMatchers[activeRegion] : null;
    const pulse = 0.75 + 0.25 * Math.sin(t * 2.4);

    meshes.current.forEach((list, nodeName) => {
      const target = match && match(nodeName) ? 1 : 0;
      const cur = highlight.current.get(nodeName) ?? 0;
      const next = THREE.MathUtils.damp(cur, target, 6, delta);
      highlight.current.set(nodeName, next);
      if (next < 0.005 && target === 0) return;

      for (const mesh of list) {
        const m = mesh.material as THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial;
        if (m.name === 'led') {
          (m as THREE.MeshStandardMaterial).emissiveIntensity = 4.0 + next * pulse * 5.0;
          continue;
        }
        m.emissive ??= new THREE.Color(0, 0, 0);
        m.emissive.copy(accent).multiplyScalar(next * pulse * 0.55);
      }
    });

    // Idle servo micro-motion
    if (idle) {
      for (const j of IDLE_JOINTS) {
        const node = scene.getObjectByName(j.node);
        const base = baseQuats.current.get(j.node);
        if (!node || !base) continue;
        const a = j.amp * Math.sin(t * Math.PI * 2 * j.freq + j.phase);
        euler.set(j.axis === 'x' ? a : 0, j.axis === 'y' ? a : 0, j.axis === 'z' ? a : 0);
        q.setFromEuler(euler);
        node.quaternion.copy(base).multiply(q);
      }
      // barely-there body bob
      if (group.current) group.current.position.y = 0.0015 * Math.sin(t * Math.PI * 2 * 0.24);
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}
