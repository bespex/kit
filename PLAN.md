# kit: Plan

Was das Kit noch bekommen soll. Stand 2026-11-25. Gebaut ist `themes/` (Version 0.1.0: 12 Farbthemen
plus „Automatisch“, vier Stile, sieben Achsen, Prüfung, `<sx-appearance>`, Galerie), beschrieben in
`themes/README.md`, getaggt als `themes-v0.1.0`. Erster Nutzer ist Tasqlet (dort D38), eingebunden über
den Git-Tag.

**Grundsatz:** Ins Kit kommt nur, was mindestens zwei Apps wirklich nutzen. Was sich nicht lohnt, wird
nicht gebaut: kein geteilter i18n-Code, keine MCP-Bibliothek, keine gemeinsame Popover-Logik oder
-Komponente, kein Rahmen für Einstellungsseiten. Gemeinsam sind dagegen Aufbau und Bedienung der
Tray-Fenster (K9): als Beschreibung und als CSS-Bausteine, ohne JavaScript.

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
- **Fensterform** nach K9: Popover am Symbol oder Seitenleiste, Seite des Trays erkennen und merken,
  Ausblenden bei Fokusverlust, Anheften, Höhe nach Inhalt in Grenzen, breite Details (heute Maillet
  `app/windows.rs`, Tasqlet `popover.rs`).
- Nicht im Crate: Menüs, globale Tastenkürzel (Tauri-Plugin genügt).

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

### K9 Rahmen der Tray-Apps: `docs/popover.md` und `ui/`

Entschieden mit dem Nutzer am 2026-11-26. Maillet und Tasqlet sollen wie aus einer Produktfamilie
wirken, ohne dass man sie verwechselt: gleicher Rahmen, gleiche Bausteine, gleiche Abläufe und Tasten;
der Inhalt dazwischen bleibt je App eigen (Maillet Kartenraster, Tasqlet Schnelleingabe, Arbeitskarte,
Queue). Farben und Themen sind nicht betroffen. Eine spätere Tray-App bekommt den Rahmen gleich mit.
Konzeptseite mit Entwürfen: https://claude.ai/artifact/HgkRkQKisYG6rGVmbtjBcD (Entwürfe in
`.scratch/popover/`).

**`docs/popover.md`**, der Vertrag für jede Tray-App:

- **Fensterform:** Einstellung „Öffnen als“, *Popover am Symbol* oder *Seitenleiste*. Die Wahl gilt
  immer, gleich ob Tray-Klick oder globale Taste. Vorgabe: Popover.
  - **Popover:** 700 px breit, am Symbol. Die Höhe darf von der Grundhöhe 680 px abweichen, wenn der
    Inhalt es rechtfertigt, auch dynamisch nach Inhalt, aber in festen Grenzen (Untergrenze und
    Obergrenze legt das Dokument fest, nie größer als die Arbeitsfläche). Blendet bei Fokusverlust aus,
    außer angeheftet oder bei offenem Einstellungsfenster.
  - **Seitenleiste:** 700 px breit, volle Höhe der Arbeitsfläche, am Rand der Bildschirmhälfte mit dem
    Tray-Symbol. Einstellung „Seite“: automatisch, links, rechts; ohne bekannte Lage (Wayland, erster
    Start über die Taste) die zuletzt bekannte, sonst rechts. Bleibt bei Fokusverlust stehen, liegt aber
    nur angeheftet über anderen Fenstern; Tray-Klick oder Taste holen eine verdeckte Seitenleiste nach
    vorn und blenden erst eine vorne liegende aus. Eine angeheftete Seitenleiste blendet die Taste nie
    aus, sie holt sie nur mit dem Fokus nach vorn.
- **Kopfleiste** (48 px): App-Symbol links, Reiter mit Zahl, rechts Suche · Anheften · Einstellungen in
  dieser Reihenfolge. Reiter dürfen aus Daten der App entstehen (Maillet: je Postfach einer); zu lange
  Namen werden gekürzt. Kein Schließen-Knopf; Esc, Klick daneben, Tray-Klick oder Taste blenden aus.
  Anheften (📌) haben beide Apps, in beiden Formen: Das Popover bleibt dann offen, die Seitenleiste
  im Vordergrund.
- **Statusleiste** (30 px): links der Zustand der App in einem Satz, ein Klick zeigt Details; in der
  Mitte höchstens eine Aktion als Link; rechts „Esc blendet aus“.
