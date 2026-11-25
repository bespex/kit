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
  (CodeDeck-Orange, Maillet-Petrol, Tasqlet-Rostrot). Die Prüfung müsste diese Paare mittesten. Seit dem
  Umstieg zeigt Maillet in Papier und Graphit Orange statt seines Blaus/Violetts; mit K8 klären.
- **Eigene Themen** der Nutzer als Datei im Konfig-Ordner der App, geprüft mit `check`, mit Hinweis
  abgelehnt, wenn sie die Prüfung verfehlen (Tasqlet 2.6 wartet darauf). Dafür bräuchte `apply` einen
  Weg für Themen außerhalb von `sx.css` (Variablen aus `themeDecls` direkt aufs Element).
- Die abgeleiteten Reihenfarben (`seriesTones`, aus CodeDeck) liefern bei manchen Themen zwei fast
  gleiche Farben (Salbei: Abstand 1,3); Salbei und Sepia setzen sie deshalb fest. Für eigene Themen
  verbessern.
- Die Hinweise der fertigen Stile in `<sx-appearance>` nennen auch Achsen, die eine App nicht anbietet
  (CodeDeck: „Leisten abgesetzt“, „Aktuelles betont“). Hinweise aus den angebotenen Achsen bilden.
- CodeDeck verlor mit dem Umstieg zwei Feinheiten: das zweite Ende des Verlaufs auf dem Hauptknopf
  (`accent-fill-2`, braucht `reach` im Kit) und Mono für Terminal (Achse Schrift, oben).
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

- Ziel: **genau 12 Farbthemen** (in der Auswahl 4 breit, 3 hoch; heute 12 plus „Automatisch“), klar
  verschieden, je eins hell und dunkel als Grundlage, dazu Charaktere mit eigener Rolle im Satz. Jedes
  besteht die Prüfung mit jedem Stil. Ob „Automatisch“ eine Kachel bleibt oder anders gewählt wird, gehört
  dazu.
- **Drei Stile** plus „Eigener“, damit sie in eine Zeile passen (Entscheidung des Nutzers 2026-11-25).
- IDs, die wegfallen, bildet `normalize` auf das nächstliegende Thema ab, damit gespeicherte Wahlen der
  Apps weiter gelten (`RETIRED` in `apply.ts`).
- **Stand 2026-11-26:** Nutzer behält Papier, Graphit, Fjord, Wald, Mond, Eleganz. Entfernt: Sepia
  (→ Papier), Kontrast (→ Graphit), Salbei (→ Tinte; zu viel Pastellgrün). Neu: Frost (kühles Hell, Gegenstück
  zu Fjord) und Tinte (neutrales Weiß, Tintenblau; vorher war kein helles Thema neutral). Überarbeitet: Bunt
  (neutrale Fläche, Mint/Himmelblau/Koralle/Sonnengelb statt Lila, `areaBoost` = 2), Terminal (Phosphorgrün, ANSI-Farben). Reihenfolge:
  Automatisch, Papier, Frost, Tinte, Bunt, dann die sieben dunklen. Neon ersetzt durch **Studio** (→ Studio;
  Nutzer wollte ein edles dunkles Thema, dessen Mitte sich klar von den Leisten absetzt: fast schwarze
  Leisten und Spalten, schiefergraues Deck, Champagnergold). Das Feld `shadow` bleibt für künftige Themen.
- **Stile, Stand 2026-11-26:** Werkzeug und Ruhig bleiben (Nutzer: „richtig gut“, „super“), Plastisch entfällt
  (→ Ruhig). Bühne neu: rund, Linien, Leisten kontrastiert, Hervorhebung Bühne, normal, farbig, Effekte dezent;
  vorher verwischten Flächen, reiche Effekte und auslaufende Bereiche die Grenzen der Ansichten in CodeDeck.
  Regler für „Eigener“ zwei Achsen je Zeile. Abnahme der neuen Bühne durch den Nutzer offen.
- Abnahme gemeinsam mit dem Nutzer an der Galerie, in jedem Stil.

### K5 Umstellung der übrigen Apps

| Schritt | App | Inhalt | Abnahme |
|---|---|---|---|
| U1 | CodeDeck | gebaut 2026-11-25 (CodeDeck `docs/STYLING.md` Stand-Zeile): Rollen `--sx-*`, eigene Stufen `--cd-*`, Achsen Form, Gliederung, Farbigkeit, Effekte; „Ereignisse“ bleibt CodeDecks Einstellung; alte Themes übersetzt | Abnahme am Desktop steht aus |
| U2 | Qiew `packages/frame` | vier feste Blöcke durch den Satz ersetzen, `--x-*` → `code-*`, `--bg`/`--fg`/`--surface`/`--border` → Rollen, Auswahl im Menü (`layout="compact"`); `soft-light` → `paper`, `soft-dark` → `graphite`, `nord` → `fjord` | jede Qiew-App in allen Themen lesbar; trisq bleibt ohne Wahl |
| U3 | Tasqlet | gebaut 2026-11-25 (Tasqlet D38) | Abnahme am Desktop steht aus |
| U4 | Maillet | gebaut 2026-11-25 (Maillet `DESIGN.md` 5.9): `dist/kit` als Kopie (`tools/update-kit.sh <tag>`), `dist/look.js` für alle vier Fenster, Auswahl unter General → Appearance, `appearance` in `config.json`, Achsen Form, Gliederung, Leisten; Mond-Knopf entfallen, alte Wahl hell/dunkel übernommen | Abnahme am Desktop steht aus |

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
