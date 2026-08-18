# CEDAR at ALIFE 2026: talk script

Slot: 15 minutes of talk plus a short Q&A after. This script speaks for about
13:55, leaving roughly a minute of cushion for transitions and slow moments.
Times are per slide, with the running clock in parentheses.

Navigation: the right arrow (or a tap on the right half) advances a build step
when the slide has one, otherwise the next slide. Slides 5, 6, 7, and 9 have
build steps, marked "PRESS" below. Everything else animates by itself; cue
lines in [brackets] tell you what the slide is doing so you can time yourself
to it. If running long, compress slides 14 and 15 first; their content also
lives in the released full paper.

---

## 1. Title (0:25 / cum 0:25)

[The goal line types itself; fish drift in the background.]

Hi everyone, I'm Yingtao Tian from Sakana AI. This talk is about CEDAR,
which stands for Complex-systems Exploration and Design via
Agent-Orchestrated Refinement. In one sentence: you describe the behavior
you want from a complex system in plain language, like the line typing at
the bottom here, and LLM agents inside a tree search evolve a system that
shows that behavior.

## 2. The pitch (1:10 / cum 1:35)

[The goal sentence types in; the three objectives get highlighted and boxed
in the code; then gray dependency arrows start flashing across the listing.
The closing line appears by itself near the end.]

Here's the whole pitch on one slide. On the right is World Dynamics,
Forrester's 1971 model of population, resources, and pollution: 178 lines
of DYNAMO, an actual specialized simulation language. On the left is what we
do instead. We just ask. The goal you see typing is real input to our system,
word for word.

Watch the three colored pairs: population, resources, pollution. Each
objective in the sentence connects to its defining equation in the code.
And now the gray arrows. Those are the real dependencies between variables
in this model, and this flickering web is exactly why hand-editing such a
system is so hard. One change cascades everywhere.

CEDAR takes that one sentence and autonomously evolves the system. A run
takes about thirty minutes and costs ten to fifty dollars. The rest of the
talk is how it works, and what it offers artificial life.

## 3. Background (0:45 / cum 2:20)

For anyone newer to this corner of the field: complex systems are nonlinear,
feedback-driven models where the global behavior emerges from interactions
among components. They are core objects of study in artificial life, and they
are used across biology, epidemics, economics, and policy. The states are
meaningful stocks: populations, resources, pollution. Not hidden units.
Formally, we model them as ODEs and integrate with first-order Euler, as in
the formula here.

The catch is that predicting how a feedback structure produces emergent
behavior is very hard. That's a central open problem in ALife. So designing
a system to exhibit a target behavior is even harder.

## 4. The problem (0:45 / cum 3:05)

The bottleneck is twofold. Scientifically, structure to behavior is opaque,
so goal-directed design means inverting an opaque map. Practically, the
established tools are DYNAMO from the sixties and STELLA, which is
proprietary and visual. Workflows are labor intensive, and you navigate
feedback relationships by hand. That limits adoption exactly where these
models could help most.

Here's the opportunity. LLM agents are strong at code, planning, and
reasoning, and Monte Carlo tree search can give their search structure.
CEDAR puts those two together.

## 5. CEDAR in one picture (1:15 / cum 4:20)

You give CEDAR two things: a goal in natural language, and an initial
system written in a restricted subset of Python. I'll say more about that
representation in a moment.

PRESS. The tree search then grows step by step. Each node in this tree is a
complete complex system, a variant of your model.

PRESS. And each step has the same shape. Step A, select: pick a node and a
strategy. Step B, expand: the LLM Editor writes a modified system, we run
it, and an LLM Judge scores the result against the goal.

PRESS. Every node keeps four things: its system, its execution record, its
score, and a written analysis. Keep these four in mind; the analysis in
particular is what makes the search inspectable later.

## 6. Move 1: runnable Python (0:50 / cum 5:10)

Our first design move is the representation. A complex system is its
feedback structure, here as a graph.

PRESS. The same object is plain Python with domain-specific primitives and
inline documentation. No new domain-specific language. LLMs already speak
Python fluently, and editing code means editing dynamics: variables,
feedback links, equations.

PRESS. And because it's runnable, executing it traces every variable at
every time step. This one representation holds all twenty classical systems
we study: World Dynamics plus nineteen models from Modeling Dynamic
Biological Systems, each with twenty to sixty-nine integrated variables.

## 7. Move 2: Judge as fitness, Editor as variation (0:50 / cum 6:00)

Move two is the two agents. The Editor is our variation operator. Its prompt,
on the left, gets the goal, the simulation results, the current code, and
tree context. The Context panel on the right is the reference for those
pieces. The edits are structural, not just coefficient tuning: it can add or
remove state variables, rewire feedback, rewrite equations.

PRESS. Step one, it writes a new system; step two, running it produces a
fresh execution record.

PRESS. Step three, the Judge, our fitness function, reads that record and
returns a bounded score plus a written analysis that feeds the next edit.
So this is a generate-and-evaluate loop, very much in the spirit of
evolutionary computation.

## 8. Move 3: the tree is a structured population (0:55 / cum 6:55)

Move three is how the search is steered. Selection uses a generalized UCT
score: the node's score, plus an exploration term, plus a depth bonus, with
progressive widening capping how often a node can be expanded. Unlike
vanilla MCTS, internal nodes stay expandable until they hit that cap.
Formally this is a principled MCTS variant: the Editor acts as a stochastic
transition kernel and the Judge as a noisy value function.

