// ============================================================================
// SCROLL-CINEMA ASSETS — the one file you edit as you produce clips.
// Empty clipUrl ("") is valid: the engine skips that act and falls back to the
// still, so the site builds and runs at every stage. Fill URLs in as you render.
// ============================================================================

const BASE = import.meta.env.BASE_URL;

export type ActKind =
  | 'idle' // seamless idle loop (keeps the robot alive when not scrolling)
  | 'descent' // primary spine: camera glides head -> feet
  | 'orbit' // lateral orbit ("engineered from all sides")
  | 'bridge' // erase the cut from orbit's end back to the hero
  | 'macro' // push-in to a signature detail (visor, hand joint)
  | 'macroReverse'; // engine plays `macro` in reverse for the closing pull-back

export interface Act {
  id: string;
  kind: ActKind;
  /** relative weight of this act's scroll span (normalized across all acts). */
  span: number;
  /** clip URL. "" = not yet produced -> engine falls back to `fallback`. */
  clipUrl: string;
  /** reuse another act's captured frames, reversed (free — costs no generation). */
  reverseOf?: string;
  /** still shown (and cross-faded) while this act has no captured frames. */
  fallback: string;
  /** HUD region label + editorial kicker for this act. */
  label: string;
}

// Fallback stills (the AI renders already in the repo). These carry the site
// until the clips are produced.
export const STILLS = {
  hero: `${BASE}renders/hero.jpg`,
  head: `${BASE}renders/head.jpg`,
  torso: `${BASE}renders/torso.jpg`,
  arm: `${BASE}renders/arm.jpg`,
  legs: `${BASE}renders/legs.jpg`,
} as const;

// The hero image that opens and closes the reel.
export const HERO_STILL = STILLS.hero;

// ---- CLIP URLS (fill these in as you render; CDN or /public paths both fine) ----
export const CLIPS = {
  descent: '', // 8-10s, camera glides straight down the standing robot
  orbit: '', // 5-10s, lateral orbit
  bridge: '', // 5s, orbit-end -> hero (erases the cut)
  macro: '', // 5-10s, push-in to visor then hand joint
  idle: '', // 4-6s seamless loop, subtle rotate + weight shift
} as const;

// ---- ACT TIMELINE (scroll order top -> bottom). Spans are relative. ----
// The DESCENT act is the spine; station content (src/data/stations.ts) is
// overlaid at its sub-spans as the camera travels down the body.
export const ACTS: Act[] = [
  { id: 'open', kind: 'idle', span: 0.8, clipUrl: CLIPS.idle, fallback: STILLS.hero, label: 'Standby' },
  { id: 'descent', kind: 'descent', span: 4.0, clipUrl: CLIPS.descent, fallback: STILLS.head, label: 'Teardown' },
  { id: 'orbit', kind: 'orbit', span: 1.4, clipUrl: CLIPS.orbit, fallback: STILLS.torso, label: 'All sides' },
  { id: 'bridge', kind: 'bridge', span: 0.8, clipUrl: CLIPS.bridge, fallback: STILLS.hero, label: 'Realign' },
  { id: 'macro', kind: 'macro', span: 1.2, clipUrl: CLIPS.macro, fallback: STILLS.arm, label: 'Detail' },
  { id: 'pullback', kind: 'macroReverse', span: 1.0, clipUrl: '', reverseOf: 'macro', fallback: STILLS.hero, label: 'Pull back' },
];

// Live canvas grade (always on) so the subject pops on black.
export const GRADE = { brightness: 1.13, contrast: 1.08, saturate: 1.22 } as const;
export const SCROLL_LERP = 0.09;
export const WEBP_QUALITY = 0.95;
export const MAX_BLUR = 4; // px, driven by scroll velocity
export const BREATHE = { base: 1.05, amp: 0.03 } as const;
export const IDB_STORE = 'hh-scroll';

/** device-bound capture width — never upscales past the source. */
export function captureWidth(videoWidth: number): number {
  const isMobile = typeof matchMedia !== 'undefined' && matchMedia('(max-width: 820px)').matches;
  const dpr = typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1;
  const innerW = typeof innerWidth !== 'undefined' ? innerWidth : 1280;
  const need = Math.min(3840, Math.max(isMobile ? 900 : 1920, innerW * dpr));
  const scale = Math.min(1, need / videoWidth);
  return Math.round(videoWidth * scale);
}
