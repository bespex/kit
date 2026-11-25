import { type ColorTheme } from "./types.js";
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
export declare function check(t: ColorTheme): Finding[];
