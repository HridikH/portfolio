import { Suspense, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Humanoid from './Humanoid';
import { stations } from '../data/stations';
import { state } from '../store';
import { prefersReducedMotion } from '../lib/webgl';

const HEAD_Y = 3.7;
const FEET_Y = -3.9;
const CAM_Z = 9.6;

function focusY(progress: number) {
  return HEAD_Y - progress * (HEAD_Y - FEET_Y);
}

function Starfield({ count }: { count: number }) {
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 26;
      a[i * 3 + 1] = (Math.random() - 0.5) * 26;
      a[i * 3 + 2] = (Math.random() - 0.5) * 18 - 6;
    }
    return a;
  }, [count]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#5b606b" sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}

export default function Experience({ mobile }: { mobile: boolean }) {
  const { camera } = useThree();
  const amber = useRef<THREE.PointLight>(null!);
  const reduce = useMemo(prefersReducedMotion, []);

  useFrame((rs, dt) => {
    // ease progress toward the active station's body position
    const k = 1 - Math.pow(0.0009, dt);
    state.progress += (state.target - state.progress) * k;
    state.depth = state.progress;

    const fy = focusY(state.progress);
    const px = reduce ? 0 : rs.pointer.x;
    const py = reduce ? 0 : rs.pointer.y;

    camera.position.x += (px * 1.1 - camera.position.x) * 0.06;
    camera.position.y += (fy + py * 0.5 - camera.position.y) * 0.1;
    camera.position.z += (CAM_Z - camera.position.z) * 0.1;
    camera.lookAt(0, fy, 0);

    if (amber.current) {
      const active = stations[Math.max(0, Math.min(stations.length - 1, state.active))];
      amber.current.position.set(0, focusY(active ? active.bodyY : state.progress), 2.4);
      amber.current.intensity += (9 - amber.current.intensity) * 0.05;
    }
  });

  return (
    <>
      <color attach="background" args={['#07080b']} />
      <fog attach="fog" args={['#07080b', 11, 24]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#4a5160', '#0c0e14', 0.8]} />
      <directionalLight position={[4, 7, 6]} intensity={1.4} color="#efe6d2" />
      <directionalLight position={[-5, 2, 2]} intensity={0.6} color="#7f879a" />
      <directionalLight position={[0, 1, 9]} intensity={0.5} color="#cdd3dd" />
      <pointLight ref={amber} color="#e8a33d" intensity={0} distance={11} decay={1.3} />
      {!mobile && <Starfield count={reduce ? 60 : 220} />}
      <Suspense fallback={null}>
        <Humanoid />
      </Suspense>
    </>
  );
}
