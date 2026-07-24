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
  /** window of the clip's frames this act plays, as [in, out] fractions (0-1).
   *  Lets one clip serve multiple acts (descent = upper + lower body) and lets
   *  an act skip its hero-wide opening so seams hand off part-to-part.
   *  For reverseOf acts the window applies to the REVERSED timeline.
   *  Default [0, 1]. (Replaces the old trimIn.) */
  win?: [number, number];
  /** HUD region label + editorial kicker for this act. */
  label: string;
}

// Fallback stills. APPLE LIGHT THEME (2026-07-02): the hero is the Apple-style
// Higgsfield render (nano_banana_pro 2K, white studio). The old dark region
// renders (public/renders/*.jpg) would flash a black frame on the white stage,
// so ALL region fallbacks point at the hero until light region stills exist.
export const STILLS = {
  hero: 'https://d8j0ntlcm91z4.cloudfront.net/user_3FuSeYO5zpBMAPRXca3TEu5cb04/hf_20260702_010047_ff13ae34-2fd5-40e9-9206-9d32d86ef319.png',
  head: 'https://d8j0ntlcm91z4.cloudfront.net/user_3FuSeYO5zpBMAPRXca3TEu5cb04/hf_20260702_010047_ff13ae34-2fd5-40e9-9206-9d32d86ef319.png',
  torso: 'https://d8j0ntlcm91z4.cloudfront.net/user_3FuSeYO5zpBMAPRXca3TEu5cb04/hf_20260702_010047_ff13ae34-2fd5-40e9-9206-9d32d86ef319.png',
  arm: 'https://d8j0ntlcm91z4.cloudfront.net/user_3FuSeYO5zpBMAPRXca3TEu5cb04/hf_20260702_010047_ff13ae34-2fd5-40e9-9206-9d32d86ef319.png',
  legs: 'https://d8j0ntlcm91z4.cloudfront.net/user_3FuSeYO5zpBMAPRXca3TEu5cb04/hf_20260702_010047_ff13ae34-2fd5-40e9-9206-9d32d86ef319.png',
} as const;

// The hero image that opens and closes the reel.
export const HERO_STILL = STILLS.hero;

// ---- CLIP URLS (APPLE LIGHT reel, seeded from the Apple hero; CDN) ----
// Full Apple-style re-seed 2026-07-02: kling3_0_turbo @ 1080p native, then ALL
// FOUR Topaz-upscaled to 3840×2160 the same day. Previous reels remain on the
// CDN if a rollback is needed: dark hyperreal 1080p (hf_20260701_21xxxx_*),
// dark 720p originals (hf_20260701_2037xx_*).
export const CLIPS = {
  descent: 'https://d8j0ntlcm91z4.cloudfront.net/user_3FuSeYO5zpBMAPRXca3TEu5cb04/hf_20260702_012106_523991b9-ce86-4d8a-8514-a2164295a07d.mp4', // 10s, camera glides straight down (Apple, Topaz 2160p)
  orbit: 'https://d8j0ntlcm91z4.cloudfront.net/user_3FuSeYO5zpBMAPRXca3TEu5cb04/hf_20260702_012116_162b3463-0e4a-42db-b49d-efbf5c74af48.mp4', // 8s, arm zoom-in (Apple, Topaz 2160p)
  bridge: '', // orbit-end -> hero (needs orbit's last frame; falls back for now)
  macro: 'https://d8j0ntlcm91z4.cloudfront.net/user_3FuSeYO5zpBMAPRXca3TEu5cb04/hf_20260702_012403_453798e4-ae14-48f7-8f3d-e5961a500dee.mp4', // 8s push-in to visor then hand joint (Apple, Topaz 2160p)
  idle: 'https://d8j0ntlcm91z4.cloudfront.net/user_3FuSeYO5zpBMAPRXca3TEu5cb04/hf_20260702_012223_e18aba21-f495-46a7-b940-51c6400967f3.mp4', // 5s seamless idle loop (Apple, Topaz 2160p)
} as const;

