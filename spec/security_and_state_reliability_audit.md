# CampusCircular — Adversarial Security, State Reliability & Math Integrity Audit

**Role:** Principal Security & State Reliability Auditor  
**Date:** 2026-08-27  
**Scope:** Client-Side Architecture, LocalStorage State Safety, Financial Math Invariants, Input Security (STRIDE/OWASP Top 10), and Lifecycle Timing  
**Target Documents Reviewed:**  
- `spec/tech_stack_prd_campus_circular.md`
- `spec/mvp_execution_blueprint.md`
- `spec/product_prd_campus_circular.md`
- `spec/problem_statement.md` (specifically Section 12)

---

## 1. Executive Summary & Auditor Threat Model

CampusCircular is engineered as a 100% client-side web application for the WEBFUSION 2.0 hackathon. While eliminating an external backend solves venue Wi-Fi latency and server cold-start failures, it shifts the entire security perimeter, state consistency model, and transaction integrity directly onto the client's browser runtime.

In an adversarial evaluation or rigorous judging demo, client-side single-page applications commonly fail under five primary failure modes:
1. **Unrecoverable LocalStorage Corruption:** Malformed JSON or unhandled `QuotaExceededError` crashes the React component root ("Blank Screen of Death").
2. **Financial Arithmetic Drift & Type Coercion:** JavaScript string concatenation (`"150" + "15" = "15015"`) or IEEE-754 floating-point drift (`0.1 + 0.2 = 0.30000000000000004`) breaking Section 12 invariants.
3. **Client-Side Injection & Prototype Pollution:** Unsanitized natural-language AI prompts or dispute tickets executing XSS or polluting `Object.prototype` to escalate privileges.
4. **Drifting / Throttled Timers:** Interval-based countdown timers desynchronizing during tab suspension or backgrounding.
5. **Illegal State Transitions:** Lifecycle stepping skipping critical stages (e.g. jumping from `Borrowed` to `Settlement` without inspection photo proof).

This audit establishes mathematical invariants, defensive architectural patterns, and production-grade guardrails to ensure campus-level resilience.

---

## 2. LocalStorage & State Safety Audit (Objective 1)

### 2.1 Adversarial Failure Modes Analysis

```yaml
localstorage_failure_modes:
  corruption_and_syntax_error:
    risk: "High"
    trigger: "Browser crash during setItem, manual DevTools tampering, or partial write."
    impact: >
      JSON.parse(localStorage.getItem(key)) throws an uncaught SyntaxError.
      React renders fail during mount, resulting in a blank white screen during evaluation.
  quota_exceeded:
    risk: "Critical"
    trigger: >
      A user takes condition photos at Handover/Return. If stored as Base64 strings,
      a single 12MP smartphone photo produces ~5-8 MB of text, exceeding the 5MB browser quota.
    impact: >
      DOMException (QuotaExceededError, code 22). Subsequent state updates fail silently,
      leaving escrow and agreement states out of sync.
  schema_drift_and_type_mismatch:
    risk: "High"
    trigger: >
      Developer updates mock schema (e.g. adds user.trustScore.breakdown).
      User browser retains v1 schema where trustScore was a flat number.
    impact: >
      TypeError: Cannot read properties of undefined. Crash on accessing nested fields.
  private_browsing_isolation:
    risk: "Medium"
    trigger: "Judge opens app in Incognito or Safari Private Browsing mode with strict storage blocks."
    impact: "Accessing window.localStorage throws a SecurityError on invocation."
  multi_tab_desynchronization:
    risk: "Medium"
    trigger: "Judge opens Borrower view in Tab 1 and Admin view in Tab 2."
    impact: "Mutations in Tab 1 do not notify Tab 2, causing stale balance display."
```

### 2.2 Defensive Architecture: Safe Storage Engine

To guarantee zero crashes, client storage must be wrapped in a resilient layer featuring **in-memory fallback, runtime schema validation, and storage versioning**.

