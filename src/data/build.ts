// Small constructors shared by the entry files.

import type { AppliesTo, Segment } from './schema.ts';

export const say = (text: string): Segment => ({ t: 'say', text });
export const note = (text: string): Segment => ({ t: 'note', text });
export const cue = (text: string): Segment => ({ t: 'cue', text });

export const ALL: AppliesTo = { asset: '*', persona: '*', ownership: '*', pms: '*' };
export const only = (a: Partial<AppliesTo>): AppliesTo => ({ ...ALL, ...a });
