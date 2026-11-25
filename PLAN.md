# kit: Plan

Was das Kit bekommen soll. Stand 2026-11-25, hervorgegangen aus Teil I von `../PLAN.md`.

**Grundsatz:** Ins Kit kommt nur, was mindestens zwei Apps wirklich nutzen. Was sich nicht lohnt, wird
nicht gebaut: kein geteilter i18n-Code, keine MCP-Bibliothek, kein gemeinsames Popover, kein Rahmen für
Einstellungsseiten.

## Brainstorm-Ideen

- Achse **Schrift** (System · Rund · Mono) als achte Stilachse; `terminal` wirkt ohne Mono nur halb.
- Ist das Thema `colorful` neben der Farbigkeit „farbig“ noch nötig, oder wird es Papier mit kräftigen
  Bereichsfarben?
- `moon` und `elegance` liegen nah beieinander (Gold auf Dunkel); `moon` kühler und blauer ziehen (E4).
- **Akzent der App:** Eine Einstellung ersetzt den Akzent des Themas durch die Markenfarbe der App
  (CodeDeck-Orange, Maillet-Petrol, Tasqlet-Rostrot). Die Prüfung müsste diese Paare mittesten (E3).
- Eigene Themen und Stile der Nutzer als Datei im Konfig-Ordner der App, mit derselben Prüfung.
- Ein Rust-Crate mit denselben Theme-JSON-Dateien, erst wenn etwas außerhalb der Oberfläche Themen braucht.
- CI gleicht `docs/glossary.md` mit den i18n-Dateien der Apps ab.
- Pictorix und HatRack bekommen mindestens `auto` (Papier/Graphit) aus `themes.css`.

## Geplante Umsetzungen

### K0 Repository

- **Öffentlich machen.** Alle Apps sind öffentlich und bauen ihre Releases in GitHub Actions; die
  AUR-Pakete bauen aus dem Quelltext. Ein privates Kit können weder die CI noch fremde Rechner laden.
- **Einbindung ohne Registry:** Die Wurzel des Repos trägt eine `package.json` mit dem Namen
  `@bespex/themes`; `files` beschränkt das Paket auf `themes/`. Die Apps laden es per Git-Tag
  (`github:bespex/kit#themes-v1.0.0`). `themes/dist/` wird eingecheckt, damit beim Installieren nichts
  gebaut werden muss.
- Eine `Cargo.toml` als Workspace mit `desktop/` als Mitglied; Cargo findet `bespex-desktop` im Git-Repo
  per Name.
- Tags je Teil: `themes-v…`, `desktop-v…`.

### K1 Farbthemen

**Ein Thema liefert immer alle Farben**, auch die, die nur CodeDeck braucht (KI, Bereiche, Reihen, Code).
Was die Theme-Datei nicht setzt, leitet die Bibliothek ab. Eine einfache App nimmt nur Stufe 1, CodeDeck
alle drei.

Drei Ebenen:

1. **Theme-Datei:** wenige Pflichtfarben mit Bedeutung, dazu optionale Feinsteuerung. Daten, kein CSS,
   kein Stil.
2. **Ableitung:** Die Bibliothek rechnet alle Rollen (OKLab-Mischung, WCAG-Kontrast), herausgelöst aus
   CodeDecks `src/palette.ts`.
3. **Rollen als CSS-Variablen** mit dem Präfix `--sx-`. Apps nutzen nur Rollen, nie Farbwerte.

**Stufe 1: Grund** (jede App mit Themen)

| Rolle | Wofür |
|---|---|
| `bg` | Fenstergrund |
| `panel`, `raised` | Flächen, Karten, Menüs |
| `field`, `hover`, `selection` | Eingabefelder, Überfahren, Auswahl |
| `line`, `line-strong` | Trennlinie; Rahmen von Kontrollen (3:1) |
| `ink`, `ink-2`, `ink-3` | Text 7:1, Nebentext 4,5:1, Platzhalter 3:1 |
| `accent`, `accent-soft`, `on-accent` | Hervorhebung, Fokusring, Knopf |
| `mark` | Suchtreffer |
| `ok`, `warn`, `danger`, `info` | erledigt/hinzugefügt, wartet, Problem, verschoben/Hinweis |

**Stufe 2: Erweitert**

| Rolle | Wofür |
|---|---|
| `n-50` … `n-950` | Neutralskala, 11 Stufen |
| `accent-2`, `accent-fill`, `accent-fill-hover` | zweiter Akzent, gefüllte Knöpfe |
| `on-ok`, `on-warn`, `on-danger`, `on-info` | Schrift auf gefüllten Zustandsflächen |
| `overlay`, `overlay-hover`, `overlay-line` | schwebende Flächen |
| `inv`, `on-inv`, `accent-inv` | invertierte Flächen (Toast, Leisten „kontrastiert“, Hervorhebung „Bühne“) |
| `series-1` … `series-8` | Reihenfarben: Sitzungen, Projekte, Personen, Diagramme |
| `tint` | Farbe für Grautöne, getönte Flächen und Schimmer |

