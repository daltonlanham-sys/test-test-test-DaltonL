# SDR Talk Track Tool: architecture proposal

The goal is speed on a live call. The rep sets four classifiers when the call starts: asset type, persona, ownership structure and PMS. That **state** chooses the opener and the objection buttons. From there the rep moves through a **tree** of talk tracks. Every word on screen comes from `content/master-reference.md`.

## 1. Data model (built: `src/data/`)

```
Entry {
  id            'aff.open', 'obj.one_system', …
  kind          opener | talk_track | proof_point | product_detail | discovery
                | objection | competitor | follow_up
  title         label/heading from the doc
  body          Segment[]  ← verbatim text, split by how the rep uses it:
                  say   read aloud (doc text that was in quotes)
                  note  rep-facing reference (stat bullets, competitor notes)
                  cue   stage direction, e.g. (Wait for "…")
  appliesTo     { asset, persona, ownership, pms }  each '*' or a list
  tagSource     doc | inferred | general
  tagNote       why an inferred tag was chosen
  objection?    { tier: core | conditional, label }   ← button text
  channel?      phone | email
  situation?    win_back
  customers?    names exactly as in the doc
  next?         ids offered as "what to say next" (the tree edges)
  source        { section, heading, attribution }
}
```

- **69 entries.** Every talk track, rebuttal, proof point, deep-dive item and follow-up is its own entry.
- **Verbatim is enforced.** `npm run verify` fails if any segment is not an exact substring of the source doc. It also fails if any substantive line of the doc is not captured, so nothing gets silently dropped. I tested both failures by changing one word and by deleting one entry.
- **General content is the fallback.** Untagged multifamily content is `'*'` on every axis, so it matches every combination.
- **The tags show where they came from.** `doc` means the doc itself labels the content (NOI pitch → ownership persona, Section 4 → affordable, maintenance objections → maintenance). `inferred` means I mapped it from the wording; the UI shows a small badge and `tagNote` explains the mapping. Four entries are inferred (§5).
- **`REFERENCES`** lists the six sources the doc names. All have `url: null` because the doc gives no links. The doc does not reference a Yardi deck or an objection spreadsheet.
- **`GAPS`** lists student, senior, the missing affordable close, the maintenance opener and the third-party fee manager script. The UI shows the relevant gap when the classifier state hits it.

### Matrix → state (`src/engine/resolve.ts`)

`resolve(state)` returns:

| Output | Rule |
|---|---|
| `opener` | Highest-ranked matching phone opener. Weights: asset 8 > persona 4 > ownership 2 > PMS 1. Ties go to doc order. Email and win-back openers are never auto-picked. |
| `altOpeners` | The other matching openers, shown as small chips so the rep can swap. |
| `objections` | Every `core` rebuttal plus every `conditional` one whose `appliesTo` matches. |
| `competitors` / `promotedCompetitors` | All competitor rebuttals stay reachable in a tray. The ones that match the PMS are promoted to the main row. |
| `isFallback` | True when the opener is general. Drives the "General track" badge. |
| `gaps` | Gaps that apply to this state. |

`nextFor(entry, state)` returns the tree edges, filtered to the current state.

What the objection row shows in some example states:

| State | Objection row |
|---|---|
| any | Not interested · We have a bot · What is Elise? |
| asset = affordable | + Compliance · Too new / scale? |
| persona = maintenance | + Not tech forward · Tracking · Devices · AI scheduling |
| PMS = Yardi | + One system · Yardi Virtuoso · Already on Yardi |
| PMS = AppFolio | + AppFolio AI |
| PMS = Entrata / RealPage | + Entrata / RealPage AI |

## 2. Component structure (built: `src/ui/`)

```
<App>                         state: CallState, navStack: EntryId[]
├─ <ClassifierBar>            pinned top, always visible
│   ├─ <SegmentRow axis="asset">       Conventional | Affordable | Student | Senior ┊ Lease-up (secondary, smaller)
│   ├─ <SegmentRow axis="persona">     Ops | Marketing | Maintenance | Finance | Ownership
│   ├─ <SegmentRow axis="ownership">   Owner-op | Owner-only | 3rd-party | PE | Merchant | JV | REIT
│   ├─ <SegmentRow axis="pms">         Yardi | AppFolio | Entrata | RealPage | Other
│   └─ New call / Collapse             collapse shrinks the bar to one summary line
├─ <StatusStrip>              ← Back · breadcrumb (clickable) · Search · "General track" + gap notices
├─ <ReadingPane>              one Entry; `say` in large type, `note` smaller, `cue` italic
│                             stats and customer names highlighted (text itself never altered)
│   ├─ Back to pitch          only while a rebuttal is on screen
│   ├─ Next options           nextFor(entry), hotkeyed Q W E R T…
│   └─ Other openers          only while on the opener, hotkeyed Z X V B N M
├─ <ObjectionBar>             pinned bottom; core + conditional + promoted competitors, hotkeyed 1–9
│   └─ Trays                  Competitors (C) · Follow-ups (F) · Discovery cues (D); 1–9 picks inside
└─ <CommandPalette>           "/" fuzzy search over all 69 entries, for anything not surfaced
```

