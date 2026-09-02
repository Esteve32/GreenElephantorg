# MyFive + Green Elephant - Unified Refactor PRD - Master v1.7.1 - Product Experience Baseline

## 1. Authority and Scope

This is the canonical Product Requirements Document for MyFive (`myfive.greenelephant.org`) and the approved sequential refactor of the existing Green Elephant website (`greenelephant.org`) into the unified target stack.

- Canonical product spec: `docs/PRD.md`
- Human-approved decisions and implementation ledger: `docs/DECISION_LOG.md`
- Approved target stack: `SvelteKit_Svelte5_Zero_NeonPG_Drizzle_Stripe_ReplitReservedVM`
- Legacy transition baseline: `React_Vite_Express` (live continuity source during migration, not the destination)
- Current product phase: **Alpha (MVP)**
- Current refactor stage: **Refactor Stage 1 — MyFive proof of concept**
- Refactor completion target: **End of Sunday, 2026-09-06, Europe/Helsinki**

### In-scope and excluded scope

- Stripe pay gates: In scope
- Notification pacing: In scope (must be user-controlled)
- Human-led non-verbal communication enhancement: In scope
- Accessible Organic Holography design direction: In scope
- Separate Eight Lenses and Eight Loves with shared visual taxonomy: In scope
- Private user-selected eight-octant Flow calibration: In scope
- MyFive membership at €4.99/month with sponsored partner connections: In scope
- MyFive annual membership: Deferred pending separate approval
- Complete `greenelephant.org` refactor into the unified target stack: In scope after the MyFive proof gate
- Existing Green Elephant Typeform, Google, Stripe, Satellite Scan, Resend, Neon, and operational Notion workflows: Must remain operational until verified replacement
- Biometrics / camera / rPPG: Excluded
- User-facing AI mediation: Excluded

Scope clarification:

- this PRD governs both the MyFive product and the root-site refactor program
- existing Green Elephant functionality remains live unless and until a replacement passes its cutover gate
- preserving an existing integration does not approve a new data use, recipient, message, provider, price, or workflow
- MyFive email remains disabled by default under DEC-010 even while existing Green Elephant Resend automations continue

---

## 2. Product Summary

MyFive is a calm, human-led, non-verbal relationship compass that helps users maintain up to five active human connection seats plus one separate self-connection slot. It enhances private awareness and voluntary expression through user-directed visual forms rather than generating interpersonal language or interpreting another person.

The unified refactor program moves MyFive first and then the complete Green Elephant website to SvelteKit + Svelte 5 + Zero without interrupting the current website's revenue, assessment, customer, fulfilment, or communication workflows. Migration is a reversible replacement program, not a simultaneous rewrite-and-switch event.

Core principles:

- illumination, not judgment
- non-verbal expression, not automated interpretation
- human authorship, not generative mediation
- privacy by design
- low time-in-app
- user control and reversibility
- explicit consent boundaries
- accessibility and operational clarity before decorative fidelity
- explanation without diagnosis or automated emotional interpretation

### Canonical product phases

These labels describe the product and commercial lifecycle. They are distinct from the technical migration workstream steps in Section 6.

| Phase | Meaning | Entry gate | Scope rule |
|---|---|---|---|
| **Alpha** | **Now / MVP** | Current approved phase | Build, validate, and operate the smallest coherent approved MVP. |
| **Beta** | **After sales confirm the MVP** | Recorded sales evidence plus Estève's explicit phase-transition approval | Harden and evolve the sales-confirmed product within separately approved scope. |
| **Theta** | **Scaling sales** | Recorded scaling evidence plus Estève's explicit phase-transition approval | Scale sales, runtime capacity, and operations within separately approved scope and budgets. |

Exact evidence and quantitative thresholds for both transitions remain open. A phase label never approves a feature, integration, data use, spend change, or implementation item by itself.

### Canonical refactor stages

Refactor stages govern technical migration and are separate from the Alpha, Beta, and Theta product phases.