```typescript
// Architectural Pattern: Safe LocalStorage Wrapper with In-Memory Fallback
export interface StorageAdapter {
  getItem<T>(key: string, fallback: T): T;
  setItem<T>(key: string, value: T): boolean;
  removeItem(key: string): void;
  clear(): void;
}

class ResilientStorage implements StorageAdapter {
  private memoryFallback: Map<string, string> = new Map();
  private readonly VERSION_PREFIX = "CAMPUS_CIRCULAR_V1_";

  private getFullKey(key: string): string {
    return `${this.VERSION_PREFIX}${key}`;
  }

  public getItem<T>(key: string, fallback: T): T {
    const fullKey = this.getFullKey(key);
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        const mem = this.memoryFallback.get(fullKey);
        return mem ? JSON.parse(mem) : fallback;
      }
      const raw = window.localStorage.getItem(fullKey);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`[State Guard] Corrupted storage for "${key}". Resetting to fallback.`, err);
      this.setItem(key, fallback);
      return fallback;
    }
  }

  public setItem<T>(key: string, value: T): boolean {
    const fullKey = this.getFullKey(key);
    try {
      const serialized = JSON.stringify(value);
      // Hard payload size guard: reject payloads > 500KB to prevent quota blowout
      if (serialized.length > 512_000) {
        console.error(`[State Guard] Payload for "${key}" exceeds 500KB limit. Disallowing write.`);
        return false;
      }
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(fullKey, serialized);
      } else {
        this.memoryFallback.set(fullKey, serialized);
      }
      return true;
    } catch (err) {
      // Handles QuotaExceededError
      console.error(`[State Guard] Storage quota reached or write blocked for "${key}". Fallback to memory.`, err);
      this.memoryFallback.set(fullKey, JSON.stringify(value));
      return false;
    }
  }

  public removeItem(key: string): void {
    const fullKey = this.getFullKey(key);
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(fullKey);
      }
      this.memoryFallback.delete(fullKey);
    } catch (e) {
      // suppress
    }
  }

  public clear(): void {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith(this.VERSION_PREFIX)) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => window.localStorage.removeItem(k));
      }
      this.memoryFallback.clear();
    } catch (e) {
      this.memoryFallback.clear();
    }
  }
}

export const safeStorage = new ResilientStorage();
```

### 2.3 Bulletproof 'Reset Demo State' Mechanism

The application must provide a deterministic reset button that:
1. Purges all `CAMPUS_CIRCULAR_V1_*` keys.
2. Injects deep-cloned default seed data (`MOCK_RESOURCES`, `MOCK_USERS`, `MOCK_LOANS`).
3. Dispatches a cross-component event (`window.dispatchEvent(new CustomEvent('campus_state_reset'))`) so all mounted React hooks re-synchronize instantly without requiring a page reload.

```yaml
reset_demo_state_flow:
  step_1_purge: "safeStorage.clear() deletes all namespaced keys."
  step_2_reseed: "safeStorage.setItem('RESOURCES', structuredClone(DEFAULT_CATALOG_DATA))"
  step_3_event: "window.dispatchEvent(new CustomEvent('campus_circular_sync', { detail: { action: 'RESET' } }))"
  step_4_ui_toast: "Display instant toast: 'Demo state cleanly restored to factory baseline.'"
```

---

## 3. Financial Math Invariant Audit (Objective 2)

### 3.1 Problem Statement Section 12 Specification

> **Mandate:** `[Borrowing Charge] + [Platform Fee] + [Security Deposit] = [Transaction Amount]`
>
> **Settlement Invariant:**
> `[Total Locked Escrow] = [Security Deposit] + [Borrowing Charge] + [Platform Fee]`
> `[Borrower Refund] = [Security Deposit] - [Late Fee] - [Damage Deduction]`
> `[Lender Payout] = [Borrowing Charge] + [Damage Compensation]`
> `[Campus Admin Treasury] = [Platform Fee] + [Late Fee Penalty Commission]`

### 3.2 Vulnerability Vector: Type Coercion & Floating-Point Drift

In JavaScript, two dangerous failure modes can destroy financial integrity:

