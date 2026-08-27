# CampusCircular MVP — Execution Blueprint & Component Architecture

**Target Hackathon:** WEBFUSION 2.0 (5 Hours Total / Round 1 Evaluation at 3 Hours)  
**Execution Mode:** 100% Frontend (React 19 + TypeScript + Vite + Tailwind v4 + LocalStorage)  
**Strict Compliance:** Covers **all 13 Key Functionalities** defined in `spec/problem_statement.md`.

---

## 1. The 2-Minute "Golden Demo Path" for Judges

```yaml
golden_demo_path:
  minute_0_to_0_5:
    title: "The Problem & AI Bundle Magic (PS Section 4)"
    action: >
      Judge opens the app. Instead of manual search, user types in the AI Assistant:
      'I need to make a reel for my club event tomorrow'.
      The system instantly generates a coordinated 4-item bundle:
      [Sony Alpha A7III] + [Benro Video Tripod] + [Rode Wireless Go Mic] + [Ring Light]
      with distance (Hostel 2, 3 mins away), trust scores, and total fee breakdown.
    visual: "Bundle Cart drawer slides in with 1-click 'Borrow Full Kit' button."

  minute_0_5_to_1_0:
    title: "Borrowing Agreement & Transparent Fee Pill (PS Section 6, 7 & 12)"
    action: >
      User clicks 'Borrow Full Kit'. A borrowing agreement modal appears showing:
      Borrowing Charge (₹220) + Platform Fee 5% (₹11) + Refundable Deposit (₹700) = ₹931 Total.
      User signs the digital condition pledge and clicks 'Confirm & Lock Escrow'.
    visual: "Deposit is locked into simulated campus escrow; status moves to Handover."

  minute_1_0_to_1_5:
    title: "10-Stage Lifecycle & Visual Before/After Diff (PS Section 8, 9 & 10)"
    action: >
      The interactive 10-stage lifecycle stepper updates in real-time.
      At 'Handover', pre-borrow condition photos are captured.
      At 'Returned', the judge tests the interactive Before vs. After Visual Diff Slider,
      comparing condition. Zero scratches detected -> instant simulated deposit refund (₹700) released!
      (Optional toggle: Simulate damage -> auto-calculates repair deduction with dispute ticket).
    visual: "Interactive split-screen visual slider + deposit release toast."

  minute_1_5_to_2_0:
    title: "Admin Dashboard & Campus Impact Metrics (PS Section 1, 11 & 13)"
    action: >
      Switch role to 'Campus Admin' via the top header bar:
      View active exchanges, fee collection (₹11 platform fee logged), user trust profiles,
      and the live Campus Sustainability Dashboard (₹42,800 saved by students, 310kg CO2 diverted).
    visual: "Sleek admin analytics panel with active dispute queue and moderation toggles."
```

---

## 2. Feature Triaging Matrix (P0, P1, P2)

```yaml
triaged_features:
  p0_core_engine: # Built in first 2.5 hours (Guarantees 100% PS compliance)
    - id: "F1_PROFILES"
      name: "User & Trust Profile Modal"
      ps_section: "Section 1"
      details: "Department, Year, Roll No, Trust Score (e.g. 96/100), verified badge, dispute history."
    - id: "F2_CATALOG"
      name: "Resource Discovery & Catalog"
      ps_section: "Section 2 & 3"
      details: "Search bar, category tabs, condition filters, hostel distance badges, sorting."
    - id: "F3_AI_BUNDLE"
      name: "Natural Language AI Need Bundler"
      ps_section: "Section 4 & 5"
      details: "Natural prompt box with suggested quick-prompts ('Club Reel', 'Electronics Lab', 'Dorm Night')."
    - id: "F4_CHARGES_AGREEMENT"
      name: "Borrowing Agreement & Fee Formula Modal"
      ps_section: "Section 6, 7 & 12"
      details: "Exact formula: [Borrow Fee] + [5% Platform Fee] + [Deposit] = [Total]."
    - id: "F5_DIFF_SLIDER"
      name: "Interactive Before/After Condition Slider"
      ps_section: "Section 8"
      details: "Interactive horizontal split-slider comparing Handover photo vs Return photo."
    - id: "F6_LIFECYCLE_STEPPER"
      name: "10-Stage Animated Lifecycle Engine"
      ps_section: "Section 9 & 10"
      details: "Visual stepper with next-step buttons (Request ➔ Accept ➔ Handover ➔ Return ➔ Settle)."
    - id: "F7_ADMIN_PANEL"
      name: "Campus Admin Management Mode"
      ps_section: "Section 11"
      details: "Moderation queue, fee collection log, dispute resolver, user suspensions."
    - id: "F8_IMPACT_DASHBOARD"
      name: "Campus Circular Impact Counters"
      ps_section: "Section 13"
      details: "Money saved, items reused, on-time return rate, CO2 avoided."

  p1_fast_follows: # Added if time permits before final submission
    - "Dark/Light mode toggle"
    - "Export receipt as printable PDF/summary"
    - "Sound effects on successful settlement"

  p2_strategic_mocks: # Strictly simulated (Zero backend waste)
    - "Payment processing: Simulated UPI / Campus Wallet modal"
    - "User Auth: 1-click role switcher [Borrower: Rohan (CSE '25)] [Lender: Priya (ECE '24)] [Admin: Dean Office]"
```