**Stufe 3: Fachrollen**

| Gruppe | Rollen | Wer |
|---|---|---|
| KI | `ai`, `on-ai` | CodeDeck, Tasqlets MCP-Kennzeichen |
| Code | `code-tag`, `code-attr`, `code-string`, `code-comment`, `code-keyword`, `code-meta`, `code-entity` | Qiew (heute `--x-*`), CodeDeck-Vorschau |
| Bereiche | `area-1` … `area-6`: Grundfarbe je Bereich des Fensters | CodeDeck (Dateien, Reiter, Seite, Leiste), Tasqlet |

Die Bereichsfarben sind Farben des Themas. **Wie stark** sie die Flächen tönen, bestimmt die Stilachse
Farbigkeit (K2). Die App ordnet ihre Bereiche den Nummern zu.

**Theme-Datei** (CodeDeck-Format, ohne Stilangaben):

```jsonc
{
  "id": "fjord",
  "name": { "de": "Fjord", "en": "Fjord" },
  "scheme": "dark",
  "bg": "#1d2430", "fg": "#e6ebf2", "accent": "#7cbcff",
  "ok": "#8fcf9a", "warn": "#e0b070", "danger": "#e6707a", "info": "#8fb1cf",
  // optional, sonst abgeleitet
  "ai": "#a69cff",
  "series": ["#7f95ff", "#4fc9bd", "#e391d0", "#c3cf6c", "#62b6ee", "#c08cf5"],
  "areas": ["#7cbcff", "#a69cff", "#4fc9bd"],
  "code": { "tag": "#81a1c1", "string": "#a3be8c", "comment": "#7b88a1" },
  "neutral": ["…11 Stufen…"], "surfaces": { "panel": "#252d3a" }
}
```

**Der Satz:** 13 Themen, Werte aus dem Bestand abgeglichen.

| id | Name (de / en) | Art | Charakter | aus dem Bestand |
|---|---|---|---|---|
| `auto` | Automatisch / Automatic | hell/dunkel | folgt dem System: Papier oder Graphit | Tasqlet, Qiew ohne Wahl |
| `paper` | Papier / Paper | hell | warmes Weiß, ruhiger Akzent | CodeDeck Paper, Qiew Soft Light, Tasqlet Papier |
| `graphite` | Graphit / Graphite | dunkel | neutrales Dunkelgrau | CodeDeck „CodeDeck“, Qiew Soft Dark, Tasqlet Graphit |
| `sepia` | Sepia | hell | Lesepapier, braun | Qiew Sepia |
| `fjord` | Fjord | dunkel | kühles Blaugrau | Qiew Slate/Nord, Tasqlet Fjord |
| `sage` | Salbei / Sage | hell | gedämpftes Grün | Tasqlet (geplant) |
| `forest` | Wald / Forest | dunkel | erdig, warmes Orange | CodeDeck Forest |
| `moon` | Mond / Moon | dunkel | Nachtblau, Gold | CodeDeck Moon |
| `elegance` | Eleganz / Elegance | dunkel | fast Schwarz, Messing | CodeDeck Elegance |
| `colorful` | Bunt / Colorful | hell | kräftige Bereichsfarben | CodeDeck Colorful |
| `neon` | Neon | dunkel | Schwarz, Pink | CodeDeck Fancy |
| `terminal` | Terminal | dunkel | Grünschwarz | CodeDeck Terminal |
| `contrast` | Kontrast / Contrast | dunkel | höchste Kontraste | CodeDeck Contrast, Tasqlet Kontrast |

Jede App zeigt den ganzen Satz. Vorgaben: CodeDeck `graphite`, Tasqlet `fjord`, Qiew `auto`,
Maillet `auto`.

**Abnahme:** Alle Themen bestehen die Prüfung (K3); die Galerie zeigt jede Stufe in jedem Thema.

### K2 Stile

Ein Stil bestimmt Form und Gewicht, **ohne eigene Farbe**. Er ist unabhängig vom Farbthema wählbar.
Jede Achse beschreibt eine Bedeutung, die App entscheidet, auf welche Elemente sie wirkt.

