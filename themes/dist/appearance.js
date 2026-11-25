// <sx-appearance>: the choice of colour theme and style, the same in every app (PLAN.md K4). It goes into
// the app's own settings dialog; the app decides where, stores the value and puts it on the page.
//
//   <sx-appearance lang="de" axes="shape structure chrome emphasis density"></sx-appearance>
//   el.value = { theme: "fjord", style: "calm" };
//   el.addEventListener("change", (e) => save(e.detail));   // detail: { theme, style }
//
// Attributes: `lang` (de | en, else the page's), `axes` (the style axes the app uses; the others are not
// offered). No preview: a choice applies to the app at once. Themes and styles stand in four columns.
// The two headings are parts (`sx-appearance::part(label)`), so an app can give them its own look.
// Without a framework, so React, Svelte and plain HTML use it alike; it takes the page's `--sx-*`
// roles, so it looks like the app.
import { compactStyle, normalize, resolveStyle } from "./apply.js";
import { AUTO, STYLES, THEMES } from "./data.gen.js";
import { derive } from "./derive.js";
import { AXES } from "./types.js";
const TEXT = {
    en: {
        theme: "Colour theme", style: "Style", custom: "Custom", customize: "Adjust",
        auto: "Automatic", autoHint: "Light or dark, as the system",
        shape: "Shape", structure: "Structure", chrome: "Bars", emphasis: "Emphasis", density: "Density", color: "Colourfulness", effects: "Effects",
        "shape.hint": "Corners of controls", "structure.hint": "How areas set themselves apart",
        "chrome.hint": "How toolbars, tabs and status bars stand apart", "emphasis.hint": "How what matters most stands out",
        "density.hint": "Spacing and row height", "color.hint": "How much colour goes onto areas", "effects.hint": "Glow, glass, gradients, motion",
        sharp: "sharp", soft: "soft", round: "round", lines: "lines", surfaces: "surfaces", depth: "depth",
        flat: "as content", raised: "set off", contrast: "inverted", calm: "calm", strong: "strong", stage: "stage",
        compact: "compact", normal: "normal", airy: "airy", neutral: "neutral", tinted: "tinted", colorful: "colourful",
        none: "none", subtle: "subtle", rich: "rich",
        "tool.hint": "Sharp, lines, compact", "calm.hint": "Soft, surfaces, current item stands out",
        "stage.hint": "Clear edges, strong regions, inverted bars and cards",
        "custom.hint": "Your own steps",
    },
    de: {
        theme: "Farbthema", style: "Stil", custom: "Eigener", customize: "Anpassen",
        auto: "Automatisch", autoHint: "Hell oder dunkel wie das System",
        shape: "Form", structure: "Gliederung", chrome: "Leisten", emphasis: "Hervorhebung", density: "Dichte", color: "Farbigkeit", effects: "Effekte",
        "shape.hint": "Ecken der Bedienelemente", "structure.hint": "Wie sich Bereiche absetzen",
        "chrome.hint": "Wie sich Werkzeug-, Reiter- und Statusleisten abheben", "emphasis.hint": "Wie das Wichtigste auffällt",
        "density.hint": "Abstände und Zeilenhöhe", "color.hint": "Wie viel Farbe auf die Bereiche kommt", "effects.hint": "Leuchten, Glas, Verläufe, Bewegung",
        sharp: "eckig", soft: "weich", round: "rund", lines: "Linien", surfaces: "Flächen", depth: "Tiefe",
        flat: "eins", raised: "abgesetzt", contrast: "kontrastiert", calm: "ruhig", strong: "betont", stage: "Bühne",
        compact: "kompakt", normal: "normal", airy: "luftig", neutral: "neutral", tinted: "getönt", colorful: "farbig",
        none: "keine", subtle: "dezent", rich: "reich",
        "tool.hint": "Eckig, Linien, kompakt", "calm.hint": "Weich, Flächen, Aktuelles betont",
        "stage.hint": "Klare Kanten, kräftige Bereiche, Leisten und Karten invertiert",
        "custom.hint": "Eigene Stufen",
    },
};
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const roleCache = new Map();
const rolesOf = (id) => {
    let r = roleCache.get(id);
    if (!r)
        roleCache.set(id, (r = derive(THEMES.find((t) => t.id === id))));
    return r;
};
const OWN_CSS = `
:host { display: block; font: inherit; color: var(--sx-ink, inherit); }
* { box-sizing: border-box; }
.group { margin: 0 0 14px; }
.label { font-weight: 600; margin: 0 0 6px; display: flex; align-items: baseline; gap: 8px; }
.label small { font-weight: 400; color: var(--sx-ink-2, #666); }
.grid { display: grid; gap: 6px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
button { font: inherit; color: inherit; cursor: pointer; background: none; }
.tile { display: flex; flex-direction: column; gap: 5px; padding: 5px; text-align: left;
  border: 1px solid var(--sx-line, #ccc); border-radius: var(--sx-radius-m, 6px); background: var(--sx-field, transparent); }
.tile:hover { background: var(--sx-hover, rgba(0,0,0,.05)); }
.tile[aria-checked="true"] { border-color: var(--sx-accent, #36c); box-shadow: inset 0 0 0 1px var(--sx-accent, #36c); }
.tile .name { display: flex; justify-content: space-between; gap: 4px; font-size: .92em; }
.tile .hint { font-size: .8em; color: var(--sx-ink-2, #666); }
.tile[aria-checked="true"] .name::after { content: "✓"; color: var(--sx-accent-ink, var(--sx-accent, #36c)); }
:focus-visible { outline: 2px solid var(--sx-accent, #36c); outline-offset: 1px; }
.sw { position: relative; height: 34px; border-radius: calc(var(--sx-radius-m, 6px) - 2px); overflow: hidden; border: 1px solid rgb(0 0 0 / .18); }
.sw .bar { position: absolute; inset: 0 0 auto 0; height: 9px; }
.sw .t1, .sw .t2 { position: absolute; left: 7px; height: 3px; border-radius: 2px; }
.sw .t1 { top: 14px; width: 46%; } .sw .t2 { top: 21px; width: 30%; }
.sw .dots { position: absolute; right: 6px; bottom: 5px; display: flex; gap: 3px; }
.sw .dots i { width: 7px; height: 7px; border-radius: 50%; display: block; }
.sw .half { position: absolute; inset: 0; clip-path: polygon(100% 0, 100% 100%, 0 100%); }
.axes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 16px; margin-top: 8px; }
.axis-cell { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.axes .axis { font-size: .85em; color: var(--sx-ink-2, #666); }
.seg { display: flex; border: 1px solid var(--sx-line-strong, #888); border-radius: var(--sx-radius-m, 6px); overflow: hidden; }
.seg button { flex: 1; min-width: 0; border: 0; padding: 3px 6px; font-size: .88em; border-left: 1px solid var(--sx-line, #ccc);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.seg button:first-child { border-left: 0; }
.seg button[aria-checked="true"] { background: var(--sx-accent-fill, #36c); color: var(--sx-on-accent, #fff); }
.more { border: 0; padding: 2px 0; color: var(--sx-accent-ink, #36c); font-size: .92em; }
`;
class SxAppearance extends HTMLElement {
    static observedAttributes = ["lang", "axes"];
    #value = normalize(undefined);
    #open = false;
    #root;
    constructor() {
        super();
        this.#root = this.attachShadow({ mode: "open" });
        this.#root.addEventListener("click", (e) => this.#click(e));
        this.#root.addEventListener("keydown", (e) => this.#key(e));
    }
    get value() {
        return { ...this.#value };
    }
    set value(v) {
        this.#value = normalize(v);
        this.#render();
    }
    connectedCallback() {
        this.#render();
    }
    attributeChangedCallback() {
        if (this.isConnected)
            this.#render();
    }
    #lang() {
        const l = (this.getAttribute("lang") || this.closest("[lang]")?.getAttribute("lang") || navigator.language || "en").slice(0, 2);
        return l === "de" ? "de" : "en";
    }
    #axes() {
        const all = Object.keys(AXES);
        const want = (this.getAttribute("axes") || "").split(/[\s,]+/).filter(Boolean);
        return want.length ? all.filter((a) => want.includes(a)) : all;
    }
    #set(next) {
        this.#value = normalize(next);
        this.#render();
        this.dispatchEvent(new CustomEvent("change", { detail: this.value, bubbles: true }));
    }
    #click(e) {
        const el = e.target.closest("[data-pick]");
        if (!el)
            return;
        const [kind, a, b] = el.dataset.pick.split(":");
        if (kind === "theme")
            this.#set({ ...this.#value, theme: a });
        else if (kind === "preset")
            this.#set({ ...this.#value, style: a });
        else if (kind === "custom")
            (this.#open = true), this.#render();
        else if (kind === "toggle")
            (this.#open = !this.#open), this.#render();
        else if (kind === "axis") {
            const s = { ...resolveStyle(this.#value.style), [a]: b };
            this.#set({ ...this.#value, style: compactStyle(s) });
        }
    }
    /** Arrow keys move and choose within a group, as radio buttons do. */
    #key(e) {
        const radio = e.target.closest('[role="radio"]');
        const group = radio?.closest('[role="radiogroup"]');
        if (!radio || !group)
            return;
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!step)
            return;
        e.preventDefault();
        const all = [...group.querySelectorAll('[role="radio"]')];
        const next = all[(all.indexOf(radio) + step + all.length) % all.length];
        next.click();
        this.#root.querySelector(`[data-pick="${next.dataset.pick}"]`)?.focus();
    }
    #render() {
        const T = TEXT[this.#lang()];
        const focused = this.#root.activeElement?.dataset.pick;
        const style = resolveStyle(this.#value.style);
        const preset = typeof this.#value.style === "string" ? this.#value.style : "";
        const radio = (pick, on, cls, inner, label) => `<button type="button" role="radio" class="${cls}" data-pick="${pick}" aria-checked="${on}" tabindex="${on ? 0 : -1}"${label ? ` aria-label="${esc(label)}"` : ""}>${inner}</button>`;
        const themes = [
            // "auto" shows its light and its dark theme, split along the diagonal
            radio("theme:auto", this.#value.theme === "auto", "tile", `<span class="sw">${swatchInner(AUTO.light)}<span class="half">${swatchInner(AUTO.dark)}</span></span><span class="name">${esc(T.auto)}</span>`, `${T.auto}: ${T.autoHint}`),
            ...THEMES.map((t) => radio(`theme:${t.id}`, this.#value.theme === t.id, "tile", `${swatch(t.id)}<span class="name">${esc(t.name[this.#lang()])}</span>`)),
        ];
        const presets = STYLES.map((p) => radio(`preset:${p.id}`, preset === p.id, "tile", `<span class="name">${esc(p.name[this.#lang()])}</span><span class="hint">${esc(T[`${p.id}.hint`] ?? "")}</span>`));
        presets.push(radio("custom", !preset, "tile", `<span class="name">${esc(T.custom)}</span><span class="hint">${esc(T["custom.hint"])}</span>`));
        const axes = this.#axes()
            .map((axis) => `<div class="axis-cell"><span class="axis" title="${esc(T[`${axis}.hint`])}">${esc(T[axis])}</span><span class="seg" role="radiogroup" aria-label="${esc(T[axis])}">${AXES[axis]
            .map((step) => radio(`axis:${axis}:${step}`, style[axis] === step, "", esc(T[step])))
            .join("")}</span></div>`)
            .join("");
        this.#root.innerHTML = `<style>${OWN_CSS}</style>
      <div class="group"><p class="label" part="label">${esc(T.theme)}</p><div class="grid" role="radiogroup" aria-label="${esc(T.theme)}">${themes.join("")}</div></div>
      <div class="group"><p class="label" part="label">${esc(T.style)}</p><div class="grid" role="radiogroup" aria-label="${esc(T.style)}">${presets.join("")}</div>
        ${preset ? `<button type="button" class="more" data-pick="toggle" aria-expanded="${this.#open}">${esc(T.customize)} ${this.#open ? "▴" : "▾"}</button>` : ""}
        ${this.#open || !preset ? `<div class="axes">${axes}</div>` : ""}</div>`;
        if (focused)
            this.#root.querySelector(`[data-pick="${focused}"]`)?.focus();
    }
}
/** A small window in the theme's colours: ground, bar, two text lines, the colours with meaning. */
function swatchInner(id) {
    const r = rolesOf(id);
    return `<span style="position:absolute;inset:0;background:${r.bg}"></span><span class="bar" style="background:${r.panel};border-bottom:1px solid ${r.line}"></span>` +
        `<span class="t1" style="background:${r.ink}"></span><span class="t2" style="background:${r["ink-2"]}"></span>` +
        `<span class="dots"><i style="background:${r.accent}"></i><i style="background:${r.ok}"></i><i style="background:${r.warn}"></i><i style="background:${r.danger}"></i></span>`;
}
const swatch = (id) => `<span class="sw">${swatchInner(id)}</span>`;
if (typeof customElements !== "undefined" && !customElements.get("sx-appearance"))
    customElements.define("sx-appearance", SxAppearance);