| Refactor stage | Purpose | Entry gate | Exit gate |
|---|---|---|---|
| **Refactor Stage 1 — MyFive proof of concept** | Prove the unified stack with a bounded MyFive vertical slice while the existing website remains live | DEC-015 approval | Recorded proof of SvelteKit/Svelte 5/Zero integration, Neon replication, authentication and authorization, private-vault exclusion, reconnect/redeploy behaviour, and rollback |
| **Refactor Stage 2 — Green Elephant root-site refactor** | Immediately migrate the public site, portal, admin, APIs, integrations, automations, and revenue workflows through reversible vertical slices | Stage 1 exit evidence; no planned idle interval | All in-scope surfaces have parity evidence, provider callbacks and schedulers are verified, revenue paths pass smoke tests, rollback remains available through stabilization, and legacy retirement is explicitly recorded |

Stage 2 is pre-authorized to begin immediately when Stage 1 exit evidence is recorded. This technical handoff does not move the product from Alpha to Beta, approve a new feature or data use, or authorize a spending change.

The target is to complete both stages by the end of Sunday, 2026-09-06, Europe/Helsinki. The date is a planning target, not authority to bypass safety, privacy, payment, continuity, or rollback gates. If work extends beyond the target, verified legacy surfaces remain live.

---

## 3. Functional Modules

### Module 1 - Product, Experience, and Human Settings

- onboarding and account activation
- connection seat management (5 partner seats + separate self slot)
- Connection Profile entry and review
- user-directed non-verbal Connection Profile expression and review
- settings system for privacy, pacing, and notification controls
- membership state and sponsorship views for the €4.99 monthly plan
- accessible Organic Holography presentation with stable reduced-motion and non-WebGPU fallbacks
- independent Eight-Lens and Eight-Love concepts joined only through the approved visual taxonomy

### Module 2 - Data Model, Consent, and GDPR

Primary domains:

- `users`
- `check_ins`
- `relationship_agreements`
- `consent_ledger`
- `myfive_subscriptions`
- invitation and voucher entities
- private append-only eight-Love profiles using the eight Flow octants or `Not assessed`

Core rules:

- private check-ins are structurally separated from partner-visible records
- non-verbal representations remain private unless separately and explicitly shared
- shared data requires explicit bilateral consent
- consent records are append-only and timestamped
- users can export and delete account data
- Flow states are selected by the user and are never inferred, diagnosed, ranked, or moralized
- Lens data and Love-profile data remain independently identifiable and queryable

### Module 3 - Admin Control Plane and Operations

Roles:

- Steward
- Host
- Participant

Operational requirements:

- least-privilege role separation
- break-glass support with expiration and audit trail
- kill switch for outbound integrations
- transactional communications controls

### Module 4 - Connections, Notifications, and Pacing

Required capabilities:

- user-configurable pacing and quiet hours
- optional Fibonacci pacing curves
- reversible pause/mute controls
- timezone-aware scheduling behavior

Boundaries:

- pacing must never become coercive
- pacing defaults must be safe and opt-out available

### Module 5 - Architecture, Security, and Delivery

Target architecture:

- SvelteKit + Svelte 5 UI/runtime
- Zero client-server synchronization with an authoritative server and a client-side cache
- Neon PostgreSQL + Drizzle ORM
- Stripe checkout and subscription events
- Replit Reserved VM runtime

Experience rendering constraints:

- WebGPU, particles, bloom, and advanced SVG are optional progressive enhancements
- essential journeys must work without WebGPU and with reduced motion enabled
- conventional cards, tables, grids, and boundaries are permitted when they improve accessibility, comparison, hierarchy, or operational control
- privacy, consent, payment, safety, and error-recovery controls must remain visually explicit

Zero constraints:

- do not describe Zero as local-first or promise offline writes
- use a direct, non-pooled upstream PostgreSQL connection for Zero replication; pooling decisions for other database roles remain separate
- use Zero only for explicitly approved synchronized records; never synchronize encrypted private-vault payloads
- prove the Svelte integration, permission model, reconnect/redeploy behavior, operational topology, and rollback before production cutover

Runtime cost and capacity model:

- allow a capped Replit base plan plus variable compute and usage costs
- support capacity-driven movement to a higher Replit plan as measured demand grows
- require explicit human authorization before any actual billing-plan or spending-limit change
- treat current plan details, prices, included resources, and variable rates as operational facts to verify rather than permanent product assumptions

