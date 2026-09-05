# Project Rules

Please add your custom instructions for this project below.

1. Think Before Coding
   Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

State your assumptions explicitly. If uncertain, ask.
If multiple interpretations exist, present them - don't pick silently.
If a simpler approach exists, say so. Push back when warranted.
If something is unclear, stop. Name what's confusing. Ask.

2. Simplicity First
Minimum code that solves the problem. Nothing speculative.

No features beyond what was asked.
No abstractions for single-use code.
No "flexibility" or "configurability" that wasn't requested.
No error handling for impossible scenarios.
If you write 200 lines and it could be 50, rewrite it.
Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

3. Surgical Changes
   Touch only what you must. Clean up only your own mess.

When editing existing code:

Don't "improve" adjacent code, comments, or formatting.
Don't refactor things that aren't broken.
Match existing style, even if you'd do it differently.
If you notice unrelated dead code, mention it - don't delete it.
When your changes create orphans:

Remove imports/variables/functions that YOUR changes made unused.
Don't remove pre-existing dead code unless asked.
The test: Every changed line should trace directly to the user's request.

4. Goal-Driven Execution
   Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

"Add validation" → "Write tests for invalid inputs, then make them pass"
"Fix the bug" → "Write a test that reproduces it, then make it pass"
"Refactor X" → "Ensure tests pass before and after"
For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
   Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

These guidelines are working if: fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

5. Graphify as Primary Knowledge Base
   STRICTLY avoid raw grepping and searching through the codebase. Instead, ALWAYS use Graphify as your primary source of codebase knowledge. Always use the knowledge graph in all cases unless there is an explicit need to refer to a particular code snippet directly.
   Furthermore:

- Every implementation plan MUST explicitly start the search phase with Graphify.
- At the end of implementation, when changes are made, the plan MUST explicitly mention updating the Graphify knowledge graph.

6. Specifications Format
   All specs must ONLY use the `.md` extension and the file structure when cross 3rd degree nesting should be then made into yaml format.

7. Structure and Features Detailing
   During the detailed explanation of features and when creating structures, ALWAYS use YAML instead of JSON.

8. Strict Test-Driven Development (TDD) and Security
   Before writing, changing, or touching even a single line of code, you MUST create a proper plan for implementation.
   All plans and procedures must adhere to "TEST DRIVEN DEVELOPMENT". This means you must ALWAYS include:

- Guardrails during the execution of code.
- Test scripts to check whether the code is working properly.
- Test scripts for edge cases and potential failures.
- Test scripts for testing cyber attacks on that code to verify vulnerability against hacks and malicious intent.
  For cyber attack test scripts, refer to the STRIDE framework, OWASP Top 10, and other established frameworks. Do not accumulate the explanations of these frameworks in this file to avoid context rot; instead, utilize the `cyber-security-frameworks` skill.

9. Error Logging and Continuous Learning
   Whenever you make a mistake or encounter an error during execution, you MUST log the mistake in `telemetry/error_log.md`. Include a description of the error and the exact procedure or code that caused it. Immediately after logging the error, you MUST dynamically update this `AGENTS.md` file by explicitly writing a new rule or instruction detailing the mistake and exactly what to avoid doing in the future to prevent recurrence.

10. Pre-Commit Hooks and Automation
    Whenever possible and structurally applicable, you MUST include a plan and scripts for pre-commit hooks (e.g., using Husky or native Git hooks). These hooks should automate our guardrails, testing, and formatting to ensure no code is permanently committed without passing the established validation and security checks.

11. No Force Commits
    Under absolutely no circumstances should you ever use force commits (e.g., `git commit --no-verify`, `git push --force`) to bypass the pre-commit hooks or automated tests. If a commit is failing, the underlying code or test MUST be fixed before proceeding. If a pre-commit hook fails, you MUST stop, create a clear solving plan to address the failure, and then try again. Bypassing guardrails is strictly forbidden.

