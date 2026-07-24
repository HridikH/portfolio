// The scrubber: paints frames (or fallback stills) to a canvas in lock-step with
// scroll. Decode-free during scroll — it only picks an index and drawImage's.
//
// Perf: the constant grade + velocity blur are a GPU-composited CSS `filter` on the
// canvas ELEMENT (set once per frame via style, not recomputed per pixel by the 2D
// context), and the darkening overlays live in static DOM (see Cinema.tsx +
// global.css). So the per-frame 2D work is just clearRect + one drawImage. That's
// what keeps scrolling smooth.
import { GRADE, SCROLL_LERP, MAX_BLUR, BREATHE, ACT_BLEND, type Act } from './assets';

/** smoothstep — zero-velocity ends, used for the act-boundary dissolve. */
function smooth01(x: number): number {
  const k = Math.min(1, Math.max(0, x));
  return k * k * (3 - 2 * k);
}

export interface LoadedAct {
  act: Act;
  frames: HTMLImageElement[]; // [] until the clip is captured
  fallback: HTMLImageElement | null;
}

export interface ScrubberOpts {
  reducedMotion: boolean;
  accent: string; // rgba for floor glow (unused now overlays are DOM; kept for API)
  /** current fallback still (used until clips are produced) — usually the
   *  active station's render, so the fallback still tracks the stations. */
  getFallbackImg: () => HTMLImageElement | null;
  onProgress?: (p: number, actIndex: number) => void;
}

export class Scrubber {
  private ctx: CanvasRenderingContext2D;
  private cv: HTMLCanvasElement;
  private acts: LoadedAct[];
  private ranges: Array<{ a: number; b: number }> = [];
  private opts: ScrubberOpts;
  private raf = 0;
  private p = 0;
  private lastP = 0;
  private blur = 0;
  private lastScrollAt = 0;
  private mix = 1;
  private curImg: HTMLImageElement | null = null;
  private prevImg: HTMLImageElement | null = null;
  private appliedFilter = '';
  // Decoded-frame cache. The captured frames are WebP-backed <img>s; the browser
  // cannot keep hundreds of them decoded (GBs), so drawing a fresh one every
  // rAF forced a synchronous WebP re-decode per frame — the real dropped-frames
  // source. We pin a sliding window of ImageBitmaps (decoded, GPU-friendly)
  // around the playhead and prefetch neighbors, so scrubbing draws pre-decoded
  // bitmaps. FIFO eviction keeps memory bounded (~32 × 2560-wide ≈ 470 MB —
  // clips are 2160p sources captured at ≤2560; raise only if frames shrink).
  private bmp = new Map<HTMLImageElement, ImageBitmap | 'pending'>();
  private bmpOrder: HTMLImageElement[] = [];
  private static readonly BMP_MAX = 32;

  /** decoded bitmap for `img` if ready; kicks off async decode if not. */
  private bitmap(img: HTMLImageElement | null): ImageBitmap | null {
    if (!img || typeof createImageBitmap === 'undefined') return null;
    const v = this.bmp.get(img);
    if (v === undefined) {
      this.bmp.set(img, 'pending');
      createImageBitmap(img)
        .then((b) => {
          if (this.bmp.get(img) === 'pending') {
            this.bmp.set(img, b);
            this.bmpOrder.push(img);
            while (this.bmpOrder.length > Scrubber.BMP_MAX) {
              const old = this.bmpOrder.shift()!;
              const ob = this.bmp.get(old);
              if (ob && ob !== 'pending') ob.close();
              this.bmp.delete(old);
            }
          } else b.close();
        })
        .catch(() => this.bmp.delete(img));
      return null;
    }
    return v === 'pending' ? null : v;
  }