Migration constraint:

- legacy React/Vite/Express flows remain available during transition and are retired surface by surface only after successful cutover evidence
- new net functionality should target the approved stack

### Module 6 - Root-Site Revenue and Integration Continuity

Protected continuity surfaces:

- public Green Elephant pages, SEO metadata, assessment and lead funnels
- Typeform intake and completion callbacks
- Google OAuth, Sheets, Analytics, Gmail, and other currently operating Google relationships, each with its existing scope and owner
- Stripe pay gates, checkout, payment confirmation, webhooks, subscriptions, and purchase records
- Satellite Scan discovery, purchase, Typeform intake, completion, fulfilment, portal linkage, and reminder/onboarding infrastructure
- existing Green Elephant Resend transactional and campaign automations
- supporting Neon records, operational Notion CRM synchronization, schedulers, and admin controls

Continuity rules:

- preservation covers currently operating behavior only and does not activate a proposed or unverified integration
- each provider callback, credential, scheduled job, and side effect must be inventoried before its route is migrated
- old and new handlers must not process the same billable or outbound event twice
- migration must preserve the ability to market, sell, receive payment for, fulfil, support, and maintain invoicing records for current offers
- a failed replacement returns traffic or processing to the verified legacy surface
- MyFive outbound email remains separately disabled under DEC-010

---

## 4. Requirement Registry (RTM Foundation)

Every requirement must map from user journey to implementation and verification.

| ID | Journey stage | Requirement | Module | Implementation surface | Verification |
|---|---|---|---|---|---|
| UX-001 | Onboarding | User can create/access account and start setup | M1 | auth routes + onboarding UI | e2e onboarding pass |
| UX-002 | Activation | User sees seat counter and self-slot separation | M1 | profile/seat UI + seat APIs | unit + e2e seat cap test |
| UX-003 | Core workflow | User can record Connection Profile state privately | M1/M2 | check-in UI + check-in APIs + DB | authz and privacy tests |
| UX-004 | Retention | User can control notification pacing and quiet hours | M4 | settings UI + pacing engine | settings persistence tests |
| UX-005 | Monetization | User can subscribe with Stripe and sponsor seats | M1/M5 | Stripe checkout/webhooks + sponsorship model | webhook and entitlement tests |
| UX-006 | Core workflow | User can create and review a non-verbal representation without AI-authored interpersonal language | M1/M2 | Connection Profile UI + privacy controls | privacy, authorship, and no-generative-output tests |
| UX-007 | Presentation | Organic Holography remains accessible, readable, keyboard-usable, and functional without WebGPU or motion | M1/M5 | design tokens + components + fallbacks | WCAG, keyboard, reduced-motion, and fallback review |
| UX-008 | Core workflow | User can explicitly select one of eight Flow octants or `Not assessed` for each Love dimension | M1/M2 | Connection Profile calibration UI | enum, usability, privacy, and no-inference tests |
| DAT-001 | Trust | Private and shared data are structurally isolated | M2 | schema boundaries + query guards | data-boundary test pack |
| DAT-002 | Consent | Shared agreement requires bilateral explicit consent | M2 | consent gating + ledger | consent gate integration tests |
| DAT-003 | Sovereignty | User can export account data | M2 | export pipeline | export contract tests |
| DAT-004 | Sovereignty | User can delete account with cascade wipe | M2 | deletion pipeline | deletion integrity tests |
| DAT-005 | Ontology | Eight Lenses and Eight Loves remain independent while sharing the approved visual taxonomy | M1/M2 | design tokens + separate schemas | schema independence and token mapping tests |
| PAY-001 | Monetization | Primary membership is €4.99/month and supports five sponsored partner connections; no annual plan is offered without separate approval | M1/M5 | Stripe checkout + subscription APIs + entitlement model | price, interval, sponsorship, and annual-plan absence tests |
| ADM-001 | Operations | Roles are least-privilege and enforce boundaries | M3 | RBAC and admin endpoints | role access matrix tests |
| ADM-002 | Operations | Kill switch pauses outbound integrations | M3 | control plane toggles | kill switch verification tests |
| ARC-001 | Delivery | New features are implemented on SvelteKit target stack | M5 | repo architecture + CI checks | architecture gate checklist |
| ARC-002 | Operations | Runtime capacity and cost controls can scale with measured demand | M5 | Replit deployment + billing controls | capacity, invoice, alert, and approval review |
| ARC-003 | Migration | MyFive proves the exact SvelteKit/Svelte 5/Zero/Neon/Replit topology before root-site cutover begins | M5 | MyFive proof deployment + test harness | proof record covering auth, privacy, sync, reconnect, redeploy, and rollback |
| MIG-001 | Migration | Refactor Stage 2 begins immediately after recorded Stage 1 exit evidence | M5/M6 | delivery plan + migration ledger | timestamped Stage 1 exit and Stage 2 start records |
| CON-001 | Continuity | Legacy production surfaces remain available until each replacement passes its cutover gate | M6 | routing, compatibility adapters, deployment controls | old/new parity, smoke, and rollback tests |
| CON-002 | Revenue | Existing Green Elephant purchase and fulfilment paths remain operational throughout migration | M6 | public site + Stripe + Typeform + Satellite Scan workflows | synthetic purchase-to-fulfilment test and operational reconciliation |
| CON-003 | Integrations | Existing Google, Typeform, Resend, Neon, and operational Notion workflows preserve current behavior during migration | M6 | provider adapters, callbacks, jobs, and schedulers | provider contract tests, callback verification, job health, and duplicate suppression |
| GOV-001 | Governance | Product work and release claims use the canonical Alpha, Beta, and Theta labels | M5 | PRD, decision log, roadmap, and release records | evidence-backed phase-gate review |

