# Heuristic Bench — talk

Animated HTML slide deck for *Heuristic Bench: Evaluating LLM Agents by
Authoring Executable Policies* (Yingtao Tian, Sakana AI). 26 main slides
plus 17 appendix backup slides after the Questions slide; no external
dependencies: works offline. All prose, tables, and figures come
from the paper's LaTeX sources; the slide design and presentation engine
follow the CEDAR talk deck (`/pub/tian2026cedar/prez-talk/`).

## Present

Open `index.html` in any browser, or serve for another machine with
`python3 serve.py` (port 8124, binds 0.0.0.0) and open `http://<host>:8124/`.
The per-slide speaker script is in `talk-script.md`.

Keys: `→` / `Space` next build step or slide, `←` back, `F` fullscreen,
`Home`/`End` jump. `#/N/F` deep-links slide N with F build steps shown.
`?still=1` jumps all animation to its end state (screenshot checks).
`prefers-reduced-motion` renders everything statically.

Animation notes: the title and closing slides run the sakana.ai homepage
fish school (`js/p5.min.js` + `js/sketch.js`, vendored). Slide 5 reveals the
benchmark overview figure region by region. Slides 6, 14, 17, and 20
highlight steps, rows, and code lines on keypress. Eyebrow numbers and the
fish progress rail are generated from slide order.

Appendix (slides 27 to 43, slate colour) mirrors the paper's appendices:
instruction package and session contract, isolation and validation,
measurement details, all 47 models, core-model coverage, a shielding
exhibit, the full champion source, best-policy galleries, model versions,
routing, RL baseline details, task pairs, all 15 leaderboards, statements.

## Figures

`images/` holds copies of the paper's figures (SVG from `writing_ref/` and
`assets/`, the task gallery downscaled to 1600 px). Re-copy them from the
paper repository if the paper's plots change.
