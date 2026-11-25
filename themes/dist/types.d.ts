/** A colour theme file (themes/colors/*.json). Required are the colours with meaning; everything else
 *  is derived unless the theme sets it, so every theme delivers every role. */
export interface ColorTheme {
    /** Stable, lower case, English */
    id: string;
    name: {
        de: string;
        en: string;
    };
    scheme: "light" | "dark";
    bg: string;
    fg: string;
    accent: string;
    ok: string;
    warn: string;
    danger: string;
    info: string;
    /** Assistant (AI); default: derived from `info`, turned away from the other meanings */
    ai?: string;
    /** Something finished, as an event (CodeDeck: a turn is done); default `ok` */
    done?: string;
    /** Goes into greys and backdrops; default `ai` */
    tint?: string;
    accent2?: string;
    /** The accent as readable text on `panel` (4.5:1) */
    accentInk?: string;
    /** A soft background in the accent (selection, drop target) */
    accentSoft?: string;
    accentFill?: string;
    accentFillHover?: string;
    onAccent?: string;
    /** The accent on inverted surfaces */
    accentInv?: string;
    /** Colour of shadows (any CSS colour); default a dark shadow fitting the scheme. Neon lets its
     *  shadows glow in its accent this way. */
    shadow?: string;
    /** Six colours for sessions, projects, people, charts */
    series?: string[];
    /** Four colours the regions of a window take with the style axis `color`; default info, tint, ai, accent */
    areas?: string[];
    /** How much more of the area colours goes into the regions than in other themes (default 1); a
     *  colourful theme stays colourful with a calm style this way. The check holds every step. */
    areaBoost?: number;
    code?: Partial<Record<CodeRole, string>>;
    /** The neutral scale, 11 steps from the strongest text (50) to the ground (950) */
    neutral?: string[];
    surfaces?: Partial<Record<"panel" | "raised" | "field" | "hover" | "line" | "lineStrong" | "overlay" | "overlayHover" | "overlayLine" | "mark", string>>;
}
export type CodeRole = "tag" | "attr" | "string" | "comment" | "keyword" | "meta" | "entity";
export declare const CODE_ROLES: CodeRole[];
export declare const STEPS: readonly [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
/** Every role of a theme as a plain colour, keyed by the name of its CSS variable without `--sx-`. */
export type Roles = Record<string, string> & {
    scheme: "light" | "dark";
};
export interface Style {
    /** Corners of controls */
    shape: "sharp" | "soft" | "round";
    /** How areas set themselves apart: lines, tinted surfaces, shadows */
    structure: "lines" | "surfaces" | "depth";
    /** How controls (toolbars, tabs, status bars) stand apart from the content */
    chrome: "flat" | "raised" | "contrast";
    /** How what matters most stands out */
    emphasis: "calm" | "strong" | "stage";
    /** Spacing and row height */
    density: "compact" | "normal" | "airy";
    /** How much colour goes onto surfaces: areas and series */
    color: "neutral" | "tinted" | "colorful";
    /** Everything decorative: glow, glass, gradients, backdrop, motion */
    effects: "none" | "subtle" | "rich";
}
export type Axis = keyof Style;
/** The axes in the order the picker shows them, with their steps from quiet to strong. */
export declare const AXES: {
    [K in Axis]: Style[K][];
};
/** A finished style (themes/styles/*.json) */
export interface StylePreset extends Style {
    id: string;
    name: {
        de: string;
        en: string;
    };
}
/** What an app stores: a theme id and a style, either a preset id or the seven steps. */
export interface Appearance {
    theme: string;
    style: string | Style;
}
