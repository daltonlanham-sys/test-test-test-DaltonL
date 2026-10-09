import type { Entry } from '../../data/schema.ts';
import { triggerLabel } from './ObjectionBar.tsx';
import { Key } from './Key.tsx';

type Props = {
  title: string;
  items: Entry[];
  onPick: (id: string) => void;
  onClose: () => void;
};

// Pop-up list above the objection bar. Number keys pick (handled in App).
export function Tray({ title, items, onPick, onClose }: Props) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="tray" role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="tray__head">
          <h2>{title}</h2>
          <button className="btn btn--ghost" onClick={onClose}>
            Close <Key k="Esc" />
          </button>
        </div>
        {items.length === 0 && <p className="tray__empty">Nothing for this call state.</p>}
        <div className="tray__list">
          {items.map((e, i) => {
            const why = triggerLabel(e);
            return (
              <button key={e.id} className="option" onClick={() => onPick(e.id)}>
                {i < 9 && <Key k={String(i + 1)} />}
                <span className="option__title">{e.title}</span>
                {why && <span className="option__kind option__kind--accent">{why}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
