# @bespex/themes

Colour themes and styles for the be spex apps. The user chooses two things in every app, independently:

- a **colour theme** (only colours): `auto`, `paper`, `frost`, `sage`, `colorful`, `graphite`, `fjord`,
  `forest`, `moon`, `elegance`, `studio`, `terminal` (12, four in a row in the picker);
- a **style** (only form and weight, no colour of its own): one of three presets, `tool`, `calm`
  (default), `stage`, or seven steps of the user's own.

Each app stores its own choice. All themes pass the same check, with every style.

## Use it in an app

```ts
import "@bespex/themes/sx.css";                 // every theme, every style step, the zones
import { apply, normalize } from "@bespex/themes";
import "@bespex/themes/appearance";              // defines <sx-appearance>

apply(normalize(stored));                        // sets data-sx-theme and data-sx-<axis> on <html>
```

In the settings dialog:

```html
<sx-appearance lang="de" axes="shape structure chrome emphasis"></sx-appearance>
```

```ts
picker.value = normalize(stored);
picker.addEventListener("change", (e) => { apply(e.detail); save(e.detail); });
```

`axes` lists the style axes that change something in the app; the picker offers only those. There is
no preview: the choice applies to the app at once. Themes and styles stand in four columns, so give the
picker the width of a settings page (about 440 px or more). Its two headings are the part `label`
(`sx-appearance::part(label) { … }`), so they can look like the app's own headings. Without a build step (Maillet), take `dist/sx.css` and the
modules in `dist/` as a copy.

## Roles

Components use only roles, never colour values: `var(--sx-<role>)`. Every theme delivers every role,
derived where the theme file is silent. An app takes what it needs.

| Level | Roles |
|---|---|
| Ground | `bg`, `panel`, `raised`, `field`, `hover`, `selection`, `line`, `line-strong`, `ink`, `ink-2`, `ink-3`, `accent`, `accent-ink` (accent as text), `accent-soft` (background), `accent-fill` + `on-accent` (buttons), `mark`, `ok`, `warn`, `danger`, `info` |
| Extended | `n-50` … `n-950`, `accent-2`, `accent-fill-hover`, `on-ok`, `on-warn`, `on-danger`, `on-info`, `overlay`, `overlay-hover`, `overlay-line`, `inv`, `inv-raised`, `inv-hover`, `inv-line`, `inv-line-strong`, `on-inv`, `on-inv-2`, `on-inv-3`, `accent-inv`, `on-accent-inv`, `accent-inv-soft`, `series-1` … `series-6`, `tint`, `shadow`, `scheme`, `scheme-inv` |
| Special | `ai`, `on-ai`, `done`, `on-done`, `code-tag`, `code-attr`, `code-string`, `code-comment`, `code-keyword`, `code-meta`, `code-entity`, `area-1` … `area-4` |

## Style axes

| Axis | Steps | Variables and zones |
|---|---|---|
| `shape` | sharp · soft · round | `--sx-radius-s/m/l` |
| `structure` | lines · surfaces · depth | `--sx-surface` (cards, lists), `--sx-divider`, `--sx-shadow-1/2` |
| `chrome` | flat · raised · contrast | inside `.sx-chrome` the roles are rebound; `--sx-chrome-*` |
| `emphasis` | calm · strong · stage | inside `.sx-emphasis` the roles are rebound; `--sx-emph-border`, `--sx-emph-border-w`, `--sx-emph-shadow` |
| `density` | compact · normal · airy | `--sx-space-1` … `--sx-space-4`, `--sx-row` |
| `color` | neutral · tinted · colorful | `.sx-area[data-area="1…4"]` gets its region's surface; `--sx-series-fill` |
| `effects` | none · subtle · rich | `--sx-glow`, `--sx-glass`, `--sx-glass-blur`, `--sx-gradient`, `--sx-backdrop`, `--sx-duration` |

The app decides what a zone is: Tasqlet's tabs, quick entry and footer are `.sx-chrome`, its current
task is `.sx-emphasis`. Components inside a zone keep using the plain roles. Put theme and style on the
same element (`apply` does).

## Files

| Path | What |
|---|---|
| `colors/*.json` | the colour themes: required colours with meaning, the rest optional |
| `styles/*.json` | the four presets |
| `src/color.ts` | OKLab mixing, WCAG contrast (from CodeDeck) |
| `src/derive.ts` | theme file → every role |
| `src/style.ts` | the style axes as recipes over roles; one table for CSS and check |
| `src/check.ts` | guard rails over every theme × every colour-changing style step |
| `src/css.ts` | the stylesheet |
| `src/apply.ts` | `apply`, `normalize`, `resolveStyle`, `compactStyle` |
| `src/appearance.ts` | `<sx-appearance>` |
| `gallery/` | every theme in the chosen style, with the picker (`npm run gallery`, then `/themes/gallery/`) |

Build with `npm run build` (writes `dist/`, which is checked in), check with `npm run check`.
