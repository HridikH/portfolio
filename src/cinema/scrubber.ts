// The scrubber: paints frames (or fallback stills) to a canvas in lock-step with
// scroll. Decode-free during scroll — it only picks an index and drawImage's.
import { GRADE, SCROLL_LERP, MAX_BLUR, BREATHE, type Act } from './assets';

export interface LoadedAct {
  act: Act;
  frames: HTMLImageElement[]; // [] until the clip is captured
  fallback: HTMLImageElement | null;
}

export interface ScrubberOpts {
  reducedMotion: boolean;
  accent: string; // rgba for floor glow
  /** current fallback still (used until clips are produced) — usually the
   *  active station's render, so the fallback still tracks the stations. */
  getFallbackImg: () => HTMLImageElement | null;
  onProgress?: (p: number, actIndex: number) => void;
}

export class Scrubber {
  private ctx: CanvasRenderingContext2D;
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

  constructor(canvas: HTMLCanvasElement, acts: LoadedAct[], opts: ScrubberOpts) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no 2d context');
    this.ctx = ctx;
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

  private drawContain(img: HTMLImageElement, scale: number, alpha: number) {
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
   *  underneath so the stage is never blank. */
  private crossfadeTo(target: HTMLImageElement | null, breathe: number) {
    if (target && target !== this.curImg) {
      this.prevImg = this.curImg ?? target;
      this.curImg = target;
      this.mix = 0;
    }
    this.mix = Math.min(1, this.mix + 0.07);
    if (this.prevImg) this.drawContain(this.prevImg, breathe, 1);
    if (this.curImg && this.mix > 0) this.drawContain(this.curImg, breathe, this.mix);
  }

  private overlays() {
    const { ctx } = this;
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;
    ctx.filter = 'none';
    const top = ctx.createLinearGradient(0, 0, 0, ch * 0.22);
    top.addColorStop(0, 'rgba(7,7,8,0.92)');
    top.addColorStop(1, 'rgba(7,7,8,0)');
    ctx.fillStyle = top;
    ctx.fillRect(0, 0, cw, ch * 0.22);
    const bot = ctx.createLinearGradient(0, ch * 0.72, 0, ch);
    bot.addColorStop(0, 'rgba(7,7,8,0)');
    bot.addColorStop(1, 'rgba(7,7,8,0.96)');
    ctx.fillStyle = bot;
    ctx.fillRect(0, ch * 0.72, cw, ch * 0.28);
    const vig = ctx.createRadialGradient(cw / 2, ch * 0.46, ch * 0.3, cw / 2, ch * 0.46, ch * 0.85);
    vig.addColorStop(0, 'rgba(7,7,8,0)');
    vig.addColorStop(1, 'rgba(7,7,8,0.66)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, cw, ch);
    const glow = ctx.createRadialGradient(cw / 2, ch * 0.9, 0, cw / 2, ch * 0.9, cw * 0.42);
    glow.addColorStop(0, this.opts.accent);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = glow;
    ctx.fillRect(0, ch * 0.58, cw, ch * 0.42);
    ctx.globalCompositeOperation = 'source-over';
  }

  private tick = (t: number) => {
    const { ctx } = this;
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;

    if (this.opts.reducedMotion) {
      const img = this.opts.getFallbackImg() ?? this.acts[0]?.fallback ?? null;
      ctx.clearRect(0, 0, cw, ch);
      ctx.filter = `brightness(${GRADE.brightness}) contrast(${GRADE.contrast}) saturate(${GRADE.saturate})`;
      if (img) this.drawContain(img, 1, 1);
      this.overlays();
      return; // static, no loop
    }

    const raw = this.scrollProgress();
    if (Math.abs(raw - this.lastP) > 0.0004) this.lastScrollAt = t;
    this.p += (raw - this.p) * SCROLL_LERP;
    const vel = Math.abs(this.p - this.lastP);
    this.lastP = this.p;
    this.blur += (Math.min(MAX_BLUR, vel * 900) - this.blur) * 0.2;

    const breathe = BREATHE.base + Math.sin(t * 0.0011) * BREATHE.amp;

    ctx.clearRect(0, 0, cw, ch);
    ctx.filter = `brightness(${GRADE.brightness}) contrast(${GRADE.contrast}) saturate(${GRADE.saturate}) blur(${this.blur.toFixed(2)}px)`;

    if (this.hasFrames()) {
      // FRAME TIMELINE — scrub captured clips across their spans
      let idx = this.ranges.findIndex((r) => this.p >= r.a && this.p < r.b);
      if (idx < 0) idx = this.ranges.length - 1;
      const r = this.ranges[idx];
      const localT = (this.p - r.a) / Math.max(1e-4, r.b - r.a);
      this.opts.onProgress?.(this.p, idx);
      const { imgs, reverse } = this.framesFor(idx);
      const idle = t - this.lastScrollAt > 420;
      if (imgs.length) {
        let fi = Math.round(localT * (imgs.length - 1));
        if (this.acts[idx].act.kind === 'idle' && idle) fi = Math.floor(t * 0.03) % imgs.length;
        const img = imgs[reverse ? imgs.length - 1 - fi : fi];
        if (img) this.drawContain(img, breathe, 1);
      } else {
        this.crossfadeTo(this.acts[idx].fallback, breathe); // this act's clip not produced yet
      }
    } else {
      // FALLBACK — crossfade the active station's still on the graded stage
      this.opts.onProgress?.(this.p, 0);
      this.crossfadeTo(this.opts.getFallbackImg(), breathe);
    }

    this.overlays();
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
  }
}
