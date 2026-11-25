# kit: Plan

Was das Kit noch bekommen soll. Stand 2026-11-25. Gebaut ist `themes/` (Version 0.1.0: 12 Farbthemen
plus „Automatisch“, vier Stile, sieben Achsen, Prüfung, `<sx-appearance>`, Galerie), beschrieben in
`themes/README.md`, getaggt als `themes-v0.1.0`. Erster Nutzer ist Tasqlet (dort D38), eingebunden über
den Git-Tag.

**Grundsatz:** Ins Kit kommt nur, was mindestens zwei Apps wirklich nutzen. Was sich nicht lohnt, wird
nicht gebaut: kein geteilter i18n-Code, keine MCP-Bibliothek, kein gemeinsames Popover, kein Rahmen für
Einstellungsseiten.

## Brainstorm-Ideen

- Achse **Schrift** (System · Rund · Mono) als achte Stilachse; `terminal` wirkt ohne Mono nur halb.
- Ist das Thema `colorful` neben der Farbigkeit „farbig“ noch nötig, oder wird es Papier mit kräftigen
  Bereichsfarben?
- `moon` und `elegance` liegen nah beieinander (Gold auf Dunkel); `moon` kühler und blauer ziehen.
- **Akzent der App:** Eine Einstellung ersetzt den Akzent des Themas durch die Markenfarbe der App
  (CodeDeck-Orange, Maillet-Petrol, Tasqlet-Rostrot). Die Prüfung müsste diese Paare mittesten.
- **Eigene Themen** der Nutzer als Datei im Konfig-Ordner der App, geprüft mit `check`, mit Hinweis
  abgelehnt, wenn sie die Prüfung verfehlen (Tasqlet 2.6 wartet darauf). Dafür bräuchte `apply` einen
  Weg für Themen außerhalb von `sx.css` (Variablen aus `themeDecls` direkt aufs Element).
- Die abgeleiteten Reihenfarben (`seriesTones`, aus CodeDeck) liefern bei manchen Themen zwei fast
  gleiche Farben (Salbei: Abstand 1,3); Salbei und Sepia setzen sie deshalb fest. Für eigene Themen
  verbessern.
- Exakte Bereichsflächen je Thema (CodeDecks `zoneSurfaces`), falls das Mischen bei der Umstellung von
  CodeDeck nicht reicht.
- Ein Rust-Crate mit denselben Theme-JSON-Dateien, erst wenn etwas außerhalb der Oberfläche Themen braucht.
- CI gleicht `docs/glossary.md` mit den i18n-Dateien der Apps ab.
- Pictorix und HatRack bekommen mindestens `auto` (Papier/Graphit) aus `sx.css`.

## Geplante Umsetzungen

### K8 Paletten überarbeiten (am Ende)

Der Satz in 0.1.0 ist aus dem Bestand übernommen (CodeDeck, Tasqlet, Qiew), damit die Technik steht.
Er muss den Bestand nicht abbilden: Wenn die Apps umgestellt sind, wird ein eigener, angemessener Satz
gestaltet. Themen dürfen dabei wegfallen, zusammengelegt oder neu entworfen werden, und Werte dürfen sich
ändern. Die Brainstorm-Punkte zu `colorful`, `moon`/`elegance` und Papier gehen darin auf.

- Ziel: wenige, klar verschiedene Themen, je eins hell und dunkel als Grundlage, dazu Charaktere mit
  eigener Rolle im Satz. Jedes besteht die Prüfung mit jedem Stil.
- IDs, die wegfallen, bildet `normalize` auf das nächstliegende Thema ab, damit gespeicherte Wahlen der
  Apps weiter gelten.
- Abnahme gemeinsam mit dem Nutzer an der Galerie, in jedem Stil.

### K5 Umstellung der übrigen Apps

| Schritt | App | Inhalt | Abnahme |
|---|---|---|---|
| U1 | CodeDeck | Thema und Stil trennen: jedes bisherige Thema wird Farbthema + Stil (`events` bleibt CodeDecks Einstellung, `glow`/`glass`/`gradient`/`backdrop` folgen `effects`, `zones` folgt `color`); `--t-*` als Alias auf `--sx-*`, dann ersetzen; IDs abbilden (`codedeck` → `graphite`, `fancy` → `neon`); `tools/theme-check.mjs` und `palette.ts` entfallen zugunsten des Kits | jedes bisherige Thema sieht mit seinem Stil aus wie vorher (Screenshot-Vergleich) |
| U2 | Qiew `packages/frame` | vier feste Blöcke durch den Satz ersetzen, `--x-*` → `code-*`, `--bg`/`--fg`/`--surface`/`--border` → Rollen, Auswahl im Menü (`layout="compact"`); `soft-light` → `paper`, `soft-dark` → `graphite`, `nord` → `fjord` | jede Qiew-App in allen Themen lesbar; trisq bleibt ohne Wahl |
| U3 | Tasqlet | gebaut 2026-11-25 (Tasqlet D38) | Abnahme am Desktop steht aus |
| U4 | Maillet | feste Farben der drei HTML-Dateien auf die Grundrollen umstellen, `dist/` als Kopie mit Versionsvermerk, Auswahl in den Einstellungen statt Mond-Knopf, gespeichert in der Konfiguration; „hell“/„dunkel“ → `paper`/`graphite` | alle drei Fenster in jedem Thema lesbar |

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
- **`docs/glossary.md`**: Begriff, de, en, Bedeutung, App. Erste Einträge: Farbthema, Stil, Tray,
  Einstellungen, Aufgabe und Idee (Tasqlet), **Vorgang** (Maillet: eine Mail, die noch Arbeit braucht;
  ersetzt dort „Task“, die Ordner `Tasks/…` werden umbenannt).