Expansion strategies are sampled uniformly from eight prompts, from
breakthrough to conservative. In our runs we use Claude Sonnet 4.5 and
GPT-5.1 as backends, with twenty selections times five candidates, so one
hundred expansions per search.

The point of the branching is that many good, different systems stay alive
at once. Selection pressure without collapse. And in ablations, MCTS beats
linear search.

## 9. Results: the goal is self-conflicting (0:50 / cum 7:45)

Now, the results. First experiment: that World Dynamics goal from the
opening. Why is it hard? The hand-designed model already sits near a Pareto
frontier. Watch what single-objective optimization does.

PRESS. Maximize population alone, the magenta curve: population spikes, but
resources crash and pollution explodes.

PRESS. Minimize resource depletion alone, the orange curve: resources are
saved, but population stagnates.

PRESS. So the real test is improving all three subgoals jointly, and that's
exactly what we ask CEDAR to do.

## 10. Sustainable worlds, one per LLM (1:00 / cum 8:45)

[The search tree grows in on the left, then the trajectories draw
themselves on the right; the bullets and the take-away line follow.]

And here's what comes back. On the left, the actual search tree from a
run, growing from the baseline system at the root down to the best system,
with the best path highlighted. On the right, the dynamics: compared to the
baseline in blue, the optimized systems push population up, keep more
resources, and cut pollution. All three jointly.

What I find most interesting is this: run it with Claude, run it with
GPT-5.1, and you get structurally distinct solutions. One leans
population-first, the other resource-first. One vague sentence in, a
portfolio of qualitatively different sustainable systems out.

## 11. Record fitting against Optuna (1:00 / cum 9:45)

[The comparison plot draws, the table rows appear, and the winning row
highlights itself in green.]

Second experiment, fully quantitative: fit the record of a stochastic
population model, starting from a bare skeleton. The baseline is Optuna
black-box optimization with one hundred trials, and we deliberately favor
it: in its strongest setting it gets the full ground-truth equations, so it
only fits parameters. That is strictly more prior structure than CEDAR
receives.

Look at the table. Without formulae, Optuna is far off, with an L1 around
twenty-nine. With the full equations it reaches 3.71. CEDAR, with no
formulae at all, gets 3.29 with Claude, and 2.22 with GPT-5.1, which also
wins on dynamic time warping. The plot shows why: weak baselines collapse
to near-constant populations, while CEDAR tracks the peaks and dips of the
ground truth.

## 12. A population of explained solutions (0:50 / cum 10:35)

[The trajectory strip draws, then the two Judge quotes appear.]

Two properties fall out of the tree that I want to highlight. First,
diversity: these are near-best nodes from a single run, and they all
satisfy the goal along visibly distinct trajectories. That's a sensitivity
analysis for free, useful for decision-making.

Second, every step is narrated. At the root, the Judge writes:
unsustainable overshoot behavior, sixty-nine percent resource depletion,
forty-six times pollution increase. At the best node: holy grail
achievement, six point four times population growth with only nineteen
point nine percent resource depletion. The search explains itself as it
goes.

## 13. What this offers artificial life (0:50 / cum 11:25)

So for this community, three things. Open-ended exploration: the branching
tree preserves structurally distinct emergent behaviors, which matters when
the range of behaviors is the point, not a single optimum. Accessibility:
natural-language goals plus a Python representation lower the barrier that
DYNAMO and STELLA workflows impose. And transparency: the step-by-step
analyses give us a new handle on the structure-to-emergence question.

In short, evolutionary search over living-system models, with agents as its
operators.

## 14. Method details (0:45 / cum 12:10)

A few details worth mentioning, quickly. The dependency graph on the left
is World Dynamics again: about forty-five coupled variables, which is why
one edit cascades everywhere and design needs search. The full selection
rule combines progressive widening, with beta set to negative infinity,
and the depth bonus. And some engineering keeps runs alive: adaptive
context subsampling keeps every prompt within budget, structured outputs
get up to three retries, and crashed or NaN runs are scored low so the
tree simply backtracks around them.

## 15. Result details (0:45 / cum 12:55)

[The two seed-band figures draw first, one after the other, then the table
and text.]

One robustness check I want you to see. The ground truth itself is
stochastic. Across ten random seeds you can see its intrinsic volatility,
and CEDAR's fit sits inside that band. And a second full-formulae Optuna
run doesn't close the gap: 4.26 versus 3.71 on L1, both above CEDAR's
2.22. Parameter fitting with the true equations still trails, because of
the noise floor and a sensitive nonlinear landscape. Full Judge and Editor
transcripts are released, and on human inspection the scores and the
reasoning align.

## 16. Limits, and what comes next (0:45 / cum 13:40)

Let me state the limits honestly. The Judge scores what a same-class LLM
edited, so there is a circularity risk for abstract goals. We report
trends, not tight statistics, with two systems studied in depth. The
rationales make the search inspectable, but they are not yet a verified
causal account of emergence. And convergence guarantees for MCTS with LLMs
remain open.

What comes next: systematic benchmarks against classical evolutionary and
multi-objective methods, pinning down when LLM variation and evaluation
are necessary rather than merely helpful, and more systems in more domains.

## 17. Close (0:15 / cum 13:55)

Ask for the behavior, and let the agents grow the system. Thank you, and
I'm happy to take questions.
