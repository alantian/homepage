# CEDAR: 40-minute talk script

Slot: 40 minutes. This script speaks for about 37:00, leaving cushion for the
hand-off to questions. Times are per slide, with the running clock in
parentheses.

Navigation: the right arrow (or a tap on the right half) advances a build step
when the slide has one, otherwise the next slide. Slides 4, 7, 8, 9, 10, 11,
12, 13, 14, 16, 21, 23, 24, 25 have build steps, marked "PRESS" below.
Everything else animates by itself; cue lines in [brackets] tell you what the
slide is doing so you can time yourself to it. If running long, cut in this
order: 31, 27, 18, 24, 8, 14. Their content also lives in the paper and its
appendix.

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

## 3. Background (0:50 / cum 2:25)

For anyone newer to this corner of the field: complex systems are nonlinear,
feedback-driven models where the global behavior emerges from interactions
among components. They are core objects of study in artificial life, and they
are used across biology, epidemics, economics, and policy. The states are
meaningful stocks: populations, resources, pollution. Not hidden units.

There's more than one formalism for this: agent-based models, cellular
automata, discrete-time dynamic graphs. This work uses ordinary differential
equations, and the next slide shows exactly what that looks like.

The catch is that predicting how a feedback structure produces emergent
behavior is very hard. That's a central open problem in ALife. So designing
a system to exhibit a target behavior is even harder.

## 4. How the field builds them (1:05 / cum 3:30)

[The two formula cards rise in, one after the other.]

Here's the object we search over. Top left card: a state vector x in R to
the n, an initial condition at t zero, and a vector field f that says how
the stocks change. When f has a known, simple form you can do analysis,
Laplace transforms for instance. With nonlinear feedback you can't. So in
practice the field integrates numerically with first-order Euler, the second
card: x steps forward by delta t times f. That only asks f to be computable,
and many complex systems admit no analytical solution at all.

PRESS. Historically, that f lived in one of two languages. DYNAMO, with
nineteen-sixties syntax; the line on the right is a real level equation,
population at K equals population at J plus DT times births minus deaths.
Or STELLA, a proprietary visual tool. That's the code that flickered behind
the arrows on slide two. And the strip at the bottom is how far the
framework travelled: global dynamics, pandemics, social simulations, biology,
economics, thermodynamics, and on into policy design.

## 5. Three barriers (0:55 / cum 4:25)

[The three cards stagger in, then the kicker.]

The bottleneck is threefold, and these aren't outsider complaints; each card
cites the modeling community's own literature. First, modeling still requires
expert-defined variables and relationships; someone has to know which stocks
and which links belong. Second, the relationship between structure and
emergent behavior is often unclear, so goal-directed design means inverting
an opaque map. Third, the established languages require labor-intensive
workflows, and you navigate feedback relationships by hand. Together these
limit adoption exactly where these models could help most.

Here's the opportunity. LLM agents are strong at code, planning, and
reasoning, and Monte Carlo tree search can give their search structure.
CEDAR puts those two together.

## 6. Two lineages meet (1:20 / cum 5:45)

[The left list staggers in, then the right list, then the kicker.]

Two lines of work converge here, and CEDAR sits at their join.

On the left, tree search with a strong model. MCTS with neural networks gave
us superhuman play, from AlphaGo through AlphaGo Zero, AlphaZero, and MuZero.
Then it discovered algorithms, AlphaTensor for matrix multiplication and
AlphaDev, and searched neural architectures with LLMatic. Lately the strong
model is a language model: LATS uses LLM value functions and
self-reflection, AB-MCTS asks whether to go wider or deeper with LLM-driven
selection and expansion, and a whole run of planning and reasoning work sits
on top.

On the right, this community's own thread. Evolution through Large Models
put an LLM in place of random mutation, with language-guided program edits,
and From Text to Life carried that into ALife. Giving Simulated Cells a
Voice and ZapGPT evolve prompts to steer simulated cells. ASAL searches for
artificial life with foundation models, AI Scientist v2 automates scientific
discovery, and Srinivasan and colleagues evolve agents to falsify hypotheses
about biological self-assembly.

Take the operator idea from the right and the search structure from the
left, and you get CEDAR: Editor as variation operator, Judge as fitness
function, and the tree as the population.

