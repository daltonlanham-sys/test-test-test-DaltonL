import { useEffect, useMemo, useReducer, useState } from 'react';
import type { CallState, Entry } from '../data/schema.ts';
import { ENTRIES } from '../data/entries.ts';
import { initialNav, isRebuttal, navReducer, type NavAction, type Nav } from '../engine/nav.ts';
import { nextFor, resolve } from '../engine/resolve.ts';
import { ClassifierBar } from './components/ClassifierBar.tsx';
import { CommandPalette } from './components/CommandPalette.tsx';
import { ObjectionBar } from './components/ObjectionBar.tsx';
import { ALT_OPENER_KEYS, NEXT_KEYS, ReadingPane } from './components/ReadingPane.tsx';
import { StatusStrip } from './components/StatusStrip.tsx';
import { Tray } from './components/Tray.tsx';

const BY_ID: ReadonlyMap<string, Entry> = new Map(ENTRIES.map((e) => [e.id, e]));
const BLANK: CallState = { asset: null, persona: null, ownership: null, pms: null };

type Overlay = null | 'competitors' | 'followups' | 'cues' | 'search';

// sessionStorage keeps the call alive across an accidental reload. It is a
// convenience only — everything works when storage is unavailable.
const STORE_KEY = 'sdr-talk-track:call';
function load(): { call: CallState; collapsed: boolean } {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE_KEY) ?? 'null');
    if (saved?.call) return { call: { ...BLANK, ...saved.call }, collapsed: !!saved.collapsed };
  } catch {
    /* ignore */
  }
  return { call: BLANK, collapsed: false };
}
function save(call: CallState, collapsed: boolean) {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify({ call, collapsed }));
  } catch {
    /* ignore */
  }
}

const reducer = (nav: Nav, action: NavAction) => navReducer(nav, action, BY_ID);

export function App() {
  const [call, setCall] = useState<CallState>(() => load().call);
  const [collapsed, setCollapsed] = useState(() => load().collapsed);
  const [overlay, setOverlay] = useState<Overlay>(null);

  const resolved = useMemo(() => resolve(call), [call]);
  const [nav, dispatch] = useReducer(reducer, resolved.opener.id, initialNav);

  useEffect(() => dispatch({ type: 'syncOpener', id: resolved.opener.id }), [resolved.opener.id]);
  useEffect(() => save(call, collapsed), [call, collapsed]);

  const stack = nav.stack.map((id) => BY_ID.get(id)!);
  const current = stack[stack.length - 1];
  const onOpener = stack.length === 1;
  const next = nextFor(current, call);
  const altOpeners = onOpener ? [resolved.opener, ...resolved.altOpeners].filter((e) => e.id !== current.id) : [];
  const pitchTarget = isRebuttal(current) ? ([...stack].reverse().find((e) => !isRebuttal(e)) ?? null) : null;

  const objectionRow = [...resolved.objections, ...resolved.promotedCompetitors];
  const trays: Record<'competitors' | 'followups' | 'cues', { title: string; items: Entry[] }> = {
    competitors: { title: 'Competitor rebuttals', items: resolved.competitors },
    followups: { title: 'Follow-up email patterns', items: resolved.followUps },
    cues: { title: 'Discovery cues', items: resolved.discovery },
  };

  const open = (id: string) => {
    dispatch({ type: 'open', id });
    setOverlay(null);
  };
  const newCall = () => {
    setCall(BLANK);
    setCollapsed(false);
    setOverlay(null);
    dispatch({ type: 'reset', id: resolve(BLANK).opener.id });
  };

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
      if (ev.target instanceof HTMLInputElement || ev.target instanceof HTMLTextAreaElement) return;
      const k = ev.key.toLowerCase();
      const digit = /^[1-9]$/.test(k) ? Number(k) - 1 : -1;
      let handled = true;

      if (overlay && overlay !== 'search') {
        // Tray open: digits pick from the tray, Esc closes.
        if (digit >= 0 && trays[overlay].items[digit]) open(trays[overlay].items[digit].id);
        else if (k === 'escape') setOverlay(null);
        else if (k === 'c' || k === 'f' || k === 'd') setOverlay(null);
        else handled = false;
      } else if (overlay === 'search') {
        handled = false; // palette handles its own keys
      } else if (digit >= 0) {
        if (objectionRow[digit]) open(objectionRow[digit].id);
      } else if (ev.shiftKey && k === 'n') {
        newCall();
      } else if (NEXT_KEYS.includes(k)) {
        const e = next[NEXT_KEYS.indexOf(k)];
        if (e) open(e.id);
      } else if (ALT_OPENER_KEYS.includes(k)) {
        const e = altOpeners[ALT_OPENER_KEYS.indexOf(k)];
        if (e) dispatch({ type: 'chooseOpener', id: e.id });
      } else if (k === 'escape' || k === 'backspace') {
        dispatch({ type: 'back' });
      } else if (k === 'p') {
        dispatch({ type: 'returnToPitch' });
      } else if (k === 'c') setOverlay('competitors');
      else if (k === 'f') setOverlay('followups');
      else if (k === 'd' && resolved.discovery.length) setOverlay('cues');
      else if (k === '/') setOverlay('search');
      else if (k === '`') setCollapsed((c) => !c);
      else handled = false;

      if (handled) ev.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="app">
      <ClassifierBar
        call={call}
        onChange={(axis, value) => setCall((c) => ({ ...c, [axis]: value }))}
        onNewCall={newCall}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
      />
      <StatusStrip
        call={call}
        resolved={resolved}
        stack={stack}
        onJump={(index) => dispatch({ type: 'jump', index })}
        onBack={() => dispatch({ type: 'back' })}
        onSearch={() => setOverlay('search')}
      />
      <main className="main">
        <ReadingPane
          entry={current}
          next={next}
          altOpeners={altOpeners}
          pitchTarget={pitchTarget}
          onOpen={open}
          onChooseOpener={(id) => dispatch({ type: 'chooseOpener', id })}
          onReturnToPitch={() => dispatch({ type: 'returnToPitch' })}
        />
      </main>
      <ObjectionBar
        items={objectionRow}
        activeId={current.id}
        competitorCount={resolved.competitors.length}
        followUpCount={resolved.followUps.length}
        cueCount={resolved.discovery.length}
        onOpen={open}
        onTray={setOverlay}
      />
      {overlay && overlay !== 'search' && (
        <Tray {...trays[overlay]} onPick={open} onClose={() => setOverlay(null)} />
      )}
      {overlay === 'search' && <CommandPalette call={call} onPick={open} onClose={() => setOverlay(null)} />}
    </div>
  );
}
