# Heuristic Bench: extended talk script

About 35 minutes with all slides; skip the `App.`-tagged slides for a
20-minute version (their content is also in the paper's appendix).

Navigation: the right arrow (or a tap on the right half) advances a build step
when the slide has one, otherwise the next slide. Build steps ("PRESS") are on
slides 5, 12, 18, 23, and 27. Everything else animates by itself.

| # | Slide | Tag | Cue |
|---|---|---|---|
| 1 | Title | | Introduce the benchmark: agents author executable policies. |
| 2 | A score says how well, rarely how | §1 | One-off solvers vs authored code policies. |
| 3 | From code-as-policy to Heuristic Learning | §1 §2 | The lineage; our move is to compare models by what they author. |
| 4 | Five threads | §2 | What each related thread contributes to the design. |
| 5 | One picture | §3.1 | PRESS ×5: workspace, platform, protected resources, attempts, assessment, tasks. |
| 6 | The loop | §3.1 | Token circles the loop; packets carry `policy.py` out and evidence back. Two parts of shielding. |
| 7 | Attempts | §3.1 | One run, many attempts, persistent workspace; 30 min, 12 attempts. |
| 8 | Task contract | §3.2 | Full contract, no strategy; frozen protocol; two access levels. |
| 9 | Instruction package | App. A.4 | Brief excerpt and two example lessons. |
| 10 | Session contract | App. A.4 | Attempt artifacts, rules, when the agent may stop. |
| 11 | Isolation and validation | App. A.3 | Two sandboxes, static import check, time limits. |
| 12 | The shortcut | §3.2 | Weights fly into `policy.py`. PRESS: the shield rises and blocks them. |
| 13 | Tasks | §3.3 App. A.1 | 45 tasks in five categories. |
| 14 | Metrics | §3.3 | z, percentile, empirical-Bayes aggregation, attempt rates. |
| 15 | Measurement details | App. A.2 | Champion selection, shrinkage, failure handling. |
| 16 | Setup | §4.1 App. B.1 | 47 models, three harnesses, budget, coverage, pricing. |
| 17 | Leaderboard | §4.1 | Intervals grow in for all 47 models; leaders overlap. |
| 18 | Ten highlighted models | §4.1 | PRESS ×3: top model's 2% ace rate; ten-cent models; best policy often comes later. |
| 19 | All 47 models | App. B.2 | Weaker models ace their first attempt more often, and improve less. |
| 20 | Core-model atlas | App. B.2 | Pong and Door Key near ceilings; Ant and Hopper separate models. |
| 21 | Cost | §4.1 | Pareto frontier wipes in. |
| 22 | Running best by task | §4.2 | Different paces; improvements can be several attempts apart. |
| 23 | Best-so-far lines | §4.2 | Lines draw in. PRESS ×3: GPT-6 Astra climbs; Fable 5.1 and DeepSeek plateau; 12 is a useful window. |
| 24 | Shielding | §4.3 | Large drops on Slime Volleyball and Hopper, small on Connect Four. |
| 25 | What the champions did | §4.3 App. C | Copied weights, reimplemented physics, transcribed controller. |
| 26 | Inside an unshielded run | App. C.1 | Qwen3.8-Max: the file read, the copied weights, its own reasoning. |
| 27 | Reading a champion | §4.4 | PRESS ×2: flight prediction, jump/target search, attack vs setup. |
| 28 | Full source | App. D.1 | All 110 lines; nothing but `math`. |
| 29–30 | Galleries | App. D.2 | Champions at play across tasks. |
| 31 | Code length and self-reports | §4.4 App. D.3 | r bars fill; the gauge counts to 74%. |
| 32 | Versions, tiers, routing | §4.4 | Uneven version gains; no tier benefit above high; routing competitive. |
| 33 | Model versions | App. D.4 | Every pair regresses somewhere. |
| 34 | Routing | App. D.5 | Fugu Ultra and Fugu in the top three; cost caveats. |
| 35 | Task difficulty | §4.4 | Hopper beats PPO; Humanoid trails SAC. |
| 36 | RL baselines | App. D.6 | How PPO and SAC were trained and evaluated. |
| 37 | Agreement | §4.4 | Partial agreement across tasks and with leaderboards. |
| 38 | Task pairs | App. D.7 | Four pairs, four different relationships. |
| 39 | All 15 leaderboards | App. D.8 | ALE-Bench rank by rank. |
| 40 | Conclusion | | Don't just score the agent. Read its policy. |