## 7. CEDAR in one picture (1:20 / cum 7:05)

You give CEDAR two things: a goal in natural language, which can be as short
as "grow population stably", and an initial system written in a restricted
subset of Python, either one you provide or one generated from a basic
template. I'll say more about that representation in a moment.

PRESS. The tree search then grows step by step. Each node in this tree is a
complete complex system, a variant of your model.

PRESS. And each step has the same shape. Step A, select: pick a node and a
strategy. Step B, expand: the LLM Editor writes a modified system, we run
it, and an LLM Judge scores the result against the goal.

PRESS. Every node keeps four things: its system, its execution record, its
score, and a written analysis. Keep these four in mind; the analysis in
particular is what makes the search inspectable later.

## 8. The loop in eight lines (1:20 / cum 8:25)

Same loop, now as the eight lines of Algorithm 1, since these symbols recur
through the method. Line one initializes: a tree with just the root, the
Judge scores the initial system, and that becomes the incumbent best.

PRESS. Lines two and three are selection. Pick v, the node in the expandable
set V exp with the highest Score, and sample a strategy s uniformly from the
strategy set. The legend on the right tracks the letters: P for program, R
for record, A for analysis, S for score.

PRESS. Lines four to six are the expensive part. The Editor writes P u from
the parent's program, its analysis, the strategy, and the goal. Run executes
it and returns the record R u. The Judge reads that record and returns the
analysis and the score.

PRESS. Line seven is bookkeeping. Add the node with its four-tuple, bump the
parent's expansion count c v, and if c v has reached tau, drop the parent
from the expandable set. That cap comes back in the selection rule.

PRESS. Line eight: if the new score beats the incumbent, it's the new best,
and at the end we return P star.

Everything interesting hides inside three names: Score, LlmEditor, and
LlmJudge. The next three moves open each of them.

## 9. Move 1: runnable Python (0:55 / cum 9:20)

Our first design move is the representation. A complex system is its
feedback structure, here as a graph.

PRESS. The same object is plain Python with domain-specific primitives and
inline documentation. No new domain-specific language, and one
representation unifying what DYNAMO and STELLA each did their own way. LLMs
already speak Python fluently, and editing code means editing dynamics:
variables, feedback links, equations.

PRESS. And because it's runnable, executing it traces every variable at
every time step. This one representation holds all twenty classical systems
we study: World Dynamics plus nineteen models from Modeling Dynamic
Biological Systems, each with twenty to sixty-nine integrated variables.

## 10. Four components, from 21 lines to World Dynamics (1:20 / cum 10:40)

Every system in our corpus has the same four-part shape. Left, the smallest
example in the paper, twenty-one lines: logistic growth of a single stock N.
Right, the same skeleton at the scale of World Dynamics, with forty helper
lines elided in the middle.

Part one, initialization, top of both listings: time step, start and end
time, initial values. On the right, the five World Dynamics stocks:
population, natural resources, capital investment, pollution, and the
fraction of capital in agriculture, each tagged NECESSARY.

PRESS. Part two, intermediate computations, inside the loop. On the left, a
carrying-capacity factor and a growth rate. On the right, those forty lines,
which is where most of the feedback structure lives.

PRESS. Part three, derivative evaluations, one per stock. dN on the left;
dP, dNR, dCI, dPOL, dCIAF on the right.

PRESS. Part four, Euler integration, the same line for every stock: N equals
N plus dt times dN. That block is engine, and it's marked do not edit.

Two things to take away. The extensive comments are deliberate; they help
humans, and we find they help the LLM. And this same shape holds for all
twenty systems, so the Editor only ever learns one grammar.

## 11. A small vocabulary and a strict edit contract (1:05 / cum 11:45)

[The chips stagger in, band by band.]

Two more things the LLM is told, both in the file header itself. First, a
variable taxonomy. STATE, integrated over time, must have derivatives.
INPUTS T, pure functions of time. INPUTS RND, fresh random values each step.
HELPERS, all computed quantities, in dependency order. DERIVATIVES, one per
state. Second, a small set of primitives: the usual math functions, gauss
and uniform for noise, and three from the modeling tradition. graph is a
table lookup with linear interpolation, the piecewise curves you saw in
World Dynamics. delay is a fixed lag. smth1 is STELLA's SMTH1, a first-order
exponential smooth. Those two are STELLA-compatible by design, so converted
systems keep their semantics.

