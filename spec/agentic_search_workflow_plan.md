# CampusCircular Agentic Search & Discovery Workflow Plan

## 1. Executive Summary & Architectural Heritage

This document defines the architecture and implementation plan for upgrading CampusCircular's product search into an enterprise-grade **Multi-Agent Discovery & Bundle Engine**. 

The design directly synthesizes battle-tested patterns from:
1. **`Shubhamsaboo/awesome-llm-apps`**:
   - `trust_gated_agent_team`: Multi-stage verification pipeline, specialist sequential agents, and verifiable execution trails.
   - `agentic_rag_with_reasoning`: Entity extraction, gap analysis, and visible step-by-step reasoning streams.
   - `generative_ui_agents`: Interactive agent co-pilot with conversational refinement.
2. **`pratikforge/agent-preflight` & `pratikforge/adk-customer-service`**:
   - Pre-flight capability contracts verifying invariant rules before executing actions.
   - State-machine routing nodes (`deconstruct` -> `retrieve` -> `optimize` -> `gate`).
   - Zero-execution-leak boundary and 100% deterministic client-side execution.

---

## 2. Graphify Knowledge Base Search & Update Phases (Rule #5)

### Initial Search Phase (Completed)
- Searched: `parseNeedPrompt`, `HeroAIBundler`, `CartContext`, `CampusResource`, `ai_bundler.test.ts`.
- Subgraph identified: `components_heroaibundler_heroaibundler` imports `parseNeedPrompt` and calls `useCart` in `CartContext.tsx`.
- Target insertion: `agentPipeline.ts` will sit in `frontend/src/lib/` and connect with `HeroAIBundler.tsx`, `BundleCartDrawer.tsx`, and `CartContext.tsx`.

### Concluding Update Phase (Mandatory)
- Post-implementation execution: `graphify update .` to index new pipeline nodes, agent interfaces, and test suites into `graphify-out/`.

---

## 3. Structural Specification (YAML Format - Rule #7)

```yaml
agentic_discovery_engine:
  version: "2.0.0"
  architecture: "Sequential Trust-Gated Multi-Agent Pipeline"
  execution_mode: "Hybrid Deterministic + Optional LLM Hook"
  client_side_guarantee: "100% Offline Resilient, Zero API Cost Required"
  
  pipeline_stages:
    - stage_id: "INTENT_DECONSTRUCTOR"
      role: "Entity Extraction & Context Parsing Agent"
      inputs:
        - raw_query: "Natural language query from borrower"
      outputs:
        - domain: "media_production | academic_exam | electronics_lab | dorm_leisure"
        - required_elements: "List of item categories / keywords"
        - urgency: "immediate | next_24h | weekend"
        - budget_ceiling_rupees: "Optional numeric constraint"
        - preferred_hostel: "Optional hostel block constraint"

    - stage_id: "SEMANTIC_RETRIEVER"
      role: "Catalog Retrieval & Gap Analysis Agent"
      inputs:
        - extracted_entities
        - catalog_resources
      outputs:
        - primary_matches: "Direct inventory matches"
        - missing_gaps: "Gear required for the project but currently unlisted/unavailable"
        - fallback_recommendations: "Substitute gear or community beacon trigger"

    - stage_id: "LOGISTICS_OPTIMIZER"
      role: "Hostel Routing & Walking Distance Optimization Agent"
      inputs:
        - primary_matches
      outputs:
        - clustered_stops: "Ordered stops by hostel block"
        - total_walking_minutes: "Aggregated transit time"
        - pickup_sequence: "Recommended chronological pickup sequence"

    - stage_id: "PREFLIGHT_SECURITY_GATE"
      role: "Pre-Flight Contract Verification Agent (Agent-Preflight Inspired)"
      checks:
        - check_id: "rule_integer_paise_integrity"
          rule: "Borrow + Fee + Deposit === Total"
        - check_id: "rule_lender_trust_threshold"
          rule: "Lender trust_score >= 85"
        - check_id: "rule_no_injection"
          rule: "Zero script, zero proto pollution, zero malicious URI"
        - check_id: "rule_client_airgap"
          rule: "Zero unauthenticated external egress"

    - stage_id: "CONVERSATIONAL_REFINEMENT"
      role: "Interactive Human-In-The-Loop Steering Agent"
      supported_commands:
        - "remove [item_name]"
        - "add [item_name]"
        - "max budget [amount]"
        - "hostel [hostel_name] only"
```

---

## 4. Guardrails During Execution (Rule #8)

1. **Deterministic Fallback Guardrail:** The agent pipeline must NEVER throw an uncaught exception or lock the UI if a query is malformed, nonsensical, or contains adversarial prompts.
2. **Pre-flight Integrity Contract:** Every proposed bundle must pass the Pre-flight Contract before being committed to the Cart.
3. **Escrow Invariant:** Dynamic adjustments (e.g. "budget under ₹100") must recompute integer paise math immediately and preserve `Borrow + Fee + Deposit === Total`.

---

## 5. Test-Driven Development (TDD) Plan & STRIDE Security Suite (Rule #8)

### Automated Test Suite: `frontend/src/tests/agent_pipeline.test.ts`

```typescript
// 1. Unit Tests
- parses natural language project queries into structured intent entities
- detects missing gear gaps and suggests alternatives or beacon triggers
- clusters inventory matches into optimized hostel walking routes

// 2. Conversational Refinement Tests
- dynamically removes items upon user conversational command ("remove tripod")
- enforces budget ceiling by swapping or filtering items ("max budget 100")
- filters items by preferred hostel block ("hostel 1 only")

// 3. Cyber Attack Resilience (STRIDE & OWASP Top 10)
- STRIDE Tampering: Prompt injection containing system override commands is neutralized
- STRIDE Spoofing: Malicious owner trust score spoofing is rejected by Preflight Gate
- STRIDE Information Disclosure: Does not leak internal system prompts or memory maps
- STRIDE Elevation of Privilege: Prototype pollution attempts in conversational refinement are blocked
```

---

## 6. Verification and Integration Workflow (Rule #18)

1. Implement `frontend/src/lib/agentPipeline.ts`.
2. Implement `frontend/src/tests/agent_pipeline.test.ts` and verify with Vitest (`npm run test`).
3. Build `frontend/src/components/AgentReasoningHUD.tsx`.
4. Integrate HUD into `frontend/src/components/HeroAIBundler.tsx`.
5. Run `npx oxlint` (zero warnings/errors) and `npm run build` (zero build errors).
6. Run `graphify update .`.
7. Commit, push branch, open PR, and merge into `main`.
