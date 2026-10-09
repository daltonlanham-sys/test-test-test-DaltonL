import type { CallState, Entry } from '../data/schema.ts';
import { ENTRIES } from '../data/entries.ts';
import { matches } from './resolve.ts';

const haystack = new Map(
  ENTRIES.map((e) => [e.id, (e.title + ' ' + e.body.map((s) => s.text).join(' ')).toLowerCase()]),
);

// Every term must appear somewhere in the title or text. Entries that apply to
// the current call state sort first; the rest are marked "other state".
export function search(query: string, call: CallState): { entry: Entry; inState: boolean }[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const scored = ENTRIES.filter((e) => terms.every((t) => haystack.get(e.id)!.includes(t))).map((entry) => ({
    entry,
    inState: matches(entry.appliesTo, call),
    inTitle: terms.every((t) => entry.title.toLowerCase().includes(t)),
  }));
  scored.sort((a, b) => Number(b.inState) - Number(a.inState) || Number(b.inTitle) - Number(a.inTitle));
  return scored;
}
