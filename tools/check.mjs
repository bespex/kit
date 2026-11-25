// Checks every theme in themes/colors against the guard rails (themes/src/check.ts), over every
// colour-changing step of the style axes. Exits with 1 if one breaks a rule. Run `npm run build` first.
//
//   npm run check            all themes, only what fails (and a line per theme)
//   npm run check -- -v      every rule with its value

import { check, THEMES } from "../themes/dist/index.js";

const verbose = process.argv.includes("-v");
let broken = 0;
for (const theme of THEMES) {
  const findings = check(theme);
  const fails = findings.filter((f) => !f.ok);
  broken += fails.length;
  console.log(`${fails.length ? "✗" : "✓"} ${theme.name.en} (${theme.id}): ${findings.length - fails.length} of ${findings.length} rules met`);
  for (const f of verbose ? findings : fails) {
    const value = f.kind === "contrast" ? `${f.value.toFixed(2)} : 1, needs ${f.need}` : `apart ${f.value.toFixed(1)}, needs ${f.need}`;
    console.log(`    ${f.ok ? "ok  " : "FAIL"} ${f.rule.padEnd(52)} ${value}   ${f.a} / ${f.b}`);
  }
}
process.exit(broken ? 1 : 0);
