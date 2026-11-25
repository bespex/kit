# be spex kit

What more than one be spex app shares (README.md); what comes next in PLAN.md. First part:
`themes/` (`@bespex/themes`, see themes/README.md).

## Rules

- Only what at least two apps use goes in. Theme ids, style values, role names and public functions
  stay stable; a breaking change needs a new major version.
- Code, comments and commit messages in English; PLAN.md in German.
- `themes/dist/` and `themes/src/data.gen.ts` are generated and checked in: after every change to
  `themes/src`, `themes/colors` or `themes/styles` run `npm run build` and `npm run check`.
- Node 22 via nvm (`export NVM_DIR=~/.local/share/nvm; . $NVM_DIR/nvm.sh`); the system node is too old.
- Gallery: `npm run gallery`, then http://localhost:4380/themes/gallery/ (`?theme=…&style=…`).

## Commits

- Author and committer **Bert Speckels <skrrytch@speckels.net>** (local git config).
- No AI hints in any form: no `Co-Authored-By` for Claude, no `Claude-Session`, no "Generated with
  Claude Code", in commits and pull requests. The local `commit-msg` hook rejects them.
- Commit only when asked. Tags per part (`themes-v…`, `desktop-v…`), pushed only when asked.