// ---- ACT TIMELINE (scroll order top -> bottom). Spans are relative. ----
// The DESCENT act is the spine; station content (src/data/stations.ts) is
// overlaid at its sub-spans as the camera travels down the body.
// BODY ORDER (2026-07-02, user request): head+torso → hand → legs. The descent
// clip already travels head→feet, so it is SPLIT via `win` into an upper-body
// act and a lower-body act, with the hand material between them. macro sits
// right after the upper body because its move (visor → hand) is the natural
// bridge from head to hand. The close is the descent REVERSED: it enters on the
// exact frame the legs act ends on (a match cut) and glides back up to the
// hero wide. 'bridge' act removed earlier; hero appears only at open and close.
// win in-points on macro/orbit skip their hero-wide openings.
export const ACTS: Act[] = [
  { id: 'open', kind: 'idle', span: 0.8, clipUrl: CLIPS.idle, fallback: STILLS.hero, label: 'Standby' },
  { id: 'upper', kind: 'descent', span: 2.2, clipUrl: CLIPS.descent, fallback: STILLS.head, label: 'Teardown', win: [0, 0.55] },
  { id: 'macro', kind: 'macro', span: 1.2, clipUrl: CLIPS.macro, fallback: STILLS.head, label: 'Detail', win: [0.22, 1] },
  { id: 'orbit', kind: 'orbit', span: 1.2, clipUrl: CLIPS.orbit, fallback: STILLS.arm, label: 'Manipulators', win: [0.3, 1] },
  { id: 'lower', kind: 'descent', span: 1.8, clipUrl: CLIPS.descent, fallback: STILLS.legs, label: 'Locomotion', win: [0.55, 1] },
  { id: 'pullback', kind: 'macroReverse', span: 1.0, clipUrl: '', reverseOf: 'lower', fallback: STILLS.hero, label: 'Pull back' },
];

// Live canvas grade. Apple light theme: near-neutral — the old dark-stage pump
// (1.13/1.08/1.22) blows out a white studio background.
export const GRADE = { brightness: 1.0, contrast: 1.02, saturate: 1.05 } as const;
// Lenis already smooths the scroll; this second lerp only exists to soften
// frame quantization. Two heavy smoothers in series added ~300ms of input
// latency ("looks laggy"), so this one is now LIGHT. Lower it only if you
// also stiffen/disable Lenis.
export const SCROLL_LERP = 0.3;
// Fraction of each act's span used as an OVERLAP dissolve at its end: the
// incoming act's motion timeline starts here (already playing, entry offset by
// its trimIn) and fades in over the zone while the outgoing act keeps moving —
// both layers of the dissolve are live footage, never a frozen frame. Driven
// purely by scroll position: no rewind, no timers, symmetric when scrubbing up.
// (Replaced ACT_TAIL: rewinding the whole clip through a 16% tail meant ~5x-speed
// backward playback with a direction snap at the kink — visibly jerky.)
export const ACT_BLEND = 0.15;
export const WEBP_QUALITY = 0.95;
// Velocity blur DISABLED (was 4): a per-frame CSS blur over a Retina-size
// canvas is expensive on the GPU and smears the image while scrolling — both
// read as lag. Two-frame blending now covers motion smoothness. Set >0 to re-enable.
export const MAX_BLUR = 0; // px, driven by scroll velocity
export const BREATHE = { base: 1.05, amp: 0.03 } as const;
export const IDB_STORE = 'hh-scroll';

/** device-bound capture width — never upscales past the source.
 *  Hard cap 2560 (was 3840): clips are 2160p now, and capturing/decoding
 *  full-4K WebP frames costs ~2.3x more memory + decode time than 2560 for a
 *  sharpness gain that isn't visible through the scroll motion. */
export function captureWidth(videoWidth: number): number {
  const isMobile = typeof matchMedia !== 'undefined' && matchMedia('(max-width: 820px)').matches;
  const dpr = typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1;
  const innerW = typeof innerWidth !== 'undefined' ? innerWidth : 1280;
  const need = Math.min(2560, Math.max(isMobile ? 900 : 1920, innerW * dpr));
  const scale = Math.min(1, need / videoWidth);
  return Math.round(videoWidth * scale);
}