---

## 5. Acceptance Criteria Library (BDD)

### AC-001 Seat cap and self slot

Given a participant already has 5 active partner seats  
When the participant attempts to add a 6th partner seat  
Then the system shall reject the operation with a clear capacity message  
And the self-slot shall remain unaffected and available.

### AC-002 Private check-in isolation

Given participant A submits a private check-in  
When participant B accesses shared connection views  
Then participant B shall not see participant A private check-in content  
And admins shall not have a path to private check-in payloads.

### AC-003 Bilateral consent for sharing

Given one side has not completed ValueRules consent  
When a shared agreement sync is requested  
Then the system shall block sync  
And append a consent event explaining unmet prerequisites.

### AC-004 Stripe entitlement

Given a Stripe checkout session is completed  
When a valid webhook event is processed  
Then the subscriber entitlement shall be activated  
And sponsorship seat allocation shall become available.

### AC-005 Pacing control and opt-out

Given notification pacing is enabled  
When a user disables pacing in settings  
Then future pacing jobs shall stop  
And the user shall retain access to manual reminders only.

### AC-006 Account deletion

Given a user confirms account deletion with required confirmation steps  
When deletion is executed  
Then user-linked records shall be removed according to policy  
And subsequent authenticated fetches shall return no active account profile.

### AC-007 Human-led non-verbal expression

Given a user creates or reviews a non-verbal Connection Profile representation
When MyFive renders the representation
Then its meaning shall derive from the user's explicit input rather than automated interpretation
And MyFive shall not generate interpersonal wording or infer the partner's state
And the representation shall remain private unless the user completes a separate approved sharing flow.

### AC-008 Evidence-backed phase transition

Given MyFive is operating in its current canonical phase

When a transition to the next phase is proposed

Then the required sales or scaling evidence shall be recorded

And Estève shall explicitly approve the phase transition

And the transition shall not activate any otherwise unapproved scope.

### AC-009 Revenue continuity during migration

Given an existing Green Elephant offer can be discovered, purchased, fulfilled, or supported through the legacy runtime

When its replacement is being built or tested

Then the verified legacy path shall remain available

And Stripe, Typeform, Satellite Scan, Google, Resend, Neon, scheduler, and operational Notion side effects shall continue according to their currently approved behavior

And no customer event shall be lost or processed twice.

### AC-010 MyFive proof-to-refactor handoff

Given the Stage 1 MyFive proof satisfies its recorded exit gate

When the evidence is recorded

Then Refactor Stage 2 shall begin immediately without a planned idle interval

