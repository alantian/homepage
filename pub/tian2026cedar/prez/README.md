# CEDAR — ALIFE 2026 talk

Animated HTML slide deck for *CEDAR: Agent-Orchestrated Tree Search for
Goal-Directed Optimization of Complex Systems* (Yingtao Tian, Sakana AI).
15-minute talk, 17 slides, no external dependencies: works offline.

## Present

Open `index.html` in any browser, or serve for another machine with
`python3 serve.py` (port 8123, binds 0.0.0.0) and open `http://<host>:8123/`.
The per-slide speaker script with timings is in `talk-script.md`.

Keys: `→` / `Space` next build step or slide, `←` back, `F` fullscreen,
`Home`/`End` jump. `#/N/F` deep-links slide N with F build steps shown.
`?still=1` jumps all animation to its end state (screenshot checks).
`prefers-reduced-motion` renders everything statically.

Animation notes: the title and closing slides run the sakana.ai homepage
fish school (`js/p5.min.js` + `js/sketch.js`, vendored; drag-to-add
removed). Slide 2 types the goal, highlights the three objectives, boxes
their defining equations in the full 178-line DYNAMO listing, then
flashes real def-to-use dependency arrows parsed from the source.

## Tools

`tools/make_formulas.sh` re-renders the LaTeX formula SVGs in `images/`
(needs TeX Live with dvisvgm).
