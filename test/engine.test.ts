import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { CallState } from '../src/data/schema.ts';
import { ENTRIES } from '../src/data/entries.ts';
import { initialNav, navReducer, type Nav, type NavAction } from '../src/engine/nav.ts';
import { nextFor, resolve } from '../src/engine/resolve.ts';
import { search } from '../src/engine/search.ts';
import { highlight } from '../src/ui/highlight.ts';

const BY_ID = new Map(ENTRIES.map((e) => [e.id, e]));
const BLANK: CallState = { asset: null, persona: null, ownership: null, pms: null };
const run = (nav: Nav, ...actions: NavAction[]) => actions.reduce((n, a) => navReducer(n, a, BY_ID), nav);
const labels = (s: CallState) => resolve(s).objections.map((e) => e.objection!.label);

test('blank state loads the general opener and only core objections', () => {
  const r = resolve(BLANK);
  assert.equal(r.opener.id, 'opener.standard');
  assert.equal(r.isFallback, true);
  assert.deepEqual(labels(BLANK), ['Not interested', 'We have a bot', 'What is Elise?', 'Want a human']);
  assert.deepEqual(r.promotedCompetitors, []);
});

test('affordable surfaces its opener and compliance objection', () => {
  const s = { ...BLANK, asset: 'affordable' } as const;
  assert.equal(resolve(s).opener.id, 'aff.open');
  assert.ok(labels(s).includes('Compliance'));
});

test('asset outranks persona when both have an opener', () => {
  assert.equal(resolve({ ...BLANK, asset: 'affordable', persona: 'ownership' }).opener.id, 'aff.open');
});

test('Yardi surfaces "one system" and promotes Yardi competitor rebuttals', () => {
  const r = resolve({ ...BLANK, pms: 'yardi' });
  assert.ok(r.objections.some((e) => e.id === 'obj.one_system'));
  assert.deepEqual(
    r.promotedCompetitors.map((e) => e.id),
    ['comp.yardi_virtuoso', 'comp.yardi_integration', 'comp.yardi_customers'],
  );
  assert.ok(!resolve({ ...BLANK, pms: 'appfolio' }).objections.some((e) => e.id === 'obj.one_system'));
});

test('student and senior fall back to the general track and report a gap', () => {
  for (const asset of ['student', 'senior'] as const) {
    const r = resolve({ ...BLANK, asset });
    assert.equal(r.isFallback, true);
    assert.ok(r.gaps.some((g) => g.id === `gap.${asset}`));
  }
});

test('lease-up track is offered from every phone opener only when asset = lease_up', () => {
  for (const persona of [null, 'ops', 'marketing', 'leasing', 'finance', 'regional', 'ownership', 'executive'] as const) {
    const on = { ...BLANK, asset: 'lease_up', persona } as const;
    const off = { ...BLANK, asset: 'conventional', persona } as const;
    assert.ok(nextFor(resolve(on).opener, on).some((e) => e.id === 'track.lease_up'), `persona ${persona}`);
    assert.ok(!nextFor(resolve(off).opener, off).some((e) => e.id === 'track.lease_up'));
  }
});

test('every state resolves; every conditional rebuttal is reachable from some state', () => {
  const surfaced = new Set<string>();
  for (const asset of [null, 'conventional', 'affordable', 'student', 'senior', 'lease_up'] as const)
    for (const persona of [null, 'ops', 'marketing', 'leasing', 'maintenance', 'finance', 'regional', 'ownership', 'executive'] as const)
      for (const pms of [null, 'yardi', 'appfolio', 'entrata', 'realpage', 'other'] as const) {
        const r = resolve({ asset, persona, ownership: null, pms });
        [...r.objections, ...r.competitors].forEach((e) => surfaced.add(e.id));
      }
  const rebuttals = ENTRIES.filter((e) => e.objection).map((e) => e.id);
  assert.deepEqual(rebuttals.filter((id) => !surfaced.has(id)), []);
});

test('each persona opens on its own opener where one exists', () => {
  const opener = (persona: CallState['persona']) => resolve({ ...BLANK, persona }).opener.id;
  assert.equal(opener('marketing'), 'opener.marketing_occupancy');
  assert.equal(opener('leasing'), 'opener.leasing_vacancy');
  assert.equal(opener('ops'), 'opener.ops_efficiency');
  assert.equal(opener('ownership'), 'opener.ownership_portfolio');
  assert.equal(opener('regional'), 'opener.standard'); // no regional opener yet
});

