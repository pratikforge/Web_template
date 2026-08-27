# Product Requirements Document (PRD) — CampusCircular

> Note: Tech stack is covered in a separate Tech Stack PRD. This document is scoped to product behavior, users, and requirements only.

## 1. Title & Summary
- **Product/Feature Name:** CampusCircular — From Ownership to Access
- **Owner:** Pratik & Engineering Team
- **Status:** Approved (Pre-Execution)
- **Date:** 2026-08-27
- **One-paragraph overview:** CampusCircular is an AI-powered, peer-to-peer campus resource sharing, lending, and circular economy web application designed for college communities. It transitions campus students from expensive item ownership to instant local access. Key innovations include natural language AI multi-item need bundling ("I need to shoot a reel for my club event"), an interactive before/after visual condition diff slider for zero-ambiguity dispute settlement, a 10-stage transparent borrowing lifecycle stepper, and live sustainability metrics tracking rupees saved and CO2 avoided.

---

## 2. Problem Statement
- **The problem:** College students frequently need high-value equipment (scientific calculators, DSLR cameras, tripods, lab coats, mini drafters, Arduino kits) for short periods (a 3-hour exam, a weekend club fest, a 2-day lab). Simultaneously, hundreds of such items sit idle in dorm rooms.
- **Evidence it's real:** Academic surveys and Reddit threads (`r/college`, `r/Indian_Academia`) show students spend ₹2,000–₹5,000 per semester on one-off academic/club gear. Existing peer-lending attempts fail due to damage disputes ("he-said-she-said"), lost security deposits, and awkward off-campus meetups.
- **Who has this problem:** Over 40 million college students across Indian universities, student club leads, lab students, and hostel residents.
- **Why now:** AI allows natural-language need decomposition (bundling kits instead of searching single items), and web technologies enable instant visual condition proof and localized trust networks.
- **What exists today / alternatives:**
  - *Campus Circle / OLX:* Buy/sell only; forces students to pay full price for items they only need for 4 hours.
  - *WhatsApp / Telegram groups:* Chaotic, unsearchable, zero deposit protection, frequent ghosting.
  - *Fat Llama / ByRotation:* High take rates (up to 50%), week-long deposit release, off-campus stranger anxiety.
- **Why this is different / better:**
  - 1-Click AI Need Bundler solves multi-item project requirements in 2 seconds.
  - Visual Before/After Diff Slider eliminates damage disputes at handover.
  - 10-Stage Lifecycle State Engine guarantees total transparency.
  - 100% localized to campus hostels with 2-minute walking meetups.

---

## 3. Goals & Success Metrics
| Goal | Metric | Current | Target |
|------|--------|---------|--------|
| Multi-item discovery speed | Time to discover a 4-item project kit | >15 minutes (manual search) | <5 seconds (AI Bundler) |
| Damage dispute resolution | Time & friction to verify item condition | 3–7 days (manual claims) | <10 seconds (Visual Diff Slider) |
| Feature completeness | Coverage of WEBFUSION 2.0 PS requirements | 0/13 | 13/13 (100% compliance) |
| Demo reliability & speed | First-paint to full interactivity | N/A | <500ms (100% frontend local state) |
| Campus economic impact | Average student money saved per exchange | ₹0 | ₹500–₹1,500 per borrow |

---

## 4. Target Users
- **Primary User 1 (The Student Borrower):** Rohan, 2nd-year CSE student. Needs a Casio fx-991EX calculator for tomorrow's 9 AM exam, or a camera kit for his cultural club reel. Wants instant discovery, low hourly fees, and guaranteed deposit return.
- **Primary User 2 (The Student Lender):** Priya, 3rd-year ECE student. Owns an Arduino Mega kit and a tripod that sit unused on weekdays. Wants passive pocket money, vetted campus peers, and zero fear of item damage.
- **Secondary User (Campus Admin / Dean of Student Affairs):** Admin managing campus asset safety, fee earnings, dispute escalations, and campus sustainability metrics.

---

## 5. Non-Goals / Out of Scope
- **Real-Money Payment Gateway Integration:** In this 5-hour frontend competition, external banking APIs (Razorpay/Stripe) are out of scope. Transactions and security deposits are fully simulated with instant local wallet escrow.
- **Off-Campus Long-Distance Shipping / Logistics:** CampusCircular strictly models walking-distance on-campus exchanges within hostel blocks and campus departments.
- **Complex Multi-College Federated Identity:** Identity verification is modeled via campus roll numbers, hostel blocks, and college department badges.

