import { Suspense, useMemo } from 'react';
import { Environment, Lightformer, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
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
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 7, 6]} intensity={1.1} color="#efe6d2" />
      <directionalLight position={[-5, 2, 2]} intensity={0.5} color="#7f879a" />

      {/* procedural environment for real metal reflections — no HDR download */}
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 4, 4]} scale={[8, 5, 1]} color="#dfe6f2" />
        <Lightformer intensity={1.5} position={[5, 1, 2]} scale={[3, 6, 1]} color="#4f7bff" />
        <Lightformer intensity={1.3} position={[-5, 1, 2]} scale={[3, 6, 1]} color="#a855f7" />
        <Lightformer intensity={1.6} position={[0, 2, -6]} scale={[10, 6, 1]} color="#2a3350" />
      </Environment>

      {!mobile && <Starfield count={reduce ? 60 : 220} />}

      <Suspense fallback={null}>
        <Humanoid />
        <Rig />
      </Suspense>

      <ContactShadows
        position={[0, -3.95, 0]}
        scale={14}
        opacity={0.55}
        blur={2.6}
        far={6}
        color="#000000"
        frames={reduce ? 1 : Infinity}
      />

      {!mobile && !reduce && (
        <EffectComposer>
          <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.7} luminanceSmoothing={0.2} radius={0.7} />
        </EffectComposer>
      )}
    </>
  );
}
