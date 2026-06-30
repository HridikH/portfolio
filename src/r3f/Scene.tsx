import { Canvas } from '@react-three/fiber';
import Experience from './Experience';

// The fixed full-viewport sizing lives on the wrapper div; the Canvas just fills it
// (R3F sets the canvas to 100% x 100% of its parent). Styling the Canvas directly does
// not work because R3F writes an inline position:relative that a class can't override.
export default function Scene({ mobile }: { mobile: boolean }) {
  return (
    <div className="scene-fixed">
      <Canvas
        dpr={mobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
        camera={{ position: [0, 3.7, 9.6], fov: 38, near: 0.1, far: 60 }}
      >
        <Experience mobile={mobile} />
      </Canvas>
    </div>
  );
}
