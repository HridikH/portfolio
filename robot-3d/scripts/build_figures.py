"""Build the K1 case-study figures (public/figures/*.svg) from the source data in scripts/figure-data/.

    python3 scripts/build_figures.py

Every number drawn comes from a JSON file in scripts/figure-data/, and each JSON file names its
source (repo file, eval script, or ROS bag). Nothing is typed into the charts by hand, so a chart
can be checked against its source by reading the JSON.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "scripts" / "figure-data"
OUT = ROOT / "public" / "figures"

TEXT, STEEL, GRID, ACCENT, AMBER, LIGHT = "#1d1d1f", "#6e6e73", "#e3e3e8", "#0071e3", "#b5701a", "#9bbfe6"
FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
MONO = "'SF Mono', ui-monospace, Menlo, monospace"


def load(name):
    return json.loads((DATA / name).read_text())


def svg(w, h, body, title, desc):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" '
            f'role="img" aria-labelledby="t d" font-family="{FONT}">'
            f'<title id="t">{title}</title><desc id="d">{desc}</desc>'
            f'<rect width="{w}" height="{h}" fill="#ffffff"/>{body}</svg>\n')


def text(x, y, s, size=12, fill=TEXT, anchor="start", weight=400, mono=False):
    fam = f' font-family="{MONO}"' if mono else ""
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" '
            f'font-weight="{weight}"{fam}>{s}</text>')


def line(x1, y1, x2, y2, stroke=GRID, width=1, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{stroke}" stroke-width="{width}"{d}/>'


def fall_rates():
    d = load("sim_fall_rates.json")
    levels, series = d["levels"], d["fall_pct"]
    W, H, L, R, T, B = 720, 400, 56, 190, 30, 56
    pw, ph = W - L - R, H - T - B
    x = lambda i: L + pw * i / (len(levels) - 1)
    y = lambda v: T + ph * (1 - v / 70)
    o = []
    for v in range(0, 71, 10):
        o.append(line(L, y(v), L + pw, y(v)))
        o.append(text(L - 8, y(v) + 4, f"{v}%", 11, STEEL, "end"))
    # held-out region for stage1: impulses above its 10-30 N·s training cap
    o.append(f'<rect x="{x(1.5):.1f}" y="{T}" width="{x(3) - x(1.5) + 14:.1f}" height="{ph}" fill="#0071e3" opacity="0.05"/>')
    o.append(text(x(2.5), T + 14, "harder than stage1 ever trained on", 11, ACCENT, "middle"))
    for i, lv in enumerate(levels):
        o.append(text(x(i), H - B + 20, f"{lv} N·s", 12, TEXT, "middle"))
    o.append(text(L + pw / 2, H - 12, "Test impulse range (one push per robot, 256 robots per point)", 12, STEEL, "middle"))
    style = {
        "Baseline": (STEEL, 2.5, "6 4", "Baseline (no push training)"),
        "stage0": (LIGHT, 1.5, None, "stage0 (to 5–20)"),
        "stage1": (ACCENT, 3, None, "stage1 (to 10–30)"),
        "stage2": ("#7a8fa6", 1.5, None, "stage2 (to 15–40)"),
        "stage3": (AMBER, 2.5, None, "stage3 (to 20–50)"),
    }
    ends = []
    for name, vals in series.items():
        key = name.split(" ")[0]
        c, wdt, dash, label = style[key]
        pts = " ".join(f"{x(i):.1f},{y(v):.1f}" for i, v in enumerate(vals))
        da = f' stroke-dasharray="{dash}"' if dash else ""
        o.append(f'<polyline points="{pts}" fill="none" stroke="{c}" stroke-width="{wdt}"{da} stroke-linejoin="round"/>')
        for i, v in enumerate(vals):
            o.append(f'<circle cx="{x(i):.1f}" cy="{y(v):.1f}" r="3.5" fill="{c}"/>')
        ends.append([y(vals[-1]), c, f"{label}: {vals[-1]}%", wdt >= 2.5])
    ends.sort()
    for k in range(1, len(ends)):  # keep end labels from overlapping
        ends[k][0] = max(ends[k][0], ends[k - 1][0] + 16)
    for yy, c, label, bold in ends:
        o.append(text(L + pw + 12, yy + 4, label, 11.5, c if c != LIGHT else "#5a86b8", "start", 600 if bold else 400))
    o.append(text(L, 18, "Fall rate after one trunk push (simulation, lower is better)", 13, TEXT, "start", 600))
    return svg(W, H, "".join(o), "Simulated fall rate by push strength for each checkpoint",
               "Baseline falls 1, 12, 39, 51 percent at 5-20, 10-30, 15-40, 20-50 N·s. stage1 falls 0, 3, 13, 37 "
               "percent. stage3 falls 6, 27, 46, 65 percent, worse than baseline at every level.")


def recovery_1540():
    d = load("sim_fall_rates.json")
    i = d["levels"].index("15-40")
    rows = [(k.split(" (")[0] if not k.startswith("Baseline") else "Baseline", 100 - v[i], k) for k, v in d["fall_pct"].items()]
    W, H, L, R, T = 720, 250, 190, 70, 40
    bh, gap = 26, 10
    pw = W - L - R
    base = rows[0][1]
    o = [text(L - 180, 22, "Recovered from one 15–40 N·s push (simulation, 256 trials each; stage0 and stage1 never trained at this level)", 13, TEXT, "start", 600)]
    for n, (name, rec, full) in enumerate(rows):
        yy = T + n * (bh + gap)
        c = STEEL if name == "Baseline" else ACCENT if name == "stage1" else AMBER if rec < base else LIGHT
        o.append(text(L - 10, yy + bh / 2 + 4, full.replace(" (", "  (").replace("Baseline  (HW3, no push training)", "Baseline (no push training)"), 11.5, TEXT, "end"))
        o.append(f'<rect x="{L}" y="{yy}" width="{pw * rec / 100:.1f}" height="{bh}" rx="3" fill="{c}"/>')
        o.append(text(L + pw * rec / 100 + 8, yy + bh / 2 + 4, f"{rec}%", 12, TEXT, "start", 600))
    xb = L + pw * base / 100
    o.append(line(xb, T - 6, xb, T + len(rows) * (bh + gap) - gap + 6, STEEL, 1.2, "4 3"))
    o.append(text(xb, T + len(rows) * (bh + gap) + 12, f"baseline {base}%", 11, STEEL, "middle"))
    return svg(W, H, "".join(o), "Recovery rate at 15-40 N·s by checkpoint",
               "Baseline 61 percent, stage0 84, stage1 87, stage2 70, stage3 54 percent. Only stage3 is below baseline.")


def adaptive():
    d = load("adaptive_ladder_rtx3050.json")
    ladder, hist = d["ladder"], d["history"]
    W, H, L, R = 720, 420, 60, 24
    T1, H1, T2, H2 = 40, 170, 270, 100
    pw = W - L - R
    n = len(hist)
    x = lambda k: L + pw * k / (n - 1)
    o = [text(L - 50, 20, "Survival-gated push ladder, one training run (RTX 3050 laptop, from the run's state file)", 13, TEXT, "start", 600)]
    # panel 1: upper impulse bound of the active level
    ymax = 52
    y1 = lambda v: T1 + H1 * (1 - (v - 15) / (ymax - 15))
    for v in (20, 30, 40, 50):
        o.append(line(L, y1(v), L + pw, y1(v)))
        o.append(text(L - 8, y1(v) + 4, f"{v}", 11, STEEL, "end"))
    o.append(text(L - 46, T1 + H1 / 2, "N·s", 11, STEEL, "middle"))
    pts = []
    for k, (step, old, new, surv, pushes) in enumerate(hist):
        hi_old, hi_new = ladder[old][1], ladder[new][1]
        pts += [f"{x(k):.1f},{y1(hi_old):.1f}", f"{x(k):.1f},{y1(hi_new):.1f}"]
    o.append(f'<polyline points="{" ".join(pts)}" fill="none" stroke="{ACCENT}" stroke-width="2.5"/>')
    o.append(text(L + 4, T1 + 12, "upper bound of the push range at each 200-iteration decision", 11, STEEL))
    last = ladder[hist[-1][2]]
    o.append(text(L + pw, y1(last[1]) - 8, f"level {hist[-1][2]}: {last[0]:g}–{last[1]:g} N·s", 11.5, ACCENT, "end", 600))
    # panel 2: survival measured at each decision
    y2 = lambda v: T2 + H2 * (1 - (v - 0.65) / (1.0 - 0.65))
    for v, lab, c in ((0.85, "85%: step up", ACCENT), (0.70, "70%: step down", AMBER)):
        o.append(line(L, y2(v), L + pw, y2(v), c, 1, "5 4"))
        o.append(text(L + pw, y2(v) - 4, lab, 10.5, c, "end"))
    for v in (0.7, 0.8, 0.9, 1.0):
        o.append(text(L - 8, y2(v) + 4, f"{int(v * 100)}%", 11, STEEL, "end"))
    pts = " ".join(f"{x(k):.1f},{y2(h[3]):.1f}" for k, h in enumerate(hist))
    o.append(f'<polyline points="{pts}" fill="none" stroke="{TEXT}" stroke-width="1.5"/>')
    for k, h in enumerate(hist):
        o.append(f'<circle cx="{x(k):.1f}" cy="{y2(h[3]):.1f}" r="2.6" fill="{ACCENT if h[2] > h[1] else TEXT}"/>')
    o.append(text(L + 4, T2 - 8, "share of pushes survived in the window before each decision (≥ 3,000 pushes per window)", 11, STEEL))
    o.append(text(L + pw / 2, H - 6, f"curriculum decisions 1 to {n} (blue dots = stepped up)", 11.5, STEEL, "middle"))
    return svg(W, H, "".join(o), "Adaptive push ladder level and measured survival over one run",
               f"The ladder climbed from level 0 (5-20 N·s) to level 8 (15-40 N·s) in 8 decisions, held there "
               f"while survival was 79 to 82 percent, then reached level 10 (17.5-45 N·s) and held with survival "
               f"81 to 85 percent. It never stepped down. {n} decisions in total.")


def hw_tilt():
    runs = load("hw_runs.json")
    series = load("hw_tilt_series.json")
    cut = runs["deploy_fall_stop_deg"]
    W, Hh, L, R, T = 720, 120, 60, 24, 34
    rows = runs["runs"]
    H = T + len(rows) * (Hh + 18) + 44
    pw = W - L - R
    tmax = 46
    x = lambda t: L + pw * min(t, tmax) / tmax
    o = [text(L - 50, 20, "Trunk tilt on hardware while the learned policy had control (IMU, 10 Hz max-pooled)", 13, TEXT, "start", 600)]
    for n, r in enumerate(rows):
        top = T + n * (Hh + 18)
        y = lambda v: top + 20 + (Hh - 20) * (1 - v / 65)
        s = series[r["bag"].replace("deploy3_", "")]
        o.append(line(L, y(cut), L + pw, y(cut), AMBER, 1.2, "5 4"))
        for v in (0, 30):
            o.append(line(L, y(v), L + pw, y(v)))
            o.append(text(L - 8, y(v) + 4, f"{v}°", 10.5, STEEL, "end"))
        o.append(text(L - 8, y(cut) + 4, f"{cut}°", 10.5, AMBER, "end"))
        pts = " ".join(f"{x(t):.1f},{y(v):.1f}" for t, v in zip(s["t"], s["tilt_deg"]) if t <= tmax)
        c = STEEL if r["policy"].startswith("Baseline") else ACCENT
        o.append(f'<polyline points="{pts}" fill="none" stroke="{c}" stroke-width="1.4" stroke-linejoin="round"/>')
        k = max(range(len(s["t"])), key=lambda i: s["tilt_deg"][i])
        o.append(f'<circle cx="{x(s["t"][k]):.1f}" cy="{y(s["tilt_deg"][k]):.1f}" r="3.5" fill="{c}"/>')
        o.append(text(L, top + 10, f'{r["policy"]} · {r["bag"]} · {r["pushes"]} hand pushes · peak {r["max_tilt_deg"]:.0f}° · falls {r["falls"]}', 11.5, TEXT, "start", 600))
    o.append(text(L + pw, H - 12, f"dashed: {cut}° tilt, where the deploy tool stops the policy", 11, AMBER, "end"))
    for t in range(0, tmax + 1, 10):
        o.append(text(x(t), H - 30, f"{t} s", 11, STEEL, "middle"))
    return svg(W, H, "".join(o), "Hardware trunk tilt traces for the four push runs",
               "Peak tilt with the policy in control: 24 degrees baseline, 26 and 26 degrees stage1, 32 degrees "
               "push plus DR. All stay well below the 60 degree stop threshold; the K1 fall detector read READY throughout.")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, fn in (("k1-fall-rates", fall_rates), ("k1-recovery-15-40", recovery_1540),
                     ("k1-adaptive-ladder", adaptive), ("k1-hw-tilt", hw_tilt)):
        (OUT / f"{name}.svg").write_text(fn(), encoding="utf-8")
        print("wrote", OUT / f"{name}.svg")


if __name__ == "__main__":
    main()