  constructor(canvas: HTMLCanvasElement, acts: LoadedAct[], opts: ScrubberOpts) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no 2d context');
    this.ctx = ctx;
    this.cv = canvas;
    this.acts = acts;
    this.opts = opts;
    const total = acts.reduce((s, x) => s + x.act.span, 0) || 1;
    let acc = 0;
    for (const la of acts) {
      const a = acc / total;
      acc += la.act.span;
      this.ranges.push({ a, b: acc / total });
    }
  }

  private hasFrames(): boolean {
    return this.acts.some((a) => a.frames.length > 0);
  }

  /** Set the canvas element's CSS filter (grade always on; blur only when moving).
   *  Assigning style.filter is cheap and the compositor applies it on the GPU. */
  private applyFilter(blurPx: number) {
    const b = blurPx > 0.15 ? ` blur(${blurPx.toFixed(2)}px)` : '';
    const f = `brightness(${GRADE.brightness}) contrast(${GRADE.contrast}) saturate(${GRADE.saturate})${b}`;
    if (f !== this.appliedFilter) {
      this.cv.style.filter = f;
      this.appliedFilter = f;
    }
  }

  private scrollProgress(): number {
    const doc = document.documentElement;
    const max = (doc.scrollHeight || 1) - innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  }

  private framesFor(i: number): { imgs: HTMLImageElement[]; reverse: boolean } {
    const la = this.acts[i];
    if (la.frames.length) return { imgs: la.frames, reverse: false };
    if (la.act.reverseOf) {
      const src = this.acts.find((x) => x.act.id === la.act.reverseOf);
      if (src && src.frames.length) return { imgs: src.frames, reverse: true };
    }
    return { imgs: [], reverse: false };
  }

  private drawContain(img: HTMLImageElement | ImageBitmap, scale: number, alpha: number) {
    const { ctx } = this;
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;
    const iAR = img.width / img.height;
    const cAR = cw / ch;
    let w: number, h: number;
    if (iAR > cAR) {
      w = cw;
      h = cw / iAR;
    } else {
      h = ch;
      w = ch * iAR;
    }
    w *= scale;
    h *= scale;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    ctx.globalAlpha = 1;
  }

  /** crossfade toward `target`, always keeping the previous image fully drawn
   *  underneath so the stage is never blank (used for the still fallback). */
  private crossfadeTo(target: HTMLImageElement | null, breathe: number) {
    if (target && target !== this.curImg) {
      this.prevImg = this.curImg ?? target;
      this.curImg = target;
      this.mix = 0;
    }
    this.mix = Math.min(1, this.mix + 0.06);
    if (this.prevImg) this.drawContain(this.prevImg, breathe, 1);
    if (this.curImg && this.mix > 0) this.drawContain(this.curImg, breathe, this.mix);
  }

  /** Draw act `i`'s frame for the current scroll position at `alpha`.
   *  An act's motion timeline is EXTENDED backwards into the previous act's
   *  dissolve zone, so it is already moving as it fades in, keeps a linear
   *  frame↔scroll mapping through its own span (station copy stays aligned),
   *  and finishes exactly at its boundary. `win` selects which slice of the
   *  clip this act plays (skip hero openings / split one clip across acts). */
  private drawAct(i: number, t: number, breathe: number, idle: boolean, alpha: number) {
    const { imgs, reverse } = this.framesFor(i);
    if (!imgs.length) {
      // clip not produced yet -> its still stands in at this layer's alpha
      if (alpha >= 1) this.crossfadeTo(this.acts[i].fallback, breathe);
      else if (this.acts[i].fallback) this.drawContain(this.acts[i].fallback!, breathe, alpha);
      return;
    }
    const r = this.ranges[i];
    const prev = i > 0 ? this.ranges[i - 1] : null;
    const start = prev ? r.a - ACT_BLEND * (prev.b - prev.a) : r.a;
    const u = Math.min(1, Math.max(0, (this.p - start) / Math.max(1e-4, r.b - start)));
    const N = imgs.length;
    // frame window: this act plays source fractions [w0, w1] of the clip
    // (applied on the reversed timeline for reverseOf acts)
    const [w0, w1] = this.acts[i].act.win ?? [0, 1];
    const isIdleAct = this.acts[i].act.kind === 'idle';
    let fpos = (w0 + u * (w1 - w0)) * (N - 1); // fractional frame position
    if (isIdleAct && idle) fpos = (t * 0.03) % N;
    const at = (k: number) => imgs[reverse ? N - 1 - k : k];
    const f0 = Math.floor(fpos);
    const f1 = isIdleAct && idle ? (f0 + 1) % N : Math.min(N - 1, f0 + 1);
    const frac = fpos - f0;
    // warm the decode window around the playhead (behind + ahead)
    for (let k = -2; k <= 5; k++) {
      const j = isIdleAct && idle ? (((f0 + k) % N) + N) % N : Math.min(N - 1, Math.max(0, f0 + k));
      this.bitmap(at(j));
    }
    // two-frame blend: hides frame quantization when scrubbing slowly.
    // Prefer the pre-decoded bitmap; fall back to the <img> if not ready yet.
    const a = at(f0);
    const b = at(f1);
    const da = a ? (this.bitmap(a) ?? a) : null;
    const db = b ? (this.bitmap(b) ?? b) : null;
    if (da) this.drawContain(da, breathe, alpha);
    if (db && b !== a && frac > 0.02) this.drawContain(db, breathe, alpha * frac);
  }

  private tick = (t: number) => {
    const { ctx } = this;
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;

    if (this.opts.reducedMotion) {
      const img = this.opts.getFallbackImg() ?? this.acts[0]?.fallback ?? null;
      this.applyFilter(0);
      ctx.clearRect(0, 0, cw, ch);
      if (img) this.drawContain(img, 1, 1);
      return; // static, no loop
    }

    const raw = this.scrollProgress();
    if (Math.abs(raw - this.lastP) > 0.0004) this.lastScrollAt = t;
    this.p += (raw - this.p) * SCROLL_LERP;
    const vel = Math.abs(this.p - this.lastP);
    this.lastP = this.p;
    // ease blur toward a velocity target, and let it settle to 0 when still
    this.blur += (Math.min(MAX_BLUR, vel * 750) - this.blur) * 0.18;
    if (this.blur < 0.05) this.blur = 0;
    this.applyFilter(this.blur);

    const breathe = BREATHE.base + Math.sin(t * 0.0011) * BREATHE.amp;

    ctx.clearRect(0, 0, cw, ch);

    if (this.hasFrames()) {
      // FRAME TIMELINE — two-layer overlap dissolve between acts.
      // The outgoing act plays to its boundary; the incoming act's motion
      // timeline starts ACT_BLEND early (inside the outgoing act's tail) and
      // fades in while ALREADY MOVING. Both layers are live footage — no held
      // frames, no rewind, and no detour through the hero (trimIn skips each
      // clip's hero-wide opening). Purely scroll-position-driven: symmetric
      // when scrubbing back up, no timers, no pops.
      let idx = this.ranges.findIndex((r) => this.p >= r.a && this.p < r.b);
      if (idx < 0) idx = this.ranges.length - 1;
      this.opts.onProgress?.(this.p, idx);
      const idle = t - this.lastScrollAt > 420;

      this.drawAct(idx, t, breathe, idle, 1);

      const r = this.ranges[idx];
      const w = ACT_BLEND * (r.b - r.a);
      if (idx < this.acts.length - 1 && this.p > r.b - w) {
        const mix = smooth01((this.p - (r.b - w)) / w);
        this.drawAct(idx + 1, t, breathe, idle, mix);
      }
    } else {
      // FALLBACK — crossfade the active station's still on the graded stage
      this.opts.onProgress?.(this.p, 0);
      this.crossfadeTo(this.opts.getFallbackImg(), breathe);
    }

    this.raf = requestAnimationFrame(this.tick);
  };

  start() {
    if (this.opts.reducedMotion) {
      this.tick(0);
      return;
    }
    this.raf = requestAnimationFrame(this.tick);
  }

  stop() {
    cancelAnimationFrame(this.raf);
    for (const v of this.bmp.values()) if (v && v !== 'pending') v.close();
    this.bmp.clear();
    this.bmpOrder = [];
  }
}
