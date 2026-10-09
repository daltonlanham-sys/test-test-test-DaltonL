// Splits script text into plain / stat / customer runs so numbers and customer
// names stand out at a glance. Pure presentation: joining the runs always
// reproduces the input exactly (covered by test/highlight.test.ts).

export type Run = { kind: 'text' | 'stat' | 'customer'; text: string };

const STAT =
  /[~+$]*\d+(?:[.,]\d+)*(?:%|x|K\+?|M\+?|\+)?(?:\s(?:million|hours?|minutes?|days?|seconds?|basis points|percentage points))?/g;

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function highlight(text: string, customers: readonly string[] = []): Run[] {
  const names = [...customers].sort((a, b) => b.length - a.length).map(escape);
  const pattern = names.length ? new RegExp(`(${names.join('|')})|${STAT.source}`, 'g') : STAT;
  const runs: Run[] = [];
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    const i = m.index ?? 0;
    if (i > last) runs.push({ kind: 'text', text: text.slice(last, i) });
    runs.push({ kind: m[1] ? 'customer' : 'stat', text: m[0] });
    last = i + m[0].length;
  }
  if (last < text.length) runs.push({ kind: 'text', text: text.slice(last) });
  return runs;
}