test('openers offer the persona and asset value props for the call state first', () => {
  for (const [persona, prefix] of [
    ['marketing', 'pain.mkt_'],
    ['leasing', 'pain.lsg_'],
    ['ops', 'pain.ops_'],
    ['maintenance', 'pain.mnt_'],
    ['regional', 'pain.reg_'],
    ['ownership', 'pain.am_'],
    ['executive', 'pain.exec_'],
  ] as const) {
    const s = { ...BLANK, persona };
    const next = nextFor(resolve(s).opener, s).map((e) => e.id);
    assert.ok(next[0].startsWith(prefix) || next[0].startsWith('problem.'), `${persona}: ${next[0]}`);
    assert.ok(!next.some((id) => id.startsWith('pain.') && !id.startsWith(prefix)), `${persona} leaks other lanes`);
  }
  const aff = { ...BLANK, asset: 'affordable' } as const;
  assert.ok(nextFor(resolve(aff).opener, aff).some((e) => e.id === 'pain.aff_compliance'));
});

test('follow-ups tray gets the persona template doc, most specific first', () => {
  const refs = resolve({ ...BLANK, persona: 'leasing' }).references.map((r) => r.id);
  assert.equal(refs[0], 'ref.seq_leasing');
  assert.ok(!refs.includes('ref.seq_marketing'));
  assert.ok(refs.includes('ref.matrix'));
});

test('nav: objection then return-to-pitch snaps back past chained rebuttals', () => {
  const nav = run(
    initialNav('opener.standard'),
    { type: 'open', id: 'track.high_level' },
    { type: 'open', id: 'obj.not_interested' },
    { type: 'open', id: 'obj.chatbot' },
    { type: 'returnToPitch' },
  );
  assert.deepEqual(nav.stack, ['opener.standard', 'track.high_level']);
});

test('nav: back, jump, and no-op on re-opening the current entry', () => {
  let nav = run(initialNav('opener.standard'), { type: 'open', id: 'a' }, { type: 'open', id: 'b' });
  assert.equal(run(nav, { type: 'open', id: 'b' }), nav);
  nav = run(nav, { type: 'back' });
  assert.deepEqual(nav.stack, ['opener.standard', 'a']);
  assert.deepEqual(run(nav, { type: 'jump', index: 0 }).stack, ['opener.standard']);
  assert.deepEqual(run(initialNav('x'), { type: 'back' }).stack, ['x']);
});

test('nav: classifier change swaps the opener only while still on an unpinned opener', () => {
  const fresh = initialNav('opener.standard');
  assert.deepEqual(run(fresh, { type: 'syncOpener', id: 'aff.open' }).stack, ['aff.open']);
  const moved = run(fresh, { type: 'open', id: 'track.high_level' }, { type: 'syncOpener', id: 'aff.open' });
  assert.deepEqual(moved.stack, ['opener.standard', 'track.high_level']);
  const pinned = run(fresh, { type: 'chooseOpener', id: 'opener.win_back' }, { type: 'syncOpener', id: 'aff.open' });
  assert.deepEqual(pinned.stack, ['opener.win_back']);
});

test('highlight never changes script text', () => {
  for (const e of ENTRIES)
    for (const seg of e.body) assert.equal(highlight(seg.text, e.customers).map((r) => r.text).join(''), seg.text);
});

test('highlight marks stats and customer names', () => {
  const runs = highlight('Cardinal Group went 7% to 4%. Summit recovered ~$3M.', ['Cardinal Group', 'Summit']);
  const marked = runs.filter((r) => r.kind !== 'text').map((r) => `${r.kind}:${r.text}`);
  assert.deepEqual(marked, ['customer:Cardinal Group', 'stat:7%', 'stat:4%', 'customer:Summit', 'stat:~$3M']);
});

test('search ranks in-state entries first', () => {
  const hits = search('yardi', { ...BLANK, asset: 'affordable' });
  assert.ok(hits.length > 0);
  const firstOut = hits.findIndex((h) => !h.inState);
  assert.ok(firstOut === -1 || hits.slice(firstOut).every((h) => !h.inState));
});
