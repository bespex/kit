// The guard rails (PLAN.md K3): every theme with every style stays readable and keeps the meaning of each
// colour apart. Merged from CodeDeck (tools/theme-check.mjs, STYLING.md B3) and Tasqlet (KONZEPT.md 7.1).
// Checks the matrix of the steps that change colours: chrome, emphasis, color, structure.

import { contrast, distance } from "./color.js";
import { derive } from "./derive.js";
import { DEFAULT_STYLE, styled } from "./style.js";
import { CODE_ROLES, type ColorTheme, type Style } from "./types.js";

export interface Finding {
  rule: string;
  /** The two colours compared */
  a: string;
  b: string;
  /** Contrast ratio, or OKLab distance for "apart" rules */
  value: number;
  need: number;
  kind: "contrast" | "apart";
  ok: boolean;
}

/** Every rule a theme has to meet, over all colour-changing steps of the style axes. */
export function check(t: ColorTheme): Finding[] {
  const roles = derive(t);
  const out: Finding[] = [];
  const seen = new Set<string>();
  const pair = (rule: string, a: string, b: string, need: number) => {
    const key = `${rule}|${a}|${b}`;
    if (seen.has(key)) return;
    seen.add(key);
    const value = contrast(a, b);
    out.push({ rule, a, b, value, need, kind: "contrast", ok: value >= need - 0.005 });
  };
  const apart = (rule: string, a: string, b: string, need = 8) => {
    const value = distance(a, b);
    out.push({ rule, a, b, value, need, kind: "apart", ok: value >= need });
  };
  const r = roles;

  // Ground: text on every surface
  for (const s of ["bg", "panel", "raised", "field", "overlay", "hover"]) {
    pair(`ink on ${s}`, r.ink, r[s], 7);
    pair(`ink-2 on ${s}`, r["ink-2"], r[s], 4.5);
  }
  for (const s of ["bg", "panel", "field"]) pair(`ink-3 on ${s}`, r["ink-3"], r[s], 3);
  for (const s of ["bg", "panel", "field"]) pair(`line-strong against ${s}`, r["line-strong"], r[s], 3);
  pair("ink on selection", r.ink, r.selection, 4.5);
  pair("accent against panel", r.accent, r.panel, 3);
  pair("accent-ink on panel", r["accent-ink"], r.panel, 4.5);
  pair("accent-ink on bg", r["accent-ink"], r.bg, 4.5);
  pair("on-accent on accent-fill", r["on-accent"], r["accent-fill"], 4.5);
  pair("on-accent on accent-fill-hover", r["on-accent"], r["accent-fill-hover"], 4.5);
  pair("ink on accent-soft", r.ink, r["accent-soft"], 7);
  pair("ink on mark", r.ink, r.mark, 7);
  for (const k of ["ok", "warn", "danger", "info", "ai", "done"]) pair(`${k} on panel`, r[k], r.panel, 3);
  for (const k of CODE_ROLES) pair(`code-${k} on bg`, r[`code-${k}`], r.bg, 4.5);

  // Inverted surfaces
  pair("on-inv on inv", r["on-inv"], r.inv, 7);
  pair("on-inv-2 on inv", r["on-inv-2"], r.inv, 4.5);
  pair("on-inv-2 on inv-hover", r["on-inv-2"], r["inv-hover"], 4.5);
  pair("on-inv-3 on inv", r["on-inv-3"], r.inv, 3);
  pair("accent-inv on inv", r["accent-inv"], r.inv, 4.5);
  pair("on-accent-inv on accent-inv", r["on-accent-inv"], r["accent-inv"], 4.5);

  // Meanings stay apart
  const means: Record<string, string> = { accent: r.accent, ai: r.ai, warn: r.warn, danger: r.danger, ok: r.ok };
  const keys = Object.keys(means);
  keys.forEach((x, i) => keys.slice(i + 1).forEach((y) => apart(`${x} ≠ ${y}`, means[x], means[y])));
  if (r.done !== r.ok) for (const k of ["warn", "danger", "ai"]) apart(`done ≠ ${k}`, r.done, r[k]);
  const series = [1, 2, 3, 4, 5, 6].map((i) => r[`series-${i}`]);
  series.forEach((x, i) => series.slice(i + 1).forEach((y, j) => apart(`series ${i + 1} ≠ series ${i + j + 2}`, x, y)));
  series.forEach((x, i) => ["warn", "danger"].forEach((k) => apart(`series ${i + 1} ≠ ${k}`, x, r[k], 6)));

  // Every colour-changing step of the style: zones and regions
  for (const style of matrix()) {
    const v = styled(roles, style);
    for (const zone of ["chrome", "emph"] as const) {
      const step = zone === "chrome" ? style.chrome : style.emphasis;
      const z = (role: string) => v[`${zone}-${role}`];
      const at = `${zone === "chrome" ? "chrome" : "emphasis"} ${step}`;
      for (const s of ["bg", "field", "hover"]) {
        pair(`ink on ${s} (${at})`, z("ink"), z(s), 7);
        pair(`ink-2 on ${s} (${at})`, z("ink-2"), z(s), 4.5);
      }
      pair(`ink-3 on bg (${at})`, z("ink-3"), z("bg"), 3);
      pair(`line-strong against bg (${at})`, z("line-strong"), z("bg"), 3);
      pair(`accent-ink on bg (${at})`, z("accent-ink"), z("bg"), 4.5);
      pair(`on-accent on accent-fill (${at})`, z("on-accent"), z("accent-fill"), 4.5);
    }
    for (let k = 1; k <= 4; k++) {
      const bg = v[`area-${k}-bg`];
      pair(`ink on area ${k} (color ${style.color})`, r.ink, bg, 7);
      pair(`ink-2 on area ${k} (color ${style.color})`, r["ink-2"], bg, 4.5);
      pair(`ink-3 on area ${k} (color ${style.color})`, r["ink-3"], bg, 3);
      for (const m of ["ok", "warn", "danger", "ai"]) pair(`${m} on area ${k} (color ${style.color})`, r[m], bg, 3);
    }
  }
  return out;
}

/** The styles that cover every colour-changing step at least once. */
function matrix(): Style[] {
  const out: Style[] = [];
  for (const chrome of ["flat", "raised", "contrast"] as const)
    for (const emphasis of ["calm", "strong", "stage"] as const)
      for (const color of ["neutral", "tinted", "colorful"] as const)
        for (const structure of ["lines", "surfaces", "depth"] as const)
          out.push({ ...DEFAULT_STYLE, chrome, emphasis, color, structure });
  return out;
}
