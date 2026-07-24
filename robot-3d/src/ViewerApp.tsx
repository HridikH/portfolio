// Minimal realism-check viewer. Orbit the assembled G1, toggle palette,
// cycle region highlights. The site proper lives at index.html.
import { Suspense, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RobotModel from './three/RobotModel';
import Stage from './three/Stage';
import Effects from './three/Effects';
import { detectTier } from './three/quality';
import type { PaletteMode } from './three/materials';
import type { Region } from './data/stations';

const REGIONS: (Region | null)[] = [null, 'brain', 'eyes', 'face', 'jaw', 'spine', 'arms', 'core', 'legs'];

export default function ViewerApp() {
  const tier = useMemo(detectTier, []);
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const [mode, setMode] = useState<PaletteMode>(params.get('palette') === 'dark' ? 'dark' : 'light');
  const initialRegion = REGIONS.indexOf((params.get('region') as Region) ?? null);
  const [regionIdx, setRegionIdx] = useState(initialRegion >= 0 ? initialRegion : 0);
  const region = REGIONS[regionIdx];

  return (
    <div className="viewer-root" data-mode={mode}>
      <Canvas
        shadows
        dpr={tier === 'low' ? [1, 1.5] : [1, 2]}
        camera={{ position: [0.9, 1.1, 2.4], fov: 35, near: 0.05, far: 50 }}
        gl={{ antialias: tier === 'low', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
      >
        <Suspense fallback={null}>
          <Stage mode={mode} tier={tier} />
          <RobotModel activeRegion={region} idle />
          <Effects tier={tier} />
        </Suspense>
        <OrbitControls
          makeDefault
          target={[0, 0.75, 0]}
          minDistance={0.4}
          maxDistance={6}
          maxPolarAngle={Math.PI / 2 + 0.05}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>

      <div className="viewer-hud">
        <div className="viewer-title">UNITREE G1 — ASSEMBLY CHECK</div>
        <div className="viewer-controls">
          <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
            palette: {mode}
          </button>
          <button onClick={() => setRegionIdx((regionIdx + 1) % REGIONS.length)}>
            region: {region ?? 'none'}
          </button>
        </div>
        <div className="viewer-hint">drag to orbit · scroll to zoom · tier: {tier}</div>
      </div>
    </div>
  );
}