---

## 6. User Stories / Use Cases
- **US-1 (AI Natural Language Need Discovery):** As a student event coordinator, I want to type *"I need to make a reel for my club event tomorrow"* into a prompt box, so that the system automatically identifies and bundles a Camera, Tripod, Lapel Mic, and Ring Light from nearby hostels in 1 click.
- **US-2 (Transparent Fee & Agreement Confirmation):** As a borrower, I want to see an exact mathematical breakdown `[Borrow Fee] + [5% Platform Fee] + [Refundable Deposit] = [Total]` and sign a digital condition pledge before committing funds.
- **US-3 (Before & After Visual Condition Proof):** As a lender, I want an interactive visual slider comparing the photo taken at handover vs. the photo taken at return, so that any new damage is undeniable and pre-existing scratches are never blamed on the borrower.
- **US-4 (10-Stage Lifecycle Stepper):** As a user, I want a visual 10-stage stepper showing the current status from `Available` to `Handover` to `Inspection` to `Settlement`, with interactive buttons to simulate the next stage.
- **US-5 (Dispute & Settlement Resolution):** As a user, if an item is returned late or damaged, I want the system to auto-calculate the late fee or damage deduction, adjust the deposit refund, and allow opening an admin dispute ticket.
- **US-6 (Campus Admin Dashboard):** As a campus administrator, I want a dedicated dashboard to moderate listings, monitor active exchanges, review platform fee revenue, and resolve disputes.
- **US-7 (Sustainability & Impact Tracking):** As a student body member, I want to see real-time counters of total rupees saved, items reused, and CO2 avoided across campus.

---

