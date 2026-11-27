// Builds the five design previews from the live page, so they always carry the same words, script and fixes.
// Run from the repository root: node site/designs/build.mjs
// By design.c@SovereignWebsite.dinis. Each design is the live markup plus /designs/shared.css and its own style.css;
// nothing here adds a word that is not in /data/content.json, except the design names in the picker.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const ROOT = 'site';
const ORIGIN = 'https://padel-coach.sport.template.sovereignweb.site';
export const DESIGNS = [
  { n: 1, name: 'Matchday', pt: 'Dia de jogo', line: 'A broadcast scoreboard: fixtures, a score bug and a replay panel.' },
  { n: 2, name: 'Algarve Light', pt: 'Luz do Algarve', line: 'Photograph-led and editorial, from morning light to evening.' },
  { n: 3, name: 'Court Lines', pt: 'Linhas do court', line: 'The court is the grid: every section framed by its lines.' },
  { n: 4, name: 'Club Poster', pt: 'Cartaz do clube', line: 'A bold club poster with tile borders, in two languages at once.' },
  { n: 5, name: 'Night Session', pt: 'Sessão noturna', line: 'The floodlit evening court, dark by default.' },
];
const content = JSON.parse(readFileSync(`${ROOT}/data/content.json`, 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Picker words: from content.json when padel-coach.c has added the keys (then they switch language with the page);
// until then, the English placeholders below, with no data-t, so the page script never blanks them.
const KEYS = { choose: 'design_choose', intro: 'design_intro', compare: 'design_compare', live: 'design_live' };
const FALLBACK = { choose: 'Choose a design', intro: 'Five designs for the same coach, the same words and the same court lab.', compare: 'Compare them', live: 'See the live page' };
const w = (k) => content.ui[KEYS[k]] ? `<span data-t="${KEYS[k]}">${esc(content.ui[KEYS[k]].en)}</span>` : `<span lang="en">${FALLBACK[k]}</span>`;
const dname = (d) => content.ui[`design_n${d.n}`] ? `<span data-t="design_n${d.n}">${esc(content.ui[`design_n${d.n}`].en)}</span>` : `<span lang="en">${d.name}</span>`;
function picker(cur) {
  const cards = DESIGNS.map((d) => `<li><a href="/designs/${d.n}/"${d.n === cur ? ' aria-current="page"' : ''}><img src="/designs/${d.n}/thumb.webp" alt="" width="240" height="150" loading="lazy"><span class="pn">${d.n}. ${dname(d)}</span></a></li>`).join('');
  const now = DESIGNS.find((d) => d.n === cur);
  return `<nav class="dpick" aria-label="Choose a design"><div class="wrap"><details><summary>${w('choose')}<span class="dp-now">${now.n} ${dname(now)}</span></summary><div class="dp-panel"><p>${w('intro')} <a href="/designs/">${w('compare')}</a> <a href="/">${w('live')}</a></p><ul>${cards}</ul></div></details></div></nav>`;
}

// Headings carry both languages as data, so a design can show the other language beside them (design 4).
function bilingual(html) {
  return html.replace(/<h2([^>]*?)data-t="([a-z0-9_]+)"([^>]*)>/g, (m, a, k, b) => {
    const t = content.ui[k];
    return t ? `<h2${a}data-t="${k}" data-en="${esc(t.en)}" data-pt="${esc(t.pt)}"${b}>` : m;
  });
}

const live = readFileSync(`${ROOT}/index.html`, 'utf8');
for (const d of DESIGNS) {
  let h = live;
  const url = `${ORIGIN}/designs/${d.n}/`;
  h = h.replace('<html lang="en-GB">', `<html lang="en-GB" data-design="${d.n}">`);
  h = h.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">\n<meta name="robots" content="noindex">`);
  h = h.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  h = h.replace('<link rel="stylesheet" href="/assets/extra.css">', `<link rel="stylesheet" href="/assets/extra.css">\n<link rel="stylesheet" href="/designs/shared.css">\n<link rel="stylesheet" href="/designs/${d.n}/style.css">`);
  h = h.replace('</aside>', `</aside>\n${picker(d.n)}`);
  h = bilingual(h);
  mkdirSync(`${ROOT}/designs/${d.n}`, { recursive: true });
  writeFileSync(`${ROOT}/designs/${d.n}/index.html`, h);
}

// The chooser page: the five side by side, with real screenshots.
let head = live.split('<body>')[0]
  .replace(/<title>[^<]*<\/title>/, '<title>Five designs for a padel coach (a fictional example)</title>')
  .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${ORIGIN}/designs/">\n<meta name="robots" content="noindex">`)
  .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${ORIGIN}/designs/">`)
  .replace('<link rel="stylesheet" href="/assets/extra.css">', '<link rel="stylesheet" href="/assets/extra.css">\n<link rel="stylesheet" href="/designs/shared.css">');
const notice = live.split('<body>')[1].split('</aside>')[0] + '</aside>';
const cards = DESIGNS.map((d) => `<li><a href="/designs/${d.n}/"><img src="/designs/${d.n}/shot.webp" alt="" width="720" height="450" loading="lazy"><h2>${d.n}. ${d.name} <span lang="pt-PT">${d.pt}</span></h2><p>${d.line}</p></a></li>`).join('\n');
writeFileSync(`${ROOT}/designs/index.html`, `${head}<body class="chooser">\n${notice.replace(/<span([^>]*?) data-t="([a-z_0-9]+)">[^<]*<\/span>/g, (m, a, k) => `<span${a}>${content.ui[k] ? content.ui[k].en : ''}</span>`)}
<main id="main"><div class="wrap">
<p class="eyebrow">Designs, by design.c</p>
<h1>Five designs for one padel coach</h1>
<p class="intro">The same words, the same week and the same court lab, in five directions. Each one works on a phone, in English and Portuguese, light and dark. Pick one to open it; the live page is at <a href="/">the home page</a>.</p>
<ul class="dgrid">
${cards}
</ul>
</div></main>
</body>
</html>
`);
console.log('wrote 5 designs and the chooser');
