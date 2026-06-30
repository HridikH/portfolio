import { Canvas } from '@react-three/fiber';
import Experience from './Experience';

export default function Scene({ mobile }: { mobile: boolean }) {
  return (
    <Canvas
      className="scene-fixed"
      dpr={mobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
      camera={{ position: [0, 3.7, 6.2], fov: 38, near: 0.1, far: 60 }}
    >
      <Experience mobile={mobile} />
    </Canvas>
  );
}
