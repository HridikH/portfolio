// Device-tiered quality. Decided once at startup.
// high: N8AO + bloom + DoF + reflective floor
// med:  N8AO (half res) + bloom, plain floor
// low:  no postprocessing, contact shadows only, capped DPR

export type Tier = 'high' | 'med' | 'low';

export function detectTier(): Tier {
  if (typeof window === 'undefined') return 'med';
  const ua = navigator.userAgent;
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as any).deviceMemory as number | undefined;
  if (isMobile || cores <= 4 || (mem !== undefined && mem <= 4)) return 'low';
  if (cores <= 8) return 'med';
  return 'high';
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
