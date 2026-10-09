// Assembles dist-artifact/sdr-talk-track.html: one self-contained page for
// publishing as a claude.ai artifact (no doctype/html/head/body — the host
// wraps it). React comes from cdnjs; everything else is inlined.
import { readFileSync, writeFileSync } from 'node:fs';

const dir = new URL('../dist-artifact/', import.meta.url);
const js = readFileSync(new URL('build/app.js', dir), 'utf8');
const css = readFileSync(new URL('build/app.css', dir), 'utf8');
if (/<\/script/i.test(js) || /<\/style/i.test(css)) throw new Error('Bundle contains a closing tag; escape it before inlining');

const REACT = '18.3.1';
const html = `<title>SDR Talk Track Tool</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;500;600;700&display=swap">
<style>
${css}
</style>
<div id="root"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/${REACT}/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/${REACT}/umd/react-dom.production.min.js"></script>
<script>
${js}
</script>
`;
writeFileSync(new URL('sdr-talk-track.html', dir), html);
console.log(`dist-artifact/sdr-talk-track.html  ${(html.length / 1024).toFixed(1)} kB`);