**Navigation.** `navStack` is a stack of entry ids.
- Choosing a next option or an objection pushes onto the stack.
- **Back** (Esc or Backspace) pops one entry.
- After a chain of objections, **"Return to pitch"** pops back to the last non-objection entry in one step.
- Changing a classifier mid-call keeps the stack and recomputes the buttons. The opener only changes if the rep is still on it.

**Keyboard and tap.** Every button shows its key. Buttons are at least 40–44px tall, and there are no dropdowns.

| Key | Action |
|---|---|
| 1–9 | Objection buttons (1–3 are always the core three) |
| Q W E R T Y U I O | Next options |
| Z X V B N M | Swap to another opener (while on the opener) |
| P | Back to pitch (skips past chained rebuttals) |
| Esc / Backspace | Back one step (Esc closes a tray first) |
| C · F · D | Competitors · Follow-ups · Discovery cues trays |
| / | Search all content |
| ` | Collapse / expand the classifier bar |
| Shift+N | New call |

Classifier choices are saved in sessionStorage, so an accidental reload keeps them. The navigation trail is not saved; a reload returns to the opener.

**Stack.** Vite, React and TypeScript, built to one static page (`npm run build` → `dist/`). There's no backend, it loads instantly, and it can be hosted anywhere. Content stays in `entries.ts`, so a content change is a reviewed diff that `verify` gates.

## 3. Tree shape (from `next` edges)

- **General:** opener → Elise high level → product proof (Leasing AI, Voice AI, Delinquency, Renewals, Maintenance, Lease Audits, Apollo) → Resident AI deep-dive items.
- **Ownership:** portfolio opener → NOI frame → OpEx → Revenue → Renewals → Delinquency → Close. Side branches: CapEx, and fee-manager framing for fee-managed owners.
- **Affordable:** Open → Numbers → Screened-out → Recerts → Fitch Irick proof → *(no close script, flagged)*.
- **Ops:** ops-efficiency opener → property-manager discovery cues / high level / Voice AI / Delinquency.
- **Lease-up:** every phone opener → Lease-up track (shown only when asset = lease-up) → AI-Guided Tours proof.
- **Finance:** lease-audit opener → Lease Audits proof → Delinquency.
- **Yardi:** One system → Yardi integration framing.

## 4. Coverage gaps

See `docs/COVERAGE.md` (generated) for the full asset × persona × ownership grid.

- **Student and senior housing:** no dedicated content. They fall back to the general track and show a "needs build-out" notice. (Section 7 of the doc confirms this.)
- **Affordable close:** the doc lists a close beat but gives no close script.
- **Maintenance persona:** has rebuttals and proof, but no opener.
- **Lease-up (secondary):** one capability note, no opener and no read-aloud script. Not a build-out priority.
- **Ownership structures:**
  - Owner-operator, third-party fee manager and REIT have no dedicated content.
  - Merchant builder has no dedicated content. The rep picks Lease-up as the asset type to get the lease-up track.
  - Owner-only, PE and JV have only an inferred tag (the fee-manager track).

## 5. Decisions

Confirmed:
1. **PMS is the fourth classifier row.** Yardi | AppFolio | Entrata | RealPage | Other. It can be left unset, like the other rows.
2. **"One system" triggers on Yardi only for now**, even though the doc heading says "Yardi/PMS consolidation". To extend it, change `appliesTo.pms` on `obj.one_system`.
3. **Lease-up is a secondary asset type.** You can select it, but it renders after the four primary types and isn't targeted for build-out. `track.lease_up` is now tagged `asset: lease_up` with `tagSource: doc` (Section 7 calls it the lease-up/development track). It is no longer mapped to merchant builder.

Still open:
- **Inferred tags (4 entries):**
  - Leasing/vacancy opener → marketing
  - Lease-audit opener → finance
  - CapEx → ownership + finance
  - Fee-manager track → owner-only, PE, JV (not REIT)
- **The persona list:** ops, marketing, maintenance, finance, ownership. Add others (IT/tech, executive) only once content exists for them.

## 6. Content inconsistencies in the source doc (left as written)

These are verbatim from the doc. A rep may read two of them on the same call:

- **Customer count:** "28 of the top 32" (openers) vs "40 of the top 50" (ownership framing).
- **Units live:** "6 million" (recognition hook) vs "4M+" (highlights follow-up) vs "3M+" (mystery-shop email).
- **Delinquency reduction:** "40%" (proof points) vs "~30% on average" (deep-dive).
- **Cardinal:** "Cardinal Group" (delinquency proof) and "Cardinal" (affordable follow-up). It's probably the same customer, but I haven't merged them.
