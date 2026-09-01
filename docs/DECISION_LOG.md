# 💞 MyFive — Approved Product Decision Log v11.2.5 (Δ Update) — Drift-Safe / Canonical Source

This log represents the official v11.2 Delta (Δ) Update to the MyFive Approved Product Decision Log, acting as the primary record of human-approved decisions and explicit scope boundaries within the `GreenElephantorg` repository [Approved Product Decision Log].

All specifications are mapped against the canonical baseline of Decision Log v10.0 and v11.0, establishing clear scope boundaries and aligning feature extensions with the existing `GreenElephantorg` codebase architecture [Approved Product Decision Log].

---

## 🧭 Authority & Repository Integration

*   **Canonical Source of Truth:** This log is stored directly within the repository at `docs/DECISION_LOG.md` as the canonical record of human-approved decisions for MyFive and the `GreenElephantorg` platform.
*   **Document Version:** `11.2.5`
*   **Last Updated:** `2026-09-01T13:38:52+03:00`
*   **Enforcement Rule:** Any capability or integration not explicitly marked as approved in Section 2 or in active Delta updates is formally prohibited from implementation [Approved Product Decision Log].
*   **Integrated Stack Contract:** MyFive is developed as an extension and architectural upgrade of the `GreenElephantorg` platform, adhering to the stack contract:
    `approved_stack = "React_Vite_Express_NeonPG_Drizzle_Stripe_ReplitVM"` [Approved Product Decision Log].

### Canonical Versioning & Audit Protocol

1. Human approval remains mandatory for product decisions. Automation may record an approved change, but must never infer approval or create scope.
2. Every approved decision or implementation-status change must update the document version, the timezone-qualified ISO 8601 timestamp, and the append-only ledger below in the same commit.
3. Use `npm run decision:record -- --summary "Approved change" --approved-by "Name"`. The command increments the patch revision and records the local timestamp automatically. Use `--level minor` for an approved scope delta and `--level major` for a new decision-log baseline.
4. Git history is the immutable record of the exact content change; this ledger is its human-readable audit index. Never rewrite or delete ledger rows. Corrections require a new row.

| Version | Recorded at | Approved by | Change summary |
| :--- | :--- | :--- | :--- |
<!-- DECISION_LEDGER_ROWS -->
| 11.2.5 | 2026-09-01T13:38:52+03:00 | Estève | Added implementation evidence index linking completed work to commits and migrations |
| 11.2.4 | 2026-09-01T13:35:20+03:00 | Estève | Completed Stage 3.2 with secure partner invitations and sponsored seat entitlements |
| 11.2.3 | 2026-09-01T12:57:44+03:00 | Estève | Completed Stage 3.1 with recurring MyFive Stripe Checkout and durable entitlements |
| 11.2.2 | 2026-08-31T17:55:07+03:00 | Estève | Completed Stage 2.4 five-seat cap and hardened Stage 2.3 slot authorization |
| 11.2.1 | 2026-08-31T02:52:13+03:00 | Estève | Renamed the user-facing experience to Connection Profile and approved a more fluid Organic Holography presentation |
| 11.2.0 | 2026-08-31T02:42:37+03:00 | Estève | Approved and implemented eight-dimensional Greek-love profiles using private append-only Flow-octant snapshots |
| 11.1.8 | 2026-08-31T02:27:24+03:00 | Estève | Corrected Stage 2 database rollout with a non-destructive MyFive-only brownfield migration |
| 11.1.7 | 2026-08-31T02:20:12+03:00 | Estève | Completed Stage 2.3 with durable append-only consent receipts and timestamped living-agreement versions |
| 11.1.6 | 2026-08-31T02:10:46+03:00 | Estève | Marked Stage 1 complete and completed Stage 2.2 with individually validated nine-ValueRules consent gating |
| 11.1.5 | 2026-08-31T02:03:30+03:00 | Estève | Completed Stage 2.1 with AES-256-GCM encrypted browser-local check-in vault storage |
| 11.1.4 | 2026-08-31T01:57:25+03:00 | Estève | Completed Stage 1.3 with accessible token-driven fluid Venn aura spheres for partner connections |
| 11.1.3 | 2026-08-31T01:54:33+03:00 | Estève | Completed Stage 1.2 with the approved eight-lens and eight-love synesthetic token map |
| 11.1.2 | 2026-08-31T01:36:03+03:00 | Estève | Approved canonical version and timestamp automation, Stage 1.1 completion, and progression to Stage 1.2 |
| 11.1.1 | 2026-08-31T01:34:00+03:00 | Estève | Established canonical automated version/timestamp logging and recorded Stage 1.1 implementation status. |

