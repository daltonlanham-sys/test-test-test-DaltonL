// Extracted from content/master-reference.md. Do not edit text here by hand —
// every segment must stay a verbatim substring of the source doc
// (enforced by `npm run verify`). Change the doc, then re-extract.

import type { Entry, Gap, Reference } from './schema.ts';
import { ALL, cue, note, only, say } from './build.ts';
import { MATRIX_ENTRIES, MATRIX_REFERENCES } from './entries-matrix.ts';


const S1 = '1. Openers / High-Level Intro';
const S2 = '2. Persona / Ownership Talk Tracks';
const S3 = '3. Product Talk Tracks & Proof Points';
const S4 = '4. Affordable Housing Talk Track';
const S5 = '5. Objection Handling';
const S6 = '6. Competitor Rebuttals';
const S8 = '8. Additional Openers & Angles';
const S9 = '9. Product Deep-Dive: Resident AI Branches';
const S10 = '10. Follow-Up Email Patterns';

const FEE_MANAGED_OWNERS = ['owner_only', 'private_equity', 'joint_venture'] as const;

// Default "what to say next" from any general opener.
const GENERAL_NEXT = ['track.high_level', 'proof.leasing_ai', 'proof.delinquency', 'proof.lease_audits'];

const BASE_ENTRIES: readonly Entry[] = [
  // ── 1. Openers ──────────────────────────────────────────────────────────
  {
    id: 'opener.standard',
    kind: 'opener',
    title: 'Standard Leasing AI intro',
    body: [
      say(
        "Hey ___, this is [name] with EliseAI. How's your [day] going? No worries — at EliseAI, we automate leasing and resident conversations for 28 of the top 32 property management companies. We've been filling critical gaps with things like delinquency outreach, lease audits, and increasing lead-to-lease conversion through our conversational voice AI. I'd love to get our product suite in front of you to see if it could help solve some of the challenges your team might be facing. Have you looked into using AI for any part of your operations yet?",
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    next: GENERAL_NEXT,
    source: { section: S1, heading: 'Standard Leasing AI intro' },
  },
  {
    id: 'opener.condensed',
    kind: 'opener',
    title: 'Condensed version',
    body: [
      say(
        'EliseAI powers leasing and resident conversations for 28 of the top 32 property managers. Our voice AI fills key gaps like delinquency outreach, lease audits, and boosting lead-to-lease conversion. Worth a quick look to see if it could solve anything for your team. Have you explored AI in your operations yet?',
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    next: GENERAL_NEXT,
    source: { section: S1, heading: 'Condensed version' },
  },
  {
    id: 'track.high_level',
    kind: 'talk_track',
    title: 'Elise high level (plain)',
    body: [
      say(
        "At a high level, we automate leasing and resident conversations. On leasing, our AI captures after-hours leads 24/7 — if someone wants to book a tour, we schedule it for your on-site team so it's on their calendar the next morning with all the info. On the resident side, we handle maintenance work orders, escalate emergencies, and automate rent collections — and we don't take a fee on late rent.",
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    next: [
      'track.lease_up',
      'proof.leasing_ai',
      'proof.voice_ai',
      'proof.delinquency',
      'proof.renewals',
      'proof.maintenance',
      'proof.lease_audits',
      'track.apollo',
      'why.scale',
      'why.voice',
    ],
    offersHubs: true,
    source: { section: S1, heading: 'Elise high level (plain)' },
  },
  {
    id: 'opener.recognition',
    kind: 'opener',
    title: 'Recognition hook',
    body: [
      say(
        'Does EliseAI ring any bells? We automate leasing and resident conversations, now live in over 6 million units in the US. We work with Greystar, Bozzuto, Asset Living.',
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    customers: ['Greystar', 'Bozzuto', 'Asset Living'],
    next: GENERAL_NEXT,
    source: { section: S1, heading: 'Recognition hook' },
  },

  // ── 2. Persona / ownership talk tracks ──────────────────────────────────
  {
    id: 'noi.frame',
    kind: 'talk_track',
    title: 'Asset Manager NOI pitch — Core frame',
    body: [
      say(
        'The focus is ultimately on improving NOI and asset performance without having to continually add headcount or increase spend. We look at both sides: controlling OpEx while capturing more revenue.',
      ),
    ],
    appliesTo: only({ persona: ['ownership'] }),
    tagSource: 'doc',
    next: ['noi.opex', 'noi.revenue', 'noi.renewals', 'noi.delinquency', 'track.capex'],
    source: { section: S2, heading: 'Asset Manager / Ownership (the NOI pitch)' },
  },
  {
    id: 'noi.opex',
    kind: 'talk_track',
    title: 'OpEx side',
    body: [
      note(
        'Automate repetitive transactional work — responding to leads, scheduling tours, application follow-up, resident questions, rent reminders, renewal outreach.',
      ),
      say(
        "The goal isn't to cut staff. It's that you shouldn't have to add headcount every time you add units. As the portfolio grows, Elise scales with you instead of your payroll scaling at the same rate.",
      ),
    ],
    appliesTo: only({ persona: ['ownership'] }),
    tagSource: 'doc',
    next: ['noi.revenue'],
    source: { section: S2, heading: 'Asset Manager / Ownership (the NOI pitch)' },
  },
  {
    id: 'noi.revenue',
    kind: 'talk_track',
    title: 'Revenue side (leasing)',
    body: [
      say(
        "You're already paying for leads whether they convert or not. If someone reaches out at 8:30 at night and doesn't hear back until morning, they've moved on. Elise responds immediately and keeps following up. Fewer leads wash out, conversion improves, occupancy improves, less pressure to lean on concessions.",
      ),
    ],
    appliesTo: only({ persona: ['ownership'] }),
    tagSource: 'doc',
    next: ['noi.renewals', 'proof.leasing_ai'],
    source: { section: S2, heading: 'Asset Manager / Ownership (the NOI pitch)' },
  },
  {
    id: 'noi.renewals',
    kind: 'talk_track',
    title: 'Renewals',
    body: [
      say(
        "The cheapest lease is the one you don't have to go back out and market again. We automate renewal outreach so conversations start earlier and fewer residents fall through the cracks.",
      ),
    ],
    appliesTo: only({ persona: ['ownership'] }),
    tagSource: 'doc',
    next: ['noi.delinquency', 'proof.renewals'],
    source: { section: S2, heading: 'Asset Manager / Ownership (the NOI pitch)' },
  },
  {
    id: 'noi.delinquency',
    kind: 'talk_track',
    title: 'Delinquency',
    body: [
      say(
        "That's revenue you've already earned. We automate the repetitive reminders and follow-up — and unlike a collections agency, we're not taking a percentage of the rent we help you collect.",
      ),
    ],
    appliesTo: only({ persona: ['ownership'] }),
    tagSource: 'doc',
    next: ['noi.close', 'proof.delinquency'],
    source: { section: S2, heading: 'Asset Manager / Ownership (the NOI pitch)' },
  },
  {
    id: 'noi.close',
    kind: 'talk_track',
    title: 'Close',
    body: [
      say(
        "This really isn't a cost-cutting pitch. It's an NOI pitch. Rather than throw hypothetical ROI at you, I'd love to take two or three of your actual communities, run the numbers, and show you the opportunity before we ever talk price.",
      ),
    ],
    appliesTo: only({ persona: ['ownership'] }),
    tagSource: 'doc',
    source: { section: S2, heading: 'Asset Manager / Ownership (the NOI pitch)' },
  },
  {
    id: 'track.owner_past_fee_manager',
    kind: 'talk_track',
    title: 'Owner reaching past the fee manager',
    body: [
      say(
        'I understand you work with fee managers — we speak to them about workflow, admin, dispatches. But we talk to you about lower OpEx, overall NOI, and ROI within your assets. Those are two very different conversations, and owners are doing this across our clients as budget season comes up.',
      ),
    ],
    appliesTo: only({ persona: ['ownership'], ownership: FEE_MANAGED_OWNERS }),
    tagSource: 'inferred',
    tagNote:
      'Doc labels this "owner reaching past the fee manager". Mapped to the ownership structures that typically hire a fee manager (owner-only, PE, JV). Confirm whether REITs that outsource management should get it too.',
    next: ['noi.frame'],
    source: { section: S2, heading: 'Owner reaching past the fee manager' },
  },
  {
    id: 'opener.ownership_portfolio',
    kind: 'opener',
    title: 'Ownership — portfolio performance framing',
    body: [
      say(
        "I'm reaching out on the ownership side because we already work with 40 of the top 50 companies across multifamily. This isn't really about AI from a leasing or marketing perspective — it's about portfolio performance and NOI. Even when a third-party manager makes the day-to-day tech decisions, ownership is impacted by how efficiently properties operate. We can pull performance from properties already using Elise — leasing conversion, occupancy, collections, operational efficiency — so you have the data to make recommendations to your operating partners.",
      ),
    ],
    appliesTo: only({ persona: ['ownership'] }),
    tagSource: 'doc',
    next: ['noi.frame', 'track.owner_past_fee_manager', 'track.capex'],
    source: { section: S2, heading: 'Ownership — portfolio performance framing' },
  },
  {
    id: 'track.capex',
    kind: 'talk_track',
    title: 'CapEx angle',
    body: [
      say(
        'We consolidate point solutions across leasing, resident ops, collections, renewals, and maintenance into one platform — reducing tech spend and letting you scale without scaling headcount. On maintenance, we give you visibility into recurring issues — HVAC failures, plumbing, staircase repairs — so you can forecast larger capital projects earlier. Three things: reduce operating and tech costs, drive revenue through occupancy and collections, and better data to plan future CapEx.',
      ),
    ],
    appliesTo: only({ persona: ['ownership', 'finance'] }),
    tagSource: 'inferred',
    tagNote: 'Sits in the persona/ownership section with no persona label. Mapped to ownership + finance.',
    next: ['noi.close'],
    source: { section: S2, heading: 'CapEx angle' },
  },
  {
    id: 'discovery.asset_management',
    kind: 'discovery',
    title: 'How owners think — asset management cares about',
    body: [
      note(
        'Asset management cares about: operating budget, bleeding revenue, understaffed despite traffic, thin margins, budgets tight post-COVID (insurance up, mortgages tripled).',
      ),
    ],
    appliesTo: only({ persona: ['ownership'] }),
    tagSource: 'doc',
    source: { section: S2, heading: 'How owners & operators think (discovery cues)' },
  },
  {
    id: 'discovery.property_managers',
    kind: 'discovery',
    title: 'How operators think — property managers care about',
    body: [
      note(
        'Property managers care about: onsite turnover ~50%, leasing agent hourly cost tripled in a decade, keeping staff from being overwhelmed, 5-star reviews.',
      ),
    ],
    appliesTo: only({ persona: ['ops'] }),
    tagSource: 'doc',
    source: { section: S2, heading: 'How owners & operators think (discovery cues)' },
  },

  // ── 3. Product talk tracks & proof points ───────────────────────────────
  {
    id: 'proof.leasing_ai',
    kind: 'proof_point',
    title: 'Leasing AI',
    body: [
      note(
        'Lead-to-lease conversion 50–60% (vs ~30% industry avg); 2% higher occupancy than local markets in a third-party ALN study of 3,700+ communities. Kittle Property Group: 90%+ of leasing conversations handled by AI, lead-to-lease time cut 65%, ad spend down ~40%. Avenue5: lead-to-lease conversion up 21%+ across 50,000 units.',
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    customers: ['Kittle Property Group', 'Avenue5'],
    next: ['proof.aigt', 'proof.voice_ai', 'track.zillow'],
    source: { section: S3, heading: 'Leasing AI' },
  },
  {
    id: 'proof.lease_audits',
    kind: 'proof_point',
    title: 'Lease Audits',
    body: [
      note(
        '~8% of leases have confirmed discrepancies, averaging $129/lease/year; $1.6M in annualized undercharges confirmed across audited units. One operator surfaced $50K in missed fees in under a week.',
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    source: { section: S3, heading: 'Leasing AI' },
  },
  {
    id: 'proof.aigt',
    kind: 'proof_point',
    title: 'AI-Guided Tours (AIGT)',
    body: [
      note(
        'tour a unit without an agent; ~20% of tours handled by AIGT; 2.4x increase in tours booked; +49% lead-to-tour uplift with lease-up settings; +9.5% with centralAI.',
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    source: { section: S3, heading: 'Leasing AI' },
  },
  {
    id: 'proof.voice_ai',
    kind: 'proof_point',
    title: 'Voice AI',
    body: [
      note(
        'automates 90% of inbound/outbound calls, reduces agent workload 87%, 29-second avg response; 33% more leads entering funnel via AI-managed calls; 50% of calls are missed by on-site teams today. The biggest voice product in any industry — 30M calls a year.',
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    source: { section: S3, heading: 'Leasing AI' },
  },
  {
    id: 'proof.delinquency',
    kind: 'proof_point',
    title: 'Delinquency',
    body: [
      note(
        '40% reduction in delinquency (AI handles 90% of payment comms); collections up 41% post-AI; cash flow accelerated 11 days; 85% less time managing delinquencies. Cardinal Group went 7% to 4%. Summit recovered ~$3M. Asset Living improved on-time payments by 600 basis points. No percentage fee taken.',
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    customers: ['Cardinal Group', 'Summit', 'Asset Living'],
    next: ['detail.delinquency_ai', 'detail.demand_notices', 'detail.outbound_calling'],
    source: { section: S3, heading: 'Resident AI' },
  },
  {
    id: 'proof.renewals',
    kind: 'proof_point',
    title: 'Renewals',
    body: [note('97.1% renewal rate; +10% renewal rate; $1.5M+ additional revenue; automated 30/60/90-day outreach; 84% of renewal conversations automated, renewal reply rates up 20%.')],
    appliesTo: ALL,
    tagSource: 'general',
    next: ['detail.pre_renewal', 'detail.cross_selling', 'detail.renewal_portal', 'detail.renewal_prediction'],
    source: { section: S3, heading: 'Resident AI' },
  },
  {
    id: 'proof.maintenance',
    kind: 'proof_point',
    title: 'Maintenance',
    body: [
      note(
        '26% reduction in emergency calls; Student Quarters saved 533 hours and $27K annually; AI-powered auto-assignment and scheduling; customers saved 11,700+ maintenance hours in six months.',
      ),
      note('Pitch:'),
      say('Let your techs turn wrenches instead of answering calls, triaging emergencies, and managing work orders.'),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    customers: ['Student Quarters'],
    next: ['detail.maintenance_app'],
    source: { section: S3, heading: 'Resident AI' },
  },
  {
    id: 'proof.concierge',
    kind: 'proof_point',
    title: 'Resident Concierge',
    body: [note('24/7 point of contact across SMS, email, phone — amenities, move-in/out, policy questions.')],
    appliesTo: ALL,
    tagSource: 'general',
    next: ['detail.one_resident_ai'],
    source: { section: S3, heading: 'Resident AI' },
  },
  {
    id: 'track.apollo',
    kind: 'talk_track',
    title: 'Apollo (the flagship / AIP)',
    body: [
      say(
        "Think of Apollo like ChatGPT or Claude built directly into the Elise platform. Instead of 100 agents you set up, it's one agent that does the work across leasing, delinquency, renewals, maintenance, and portfolio data through a single conversation. Ask it 'show me the five properties underperforming on occupancy,' and it surfaces that instantly — and it can take action, not just answer. Especially powerful at the leadership/ownership level for spotting trends and building reports.",
      ),
      note('Customer quote:'),
      say("I don't want a keyboard anymore. I just want to say, 'Hey, Apollo.'"),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    source: { section: S3, heading: 'Apollo (the flagship / AIP)' },
  },
  {
    id: 'track.zillow',
    kind: 'talk_track',
    title: 'Zillow partnership (warm angle)',
    body: [
      say(
        "As part of your Zillow subscription you have access to EliseAI Assist — it instantly engages every Zillow lead, answers questions, and moves prospects toward a tour. +43% lift in lead-to-tour, +19% lead-to-application. And it's already included in your Zillow membership, so no additional cost.",
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    source: { section: S3, heading: 'Zillow partnership (warm angle)' },
  },
  {
    id: 'track.lease_up',
    kind: 'talk_track',
    title: 'Lease-up / development',
    body: [
      note(
        'Elise supports every phase of the lease-up lifecycle in EliseCRM: timeline config (pre-leasing, grand openings, move-ins), pricing/floorplans before live PMS data, waitlist capture, and tour logistics (hard-hat tours, virtual links). Nothing matters as much as lease-up velocity.',
      ),
    ],
    appliesTo: only({ asset: ['lease_up'] }),
    tagSource: 'doc',
    hub: true,
    tagNote: 'Section 7 names this the lease-up/development track under asset type.',
    next: ['proof.aigt'],
    source: { section: S3, heading: 'Lease-up / development' },
  },

  // ── 4. Affordable housing track ─────────────────────────────────────────
  {
    id: 'aff.beats',
    kind: 'discovery',
    title: 'Affordable track — beats in order',
    body: [
      note(
        'Beats, in order: problem → our answer → the number that proves it → the human story (Fitch Irick) → close.',
      ),
    ],
    appliesTo: only({ asset: ['affordable'] }),
    tagSource: 'doc',
    source: { section: S4, heading: 'Affordable Housing Talk Track' },
  },
  {
    id: 'aff.open',
    kind: 'opener',
    title: 'Affordable — Open',
    body: [
      say(
        'One of the biggest pain points we hear from affordable operators is that pre-qualification is eating your team alive — agents manually screening leads, asking income questions, doing AMI math — and a huge chunk were never going to qualify.',
      ),
    ],
    appliesTo: only({ asset: ['affordable'] }),
    tagSource: 'doc',
    next: ['aff.numbers'],
    source: { section: S4, heading: 'Affordable Housing Talk Track' },
  },
  {
    id: 'aff.numbers',
    kind: 'talk_track',
    title: 'Affordable — Numbers',
    body: [
      say(
        'In the last 12 months we ran 1.51 million affordable leads through automated pre-qualification across 240 operators. Of leads where the AI rendered a decision, 40% were screened out before a staff member touched them. Qualified applicants get a decision in 11 minutes median — a third of those at 9pm on a Saturday.',
      ),
    ],
    appliesTo: only({ asset: ['affordable'] }),
    tagSource: 'doc',
    next: ['aff.screened_out', 'aff.fitch_irick', 'aff.recerts'],
    source: { section: S4, heading: 'Affordable Housing Talk Track' },
  },
  {
    id: 'aff.screened_out',
    kind: 'talk_track',
    title: 'Screened-out leads as a positive',
    body: [
      say(
        "Those 40% aren't dead — if you have a market-rate sister community or a different AMI tier nearby, we route them there automatically.",
      ),
    ],
    appliesTo: only({ asset: ['affordable'] }),
    tagSource: 'doc',
    next: ['aff.fitch_irick', 'aff.recerts'],
    source: { section: S4, heading: 'Affordable Housing Talk Track' },
  },
  {
    id: 'aff.recerts',
    kind: 'talk_track',
    title: 'Recerts (seed)',
    body: [
      say(
        "We're in production on recerts — reads TICs, income verifications, packets, median 3.5 seconds per doc, 1% error rate, 79% auto-generated.",
      ),
    ],
    appliesTo: only({ asset: ['affordable'] }),
    tagSource: 'doc',
    next: ['aff.fitch_irick'],
    source: { section: S4, heading: 'Affordable Housing Talk Track' },
  },
  {
    id: 'aff.fitch_irick',
    kind: 'proof_point',
    title: 'Proof — Fitch Irick',
    body: [
      say(
        '10,750 affordable units on Yardi, co-developed the workflow with us. 45+ hours a week of pre-qual time saved, 100% of after-hours leads captured, collections up 191 basis points. Their EVP Doris Gantos is a reference.',
      ),
    ],
    appliesTo: only({ asset: ['affordable'] }),
    tagSource: 'doc',
    customers: ['Fitch Irick'],
    source: { section: S4, heading: 'Affordable Housing Talk Track' },
  },
  {
    id: 'aff.compliance',
    kind: 'objection',
    title: 'Compliance objection',
    body: [
      say(
        "Your compliance team sets the income limits, AMI thresholds, age requirements — EliseAI enforces exactly those rules every time, no variance. It's executing your policy at scale, and we log every decision, so your audit trail is cleaner than a manual process.",
      ),
    ],
    appliesTo: only({ asset: ['affordable'] }),
    tagSource: 'doc',
    objection: { tier: 'conditional', label: 'Compliance' },
    source: { section: S4, heading: 'Affordable Housing Talk Track' },
  },
  {
    id: 'aff.scale',
    kind: 'objection',
    title: 'If pushed on scale',
    body: [
      say(
        "Affordable is a more recent motion than market-rate, but 1.5M leads, 240 operators, and a reference like Fitch Irick isn't a pilot anymore. We've grown 2.7x in six months.",
      ),
    ],
    appliesTo: only({ asset: ['affordable'] }),
    tagSource: 'doc',
    customers: ['Fitch Irick'],
    objection: { tier: 'conditional', label: 'Too new / scale?' },
    source: { section: S4, heading: 'Affordable Housing Talk Track' },
  },

  // ── 5. Objection handling ───────────────────────────────────────────────
  {
    id: 'obj.not_interested',
    kind: 'objection',
    title: "Not interested / We're good",
    body: [
      say(
        "Totally understand — a lot of our clients said the same until they realized how many revenue gaps we could fill. Out of curiosity, when you say you're not interested, is that because you're already using something similar, or you just haven't had time to explore it?",
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    objection: { tier: 'core', label: 'Not interested' },
    source: { section: S5, heading: "Not interested / We're good" },
  },
  {
    id: 'obj.chatbot',
    kind: 'objection',
    title: 'Chatbots / "we have a bot"',
    body: [
      say(
        'Chatbots work on a decision-tree model that gets stuck and needs manual input. Our AI is conversational with a knowledge base and a brain — it handles and learns complex conversations with prospects and tenants.',
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    objection: { tier: 'core', label: 'We have a bot' },
    source: { section: S5, heading: 'Chatbots / "we have a bot"' },
  },
  {
    id: 'obj.what_is_elise',
    kind: 'objection',
    title: '"What is Elise?" rebuttal',
    body: [
      say(
        "Totally fair, I appreciate you asking. Property management teams right now are stretched thin — leasing agents are juggling tours, follow-ups, maintenance calls, collections, all of it. The teams we work with were losing leads after hours and burning out their onsite staff. We help take that off their plate. Are you seeing any of that with your teams?",
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    objection: { tier: 'core', label: 'What is Elise?' },
    source: { section: S8, heading: '"What is Elise?" rebuttal' },
  },
  {
    id: 'obj.one_system',
    kind: 'objection',
    title: '"One system" (Yardi/PMS consolidation)',
    body: [
      say("When you say one system, what's your goal?"),
      cue('(Wait for "I want to make life easier for my teams.")'),
      say(
        'Onsite teams tend to be our biggest advocates — for every product, the Elise version takes more work off their plate than the Yardi version. I had a client pilot both and put the decision entirely in the hands of the site teams, and they chose Elise across the board.',
      ),
    ],
    appliesTo: only({ pms: ['yardi'] }),
    tagSource: 'doc',
    tagNote: 'Doc heading says "Yardi/PMS consolidation" and the script names Yardi. Surfaces when PMS = Yardi.',
    objection: { tier: 'conditional', label: 'One system' },
    next: ['comp.yardi_integration'],
    source: { section: S5, heading: '"One system" (Yardi/PMS consolidation)' },
  },
  {
    id: 'obj.maint_not_tech',
    kind: 'objection',
    title: 'Maintenance — "Not tech forward"',
    body: [
      say(
        'Designed for career maintenance techs — intentionally simple, most are productive after one shift. Live support in English and Spanish.',
      ),
    ],
    appliesTo: only({ persona: ['maintenance'] }),
    tagSource: 'doc',
    objection: { tier: 'conditional', label: 'Not tech forward' },
    source: { section: S5, heading: 'Maintenance team objections' },
  },
  {
    id: 'obj.maint_tracking',
    kind: 'objection',
    title: 'Maintenance — "Uncomfortable with tracking"',
    body: [
      say(
        "We optimize routing by proximity — supervisors already make these calls manually. You control what's enabled; some clients start with light tracking mode.",
      ),
    ],
    appliesTo: only({ persona: ['maintenance'] }),
    tagSource: 'doc',
    objection: { tier: 'conditional', label: 'Tracking' },
    source: { section: S5, heading: 'Maintenance team objections' },
  },
  {
    id: 'obj.maint_devices',
    kind: 'objection',
    title: 'Maintenance — "Device/reimbursement issues"',
    body: [
      say(
        'Handled a few ways — shared phones/iPads on site, or personal devices with a $30–75 monthly stipend. We align to your model.',
      ),
    ],
    appliesTo: only({ persona: ['maintenance'] }),
    tagSource: 'doc',
    objection: { tier: 'conditional', label: 'Devices' },
    source: { section: S5, heading: 'Maintenance team objections' },
  },
  {
    id: 'obj.maint_scheduling',
    kind: 'objection',
    title: 'Maintenance — "AI taking over scheduling"',
    body: [
      say(
        'AI auto-assigns to keep things moving, but supervisors can reassign or reprioritize anytime. It shifts from constant manual dispatch to exception management.',
      ),
    ],
    appliesTo: only({ persona: ['maintenance'] }),
    tagSource: 'doc',
    objection: { tier: 'conditional', label: 'AI scheduling' },
    source: { section: S5, heading: 'Maintenance team objections' },
  },

  // ── 6. Competitor rebuttals ─────────────────────────────────────────────
  // Every competitor is always reachable from the Competitors tray; `conditional`
  // ones are also promoted into the main objection row when the PMS matches.
  {
    id: 'comp.yardi_virtuoso',
    kind: 'competitor',
    title: 'Yardi Virtuoso Enterprise ("AI built in, not bolted on")',
    body: [
      note(
        'despite "built in" messaging, Yardi\'s AI is still modularized — it loses context as you move module to module or PMS to external LLM. Elise is built on industry insights and completes the puzzle without losing context. Five customer-sourced Yardi pain points:',
      ),
      note("Insight doesn't travel — what one module learns stays in that module."),
      note('Data loses meaning once it leaves Yardi — point Claude/ChatGPT at it and you get confident, wrong answers.'),
      note('No single view of the prospect — split across CRM IQ, ChatIQ, RentCafe.'),
      note('Someone still has to act on the insight — a person pulls, analyzes, hands off.'),
      note("Virtuoso explains, it doesn't do — knows the help manual, not your portfolio."),
    ],
    appliesTo: only({ pms: ['yardi'] }),
    tagSource: 'doc',
    objection: { tier: 'conditional', label: 'Yardi Virtuoso' },
    next: ['comp.yardi_integration'],
    source: { section: S6, heading: 'Yardi Virtuoso Enterprise', attribution: 'Slack #competitors & #sdr-only' },
  },
  {
    id: 'comp.yardi_integration',
    kind: 'competitor',
    title: 'Yardi integration framing',
    body: [
      say(
        "With our Yardi integration, we're in 80% of Yardi units. We're not asking you to rip out what you have — we integrate with your PMS and use that data to automate workflows that still create work for your teams. You already have a system of record; the question is how much of the work happening around Yardi you can automate.",
      ),
    ],
    appliesTo: only({ pms: ['yardi'] }),
    tagSource: 'doc',
    objection: { tier: 'conditional', label: 'Already on Yardi' },
    source: { section: S6, heading: 'Yardi integration framing', attribution: 'Quinn Wayman' },
  },
  {
    id: 'comp.appfolio_realm_x',
    kind: 'competitor',
    title: 'AppFolio Realm-X ("most powerful AI yet, now standard")',
    body: [
      note('Our core answer:'),
      say("AppFolio's AI may handle the first question, but Elise finishes the whole job."),
      note(
        '"Up to 35% more showings" — "up to" is best case, not average; ask what happens after the showing is booked.',
      ),
      note(
        '"Resolves 30% of conversations" — means 70% still lands on the team; Elise runs 85%+ automation at Asset Living.',
      ),
      note(
        'Maintenance "1 in 4 work orders" — leaves 3 in 4 for staff; Elise triages, enriches with video, scores techs, feeds costs to AP.',
      ),
      note(
        'Receptionist Performer — "routing a call isn\'t resolving it." Elise Voice books the tour, logs the work order, collects payment. Peakmade booked 24% more leads than its prior call center.',
      ),
    ],
    appliesTo: only({ pms: ['appfolio'] }),
    tagSource: 'doc',
    customers: ['Asset Living', 'Peakmade'],
    objection: { tier: 'conditional', label: 'AppFolio AI' },
    source: { section: S6, heading: 'AppFolio Realm-X', attribution: 'Slack #competitors & #sdr-only' },
  },
  {
    id: 'comp.entrata_realpage',
    kind: 'competitor',
    title: 'Entrata Eli+ / RealPage Lumina',
    body: [
      note('Same stuff that applies to Yardi.'),
      say('They had to buy an AI company and bring it in-house. Why do you think it\'s free?'),
    ],
    appliesTo: only({ pms: ['entrata', 'realpage'] }),
    tagSource: 'doc',
    objection: { tier: 'conditional', label: 'Entrata / RealPage AI' },
    source: { section: S6, heading: 'Quick competitor notes', attribution: 'Rex Geller, #sdr-only' },
  },
  {
    id: 'comp.happyco',
    kind: 'competitor',
    title: 'HappyCo JoyAI',
    body: [
      note('only maintenance/inspection, triages then hands to human.'),
      say('What happens if someone has both a maintenance question and a collections question?'),
      note('Focus on unified AI.'),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    objection: { tier: 'core', label: 'HappyCo' },
    source: { section: S6, heading: 'Quick competitor notes', attribution: 'Rex Geller, #sdr-only' },
  },
  {
    id: 'comp.funnel',
    kind: 'competitor',
    title: 'Funnel AI',
    body: [
      note('built off Sierra (a customer-service AI), not trained on multifamily.'),
      say('Elise has over a billion multifamily conversations that protect you from fair housing violations.'),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    objection: { tier: 'core', label: 'Funnel' },
    source: { section: S6, heading: 'Quick competitor notes', attribution: 'Rex Geller, #sdr-only' },
  },
  {
    id: 'comp.nurture_boss',
    kind: 'competitor',
    title: 'Nurture Boss',
    body: [note('good product, hard time scaling — 23 employees to our 600.')],
    appliesTo: ALL,
    tagSource: 'general',
    objection: { tier: 'core', label: 'Nurture Boss' },
    source: { section: S6, heading: 'Quick competitor notes', attribution: 'Rex Geller, #sdr-only' },
  },

  // ── 8. Additional openers & angles ──────────────────────────────────────
  {
    id: 'opener.ops_efficiency',
    kind: 'opener',
    title: 'Operational efficiency angle',
    body: [
      say(
        "Hey [Name], this is [name] with EliseAI. I work with a lot of ops leaders who are trying to figure out how to get more out of their onsite teams without adding headcount. Curious how you're handling things like after-hours leasing calls and delinquency follow-ups across your properties right now?",
      ),
    ],
    appliesTo: only({ persona: ['ops'] }),
    tagSource: 'doc',
    tagNote: 'Script is addressed to "ops leaders".',
    next: ['discovery.property_managers', 'track.high_level', 'proof.voice_ai', 'proof.delinquency'],
    source: { section: S8, heading: 'Operational efficiency angle' },
  },
  {
    id: 'opener.leasing_vacancy',
    kind: 'opener',
    title: 'Leasing / vacancy angle',
    body: [
      say(
        "A lot of the property management companies I talk to are losing leads after hours when nobody's in the office to pick up. Is that something you're running into, or have you guys figured that out?",
      ),
    ],
    appliesTo: only({ persona: ['leasing'] }),
    tagSource: 'inferred',
    tagNote: 'Leasing/lead-capture angle with no persona label. Mapped to the leasing persona (the sheet\'s Leasing/Sales lane).',
    next: ['proof.leasing_ai', 'proof.voice_ai', 'track.zillow'],
    source: { section: S8, heading: 'Leasing / vacancy angle' },
  },
  {
    id: 'opener.quick_direct',
    kind: 'opener',
    title: 'Quick and direct',
    body: [
      say(
        'We help property management companies automate leasing and collections so your onsite teams can actually focus on the stuff that matters. Would you be open to 20 minutes this week to see if it makes sense?',
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    next: GENERAL_NEXT,
    source: { section: S8, heading: 'Quick and direct' },
  },
  {
    id: 'opener.mystery_shop',
    kind: 'opener',
    title: 'Mystery shop opener (email)',
    body: [
      say(
        "I had my team mystery shop a sample of your properties. 33% never responded. Of those that did, initial response time averaged 26 hours 55 minutes, agents only answered 50% of leads' questions, followed up 0.8 times per lead, and attempted to schedule a tour 0.8 times per lead. We're a conversational AI platform purpose-built for residential, live in 6M+ units.",
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    channel: 'email',
    source: { section: S8, heading: 'Mystery shop opener (email)' },
  },
  {
    id: 'opener.lease_audit',
    kind: 'opener',
    title: 'Lease audit opener',
    body: [
      say(
        "You might recognize the name — we're integrated partners with Yardi and work with some of the top property managers as an AI of choice. I saw on your LinkedIn you handle some of the audit responsibilities. We just released a lease auditing tool that automates that process, connecting the ledger directly back to the leases to find discrepancies. I'd love to show you that and a few more. Can I grab a few minutes this week or next?",
      ),
    ],
    appliesTo: only({ persona: ['finance'] }),
    tagSource: 'inferred',
    tagNote: 'Addressed to someone who "handles audit responsibilities". Mapped to finance.',
    next: ['proof.lease_audits', 'proof.delinquency'],
    source: { section: S8, heading: 'Lease audit opener' },
  },
  {
    id: 'opener.win_back',
    kind: 'opener',
    title: 'Community-of-the-moment (win-back)',
    body: [
      say(
        'Calling about [property/address] — does that ring any bells? We used to provide leasing and resident AI there. I pulled some data and I know our services have gone dark. I\'d love to share some insights on how we were performing and the lift we provided in the past. Have you heard about EliseAI?',
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    situation: 'win_back',
    next: GENERAL_NEXT,
    source: { section: S8, heading: 'Community-of-the-moment (win-back)' },
  },

  // ── 9. Resident AI deep-dive ────────────────────────────────────────────
  {
    id: 'detail.delinquency_ai',
    kind: 'product_detail',
    title: 'Delinquency AI',
    body: [
      note(
        'Proactively contacts current AND former residents with outstanding balances, even after move-out. Two-way via email, SMS, and voice. Increases payment velocity by ~8 days, decreases delinquencies ~30% on average. Real-time reporting on AI and agent performance. Example impact: doubled rent collection speed, delinquency down 2.5+ percentage points (~$44.8K/yr per property), 17 days to 90% collected dropped to 10 days.',
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    next: ['detail.demand_notices', 'detail.outbound_calling', 'detail.one_resident_ai'],
    source: { section: S9, heading: 'Delinquency AI' },
  },
  {
    id: 'detail.demand_notices',
    kind: 'product_detail',
    title: 'Delinquency — Demand Notice Generation (Now Live)',
    body: [
      note(
        'Agents spend days each month generating and sending eviction and 3-day notices to high volumes of late payers. Elise auto-fills and generates demand notices. Saves time, cuts costs, frees teams for higher-value work.',
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    source: { section: S9, heading: 'Delinquency — Demand Notice Generation (Now Live)' },
  },
  {
    id: 'detail.outbound_calling',
    kind: 'product_detail',
    title: 'Delinquency — Outbound Calling (Now Live)',
    body: [
      note(
        'Elise texts and calls renters to remind them of payments before and after the due date. Records all calls, collects transcripts, encourages residents to pay over the phone or leave a voicemail.',
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    source: { section: S9, heading: 'Delinquency — Outbound Calling (Now Live)' },
  },
  {
    id: 'detail.pre_renewal',
    kind: 'product_detail',
    title: 'Renewals — Pre-Renewal Check-Ins (Now Live)',
    body: [
      note(
        'Elise notifies residents of renewals, tracks progress, sends instructions and reminders. Check-ins 3–6 months before lease end for residents with positive feedback. Responses categorized as renewing, likely to renew, unknown, or not renewing — used to cross-sell or add to layout-transfer waitlists.',
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    next: ['detail.cross_selling'],
    source: { section: S9, heading: 'Renewals — Pre-Renewal Check-Ins (Now Live)' },
  },
  {
    id: 'detail.cross_selling',
    kind: 'product_detail',
    title: 'Renewals — Cross-Selling (Now Live)',
    body: [
      note(
        "When a resident indicates they aren't renewing, Elise asks for move-out reason and date, then searches the org's portfolio for matching properties. Too expensive → recommends more affordable nearby communities. Wants bigger layout → suggests larger units in the same property first, then cross-sells. Moving cities → suggests properties in the new location. Keeps non-renewing residents inside your network and reduces marketing cost.",
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    source: { section: S9, heading: 'Renewals — Cross-Selling (Now Live)' },
  },
  {
    id: 'detail.renewal_portal',
    kind: 'product_detail',
    title: 'Renewals — Portal (Now Live)',
    body: [
      note(
        'Self-serve way for residents to review terms and renew online. Send notices with pricing, promos, selection options. Customize logo, colors, acknowledgments, required/optional questions, disclaimers, fees. Track session counts and open rates.',
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    source: { section: S9, heading: 'Renewals — Portal (Now Live)' },
  },
  {
    id: 'detail.renewal_prediction',
    kind: 'product_detail',
    title: 'Renewals — Prediction Model & Reasons (Now Live)',
    body: [
      note(
        'Shows Likely / Unlikely / Uncertain renewal predictions per lease in the Resident Contacts table, with reason tags. Uses an ML model analyzing conversational data, lease history, delinquency, and rent comparisons.',
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    source: { section: S9, heading: 'Renewals — Prediction Model & Reasons (Now Live)' },
  },
  {
    id: 'detail.one_resident_ai',
    kind: 'product_detail',
    title: 'One Resident AI (Live)',
    body: [
      note(
        'Delinquency AI and Renewal/Maintenance AI now share context for a seamless resident experience. AI can answer renewal/maintenance questions and vice versa. Delinquency AI can accept a promise to pay, file a service request, or surface a notice to vacate. Full parity across delinquency, maintenance, and renewal conversations — on email, SMS, and voice.',
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    source: { section: S9, heading: 'One Resident AI (Live)' },
  },
  {
    id: 'detail.generative_notifications',
    kind: 'product_detail',
    title: 'Generative Resident & Renewals Notifications (Now Live)',
    body: [
      note(
        'Messaging is powered by generative updates reflecting real-time resident context — recent move-in, product launches, work orders, agent responses. Before each scheduled renewals follow-up, the AI checks whether to send one, then decides standard vs. generative.',
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    source: { section: S9, heading: 'Generative Resident & Renewals Notifications (Now Live)' },
  },
  {
    id: 'detail.maintenance_app',
    kind: 'product_detail',
    title: 'Maintenance App detail',
    body: [
      note(
        "Residents text or call to file work orders; surveys on completion; de-escalates ~20% of 'emergencies'; routes true emergencies and hosts your phone tree; reduces ticket volume via self-help. Technician mobile app on iOS and Android — perform all maintenance work, chat and call residents, receive auto-assigned emergencies. Asset tracking for make, model, serial, location, and repair history.",
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    source: { section: S9, heading: 'Maintenance App detail' },
  },

  // ── 10. Follow-up email patterns ────────────────────────────────────────
  {
    id: 'fu.affordable',
    kind: 'follow_up',
    title: 'Affordable follow-up',
    body: [
      note(
        'Lead with EliseAI being the first AI platform to automate leasing and resident conversations for affordable — pre-qualifications, recertifications, waitlisting, fully compliant. Name-drop Cardinal, Penrose, The NHP Foundation. Then lease audits ($1.6M annualized undercharges confirmed) and delinquency ($3M AI-collected for one customer). Tie to their unit count and ask for two 20–30 min windows.',
      ),
    ],
    appliesTo: only({ asset: ['affordable'] }),
    tagSource: 'doc',
    channel: 'email',
    customers: ['Cardinal', 'Penrose', 'The NHP Foundation'],
    source: { section: S10, heading: 'Affordable follow-up' },
  },
  {
    id: 'fu.already_exploring_ai',
    kind: 'follow_up',
    title: '"Already exploring AI" follow-up',
    body: [
      note(
        "Acknowledge they're already looking at AI, then position lease audits and delinquency as gaps most platforms don't cover well. Lease audits: ~8% undercharges, $1.6M+ missed annual revenue, one operator found $50K in a week. Delinquency: up to 40% reduction, cash flow +11 days, 15+ hours/week saved. Offer a 20-minute benchmark walkthrough.",
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    channel: 'email',
    source: { section: S10, heading: '"Already exploring AI" follow-up' },
  },
  {
    id: 'fu.highlights',
    kind: 'follow_up',
    title: 'Highlights follow-up (broad)',
    body: [
      note(
        'Live across 6M+ units, boosting revenue without extra headcount. Delinquency 40% reduction / 11-day cash flow / $3M collected; Lease Audits ~8% / $1.6M; Voice AI 90% of calls / 29-sec response; Maintenance 26% fewer emergency calls / $27K saved at Student Quarters; Renewals 97.1% rate / $1.5M+ captured.',
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    channel: 'email',
    customers: ['Student Quarters'],
    source: { section: S10, heading: 'Highlights follow-up (broad)' },
  },
  {
    id: 'fu.not_a_lead_source',
    kind: 'follow_up',
    title: '"Not a lead source" follow-up',
    body: [
      say("We're not a lead source — we're the engine that converts them."),
      note(
        '50–60% lead-to-lease (vs 30% avg), 2% higher occupancy than local markets (third-party ALN study, 3,700+ communities), 90%+ call coverage 24/7. Offer a pilot period to fine-tune configs and prove ROI before full rollout.',
      ),
    ],
    appliesTo: ALL,
    tagSource: 'general',
    channel: 'email',
    source: { section: S10, heading: '"Not a lead source" follow-up' },
  },
];

export const ENTRIES: readonly Entry[] = [...BASE_ENTRIES, ...MATRIX_ENTRIES];

// Sources the doc names. The doc gives no links ("Source doc IDs retained in
// project notes"), so url is null until someone supplies them. The doc does
// not reference a Yardi deck or an objection spreadsheet.
const BASE_REFERENCES: readonly Reference[] = [
  { id: 'ref.talk_tracks', title: 'Talk Tracks!', owner: 'quinn.wayman', url: null },
  { id: 'ref.cold_call_cheat_sheet', title: 'Cold Call Cheat Sheet', owner: 'Izzy', url: null },
  { id: 'ref.jk_cold_calling', title: 'JK Cold Calling', owner: 'Jonathan', url: null },
  { id: 'ref.objection_playbook', title: 'EliseAI Sales Call & Objection Handling Playbook', url: null },
  { id: 'ref.slack_sdr_only', title: 'Slack #sdr-only', url: null },
  { id: 'ref.slack_competitors', title: 'Slack #competitors', url: null },
];

export const REFERENCES: readonly Reference[] = [...BASE_REFERENCES, ...MATRIX_REFERENCES];

// Content holes the tool must show rather than paper over.
export const GAPS: readonly Gap[] = [
  {
    id: 'gap.student',
    appliesTo: { asset: ['student'] },
    description:
      'No student housing talk track yet: discovery themes only. The Student Housing sequence doc is linked under Follow-ups.',
    source: '7. The Gap to Fill',
  },
  {
    id: 'gap.senior',
    appliesTo: { asset: ['senior'] },
    description:
      'No senior housing talk track. Falls back to the general track; the "Want a human" objection covers older residents.',
    source: '7. The Gap to Fill',
  },
  {
    id: 'gap.lease_up',
    appliesTo: { asset: ['lease_up'] },
    description:
      'Lease-up has a capability note but no opener and no read-aloud script. Uses the general opener. Not a build-out priority.',
    source: '3. Product Talk Tracks & Proof Points',
  },
  {
    id: 'gap.affordable_close',
    appliesTo: { asset: ['affordable'] },
    description:
      'Affordable track lists a "close" beat but the doc has no close script for it. Rep has to improvise or use the general ask.',
    source: '4. Affordable Housing Talk Track',
  },
  {
    id: 'gap.maintenance_opener',
    appliesTo: { persona: ['maintenance'] },
    description:
      'Maintenance has value props and four rebuttals but no opener. Uses the general opener.',
  },
  {
    id: 'gap.regional_exec_opener',
    appliesTo: { persona: ['regional', 'executive'] },
    description: 'No opener for regional or exec titles yet. Uses the general opener; their value props are under Next.',
  },
  {
    id: 'gap.reviews_track',
    appliesTo: { persona: ['ops'] },
    description: 'The "bad review impact" track has a problem statement only: the sheet has no value prop or proof for it.',
    source: '13. Problem-Statement Talk Tracks',
  },
  {
    id: 'gap.third_party_fee_manager',
    appliesTo: { ownership: ['third_party'] },
    description:
      'Doc says "we speak to [fee managers] about workflow, admin, dispatches" but has no fee-manager-specific script.',
    source: '2. Persona / Ownership Talk Tracks',
  },
];