PRESS. And the edit contract, repeated in the Editor prompt. Only between
the BEGIN and END markers. Never touch imports, wrappers, loop structure,
Euler integration, or the OUTPUT section. Never change dt, t zero, tf, or
the seed. Anything tagged NECESSARY can't be deleted. Helpers are free: add,
remove, rewrite, reorder. That contract is what keeps every edit runnable.

## 12. Move 2: Judge as fitness, Editor as variation (1:00 / cum 12:45)

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
evolutionary computation. Both prompts cover system context, tree context,
and structural constraints, and together with the code representation that
contextualization is essential; the method doesn't work without it.

## 13. Inside the prompts (1:20 / cum 14:05)

Here are the two prompts as skeletons. The Judge on the left opens with
"analyze simulation results for tree-based optimization"; the Editor on the
right with "suggest code modifications for tree search optimization".

PRESS. The four slots now highlighted are identical in both: GOAL, CURRENT
CODE, SIMULATION RESULTS, TREE CONTEXT. Tree context is the interesting one.
It embeds the analysis and score of every node in the tree, including the
one currently selected, and it shows code as diffs: only the lines that
differ from the current code, with plus lines showing what a reference node
has instead. The expansion strategy is injected into that same context.
Below the slots the Editor gets a "focus on" list, parameters inside the
markers, state variables, derivative equations, table values, learning from
reference nodes; then the constraints you just saw; then a short tree-search
section: consider your position, learn from performance patterns, use the
diversification strategy. Both prompts carry the same scoring rubric,
collapsed here because it gets the next slide.

PRESS. The output shapes differ. The Judge returns REASONING, whose first
two hundred characters must be a summary, then SCORE. The Editor returns
REASONING, a SELF ASSESSED SCORE, and the complete MODIFIED CODE. Selection
runs on the Judge's score, as in Algorithm 1.

## 14. Scoring (1:05 / cum 15:10)

[The seven ladder rows stagger in from the bottom.]

The rubric, which both agents read. Seven bands. Zero to two, failed
progress. Two to four, partial. Four to six, moderate. Six to eight, good
progress with substantial goal achievement. Eight to ten, excellent, meets
most requirements. Then it keeps going: ten plus is very good, exceeding the
goal significantly, and twenty plus is exceptional, far surpassing what the
goal asked. Scores use two decimals, like 7.25 or 12.75.

PRESS. The twist is on the right, a depth-limited ceiling: score is at most
ten plus two point five times depth. So a node can only earn a very high
score after a chain of refinements, and the Editor reasons with that
explicitly; the quote is from a real transcript: "given the depth constraint
of ten point zero plus two point five times four equals twenty point zero."
One finding underneath all of this: in preliminary studies, without the tree
context, the expansion process fails to produce meaningful improvements.
Calibration against the rest of the tree is not decoration.

## 15. The search tree is a structured population (0:50 / cum 16:00)

[The mapping list staggers in on the right.]

Move three is how the search is steered, and here's the mapping to
evolutionary computation, since that's the frame we think in. Nodes are
candidate systems. The Editor is the variation operator. The Judge is the
fitness function. Selection is a generalized UCT score, on the left: the
node's score, plus an exploration term, plus a depth bonus. And one thing
unlike vanilla MCTS: internal nodes stay expandable until their expansion
count reaches tau, so a promising ancestor keeps producing children. Read
that as niche preservation.

The point of the branching is that many good, different systems stay alive
at once. Selection pressure without collapse. And in an ablation I'll show
later, the tree beats a straight line.

## 16. Selection is UCT with two twists (1:15 / cum 17:15)

Now the selection rule properly. Score of v is S v plus phi, and phi has two
pieces, bracketed under the formula.

PRESS. The first piece is progressive widening. Alpha times the square root
of log of c p plus one over c v plus one, where c p and c v are the parent's
and the node's expansion counts, times an indicator that c v is still below
tau. Once c v reaches tau the beta term takes over, and we set beta to minus
infinity: the node is simply out. So a node is expandable if and only if
it's in V exp and c v is below tau. The cap is there because the action
space is code modification and every expansion is an expensive LLM call; it
prevents over-expansion.