And the handoff shall not imply an Alpha-to-Beta transition or activate unrelated scope.

### AC-011 Reversible surface cutover

Given a legacy route, provider callback, scheduler, or workflow has a SvelteKit-target replacement

When cutover is proposed

Then contract, smoke, parity, authorization, provider-callback, duplicate-suppression, and rollback tests shall pass

And the legacy surface shall remain recoverable throughout its stabilization window

And failed validation shall return traffic or processing to the verified legacy surface.

### AC-012 Zero proof boundary

Given Zero is the selected synchronization layer

When the MyFive proof is evaluated

Then the exact Svelte integration, direct Neon replication path, permission model, private-vault exclusion, reconnect/redeploy behavior, and rollback shall be demonstrated

And the evidence shall not describe Zero as local-first, promise offline writes, or promote unverified latency and reliability claims.

### AC-013 Accessible Organic Holography

Given a MyFive journey uses Organic Holography styling

When the journey is operated with keyboard navigation, reduced motion, or without WebGPU support

Then every essential action and state shall remain readable and usable

And conventional boundaries or controls may replace decorative effects where clarity requires them.

### AC-014 Independent Lens and Love taxonomy

Given the interface uses the approved Lens/Love colour pairing

When a user creates or reviews a Connection Profile

Then the mapping shall be presented only as visual storytelling taxonomy

And all eight Love dimensions shall remain independently selectable regardless of their paired Lens.

### AC-015 Monthly membership boundary

Given a user starts MyFive primary-membership checkout

When Stripe Checkout is created

Then the recurring interval shall be monthly at €4.99

And the resulting entitlement shall support five sponsored partner connections

And no annual plan shall be offered unless a later explicit decision approves and defines it.

### AC-016 Explicit eight-octant calibration

Given a user calibrates a Love dimension

When the user selects Arousal, Flow, Control, Relaxation, Boredom, Apathy, Worry, Anxiety, or `Not assessed`

Then the selected value shall be stored as the user's private explicit input

And MyFive shall not infer, diagnose, rank, or expose the selection to a partner by default.

---

## 6. Two-Stage Sequential Refactor Plan

The current React/Vite/Express application remains the continuity runtime while replacements are built. Execute the checklist in order. Do not retire a route, callback, scheduler, integration, or revenue workflow merely because its replacement compiles.

### Refactor Stage 1 - MyFive proof of concept

#### Migration Step 1.0 - Freeze and baseline

- [ ] Record the current branch, deployment, DNS, runtime, database, provider-callback, connector, scheduler, and kill-switch configuration without exposing secrets.
- [ ] Build a route and workflow inventory for MyFive plus every shared dependency it touches.
- [ ] Establish legacy health and smoke checks before adding the parallel SvelteKit surface.
- [ ] Define the rollback command and routing switch before the first cutover attempt.

Exit criteria:

- continuity inventory is reviewable
- legacy MyFive-adjacent routes and shared production workflows have baseline evidence
- rollback is rehearsed without destructive production changes

#### Migration Step 1.1 - Parallel SvelteKit foundation

- [ ] Scaffold SvelteKit + Svelte 5 with `@sveltejs/adapter-node` alongside the live legacy runtime.
- [ ] Bind through environment-managed `PORT`, `HOST`, origin, and secrets configuration appropriate to Replit Reserved VM.
- [ ] Preserve Neon PostgreSQL as the relational source of truth through Drizzle.
- [ ] Add Zero through its low-level TypeScript API or a separately reviewed Svelte adapter; do not assume first-class Svelte support.
- [ ] Configure Zero's upstream replication connection as direct rather than pooled, while reviewing each other database role separately.
- [ ] Exclude encrypted browser-local private-vault payloads from Zero and server synchronization.

Exit criteria:

- SvelteKit build and production-style start succeed
- Zero connects to the approved test data boundary without exposing private-vault payloads
- the legacy website and revenue workflows remain unaffected

#### Migration Step 1.2 - Bounded MyFive vertical slice