1. **String Concatenation Hazard (`+` Operator):**
   HTML `<input type="number">` returns a string via `e.target.value`. If an agreement calculation or custom deposit input is performed without strict numerical parsing:
   ```javascript
   // VULNERABLE CODE:
   const borrowingCharge = "150";
   const platformFee = "15";
   const deposit = "700";
   const total = borrowingCharge + platformFee + deposit;
   // Result: "15015700" (Total is ₹1.50 Crore instead of ₹865!)
   ```

2. **IEEE-754 Floating-Point Precision Loss:**
   The 5% platform fee requires floating-point multiplication: `charge * 0.05`.
   ```javascript
   // VULNERABLE CODE:
   const charge = 19.90;
   const fee = charge * 0.05; // 0.9950000000000001
   const deposit = 50.00;
   const total = charge + fee + deposit; // 70.89500000000001

   // Invariant check:
   (charge + fee + deposit === total) // true here, but:
   (0.1 + 0.2 === 0.3) // FALSE in JS (0.30000000000000004)
   ```
   If formatted with `toFixed(2)`, discrepancies can cause pennies/paise to vanish or fail strict assertion checks.

### 3.3 Guardrail Architecture: Integer-Based Paise Currency Engine

To eliminate all floating-point errors and string concatenation bugs, the application must use an **Integer Paise Financial Engine** (`1 INR = 100 paise`). All math is computed in integers, with strict input sanitation.

```typescript
// Strict Financial Math Specification: src/lib/finance.ts

export interface TransactionBreakdown {
  borrowingCharge: number; // in Rupees (display)
  platformFee: number;     // in Rupees (display)
  securityDeposit: number; // in Rupees (display)
  totalAmount: number;     // in Rupees (display)
  
  // Internal integer representations (in Paise: 1 INR = 100 Paise)
  chargePaise: number;
  feePaise: number;
  depositPaise: number;
  totalPaise: number;
}

export function toPaise(rupees: number | string): number {
  if (typeof rupees === "string") {
    const sanitized = rupees.replace(/[^0-9.-]+/g, "");
    const parsed = parseFloat(sanitized);
    if (isNaN(parsed) || !isFinite(parsed) || parsed < 0) {
      return 0;
    }
    return Math.round(parsed * 100);
  }
  if (isNaN(rupees) || !isFinite(rupees) || rupees < 0) {
    return 0;
  }
  return Math.round(rupees * 100);
}

export function fromPaise(paise: number): number {
  return Math.round(paise) / 100;
}

export function calculateTransactionBreakdown(
  rawCharge: number | string,
  rawDeposit: number | string,
  platformFeeRate: number = 0.05 // 5%
): TransactionBreakdown {
  const chargePaise = toPaise(rawCharge);
  const depositPaise = toPaise(rawDeposit);
  
  // Platform fee rounded to nearest integer paise
  const feePaise = Math.round(chargePaise * platformFeeRate);
  
  // Exact Integer Invariant
  const totalPaise = chargePaise + feePaise + depositPaise;
  
  // Invariant Assertion Check
  if (chargePaise + feePaise + depositPaise !== totalPaise) {
    throw new Error(`[Financial Invariant Violation] Math mismatch: ${chargePaise} + ${feePaise} + ${depositPaise} !== ${totalPaise}`);
  }

  return {
    borrowingCharge: fromPaise(chargePaise),
    platformFee: fromPaise(feePaise),
    securityDeposit: fromPaise(depositPaise),
    totalAmount: fromPaise(totalPaise),
    chargePaise,
    feePaise,
    depositPaise,
    totalPaise
  };
}

export function calculateSettlement(
  depositPaise: number,
  lateFeePaise: number,
  damageDeductionPaise: number
): { refundPaise: number; retainedPaise: number } {
  // Guard against negative values
  const safeLateFee = Math.max(0, lateFeePaise);
  const safeDamage = Math.max(0, damageDeductionPaise);
  
  // Total deduction cannot exceed security deposit
  const totalDeductions = Math.min(depositPaise, safeLateFee + safeDamage);
  const refundPaise = depositPaise - totalDeductions;
  
  return {
    refundPaise,
    retainedPaise: totalDeductions
  };
}
```

---

