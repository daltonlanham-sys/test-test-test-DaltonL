import type { AppliesTo, CallState } from '../../data/schema.ts';
import { ASSET_TYPES, OWNERSHIP, PERSONAS, PMS, SECONDARY_ASSET_TYPES } from '../../data/schema.ts';
import { ENTRIES } from '../../data/entries.ts';
import { ASSET_LABEL, OWNERSHIP_LABEL, PERSONA_LABEL, PMS_LABEL } from '../labels.ts';

type Axis = keyof CallState;

const ROWS: { axis: Axis; label: string; values: readonly string[]; names: Record<string, string> }[] = [
  { axis: 'asset', label: 'Asset', values: ASSET_TYPES, names: ASSET_LABEL },
  { axis: 'persona', label: 'Persona', values: PERSONAS, names: PERSONA_LABEL },
  { axis: 'ownership', label: 'Owner', values: OWNERSHIP, names: OWNERSHIP_LABEL },
  { axis: 'pms', label: 'PMS', values: PMS, names: PMS_LABEL },
];

// Values with no dedicated content get a "general" marker so the rep knows
// up front that picking them changes nothing. Conventional and "Other" PMS
// are the general track by definition, so they aren't marked.
const hasContent = (axis: Axis, v: string) =>
  ENTRIES.some((e) => {
    const a = e.appliesTo[axis as keyof AppliesTo];
    return a !== '*' && (a as readonly string[]).includes(v);
  });
const UNMARKED = new Set(['conventional', 'other']);

type Props = {
  call: CallState;
  onChange: (axis: Axis, value: string | null) => void;
  onNewCall: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

export function ClassifierBar({ call, onChange, onNewCall, collapsed, onToggleCollapsed }: Props) {
  if (collapsed) {
    return (
      <header className="classifier classifier--collapsed">
        <button className="classifier__summary" onClick={onToggleCollapsed} title="Show classifiers (`)">
          {ROWS.map(({ axis, label, names }) => (
            <span key={axis} className="summary-chip">
              <span className="summary-chip__axis">{label}</span>
              {call[axis] ? names[call[axis]!] : '—'}
            </span>
          ))}
          <span className="summary-chip summary-chip--edit">Edit ▾</span>
        </button>
        <button className="btn btn--ghost" onClick={onNewCall} title="New call (Shift+N)">
          New call <kbd>⇧N</kbd>
        </button>
      </header>
    );
  }

  return (
    <header className="classifier">
      <div className="classifier__rows">
        {ROWS.map(({ axis, label, values, names }) => (
          <div className="classifier__row" key={axis} role="radiogroup" aria-label={label}>
            <span className="classifier__label">{label}</span>
            <div className="classifier__buttons">
              {values.map((v) => {
                const selected = call[axis] === v;
                const secondary = axis === 'asset' && SECONDARY_ASSET_TYPES.includes(v as never);
                const general = !UNMARKED.has(v) && !hasContent(axis, v);
                return (
                  <button
                    key={v}
                    role="radio"
                    aria-checked={selected}
                    className={'seg' + (selected ? ' seg--on' : '') + (secondary ? ' seg--secondary' : '')}
                    onClick={() => onChange(axis, selected ? null : v)}
                    title={general ? 'No dedicated content yet: uses the general track' : undefined}
                  >
                    {names[v]}
                    {general && <span className="seg__flag">general</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="classifier__actions">
        <button className="btn btn--ghost" onClick={onNewCall} title="New call (Shift+N)">
          New call <kbd>⇧N</kbd>
        </button>
        <button className="btn btn--ghost" onClick={onToggleCollapsed} title="Collapse (`)">
          Collapse <kbd>`</kbd>
        </button>
      </div>
    </header>
  );
}
