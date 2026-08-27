# Tech Stack PRD — CampusCircular

> Note: Product scope, users, and behavior are covered in the separate Product PRD (`spec/product_prd_campus_circular.md`). This document is scoped to the technical implementation stack only. Every entry below demonstrates why the chosen tool outperforms alternatives under 5-hour hackathon constraints.

---

## 1. Overview
- **Project Name:** CampusCircular — Frontend Web Platform
- **Owner:** Pratik & Engineering Team
- **Date:** 2026-08-27
- **Status:** Approved (Pre-Execution)
- **What's being built (1 line):** A high-velocity, 100% frontend client-side web application with reactive state persistence, interactive image comparison canvas, and simulated AI intent bundling.

---

## 2. Selection Criteria
Score every decision against these parameters:
- **Performance & Cold-Start:** Sub-second HMR dev server and <1s production bundle build time.
- **Competition Rule Compliance:** Strict 100% frontend constraint (no live external backend required by judges).
- **Maturity & Stability:** Actively maintained stable versions from official registries; zero deprecated APIs.
- **Ecosystem Fit:** Seamless interop between React 19, Tailwind CSS v4, Lucide icons, and TypeScript.
- **Demo Reliability:** Zero external network failure points (offline-first state via localStorage).

---

## 3. Research Checklist
- [x] Identified 2–3 real alternatives for every layer (e.g. Next.js vs Vite, Zustand vs Custom Hook + LocalStorage, Tailwind v3 vs v4).
- [x] Checked current stable versions from official package registries.
- [x] Confirmed zero deprecation warnings and verified build succeeds in <1 second.
- [x] Confirmed license compatibility (MIT/Apache 2.0).
- [x] Confirmed packages are installed from official npm registry.

---

## 4. Language & Runtime
| Component | Alternatives Evaluated | Decision | Exact Version | Why | Source |
|---|---|---|---|---|---|
| Language | JavaScript vs TypeScript | **TypeScript** | `~6.0.2` (strict mode) | Catches state/property bugs at compile time; eliminates undefined errors in fast judging demos. | [typescriptlang.org](https://www.typescriptlang.org) |
| Runtime Environment | Node.js vs Bun vs Deno | **Node.js** | `v24.13.1` (Active LTS) | Pre-installed, battle-tested across Windows/macOS, zero compatibility glitches with Vite 8. | [nodejs.org](https://nodejs.org) |

---

## 5. Package / Dependency Manager
| Tool | Alternatives Evaluated | Decision | Exact Version | Why | Source |
|---|---|---|---|---|---|
| Package Manager | npm vs pnpm vs yarn | **npm** | `11.8.0` | Default bundled with Node 24, instant lockfile resolution (`package-lock.json`), zero extra global tooling required. | [npmjs.com](https://npmjs.com) |

---

## 6. Core Dependencies & Libraries
| Package | Purpose | Exact Version | Official Source Link | Alternatives Considered | Why Chosen |
|---|---|---|---|---|---|
| **react** / **react-dom** | Declarative Component UI | `^19.2.8` | [npmjs.com/package/react](https://www.npmjs.com/package/react) | Vue 3, Svelte 5, Solid.js | React 19 provides instant JSX composition, extensive ecosystem, and high developer familiarity. |
| **@tailwindcss/vite** + **tailwindcss** | Utility-First Styling Engine | `^4.3.3` | [tailwindcss.com](https://tailwindcss.com) | Tailwind v3, CSS Modules, Styled Components | Tailwind v4 uses Rust-based engine (Lightning CSS); zero config file required, instant build time, 5x faster compilation. |
| **lucide-react** | Modern UI Iconography | `^1.34.0` | [lucide.dev](https://lucide.dev) | Heroicons, FontAwesome, React Icons | Over 1,000 tree-shakable clean icons, tiny bundle footprint, full TypeScript typing. |
| **clsx** + **tailwind-merge** | Dynamic CSS Class Merging | `clsx ^2.1.1`, `tailwind-merge ^3.6.0` | [npmjs.com/package/tailwind-merge](https://www.npmjs.com/package/tailwind-merge) | Manual template literals | Prevents Tailwind class precedence bugs when overriding utility classes dynamically. |
| **pocketbase** (Standby Client) | Backend SDK Reference | `^0.28.0` | [pocketbase.io](https://pocketbase.io) | Supabase, Firebase, Appwrite | Lightweight typed client for future backend sync if judges request external persistence. |

---

## 7. Dev Tooling
| Category | Tool | Exact Version | Why |
|---|---|---|---|
| **Bundler / Dev Server** | **Vite** | `^8.2.2` | Native ESM dev server, instant Hot Module Replacement (<50ms HMR), production build in <1000ms. |
| **React Compiler Plugin** | **@vitejs/plugin-react** | `^6.1.0` | Official Fast Refresh plugin for React in Vite. |
| **Linter** | **oxlint** | `^1.79.0` | Rust-based linter; runs in 15ms, 50x faster than legacy ESLint for instant pre-commit checks. |
| **Type Checker** | **tsc** | `~6.0.2` | Runs `tsc -b` to enforce 100% type safety during production builds. |

---

## 8. Infra & Runtime Environment
- **Target OS:** Windows 11 (Development) / Cross-platform modern browsers (Chrome, Edge, Safari, Firefox).
- **Hosting Target:** Vercel (1-click deploy) / Local Preview (`http://localhost:5173`).
- **State Storage:** HTML5 `localStorage` with reactive React hook wrapper (`useCampusStore.ts`).
- **Environment Management:** Client-safe environment variables via Vite (`import.meta.env`).

---

## 9. Version Pinning & Update Policy
- **Lockfile Strategy:** Strict `package-lock.json` lockfile ensures reproducible builds across any machine.
- **Update Policy:** Strict freeze during the 5-hour hackathon sprint. Zero unvetted package updates during the active clock.

---

## 10. Alternatives Rejected (Decision Log)
| Considered | Rejected Because |
|---|---|
| **Next.js (App Router)** | Overkill for a 5-hour frontend competition. SSR adds unnecessary hydration latency, complex router routing, and slower local compilation compared to Vite. |
| **Zustand / Redux Toolkit** | Unnecessary external dependency overhead for an app whose state can be cleanly managed via a typed React Context / custom hook backed by `localStorage`. |
| **External Cloud Database (Supabase/Firebase)** | Competition rules explicitly state: *"This is a frontend-only competition. No backend or database is required."* Relying on cloud APIs risks venue Wi-Fi failure during judging. |
| **Three.js / WebGL 3D Canvas** | Heavy, risk of shader crashes on low-end laptops, and takes hours to model. 2D Canvas split-slider and image scrubbing provides 100% reliability and identical visual impact. |

---

## 11. Open Questions / Risks
- **Risk:** LocalStorage quota exceeded if image base64 strings are stored directly.
  - *Resolution:* Store image URLs (CDN/Unsplash/public assets) in localStorage; never store raw base64 binary strings.
- **Risk:** Stale state between browser sessions.
  - *Resolution:* Provide a prominent *"Reset to Default Demo State"* button in the top navbar.

---

## 12. Research Log
| Date Checked | Source | What It Confirmed |
|---|---|---|
| 2026-08-27 | Official npm registry | Confirmed React `19.2.8`, Tailwind `@tailwindcss/vite ^4.3.3`, and Vite `^8.2.2` are stable and interoperable. |
| 2026-08-27 | Vite production build | Ran `npm run build` locally in `frontend/`; confirmed 0 errors and 967ms build time. |
