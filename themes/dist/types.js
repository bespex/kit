// The two things a user chooses in every app: a colour theme (only colours) and a style (only form and
// weight, no colour of its own). See PLAN.md K1 and K2.
export const CODE_ROLES = ["tag", "attr", "string", "comment", "keyword", "meta", "entity"];
export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
/** The axes in the order the picker shows them, with their steps from quiet to strong. */
export const AXES = {
    shape: ["sharp", "soft", "round"],
    structure: ["lines", "surfaces", "depth"],
    chrome: ["flat", "raised", "contrast"],
    emphasis: ["calm", "strong", "stage"],
    density: ["compact", "normal", "airy"],
    color: ["neutral", "tinted", "colorful"],
    effects: ["none", "subtle", "rich"],
};
