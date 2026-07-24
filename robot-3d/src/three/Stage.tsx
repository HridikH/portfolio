import * as THREE from 'three';
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { ContactShadows, MeshReflectorMaterial } from '@react-three/drei';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { palette, PaletteMode } from './materials';
import type { Tier } from './quality';

// PMREM RoomEnvironment: procedural studio HDR, no network, no cube-camera
// quirks. This is what gives the metals their reflections.
function StudioEnvironment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const rt = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = rt.texture;
    return () => {
      scene.environment = null;
      rt.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

type Props = {
  mode: PaletteMode; // 'light' (default, Apple-studio) or 'dark' (cinematic)
  tier: Tier;
};

// Procedural studio environment via Lightformers — no HDR download,
// deterministic reflections, palette-swappable.
export default function Stage({ mode, tier }: Props) {
  const light = mode === 'light';
  const bg = light ? palette.stage : palette.stageDark;

  return (
    <>
      <color attach="background" args={[bg]} />
      {light && <fog attach="fog" args={[bg, 8, 18]} />}

      <StudioEnvironment />

      {/* Key light with soft shadow */}
      <directionalLight
        position={[-2.6, 3.4, 2.8]}
        intensity={light ? 1.5 : 1.2}
        castShadow={tier !== 'low'}
        shadow-mapSize={[2048, 2048]}
        shadow-radius={6}
        shadow-bias={-0.0002}
        shadow-camera-near={0.5}
        shadow-camera-far={12}
        shadow-camera-left={-2}
        shadow-camera-right={2}
        shadow-camera-top={3}
        shadow-camera-bottom={-1}
      />
      <directionalLight position={[3, 2, -2]} intensity={light ? 0.45 : 0.7} color={light ? '#ffffff' : '#9db8ff'} />
      <ambientLight intensity={light ? 0.2 : 0.08} />

      {/* Floor */}
      {tier === 'high' ? (
        <mesh rotation-x={-Math.PI / 2} position-y={0}>
          <planeGeometry args={[24, 24]} />
          <MeshReflectorMaterial
            blur={[280, 80]}
            resolution={1024}
            mixBlur={0.9}
            mixStrength={light ? 0.55 : 1.4}
            roughness={light ? 0.85 : 0.6}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.3}
            color={light ? '#eeeef1' : '#0d0d10'}
            metalness={light ? 0.1 : 0.4}
            mirror={0.5}
          />
        </mesh>
      ) : (
        <mesh rotation-x={-Math.PI / 2} position-y={0} receiveShadow>
          <planeGeometry args={[24, 24]} />
          <meshStandardMaterial color={light ? '#ececef' : '#0d0d10'} roughness={0.95} metalness={0} />
        </mesh>
      )}

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={light ? 0.38 : 0.6}
        scale={3.5}
        blur={2.4}
        far={1.4}
        resolution={tier === 'low' ? 256 : 512}
        frames={Infinity}
      />
    </>
  );
}
