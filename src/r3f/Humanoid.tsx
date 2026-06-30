import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { stations, type Region } from '../data/stations';
import { state } from '../store';
import { prefersReducedMotion } from '../lib/webgl';

/**
 * Placeholder humanoid built from primitives. Every region is an addressable mesh
 * (tagged via userData.region) so it can be highlighted, dimmed, and focused.
 *
 * >>> SWAP POINT <<<
 * When the CC0 GLB lands in /public/models, replace the JSX below with a
 * useGLTF('models/robot.glb') component and tag its child meshes with the same
 * `region` keys (brain | eyes | face | jaw | spine | arms | core | legs).
 * The highlight loop in useFrame already keys off userData.region, so nothing
 * else needs to change.
 */

type Seg = {
  geo: 'box' | 'cyl' | 'ico';
  args: number[];
  pos: [number, number, number];
  rot?: [number, number, number];
  region: Region;
};

const STEEL = new THREE.Color('#2b2f37');
const AMBER = new THREE.Color('#e8a33d');

export default function Humanoid() {
  const group = useRef<THREE.Group>(null!);
  const byRegion = useRef<Record<string, THREE.Mesh[]>>({});
  const reduce = useMemo(prefersReducedMotion, []);

  // Stylized segmented figure. y: +head .. -feet.
  const segs: Seg[] = useMemo(
    () => [
      // head + face cluster
      { geo: 'ico', args: [0.62, 1], pos: [0, 3.25, 0], region: 'brain' },
      { geo: 'box', args: [0.86, 0.5, 0.18], pos: [0, 3.15, 0.5], region: 'face' },
      { geo: 'ico', args: [0.1, 0], pos: [0.22, 3.22, 0.62], region: 'eyes' },
      { geo: 'ico', args: [0.1, 0], pos: [-0.22, 3.22, 0.62], region: 'eyes' },
      { geo: 'box', args: [0.5, 0.22, 0.4], pos: [0, 2.78, 0.18], region: 'jaw' },
      // neck + spine
      { geo: 'cyl', args: [0.16, 0.16, 0.3, 12], pos: [0, 2.55, 0], region: 'spine' },
      { geo: 'box', args: [0.22, 2.0, 0.22], pos: [0, 1.5, -0.22], region: 'spine' },
      // torso / core
      { geo: 'box', args: [1.25, 1.6, 0.66], pos: [0, 1.55, 0], region: 'core' },
      { geo: 'box', args: [1.0, 0.7, 0.6], pos: [0, 0.35, 0], region: 'core' },
      // arms + hands (left)
      { geo: 'cyl', args: [0.18, 0.18, 1.3, 12], pos: [-0.95, 1.7, 0], rot: [0, 0, 0.12], region: 'arms' },
      { geo: 'cyl', args: [0.15, 0.15, 1.2, 12], pos: [-1.12, 0.55, 0], region: 'arms' },
      { geo: 'box', args: [0.26, 0.3, 0.16], pos: [-1.18, -0.2, 0], region: 'arms' },
      // arms + hands (right)
      { geo: 'cyl', args: [0.18, 0.18, 1.3, 12], pos: [0.95, 1.7, 0], rot: [0, 0, -0.12], region: 'arms' },
      { geo: 'cyl', args: [0.15, 0.15, 1.2, 12], pos: [1.12, 0.55, 0], region: 'arms' },
      { geo: 'box', args: [0.26, 0.3, 0.16], pos: [1.18, -0.2, 0], region: 'arms' },
      // legs + feet (left)
      { geo: 'cyl', args: [0.22, 0.2, 1.5, 12], pos: [-0.4, -0.9, 0], region: 'legs' },
      { geo: 'cyl', args: [0.18, 0.16, 1.4, 12], pos: [-0.4, -2.4, 0], region: 'legs' },
      { geo: 'box', args: [0.34, 0.18, 0.62], pos: [-0.4, -3.25, 0.16], region: 'legs' },
      // legs + feet (right)
      { geo: 'cyl', args: [0.22, 0.2, 1.5, 12], pos: [0.4, -0.9, 0], region: 'legs' },
      { geo: 'cyl', args: [0.18, 0.16, 1.4, 12], pos: [0.4, -2.4, 0], region: 'legs' },
      { geo: 'box', args: [0.34, 0.18, 0.62], pos: [0.4, -3.25, 0.16], region: 'legs' },
    ],
    [],
  );

  useLayoutEffect(() => {
    const map: Record<string, THREE.Mesh[]> = {};
    group.current.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.userData.region) {
        (map[m.userData.region] ??= []).push(m);
      }
    });
    byRegion.current = map;
  }, []);

  useFrame((_, dt) => {
    const active = stations[Math.max(0, Math.min(stations.length - 1, state.active))];
    const activeRegion = active?.region;
    const pulse = reduce ? 0.9 : 0.78 + Math.sin(performance.now() * 0.004) * 0.22;
    const k = 1 - Math.pow(0.001, dt); // frame-rate independent lerp

    for (const region in byRegion.current) {
      const on = region === activeRegion;
      const targetI = on ? pulse : 0.0;
      const targetScale = on ? 1.06 : 1.0;
      for (const mesh of byRegion.current[region]) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity += (targetI - mat.emissiveIntensity) * k;
        mat.color.lerp(on ? AMBER : STEEL, k * 0.4);
        const s = mesh.scale.x + (targetScale - mesh.scale.x) * k;
        mesh.scale.setScalar(s);
      }
    }
  });

  return (
    <group ref={group} name="humanoid">
      {segs.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot} userData={{ region: s.region }} castShadow>
          {s.geo === 'box' && <boxGeometry args={s.args as [number, number, number]} />}
          {s.geo === 'cyl' && (
            <cylinderGeometry args={s.args as [number, number, number, number]} />
          )}
          {s.geo === 'ico' && <icosahedronGeometry args={s.args as [number, number]} />}
          <meshStandardMaterial
            color={STEEL.clone()}
            emissive={AMBER.clone()}
            emissiveIntensity={0}
            metalness={0.35}
            roughness={0.55}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}