---

## ✅ Approved Scope Deltas

### DEC-037 (Δ) — Eight-Dimensional Greek-Love Flow Profiles — APPROVED & IN SCOPE
*   **Status:** **APPROVED & IN SCOPE**
*   **Owner:** Estève
*   **Basis:** Explicit human clarification that Greek love types are simultaneous relationship dimensions, not mutually exclusive labels or direct numeric scores.
*   **Rule:** Every partner connection and the Philautia self-connection shall support independent calibration across Agape, Mania, Eros, Ludus, Pragma, Storge, Philia, and Philautia. Each dimension uses one of the eight Flow octants—Arousal, Flow, Control, Relaxation, Boredom, Apathy, Worry, or Anxiety—or remains explicitly `Not assessed`.
*   **Interface:** The user-facing name is **Connection Profile** (“Your Connection Profile with [person]” or “Your Self-Connection Profile”). Use a square skill–challenge field divided from its centre into eight triangular sectors, surrounded by fluid Organic Holography styling. Do not reduce the canonical profile to a grid of boxes or a moralized numeric score.
*   **Privacy and history:** Store each user's calibration as private, append-only, timestamped snapshots. Never infer a partner's profile.
*   **Token boundary:** The approved one-to-one GBR lens/love colour map remains visual taxonomy only and does not constrain a connection's love composition.

### DEC-033 (Δ) — Programmatic Stripe SaaS Billing & Pay Gates — APPROVED & IN SCOPE
*   **Status:** **APPROVED & IN SCOPE (v11.1 Delta)**
*   **Owner:** Estève
*   **Basis:** Human decision update for v11.1. Since the `GreenElephantorg` codebase already possesses active Stripe client integration (`@stripe/stripe-js`, `@stripe/react-stripe-js`) and payment infrastructure, integrating Stripe Pay Gates and B2C membership tiers is formally APPROVED for the MyFive extension.
*   **Rule:** The MyFive extension shall utilize the existing Stripe payment infrastructure within `GreenElephantorg` to enforce subscription pay gates (€4.99/mo membership), partner sponsorship seat allocations, and B2B EAP voucher redemptions.
*   **Implementation Guidelines:**
    *   Integrate Stripe checkout routes into the Express server (`server/routes/stripe.ts` or `server/routes/myfive.ts`).
    *   Maintain sponsorship mapping in Drizzle schemas (`shared/schema.ts`) so primary subscribers can sponsor 5 connection seats for partners without partner checkout friction.
    *   Isolate payment metadata from private check-in reflections, strictly maintaining GDPR Article 6/13 data separation.

---

## 🧊 MVP Exclusions / Quarantines

To ensure complete compliance and eliminate "AI autopilot" development creep, the system enforces the following isolated quarantine cards [Approved Product Decision Log]:

### DEC-032 (Δ) — Somatic Biometrics & rPPG Camera Quarantine
*   **Status:** DEFERRED
*   **Owner:** Estève
*   **Basis:** MVP scope boundary derived from DEC-014 (brutal constraint) + lack of explicit human approval in Decision Log v10.0.
*   **Rule:** The application codebase must contain zero camera access routes, browser `getUserMedia` calls, webcam frame captures, or WebAssembly biometrics pipelines during the MVP phase [Approved Product Decision Log].
*   **MVP impact:** Excluded from MVP
*   **Guardrail:** If a developer or automated agent attempts to compile camera permission handlers or face-scanning code, STOP development immediately and require Estève's explicit written approval.