PRESS. The second piece is the depth bonus, gamma times depth, with gamma
positive. The rationale, quoted on the right from the appendix: high-quality
solutions often result from several consecutive refinements among a
promising branch, so favour deeper nodes and cap expansion counts, avoiding
over-exploring shallow nodes with expensive LLM calls. In our runs alpha is
one and gamma is two. Tau stays a symbol here.

## 17. Read formally (1:15 / cum 18:30)

[The two formula cards rise in, then the kicker.]

Step back and read the same loop formally, because it tells you which theory
applies. Left card, Equation 2. The Editor is a stochastic transition kernel
over programs: P u is drawn from P theta, conditioned on the parent program,
its analysis, the strategy, and the goal. P theta is a pretrained foundation
model, not something the search learned, but functionally it's the learned
transition of model-based RL, the AlphaGo Zero and MuZero lineage. Prior
work used LLM kernels like this in linear search; CEDAR moves them into tree
search.

Right card, Equation 3. The Judge is a learned value function: analysis and
score equal R phi of program, record, and goal, and a projection pi S picks
out the score. S u is a bounded, noisy reward, and that puts us inside the
convergence analysis of MCTS with biased evaluators: UCT remains consistent
when reward noise is bounded and non-adversarial. Ours is bounded, and
semantic scoring isn't adversarial.

The caveat, bottom line: asymptotic convergence and regret guarantees for
MCTS with LLMs remain open. Current theory gives at best partial guarantees,
like loose verifier-induced upper bounds. So this is a principled variant,
not a proven one.

## 18. Eight expansion strategies (0:45 / cum 19:15)

[The table rows stagger in, then the quote.]

The strategy set, verbatim. Eight one-line instructions, from breakthrough,
"make significant, high-impact changes designed to achieve major performance
improvements", down to conservative, "make small, incremental parameter
adjustments". In between: aggressive, amplify, exploratory, targeted,
contrarian, balanced. One is sampled uniformly for each expansion and
injected into the tree context. Nothing is learned here; uniform sampling is
the whole policy. And the Editor visibly obeys it. The quote at the bottom
is from a real transcript: "The diversification strategy calls for an
EXPLORATORY APPROACH: Try completely different parameter combinations."

## 19. Setup and cost (1:20 / cum 20:35)

[The three cards stagger in.]

Before the results, the setup, in three cards. Left, data. Twenty classical
systems: World Dynamics, originally in DYNAMO, plus nineteen from Hannon and
Ruth's Modeling Dynamic Biological Systems, originally in STELLA, all
converted into our representation. Twenty to sixty-nine integrated variables
each, mean twenty-nine point four, and ten to twelve helpers. World Dynamics
is the sixty-nine. We use them two ways: as models to optimize toward a
goal, and as ground truths that produce records to fit.

Middle, search. Twenty node selections, five candidates each, so one hundred
expansions per search. Alpha one, gamma two. Two backends, Claude Sonnet 4.5
and GPT-5.1, at default decoding, with structured outputs and up to three
retries; if all three fail, that expansion is discarded. Crashed or
NaN-valued runs get a low score, so the tree backtracks around them on its
own.

Right, engineering and cost. Each prompt adaptively subsamples the execution
record to stay within a context budget L, which keeps the whole search at
order N times L for N expanded nodes. A run costs ten to fifty dollars and
takes about thirty minutes, bounded by LLM calls, not local compute.

## 20. Experiment 1: the goal (1:20 / cum 21:55)

[The goal box types in; the three reasons stagger; the dependency graph
slowly zooms on the right.]

Two experiments. The first is the abstract goal from the opening, and here
it is in full. Balance population, resources, and environment by optimizing
to, one, maximize population growth, two, minimize the resource depletion
rate, and three, minimize the pollution accumulation rate. Seek the best
trade-off where the population grows sustainably. And a guard rail in
parentheses: only change coefficients in the helpers, and no coefficient by
more than fifty percent, to prevent variable explosion. So on this task the
Editor is retuning a published model's coefficients, not rewriting its
structure.

