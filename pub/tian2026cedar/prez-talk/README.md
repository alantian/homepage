# CEDAR — extended talk

Animated HTML slide deck for a 40-minute talk on *CEDAR: Agent-Orchestrated
Tree Search for Goal-Directed Optimization of Complex Systems* (Yingtao Tian,
Sakana AI). 34 slides, no external dependencies: works offline. This is the
long-form sibling of the 15-minute ALIFE 2026 deck; the first half of that
deck's slides reappear here with the method, setup, results, and positioning
material from the paper's appendices added in between.

## Present

Open `index.html` in any browser, or serve for another machine with
`python3 serve.py` (port 8124, binds 0.0.0.0) and open `http://<host>:8124/`.
The per-slide speaker script with timings is in `talk-script.md`.

Keys: `→` / `Space` next build step or slide, `←` back, `F` fullscreen,
`Home`/`End` jump. `#/N/F` deep-links slide N with F build steps shown.
`?still=1` jumps all animation to its end state (screenshot checks).
`prefers-reduced-motion` renders everything statically.

Animation notes: the title and closing slides run the sakana.ai homepage
fish school (`js/p5.min.js` + `js/sketch.js`, vendored; drag-to-add
removed). Slide 2 types the goal, highlights the three objectives, boxes
their defining equations in the full 178-line DYNAMO listing, then
flashes real def-to-use dependency arrows parsed from the source. Slide 23
climbs the actual search tree one strategy at a time. Eyebrow numbers and
the fish progress rail are generated from slide order.

## Tools

`tools/make_formulas.sh` re-renders the LaTeX formula SVGs in `images/`
(needs TeX Live with dvisvgm).
