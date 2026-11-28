# Now (2026-11-27T13:55Z)

- Key up: site/keys/padel-coach.c.json, first commit signed and pushed.
- First version built from padel.c's preview: site/index.html + assets/style.css, extra.css, app.js; every word in data/content.json (EN and PT), court geometry in data/court.json; photos in assets/img/. No third-party fonts or scripts.
- Draft and demo notices shown. PT text is machine-translated and unchecked (flagged on the page).
- tools/check.sh passes.

- design.c's fixes 1 to 5 done (13:5x UTC): mobile week list under 40rem; self-hosted Barlow Condensed 800 (SIL OFL, Latin, swap, preload); WebP srcset 480/960/1376 with sizes and lazy below the hero (JPEG masters kept in assets/img); bio short plus "More about" details; reduced motion shows the ball at rest and the court lab has each shot in words (EN and PT).
- design.c's five designs merged (work/design.c-padel-1 at 58b3092) with picker keys in content.json (EN and PT), a "Choose a design" button in the top bar linking /designs/, footer link targets 44 px; two stray junk files from that branch removed. Live: /designs/ and /designs/1 to 5. Choice of design is Dinis's.
- site/designs/** and site/assets/fonts/** for the five directions are design.c's: I leave them alone (my one font file sits in site/assets/fonts/).

## To do
1. Ask design.c (through padel.c) for the brief and directions; then designs in EN and PT.
2. Learnings from Lee-Elle's site: one "Choose a design" button with real screenshots; admin area (tasks, designs, content, photos and credits, checks, history); guided tour slides with PDF; floating language button on scroll; check at 390 px, light and dark.
3. Share card done 2026-11-28 (89 KB, made locally from p1, no model call, fictional label on it). Tour PDFs and screenshots: draft locally only, publish none until the vault route is settled (conductor.c).
4. Record each image/text model call with model and cost (none made by me yet).
5. Cross-account guidance from conductor.c, when padel.c forwards it: record it in restart.md.

## 2026-11-28 version and GitHub star (rule relayed by padel.c from Dinis via c.productions and conductor.c)
- Version at the top of every page (in the notice bar), read from /version.json by app.js, linking to /changes.json; "★ GitHub" in the top menu (a compact ★ on phones); same in all five designs (build.mjs re-run; I widened its chooser regex so linked words in the notice are filled).
- site/changes.json is made by tools/make-changes.mjs from git log (date, short commit, subject). Gap: it runs by hand before a commit, so it lags by one commit and carries no version per entry. The proper fix is a step in the pipeline's build (.github/ci/build.mjs or the workflow, both seeded by IaC and not mine to change): asked padel.c to raise it.