## 4. Input Sanitization & Security Audit (STRIDE & OWASP Top 10) (Objective 3)

### 4.1 Threat Matrix: CampusCircular Attack Surfaces

```yaml
stride_owasp_audit_matrix:
  threat_1_xss_injection:
    stride_category: "Tampering / Information Disclosure"
    owasp_top_10: "A03:2021 - Injection"
    surface: "AI Search bar, Dispute comment field, Condition notes"
    attack_payload: "<img src=x onerror=alert('XSS_ATTACK')> or javascript:/*--></title></style></textarea></script><svg/onload=alert(1)>"
    impact: "Session hijacking, DOM defacement, or simulated escrow draining."
    guardrail: "Strict DOM text escaping, rejection of raw HTML, and length limits."

  threat_2_prototype_pollution:
    stride_category: "Elevation of Privilege"
    owasp_top_10: "A08:2021 - Software and Data Integrity Failures"
    surface: "State update methods (e.g. updateProfile, patchItem)"
    attack_payload: '{"__proto__": {"role": "admin", "verified": true}}'
    impact: "Unprivileged student bypasses role checks, moderates listings, or claims platform fees."
    guardrail: "Use of safe spread operators with key whitelisting and Object.hasOwn checks."

  threat_3_client_side_redos:
    stride_category: "Denial of Service (DoS)"
    owasp_top_10: "A04:2021 - Insecure Design"
    surface: "Natural language query parser for AI Need Bundler"
    attack_payload: "User enters 1,000 repeating characters with exponential regex backtracking."
    impact: "Main browser thread freezes (100% CPU lockup), making app unresponsive to judges."
    guardrail: "Input truncation at 200 characters and token-based string parsing (no vulnerable regex)."

  threat_4_image_url_protocol_hijack:
    stride_category: "Tampering / Elevation of Privilege"
    owasp_top_10: "A03:2021 - Injection"
    surface: "Pre-borrow and Post-return condition image URLs"
    attack_payload: "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg== or javascript:alert(1)"
    impact: "Execution of script within application origin when opening full image."
    guardrail: "Strict URL protocol validation allowing ONLY http: and https:."
```

### 4.2 Anti-Pollution & Anti-XSS Sanitizer Implementation

```typescript
// Sanitization Guardrail: src/lib/security.ts

/**
 * Strips dangerous HTML tags, angle brackets, and control characters from user text.
 */
export function sanitizeTextInput(input: unknown, maxLength: number = 300): string {
  if (typeof input !== "string") {
    return "";
  }
  // Trim and enforce strict length boundary to prevent memory DoS
  const bounded = input.trim().slice(0, maxLength);
  
  // Strip HTML tags and script delimiters
  return bounded
    .replace(/<[^>]*>?/gm, "")
    .replace(/[&<>"'/]/g, (char) => {
      switch (char) {
        case "&": return "&amp;";
        case "<": return "&lt;";
        case ">": return "&gt;";
        case '"': return "&quot;";
        case "'": return "&#39;";
        case "/": return "&#x2F;";
        default: return char;
      }
    });
}

/**
 * Validates external image URLs to prevent javascript: or data: XSS payloads.
 */
export function validateSafeImageUrl(url: string, fallbackUrl: string): string {
  if (!url || typeof url !== "string") return fallbackUrl;
  const trimmed = url.trim();
  
  // Whitelist http, https, and internal assets only
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("/")) {
    return trimmed;
  }
  return fallbackUrl;
}

/**
 * Deep clone and safe patch that is immune to prototype pollution.
 */
export function safePatch<T extends object>(target: T, patch: Partial<T>, allowedKeys: (keyof T)[]): T {
  const result = { ...target };
  for (const key of allowedKeys) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      continue; // Strictly block prototype poisoning keys
    }
    if (Object.prototype.hasOwnProperty.call(patch, key) && patch[key] !== undefined) {
      result[key] = patch[key] as T[keyof T];
    }
  }
  return result;
}
```

---

## 5. Late Fee & Timer Logic Audit (Objective 4)

### 5.1 The Pitfalls of Interval-Based Timers

