import type { Axis, Roles, Style } from "./types.js";
/** A colour from roles: a role's name, or `[a, b, t]` = a moved by t towards b (OKLab). */
export type Expr = string | [Expr, Expr, number];
/** A value of a style variable: a colour recipe, or plain CSS (`{ css: "…" }`). */
export type Value = Expr | {
    css: string;
};
/** The roles a zone rebinds, so that components inside need nothing of their own. */
export declare const ZONE_ROLES: readonly ["bg", "panel", "raised", "surface", "field", "hover", "selection", "line", "line-strong", "divider", "ink", "ink-2", "ink-3", "accent", "accent-ink", "accent-soft", "accent-fill", "on-accent"];
/** What each step of each axis sets. Steps missing a variable leave it as the default step has it. */
export declare const RECIPES: {
    [K in Axis]: Record<Style[K], Record<string, Value>>;
};
/** The style a page has when it sets no axis: the preset "calm". */
export declare const DEFAULT_STYLE: Style;
/** A recipe as CSS */
export declare function cssValue(v: Value): string;
/** A colour recipe worked out on the roles of a theme (and the style variables already worked out). */
export declare function evaluate(v: Expr, roles: Record<string, string>): string;
/** Every colour variable a style gives on a theme: roles plus `surface`, `divider`, `chrome-*`, `emph-*`, `area-*-bg`. */
export declare function styled(roles: Roles, style: Style): Record<string, string>;
