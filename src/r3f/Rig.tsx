import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { state } from '../store';
import { prefersReducedMotion } from '../lib/webgl';

// Focus-pull camera. It never dollies on a baked path: every frame it reads the active
// part's LIVE world center (state.focus) and frames it, so the part stays centered while
// the body keeps rotating behind it. Zoom (0 wide .. 1 framed) comes from scroll.
const FILL = 0.55; // active part fills ~55-65% of frame height when framed
const WIDE_FILL = 0.85; // whole body fills ~85% when wide

const _target = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _pos = new THREE.Vector3();

export default function Rig() {
  const { camera } = useThree();
  const reduce = useMemo(prefersReducedMotion, []);
  const amber = useRef<THREE.PointLight>(null!);

  useFrame((rs, dt) => {
    const cam = camera as THREE.PerspectiveCamera;
    const tan = Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2);

    // smooth the scroll-driven zoom -> this produces the "breath" between stations
    const targetZoom = reduce ? 0 : state.zoom;
    const zk = 1 - Math.pow(0.0009, dt);
    state.zoomDisp += (targetZoom - state.zoomDisp) * zk;
    const zoom = state.zoomDisp;

    // framing distance from the part's bounding radius; wide distance from the body.
    // floor the radius so tiny parts (eyes, mouth) keep some surrounding context
    // instead of becoming abstract macro blobs.
    const r = Math.max(state.radius, 1.0);
    const framed = r / tan / FILL;
    const wide = state.bodyRadius / tan / WIDE_FILL;
    const dist = THREE.MathUtils.lerp(wide, framed, zoom);

    // target eases from body center (wide) to the live part center (framed)
    _target.copy(state.bodyCenter).lerp(state.focus, zoom);

    // viewing direction: mostly front (+Z), slightly above, with mouse parallax as a
    // small orbit offset layered on top of the tracked framing
    const px = reduce ? 0 : rs.pointer.x;
    const py = reduce ? 0 : rs.pointer.y;
    _dir.set(px * 0.5, 0.12 + py * 0.3, 1).normalize();
    _pos.copy(_target).addScaledVector(_dir, dist);

    const posK = 1 - Math.pow(0.0016, dt);
    camera.position.lerp(_pos, posK);
    camera.lookAt(_target); // instant — keeps the moving part centered every frame

    if (amber.current) {
      amber.current.position.copy(state.focus);
      const want = 6 + zoom * 8;
      amber.current.intensity += (want - amber.current.intensity) * 0.06;
    }
  });

  return <pointLight ref={amber} color="#e8a33d" intensity={0} distance={14} decay={1.2} />;
}
