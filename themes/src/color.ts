// Colour maths: OKLab for mixing, WCAG for contrast. Taken from CodeDeck's src/palette.ts, where it was
// tried on nine themes. No DOM: the check runs under Node as well.

type Rgb = [number, number, number];
type Lab = [number, number, number];

function rgb(hex: string): Rgb {
  let h = hex.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as Rgb;
}
const toHex = (c: number[]) =>
  "#" + c.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("");
const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const gam = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.max(v, 0) ** (1 / 2.4) - 0.055);

function lab(hex: string): Lab {
  const [r, g, b] = rgb(hex).map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
function fromLab([L, a, b]: Lab): string {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return toHex(
    [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ].map(gam),
  );
}

/** `x` moved by `t` (0 … 1) towards `y`, in OKLab: the same as CSS `color-mix(in oklab, x, y t*100%)` */
export function mix(x: string, y: string, t: number): string {
  const a = lab(x),
    b = lab(y);
  return fromLab(a.map((v, i) => v + (b[i] - v) * t) as Lab);
}
export function lch(hex: string): [number, number, number] {
  const [L, a, b] = lab(hex);
  return [L, Math.hypot(a, b), ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360];
}
export const fromLch = (L: number, C: number, h: number) =>
  fromLab([L, C * Math.cos((h * Math.PI) / 180), C * Math.sin((h * Math.PI) / 180)]);

export function luminance(hex: string): number {
  const [r, g, b] = rgb(hex).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
/** WCAG contrast ratio, 1 … 21 */
export function contrast(x: string, y: string): number {
  const [a, b] = [luminance(x), luminance(y)].sort((p, q) => q - p);
  return (a + 0.05) / (b + 0.05);
}
/** How far apart two colours look: OKLab distance × 100 */
export function distance(x: string, y: string): number {
  const a = lab(x),
    b = lab(y);
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) * 100;
}
/** `c` made lighter or darker, away from `against`, until it has `ratio` against it */
export function reach(c: string, against: string, ratio: number): string {
  let [L] = lch(c);
  const [, C, h] = lch(c);
  const up = luminance(against) < 0.18;
  for (let i = 0; i < 80 && contrast(fromLch(L, C, h), against) < ratio; i++) L += up ? 0.01 : -0.01;
  return fromLch(L, C, h);
}
/** Of two colours, the one that reads better on `fill` */
export const textOn = (fill: string, a: string, b: string) => (contrast(a, fill) >= contrast(b, fill) ? a : b);

export const hueGap = (x: number, y: number) => Math.min(Math.abs(x - y), 360 - Math.abs(x - y));
