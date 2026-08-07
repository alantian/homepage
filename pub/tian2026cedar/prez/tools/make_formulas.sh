#!/usr/bin/env bash
# Render the deck's display formulas with real LaTeX -> SVG (glyphs as paths).
# Output: images/f-*.svg, images/sym-*.svg, images/expr-*.svg
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT=$PWD
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

render() {  # render <name> <math>
  cat > "$TMP/$1.tex" <<EOF
\documentclass[border=2pt]{standalone}
\usepackage{amsmath,amssymb}
\usepackage{xcolor}
\begin{document}
\color[HTML]{22252A}
\$\displaystyle $2\$
\end{document}
EOF
  (cd "$TMP" && latex -interaction=nonstopmode "$1.tex" >/dev/null && dvisvgm --no-fonts -e -o "$1.svg" "$1.dvi" >/dev/null 2>&1)
  cp "$TMP/$1.svg" "$ROOT/images/$1.svg"
}

render f-euler-arrow '\frac{d\mathbf{x}}{dt} = f(\mathbf{x}, t) \;\;\xrightarrow{\;\text{Euler}\;}\;\; \mathbf{x}_{t+\Delta t} = \mathbf{x}_t + \Delta t \cdot f(\mathbf{x}_t, t)'
render f-uct '\textsc{Score}(v) \;=\; S_v \;+\; \alpha\sqrt{\frac{\ln(c_p+1)}{c_v+1}}\cdot\mathbb{I}[c_v<\tau] \;+\; \gamma\cdot\textsc{Depth}(v)'
render f-phi '\phi(v) \;=\; \alpha\sqrt{\frac{\ln(c_p+1)}{c_v+1}}\cdot\mathbb{I}[c_v<\tau] \;+\; \beta\cdot\mathbb{I}[c_v\ge\tau] \;+\; \gamma\cdot\textsc{Depth}(v), \qquad \beta = -\infty'
render f-kernel 'P_u \sim P_\theta\!\left(\,\cdot \mid P_v, A_v, s, G\,\right)'
render sym-alpha '\alpha'
render sym-gamma '\gamma'
render sym-tau '\tau'
render expr-cvtau 'c_v \ge \tau'
render expr-a1g2 '\alpha = 1, \;\; \gamma = 2'
render expr-betainf '\beta = -\infty'
echo done