Why is that hard? Three reasons. First, the interdependencies: a single
change triggers cascading effects multiple time steps away. On the right is
the dependency graph of World Dynamics, forty-eight named quantities; one
edit ripples through all of it. Second, the goal is vague, and decomposing
it into subgoals means understanding how the variables interact; the
subgoals compete, because increasing population typically requires greater
resource consumption. Third, the baseline is a published, hand-designed
system that already sits at a kind of Pareto frontier. Pushing one subgoal
usually costs another. Let me show you that directly.

## 21. The goal is self-conflicting (0:55 / cum 22:50)

Watch what single-objective optimization does to this hand-designed model,
which already sits near a Pareto frontier. One reading note: the Resources
panel plots the remaining stock, so up means less depletion.

PRESS. Maximize population alone, the magenta curve: population spikes, but
resources crash and pollution explodes.

PRESS. Minimize resource depletion alone, the orange curve: resources are
saved, but population stagnates.

PRESS. So the real test is improving all three subgoals jointly, and that's
exactly what we ask CEDAR to do.

## 22. Sustainable worlds, one per LLM (1:10 / cum 24:00)

[The search tree grows in on the left, then the trajectories draw
themselves on the right; the bullets and the take-away line follow.]

And here's what comes back. On the left, the actual search tree from a
run, growing from the baseline system at the root down to the best system,
with the best path highlighted. Each node is labeled with its index and its
Judge score; hold that thought, because we'll walk this exact path in a
minute. On the right, the dynamics: compared to the baseline in blue, the
optimized systems push population up, keep more resources, and cut
pollution. All three jointly.

What I find most interesting is this: run it with Claude, run it with
GPT-5.1, and you get structurally distinct solutions. One leans
population-first, the other resource-first. One vague sentence in, a
portfolio of qualitatively different sustainable systems out.

## 23. Watch the search climb the tree (1:40 / cum 25:40)

Let's walk the best path, one level at a time. Left, the tree. Right, the
Editor and Judge responses along that path, LLM-summarized and colored by
subgoal. Root, node zero, score three point two. No Editor response at the
root. The Judge writes: unsustainable overshoot behavior, sixty-nine percent
resource depletion, forty-six times pollution increase.

PRESS. First edge, strategy breakthrough. The Editor aims for twenty-five to
forty percent efficiency improvements. The Judge: sustainable progress,
population to five point four six billion, thirty percent resources
remaining. Node one, six point eight; the transcripts record six point seven
five.

PRESS. Second edge, exploratory. Radical efficiency through enhanced capital
productivity, which the goal never mentions. Judge: paradigm shift, seven
billion population, seventy-eight percent resource conservation. Node nine,
nine point two.

PRESS. Third edge, breakthrough again. Ultra-aggressive conservation. Judge:
three point two times population, ninety percent pollution improvement.
Node eleven, eleven point eight.

PRESS. Fourth edge, aggressive. Seventy-five percent resource reduction,
three hundred percent capital productivity. Judge: best-in-tree performance,
six point three times population, fifty-nine percent resource conservation.
Node seventeen, thirteen point two; the transcripts record thirteen point
two five.

PRESS. Fifth edge, exploratory. Ninety-five percent resource conservation,
ninety-eight percent pollution reduction. Judge: holy grail achievement, six
point four times population growth with only nineteen point nine percent
resource depletion. Node twenty-four, fifteen point eight, best in the tree.

Read the path bar: breakthrough, exploratory, breakthrough, aggressive,
exploratory. Five levels, and the score climbs at every one. That's the
consecutive refinement the depth bonus was built to favour.

## 24. What the winning edit did (1:20 / cum 27:00)

What did the winning edit touch? The code on top is the baseline: four World
Dynamics helpers, all table lookups. NRMM, resource usage against material
standard of living. CIM, the capital investment multiplier. POLCM, pollution
from capital. POLAT, the pollution absorption time.

PRESS. Four cards, by direction, as the Judge reads the edit. NRMM down,
hard: roughly ninety percent, a maximum of 4.0 in the baseline down to
0.078. POLCM down harder, about ninety-five percent. CIM up, for capital
productivity. POLAT two to three times higher than the parent nodes. The
outcomes, quoted from the Judge: population from one point six five to
ten point five seven billion, six point four times; resources decline only
nineteen point nine percent, nine hundred billion to seven hundred twenty;
pollution three point six billion units by twenty-one hundred against a two
hundred million baseline, a controlled eighteen times increase.

