// Writes site/changes.json from git log: date, short commit, subject (newest first).
// Run before committing:  node tools/make-changes.mjs   (the pipeline should run it at build time; see now.md)
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const log = execSync("git log --format=%h%x09%cs%x09%s -n 200", { encoding: 'utf8' }).trim().split('\n');
const changes = log.map((l) => { const [commit, date, ...s] = l.split('\t'); return { date, commit, subject: s.join('\t') }; });
writeFileSync('site/changes.json', JSON.stringify({ about: 'What changed on this site, newest first, from the git history. A fictional example site.', repository: 'https://github.com/SovereignWebsite/Site__Template__Sport__Padel-Coach', changes }, null, 1) + '\n');
console.log(`site/changes.json: ${changes.length} changes`);
