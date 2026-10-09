import type { Entry } from '../../data/schema.ts';
import { highlight } from '../highlight.ts';
import { KIND_LABEL } from '../labels.ts';
import { Key } from './Key.tsx';

export const NEXT_KEYS = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o'];
export const ALT_OPENER_KEYS = ['z', 'x', 'v', 'b', 'n', 'm'];

type Props = {
  entry: Entry;
  next: Entry[];
  altOpeners: Entry[]; // only passed while the rep is on the opener
  pitchTarget: Entry | null; // set while a rebuttal is on top
  onOpen: (id: string) => void;
  onChooseOpener: (id: string) => void;
  onReturnToPitch: () => void;
};

export function Script({ entry }: { entry: Entry }) {
  return (
    <div className="script">
      {entry.body.map((seg, i) => (
        <p key={i} className={`seg-${seg.t}`}>
          {highlight(seg.text, entry.customers).map((r, j) =>
            r.kind === 'text' ? r.text : <mark key={j} className={`hl-${r.kind}`}>{r.text}</mark>,
          )}
        </p>
      ))}
    </div>
  );
}

export function ReadingPane({ entry, next, altOpeners, pitchTarget, onOpen, onChooseOpener, onReturnToPitch }: Props) {
  return (
    <article className={`pane pane--${entry.kind}`} aria-live="polite">
      <div className="pane__meta">
        <span className={`kind kind--${entry.kind}`}>{KIND_LABEL[entry.kind]}</span>
        {entry.channel === 'email' && <span className="badge">Email</span>}
        {entry.situation === 'win_back' && <span className="badge">Win-back only</span>}
        {entry.tagSource === 'inferred' && (
          <span className="badge badge--warn" title={entry.tagNote}>
            Inferred tag
          </span>
        )}
        <span className="pane__source">
          §{entry.source.section}
          {entry.source.attribution && ` · ${entry.source.attribution}`}
        </span>
      </div>
      <h1 className="pane__title">{entry.title}</h1>

      <Script entry={entry} />

      {pitchTarget && (
        <button className="return" onClick={onReturnToPitch}>
          <Key k="P" /> ↩ Back to pitch: <strong>{pitchTarget.title}</strong>
        </button>
      )}

      {next.length > 0 && (
        <nav className="options" aria-label="Next">
          <h2 className="options__head">Next</h2>
          {next.map((e, i) => (
            <button key={e.id} className="option" onClick={() => onOpen(e.id)}>
              {NEXT_KEYS[i] && <Key k={NEXT_KEYS[i].toUpperCase()} />}
              <span className="option__title">{e.title}</span>
              <span className="option__kind">{KIND_LABEL[e.kind]}</span>
            </button>
          ))}
        </nav>
      )}

      {altOpeners.length > 0 && (
        <nav className="options options--alt" aria-label="Other openers">
          <h2 className="options__head">Other openers</h2>
          {altOpeners.map((e, i) => (
            <button key={e.id} className="option option--small" onClick={() => onChooseOpener(e.id)}>
              {ALT_OPENER_KEYS[i] && <Key k={ALT_OPENER_KEYS[i].toUpperCase()} />}
              <span className="option__title">{e.title}</span>
              {e.channel === 'email' && <span className="option__kind">Email</span>}
              {e.situation === 'win_back' && <span className="option__kind">Win-back</span>}
            </button>
          ))}
        </nav>
      )}
    </article>
  );
}