### DEC-034 (Δ) — Fibonacci & Celestial Notification Pacing Quarantine
*   **Status:** DEFERRED
*   **Owner:** Estève
*   **Basis:** MVP scope boundary derived from DEC-014 (brutal constraint).
*   **Rule:** Background schedulers, automated notification loops, expanding/contracting Fibonacci day/hour pacing loops, and external space weather API integrations are completely disabled in the MVP codebase [Approved Product Decision Log].
*   **MVP impact:** Excluded from MVP

### DEC-035 (Δ) — User-Facing AI Mediation Quarantine
*   **Status:** DEFERRED
*   **Owner:** Estève
*   **Basis:** Explicit human ban under DEC-012: `"Explicitly refuse Generative AI for interpersonal communication or automated dialogue mediation."` [Approved Product Decision Log].
*   **Rule:** The system must strictly exclude any generative AI models, chatbot endpoints, or automated mediation interfaces from the user-facing application [Approved Product Decision Log].
*   **MVP impact:** Excluded from MVP

### DEC-036 (Δ) — Technical Performance & Price Metrics Quarantine
*   **Status:** VERIFY
*   **Owner:** Estève
*   **Rule:** Hard numeric performance benchmarks are treated as unverified engineering targets rather than active blocking compliance requirements.

---

## ⚠️ Active Alignment Summary

| Topic Area | Active Alignment & Scope Rule | Strategic Rationale |
| :--- | :--- | :--- |
| **SaaS Billing & Pay Gates** | **IN SCOPE**: Uses existing `GreenElephantorg` Stripe SDK and Express payment endpoints for €4.99/mo membership and pay gates. | Reuses existing production-tested Stripe setup on `greenelephant.org` to capture subscription value seamlessly. |
| **Biometric Webcam** | **EXCLUDED**: Camera access and biometrics are strictly disabled in MVP. No camera triggers compiled. | Eliminates GDPR Article 9 special-category data liabilities. |
| **User-Facing AI** | **EXCLUDED**: AI interpersonal dialogue mediation is strictly banned (DEC-012). Backend developer tools allowed. | Preserves human emotional craftsmanship and authenticity. |
| **Notification Pacing** | **OPTIONAL**: All notification pacing is a client-side settings toggle. | Enforces Nielsen Usability Heuristic #3 (User Control & Freedom). |

---

## 🚦 Stage-Gated Implementation Checklist (Done vs. To-Do)

### Stage 0: Repository & Scaffolding (COMPLETED)
- [x] **0.1** Clone & set up `GreenElephantorg` workspace.
- [x] **0.2** Establish `docs/PRD.md` (v1.4.0) and `docs/DECISION_LOG.md` (v11.1) in repository.
- [x] **0.3** Scaffold `/myfive` extension pages in `client/src/pages/myfive/`.
- [x] **0.4** Mount Express API router `/api/myfive` in `server/routes/myfive.ts`.
- [x] **0.5** Add MyFive Drizzle schema tables in `shared/schema.ts`.
- [x] **0.6** Replit server verification & Hello World route test.

### Stage 1: Organic Holography Design System & Tokens (COMPLETED)
- [x] **1.1** Implement dark obsidian (`#0B0F19`) theme & glassmorphic HUD CSS variables (`backdrop-blur-md`, bioluminescent edge glows).
- [x] **1.2** Codify 8-Lens GBR synesthetic color tokens (Agape Crimson `#D6133A` through Philautia Deep Indigo `#3A175B`).
- [x] **1.3** Create overlapping fluid Venn aura-sphere components for partner connection matches.

