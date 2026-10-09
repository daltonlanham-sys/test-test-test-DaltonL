# EliseAI SDR Talk Track Tool

Live cold-call companion for SDRs. The rep sets the asset type, persona and ownership structure, and the tool loads the right opener and objection buttons. All content comes from `content/master-reference.md`.

- `docs/ARCHITECTURE.md`: data model, component structure, open decisions
- `docs/COVERAGE.md`: which classifier combinations have dedicated content (generated)
- `src/data/entries.ts`: every talk track, rebuttal, proof point and follow-up, verbatim
- `src/engine/resolve.ts`: classifier state → opener, objection buttons, tree navigation

```
npm run verify     # text is verbatim and the whole doc is captured
npm run coverage   # regenerate the coverage report
```

Requires Node ≥ 22.18 (runs TypeScript directly, no build step yet).