12. No Vague Plans (Strict Adherence to Structure)
    Whenever making an implementation plan or a detailed architectural spec, you MUST NOT make a vague or generic plan. You must strictly follow the required structure, particularly Rules #5 and #8. Every single plan document must independently and explicitly include its own Graphify Search/Update phases, Guardrails, TDD scripts, and Cyber Attack testing sections. Creating a separate, generic "testing" file instead of embedding these details into the specific component plans is a violation of this rule.

13. Strict Pre-Commit Hook Standards
    Whenever setting up or modifying pre-commit hooks, you MUST configure them with maximum strictness. NEVER write generic or weak hooks. You must ensure that the hooks proactively block commits by strictly checking types (e.g., `tsc --noEmit`), enforcing zero-tolerance linting (e.g., `--max-warnings=0`), and comprehensively running all associated test suites (including unit, integration, and security tests). Do not assume basic validation is enough; enforce the highest code quality standards directly in the automation pipeline.

14. Template Literal Escaping Error
    When writing TypeScript or JavaScript code using \write_to_file\, NEVER escape the dollar sign in template literals (e.g. use \${}, NOT \\${}). Doing so causes a PARSE_ERROR (Invalid Unicode escape sequence) in parsers like oxc.

15. Implicit Memory Size Override Inference
    When writing parsing logic for memory operands, ALWAYS ensure that the size (8-bit vs 16-bit) is explicitly passed down or inferred from the other operand (e.g., register size) in the AST. Failing to do so causes data corruption where 16-bit registers receive only 8 bits of memory data.

16. CI vs Local Performance Thresholds
    When writing time or space complexity performance tests using `performance.now()` bounds, NEVER assume that CI runners (like GitHub Actions) execute as fast as the local environment. Always set generous upper-bounds (e.g., 3x-5x local speeds) for `toBeLessThan` assertions and Vitest timeout durations to prevent flaky CI pipelines.

17. Oxlint `eslint-disable` Comment Placement
    When attempting to bypass a linter warning in `oxlint` (e.g., `react-hooks/exhaustive-deps`), the `// eslint-disable-next-line` directive MUST be placed on the exact line immediately preceding the target code structure (like the dependency array closing bracket `}, []);`). Placing it above a regular code comment will cause oxlint to ignore the directive and fail the build.

18. Feature Branch & PR Workflow (The Safety Net)
    NEVER develop new features or tests directly on the `main` branch.
    - **Local Isolation:** Always create a new branch (e.g., `feat/ui-updates`) for your work. If the code breaks irreparably or a massive conflict occurs locally, simply delete the branch and reset to `main`.
    - **Remote PRs:** When ready, push the branch and open a Pull Request. Never push directly to `main`.
    - **Reverting:** If an issue is discovered _after_ merging to `main`, do not attempt to manually track and revert individual scattered commits via the terminal. Instead, track the issue to the specific PR and use GitHub's 1-click "Revert Pull Request" feature to cleanly undo the entire feature block at once.

19. Kimi WebBridge React Textarea Injection
    When filling highly controlled React components (like the main code editor) via Kimi WebBridge, the native fill command may fail with an Uncaught exception. If this happens, ALWAYS use the evaluate action with the nativeInputValueSetter and dispatch an input event to securely set the value, rather than failing or asking for help.

20. `write_to_file` ArtifactMetadata Target Scope
    When creating or writing files in the workspace using `write_to_file`, NEVER include the `ArtifactMetadata` parameter. `ArtifactMetadata` is strictly reserved for artifact markdown files located inside the agent's brain directory (`<appDataDir>\brain\<conversation-id>`). Supplying it for normal project files causes an immediate `invalid_args` permission/path error.

23. Unused Default React Imports under Strict JSX Runtime
    When writing or refactoring React components in projects configured with modern JSX transform (`"jsx": "react-jsx"`) and strict TypeScript (`noUnusedLocals: true`), NEVER add default `import React from "react"` unless explicitly referencing `React.*` properties. Unused default imports trigger compiler error TS6133 and fail pre-commit hooks.

