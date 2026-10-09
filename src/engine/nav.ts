// Call navigation: a stack of entry ids. The bottom is always the opener.
//
// - open: push (next option, objection, tray item, search result)
// - back: pop one
// - returnToPitch: pop every rebuttal on top, back to the last pitch entry
// - jump: breadcrumb click, truncate to that depth
// - syncOpener: classifier changed — swap the opener only if the rep hasn't
//   moved past it and hasn't hand-picked an alternative

import type { Entry } from '../data/schema.ts';

export type Nav = {
  stack: readonly string[];
  openerPinned: boolean; // rep chose an alt opener by hand
};

export type NavAction =
  | { type: 'open'; id: string }
  | { type: 'chooseOpener'; id: string }
  | { type: 'back' }
  | { type: 'returnToPitch' }
  | { type: 'jump'; index: number }
  | { type: 'syncOpener'; id: string }
  | { type: 'reset'; id: string };

export const isRebuttal = (e: Entry | undefined) => e?.kind === 'objection' || e?.kind === 'competitor';

export const initialNav = (openerId: string): Nav => ({ stack: [openerId], openerPinned: false });

export function navReducer(nav: Nav, action: NavAction, byId: ReadonlyMap<string, Entry>): Nav {
  const { stack } = nav;
  switch (action.type) {
    case 'open':
      if (stack[stack.length - 1] === action.id) return nav;
      return { ...nav, stack: [...stack, action.id] };
    case 'chooseOpener':
      return { stack: [action.id], openerPinned: true };
    case 'back':
      return stack.length > 1 ? { ...nav, stack: stack.slice(0, -1) } : nav;
    case 'returnToPitch': {
      let n = stack.length;
      while (n > 1 && isRebuttal(byId.get(stack[n - 1]))) n--;
      return n === stack.length ? nav : { ...nav, stack: stack.slice(0, n) };
    }
    case 'jump':
      return action.index >= 0 && action.index < stack.length - 1
        ? { ...nav, stack: stack.slice(0, action.index + 1) }
        : nav;
    case 'syncOpener':
      if (stack.length !== 1 || nav.openerPinned || stack[0] === action.id) return nav;
      return { ...nav, stack: [action.id] };
    case 'reset':
      return initialNav(action.id);
  }
}
