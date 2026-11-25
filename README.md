# be spex kit

What more than one be spex app shares: one repository, separate artifacts. Each app takes only what it
needs, at a version it chooses.

| Part | What it is | Used by |
|---|---|---|
| [`themes/`](themes/) | Colour themes and styles as data, the rules that derive and check them, CSS variables, pickers as web components | CodeDeck, Tasqlet, Maillet, the Qiew apps |
| [`desktop/`](desktop/) | Rust crate `bespex-desktop`: tray icon with status marks, X11/Wayland and desktop detection, single instance and local socket, config files, autostart | Tasqlet, CodeDeck, Maillet |
| [`docs/interop.md`](docs/interop.md) | How the apps work together: command lines, URL schemes, socket protocol | every app that offers or uses a hand-over |
| [`docs/mcp.md`](docs/mcp.md) | Convention for MCP servers of the apps | Tasqlet, then Maillet, CodeDeck |
| [`docs/glossary.md`](docs/glossary.md) | Shared terms in German and English, with their meaning | every app |

Nothing here is a framework. A part exists only if at least two apps use it.

## Use it

Web apps (Vite):

```json
"dependencies": { "@bespex/themes": "github:bespex/kit#themes-v1.0.0" }
```

Rust apps:

```toml
bespex-desktop = { git = "https://github.com/bespex/kit", tag = "desktop-v0.1.0" }
```

Apps without a build step (Maillet) copy `themes/dist/` at a tag with a small script.

## Versions

Each part has its own tags (`themes-v…`, `desktop-v…`). Theme IDs, style values, role names and public
functions stay stable; a change that breaks one needs a new major version. Apps raise versions on purpose.

What comes next: [PLAN.md](PLAN.md).

## License

MIT