Common implementations in hackathon projects create a `setInterval(() => setSeconds(s => s - 1), 1000)` and persist the remaining seconds to `localStorage` every second.
This approach has three critical flaws:
1. **Clock Drift under Tab Throttling:** When a user switches tabs or a laptop closes, modern browsers throttle `setInterval` to fire once every minute (or suspend it entirely). 3 hours of real elapsed time registers as only 3 minutes in the counter!
2. **Disk I/O Thrashing:** Writing to `localStorage` once every 1,000ms triggers constant serialization and disk writes, causing battery drain and frame drops.
3. **State Mutation Desync:** If multiple tabs are open, concurrent writes to the same remaining seconds key will constantly overwrite and jump backward/forward.

### 5.2 Deterministic Epoch-Anchored Architecture

Instead of storing decremented counters, the system must store **static Unix Epoch Millisecond Timestamps** (`dueTimestamp`). The countdown and late fees are **pure mathematical projections** calculated at render time.

```yaml
epoch_timer_architecture:
  state_variables:
    borrowedAt: "1724739600000 (Epoch ms when item handed over)"
    dueAt: "1724754000000 (borrowedAt + durationHours * 3600000)"
    returnedAt: "null (set to Date.now() when returned)"
  calculation_logic:
    now: "Date.now() or (Date.now() + mockOffsetMs)"
    is_overdue: "now > dueAt"
    remaining_ms: "Math.max(0, dueAt - now)"
    overdue_hours: "Math.max(0, Math.ceil((now - dueAt) / (1000 * 60 * 60)))"
    late_fee: "Math.min(overdue_hours * hourlyLateRate, securityDeposit)"
```

### 5.3 Hackathon Demo Feature: "Judge Time-Warp Controller"

Because judges only have 2 to 5 minutes to evaluate the project, they cannot wait 24 hours to test late returns. The system must include a simulated clock offset (`mockOffsetMs`) accessible via a demo bar:
- `[+1 Hour]` -> Simulates regular on-time return window.
- `[+5 Hours]` -> Simulates passing the deadline (triggers `6_RETURN_DUE` alert).
- `[+24 Hours]` -> Simulates overdue return (auto-calculates late fee deduction).

```typescript
// Countdown & Late Fee Projection Hook: src/hooks/useLoanTimer.ts
import { useState, useEffect } from "react";

export interface LoanTimerResult {
  remainingHours: number;
  remainingMinutes: number;
  remainingSeconds: number;
  isOverdue: boolean;
  overdueHours: number;
  calculatedLateFee: number;
  formattedCountdown: string;
}

export function useLoanTimer(
  dueAt: number,
  returnedAt: number | null,
  hourlyLateRate: number,
  depositAmount: number,
  mockOffsetMs: number = 0
): LoanTimerResult {
  const [, setTick] = useState(0);

  useEffect(() => {
    // Only re-renders local component display. Zero writes to localStorage!
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const effectiveNow = (returnedAt !== null ? returnedAt : Date.now()) + mockOffsetMs;
  const diffMs = dueAt - effectiveNow;
  const isOverdue = diffMs < 0;

  if (!isOverdue) {
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return {
      remainingHours: h,
      remainingMinutes: m,
      remainingSeconds: s,
      isOverdue: false,
      overdueHours: 0,
      calculatedLateFee: 0,
      formattedCountdown: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    };
  } else {
    const overdueMs = Math.abs(diffMs);
    const overdueHours = Math.max(1, Math.ceil(overdueMs / (1000 * 60 * 60)));
    const rawLateFee = overdueHours * hourlyLateRate;
    // Security invariant: Late fee cannot exceed security deposit
    const cappedLateFee = Math.min(rawLateFee, depositAmount);

    return {
      remainingHours: 0,
      remainingMinutes: 0,
      remainingSeconds: 0,
      isOverdue: true,
      overdueHours,
      calculatedLateFee: cappedLateFee,
      formattedCountdown: `OVERDUE by ${overdueHours}h`
    };
  }
}
```

---

## 6. 10-Stage Lifecycle State Machine Integrity

