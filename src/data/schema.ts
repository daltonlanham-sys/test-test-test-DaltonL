// Data model for the SDR talk track tool.
//
// Every talk track, rebuttal, proof point and follow-up from the master
// reference (content/master-reference.md) is one Entry. Entry text is stored
// as Segments whose text is copied verbatim from the doc — scripts/verify.ts
// fails the build if any segment is not an exact substring of the source.

// ---------------------------------------------------------------------------
// Classifiers — set once by the rep at the top of the call. Four rows:
// asset, persona, ownership, PMS. Any row can be left unset.
// ---------------------------------------------------------------------------

export const ASSET_TYPES = ['conventional', 'affordable', 'student', 'senior', 'lease_up'] as const;
export type AssetType = (typeof ASSET_TYPES)[number];

// Selectable but not a priority — rendered after the primary asset types,
// and not targeted for content build-out.
export const SECONDARY_ASSET_TYPES: readonly AssetType[] = ['lease_up'];

export const PERSONAS = [
  'ops',
  'marketing',
  'leasing',
  'maintenance',
  'finance',
  'regional',
  'ownership',
  'executive',
] as const;
export type Persona = (typeof PERSONAS)[number];

export const OWNERSHIP = [
  'owner_operator',
  'owner_only',
  'third_party',
  'private_equity',
  'merchant_builder',
  'joint_venture',
  'reit',
] as const;
export type Ownership = (typeof OWNERSHIP)[number];

// Fourth classifier. The doc's "one system" objection and the
// Yardi/AppFolio/Entrata/RealPage rebuttals are keyed to the prospect's PMS.
export const PMS = ['yardi', 'appfolio', 'entrata', 'realpage', 'other'] as const;
export type Pms = (typeof PMS)[number];

export type CallState = {
  asset: AssetType | null;
  persona: Persona | null;
  ownership: Ownership | null;
  pms: Pms | null;
};

// '*' = applies to every value on that axis (general multifamily fallback).
export type Axis<T> = '*' | readonly T[];

export type AppliesTo = {
  asset: Axis<AssetType>;
  persona: Axis<Persona>;
  ownership: Axis<Ownership>;
  pms: Axis<Pms>;
};

// ---------------------------------------------------------------------------
// Entries
// ---------------------------------------------------------------------------

export type Kind =
  | 'opener' // first thing out of the rep's mouth
  | 'talk_track' // pitch beat the rep reads aloud
  | 'proof_point' // stats / customer proof to drop in
  | 'product_detail' // Resident AI deep-dive, for when a prospect digs in
  | 'discovery' // rep-facing cues, not read aloud
  | 'objection' // objection rebuttal
  | 'competitor' // competitor rebuttal
  | 'follow_up'; // post-call email pattern

// say  = words the rep reads aloud (doc text that was in quotes, quotes removed)
// note = rep-facing reference text (doc prose / bullets, not a script)
// cue  = stage direction embedded in a script, e.g. "(Wait for ...)"
export type Segment = { t: 'say' | 'note' | 'cue'; text: string };

// How the classifier tags were decided:
//   doc      — the doc itself labels this content by persona / asset / owner type
//   inferred — mapped by us from wording in the doc; needs sales-leadership sign-off
//   general  — untagged multifamily content; applies to all combinations
export type TagSource = 'doc' | 'inferred' | 'general';

export type ObjectionMeta = {
  // core        — button always visible
  // conditional — button surfaces only when appliesTo matches the call state
  tier: 'core' | 'conditional';
  label: string; // button text
};

export type Entry = {
  id: string;
  kind: Kind;
  title: string; // label or heading from the doc
  body: readonly Segment[];
  appliesTo: AppliesTo;
  tagSource: TagSource;
  tagNote?: string; // why an inferred tag was chosen
  objection?: ObjectionMeta;
  channel?: 'phone' | 'email';
  situation?: 'win_back'; // only relevant in a specific call situation
  customers?: readonly string[]; // customer names exactly as they appear in body
  next?: readonly string[]; // tree edges: entry ids offered as "next" from here
  // Entry point for a persona/asset: offered from every opener (and the
  // high-level pitch) whenever it matches the call state.
  hub?: boolean;
  offersHubs?: boolean; // non-opener entries that list hubs in their next options
  source: { section: string; heading: string; attribution?: string };
};

export type Reference = {
  id: string;
  title: string;
  owner?: string;
  url: string | null; // null = doc names it but gives no link
  note?: string;
  appliesTo?: Partial<AppliesTo>; // shown in the Follow-ups tray when it matches
};

export type Gap = {
  id: string;
  appliesTo: Partial<AppliesTo>;
  description: string;
  source?: string;
};
