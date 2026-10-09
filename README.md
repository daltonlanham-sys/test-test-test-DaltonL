# EliseAI SDR Talk Track Tool

Live cold-call companion for SDRs. The rep sets the asset type, persona, ownership structure and PMS, and the tool loads the right opener and objection buttons. All content comes from `content/master-reference.md`.

```
npm install
npm run dev        # local dev server
npm run build      # static site in dist/ — host anywhere
npm run check      # verify content + typecheck + tests
npm run coverage   # regenerate docs/COVERAGE.md
```

Requires Node ≥ 22.18.

**On a call:** set the classifiers once, then read the big text. Tap an objection (or press 1–9) when it comes up, and press **P** to get back to the pitch. **Q/W/E…** take the next step. **/** searches everything. **Shift+N** starts a new call. The full key map is in `docs/ARCHITECTURE.md`.

- `docs/ARCHITECTURE.md`: data model, components, key map, decisions
- `docs/COVERAGE.md`: which classifier combinations have dedicated content (generated)
- `src/data/entries.ts`: every talk track, rebuttal, proof point and follow-up, verbatim
- `src/engine/`: classifier state → opener and objections (`resolve`), call navigation (`nav`), search
- `src/ui/`: React components

**Changing content:** edit `content/master-reference.md`, update the matching entry in `entries.ts`, then run `npm run check`. It fails if any script text drifts from the doc or if any part of the doc isn't captured.
