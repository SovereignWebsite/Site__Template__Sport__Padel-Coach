# Design brief and round 1: the padel coach example

By design.c@SovereignWebsite.dinis, 27 November 2026, for padel.c and padel-coach.c. The site is a fictional coach, Tomás Vilaréu, made to show what a padel coach's own Sovereign Website can do, with "wow factor" (Dinis). Every word stays in site/data/content.json, in English and Portuguese; the designs add none, except the picker's design names until padel-coach.c adds keys for them (see the end).

## The brief

**Keep in every design.** The hero photograph, the court lab, the week and the level finder. The court lab is the "wow": no ordinary coach site has it, so every design makes it bigger. The fictional and draft notice stays first, in words.

**Base fixes (made by padel-coach.c, eb09bea).** A day-by-day week list on phones, a self-hosted display font, WebP photographs in srcset, a short bio with "More about Tomás", and motion that stops for reduced motion, with each shot's path in words.

**The standard for all five.** Phone first, with the name, the tagline and one call to action on the first screen at 390 x 844, and no sideways scroll at 320. Light and dark. axe-core clean at every impact level at 390 and 1366, in English and Portuguese, with the picker open, a shot chosen, a session picked and a quiz answer given. Nothing loaded from another host. Touch targets of at least 44 px. One "Choose a design" button, closed by default, with real screenshots.

## How the designs are made

site/designs/build.mjs builds each design from the live page (site/index.html), so all five carry the same words, the same script and every base fix as soon as it lands; run `node site/designs/build.mjs` after changing the live page. Each design is the live markup plus /designs/shared.css (fonts, picker, the bigger court lab, touch targets) and its own style.css. Fonts are SIL Open Font License 1.1, served from /assets/fonts/ with their licences; Barlow Condensed 800 is the base's own file.

**The court lab, in every design:** the court takes the full width of the page, as large as the screen allows, and the shot card sits beneath it in two columns. Each design paints the court surface in its own colour.

## The five directions

1. **Matchday.** A broadcast scoreboard. Barlow Condensed for every heading and number, court blue and ball yellow. The top bar is a score bug; programmes are fixture cards; the court lab is a replay panel with a recording light (which stays still for reduced motion).
2. **Algarve Light.** Photograph-led and editorial. Instrument Serif headlines with an italic first line, cream and orange-grove green. The page's background runs from morning light at the top to evening at the bottom, the way the coach's day runs, and the photographs go full width.
3. **Court Lines.** The court is the grid. Space Grotesk and IBM Plex Mono. Every section sits in a frame drawn like the court: glass walls as the border, the net and service lines as marks. Where the browser supports scroll-driven animation, each frame draws itself as it scrolls in; with reduced motion or an older browser it is simply there. The level ladder sits on a faint tactics board.
4. **Club Poster.** A bold club poster in Archivo, set very narrow for headings and very wide for labels, with our own tile border along each section (drawn for this site, not copied from a real azulejo). Both languages on every heading: the other language sits beneath, smaller, and a screen reader reads it once.
5. **Night Session.** The floodlit evening court, in Big Shoulders Display, ball yellow on near black. A soft floodlight falls on the court from above; nothing glows. It is dark in every scheme on purpose, the one design that does not follow the light preference.

## Recommendation

**Lead with Matchday (1).** It is the most padel: it reads like the sport on television, it makes the court lab feel like a replay, and it is clear on a phone. **Keep Club Poster (4)** as the second: it is the most distinctive and the only one that turns the two languages into the design. Night Session (5) is the strongest mood but the narrowest audience; Algarve Light (2) is the gentlest and will improve most with real photographs; Court Lines (3) is the cleverest and the quietest. The choice is padel.c's and Dinis's.

## What the keeper can add

- **Picker words in content.json**, so the picker switches language with the page: design_choose, design_intro, design_compare, design_live, and design_n1 to design_n5 (Matchday, Algarve Light, Court Lines, Club Poster, Night Session). build.mjs uses them as soon as they exist.
- **A link to /designs/** from the live page, for example in the footer.
- **Live page footer links** are under 24 px tall at 390 (axe target-size, links_admin); the designs fix this in shared.css, and the live page can take the same rule.
