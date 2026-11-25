// Putting a choice on the page: the theme and the seven axes as attributes, which dist/sx.css turns into
// variables. No colour is computed here, so the first frame can be right if the app sets the attributes
// before it draws (e.g. from a value it cached itself).
import { STYLES, THEMES } from "./data.gen.js";
import { DEFAULT_STYLE } from "./style.js";
import { AXES } from "./types.js";
export const DEFAULT_APPEARANCE = { theme: "auto", style: "calm" };
/** Themes that left the set, and the one a stored choice moves to (PLAN.md K8). */
export const RETIRED = { sepia: "paper", contrast: "graphite", sage: "ink", neon: "studio" };
/** Styles that left the set, and the one a stored choice moves to. */
export const RETIRED_STYLES = { plastic: "calm" };
/** The seven steps of a stored style: a preset's, or the stored steps with unknown values replaced. */
export function resolveStyle(style) {
    if (typeof style === "string") {
        const id = RETIRED_STYLES[style] ?? style;
        const p = STYLES.find((s) => s.id === id);
        if (p)
            return pick(p);
        return { ...DEFAULT_STYLE };
    }
    const out = { ...DEFAULT_STYLE };
    if (style && typeof style === "object")
        for (const axis of Object.keys(AXES)) {
            const v = style[axis];
            if (AXES[axis].includes(v))
                out[axis] = v;
        }
    return out;
}
/** A style as it is best stored: the preset's id if all seven steps match one, else the steps. */
export function compactStyle(style) {
    const p = STYLES.find((s) => Object.keys(AXES).every((a) => s[a] === style[a]));
    return p ? p.id : pick(style);
}
/** A stored value made safe: unknown themes become "auto", broken styles the default. */
export function normalize(value) {
    const v = (value && typeof value === "object" ? value : {});
    const asked = typeof v.theme === "string" ? (RETIRED[v.theme] ?? v.theme) : "";
    const theme = asked === "auto" || THEMES.some((t) => t.id === asked) ? asked : DEFAULT_APPEARANCE.theme;
    const style = v.style === undefined ? DEFAULT_APPEARANCE.style : compactStyle(resolveStyle(v.style));
    return { theme, style };
}
/** Puts theme and style on an element, by default <html>. */
export function apply(value, el = document.documentElement) {
    const a = normalize(value);
    el.setAttribute("data-sx-theme", a.theme);
    const s = resolveStyle(a.style);
    for (const axis of Object.keys(AXES))
        el.setAttribute(`data-sx-${axis}`, s[axis]);
}
function pick(s) {
    return Object.fromEntries(Object.keys(AXES).map((a) => [a, s[a]]));
}
