import type { Entry } from '../../data/schema.ts';
import { ASSET_LABEL, OWNERSHIP_LABEL, PERSONA_LABEL, PMS_LABEL } from '../labels.ts';
import { Key } from './Key.tsx';

// Short "why is this here" tag for conditional buttons, e.g. "Affordable", "Yardi".
export function triggerLabel(e: Entry): string | null {
  if (e.objection?.tier !== 'conditional') return null;
  const { asset, persona, ownership, pms } = e.appliesTo;
  if (asset !== '*') return asset.map((v) => ASSET_LABEL[v]).join('/');
  if (persona !== '*') return persona.map((v) => PERSONA_LABEL[v]).join('/');
  if (ownership !== '*') return ownership.map((v) => OWNERSHIP_LABEL[v]).join('/');
  if (pms !== '*') return pms.map((v) => PMS_LABEL[v]).join('/');
  return null;
}

type Props = {
  items: Entry[];
  activeId: string;
  competitorCount: number;
  followUpCount: number;
  cueCount: number;
  onOpen: (id: string) => void;
  onTray: (tray: 'competitors' | 'followups' | 'cues') => void;
};

export function ObjectionBar({ items, activeId, competitorCount, followUpCount, cueCount, onOpen, onTray }: Props) {
  return (
    <footer className="objections" aria-label="Objections">
      <div className="objections__buttons">
        {items.map((e, i) => {
          const why = triggerLabel(e);
          return (
            <button
              key={e.id}
              className={'obj' + (why ? ' obj--conditional' : '') + (e.id === activeId ? ' obj--active' : '')}
              onClick={() => onOpen(e.id)}
            >
              {i < 9 && <Key k={String(i + 1)} />}
              <span className="obj__label">{e.objection!.label}</span>
              {why && <span className="obj__why">{why}</span>}
            </button>
          );
        })}
      </div>
      <div className="objections__trays">
        <button className="obj obj--tray" onClick={() => onTray('competitors')}>
          <Key k="C" /> Competitors <span className="count">{competitorCount}</span>
        </button>
        <button className="obj obj--tray" onClick={() => onTray('followups')}>
          <Key k="F" /> Follow-ups <span className="count">{followUpCount}</span>
        </button>
        {cueCount > 0 && (
          <button className="obj obj--tray" onClick={() => onTray('cues')}>
            <Key k="D" /> Discovery <span className="count">{cueCount}</span>
          </button>
        )}
      </div>
    </footer>
  );
}
