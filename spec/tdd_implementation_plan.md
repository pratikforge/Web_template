# Strict Test-Driven Development (TDD) & Security Implementation Plan

**Project:** CampusCircular — From Ownership to Access  
**Framework:** React 19 + TypeScript + Vite + Tailwind v4 + LocalStorage  
**Standards:** Full adherence to `.agents/AGENTS.md` (Rules #1, #2, #3, #4, #5, #7, #8, #10, #12, #13, #20).

---

## 1. Graphify Search Phase (Rule #5 & #12)
Before formulating this implementation plan, the knowledge graph was traversed using `graphify query "campus circular state machine and components"`.

```yaml
graphify_query_results:
  nodes_traversed: 47
  critical_nodes_indexed:
    - "CampusCircular — Adversarial Security, State Reliability & Math Integrity Audit"
    - "Campus Circular — Top 10 Validated Ideas & Feature Blueprints"
    - "3. Financial Math Invariant Audit (Integer Paise Engine)"
    - "2. LocalStorage & State Safety Audit (safeStorage.ts)"
    - "5. Late Fee & Timer Logic Audit (Epoch Anchored)"
    - "4. Input Sanitization & Security Audit (STRIDE & OWASP Top 10)"
    - "6. 10-Stage Lifecycle State Machine Integrity"
  relevance: >
    The architecture relies on four foundational libraries (finance.ts, safeStorage.ts,
    security.ts, lifecycleStateMachine.ts) that must be tested and proven BEFORE any UI
    components are mounted.
```

---

## 2. Architecture & Feature Breakdown in YAML (Rule #7)

```yaml
system_architecture:
  core_libraries:
    - file: "frontend/src/lib/finance.ts"
      role: "Integer-paise mathematical invariant engine. Prevents float drift and string concatenation bugs."
      invariant: "chargePaise + feePaise + depositPaise === totalPaise"
    - file: "frontend/src/lib/safeStorage.ts"
      role: "Zero-crash LocalStorage wrapper with memory fallback, 500KB cap, and atomic reset."
    - file: "frontend/src/lib/security.ts"
      role: "Text sanitizer, prototype-pollution filter, safe patcher, and image URL validator."
    - file: "frontend/src/lib/lifecycleStateMachine.ts"
      role: "Strict 10-stage state machine enforcing RBAC rules between Borrower, Lender, and Admin."
    - file: "frontend/src/lib/aiBundler.ts"
      role: "Deterministic natural language requirement parser with bundle decomposition and pruning."

  state_contexts:
    - context: "SessionContext"
      manages: "Active user identity (Rohan/Priya/Dean), active role, wallet balance, trust score."
    - context: "LoanEngineContext"
      manages: "Active loans, itemized escrow deposits, condition photos, inspection checklists."
    - context: "CartContext"
      manages: "Bundle kit cart, hostel pickup route clusters, selected items."

  ui_components:
    - component: "Navbar.tsx"
      props: "Role switcher, wallet balance badge, impact counters, listing trigger."
    - component: "HeroAIBundler.tsx"
      props: "Natural language search prompt, quick scenario chips (Reel shoot, Lab exam, Dorm night)."
    - component: "BundleCartDrawer.tsx"
      props: "Hostel cluster pickup stops, item checkboxes for pruning, fee formula card."
    - component: "ResourceCatalog.tsx"
      props: "Search bar, category tabs, hostel distance filter, empty-state fallback."
    - component: "ResourceCard.tsx"
      props: "Item image, hourly fee, deposit badge, owner trust badge, 1-click borrow."
    - component: "ResourceModal.tsx"
      props: "Included accessories, condition tags, borrowing rules, owner profile link."
    - component: "ListResourceModal.tsx"
      props: "Resource listing form with pre-filled campus templates and ₹0 donate toggle."
    - component: "CommunityBeaconDrawer.tsx"
      props: "Wanted-on-campus request feed with 'I Can Lend This!' response button."
    - component: "BorrowAgreementModal.tsx"
      props: "Digital condition pledge, duration picker, transparent fee formula pill."
    - component: "LifecycleTracker.tsx"
      props: "10-stage animated stepper, role-gated action buttons, judge time-warp bar."
    - component: "VisualDiffSlider.tsx"
      props: "Interactive split-screen before/after slider with 4-point hardware checklist."
    - component: "SettlementModal.tsx"
      props: "Deposit release breakdown, late fee deduction, damage dispute escalation."
    - component: "AdminDashboard.tsx"
      props: "Configurable 0%-15% fee slider, listing moderation, dispute court, fee revenue."
    - component: "ImpactSection.tsx"
      props: "Live counters for rupees saved, items reused, and CO2 diverted."
```

---

## 3. Strict Guardrails During Execution (Rule #8)

```yaml
execution_guardrails:
  g1_currency_integrity:
    rule: "NEVER store, calculate, or manipulate floating-point rupee values in state."
    enforcement: "All monetary values in state MUST be integer paise (1 INR = 100 paise). Display values convert via (paise / 100).toFixed(2)."
  g2_storage_safety:
    rule: "NEVER store Base64 images directly into localStorage."
    enforcement: "Photos must be verified asset paths or external HTTPS URLs. safeStorage.ts throws if payload exceeds 500KB."
  g3_role_action_barrier:
    rule: "A borrower can NEVER trigger a lender action, and a lender can NEVER approve their own deposit refund."
    enforcement: "lifecycleStateMachine.canTransition() strictly rejects unauthorized role transitions."
  g4_input_hygiene:
    rule: "All user text inputs (AI prompts, descriptions, dispute tickets) must be sanitized."
    enforcement: "sanitizeInput() removes HTML tags, script delimiters, and caps input length at 300 characters."
  g5_judge_demo_resilience:
    rule: "The app must never brick or get trapped in an unrecoverable state during an evaluator demo."
    enforcement: "Prominent 'Reset Demo State' button in Navbar immediately purges storage and restores deterministic seed data in <10ms."
```

---

## 4. Test-Driven Development (TDD) Test Suites (Rule #8)

Before writing any implementation code in `src/lib/`, the following automated Vitest test suites must be created and executed:

### Test Suite 1: Financial Invariant & Safe Storage Tests (`src/tests/finance_and_storage.test.ts`)
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { calculateTransactionTotal, calculateSettlement, rupeesToPaise, paiseToRupees } from '../lib/finance';
import { safeStorage } from '../lib/safeStorage';

describe('Financial Engine (Integer Paise & Invariants)', () => {
  it('strictly enforces Borrowing Charge + Platform Fee + Deposit === Total Transaction', () => {
    const borrowPaise = rupeesToPaise(150); // ₹150 -> 15000 paise
    const feePct = 5; // 5%
    const depositPaise = rupeesToPaise(500); // ₹500 -> 50000 paise

    const { feePaise, totalPaise } = calculateTransactionTotal(borrowPaise, feePct, depositPaise);

    expect(feePaise).toBe(750); // 5% of 15000 = 750 paise (₹7.50)
    expect(totalPaise).toBe(15000 + 750 + 50000); // 65750 paise
    expect(borrowPaise + feePaise + depositPaise).toBe(totalPaise);
  });

  it('prevents JavaScript string concatenation bugs', () => {
    // Simulates form returning string values: "150", "5", "500"
    const borrowStr = "150" as unknown as number;
    const depositStr = "500" as unknown as number;

    const borrowPaise = rupeesToPaise(borrowStr);
    const depositPaise = rupeesToPaise(depositStr);

    const { totalPaise } = calculateTransactionTotal(borrowPaise, 5, depositPaise);
    expect(totalPaise).toBe(65750);
    expect(totalPaise).not.toBe("1500075050000"); // Must not concatenate strings!
  });

  it('correctly calculates settlement with late fees and damage deductions', () => {
    const depositPaise = rupeesToPaise(1000); // ₹1,000
    const lateFeePaise = rupeesToPaise(150);  // ₹150 (3 hrs late)
    const damagePaise = rupeesToPaise(250);   // ₹250 (minor scratch)

    const settlement = calculateSettlement(depositPaise, lateFeePaise, damagePaise);

    expect(settlement.refundPaise).toBe(60000); // ₹600 refunded to borrower
    expect(settlement.lenderCompensationPaise).toBe(40000); // ₹400 paid to lender
    expect(settlement.refundPaise + settlement.lenderCompensationPaise).toBe(depositPaise);
  });

  it('caps damage deductions at 100% of security deposit (no negative refunds)', () => {
    const depositPaise = rupeesToPaise(500);
    const excessiveDamagePaise = rupeesToPaise(2000);

    const settlement = calculateSettlement(depositPaise, 0, excessiveDamagePaise);
    expect(settlement.refundPaise).toBe(0);
    expect(settlement.lenderCompensationPaise).toBe(50000);
  });
});

describe('SafeStorage Adapter', () => {
  beforeEach(() => {
    safeStorage.clearAll();
  });

  it('saves and restores data reliably', () => {
    safeStorage.setItem('test_key', { campus: 'Webfusion University', active: true });
    const val = safeStorage.getItem<{ campus: string; active: boolean }>('test_key', null);
    expect(val?.campus).toBe('Webfusion University');
  });

  it('gracefully handles corrupted JSON without crashing', () => {
    window.localStorage.setItem('CAMPUS_CIRCULAR_V1_corrupt', '{invalid_json}');
    const val = safeStorage.getItem('corrupt', { fallback: true });
    expect(val).toEqual({ fallback: true });
  });

  it('rejects oversized payloads (>500KB) to prevent QuotaExceededError', () => {
    const giantPayload = 'x'.repeat(600 * 1024); // 600KB
    expect(() => safeStorage.setItem('giant', giantPayload)).toThrow(/Payload exceeds safety threshold/);
  });
});
```

---

### Test Suite 2: State Machine & RBAC Tests (`src/tests/lifecycle_rbac.test.ts`)
```typescript
import { describe, it, expect } from 'vitest';
import { canTransition, getNextStage, LifecycleStage, UserRole } from '../lib/lifecycleStateMachine';

describe('Lifecycle State Machine & RBAC Matrix', () => {
  it('allows valid sequential state transitions with correct roles', () => {
    // Borrower requests available item
    expect(canTransition('AVAILABLE', 'REQUESTED', 'borrower')).toBe(true);

    // Lender accepts request
    expect(canTransition('REQUESTED', 'ACCEPTED', 'lender')).toBe(true);

    // Borrower acknowledges handover
    expect(canTransition('ACCEPTED', 'HANDOVER', 'borrower')).toBe(true);

    // Lender confirms handover to borrowed
    expect(canTransition('HANDOVER', 'BORROWED', 'lender')).toBe(true);

    // Borrower returns item
    expect(canTransition('BORROWED', 'RETURNED', 'borrower')).toBe(true);

    // Lender inspects return
    expect(canTransition('RETURNED', 'INSPECTION', 'lender')).toBe(true);

    // Lender confirms settlement
    expect(canTransition('INSPECTION', 'SETTLEMENT', 'lender')).toBe(true);
  });

  it('strictly blocks unauthorized role transitions (Elevation of Privilege check)', () => {
    // Borrower CANNOT approve their own request
    expect(canTransition('REQUESTED', 'ACCEPTED', 'borrower')).toBe(false);

    // Borrower CANNOT confirm their own return inspection
    expect(canTransition('RETURNED', 'INSPECTION', 'borrower')).toBe(false);

    // Borrower CANNOT release their own deposit settlement
    expect(canTransition('INSPECTION', 'SETTLEMENT', 'borrower')).toBe(false);
  });

  it('allows Admin to intervene and resolve disputes at any stage', () => {
    expect(canTransition('INSPECTION', 'SETTLEMENT', 'admin')).toBe(true);
    expect(canTransition('REQUESTED', 'ACCEPTED', 'admin')).toBe(true);
  });

  it('blocks illegal state skipping', () => {
    // Cannot skip from AVAILABLE directly to BORROWED without request and handover
    expect(canTransition('AVAILABLE', 'BORROWED', 'borrower')).toBe(false);

    // Cannot skip from BORROWED directly to SETTLEMENT without return and inspection
    expect(canTransition('BORROWED', 'SETTLEMENT', 'lender')).toBe(false);
  });
});
```

---

### Test Suite 3: AI Need-Based Bundler Parser Tests (`src/tests/ai_bundler.test.ts`)
```typescript
import { describe, it, expect } from 'vitest';
import { parseNeedPrompt, getAvailableBundles } from '../lib/aiBundler';

describe('AI Need-Based Bundler Parser', () => {
  it('correctly extracts 4-item bundle for the official hackathon example prompt', () => {
    const prompt = 'I need to make a reel for my club event tomorrow';
    const bundle = parseNeedPrompt(prompt);

    expect(bundle).toBeDefined();
    expect(bundle?.bundleName).toBe('Club Event Media & Reel Kit');
    expect(bundle?.requiredCategories).toContain('Camera');
    expect(bundle?.requiredCategories).toContain('Tripod');
    expect(bundle?.requiredCategories).toContain('Microphone');
    expect(bundle?.requiredCategories).toContain('Lighting');
  });

  it('correctly identifies Lab Exam emergency requirements', () => {
    const prompt = 'I have an electronics lab exam in 1 hour and forgot my calculator';
    const bundle = parseNeedPrompt(prompt);

    expect(bundle).toBeDefined();
    expect(bundle?.bundleName).toBe('Engineering Lab Exam Emergency Kit');
    expect(bundle?.requiredCategories).toContain('Scientific Calculator');
  });

  it('gracefully returns null and fallback suggestions on unrecognized prompts', () => {
    const prompt = 'random gibberish 12345 !@#';
    const bundle = parseNeedPrompt(prompt);

    expect(bundle).toBeNull();
  });
});
```

---

## 5. Cyber Attack Test Scripts (STRIDE & OWASP Top 10) (Rule #8)

### Test Suite 4: Cyber Attack Vulnerability Tests (`src/tests/security_stride_attacks.test.ts`)
```typescript
import { describe, it, expect } from 'vitest';
import { sanitizeInput, safePatch, isValidImageUrl } from '../lib/security';
import { calculateSettlement, rupeesToPaise } from '../lib/finance';
import { canTransition } from '../lib/lifecycleStateMachine';

describe('Cyber Attack Resilience (STRIDE & OWASP Top 10)', () => {
  // OWASP A03: Injection / STRIDE: Tampering
  it('STRIDE Tampering / XSS: Sanitizes malicious script tags and HTML injection', () => {
    const maliciousPrompt = "<script>alert('pwned')</script>I need a camera <img src=x onerror=stealCookies()>";
    const sanitized = sanitizeInput(maliciousPrompt);

    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('<img');
    expect(sanitized).not.toContain('stealCookies');
    expect(sanitized).toContain('I need a camera');
  });

  // OWASP A08: Software & Data Integrity Failures / STRIDE: Elevation of Privilege
  it('STRIDE Elevation of Privilege: Blocks Prototype Pollution in state patches', () => {
    const maliciousPayload = JSON.parse('{"__proto__": {"isAdmin": true}, "name": "Hacker"}');
    const targetObject = { name: 'Student', role: 'borrower' };

    const result = safePatch(targetObject, maliciousPayload, ['name']);

    expect(result.name).toBe('Hacker');
    // Prototype must not be polluted!
    expect(({} as any).isAdmin).toBeUndefined();
  });

  // OWASP A04: Insecure Design / Financial Exploitation
  it('Financial Attack: Rejects negative deposit injection attempting to steal funds', () => {
    const negativeDeposit = rupeesToPaise(-500); // Hacker attempts negative deposit to receive money
    expect(() => calculateSettlement(negativeDeposit, 0, 0)).toThrow(/Deposit cannot be negative/);
  });

  // STRIDE: Tampering with Photo Evidence URLs
  it('STRIDE Tampering: Rejects javascript: URI and data: URI protocol smuggling in photo fields', () => {
    expect(isValidImageUrl('javascript:alert(1)')).toBe(false);
    expect(isValidImageUrl('data:text/html;base64,PHNjcmlwdD4=')).toBe(false);
    expect(isValidImageUrl('https://images.unsplash.com/photo-1516035069371-29a1b244cc32')).toBe(true);
    expect(isValidImageUrl('/assets/camera_pre.jpg')).toBe(true);
  });

  // STRIDE: Elevation of Privilege in State Machine
  it('STRIDE Elevation of Privilege: Hacker cannot force-advance stage to SETTLEMENT as borrower', () => {
    const canHack = canTransition('BORROWED', 'SETTLEMENT', 'borrower');
    expect(canHack).toBe(false);
  });
});
```

---

## 6. Self-Critique of the Idea & Execution Plan (Adversarial Stress Test)

```yaml
self_critique_adversarial_findings:
  point_1_demo_time_trap:
    critique: >
      A 10-stage lifecycle is impressive on paper, but in a 2-minute judge demo, stepping through
      10 individual clicks will feel slow and risk running out of time.
    remediation: >
      Add a 1-click '⚡ Fast Demo: Run Golden Path' button on the Lifecycle Tracker that auto-advances
      through the stages with visual delays (800ms per stage) and pops up the Visual Diff Slider
      and Settlement Modal automatically.

  point_2_visual_diff_realism:
    critique: >
      If the before and after photos are completely different camera angles or lighting, the diff
      slider will look fake or disorienting.
    remediation: >
      Pre-seed the demo with 2 perfectly matched high-resolution images of the Sony A7 camera
      from identical angles: Handover photo (pristine) vs Return photo (subtle hairline scratch on
      lens hood). This gives judges an authentic 'Aha!' moment when dragging the slider.

  point_3_mobile_responsiveness:
    critique: >
      If the competition evaluator opens the link on an iPad or mobile phone, multi-column tables
      and wide modals might overflow or get truncated.
    remediation: >
      Ensure all modals use 'fixed inset-0 overflow-y-auto' and flex-col layouts with responsive
      breakpoints ('w-full max-w-2xl px-4') and touch-action: none on the slider thumb.

  point_4_offline_venue_wifi_failure:
    critique: >
      If Unsplash CDN images fail to load due to venue Wi-Fi throttling, the UI will display broken
      image icons.
    remediation: >
      Implement an 'onError' image fallback in ResourceCard and VisualDiffSlider that immediately
      swaps to high-quality local inline SVG blueprints if an external image fails to fetch.
```

---

## 7. Pre-Commit Hooks & Automation (Rules #10, #11 & #13)

```yaml
pre_commit_automation:
  hooks_configured:
    - step: "Type Checking"
      command: "tsc --noEmit"
      rule: "Zero tolerance for type casting errors or missing props."
    - step: "Zero-Tolerance Linting"
      command: "npx oxlint --max-warnings=0"
      rule: "Instant Rust-based linter enforcing clean syntax and hook deps."
    - step: "Strict Test Suite Execution"
      command: "npm run test"
      rule: "All 4 test suites (Finance, State Machine, AI Bundler, Cyber Security) MUST pass 100% before committing."
  no_force_commits: "Bypassing pre-commit checks with --no-verify is strictly forbidden per Rule #11."
```

---

## 8. Graphify Update Phase (Rule #5)
Following implementation and test verification, the knowledge graph will be updated via `graphify update .` to log all newly created test suites, libraries, and component relationships.
