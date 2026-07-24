// Scroll-driven camera dolly down the body.
// ONE smoothing layer: native scroll position -> MathUtils.damp on the rig.
// ~100ms response, no Lenis, no stacked smoothers.
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { stations } from '../data/stations';

export const ROBOT_HEIGHT = 1.32; // meters, G1 actual

export type Keyframe = {
  targetY: number; // world y the camera looks at
  dist: number;
  azimuth: number; // radians, 0 = front (+Z)
  height: number; // camera y offset relative to targetY
};

// Section list: hero, 8 stations, off-clock, contact.
// Camera order down the body: head+torso -> hands -> legs -> pull back out.
export function buildKeyframes(): Keyframe[] {
  const y = (bodyY: number) => ROBOT_HEIGHT * (1 - bodyY);
  const frames: Keyframe[] = [];

  // hero: full body, three-quarter (keeps the chest logo off the focal point)
  frames.push({ targetY: 0.78, dist: 3.1, azimuth: 0.38, height: 0.25 });

  for (const s of stations) {
    const side = s.side === 'left' ? 1 : -1; // camera favors the free side
    switch (s.region) {
      case 'brain':
        frames.push({ targetY: y(s.bodyY), dist: 0.55, azimuth: side * 0.5, height: 0.1 });
        break;
      case 'eyes':
        frames.push({ targetY: y(s.bodyY), dist: 0.45, azimuth: side * 0.25, height: 0.02 });
        break;
      case 'face':
        frames.push({ targetY: y(s.bodyY), dist: 0.5, azimuth: side * 0.55, height: 0.0 });
        break;
      case 'jaw':
        frames.push({ targetY: y(s.bodyY), dist: 0.55, azimuth: side * 0.35, height: -0.06 });
        break;
      case 'spine':
        frames.push({ targetY: y(s.bodyY), dist: 0.85, azimuth: side * 0.9, height: 0.05 });
        break;
      case 'arms': // the hands beat: frame forearms + fingers
        frames.push({ targetY: 0.62, dist: 0.55, azimuth: side * 0.75, height: -0.05 });
        break;
      case 'core':
        frames.push({ targetY: y(s.bodyY), dist: 0.8, azimuth: side * 0.5, height: 0.0 });
        break;
      case 'legs':
        frames.push({ targetY: y(s.bodyY), dist: 1.05, azimuth: side * 0.6, height: 0.12 });
        break;
    }
  }

  // record sections (experience / teaching+research / leadership+education):
  // slow orbit around the full body while the dossier cards scroll
  frames.push({ targetY: 0.8, dist: 2.6, azimuth: 0.7, height: 0.25 });
  frames.push({ targetY: 0.8, dist: 2.8, azimuth: -0.55, height: 0.3 });
  frames.push({ targetY: 0.78, dist: 2.6, azimuth: 0.9, height: 0.2 });

  // off the clock: drift out, three-quarter
  frames.push({ targetY: 0.85, dist: 2.3, azimuth: -0.7, height: 0.3 });
  // contact: full body, front, pulled back
  frames.push({ targetY: 0.72, dist: 3.4, azimuth: 0.05, height: 0.35 });

  return frames;
}

const smootherstep = (x: number) => {
  const t = THREE.MathUtils.clamp(x, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

type Props = {
  progress: React.MutableRefObject<number>; // 0..1 scroll progress (raw, undamped)
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  parallax: boolean;
  frozen?: boolean; // reduced motion: park on hero frame
  onFocusChange?: (target: THREE.Vector3, dist: number) => void;
};

export default function CameraRig({ progress, mouse, parallax, frozen, onFocusChange }: Props) {
  const { camera } = useThree();
  const frames = useMemo(buildKeyframes, []);
  const cur = useRef({ targetY: frames[0].targetY, dist: frames[0].dist, azimuth: frames[0].azimuth, height: frames[0].height });
  const look = useMemo(() => new THREE.Vector3(), []);
  const par = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const n = frames.length - 1;
    const p = frozen ? 0 : THREE.MathUtils.clamp(progress.current, 0, 1) * n;
    const i = Math.min(Math.floor(p), n - 1);
    const f = smootherstep(p - i);
    const a = frames[i];
    const b = frames[Math.min(i + 1, n)];

    const goal = {
      targetY: THREE.MathUtils.lerp(a.targetY, b.targetY, f),
      dist: THREE.MathUtils.lerp(a.dist, b.dist, f),
      azimuth: THREE.MathUtils.lerp(a.azimuth, b.azimuth, f),
      height: THREE.MathUtils.lerp(a.height, b.height, f),
    };

    // single damping layer, ~100ms time constant
    const L = 10;
    cur.current.targetY = THREE.MathUtils.damp(cur.current.targetY, goal.targetY, L, delta);
    cur.current.dist = THREE.MathUtils.damp(cur.current.dist, goal.dist, L, delta);
    cur.current.azimuth = THREE.MathUtils.damp(cur.current.azimuth, goal.azimuth, L, delta);
    cur.current.height = THREE.MathUtils.damp(cur.current.height, goal.height, L, delta);

    // mouse parallax, damped, desktop only
    const px = parallax ? mouse.current.x : 0;
    const py = parallax ? mouse.current.y : 0;
    par.current.x = THREE.MathUtils.damp(par.current.x, px, 8, delta);
    par.current.y = THREE.MathUtils.damp(par.current.y, py, 8, delta);

    const { targetY, dist, azimuth, height } = cur.current;
    const az = azimuth + par.current.x * 0.06;
    camera.position.set(
      Math.sin(az) * dist,
      targetY + height + par.current.y * 0.04,
      Math.cos(az) * dist,
    );
    look.set(0, targetY, 0);
    camera.lookAt(look);

    onFocusChange?.(look, dist);
  });

  return null;
}
