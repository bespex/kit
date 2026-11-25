import { type Appearance, type Style } from "./types.js";
export declare const DEFAULT_APPEARANCE: Appearance;
/** Themes that left the set, and the one a stored choice moves to (PLAN.md K8). */
export declare const RETIRED: Record<string, string>;
/** Styles that left the set, and the one a stored choice moves to. */
export declare const RETIRED_STYLES: Record<string, string>;
/** The seven steps of a stored style: a preset's, or the stored steps with unknown values replaced. */
export declare function resolveStyle(style: Appearance["style"] | undefined): Style;
/** A style as it is best stored: the preset's id if all seven steps match one, else the steps. */
export declare function compactStyle(style: Style): Appearance["style"];
/** A stored value made safe: unknown themes become "auto", broken styles the default. */
export declare function normalize(value: unknown): Appearance;
/** Puts theme and style on an element, by default <html>. */
export declare function apply(value: Appearance, el?: HTMLElement): void;
