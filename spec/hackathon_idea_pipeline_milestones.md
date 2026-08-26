# Hackathon Idea-Generation Pipeline — Agent Execution Spec

**This is the document handed to the coding agent.** It performs the entire pipeline — spawning sub-agents, driving kimi-webbridge, filtering, and scoring — and returns the Top 10 ideas. Follow milestones in order; each has explicit inputs, actions, and a required output before moving to the next.

## Objective
Given a hackathon problem statement (PS), autonomously research the web and return a ranked Top 10 list of validated, high-quality ideas that address it — fast enough to start building immediately.

---

## Milestone 1 — Intake & Setup
**Input:** raw PS text.
**Actions:**
- Parse the PS to extract domain, target users, and core problem space.
- Generate a set of search-query variations per source category (Milestone 2) based on that domain — do not use generic/fixed queries across every PS.
**Output:** a keyword/domain brief that all sub-agents in Milestone 2 will use.

## Milestone 2 — Spawn Sub-Agents & Source Research
**Input:** domain brief from Milestone 1.
**Actions:** spawn 3–4 sub-agents (one per source category below) to run in parallel for a quick search; each drives `kimi-webbridge` to search live:
- **Sub-agent A** — YC (Requests for Startups, Launch YC, YC Library) + a16z (thesis posts, "Big Ideas")
- **Sub-agent B** — high-follower, reputed subreddits relevant to the domain
- **Sub-agent C** — VC whitepapers/market theses (Sequoia, Bessemer, a16z memos)
- **Sub-agent D** — other sources: Product Hunt requests, Indie Hackers, HN "Ask HN" threads, G2/Capterra negative reviews, relevant GitHub issues, X/Twitter threads
**Output:** 4 raw findings sets, each entry tagged with source link + why it was flagged (e.g. "recurring complaint," "VC-named gap").

## Milestone 3 — Aggregation & Deduplication
**Input:** the raw findings sets from all sub-agents.
**Actions:** the **main/orchestrator agent** (not the sub-agents) compiles and structures the results:
- Merge into one pool.
- Cluster near-duplicate problems into single unified candidates.
**Output:** a consolidated list of unique idea candidates.

## Milestone 4 — Filtering
**Input:** consolidated candidate list.
**Actions:**
- **Frequency filter** — keep only candidates with recurring/frequent queries across sources.
- **Quality filter** — discard candidates backed only by casual, rant, or time-pass posts; keep only those with substantive queries.
- Note: competition existing in a space is *not* a disqualifier — do not drop a candidate for having competitors.
**Output:** a filtered shortlist.

## Milestone 5 — Scoring
**Input:** filtered shortlist.
**Actions:** score every candidate on each parameter below (e.g. 1–5 scale per parameter):
| Parameter | What it checks |
|---|---|
| Frequency | How often the problem recurs across sources |
| Query quality | Substantive vs. casual/rant origin |
| Recency trend | Rising interest, not just historical presence |
| Pain severity | Explicit frustration / willingness-to-pay / workaround-hacking |
| Cross-source corroboration | Appears in ≥2 independent categories |
| Hackathon feasibility | Buildable as a demo-able MVP in the available time, with reachable APIs/data |
| Judging-criteria fit | Innovation, technical depth, feasibility, demo impact |
| Differentiation angle | A specific underserved segment, workflow, or technical wedge |
| Data/API availability | Core functionality buildable on data/APIs reachable in time |
**Output:** a scored table, one row per candidate, one column per parameter, plus an aggregate score.

## Milestone 6 — Ranking & Final Output
**Input:** scored table.
**Actions:**
- Rank by aggregate score.
- Select the Top 10.
- For each of the 10, produce: one-line pitch, supporting evidence/sources, per-parameter score breakdown, and a one-line feasibility note.
**Output:** the final Top 10 ranked idea list — this is what gets returned to the user.

---

## Self-Check Before Returning Results
- Exactly 10 ideas, ranked.
- Every idea backed by ≥2 sources where possible.
- No idea is backed solely by casual/rant-only queries.
- Per-parameter scores are shown, not just a single aggregate number.
- The final report file should be in md file 