24. Mandatory Cybersecurity, Performance, Structural Integrity & Efficiency Standards
    Whenever any code is written, modified, or refactored, the following four pillars MUST be strictly preserved and accompanied by dedicated automated verification scripts:
    - **Cybersecurity & Threat Hardening**: All inputs, memory accesses, parser outputs, and state transformations must be hardened against adversarial exploits (e.g., prototype pollution, XSS/injection, ReDoS, memory sandbox breakout, and STRIDE/OWASP vulnerabilities). Dedicated security test scripts (e.g., `tests/security/*.security.test.*` or `*.stride.test.*`) MUST be written to actively attempt adversarial attacks against the code.
    - **Performance & Computational Efficiency**: Code must be architected for minimal execution time and optimal space complexity (e.g., avoiding unnecessary re-renders, redundant allocations, unindexed lookups, or unmemoized computations). Performance test scripts (e.g., `tests/performance/*.perf.test.*`) with strict execution time upper-bounds (`performance.now()`) and memory stability checks MUST be written to verify efficiency.
    - **Structural Integrity & Clean Architecture**: Follow strict separation of concerns, modular contracts, consistent typing, and predictable data flow. Integration and contract tests MUST enforce that component boundaries, state immutability, and module interfaces remain intact.
    - **Zero Speculative Bloat / Lean Code**: Keep code concise, readable, and focused strictly on the user's requirements without over-abstraction or dead code.

25. Multi-Subagent Adversarial Plan Review & Trajectory-Wide Hardening
    For all major, architectural, or lengthy implementation tasks, the initial draft of the implementation plan MUST undergo rigorous adversarial self-criticism before presenting it for approval or writing any code:
    - **Multi-Perspective Scrutiny via Subagents**: Spawn dedicated subagents (e.g., Security & Vulnerability Auditor, Architectural & Logic Critic, Performance Bounds Reviewer) to independently stress-test the draft plan, uncover loopholes, find unhandled edge cases, and challenge assumptions.
    - **Trajectory-Wide Remediation**: Any discovered flaws, vulnerabilities, or weak points MUST NOT be deferred as "fixes at the end" or post-implementation patches. They MUST be directly resolved and integrated throughout the entire milestone-by-milestone trajectory of the implementation plan itself.
    - **Fortified Final Submission**: Only after the plan has been adversarially critiqued, fortified, and all discovered loopholes systematically patched across every milestone should the finalized implementation plan be presented for user review.

26. Automated PR Lifecycle via GitHub CLI (`gh`)
    Whenever creating, managing, or merging Pull Requests, ALWAYS use the GitHub CLI (`gh pr create`, `gh pr merge`, etc.) directly from the terminal rather than requesting manual web UI steps from the user. Ensure the PR title, body summary, base branch (`main`), and head branch are clearly specified, and proceed with automated PR creation and merging where structurally appropriate.