| Achse | Stufen | Bedeutung | Die App wendet sie an auf, z. B. |
|---|---|---|---|
| `shape` Form | eckig · weich · rund | Ecken der Bedienelemente | überall gleich |
| `structure` Gliederung | Linien · Flächen · Tiefe | Bereiche setzen sich ab durch Trennlinien, getönte Flächen oder Schatten | Spalten, Karten, Zeilen, Menüs |
| `chrome` Leisten | eins · abgesetzt · kontrastiert | Bedienung hebt sich vom Inhalt ab: gleiche Fläche, getönt mit kräftiger Linie, invertiert | Toolbar, Reiter, Status-, Seiten-, Fußleiste |
| `emphasis` Hervorhebung | ruhig · betont · Bühne | Das Wichtige fällt auf: feiner Akzentrand, getönte Fläche mit Schatten, invertierte Karte | aktuelle Aufgabe, „wartet auf dich“, geöffnete Mail, Auswahl |
| `density` Dichte | kompakt · normal · luftig | Abstände und Zeilenhöhe | Listen, Formulare, Leisten |
| `color` Farbigkeit | neutral · getönt · farbig | Wie viel Farbe auf Flächen kommt: nur Bedeutungsfarben; Bereiche und Reihen leicht getönt; Bereiche kräftig, Reihenfarben auf Flächen | Bereiche (`area-*`), Sitzungen/Projekte (`series-*`), Schimmer |
| `effects` Effekte | keine · dezent · reich | Alles Schmückende: Leuchten, Glas, Verläufe, Hintergrundschimmer, Bewegung | wo die App Schmuck vorsieht |

- „Weniger Bewegung“ des Systems gilt immer, auch bei `effects: reich`.
- CodeDeck darf intern feiner auflösen (etwa `glow`, `glass`, `gradient`, `backdrop` aus `effects`).
  `events` bleibt eine Einstellung von CodeDeck, nicht des Kits.

**Anwendung über Markierungen.** Die App setzt Klassen, die Bibliothek belegt darin die Rollen neu:

```html
<header class="sx-chrome">…</header>          <!-- Leisten -->
<article class="sx-emphasis">…</article>     <!-- Hervorhebung -->
<section class="sx-area" data-area="2">…</section>  <!-- Farbigkeit -->
```

In `.sx-chrome` zeigen bei „kontrastiert“ `--sx-bg`, `--sx-ink`, `--sx-line` auf die invertierten Werte;
die Komponenten darin merken nichts. Form, Dichte und Gliederung wirken über Variablen
(`--sx-radius-*`, `--sx-space-*`, `--sx-shadow-*`, `--sx-divider`). Was eine App nicht markiert, bleibt
unberührt.

**Vier fertige Stile**, dazu „Eigener Stil“ mit den sieben Reglern:

| id | Name | Form | Gliederung | Leisten | Hervorhebung | Dichte | Farbigkeit | Effekte |
|---|---|---|---|---|---|---|---|---|
| `tool` | Werkzeug | eckig | Linien | eins | ruhig | kompakt | neutral | keine |
| `calm` | Ruhig | weich | Flächen | eins | betont | normal | getönt | keine |
| `plastic` | Plastisch | rund | Tiefe | abgesetzt | betont | normal | getönt | dezent |
| `stage` | Bühne | weich | Flächen | kontrastiert | Bühne | luftig | farbig | reich |

Vorgabe überall `calm`.

**Abnahme:** Die Galerie schaltet jede Achse an jedem Thema durch; Tasqlets bisherige Achsen
(`focus`, `chrome`) sind ohne Verlust als `emphasis` und `chrome` abgebildet.

### K3 Prüfung

Eine Prüfung für alle Themen, alle Stile und alle Apps, zusammengeführt aus CodeDeck (`tools/theme-check.mjs`)
und Tasqlet (Konzept 7.1). Sie testet die **Matrix Thema × Stil**, also auch Rollen innerhalb von
`sx-chrome` und `sx-emphasis` bei jeder Stufe.

- Kontraste: `ink` 7:1, `ink-2` 4,5:1, `ink-3` 3:1 auf `bg`, `panel`, `field` und auf den getönten
  Flächen jeder Farbigkeit; `line-strong` 3:1; `accent` 4,5:1; `on-*` 4,5:1; `ink` auf `mark` 7:1.
- Unterscheidbarkeit in OKLab: die vier Zustandsfarben, `accent` und `ai`; die Reihenfarben untereinander.
- Code-Farben 4,5:1 auf `bg`.
- `tools/check.mjs` läuft in der CI des Kits.

### K4 Auswahl je App

- Jede App speichert ihre Wahl `{ "theme": "fjord", "style": "calm" }` (oder einen eigenen Stil) in
  ihrer eigenen Konfiguration. **Keine App-übergreifende Wahl.**
- `<sx-theme-picker>` und `<sx-style-picker>` als Web Components ohne Framework, mit Vorschau-Kacheln,
  in React, Svelte und HTML ohne Build gleich nutzbar.
- `apply.ts` legt Thema und Stil auf das Wurzelelement, löst `auto` über die Systemwahl auf und hält
  die letzte Wahl für den ersten Frame bereit.