- **Hinweis-Banner** unter der Kopfleiste für Zustände, die Handeln brauchen, mit einer Aktion; kein
  Popup. **Rückmeldung** mittig über der Statusleiste mit „Rückgängig“, danach `Strg+Z`.
- **Suche** als eigene Seite (⌕ oder `Strg+F`, Feld oben, Treffer darunter, Esc zurück).
- **Details:** oben eine Aktionsleiste (Hauptaktion links als gefüllter Knopf, weitere daneben,
  Markierungen rechts), darunter der Inhalt, Esc zurück. Breit: im Popover in die Bildschirmmitte
  (Größen wie Tasqlet D34), in der Seitenleiste vom Rand zur Mitte hin.
- **Bausteine:** Abschnittskopf (Symbol, Name, Zahl, rechts Filterchips oder eine Aktion), Karte,
  betonte Karte (`.sx-emphasis`, Hauptknopf rechts oben), Zeile, Chip, Pille, runde Hauptaktion,
  Symbolknopf, Aktionsknopf mit Text, Toast, Banner, Statusleiste.
- **Abläufe:** Werkzeuge erscheinen nur an der gewählten oder überfahrenen Karte/Zeile; die
  Hauptaktion ist ein runder Knopf rechts außen; weitere Aktionen links daneben in der Reihenfolge
  Weitergeben, Umwandeln, Ablegen, der Rest unter `…`. Erledigtes geht sofort weg, mit Rückgängig.
- **Einstellungsfenster** (820 × 720, eigenes Fenster, das Popover bleibt offen und übernimmt
  Änderungen sofort): links die Navigation mit App-Symbol, Namen und „Einstellungen“, darunter die
  Bereiche (Allgemein und Theme zuerst), unten optional Aktionen der App; rechts Seitentitel und je
  Einstellung eine Karte: Titel links, kurzes Bedienelement (Knopfreihe, Schalter, kurzes Feld) rechts
  daneben, Erklärung darunter, Längeres (Listen, Eingabezeilen) unter der Erklärung. Für zwei bis vier
  Möglichkeiten eine Knopfreihe, kein natives Auswahlfeld. Gebaut in Maillet und Tasqlet (2026-11-26).
  **Kein sichtbarer Aufbau:** Das Fenster (wie jedes Nebenfenster, z. B. „Über“) wird unsichtbar gebaut
  und zeigt sich erst, wenn Übersetzung und erster Bereich mit seinen Daten fertig sind: Die Seite ruft
  dann das Kommando `window_ready`, das das Fenster einmal zeigt und fokussiert (`reveal`). Meldet sie
  sich nicht, zeigt Rust es nach `READY_TIMEOUT_MS` = 1500 ms trotzdem. Daten für den ersten Bereich
  parallel laden; ohne Einrichtung gleich den passenden Bereich öffnen statt nachträglich zu springen.
  Das unsichtbare Fenster zählt als „öffnet gerade“, damit das Popover offen bleibt. Gebaut in Maillet
  (2026-11-26); Namen gleich halten, damit der Code später ins Crate (K6) wandert.
- **Tasten:** `Strg+1…n` (die sichtbaren Reiter von links) und `Strg+Tab` (`⇧` zurück) wechseln die Reiter, `Strg+F` Suche, `Strg+Z`
  rückgängig, Pfeile, `Pos1`, `Ende` wählen aus, `⏎` öffnet (an der betonten Karte: Hauptaktion), `Esc`
  schließt stufenweise (Menü, Details, Suche, Fenster). App-eigene Tasten bleiben.

**`ui/`** (`@bespex/ui`, Tags `ui-v…`): `sx-ui.css` mit den Bausteinen als Klassen über den Rollen
`--sx-*`, ohne JavaScript, dazu eine Galerie-Seite. Tasqlet bindet es über den Git-Tag ein, Maillet
kopiert es wie `dist/kit` (`tools/update-kit.sh` erweitern). Das Fensterverhalten folgt später im Crate
(K6).

**Reihenfolge:** K9 (Dokument und `ui-v0.1.0`), dann Tasqlet 2.8, dann Maillet P1 und P2 (Maillet
`PLAN.md`).

**Abnahme:** Beide Apps nutzen `@bespex/ui`; beide nacheinander öffnen, jeden Ablauf einmal mit
Tastatur und einmal mit Maus, in Popover und Seitenleiste, mit dem Tray links und rechts.
