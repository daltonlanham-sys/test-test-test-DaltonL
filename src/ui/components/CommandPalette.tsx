import { useMemo, useState } from 'react';
import type { CallState } from '../../data/schema.ts';
import { search } from '../../engine/search.ts';
import { KIND_LABEL } from '../labels.ts';

type Props = {
  call: CallState;
  onPick: (id: string) => void;
  onClose: () => void;
};

export function CommandPalette({ call, onPick, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const results = useMemo(() => search(query, call).slice(0, 30), [query, call]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === 'Enter' && results[cursor]) {
      onPick(results[cursor].entry.id);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="overlay overlay--top" onClick={onClose}>
      <div className="palette" role="dialog" aria-label="Search" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          className="palette__input"
          placeholder="Search every talk track, rebuttal, proof point…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCursor(0);
          }}
          onKeyDown={onKeyDown}
        />
        <div className="palette__list">
          {results.map(({ entry, inState }, i) => (
            <button
              key={entry.id}
              className={'option' + (i === cursor ? ' option--cursor' : '')}
              onMouseEnter={() => setCursor(i)}
              onClick={() => onPick(entry.id)}
            >
              <span className="option__title">{entry.title}</span>
              <span className="option__kind">{KIND_LABEL[entry.kind]}</span>
              {!inState && <span className="option__kind option__kind--muted">other state</span>}
            </button>
          ))}
          {results.length === 0 && <p className="tray__empty">No matches.</p>}
        </div>
      </div>
    </div>
  );
}
