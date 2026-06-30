// Tiny external store. The 3D scene reads `state` directly inside useFrame (no React
// re-render per frame); React UI subscribes for the active-station index only.
import { useSyncExternalStore } from 'react';

export type ScrollState = {
  /** 0 = top of head, 1 = feet. Smoothed traverse of the whole body. */
  progress: number;
  /** where progress is easing toward (the active station's body position). */
  target: number;
  /** index into stations[] of the currently focused station. */
  active: number;
  /** camera depth in world units, surfaced to the HUD. */
  depth: number;
};

export const state: ScrollState = { progress: 0, target: 0, active: 0, depth: 0 };

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
