# Tech Stack PRD Template

> Note: Product scope, users, and behavior are covered in the separate Product PRD. This document is scoped to the technical implementation stack only. Every entry below should show what else was considered and why it lost — not just what was picked.

## 1. Overview
- **Project Name:**
- **Owner:**
- **Date:**
- **Status:** (Draft / In Review / Approved)
- **What's being built (1 line):** *(stack decisions depend on this — e.g. real-time inference vs. an I/O-bound orchestration tool needs different tradeoffs)*

## 2. Selection Criteria
Score every decision against these before picking anything:
- **Performance / efficiency** — latency, memory, throughput. Cite a benchmark, don't assume.
- **Maturity & maintenance** — actively released, officially backed, not abandoned.
- **Ecosystem fit** — plays well with the rest of the stack, has real docs.
- **Licensing** — permissive enough for how this will be used/distributed.
- **Team familiarity vs. learning-curve cost** — is the "better" option worth the ramp-up time.

## 3. Research Checklist
Run this for every row in Sections 4–6 — don't fill in a decision without it:
- [ ] Identified 2–3 real alternatives (not just the default/familiar option)
- [ ] Checked current stable version from the **official** source (release page / docs — not a blog post or memory)
- [ ] Compared performance where it matters, with a link to a real benchmark
- [ ] Confirmed it isn't deprecated, unmaintained, or superseded by something newer
- [ ] Confirmed license compatibility
- [ ] Confirmed the package is pulled from the **official registry** (PyPI / crates.io / npm / etc.) — not a mirror, fork, or typosquat

## 4. Language & Runtime
| Component | Alternatives Evaluated | Decision | Exact Version | Why | Source |
|---|---|---|---|---|---|
| *e.g. Core language* | *e.g. Python vs Rust vs Go* | | | | |
| | | | | | |

## 5. Package / Dependency Manager
| Tool | Alternatives Evaluated | Decision | Exact Version | Why | Source |
|---|---|---|---|---|---|
| *e.g. Python package manager* | *e.g. pip vs uv vs poetry* | | | | |
| | | | | | |

## 6. Core Dependencies & Libraries
| Package | Purpose | Exact Version | Official Source Link | Alternatives Considered | Why Chosen |
|---|---|---|---|---|---|
| | | | | | |
| | | | | | |

## 7. Dev Tooling
| Category | Tool | Exact Version | Why |
|---|---|---|---|
| Linter / Formatter | | | |
| Type Checker | | | |
| Testing | | | |
| CI/CD | | | |

## 8. Infra & Runtime Environment
- **OS / base image:**
- **Deployment target:**
- **Containerization:**
- **Environment / config management:**

## 9. Version Pinning & Update Policy
- **Lockfile strategy:** (exact pins vs. ranges)
- **Re-evaluation cadence:** (when do these choices get revisited?)
- **Deprecation / CVE monitoring:**

## 10. Alternatives Rejected (Decision Log)
| Considered | Rejected Because |
|---|---|
| | |

## 11. Open Questions / Risks
-

## 12. Research Log
| Date Checked | Source | What It Confirmed |
|---|---|---|
| | | |
