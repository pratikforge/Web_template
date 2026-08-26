# Hackathon MVP Scoping & Triaging — Agent Execution Spec

**This is the document handed to the coding agent to safely down-scope from a full competitor teardown to an achievable Hackathon MVP.** When time is limited (12h, 24h, or 36h), attempting to clone an entire product plus leverage additions causes unfinished demos and broken code. This spec enforces rigorous, disciplined triaging: stripping away non-essential bloat while preserving the core workflow and the #1 unfair leverage feature.

Follow all milestones in strict order. All feature models and architectural structures must be expressed in YAML.

---

## Objective
Take the complete competitor teardown and leverage matrix (from `spec/competitor_teardown_and_differentiation_spec.md`), dynamically filter out all commodity/secondary features, and generate an executable, time-budgeted **Minimum Viable Product (MVP)** blueprint that guarantees a 100% functional, bug-free live demo during judging.

---

## Milestone 1 — Scope Ingestion & Time-Budget Mapping
**Input:** 
- Full incumbent feature list and leverage matrix from `spec/competitor_teardown_and_differentiation_spec.md`.
- Available hackathon duration (e.g., 12h, 24h, 36h, 48h).

**Actions:**
1. **Graphify Search Phase:**
   - Run `graphify query "<tech_stack_or_feature_component>"` to inspect all pre-existing boilerplate, UI libraries, or helper utilities in `Web_template`.
   - Identify what can be imported or reused immediately (0-hour build cost) versus what requires custom logic.
2. **Determine Time-Budget Bracket:**
   - **Bracket A (12–18 hours):** Extreme Scoping. 1 core workflow + 1 leverage feature only. Everything else cut or mocked.
   - **Bracket B (24–36 hours):** Standard Hackathon. 2 core workflows + 1–2 leverage features + polished UI.
   - **Bracket C (48+ hours):** Extended Sprint. Full baseline parity on primary modules + multi-point leverage additions.

**Output:**
```yaml
scoping_intake:
  time_budget_hours: 24
  target_bracket: "Bracket B (Standard Hackathon)"
  reusable_workspace_assets:
    - "Components or utilities identified via graphify"
  core_value_hypothesis: "Single sentence defining what makes this MVP undeniable to judges"
```

---

## Milestone 2 — The "Golden Demo Path" Razor
**Input:** Scoping intake from Milestone 1.

**Actions:**
1. **Script the 2-Minute Judge Experience:**
   - Define the exact, linear sequence of clicks and API calls the user/judge will see during the final presentation.
2. **Apply the Golden Path Razor Rule:**
   - **Rule:** If a feature or button does NOT sit directly on the 2-minute Golden Demo Path, it is **strictly banned** from MVP coding.
   - Any secondary navigation, settings panel, password reset, or edge-case preference toggle is either cut or rendered as a static disabled button.

**Output:**
```yaml
golden_demo_path:
  minute_0_to_1:
    action: "User lands on app, inputs raw data/triggers prompt"
    expected_visual: "Instant response matching incumbent's best capability"
  minute_1_to_2:
    action: "User triggers our Leverage Feature (solving incumbent's flaw)"
    expected_visual: "The 'Aha!' moment — seamless execution where incumbent failed"
  demo_critical_inputs:
    - "Exact pre-tested sample inputs to be used in live judging"
```

---

## Milestone 3 — 3-Tier Feature Triaging (P0, P1, P2 Cut & Mock)
**Input:** Golden Demo Path from Milestone 2 + Full Competitor Feature Matrix.

**Actions:**
Triage every single feature into three strict categories:

1. **Tier 1 (P0: Non-Negotiable Core Engine):**
   - Must be 100% functional, integrated, and backed by real code/APIs.
   - Contains:
     - 1 Baseline Core Workflow (the minimal engine that makes the product viable).
     - The #1 Leverage Kill Feature (the unfair advantage solving the incumbent's top complaint).
2. **Tier 2 (P1: Fast Follows / Polish):**
   - High-value additions built ONLY IF Tier 1 passes all TDD tests with >30% remaining time.
   - Examples: Keyboard shortcuts, export to PDF/Markdown, secondary visual charts.