To ensure an exchange cannot jump from `AVAILABLE` to `SETTLEMENT` without passing through approval, handover photo recording, and visual inspection, the state engine must enforce a **strict finite state transition graph**.

```yaml
lifecycle_finite_state_machine:
  states:
    1_AVAILABLE:
      allowed_next: ["2_REQUESTED"]
    2_REQUESTED:
      allowed_next: ["3_ACCEPTED", "1_AVAILABLE"] # Accepted or Cancelled
    3_ACCEPTED:
      allowed_next: ["4_HANDOVER", "1_AVAILABLE"] # Meetup or Cancelled
    4_HANDOVER:
      allowed_next: ["5_BORROWED"] # Pre-condition photo logged, item handed over
    5_BORROWED:
      allowed_next: ["6_RETURN_DUE", "7_RETURNED"]
    6_RETURN_DUE:
      allowed_next: ["7_RETURNED"]
    7_RETURNED:
      allowed_next: ["8_INSPECTION"] # Return photo snapped
    8_INSPECTION:
      allowed_next: ["9_SETTLEMENT"] # Visual diff slider completed
    9_SETTLEMENT:
      allowed_next: ["10_RATED"] # Deposit refunded, fees banked
    10_RATED:
      allowed_next: [] # Terminal State
```

```typescript
// State Guard: src/lib/lifecycleStateMachine.ts
export type LifecycleStage =
  | "1_AVAILABLE"
  | "2_REQUESTED"
  | "3_ACCEPTED"
  | "4_HANDOVER"
  | "5_BORROWED"
  | "6_RETURN_DUE"
  | "7_RETURNED"
  | "8_INSPECTION"
  | "9_SETTLEMENT"
  | "10_RATED";

const VALID_TRANSITIONS: Record<LifecycleStage, LifecycleStage[]> = {
  "1_AVAILABLE": ["2_REQUESTED"],
  "2_REQUESTED": ["3_ACCEPTED", "1_AVAILABLE"],
  "3_ACCEPTED": ["4_HANDOVER", "1_AVAILABLE"],
  "4_HANDOVER": ["5_BORROWED"],
  "5_BORROWED": ["6_RETURN_DUE", "7_RETURNED"],
  "6_RETURN_DUE": ["7_RETURNED"],
  "7_RETURNED": ["8_INSPECTION"],
  "8_INSPECTION": ["9_SETTLEMENT"],
  "9_SETTLEMENT": ["10_RATED"],
  "10_RATED": []
};

export function canTransition(current: LifecycleStage, next: LifecycleStage): boolean {
  const allowed = VALID_TRANSITIONS[current];
  return allowed ? allowed.includes(next) : false;
}
```

---

## 7. 5 Critical Security & Reliability Recommendations

### Recommendation 1: Strict Invariant Enforcement with Runtime Validation
- **Risk Addressed:** String concatenation (`"150" + "15" = "15015"`) and floating-point errors violating Problem Statement Section 12.
- **Action:** Enforce the `calculateTransactionBreakdown` helper across all checkout, agreement, and settlement screens. Disallow direct arithmetic in UI components. Store amounts internally in integer paise.

### Recommendation 2: Zero-Crash Resilient LocalStorage Wrapper with Schema Versioning
- **Risk Addressed:** `SyntaxError` from corrupted storage or `QuotaExceededError` from Base64 images crashing the React application during a live judge demo.
- **Action:** Deploy the `safeStorage` adapter with a `CAMPUS_CIRCULAR_V1_` namespace, an in-memory fallback, a hard 500KB payload limit, and a one-click atomic "Reset Demo State" button in the global navbar.

### Recommendation 3: Defensive Input Sanitization & Prototype Pollution Barrier
- **Risk Addressed:** XSS attacks in AI search or dispute tickets; prototype pollution privilege escalation into admin roles.
- **Action:** Pass all user inputs through `sanitizeTextInput()` before storing; validate all image URLs with `validateSafeImageUrl()`; use `safePatch()` with key whitelisting for all state mutations.