- [ ] Port one complete MyFive journey through UI, authenticated API, Drizzle data access, Zero synchronization where approved, and user-visible error handling.
- [ ] Prove authentication, authorization, bilateral consent, seat boundaries, and private/shared data isolation.
- [ ] Test reconnect, redeploy, rollback, duplicate events, partial failure, and intermittent connectivity without promising offline writes.
- [ ] Record measured performance and connection behavior as evidence under DEC-036 rather than guaranteed claims.

Stage 1 exit criteria:

- the bounded MyFive journey passes functional, privacy, security, sync, deployment, and rollback tests
- exact Zero/Svelte/Neon/Replit behavior is recorded
- no regression is detected in the current Green Elephant site
- the decision log records Stage 1 completion before implementation claims advance

### Refactor Stage 2 - Green Elephant root-site refactor

Begin immediately after Stage 1 exit evidence is recorded. Use reversible vertical slices and retain the legacy implementation for each surface until that slice completes its stabilization gate.

#### Migration Step 2.0 - Immediate handoff and compatibility shell

- [ ] Start Stage 2 in the same delivery sequence as the Stage 1 acceptance record, with no planned idle interval.
- [ ] Establish SvelteKit routing and compatibility adapters that can delegate unmigrated routes to the legacy runtime.
- [ ] Freeze unscoped net-new work on legacy surfaces while permitting urgent revenue, security, legal, and reliability fixes.
- [ ] Create a per-surface ledger with owner, old route, new route, dependencies, test evidence, cutover state, and rollback state.

#### Migration Step 2.1 - Shared contracts and provider adapters

- [ ] Lock API, schema, session, webhook, job, and provider-callback contracts before moving callers.
- [ ] Introduce typed adapter boundaries for Stripe, Typeform, Resend, each Google relationship, operational Notion, and other active providers without changing current business behavior.
- [ ] Add idempotency and duplicate-suppression evidence for payment, form, email, CRM, and scheduler side effects.
- [ ] Keep callback URLs and credentials on verified legacy handlers until replacement callbacks pass provider-level tests.

#### Migration Step 2.2 - Public site and assessment funnels

- [ ] Port public pages, navigation, accessibility behavior, metadata, structured data, sitemap/robots resources, and current asset behavior.
- [ ] Port contact, newsletter, waitlist, FLOW Check, Signals Quiz, and Typeform-connected assessment journeys without changing their approved data uses.
- [ ] Verify mobile/desktop rendering, form delivery, acknowledgements, admin notifications, and analytics continuity.
- [ ] Cut over one route family at a time and retain route-level rollback.

#### Migration Step 2.3 - Stripe pay gates and paid-offer continuity

- [ ] Port checkout initiation, pay gates, pricing configuration, coupon behavior, purchase records, Stripe webhooks, and reconciliation paths.
- [ ] Preserve existing MyFive billing plus Green Elephant Satellite Scan and other currently sellable offers.
- [ ] Run test-mode purchase-to-entitlement and purchase-to-fulfilment checks before changing production routing.
- [ ] Verify successful payment, failed payment, duplicate webhook, delayed webhook, refund/cancellation where currently supported, and rollback behavior.

#### Migration Step 2.4 - Satellite Scan and automation continuity

- [ ] Port the Satellite Scan purchase, Typeform intake/completion, result-processing, portal-linkage, and fulfilment chain.
- [ ] Preserve Google Sheets/source-data access, operational Notion CRM synchronization, and existing Resend instructions, completion messages, reminders, onboarding sequences, and admin notifications.
- [ ] Preserve scheduler timing and state while preventing old and new schedulers from sending the same message twice.
- [ ] Reconcile a synthetic end-to-end scan journey and its records across Stripe, Typeform, Neon, Notion, Google dependencies, Resend, and the portal.

#### Migration Step 2.5 - Portal, identity, admin, and remaining Google surfaces

- [ ] Port portal sessions, password flows, Google OAuth, linked scan history, export/deletion behavior, and user-scoped integrations.
- [ ] Port admin authentication, role enforcement, integration controls, campaign controls, analytics, and operational dashboards.
- [ ] Inventory and verify Google OAuth, Sheets, Analytics, Gmail, Fonts, and documented Slides dependencies separately; do not treat “Google” as one credential or scope.
- [ ] Verify least privilege, cross-user isolation, callback origins, token handling, and break-glass audit behavior.

