import { type Appearance } from "./types.js";
declare class SxAppearance extends HTMLElement {
    #private;
    static observedAttributes: string[];
    constructor();
    get value(): Appearance;
    set value(v: Appearance);
    connectedCallback(): void;
    attributeChangedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sx-appearance": SxAppearance;
    }
}
export type { SxAppearance };
