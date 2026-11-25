import { type ColorTheme } from "./types.js";
/** The variables of one theme: `--sx-<role>`, and `color-scheme`. */
export declare function themeDecls(t: ColorTheme): [string, string][];
/** The whole stylesheet: all themes, the defaults, every step of every axis, the zones. */
export declare function stylesheet(themes: ColorTheme[], auto: {
    light: string;
    dark: string;
}): string;
