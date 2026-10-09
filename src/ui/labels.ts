// Display labels for classifier values and entry kinds. UI chrome only — no
// talk-track content lives here.

import type { AssetType, Kind, Ownership, Persona, Pms } from '../data/schema.ts';

export const ASSET_LABEL: Record<AssetType, string> = {
  conventional: 'Conventional',
  affordable: 'Affordable',
  student: 'Student',
  senior: 'Senior',
  lease_up: 'Lease-up',
};

export const PERSONA_LABEL: Record<Persona, string> = {
  ops: 'Ops',
  marketing: 'Marketing',
  maintenance: 'Maintenance',
  finance: 'Finance',
  ownership: 'Ownership / AM',
};

export const OWNERSHIP_LABEL: Record<Ownership, string> = {
  owner_operator: 'Owner-operator',
  owner_only: 'Owner-only',
  third_party: '3rd-party fee mgr',
  private_equity: 'Private equity',
  merchant_builder: 'Merchant builder',
  joint_venture: 'Joint venture',
  reit: 'REIT',
};

export const PMS_LABEL: Record<Pms, string> = {
  yardi: 'Yardi',
  appfolio: 'AppFolio',
  entrata: 'Entrata',
  realpage: 'RealPage',
  other: 'Other',
};

export const KIND_LABEL: Record<Kind, string> = {
  opener: 'Opener',
  talk_track: 'Talk track',
  proof_point: 'Proof point',
  product_detail: 'Product detail',
  discovery: 'Discovery cues',
  objection: 'Objection',
  competitor: 'Competitor',
  follow_up: 'Follow-up email',
};