### Stage 2: Core Intimacy Features & Consent Gates (COMPLETED)
- [x] **2.1** Connect Csikszentmihalyi’s 8-Octant flow check-in interface to encrypted local vault storage.
- [x] **2.2** Implement unskippable 9 ValueRules™ Consent Gate overlay for dyadic shared views.
- [x] **2.3** Build living relationship agreement editor with versioning and timestamping, backed by append-only agreement versions and consent receipts.
- [x] **2.4** Hard-cap active partner connection seats to 5 (+1 Philautia self-vault), enforced by database constraints and serialized server-side allocation.

### Stage 3: Stripe Pay Gates & Sponsorship
- [x] **3.1** Integrate Stripe Checkout for €4.99/month primary subscription, with webhook-backed entitlement persistence and account-bound return verification.
- [x] **3.2** Implement 5-seat partner invitation & free sponsorship mapping flow (`myfiveSubscriptions`) using expiring, hashed, single-use invitation links and authenticated email-bound acceptance.
- [ ] **3.3** Add B2B EAP voucher redemption interface (with strict employee privacy isolation).

### Stage 4: Data Sovereignty & GDPR Compliance
- [ ] **4.1** Implement GDPR Article 17 hard cascade account wipe API & button.
- [ ] **4.2** Implement GDPR Article 20 JSON/Markdown data export engine with privacy headers.
- [ ] **4.3** Audit check-in queries to ensure 100% blind vault isolation from partner views & admins.

### Stage 5: Production Polish & Deployment Verification
- [ ] **5.1** WCAG AA contrast & accessibility audit on organic HUD.
- [ ] **5.2** Performance check (latency under 50ms for HUD interactions).
- [ ] **5.3** Final Replit production deployment and DNS verification.

---

## 🔎 Implementation Evidence Index

This index links completed checklist work to the immutable Git evidence. It records implementation progress only and does not create or expand approved product scope.

| Stage / scope | Decision-log version | Implementation commit(s) | Database migration evidence |
| :--- | :--- | :--- | :--- |
| Stage 0 — repository, PRD, checklist, and MyFive scaffolding | 11.1 baseline | `ee7feb8`, `17cc6cd`, `eba1c0e` | Initial Drizzle schema in `shared/schema.ts` |
| Stage 1.1 — Organic Holography foundation | 11.1.2 | `b85a74a` | Not applicable |
| Stages 1.2–1.3 — synesthetic tokens and aura spheres | 11.1.3–11.1.4 | `d26a6f0` | Not applicable |
| Stages 2.1–2.2 — encrypted check-ins and ValueRules™ consent | 11.1.5–11.1.6 | `a1930f5` | `20260831_myfive_agreement_history.sql` |
| Stage 2.3 — append-only agreements and consent receipts | 11.1.7–11.1.8 | `6aae6c4`, `8ddf31c` | `20260831_myfive_agreement_history.sql` |
| DEC-037 extension — private eight-dimensional Connection Profiles | 11.2.0–11.2.1 | `4c6743f`, `e076fdf` | `20260831_myfive_love_flow_profiles.sql` |
| Stage 2.4 — enforced five partner seats plus self-vault | 11.2.2 | `6c3cc76` | `20260831_myfive_connection_seat_cap.sql` |
| Stage 3.1 — recurring Stripe Checkout and entitlements | 11.2.3 | `ae0c0da` | Uses `myfive_subscriptions` from the brownfield migration |
| Stage 3.2 — sponsored partner invitation flow | 11.2.4 | `eca696f` | `20260901_myfive_sponsored_invitations.sql` |

---

## ✅ Build-Start Checklist

*   [x] Stripe pay gates integrated into existing `GreenElephantorg` checkout pipeline.
*   [ ] Run dynamic code scan on `/client` to ensure zero instances of `getUserMedia` or camera permission requests are compiled.
*   [ ] Confirm all outbound email sending is disabled by default (test mode / kill switch ON) until explicitly approved.
*   [ ] Ensure Google Client ID matches validated credentials on the active Google Cloud Console profile.
*   [ ] Confirm zero plaintext credentials, passwords, or tokens exist in active codebases.