3. **Tier 3 (P2 / Explicit Cuts & Strategic Mocks):**
   - Commodities that burn hours without winning judge points.
   - **Mandatory Mocks & Cuts:**
     - User Auth / OAuth -> Hardcode a single active demo session (`currentUser: { name: 'Judge', role: 'admin' }`).
     - Payment Gateways / Stripe -> Hardcode "Pro Tier Active".
     - Complex Email/SMS notifications -> Console log or in-app toast notification.
     - Multi-tenant DB permissions -> In-memory store or local SQLite/Supabase direct query.

**Output:**
```yaml
mvp_triaged_architecture:
  p0_core_engine:
    baseline_parity:
      - feature_name: "Core Workflow"
        implementation_approach: "Minimal functional implementation"
        estimated_hours: 4
    leverage_kill_feature:
      - feature_name: "Anti-Incumbent Wedge"
        solves_incumbent_flaw: "Specific negative review mined from G2/Reddit"
        estimated_hours: 4
  p1_fast_follows:
    - feature_name: "Secondary Enhancements"
      trigger_condition: "Only start if P0 tests pass before hour 14"
  p2_strategic_cuts_and_mocks:
    - cut_item: "Authentication / Sign-up flow"
      mock_strategy: "Pre-authenticated session mock"
    - cut_item: "Payment & Billing"
      mock_strategy: "Hardcoded enterprise tier"
    - cut_item: "Settings & Admin panel"
      mock_strategy: "Removed from UI or static non-functional preview"
```

---

## Milestone 4 — Demo-Proofing & Offline Fallback Strategy
**Input:** Triaged P0 features from Milestone 3.

**Actions:**
Hackathon live presentations frequently suffer from conference Wi-Fi failures, third-party API rate limits, or slow AI model responses.
1. **Implement Fallback Caches:**
   - For any LLM call or external API, create a local deterministic fallback JSON response.
   - If the external API times out (>8 seconds) or returns 429/500, gracefully fallback to the cached sample scenario without throwing an unhandled runtime error.
2. **Zero-Latency Preset Mode:**
   - Provide a "Demo Mode" toggle in development that pre-loads perfect demo data in 1 click.

**Output:**
```yaml
demo_resilience_plan:
  api_timeout_threshold_ms: 8000
  cached_fallback_scenarios:
    - endpoint: "Core LLM or Scraper endpoint"
      fallback_data_file: "src/mock/demo_fallback.json"
  offline_readiness: "App remains 100% interactive even if external network drops"
```

---

## Milestone 5 — MVP Execution Blueprint & Knowledge Graph Sync
**Input:** Outputs from Milestones 1–4.

**Actions:**
1. **Compile Blueprint:**
   - Save the finalized, time-safe build plan into `spec/mvp_execution_blueprint.md`.
2. **Graphify Update Phase:**
   - Run `graphify update .` to ensure the knowledge graph tracks the scoped MVP boundaries and contracts.

---

## Security, Guardrails & TDD Validation

### 1. Guardrails & Complexity Limits
```yaml
guardrails:
  scope_freeze: "Never add features mid-hackathon unless all P0 tests pass"
  code_simplicity: "No microservices or complex distributed state; keep architecture monolithic and local-first"
  dependency_check: "Use only pre-approved, high-stability libraries; no bleeding-edge unvetted packages"
```

### 2. TDD Validation for the MVP
- [ ] **Golden Path Test:** Automated end-to-end integration test asserting the complete 2-minute user flow passes without exception.
- [ ] **Fallback Test:** Simulate a network drop/API 500 error; assert the application falls back cleanly to demo cache without crashing.
- [ ] **STRIDE & Security Sanity:** 
  - Input sanitization on all user input fields to prevent XSS.
  - Hardcoded credentials or API keys must be isolated in `.env.local` and never committed.

### 3. Self-Check Checklist
Before writing code, the agent must confirm:
- [ ] The MVP scope contains at least 1 core workflow matching the incumbent (parity).
- [ ] The MVP scope contains the #1 leverage feature (unfair advantage).
- [ ] All auth, payment, and admin plumbing are explicitly marked for mock/cut.
- [ ] Estimated build time is <= 60% of total available hackathon time (leaving 40% for testing and pitch preparation).
- [ ] Output documented in `spec/mvp_execution_blueprint.md`.
- [ ] Knowledge graph updated via `graphify update .`.