## 7. Features & Functional Requirements
| Feature | Description | Priority (Must/Should/Could/Won't) |
|---|---|:---:|
| **F-01: User & Trust Profile** | Department, Year, Roll No, Trust Score (0–100), verification badges, late returns counter, dispute history | **Must (P0)** |
| **F-02: Resource Catalog & Filters** | Search bar, category filters (Electronics, Lab & Academic, Media, Sports, Free/Donate), hostel proximity, condition tags | **Must (P0)** |
| **F-03: AI Need-Based Bundler** | Natural language intent parser recommending bundled kits (e.g. Camera + Tripod + Mic + Light) with 1-click joint checkout | **Must (P0)** |
| **F-04: Smart Matching & Alternatives** | Recommends nearby alternative gear if primary choice is unavailable; community request beacon option | **Must (P0)** |
| **F-05: Fee & Deposit Breakdown** | Explicit formula: `[Borrowing Charge] + [5% Platform Fee] + [Refundable Deposit] = [Total Transaction]` | **Must (P0)** |
| **F-06: Borrowing Agreement Modal** | Digital agreement showing duration, parties, responsibilities, return deadline, and digital signature checkbox | **Must (P0)** |
| **F-07: Before/After Visual Diff** | Interactive split-screen visual diff slider comparing handover photo vs return photo | **Must (P0)** |
| **F-08: 10-Stage Lifecycle Stepper** | Visual state engine: Available &rarr; Requested &rarr; Accepted &rarr; Handover &rarr; Borrowed &rarr; Return Due &rarr; Returned &rarr; Inspection &rarr; Settlement &rarr; Rated | **Must (P0)** |
| **F-09: Settlement & Dispute Engine**| Automatic late fee calculator, damage deduction from deposit, 1-click admin dispute escalation | **Must (P0)** |
| **F-10: Admin Management Panel** | Separate admin view with listing moderation, fee earnings tracker, user suspension, and dispute resolution queue | **Must (P0)** |
| **F-11: Campus Impact Dashboard** | Real-time counters: ₹ saved by students, items reused, CO2 diverted, on-time return rate | **Must (P0)** |
| **F-12: Role Switcher Demo Bar** | Top floating switcher: [Borrower: Rohan] [Lender: Priya] [Campus Admin: Dean Office] for instant evaluation | **Must (P0)** |
| **F-13: Printable PDF/Receipt Export** | Export loan settlement receipt summary | Should (P1) |

---

## 8. User Flow
1. **Discovery (Entry Point):** User lands on CampusCircular. Enters an AI prompt (*"I need to shoot a reel"*) or browses the filterable resource grid.
2. **Bundle / Item Selection:** User reviews bundled items (Camera + Tripod + Mic + Light), checks hostel distance (e.g., *Hostel 3, 2 mins away*), and clicks *Borrow Kit*.
3. **Agreement & Escrow Lock:** User reviews the fee formula (`₹220 Fee + ₹11 Platform Fee + ₹700 Deposit = ₹931`), checks the condition pledge, and confirms. State moves to `Requested` &rarr; `Accepted`.
4. **Handover & Photo Logging:** Borrower and Lender meet at campus location. Pre-borrow condition photos are logged. State moves to `Handover` &rarr; `Borrowed`.
5. **Return & Visual Inspection:** Borrower returns item. Lender takes post-return photo. Interactive **Before & After Visual Diff Slider** opens.
6. **Settlement & Rating (Completion State):** Zero damage confirmed &rarr; ₹700 deposit is instantly refunded to borrower wallet. Lender receives ₹220; Campus admin banks ₹11 platform fee. Both parties rate each other (5 stars), updating campus trust scores.

---

## 9. Edge Cases & Error States
- **Bad / Unrecognized AI Input:** User types gibberish into the AI prompt (e.g. *"xyz123"*). Fallback: Display helpful suggestion chips (*"Try: Club Reel Shoot, Lab Exam Emergency, Dorm Movie Night"*).
- **Simulated Damage Reported:** Lender flags a deep scratch on the camera lens. System prompts damage evidence upload, calculates repair deduction from deposit (e.g., ₹300 deducted, ₹400 refunded), and offers 1-click *Raise Dispute* to Admin.
- **Late Return Past Deadline:** Return occurs 3 hours late. System automatically applies late fee (₹50/hr), deducts ₹150 from deposit, and logs a late return mark on the borrower's trust profile.
- **Empty Catalog Filter State:** Search query yields 0 results. System displays: *"No items match your filter. Post an Emergency Community Request to nearby students!"*

---

## 10. Assumptions & Constraints
- **Assumptions:** Evaluators will judge the project on modern desktop/laptop browsers. Realistic Indian campus context (₹ currency, Hostels, Departments) resonates highest with judges.
- **Constraints:** 5-hour hackathon timeframe with Round 1 evaluation at 3 hours. Strict rule: **100% frontend-only** (localStorage / JavaScript mock data).

---

## 11. Dependencies
- React 19 + TypeScript + Vite runtime
- Tailwind CSS v4 for ultra-fast, responsive styling
- Lucide-React for clean iconography
- LocalStorage for client-side state persistence

---

## 12. Risks & Open Questions
- **Risk:** Complex state transitions during a fast judge demo.
  - *Mitigation:* Include 1-click *"Reset Demo State"* and instant *"Advance Step"* controls on the Lifecycle Tracker.
- **Risk:** Heavy images slowing down page load.
  - *Mitigation:* Use optimized Unsplash CDN URLs and local SVG/WebP assets with graceful fallback image placeholders.

---

## 13. Timeline / Milestones
| Milestone | Deliverable | Target Duration |
|---|---|---|
| **M1: Mock Data & State Engine** | `mockCampusData.ts` & `useCampusStore.ts` | 20 mins |
| **M2: Catalog & AI Need Bundler** | `HeroAIBundler.tsx`, `ResourceCatalog.tsx`, `BundleCartDrawer.tsx` | 40 mins |
| **M3: Agreement & Visual Diff Slider** | `BorrowAgreementModal.tsx`, `VisualDiffSlider.tsx` | 35 mins |
| **M4: 10-Stage Lifecycle & Settlement** | `LifecycleTracker.tsx`, `SettlementModal.tsx` | 30 mins |
| **M5: Admin Panel & Impact Dashboard** | `AdminDashboard.tsx`, `ImpactSection.tsx`, `Navbar.tsx` | 25 mins |
| **M6: Verification & Final PR** | TypeScript check, zero errors, production build | 15 mins |

---

## 14. Appendix
- **Problem Statement Reference:** [spec/problem_statement.md](file:///c:/Web_template/spec/problem_statement.md)
- **Competitive Leverage Report:** [spec/competitor_leverage_report.md](file:///c:/Web_template/spec/competitor_leverage_report.md)
- **MVP Execution Blueprint:** [spec/mvp_execution_blueprint.md](file:///c:/Web_template/spec/mvp_execution_blueprint.md)
