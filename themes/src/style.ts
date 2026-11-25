// The style axes (PLAN.md K2) as recipes over the roles of a theme. One table feeds both the CSS (with
// `color-mix(in oklab, …)`) and the check (with `mix` in OKLab), so what the check measures is what the
// page shows.
//
// An app marks its elements; the library rebinds the roles inside them:
//   .sx-chrome     toolbars, tabs, status and side bars       (axis `chrome`)
//   .sx-emphasis   what matters most: current task, open mail (axis `emphasis`)
//   .sx-area[data-area="1…4"]  a region of the window        (axis `color`)
// Components inside use the plain roles (`--sx-bg`, `--sx-ink` …) and adapt by themselves.

import { mix } from "./color.js";
import type { Axis, Roles, Style } from "./types.js";

/** A colour from roles: a role's name, or `[a, b, t]` = a moved by t towards b (OKLab). With a fourth
 *  element `"boost"`, t is multiplied by the theme's `area-boost` (a theme that wants stronger regions). */
export type Expr = string | [Expr, Expr, number] | [Expr, Expr, number, "boost"];
/** A value of a style variable: a colour recipe, or plain CSS (`{ css: "…" }`). */
export type Value = Expr | { css: string };

/** The roles a zone rebinds, so that components inside need nothing of their own. */
export const ZONE_ROLES = [
  "bg", "panel", "raised", "surface", "field", "hover", "selection", "line", "line-strong", "divider",
  "ink", "ink-2", "ink-3", "accent", "accent-ink", "accent-soft", "accent-fill", "on-accent",
] as const;

const same = (prefix: string): Record<string, Value> =>
  Object.fromEntries(ZONE_ROLES.map((r) => [`${prefix}-${r}`, r])) as Record<string, Value>;

const inverted = (prefix: string): Record<string, Value> => ({
  [`${prefix}-bg`]: "inv", [`${prefix}-panel`]: "inv-raised", [`${prefix}-raised`]: "inv-raised",
  [`${prefix}-surface`]: "inv", [`${prefix}-field`]: "inv-raised", [`${prefix}-hover`]: "inv-hover",
  [`${prefix}-selection`]: "accent-inv-soft", [`${prefix}-line`]: "inv-line",
  [`${prefix}-line-strong`]: "inv-line-strong", [`${prefix}-divider`]: "inv-line",
  [`${prefix}-ink`]: "on-inv", [`${prefix}-ink-2`]: "on-inv-2", [`${prefix}-ink-3`]: "on-inv-3",
  [`${prefix}-accent`]: "accent-inv", [`${prefix}-accent-ink`]: "accent-inv",
  [`${prefix}-accent-soft`]: "accent-inv-soft", [`${prefix}-accent-fill`]: "accent-inv",
  [`${prefix}-on-accent`]: "on-accent-inv", [`${prefix}-scheme`]: { css: "var(--sx-scheme-inv)" },
});

