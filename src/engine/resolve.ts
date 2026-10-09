// Matrix → tree: turns the classifier state into what the UI shows.

import type { AppliesTo, Axis, CallState, Entry, Gap, Reference } from '../data/schema.ts';
import { ENTRIES, GAPS, REFERENCES } from '../data/entries.ts';

const AXES = ['asset', 'persona', 'ownership', 'pms'] as const;

function axisMatches<T>(axis: Axis<T>, value: T | null): boolean {
  if (axis === '*') return true;
  // An unset classifier only matches general content.
  return value !== null && axis.includes(value);
}

export function matches(appliesTo: AppliesTo, state: CallState): boolean {
  return AXES.every((k) => axisMatches(appliesTo[k] as Axis<unknown>, state[k]));
}

// Number of axes the entry is specifically tagged on. 0 = general fallback.
export function specificity(appliesTo: AppliesTo): number {
  return AXES.filter((k) => appliesTo[k] !== '*').length;
}

// Ranking weight when several entries match. Asset type wins ties because the
// asset-specific track (affordable) is the most differentiated content we have.
const WEIGHT = { asset: 8, persona: 4, ownership: 2, pms: 1 } as const;
export function rank(appliesTo: AppliesTo): number {
  return AXES.reduce((sum, k) => sum + (appliesTo[k] === '*' ? 0 : WEIGHT[k]), 0);
}

const bySpecificity = (a: Entry, b: Entry) => rank(b.appliesTo) - rank(a.appliesTo);

export type Resolved = {
  opener: Entry;
  altOpeners: Entry[]; // other matching phone openers, most specific first
  objections: Entry[]; // main row: core + matched conditional (non-competitor)
  competitors: Entry[]; // tray: all core competitors + matched conditional ones
  promotedCompetitors: Entry[]; // matched conditional competitors, also shown in the main row
  discovery: Entry[];
  followUps: Entry[];
  isFallback: boolean; // true when nothing state-specific was found for the opener
  gaps: Gap[];
  references: Reference[]; // template docs etc. for this state, most specific first
};

export function resolve(state: CallState, entries: readonly Entry[] = ENTRIES): Resolved {
  const live = entries.filter((e) => matches(e.appliesTo, state));
  const of = (kind: Entry['kind']) => live.filter((e) => e.kind === kind);

  // Stable sort keeps doc order as the tie-breaker.
  const openers = of('opener')
    .filter((e) => e.channel !== 'email' && !e.situation)
    .sort(bySpecificity);
  const opener = openers[0];
  if (!opener) throw new Error('No general opener available — data is broken');

  const isConditionalMatch = (e: Entry) => e.objection?.tier === 'conditional';
  const competitors = of('competitor').filter((e) => e.objection);

  return {
    opener,
    altOpeners: [
      ...openers.slice(1),
      ...of('opener').filter((e) => e.channel === 'email' || e.situation),
    ],
    objections: [
      ...of('objection').filter((e) => e.objection?.tier === 'core'),
      ...of('objection').filter(isConditionalMatch),
    ],
    competitors: [...competitors].sort(bySpecificity),
    promotedCompetitors: competitors.filter(isConditionalMatch),
    discovery: of('discovery').sort(bySpecificity),
    followUps: of('follow_up').sort(bySpecificity),
    isFallback: specificity(opener.appliesTo) === 0,
    gaps: GAPS.filter((g) => partialMatches(g.appliesTo, state)),
    references: REFERENCES.filter((r) => r.url && partialMatches(r.appliesTo ?? {}, state)).sort(
      (a, b) => Object.keys(b.appliesTo ?? {}).length - Object.keys(a.appliesTo ?? {}).length,
    ),
  };
}

function partialMatches(appliesTo: Partial<AppliesTo>, state: CallState): boolean {
  return AXES.every((k) => {
    const axis = appliesTo[k];
    return axis === undefined || axis === '*' || (state[k] !== null && (axis as readonly unknown[]).includes(state[k]));
  });
}

// Tree navigation: what to offer after the current entry. Openers (and
// entries marked offersHubs) also offer every hub that matches the call state
// (persona and asset entry points), most specific first, ahead of their own
// edges.
export function nextFor(entry: Entry, state: CallState, entries: readonly Entry[] = ENTRIES): Entry[] {
  const byId = new Map(entries.map((e) => [e.id, e]));
  const hubs =
    entry.kind === 'opener' || entry.offersHubs
      ? entries.filter((e) => e.hub && e.id !== entry.id && matches(e.appliesTo, state)).sort(bySpecificity)
      : [];
  const edges = (entry.next ?? [])
    .map((id) => byId.get(id))
    .filter((e): e is Entry => !!e && matches(e.appliesTo, state));
  return [...new Map([...hubs, ...edges].map((e) => [e.id, e])).values()];
}
