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

# ---- extended (40-minute) deck ----
render f-ode-ic '\frac{d\mathbf{x}}{dt} = f(\mathbf{x}, t), \qquad \mathbf{x}(t_0) = \mathbf{x}_0, \qquad \mathbf{x} \in \mathbb{R}^n'
render f-logistic '\frac{dN}{dt} = R\,N\left(1 - \frac{N}{K}\right)'
render f-phi-braces '\phi \;=\; \underbrace{\alpha\sqrt{\frac{\ln(c_p+1)}{c_v+1}}\cdot\mathbb{I}[c_v<\tau] \;+\; \beta\,\mathbb{I}[c_v\ge\tau]}_{\text{progressive widening}} \;+\; \underbrace{\gamma\cdot\textsc{Depth}(v)}_{\text{depth bonus}}'
render f-score-phi '\textsc{Score}(v) \;=\; S_v + \phi(c_v, c_p, \tau), \qquad v^{\star} \;=\; \arg\max_{v \in V_{\mathrm{exp}}} \textsc{Score}(v)'
render f-kernel-full 'P_u \sim P_\theta(\,\cdot \mid P_v, A_v, s, G), \qquad P_\theta = \textsc{LlmEditor}_\theta, \quad s \sim \mathrm{Uniform}(\mathcal{S})'
render f-value-fn '(A_u, S_u) = R_\phi(P_u, R_u, G), \qquad R_\phi = \textsc{LlmJudge}_\phi, \qquad S_u = \pi_S\!\left(R_\phi(P_u, R_u, G)\right)'
render f-depthcap 'S_v \;\le\; 10.0 + 2.5 \cdot \textsc{Depth}(v)'
render f-alg-init '(A_0, S_0) \leftarrow \textsc{LlmJudge}(P_0, \textsc{Run}(P_0), G), \quad P^{\ast} \leftarrow P_0, \; S^{\ast} \leftarrow S_0'
render f-alg-select 'v \leftarrow \arg\max_{v \in V_{\mathrm{exp}}} \textsc{Score}(v)'
render f-alg-strategy 's \sim \mathrm{Uniform}(\mathcal{S})'
render f-alg-expand 'P_u \leftarrow \textsc{LlmEditor}(P_v, A_v, s, G)'
render f-alg-run 'R_u \leftarrow \textsc{Run}(P_u)'
render f-alg-judge '(A_u, S_u) \leftarrow \textsc{LlmJudge}(P_u, R_u, G)'
render f-alg-count 'c_v \leftarrow c_v + 1; \qquad \text{if } c_v \ge \tau:\; V_{\mathrm{exp}} \leftarrow V_{\mathrm{exp}} \setminus \{v\}'
render f-alg-best '\text{if } S_u > S^{\ast}:\; P^{\ast} \leftarrow P_u, \; S^{\ast} \leftarrow S_u'
render f-node-tuple '(P_u,\, R_u,\, A_u,\, S_u)'
render expr-expandable 'v \in V_{\mathrm{exp}} \;\text{ and }\; c_v < \tau'
render expr-onl 'O(NL)'
