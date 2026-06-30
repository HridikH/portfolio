import { Suspense, useMemo } from 'react';
import Humanoid from './Humanoid';
import Rig from './Rig';
import { prefersReducedMotion } from '../lib/webgl';

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
  const reduce = useMemo(prefersReducedMotion, []);
  return (
    <>
      <color attach="background" args={['#07080b']} />
      <fog attach="fog" args={['#07080b', 12, 28]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#4a5160', '#0c0e14', 0.8]} />
      <directionalLight position={[4, 7, 6]} intensity={1.4} color="#efe6d2" />
      <directionalLight position={[-5, 2, 2]} intensity={0.6} color="#7f879a" />
      <directionalLight position={[0, 1, 9]} intensity={0.5} color="#cdd3dd" />
      {!mobile && <Starfield count={reduce ? 60 : 220} />}
      <Suspense fallback={null}>
        <Humanoid />
        <Rig />
      </Suspense>
    </>
  );
}