#### Migration Step 2.6 - Stabilization and legacy retirement

- [ ] Run production smoke checks for public discovery, forms, login, checkout, Satellite Scan fulfilment, email automation, portal, and admin operations.
- [ ] Monitor errors, latency, webhook backlog, scheduler health, email duplicates, payment reconciliation, and provider failures through the stabilization window.
- [ ] Retire React/Vite/Express routes, jobs, and components only after their surface ledger is complete and rollback evidence remains available.
- [ ] Remove Astro configuration only if found and verified unused or fully replaced.
- [ ] Update runbooks, architecture diagrams, integration inventory, and the decision-log implementation evidence.

Stage 2 exit criteria:

- all in-scope root-site surfaces have recorded functional and provider parity
- existing revenue and Satellite Scan workflows remain operational and reconciled
- legacy retirement has been recorded explicitly rather than inferred from build completion
- documentation, tests, operational ownership, and rollback/runbooks match the final runtime
- missed schedule targets leave verified legacy surfaces running rather than forcing an unsafe cutover

---

## 7. NFR and Operations Controls

### Performance and reliability

The following numeric values are validation targets under DEC-036, not verified guarantees or automatic release blockers:

- P95 app navigation response target: <= 200ms
- P95 critical API target: <= 150ms (excluding third-party provider latency)
- webhook processing reliability target: >= 99.5% successful reconciliation
- export/deletion job success target: >= 99.0% over rolling 30 days

### Availability and resilience

- service availability target: >= 99.9% monthly
- explicit rollback procedures for failed releases
- incident severity model with response/runbook ownership
- route-level rollback while old and new application surfaces coexist
- no forced cutover to satisfy the Sunday target when continuity gates have not passed

### Revenue and provider continuity

- preserve public offer discovery, checkout, payment, fulfilment, support, and invoicing records during migration
- keep Stripe, Typeform, Satellite Scan, Google, Resend, Neon, operational Notion, and scheduler health visible during every cutover
- require provider-level callback verification before changing production endpoints
- prevent duplicate payments, form processing, CRM updates, entitlements, fulfilment actions, and emails across old/new handlers
- reconcile billable and outbound events after each revenue-affecting cutover

### Capacity and cost governance

- the capped Replit base plan is not a fixed all-in infrastructure ceiling
- variable compute and usage charges are permitted and must be observable
- define capacity, reliability, and unit-economic signals for reviewing a move to the next plan
- align deliberate sales and capacity scaling with the Theta phase while retaining separate budget approval
- configure billing visibility and alerts, and reconcile actual charges against usage
- require explicit human authorization before changing the billing plan or spending limit; do not upgrade automatically
- verify current plan terms and prices from authoritative account evidence rather than embedding historical amounts as permanent requirements

### Security and privacy

- no plaintext secrets in repo or logs
- least-privilege access on admin endpoints
- immutable consent and audit records for governed events
- explicit prohibition of camera and user-facing AI mediation features

### Observability

- structured logs for auth, consent, subscription, pacing, and deletion flows
- release health dashboard with error rate, latency, webhook backlog, and queue depth
- audit event taxonomy for compliance-critical actions

---

## 8. Edge Cases and Failure States

- payment success without webhook confirmation
- webhook duplicates and out-of-order delivery
- invitation expiry and reuse attempts
- seat allocation race conditions
- connection loss or intermittent sync, with no promise of Zero offline writes
- timezone drift and quiet-hour boundary crossing
- consent revocation after prior sharing
- export/deletion retries after partial failure
- base-plan capacity exhaustion or an unexpected variable-compute cost spike
- old and new handlers both receiving the same Stripe or Typeform event
- scheduler overlap causing duplicate Satellite Scan or onboarding email
- provider callback still targeting a retired legacy route
- a root-site slice failing after partial traffic cutover
- Sunday target reached before required parity or rollback evidence exists

Each edge case must have:

- deterministic system behavior
- user-facing message
- retry/rollback policy
- test coverage

---

## 9. Research Backlog and Deep-Search Prompt

Use targeted research to close unresolved architecture and delivery risks; do not expand scope beyond approved decisions.