---

## 3. The 10-Stage Lifecycle State Machine

```yaml
lifecycle_states:
  1_AVAILABLE: "Resource idle on catalog, open for borrowing."
  2_REQUESTED: "Borrower submitted agreement; deposit locked in escrow."
  3_ACCEPTED: "Lender approved the loan request."
  4_HANDOVER: "Parties meet; pre-borrow condition photo logged."
  5_BORROWED: "Item in borrower's active possession; timer starts."
  6_RETURN_DUE: "Deadline approaching alert / late fee countdown."
  7_RETURNED: "Borrower returns item to lender."
  8_INSPECTION: "Lender snaps post-return photo; visual diff slider unlocks."
  9_SETTLEMENT: "Zero damage confirmed ➔ Deposit auto-released; platform fee banked."
  10_RATED: "Borrower & Lender submit 5-star rating & trust review."
```

---

## 4. Frontend Component Hierarchy (`frontend/src/`)

```
frontend/src/
├── components/
│   ├── Navbar.tsx             # Role Switcher (Borrower/Lender/Admin), Impact counters
│   ├── HeroAIBundler.tsx      # Natural language prompt bar + 1-click bundle suggestions
│   ├── BundleCartDrawer.tsx   # Multi-item bundle checkout drawer
│   ├── ResourceCatalog.tsx    # Filterable grid of campus resources with hostel badges
│   ├── ResourceCard.tsx       # Item card with hourly rate, deposit, owner trust badge
│   ├── ResourceModal.tsx      # Full specs, accessory list, usage history, borrow button
│   ├── BorrowAgreementModal.tsx # Fee breakdown formula, duration, digital pledge
│   ├── LifecycleTracker.tsx   # 10-Stage animated lifecycle stepper with action buttons
│   ├── VisualDiffSlider.tsx   # Interactive split-screen before/after condition inspector
│   ├── SettlementModal.tsx    # Late fee calculation, deposit refund / damage deduction
│   ├── AdminDashboard.tsx     # Moderation table, platform fees earned, dispute court
│   ├── TrustProfileModal.tsx  # User stats, roll no, department, on-time rate, reviews
│   └── ImpactSection.tsx      # Money saved (₹), CO2 avoided (kg), circular reuse metrics
├── data/
│   └── mockResources.ts       # 12+ realistic campus items (Cameras, Calculators, Lab coats, Arduino)
├── hooks/
│   └── useCampusState.ts      # LocalStorage reactive state store for resources, loans, disputes
└── types/
    └── campus.ts              # Full TypeScript definitions for items, loans, users, disputes
```

---

## 5. Security & TDD Guardrails

- **Zero-Crash LocalStorage:** Auto-seeds mock resources if storage is empty; handles quota limits gracefully.
- **Input Sanitization:** All text inputs (AI prompt, dispute comments) scrubbed against XSS.
- **Mathematical Integrity:** Assert `Borrowing Charge + 5% Platform Fee + Deposit == Total` across all checkout and settlement flows.