PRESS. Two findings from reading many of these. The Judge keeps a balanced
focus across subgoals. The Editor evaluates overall performance first, then
fine-tunes individual subgoals, and attends to aspects the goal never
mentioned, capital productivity being the example. And on human inspection,
score and reasoning are aligned, with no systematic divergence: the
reasoning drives better edits, the score drives selection, and the two roles
are complementary.

## 25. Experiment 2: fit a stochastic record from a bare skeleton (1:20 / cum 28:20)

Second experiment, fully quantitative. The ground truth is this population
model. Config at the top: dt, start, end. Two stocks, POPULATION and SUM
POP. Births are seven percent of population. The nominal death rate decays
exponentially in time. The stochastic part: every step, the death rate is
drawn from a normal distribution centered on the nominal rate, with a spread
that scales with population, then clamped. Deaths are that rate times
population. So the record has intrinsic volatility. CEDAR sees none of this.
It starts from a bare-minimum skeleton, the record is loaded into the goal,
and it runs as is.

PRESS. The baseline is Optuna black-box optimization at three levels of
help, one hundred trials each. Level one, no formulae: two constants, BIRTH
RATE and DEATH RATE. Level two, simple formulae: a population-dependent
death rate through one coefficient and a MAX POPULATION. Level three, the
full ground-truth formulae with five free parameters, reducing the task to
parameter fitting. Metrics, bottom line: L1 distance and dynamic time
warping, via dtaidistance, with a Sakoe-Chiba band of two hundred fifty,
seven point one percent of the thirty-five-hundred-step record, inside the
recommended five to ten percent.

## 26. CEDAR with no formulae beats Optuna with the full formulae (1:10 / cum 29:30)

[The comparison plot draws, the table rows appear, and the winning row
highlights itself in green.]

So, the numbers. Remember that the comparison deliberately favors the
baseline: one hundred trials, and in its strongest setting the full
ground-truth equations, so it only fits parameters. That is strictly more
prior structure than CEDAR receives.

Look at the table. Without formulae, Optuna is far off, with an L1 around
twenty-nine. With the full equations it reaches 3.71. CEDAR, with no
formulae at all, gets 3.29 with Claude, and 2.22 with GPT-5.1, which also
wins on dynamic time warping. The Optuna baselines are severely limited by
the skeletal formulae; the no- and simple-formulae variants are clearly
worse, quantitatively and qualitatively. The plot shows why: weak baselines
collapse to near-constant populations, while CEDAR tracks the peaks and dips
of the ground truth.

## 27. The ground truth is itself volatile (0:45 / cum 30:15)

[The two seed-band figures draw first, one after the other.]

One robustness check I want you to see. The ground truth itself is
stochastic, and the line in the chip is the culprit: DR DISTRIBUTION equals
normal of NOMINAL DR, with standard deviation zero point zero zero five
times POPULATION. Across ten random seeds you can see its intrinsic
volatility, and the peaks and dips are not in sync across runs. So the
volatility is a property of the system, not an optimizer artifact. CEDAR's
fit sits inside that band and captures the magnitude and timing of the major
peaks and dips.

## 28. A second full-formulae run does not close the gap (1:00 / cum 31:15)

[The comparison figure draws on the right.]

And one more check on the strongest baseline. In theory, with the full
formulae and enough trials, Optuna could approach the ground truth's
parameters. In practice it doesn't. We ran it a second time: run one, L1
3.71 and DTW 477.52; run two, 4.26 and 605.05, so no better. CEDAR with
GPT-5.1 and no formulae, 2.22 and 433.13, below both. The figure on the
right overlays the two Optuna runs on the ground truth.

Why does parameter fitting with the true equations still trail? Two factors.
First, the noise floor you just saw: the target itself moves between runs.
Second, the landscape: a high-dimensional, sensitive parameter space where
small changes lead to qualitatively different records, because of the
nonlinear feedbacks. Purely numeric search is insufficient there.

## 29. Near-best nodes of one run: a population, not a point (1:00 / cum 32:15)

