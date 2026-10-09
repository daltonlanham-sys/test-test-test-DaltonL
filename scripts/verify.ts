// Integrity checks for the extracted talk-track data.
//   1. Every segment is a verbatim substring of content/master-reference.md.
//   2. Every substantive line of the doc is covered by some entry (nothing dropped).
//   3. Ids are unique, `next` edges resolve, objection entries carry objection meta,
//      listed customer names actually appear in the entry.
// Exits non-zero on any failure.

import { readFileSync } from 'node:fs';
import { ENTRIES } from '../src/data/entries.ts';

const raw = readFileSync(new URL('../content/master-reference.md', import.meta.url), 'utf8');

// Render markdown to the plain text a reader sees: drop escapes and emphasis.
const plain = (s: string) =>
  s
    .replace(/\\([!#$)+.\[\]_~\-*])/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/(^|\s)\*|\*(\s|$)/g, '$1$2')
    .replace(/\s+/g, ' ')
    .trim();

const source = plain(raw);
const errors: string[] = [];

// 1. Verbatim
for (const e of ENTRIES) {
  for (const seg of e.body) {
    if (!source.includes(seg.text)) errors.push(`[verbatim] ${e.id}: "${seg.text.slice(0, 80)}…" not found in source`);
  }
}

// 2. Completeness — per source line, how much of it is covered by segment text.
// Lines that are headings, section framing or doc metadata are exempt.
const EXEMPT = [
  /^#/,
  /^---$/,
  /^Compiled for /,
  /^Source docs:/,
  /^Compiled from /,
  /^\d+\. [A-Z][A-Z /&:-]+$/, // italic section headers (8–10)
  /^These are the detailed product capabilities/,
  /^These convert a connect/,
  /^Four of the five dimensions/, // section 7, encoded as GAPS
];
const segTexts = ENTRIES.flatMap((e) => e.body.map((s) => s.text));
const covered = (line: string) => {
  let rest = line;
  for (const t of segTexts) if (rest.includes(t)) rest = rest.split(t).join('');
  // What's left should only be labels / punctuation, e.g. `**OpEx side:** "…"`.
  return rest.replace(/[^A-Za-z0-9]/g, '').length <= Math.max(40, line.length * 0.15);
};
for (const rawLine of raw.split('\n')) {
  const line = plain(rawLine).replace(/^[-\d.]+\s+/, '');
  if (!line || EXEMPT.some((r) => r.test(line))) continue;
  if (!covered(line)) errors.push(`[coverage] source line not captured: "${line.slice(0, 100)}…"`);
}

// 3. Structural
const ids = new Set<string>();
for (const e of ENTRIES) {
  if (ids.has(e.id)) errors.push(`[structure] duplicate id ${e.id}`);
  ids.add(e.id);
}
for (const e of ENTRIES) {
  for (const n of e.next ?? []) if (!ids.has(n)) errors.push(`[structure] ${e.id} → unknown next "${n}"`);
  if ((e.kind === 'objection' || e.kind === 'competitor') && !e.objection)
    errors.push(`[structure] ${e.id} is a rebuttal without objection meta`);
  if (e.tagSource === 'general' && Object.values(e.appliesTo).some((a) => a !== '*'))
    errors.push(`[structure] ${e.id} is tagged general but has specific classifiers`);
  if (e.tagSource === 'inferred' && !e.tagNote) errors.push(`[structure] ${e.id} has an inferred tag with no tagNote`);
  const haystack = e.title + ' ' + e.body.map((s) => s.text).join(' ');
  for (const c of e.customers ?? [])
    if (!haystack.includes(c)) errors.push(`[structure] ${e.id} lists customer "${c}" not present in entry`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n✗ ${errors.length} problem(s)`);
  process.exit(1);
}
console.log(`✓ ${ENTRIES.length} entries verified verbatim against the source; every source line covered.`);
