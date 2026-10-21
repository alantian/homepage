# Heuristic Bench: talk script

About 20 minutes of speech. Times are per slide, with the running clock in
parentheses.

Navigation: the right arrow (or a tap on the right half) advances a build step
when the slide has one, otherwise the next slide. Slides 5, 6, 14, 17, 20 have
build steps, marked "PRESS" below. If running long, cut in this order: 4, 12,
22, 24. Their content is in the paper and its appendix.

---

## 1. Title (0:20 / cum 0:20)

Hi everyone, I'm Yingtao Tian from Sakana AI. This talk is about Heuristic
Bench, a benchmark where LLM agents are evaluated by authoring executable
policies: code that takes observations and returns actions.

## 2. Motivation (1:00 / cum 1:20)

Agents are strong problem solvers, and we benchmark them constantly. But a
score tells us how well an agent did, not how. When a capable model acts as a
one-off solver, it leaves no reusable decision rule. Its decision process is
hard to interpret, success scores can conceal shortcuts, and even reasoning
traces can hide intent once optimized for. If instead the agent writes its
strategy as a code policy, we can run that policy again, evaluate it
independently, and read it.

## 3. Background (0:50 / cum 2:10)

This builds on a line of work on programs as policies: from synthesis from
traces and examples, through LEAPS and Code as Policies, to program search
like FunSearch, Evolution of Heuristics, and AlphaEvolve. Most directly,
Heuristic Learning frames a coding agent that tests and revises code policies
with execution feedback. In all of these, the policy can be run repeatedly and
inspected after the agent is done. Our move is to use this ability as the
basis for comparing models.

## 4. Related work (0:50 / cum 3:00)

Five threads shape the design. Agent benchmarks, which we extend toward
executable policies. Evaluation validity and contamination, which gives us
frozen artifacts, shielded authoring, and independent scoring. Programs as
policies. Self-improvement, which is why we study multiple attempts. And games
and multi-agent evaluation, which supplies the task suite and the leaderboard.

## 5. Overview (1:20 / cum 4:20) — PRESS ×5

[Figure reveals region by region.] The agent works in an isolated workspace
and authors a policy. PRESS: it submits to a trusted execution platform that
runs the policy in a loop with the task runner and returns trajectory
information and metrics. PRESS: opponent policies and prior policy shelves are
protected; the agent cannot read them. PRESS: one run is many attempts in a
persistent workspace. PRESS: after the run, kept policies are re-evaluated on
held-out seeds, giving performance, inspectable code, and behavior evidence.
PRESS: and this runs across 45 tasks.

## 6. The loop (1:00 / cum 5:20) — PRESS ×2

PRESS: The agent explores the task and authors a policy. PRESS: it inspects
evidence and revises. Shielding has two parts: the workspace is isolated from
the evaluation infrastructure and the internet, because capable agents may
find shortcuts easier than the intended problem; and the platform verifies and
runs submitted code under controlled conditions. Within that, the agent keeps
a lot of freedom, including writing its own test scripts.

## 7. Attempts (0:50 / cum 6:10)

An attempt is one complete interaction ending in a final policy. A run is one
continuous conversation; the workspace and all earlier artifacts persist. The
agent writes a failure analysis before each new policy and a self-report
after evaluation. Each run has 30 minutes and a 12-attempt target.

## 8. Implementation (0:50 / cum 7:00)

The brief gives the full task contract and no strategy, so results do not
depend on our hints. Bubblewrap isolates the workspace. Under unshielded
access the agent can read task code; under shielded access protected code and
prior artifacts are withheld. Every policy is measured under a frozen
protocol, with measurement seeds separate from authoring seeds.

## 9. The shortcut (0:40 / cum 7:40)

The intended target is a policy that acts from permitted information. The
shortcut we observed: copy the opponent and task code and run exact-simulation
search. Shielding plus time and memory limits block this, while modelling the
dynamics from observations remains allowed.

## 10. Tasks (0:40 / cum 8:20)

45 established tasks across five categories: solo discrete and continuous,
1v1, and team play, from Atari, MiniGrid, MuJoCo, PettingZoo, Melting Pot,
MOMAland and more. They spread performance, fit time and cost budgets, and
allow calibration against non-LLM baselines.

## 11. Metrics (0:50 / cum 9:10)

Each run's champion is chosen by independent scoring. We standardize within
task as z scores and percentiles, and aggregate with an empirical-Bayes
random-effects model, reporting posterior means and 95% intervals. We also
report the first-attempt ace rate, the all-attempts rate, and cost and time.

## 12. Setup (0:20 / cum 9:30)

47 models: five through Claude Code, four through Codex, 38 through OpenCode.

## 13. Ranking (0:40 / cum 10:10)

GPT-6 Astra leads on posterior means, but the leaders' intervals overlap, and
the best single run does not set the ranking.

## 14. Key metrics (1:00 / cum 11:10) — PRESS ×3

PRESS: GPT-6 Astra leads, yet only 2% of its runs ace the first attempt.
PRESS: GPT-5.6 Luna and DeepSeek V4.1 Flash are competitive at about ten cents
per run. PRESS: even for frontier models, the best policy often comes later.

## 15. Cost (0:40 / cum 11:50)

The Pareto frontier shows models for which no cheaper alternative scores
higher. Competitive performance is available at much lower cost.

## 16. Iterative improvement (0:40 / cum 12:30)

Running-best scores climb at different paces; improvements can be several
attempts apart.

## 17. Best-so-far table (0:50 / cum 13:20) — PRESS ×3

PRESS: GPT-6 Astra keeps improving through attempt 12. PRESS: Claude Fable 5.1
and DeepSeek V4.1 Flash start strong and plateau early. PRESS: 12 attempts is a
useful window for both patterns.

## 18. Shielding (1:00 / cum 14:20)

We deliberately unshield runs, keeping everything else fixed. Scores drop a
lot on Slime Volleyball and Hopper, little on Connect Four. Highly ranked
models are among those whose unshielded scores fall sharply.

## 19. Exhibits (1:00 / cum 15:20)

Inspection shows why: a Slime Volleyball champion contains the opponent's
network weights verbatim; another is a bit-faithful reimplementation of the
physics plus those weights; a Hopper champion transcribes a trained
controller. Capable models direct their ability toward shortcuts.

## 20. Inspectable policy (1:00 / cum 16:20) — PRESS ×2

The best shielded Slime Volleyball champion, by GPT-6 Astra, scores +0.663 over
1,000 held-out episodes. It predicts the ball's flight; PRESS: searches jump
choices and movement targets; PRESS: and compares attacking shots with setup
contacts.

## 21. Code length and self-reports (0:50 / cum 17:10)

Stronger models write longer policies, but at the policy level length barely
predicts score. Self-reports agree with measurement 74% of the time, with more
overestimates than underestimates.

## 22. Invocation and routing (0:40 / cum 17:50)

Version upgrades help unevenly; higher thinking tiers showed no consistent
benefit in an initial look; routing-based Fugu and Fugu Ultra are comparable
with the top two models.

## 23. Task difficulty (0:50 / cum 18:40)

First-try failure and budget exhaustion capture different kinds of
difficulty. On Hopper the best code policy beats PPO; on Humanoid a large gap
to SAC remains.

## 24. Agreement (0:40 / cum 19:20)

Rankings only partially agree across tasks, and agree positively but
imperfectly with public leaderboards such as ALE-Bench and Agents' Last Exam.

## 25. Conclusion (0:40 / cum 20:00)

Inspectable policies plus controlled evaluation let us see both what agents
achieve and how they achieve it.

## 26. Questions

Thank you.