/** What each step of each axis sets. Steps missing a variable leave it as the default step has it. */
export const RECIPES: { [K in Axis]: Record<Style[K], Record<string, Value>> } = {
  shape: {
    sharp: { "radius-s": { css: "2px" }, "radius-m": { css: "3px" }, "radius-l": { css: "4px" } },
    soft: { "radius-s": { css: "4px" }, "radius-m": { css: "6px" }, "radius-l": { css: "10px" } },
    round: { "radius-s": { css: "6px" }, "radius-m": { css: "10px" }, "radius-l": { css: "16px" } },
  },
  structure: {
    lines: {
      surface: "bg", divider: ["line", "line-strong", 0.4],
      "shadow-1": { css: "none" }, "shadow-2": { css: "0 4px 14px -4px var(--sx-shadow)" },
    },
    surfaces: {
      surface: "panel", divider: "line",
      "shadow-1": { css: "none" }, "shadow-2": { css: "0 6px 18px -6px var(--sx-shadow)" },
    },
    depth: {
      surface: "raised", divider: ["line", "bg", 0.5],
      "shadow-1": { css: "0 1px 2px var(--sx-shadow), 0 4px 12px -6px var(--sx-shadow)" },
      "shadow-2": { css: "0 14px 36px -6px var(--sx-shadow), 0 2px 6px var(--sx-shadow)" },
    },
  },
  chrome: {
    flat: { ...same("chrome"), "chrome-scheme": { css: "var(--sx-scheme)" } },
    raised: {
      ...same("chrome"),
      "chrome-bg": ["bg", "ink", 0.06], "chrome-surface": ["bg", "ink", 0.06],
      "chrome-hover": ["bg", "ink", 0.11], "chrome-line": ["bg", "ink", 0.14],
      "chrome-field": "raised", "chrome-divider": "line-strong",
      "chrome-line-strong": ["line-strong", "ink", 0.15], "chrome-accent-ink": ["accent-ink", "ink", 0.1],
      "chrome-scheme": { css: "var(--sx-scheme)" },
    },
    contrast: inverted("chrome"),
  },
  emphasis: {
    calm: {
      ...same("emph"), "emph-scheme": { css: "var(--sx-scheme)" },
      "emph-border": ["line", "accent", 0.4], "emph-border-w": { css: "1px" }, "emph-shadow": { css: "none" },
    },
    strong: {
      ...same("emph"), "emph-scheme": { css: "var(--sx-scheme)" },
      "emph-bg": ["panel", "accent", 0.07], "emph-panel": ["panel", "accent", 0.07],
      "emph-raised": ["panel", "accent", 0.07], "emph-surface": ["panel", "accent", 0.07],
      "emph-field": ["panel", "accent", 0.11], "emph-hover": ["panel", "accent", 0.14],
      "emph-line": ["panel", "accent", 0.24], "emph-divider": ["panel", "accent", 0.24],
      // the tinted surface takes a little contrast: strong lines, quiet text and accent text move towards ink
      "emph-line-strong": ["line-strong", "ink", 0.2], "emph-ink-2": ["ink-2", "ink", 0.15],
      "emph-accent-ink": ["accent-ink", "ink", 0.18],
      "emph-border": "accent", "emph-border-w": { css: "2px" },
      "emph-shadow": { css: "0 10px 28px color-mix(in oklab, var(--sx-accent) 24%, transparent)" },
    },
    stage: {
      ...inverted("emph"),
      "emph-border": "inv", "emph-border-w": { css: "1px" },
      "emph-shadow": { css: "0 12px 32px -4px var(--sx-shadow)" },
    },
  },
  density: {
    compact: { "space-1": { css: "2px" }, "space-2": { css: "4px" }, "space-3": { css: "8px" }, "space-4": { css: "12px" }, row: { css: "26px" } },
    normal: { "space-1": { css: "4px" }, "space-2": { css: "6px" }, "space-3": { css: "12px" }, "space-4": { css: "16px" }, row: { css: "32px" } },
    airy: { "space-1": { css: "6px" }, "space-2": { css: "10px" }, "space-3": { css: "16px" }, "space-4": { css: "24px" }, row: { css: "40px" } },
  },
  color: {
    neutral: areas(0, "0%"),
    tinted: areas(0.07, "12%"),
    colorful: areas(0.14, "24%"),
  },
  effects: {
    none: { glow: { css: "0px" }, glass: { css: "100%" }, "glass-blur": { css: "0px" }, gradient: { css: "0%" }, backdrop: { css: "0%" }, duration: { css: "100ms" } },
    subtle: { glow: { css: "6px" }, glass: { css: "88%" }, "glass-blur": { css: "10px" }, gradient: { css: "4%" }, backdrop: { css: "5%" }, duration: { css: "150ms" } },
    rich: { glow: { css: "12px" }, glass: { css: "74%" }, "glass-blur": { css: "18px" }, gradient: { css: "8%" }, backdrop: { css: "10%" }, duration: { css: "220ms" } },
  },
};

/** The regions' surfaces with the axis `color`: the panel moved towards each area colour. */
function areas(t: number, seriesFill: string): Record<string, Value> {
  // A region is a surface of the ground, also inside an inverted bar: it keeps the ground's text
  const out: Record<string, Value> = {
    "series-fill": { css: seriesFill }, "area-ink": "ink", "area-ink-2": "ink-2", "area-ink-3": "ink-3",
    "area-scheme": { css: "var(--sx-scheme)" },
  };
  for (let k = 1; k <= 4; k++) out[`area-${k}-bg`] = t ? ["panel", `area-${k}`, t, "boost"] : "panel";
  return out;
}

/** The style a page has when it sets no axis: the preset "calm". */
export const DEFAULT_STYLE: Style = {
  shape: "soft", structure: "surfaces", chrome: "flat", emphasis: "strong", density: "normal", color: "tinted", effects: "none",
};

/** A recipe as CSS */
export function cssValue(v: Value): string {
  if (typeof v === "object" && !Array.isArray(v)) return v.css;
  if (typeof v === "string") return `var(--sx-${v})`;
  const [a, b, t, boost] = v;
  const pct = +(t * 100).toFixed(2);
  return `color-mix(in oklab, ${cssValue(a)}, ${cssValue(b)} ${boost ? `calc(${pct}% * var(--sx-area-boost, 1))` : `${pct}%`})`;
}

/** A colour recipe worked out on the roles of a theme (and the style variables already worked out). */
export function evaluate(v: Expr, roles: Record<string, string>): string {
  if (typeof v === "string") {
    const c = roles[v];
    if (!c) throw new Error(`unknown role ${v}`);
    return c;
  }
  const t = v[3] === "boost" ? v[2] * Number(roles["area-boost"] ?? 1) : v[2];
  return mix(evaluate(v[0], roles), evaluate(v[1], roles), t);
}

/** Every colour variable a style gives on a theme: roles plus `surface`, `divider`, `chrome-*`, `emph-*`, `area-*-bg`. */
export function styled(roles: Roles, style: Style): Record<string, string> {
  const out: Record<string, string> = { ...roles };
  // structure first: zones refer to `surface` and `divider`
  const order: Axis[] = ["structure", "shape", "density", "effects", "color", "chrome", "emphasis"];
  for (const axis of order) {
    const step = RECIPES[axis][style[axis] as never] as Record<string, Value>;
    for (const [name, v] of Object.entries(step)) {
      if (typeof v === "object" && !Array.isArray(v)) continue;
      out[name] = evaluate(v, out);
    }
  }
  return out;
}