- `dist/themes.css` und `dist/apply.js` für Apps ohne Build.

### K5 Umstellung der Apps

| Schritt | App | Inhalt | Abnahme |
|---|---|---|---|
| U1 | CodeDeck | Thema und Stil trennen: jedes bisherige Thema wird Farbthema + Stil; `--t-*` als Alias auf `--sx-*`, dann ersetzen; IDs abbilden (`codedeck` → `graphite`, `fancy` → `neon`) | jedes bisherige Thema sieht mit seinem Stil aus wie vorher (Screenshot-Vergleich) |
| U2 | Qiew `packages/frame` | vier feste Blöcke durch den Satz ersetzen, `--x-*` → `code-*`, beide Auswahlen im Menü; `soft-light` → `paper`, `soft-dark` → `graphite`, `nord` → `fjord` | jede Qiew-App in allen Themen lesbar; trisq bleibt ohne Wahl |
| U3 | Tasqlet | Plan 2.6 darauf bauen: Paletten = Themen, Achsen = Stilachsen, „Vorschläge“ entfallen (Thema + Stil) | Vorschläge wie im Dummy nachstellbar, schlechtes eigenes Thema abgelehnt |
| U4 | Maillet | feste Farben der drei HTML-Dateien auf Stufe 1 umstellen, `dist/` als Kopie mit Versionsvermerk, Auswahl in den Einstellungen statt Mond-Knopf, gespeichert in der Konfiguration; „hell“/„dunkel“ → `paper`/`graphite` | alle drei Fenster in jedem Thema lesbar |

Reihenfolge: K0–K4 zuerst, U1 als erster Nutzer, U2–U4 danach unabhängig voneinander.

### K6 Crate `bespex-desktop`

Dünne Helfer statt eines Rahmens: Die App baut Menü und Verhalten weiter selbst.

- **Tray:** ksni-Gerüst, Icons in den Größen des Protokolls (`rgba_to_argb`, Verkleinern), die
  Zustandsmarken nach `../PLAN.md` §8 an genau einer Stelle (Zahl-Pille, Zustandspunkt, Tasse), Prüfung
  auf einen Tray-Host, Rückfall ohne Host (GNOME ohne Erweiterung). Heute dreifach in Tasqlet `tray.rs`,
  CodeDeck `tray.rs`/`icon.rs`, Maillet `app/tray.rs`.
- **Plattform:** X11 oder Wayland, Desktop, Fenster nach vorn holen unter X11 (Tasqlet/CodeDeck
  `platform.rs`, CodeDeck `window.rs`).
- **Einzelinstanz und Socket:** `$XDG_RUNTIME_DIR/bespex/<app>.sock`, Protokoll aus `docs/interop.md`
  (Tasqlet `instance.rs`, CodeDeck `hub.rs`).
- **Konfiguration:** `~/.config/<app>/`, atomar schreiben, Migration alter Formate.
- **Autostart** (Tasqlet, CodeDeck).
- Nicht im Crate: Tasqlets Popover-Positionierung, Menüs, globale Tastenkürzel (Tauri-Plugin genügt).

**Abnahme:** Tasqlet, CodeDeck und Maillet nutzen das Crate; ihr Tray-Code schrumpft auf Zustand und
Menü; Abnahme auf Cinnamon (X11), KDE (Wayland), GNOME mit und ohne AppIndicator-Erweiterung.

### K7 Dokumente

- **`docs/interop.md`**, wenn die erste Übergabe gebaut wird (Tasqlet 3.4):
  - Kommandozeilen als Vertrag, mit `--json`; zuerst `tasqlet add "…" --link …`.
  - URL-Schemata über `x-scheme-handler` in der `.desktop`-Datei: `maillet://message/<id>`,
    `tasqlet://item/<id>`. Ein Chip in Tasqlet öffnet die Mail in Maillet.
  - Erkennen, ob eine App installiert ist; „An Tasqlet“ erscheint nur dann.
  - Richtung: Eine Mail wird in Tasqlet zur Quelle einer Aufgabe, die Aufgabe lebt dann in Tasqlet.
    Rückweg und Kopplung später.
- **`docs/mcp.md`**, mit Tasqlets Server (Plan 2.7): Unterbefehl `<app> mcp` über stdio als Client des
  App-Sockets; jede KI-Änderung sichtbar und rückgängig zu machen (Tasqlet D23); getrennte Server je App.
- **`docs/glossary.md`** sofort: Begriff, de, en, Bedeutung, App. Erste Einträge: Farbthema, Stil,
  Tray, Einstellungen, Aufgabe und Idee (Tasqlet), **Vorgang** (Maillet: eine Mail, die noch Arbeit
  braucht; ersetzt dort „Task“, die Ordner `Tasks/…` werden umbenannt).
