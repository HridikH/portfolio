// Tiny external store. The 3D scene reads `state` directly inside useFrame (no React
// re-render per frame); React UI subscribes for the active-station index only.
import { useSyncExternalStore } from 'react';
import * as THREE from 'three';

export type ScrollState = {
  /** 0..1 across the stations region — drives the HUD traverse readout + bar. */
  progress: number;
  /** index into stations[] of the currently focused station. */
  active: number;
  /** target focus amount set by scroll: 0 = wide (whole body), 1 = framed on the part. */
  zoom: number;
  /** smoothed zoom actually applied by the camera rig, surfaced to the HUD. */
  zoomDisp: number;
  /** LIVE world-space center of the active part (recomputed every frame as it orbits). */
  focus: THREE.Vector3;
  /** world bounding radius of the active part, used to compute framing distance. */
  radius: number;
  /** world center + radius of the whole body, used for the wide shot. */
  bodyCenter: THREE.Vector3;
  bodyRadius: number;
};

export const state: ScrollState = {
  progress: 0,
  active: 0,
  zoom: 0,
  zoomDisp: 0,
  focus: new THREE.Vector3(),
  radius: 1,
  bodyCenter: new THREE.Vector3(0, 0, 0),
  bodyRadius: 4,
};

let activeSnapshot = 0;
const listeners = new Set<() => void>();

export function setActive(i: number) {
  if (i === activeSnapshot) return;
  activeSnapshot = i;
  state.active = i;
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** React hook: re-renders only when the active station changes. */
export function useActiveStation() {
  return useSyncExternalStore(subscribe, () => activeSnapshot, () => activeSnapshot);
}