### Priority research themes

- Zero + Neon deployment patterns on always-on runtimes
- low-level Zero integration patterns for Svelte 5 and explicit limits around offline behavior
- Stripe entitlement reconciliation patterns and failure handling
- parallel-handler idempotency for Stripe, Typeform, Resend, CRM, and scheduler migration
- revenue-safe strangler-pattern migration from React/Express to SvelteKit
- notification pacing UX safety patterns (user control, anti-coercion)
- data sovereignty implementation patterns for export/deletion
- SvelteKit migration playbooks from React/Express legacy systems

### Gemini deep-search prompt (copy/paste)

```text
You are a principal product and architecture research analyst. Produce a fact-grounded research brief for the MyFive and Green Elephant unified refactor with strict scope constraints.

Context and non-negotiable constraints:
- Product: privacy-first relationship SaaS.
- Stack target: SvelteKit + Svelte 5 + Zero + Neon PostgreSQL + Drizzle + Stripe + Replit Reserved VM.
- Legacy baseline to refactor: the live React + Vite + Express Green Elephant website.
- Refactor sequence: MyFive proof of concept, then immediate root-site refactor through reversible vertical slices.
- Continuity requirement: preserve existing Typeform, Google, Stripe, Satellite Scan, Resend, Neon, operational Notion, portal, admin, and scheduler workflows until verified replacement.
- In scope: full root-site refactor, Stripe pay gates, sponsorship seats, notification pacing with user controls.
- Out of scope: biometrics/camera/rPPG, user-facing AI mediation.

Deliverables:
1) Evidence table with source URL, date, claim, confidence, and direct relevance to one of these categories:
   A) Architecture and migration
   B) Stripe reliability and reconciliation
   C) Privacy and consent boundaries
   D) Notification pacing safety UX
   E) Operational readiness and observability
2) "What this changes in PRD v1.7" section with concrete requirement deltas (shall statements).
3) Risk register with severity, likelihood, mitigation, owner role, and validation test.
4) Implementation checklist for next 2 sprints, each item mapped to IDs: UX-, DAT-, ADM-, ARC-.

Quality bar:
- No speculative claims without sources.
- Prefer official docs, engineering handbooks, and production postmortems.
- Mark unresolved or conflicting claims explicitly.
- Keep recommendations within approved scope constraints.
```

---

## 10. Notion Synchronization Guidance (Operational)

Recommended pattern: GitHub as source of truth, Notion as mirror.

### Option A (manual but robust)

1. Keep canonical PRD in `docs/PRD.md`.
2. Create a Notion page "MyFive + Green Elephant Unified Refactor PRD (Mirror)".
3. On each release, copy rendered Markdown into that page.
4. Add top metadata block:
   - PRD version
   - commit SHA
   - sync timestamp
   - synced by

### Option B (automated sync, preferred)

1. Create a Notion integration and share the target page/database with it.
2. Store `NOTION_TOKEN` and `NOTION_PAGE_ID` as GitHub Actions secrets.
3. Add workflow trigger on changes to `docs/PRD.md`.
4. Workflow steps:
   - checkout repo
   - convert Markdown to Notion block payload
   - replace page content atomically
   - append sync metadata (version, SHA, timestamp)
5. Add failure alert in Actions if sync fails.

Definition of done for sync:

- Notion page content matches latest `docs/PRD.md`
- page shows source commit SHA and sync timestamp
- sync operation is reproducible from CI logs

---

## 11. Open Items

- define the quantitative sales evidence for Alpha-to-Beta and Beta-to-Theta transitions
- record the exact Stage 1 MyFive proof journey and its test-data boundary
- inventory every production callback, scheduler, connector identity, Google scope, and revenue workflow before its migration slice
- confirm the exact clock-time intended by "Sunday night"; the current canonical target is end of day 2026-09-06 in Europe/Helsinki
- define the per-surface stabilization window and production rollback mechanism
- decide whether and when to approve the deferred €48/year MyFive membership, including billing and entitlement behavior
- confirm whether any missing follow-on book section still needs inclusion
- complete full RTM expansion for all active requirement IDs
- attach automated tests to each acceptance criterion in the delivery backlog