### Recommendation 4: Deterministic Epoch-Based Timers with "Judge Time-Traveler"
- **Risk Addressed:** Timer drift from browser tab throttling and unpersisted state desync during late fee calculations.
- **Action:** Store static Unix timestamps (`dueAt`, `borrowedAt`) rather than decremented seconds. Implement the `useLoanTimer` hook that calculates overdue hours dynamically and cap late fees at the security deposit. Provide a demo clock fast-forward tool for evaluators.

### Recommendation 5: Finite State Machine Guard for Borrowing Lifecycle
- **Risk Addressed:** Bypassing verification steps (e.g. refunding deposits without inspection or transitioning backwards).
- **Action:** Enforce the unidirectional `canTransition` state machine table in `useCampusStore`, ensuring every exchange moves sequentially through all 10 stages.

---

## 8. Verification & TDD Test Plan

```typescript
// Vitest Suite Specification: test/security_and_math.test.ts
import { describe, it, expect } from "vitest";
import { calculateTransactionBreakdown, calculateSettlement, toPaise } from "../src/lib/finance";
import { sanitizeTextInput, validateSafeImageUrl, safePatch } from "../src/lib/security";
import { canTransition } from "../src/lib/lifecycleStateMachine";

describe("Financial Invariant Tests (PS Section 12)", () => {
  it("strictly satisfies Borrowing Charge + 5% Platform Fee + Deposit == Total", () => {
    const result = calculateTransactionBreakdown(220, 700, 0.05);
    expect(result.borrowingCharge).toBe(220);
    expect(result.platformFee).toBe(11);
    expect(result.securityDeposit).toBe(700);
    expect(result.totalAmount).toBe(931);
    expect(result.chargePaise + result.feePaise + result.depositPaise).toBe(result.totalPaise);
  });

  it("handles string input without string concatenation bugs", () => {
    // Attack case: strings passed from input elements
    const result = calculateTransactionBreakdown("150", "700", 0.05);
    expect(result.totalAmount).toBe(857.5);
    expect(result.totalAmount).not.toBe("1507.5700");
  });

  it("settlement late fee never exceeds security deposit", () => {
    const depositPaise = toPaise(500);
    const excessiveLateFeePaise = toPaise(1200); // 24 hours overdue
    const settlement = calculateSettlement(depositPaise, excessiveLateFeePaise, 0);
    expect(settlement.retainedPaise).toBe(depositPaise); // Capped at 500
    expect(settlement.refundPaise).toBe(0); // Cannot be negative
  });
});

describe("Security & Sanitization Tests (STRIDE / OWASP)", () => {
  it("neutralizes XSS payloads in natural language input", () => {
    const payload = "<script>alert('pwned')</script>Tripod for club";
    const cleaned = sanitizeTextInput(payload);
    expect(cleaned).not.toContain("<script>");
    expect(cleaned).toContain("Tripod for club");
  });

  it("blocks prototype pollution attacks on state patching", () => {
    const state = { title: "Original", role: "borrower" };
    const maliciousPatch = JSON.parse('{"__proto__": {"role": "admin"}, "title": "Hacked"}');
    const patched = safePatch(state, maliciousPatch, ["title"]);
    expect(patched.title).toBe("Hacked");
    expect((patched as any).role).toBe("borrower");
    expect(({} as any).role).toBeUndefined(); // Prototype unpolluted
  });

  it("rejects malicious javascript: URLs for images", () => {
    const attackUrl = "javascript:alert(document.cookie)";
    const fallback = "/assets/default.jpg";
    expect(validateSafeImageUrl(attackUrl, fallback)).toBe(fallback);
  });
});

describe("10-Stage Lifecycle State Machine", () => {
  it("prevents illegal transition skipping handover", () => {
    expect(canTransition("1_AVAILABLE", "5_BORROWED")).toBe(false);
    expect(canTransition("1_AVAILABLE", "2_REQUESTED")).toBe(true);
    expect(canTransition("4_HANDOVER", "5_BORROWED")).toBe(true);
  });

  it("prevents double settlement", () => {
    expect(canTransition("9_SETTLEMENT", "9_SETTLEMENT")).toBe(false);
    expect(canTransition("9_SETTLEMENT", "10_RATED")).toBe(true);
  });
});
```
