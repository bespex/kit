// From a theme file to every role (PLAN.md K1): the file names a few colours with meaning, the rest is
// derived here so that every theme delivers every role. The rules come from CodeDeck (neutral scale,
// accents, sessions) and Tasqlet (fields, hover, marks, inverted surfaces).
import { contrast, fromLch, hueGap, lch, mix, reach, textOn } from "./color.js";
import { CODE_ROLES, STEPS } from "./types.js";
/** Where each step of the neutral scale lies between `fg` (0) and `bg` (1) */
const AT = {
    50: 0, 100: 0.04, 200: 0.12, 300: 0.2, 400: 0.27, 500: 0.35, 600: 0.5, 700: 0.8, 800: 0.86, 900: 0.91, 950: 1,
};
/** `c` lighter or darker until it has `ratio` against every one of `grounds` (all on the same side). */
function hold(c, grounds, ratio) {
    for (let round = 0; round < 3; round++)
        for (const g of grounds)
            if (contrast(c, g) < ratio)
                c = reach(c, g, ratio);
    return c;
}
export function derive(t) {
    const light = t.scheme === "light";
    const sf = t.surfaces ?? {};
    const tone = (at) => mix(t.fg, t.bg, at);
    const n = Object.fromEntries(STEPS.map((s, i) => [s, t.neutral?.[i] ?? tone(AT[s])]));
    const bg = t.bg;
    const panel = sf.panel ?? tone(0.955);
    const raised = sf.raised ?? (light ? mix(bg, "#ffffff", 0.6) : tone(0.89));
    const field = sf.field ?? (light ? tone(0.975) : mix(bg, "#000000", 0.22));
    const hover = sf.hover ?? tone(light ? 0.93 : 0.85);
    const line = sf.line ?? tone(0.8);
    const grounds = [bg, panel, raised, field];
    const lineStrong = sf.lineStrong ?? hold(tone(0.55), [bg, panel, field], 3);
    const overlay = sf.overlay ?? (light ? mix(bg, "#ffffff", 0.7) : tone(0.84));
    const ink = hold(n[50], [...grounds, overlay, hover], 7);
    const ink2 = hold(n[300], [...grounds, overlay, hover], 4.5);
    const ink3 = hold(n[500], [bg, panel, field], 3);
    // Accents (CodeDeck): a label colour, a fill that holds the label, a second colour turned away from
    // the meanings for gradients
    const onAccent = t.onAccent ?? (contrast("#ffffff", t.accent) >= contrast(bg, t.accent) ? "#ffffff" : bg);
    const accentFill = t.accentFill ?? reach(t.accent, onAccent, 4.5);
    const ai = t.ai ?? t.info;
    const [aL, aC, aH] = lch(t.accent);
    const room = (c) => Math.min(...[t.warn, t.danger, ai].map((m) => lch(m)[2]).map((h) => hueGap(h, lch(c)[2])));
    const accent2 = t.accent2 ?? [-14, 14].map((d) => fromLch(aL + 0.03, aC, (aH + d + 360) % 360)).sort((x, y) => room(y) - room(x))[0];
    const accentSoft = t.accentSoft ?? hold(mix(panel, t.accent, light ? 0.14 : 0.2), [ink], 7);
    const mark = sf.mark ?? hold(mix(bg, "#e9c13b", light ? 0.45 : 0.32), [ink], 7);
    // Inverted surfaces: a card in the colour of the text, for "stage" and contrasting toolbars
    const inv = n[50];
    const onInv = bg;
    const accentInv = t.accentInv ?? hold(t.accent, [inv], 4.5);
    const done = t.done ?? t.ok;
    const tint = t.tint ?? ai;
    const series = t.series?.length === 6 ? t.series : seriesTones(t, ai);
    const areas = t.areas?.length === 4 ? t.areas : [t.info, tint, ai, t.accent];
    const codeDefault = {
        tag: t.info, attr: t.warn, string: t.ok, comment: ink3, keyword: ai, meta: ink2, entity: t.danger,
    };
    const r = {
        scheme: t.scheme,
        "scheme-inv": light ? "dark" : "light",
        bg, panel, raised, field, hover,
        selection: mix(panel, t.accent, light ? 0.16 : 0.24),
        line, "line-strong": lineStrong,
        ink, "ink-2": ink2, "ink-3": ink3,
        accent: t.accent,
        "accent-ink": t.accentInk ?? hold(t.accent, [panel, bg], 4.5),
        "accent-soft": accentSoft,
        "accent-fill": accentFill,
        "accent-fill-hover": t.accentFillHover ?? mix(accentFill, onAccent === "#ffffff" ? "#000000" : "#ffffff", 0.1),
        "accent-2": accent2,
        "on-accent": onAccent,
        mark,
        ok: t.ok, warn: t.warn, danger: t.danger, info: t.info,
        "on-ok": textOn(t.ok, bg, t.fg), "on-warn": textOn(t.warn, bg, t.fg),
        "on-danger": textOn(t.danger, bg, t.fg), "on-info": textOn(t.info, bg, t.fg),
        overlay,
        "overlay-hover": sf.overlayHover ?? (light ? tone(0.93) : tone(0.77)),
        "overlay-line": sf.overlayLine ?? tone(light ? 0.65 : 0.7),
        inv,
        "inv-raised": mix(inv, onInv, 0.07),
        "inv-hover": mix(inv, onInv, 0.12),
        "inv-line": mix(inv, onInv, 0.2),
        "inv-line-strong": hold(mix(inv, onInv, 0.45), [inv], 3),
        "on-inv": onInv,
        "on-inv-2": hold(mix(onInv, inv, 0.28), [inv, mix(inv, onInv, 0.12)], 4.5),
        "on-inv-3": hold(mix(onInv, inv, 0.42), [inv], 3),
        "accent-inv": accentInv,
        "on-accent-inv": textOn(accentInv, inv, onInv),
        "accent-inv-soft": mix(inv, accentInv, 0.16),
        tint,
        ai, "on-ai": textOn(ai, bg, t.fg),
        done, "on-done": textOn(done, bg, t.fg),
        shadow: light ? "rgb(0 0 0 / 0.16)" : "rgb(0 0 0 / 0.45)",
    };
    for (const s of STEPS)
        r[`n-${s}`] = n[s];
    series.forEach((c, i) => (r[`series-${i + 1}`] = c));
    areas.forEach((c, i) => (r[`area-${i + 1}`] = c));
    for (const k of CODE_ROLES)
        r[`code-${k}`] = hold(t.code?.[k] ?? codeDefault[k], [bg], 4.5);
    return r;
}
/** Six tones spread round the circle from the assistant's, none near a colour with meaning, none near
 *  each other (CodeDeck's session colours). */
function seriesTones(t, ai) {
    const [L, C, h0] = lch(ai);
    const taken = [t.accent, t.warn, t.danger].map((c) => lch(c)[2]);
    let hues = [];
    for (const space of [55, 45, 36, 28]) {
        hues = [];
        for (let d = 0; d < 360 && hues.length < 6; d += 6) {
            const h = (h0 + d) % 360;
            if (taken.every((x) => hueGap(x, h) >= 40) && hues.every((x) => hueGap(x, h) >= space))
                hues.push(h);
        }
        if (hues.length === 6)
            break;
    }
    while (hues.length < 6)
        hues.push((h0 + hues.length * 60) % 360);
    return hues.map((h, k) => fromLch(L + (k % 2 ? 0.05 : -0.02), Math.max(C, 0.12), h));
}