[The trajectory strip draws, then the three benefits appear.]

Why the tree, then? Three benefits fall out of it. First, diversity. These
are nodes from a single run of the record-fitting experiment whose scores
are close to the best, and every one of them satisfies the goal along a
visibly distinct trajectory. Unlike the Optuna baselines, CEDAR doesn't
collapse to a single overfitting-like point, and that enables better
decision-making through sensitivity analysis. You get a population, not a
point.

Second, performance: the tree yields higher-scoring nodes than linear
search, which is the next slide. Third, open-ended discovery. Because the
tree branches rather than converging, it preserves structurally distinct
solutions, each emphasizing different tradeoffs among the objectives; you
saw that with the two backends on World Dynamics. In ALife, exploring the
range of emergent behaviors matters alongside optimizing one objective.

## 30. Ablation: the tree beats the line (1:10 / cum 33:25)

[The box plot draws first, then the trajectories.]

Here's the ablation: linear search, a single chain of successive edits,
against the tree.

Left, node scores. MCTS attains higher-scoring nodes than linear search: the
CEDAR box sits in the upper band with a handful of low outliers, while the
linear box straddles the middle of the scale. Right, population
trajectories, two runs of each. The linear runs, S1 and S2, jitter around a
flat line; the CEDAR runs are smoother, and they avoid the overfitting-like
behavior of linear search. Read the two panels together. A single chain has
nowhere to back out to; the tree does. That's the sense in which tree-based
exploration drives CEDAR's performance, and why we say MCTS with LLMs is
crucial for the gains rather than incidental.

## 31. Where CEDAR sits among LLM search methods (1:10 / cum 34:35)

[The table rows stagger in.]

Where does this sit among LLM search methods? Row by row. I-MCTS searches
AutoML hyperparameters, and LATS operates on discrete task graphs; neither
addresses iterative temporal dynamics. GIF-MCTS and LLM-SRBench do handle
sequences, but short ones; we optimize multi-thousand-step dynamics. Prompt
optimizers, EvoPrompt, PromptBreeder, DSPy, apply in principle, but they
need demonstrations, which don't exist in an online-exploration setting. And
the closest line, LLMs for dynamical systems, Liu, Luo, and Liu and Keith,
treats the model as a predictor of behavior unknown to the optimizer, on
smaller systems, up to four variables and twelve steps, which makes direct
extensions to our scenario non-trivial. Last row, CEDAR: twenty systems,
twenty to sixty-nine variables, and a thirty-five-hundred-step record. The
difference is not only scale; the goal is a behavior, and the object being
searched is the system's structure.

## 32. What this offers artificial life (0:55 / cum 35:30)

So for this community, three things. Open-ended exploration: the branching
tree preserves structurally distinct emergent behaviors, which matters when
the range of behaviors is the point, not a single optimum. Accessibility:
natural-language goals plus a Python representation lower the barrier that
DYNAMO and STELLA workflows impose. And transparency: the step-by-step
analyses give us a new handle on the structure-to-emergence question.

In short, evolutionary search over living-system models, with agents as its
operators. That's what we mean by lowering the barrier to constructing and
studying complex systems, in artificial life and beyond.

## 33. Limits, open theory, and what comes next (1:15 / cum 36:45)

Let me state the limits honestly. The Judge scores what a same-class LLM
edited, so there is a circularity risk for abstract goals. We report
trends, not tight statistics, with two systems studied in depth. The
rationales make the search inspectable, but they are the stated reasons for
each edit, not a verified causal account of how structure produces
emergence; that remains open. And on theory: asymptotic convergence and
regret guarantees for MCTS with LLMs remain open, and what exists today
gives at best partial guarantees, loose verifier-induced upper bounds.

What comes next: systematic benchmarks against classical evolutionary and
multi-objective methods, pinning down when LLM variation and evaluation
are necessary rather than merely helpful, and more systems in more domains.

Everything you'd need to check us is in the appendix: the full prompts and
rubric, the system code, and the complete Judge and Editor transcripts from
the World Dynamics run.

## 34. Close (0:15 / cum 37:00)

Ask for the behavior, and let the agents grow the system. Thank you, and
I'm happy to take questions.
