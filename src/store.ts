// Tiny external store. The scroll-cinema canvas reads `state` directly inside its
// rAF loop (no React re-render per frame); the React UI subscribes only for the
// active-station index, so the HUD updates without re-rendering on every scroll tick.
import { useSyncExternalStore } from 'react';

export type ScrollState = {
  /** 0..1 across the stations region — drives the HUD traverse readout + bar. */
  progress: number;
  /** index into stations[] of the currently focused station. */
  active: number;
  /** target focus amount set by scroll: 0 = wide (whole body), 1 = framed on the part. */
  zoom: number;
  /** smoothed focus actually surfaced to the HUD. */
  zoomDisp: number;
  /** which part of the page we're in — selects hero vs per-station imagery. */
  phase: 'hero' | 'stations' | 'end';
};

export const state: ScrollState = {
  progress: 0,
  active: 0,
  zoom: 0,
  zoomDisp: 0,
  phase: 'hero',
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