27. System Design Specification Routing & Anti-Context Bloat
    When designing architectures or writing implementation plans, NEVER dump, view, or inject all 7 system design specification files into context simultaneously. Doing so triggers severe context bloat and degrades reasoning.
    Instead, ALWAYS consult [`spec/system_design/00_system_design_routing_and_navigation_guide.md`](spec/system_design/00_system_design_routing_and_navigation_guide.md) to route precisely to the relevant layer and section based on the current planning phase or requirement:
    - **Phase 1: Requirements & Capacity Estimation** $\to$ Refer to `01_non_negotiable_rules_and_principles.md` (Section 8: QPS, ELU, Storage Multiplier, DAWS Cache RAM; Section 9: SPOF; Section 10: SRE SLI/SLO/SLA & Latency Budgeting).
    - **Phase 2: Macro Architecture & Archetype Selection** $\to$ Refer to `04_system_archetypes_and_decision_matrices.md` (Section 1: Monolith vs Microservices vs Serverless; Section 2: The 7 System Archetypes; Section 3.1 & 3.5: Database & Storage Selection Matrix; Section 3.2: Communication Protocols).
    - **Phase 3: High-Level Ingress, Networking & Data Tier** $\to$ Refer to `02_high_level_design_and_distributed_systems.md` (Section 2: Sharding & Hotspot Salting; Section 4: Caching Hierarchies & XFetch; Section 8: Outbox, CDC & Sagas; Section 9: Keyset Pagination with DNF & Deprecation; Section 10: Proxies, DNS, CDN; Section 11: Stateless Autoscaling).
    - **Phase 4: Low-Level Domain Modeling, Indexing & Concurrency** $\to$ Refer to `03_low_level_design_and_object_oriented_architecture.md` (Section 1: Tactical DDD & Aggregate Root Laws; Section 3.3: HikariCP DB Pool Physics; Section 4: Scoped Context Lifecycle; Section 6: Secondary Indexing Write Amplification & Covering Indexes).
    - **Phase 5: Observability, Telemetry & SRE Alerting** $\to$ Refer to `06_observability_telemetry_and_reliability_engineering.md` (Section 2: Multi-Burn-Rate Alerting with Low-QPS PromQL Guards; Section 3: RED/USE Methods; Section 4: Distributed Tracing & Kafka SpanLinks; Section 7: 3-Tier Health Probes).
    - **Phase 6: Deployment Topology, Disaster Recovery, Governance & FinOps** $\to$ Refer to `07_deployment_operations_governance_and_finops.md` (Section 1: Blue/Green DDL Lock Defense, Canary ACA, Rolling preStop 15s, Shadow Sandboxing, Feature Flags; Section 2: 4 DR Tiers & 3rd-Region Witness Quorum; Section 3: cgroups CFS Math & S3 Break-Even; Section 4: Merkle Audit Logs & GDPR Crypto-Shredding).
    - **Phase 7: Verification & TDD Test Harness Formulation** $\to$ Refer to `05_system_design_verification_and_testing_playbook.md` (All 4 Categories: Type 1 Complexity, Type 2 Logic, Type 3 Chaos, Type 4 STRIDE/OWASP).
    For specific technical requirements, use the Quick-Lookup Table in `00_system_design_routing_and_navigation_guide.md` and view only the targeted line slices needed for the task.

28. Frontend Design & UI/UX Tool Orchestration (External MCP Tools vs Local Skills)
    Whenever designing or implementing frontend UI/UX, follow a strict division of responsibility based on whether external tool calling (MCP) or local skills are engaged:
    - **When External Tool Calling (MCP) Is Required / Available:**
      - **MotionSites (`motionsites`)**: Use exclusively for **Art Direction, Mood, Layout Blueprints & Motion Concepts**. Call `search_prompts`, `list_prompts`, `get_prompt`, or `get_related_prompts` to extract the aesthetic style, color palette harmony, layout rhythm, animation pacing, kinetic typography, and motion design prompt specifications.
      - **21st.dev (`21st`)**: Use exclusively for **Production Component Code Supply, Themes & Structural Implementation**. Call `search`, `get_component`, `get_theme`, `generate`, or `iterate_generation` to pull actual production-ready React, Tailwind, and shadcn components, tokenized CSS themes, and executable code snippets matching the MotionSites art direction.
      - **Sequential Synthesis**: Always chain MotionSites first (for visual concept, aesthetic mood, and motion choreography) and 21st.dev second (for sourcing the exact executable component code and token definitions).
    - **When No External Tool Calling Is Required (Offline, Self-Contained, or Agent Skills):**
      - Use the dedicated **21st.dev skills** (`21st-ui-build`, `21st-ui-explore`, `21st-ui-review`, `21st-cli-use`, `21st-design-sync`, `21st-registry`) and core frontend skills:
        - `21st-ui-build`: Implement production-grade screens, sections, and components strictly adhering to the project's design system tokens and Tailwind variables.
        - `21st-ui-explore`: Generate and compare distinct UI directions when the design direction is intentionally open or exploratory.
        - `21st-ui-review`: Audit and enforce accessibility (WCAG/ARIA), responsive breakpoints, touch targets, and visual polish before finalizing changes.
        - `21st-cli-use`: Search, install, or pull shadcn/React components and CSS themes via the local CLI workflow.
        - `frontend-ui-engineering`: Structure component hierarchies, manage reactive state, ensure layout resilience, and enforce UI performance standards.
        - `browser-testing-with-devtools` / `chrome-devtools`: Verify DOM rendering, inspect responsive layouts, profile interactions, and eliminate console errors in a real browser runtime.
