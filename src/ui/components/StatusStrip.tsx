import type { CallState, Entry } from '../../data/schema.ts';
import type { Resolved } from '../../engine/resolve.ts';
import { Key } from './Key.tsx';

type Props = {
  call: CallState;
  resolved: Resolved;
  stack: Entry[];
  onJump: (index: number) => void;
  onBack: () => void;
  onSearch: () => void;
};

export function StatusStrip({ call, resolved, stack, onJump, onBack, onSearch }: Props) {
  const unset = (Object.keys(call) as (keyof CallState)[]).filter((k) => call[k] === null);
  return (
    <div className="status">
      <div className="crumbs">
        <button className="btn btn--ghost" onClick={onBack} disabled={stack.length < 2} title="Back (Esc / Backspace)">
          ← Back <Key k="Esc" />
        </button>
        <ol className="crumbs__list">
          {stack.map((e, i) => (
            <li key={i}>
              {i < stack.length - 1 ? (
                <button className="crumb" onClick={() => onJump(i)}>
                  {e.title}
                </button>
              ) : (
                <span className="crumb crumb--current">{e.title}</span>
              )}
            </li>
          ))}
        </ol>
        <button className="btn btn--ghost crumbs__search" onClick={onSearch}>
          Search <Key k="/" />
        </button>
      </div>
      <div className="notices">
        {resolved.isFallback && (
          <span className="notice notice--fallback">
            General multifamily track{unset.length === 4 ? ': set the classifiers above' : ''}
          </span>
        )}
        {resolved.gaps.map((g) => (
          <span key={g.id} className="notice notice--gap" title={g.source}>
            {g.description}
          </span>
        ))}
      </div>
    </div>
  );
}
