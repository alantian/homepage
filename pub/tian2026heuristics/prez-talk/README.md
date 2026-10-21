# Heuristic Bench — extended talk

Animated HTML slide deck for *Heuristic Bench: Evaluating LLM Agents by
Authoring Executable Policies* (Yingtao Tian, Sakana AI). 40 slides, no
external dependencies: works offline. A variant of the sibling deck in
`../prez/`: same content, with the paper's appendix material placed where
the main text cites it, a different palette and type, and new animations.

## Present

Open `index.html` in any browser, or serve for another machine with
`python3 serve.py` (port 8124, binds 0.0.0.0) and open `http://<host>:8124/`.
The per-slide speaker script is in `talk-script.md`.

Keys: `→` / `Space` next build step or slide, `←` back, `F` fullscreen,
`Home`/`End` jump. `#/N/F` deep-links slide N with F build steps shown.
`?still=1` jumps all animation to its end state (screenshot checks).
`prefers-reduced-motion` renders everything statically.

## Design

Each slide carries a tag naming the paper section it comes from (`§4.3`),
filled when it is appendix material (`App. C.1`). The fish progress bar along
the bottom follows the sibling deck, coloured by section. Section colours: indigo (motivation), green
(method), ochre (results), crimson (analysis).

Animations: the title and closing slides run the sakana.ai homepage fish
school (`js/p5.min.js` + `js/sketch.js`, vendored, as in the sibling deck).
Slide 6 runs the agent
loop with packets travelling to and from the platform. Slide 12 shows
weights flying from `opponent.py` into `policy.py` until a keypress raises
the shield. Slide 17 draws all 47 models' posterior intervals from the
paper's full results table. Slide 23 draws the best-so-far lines from the
paper's improvement table, with keypress highlights. Slide 31 animates the
correlation bars and the 74% agreement gauge. Paper figures on slides 21,
22, 24, 35, and 38 wipe in.
