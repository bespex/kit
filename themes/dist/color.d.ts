/** `x` moved by `t` (0 … 1) towards `y`, in OKLab: the same as CSS `color-mix(in oklab, x, y t*100%)` */
export declare function mix(x: string, y: string, t: number): string;
export declare function lch(hex: string): [number, number, number];
export declare const fromLch: (L: number, C: number, h: number) => string;
export declare function luminance(hex: string): number;
/** WCAG contrast ratio, 1 … 21 */
export declare function contrast(x: string, y: string): number;
/** How far apart two colours look: OKLab distance × 100 */
export declare function distance(x: string, y: string): number;
/** `c` made lighter or darker, away from `against`, until it has `ratio` against it */
export declare function reach(c: string, against: string, ratio: number): string;
/** Of two colours, the one that reads better on `fill` */
export declare const textOn: (fill: string, a: string, b: string) => string;
export declare const hueGap: (x: number, y: number) => number;
