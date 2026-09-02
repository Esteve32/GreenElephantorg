# 💞 MyFive — Approved Product Decision Log v11.3.0 (Δ Update) — Drift-Safe / Canonical Source

This log represents the official v11.3 Delta (Δ) Update to the MyFive Approved Product Decision Log, acting as the primary record of human-approved decisions and explicit scope boundaries within the `GreenElephantorg` repository [Approved Product Decision Log].

All specifications are mapped against the canonical baseline of Decision Log v10.0 and v11.0, establishing clear scope boundaries and aligning feature extensions with the approved MyFive target architecture and migration path [Approved Product Decision Log].

---

## 🧭 Authority & Repository Integration

*   **Canonical Source of Truth:** This log is stored directly within the repository at `docs/DECISION_LOG.md` as the canonical record of human-approved decisions for MyFive and the `GreenElephantorg` platform.
*   **Document Version:** `11.3.0`
*   **Last Updated:** `2026-09-02T21:40:17+03:00`
*   **Enforcement Rule:** Any capability or integration not explicitly marked as approved in Section 2 or in active Delta updates is formally prohibited from implementation [Approved Product Decision Log].
*   **Integrated Stack Contract:** MyFive is developed as an extension and architectural upgrade of the `GreenElephantorg` platform, adhering to the stack contract:
    `approved_stack = "SvelteKit_Svelte5_Zero_NeonPG_Drizzle_Stripe_ReplitReservedVM"` [Approved Product Decision Log].
*   **Legacy Stack Clarification:** `React_Vite_Express` is the live continuity baseline to be refactored through DEC-015's sequential program. It remains operational surface by surface until verified replacement; new architecture decisions and PRD rebuilds must target the approved SvelteKit stack above.

### Canonical Versioning & Audit Protocol

1. Human approval remains mandatory for product decisions. Automation may record an approved change, but must never infer approval or create scope.
2. Every approved decision or implementation-status change must update the document version, the timezone-qualified ISO 8601 timestamp, and the append-only ledger below in the same commit.
3. Use `npm run decision:record -- --summary "Approved change" --approved-by "Name"`. The command increments the patch revision and records the local timestamp automatically. Use `--level minor` for an approved scope delta and `--level major` for a new decision-log baseline.
4. Git history is the immutable record of the exact content change; this ledger is its human-readable audit index. Never rewrite or delete ledger rows. Corrections require a new row.
5. Each numbered implementation item (for example, 3.3, 4.1, or 4.2) is a separate delivery unit. Complete and verify the item, update this decision log and evidence index, commit the implementation and log together, then push that commit to GitHub before beginning the next numbered item.
6. Use GPT-5.6 Sol with High reasoning for GDPR, privacy, security, payment, database, and migration work. Before Stage 4.3 begins, pause and prompt Estève to switch to GPT-5.6 Sol with Extra High reasoning for the privacy-isolation audit.

### Historical Baseline Consolidation Policy — APPROVED

*   **Approved approach:** Evidence-first consolidation.
*   **Historical treatment:** Decision Log v10 is a historical baseline under revalidation, not a wholesale source of newly approved decisions.
*   **Current authority:** Existing active deltas and exclusions in this canonical log remain in force while the historical baseline is reviewed.
*   **Approval boundary:** The labels contained in historical source documents do not, by themselves, establish current approval. DEC-001 through DEC-031 must be revalidated in small thematic batches, and only Estève's explicit approval may activate or reaffirm them in this canonical log.
*   **Conflict handling:** Preserve provenance and historical wording, but classify duplicates, superseded entries, exclusions, deferrals, proposals, research, and uncertain approval claims explicitly. Later approved deltas override conflicting historical wording.
*   **Scope effect:** This policy governs consolidation only. It does not approve, reject, defer, or otherwise change the product scope of any individual historical decision.

### Workshop Handover Checkpoint — 2026-09-02

*   **Completed:** The historical decision-log inventory and evidence-first consolidation policy are recorded. DEC-001 through DEC-006 have been explicitly revalidated as active baseline decisions.
*   **Next decision:** DEC-007 — canonical relational database foundation. No option has been approved for DEC-007 in the current workshop.
*   **Remaining historical review:** DEC-008 through DEC-031 remain pending evidence-first revalidation in small, ADHD-friendly steps.
*   **Presentation format:** Show each decision with parallel 🧠 plain-language and 🛠️ canonical/technical wording. Present large, scroll-friendly 🅰️ A, 🅱️ B, and 🅲 C option headings, followed by a clear recommendation and approval box.
*   **Approval safety:** This checkpoint records workshop progress only. It does not imply approval of DEC-007 or any later historical decision.

| Version | Recorded at | Approved by | Change summary |
| :--- | :--- | :--- | :--- |
<!-- DECISION_LEDGER_ROWS -->
| 11.3.0 | 2026-09-02T21:40:17+03:00 | Estève | Revalidated DEC-015 sequential unified refactor with revenue continuity |
| 11.2.29 | 2026-09-02T20:06:56+03:00 | Estève | Revalidated DEC-013 and DEC-014 with Alpha Beta Theta phase governance |
| 11.2.28 | 2026-09-02T19:37:57+03:00 | Estève | Revalidated DEC-012 human-led non-verbal communication and generative mediation ban |
| 11.2.27 | 2026-09-02T18:59:39+03:00 | Estève | Revalidated DEC-011 and added scalable Replit compute cost governance |
| 11.2.26 | 2026-09-02T18:54:43+03:00 | Estève | Revalidated DEC-010 Resend server-side transactional email provider |
| 11.2.25 | 2026-09-02T18:41:23+03:00 | Estève | Revalidated DEC-009 no runtime Notion dependency with optional mirror |
| 11.2.24 | 2026-09-02T17:19:58+03:00 | Estève | Revalidated DEC-008 Replit Reserved VM application runtime |
| 11.2.23 | 2026-09-02T16:59:13+03:00 | Estève | Revalidated DEC-007 Neon PostgreSQL and Drizzle relational foundation |
| 11.2.22 | 2026-09-02T03:03:53+03:00 | Estève | Recorded dated workshop handover after DEC-001 through DEC-006; DEC-007 remains pending |
| 11.2.21 | 2026-09-02T01:18:32+03:00 | Estève | Revalidated DEC-006 ban on coercive engagement while allowing neutral private history |
| 11.2.20 | 2026-09-02T01:04:08+03:00 | Estève | Revalidated DEC-005 strict ban on partner-facing micro-surveillance signals |
| 11.2.19 | 2026-09-02T00:59:30+03:00 | Estève | Revalidated DEC-004 private-by-default data and explicit separate consent boundary |
| 11.2.18 | 2026-09-02T00:31:28+03:00 | Estève | Revalidated DEC-003 five partner seats plus a separate Philautia self-connection |
| 11.2.17 | 2026-09-02T00:29:42+03:00 | Estève | Revalidated DEC-002 B2C-first self-service model, private EAP vouchers, and Arbora consulting routing |
| 11.2.16 | 2026-09-02T00:27:18+03:00 | Estève | Revalidated DEC-001 MyFive by Green Elephant product identity and canonical hostname |
| 11.2.15 | 2026-09-02T00:23:42+03:00 | Estève | Approved evidence-first historical baseline consolidation policy without activating DEC-001 through DEC-031 |
| 11.2.14 | 2026-09-01T23:17:59+03:00 | Estève | Upgraded canonical PRD to v1.6.0 with RTM foundation, BDD acceptance library, phased SvelteKit migration plan, NFR/operations controls, edge-case register, and research/synchronization guidance |
| 11.2.13 | 2026-09-01T21:55:34+03:00 | Estève | Rebuilt the canonical PRD from scratch around the approved SvelteKit target stack, preserved Stripe billing, excluded biometrics, and kept notification pacing in scope |
| 11.2.12 | 2026-09-01T21:42:00+03:00 | Estève | Clarified architectural direction to SvelteKit as the approved target stack, marked React/Vite/Express as legacy-to-refactor, kept Stripe billing in scope, kept biometrics excluded, and moved notification pacing to approved in-scope behavior |
| 11.2.11 | 2026-09-01T21:05:00+03:00 | Estève | Merged notebook-derived PRD content into the canonical `docs/PRD.md`, preserved the supporting `docs/DECISION_LOG.md`, and flagged the likely missing follow-on section / book material for confirmation before finalization |
| 11.2.10 | 2026-09-01T20:52:45+03:00 | Estève | Completed Stage 4.2 GDPR Article 20 JSON/Markdown export with authenticated privacy boundaries |
| 11.2.9 | 2026-09-01T19:43:52+03:00 | Estève | Completed Stage 4.1 GDPR Article 17 account and encrypted-vault cascade wipe |
| 11.2.8 | 2026-09-01T19:41:12+03:00 | Estève | Approved reasoning-level guidance and mandatory Extra High prompt before Stage 4.3 |
| 11.2.7 | 2026-09-01T18:35:31+03:00 | Estève | Approved one-numbered-step-per-commit-and-push delivery protocol |
| 11.2.6 | 2026-09-01T13:50:06+03:00 | Estève | Completed Stage 3.3 with privacy-isolated aggregate EAP voucher redemption |
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

## ✅ Revalidated Historical Baseline Decisions

### DEC-001 — MyFive Product Identity — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** The product is called **MyFive by Green Elephant** and lives at `myfive.greenelephant.org`.
*   **🛠️ Canonical rule:** Adopt **MyFive by Green Elephant** as the canonical product identity, hosted at `myfive.greenelephant.org`.
*   **Applies to:** User-facing product naming, metadata, documentation, authentication configuration, and deployment references.
*   **Revalidation basis:** Explicit human approval during the evidence-first historical baseline workshop. Historical v1, v2, v4, and v10 decision logs consistently use the same product identity and hostname.

### DEC-002 — B2C-First Self-Service Model & Arbora Routing — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** MyFive is a self-service product for individuals. Companies may purchase privacy-preserving employee access vouchers, while team-level and organisational consulting enquiries go to Arbora.partners.
*   **🛠️ Canonical rule:** Operate MyFive as a B2C-first, self-service SaaS product with privacy-preserving B2B EAP voucher distribution. Route team-level and organisational consulting enquiries to Arbora.partners.
*   **Privacy boundary:** An employer or voucher purchaser must not receive personal, sensitive, relationship, or employee-level usage data. Any permitted reporting must remain aggregate-only and privacy-isolated.
*   **Scope boundary:** High-touch organisational consulting is outside MyFive's product scope.
*   **Revalidation basis:** Explicit human approval during the evidence-first historical baseline workshop. Historical v1, v2, v4, and v10 decision logs consistently describe the B2C-first model and Arbora.partners routing; the current canonical delta and implementation ledger separately support private B2C membership and privacy-isolated EAP voucher access.

### DEC-003 — Five Partner Connections Plus Separate Self-Connection — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** A user can nurture five active relationships with other people. Their private relationship with themself is always separate and does not use one of those five places.
*   **🛠️ Canonical rule:** Each account supports a maximum of five active partner-connection seats, plus one separate Philautia self-connection. The self-connection does not consume a partner seat.
*   **Capacity boundary:** A sixth active partner connection must be rejected unless an existing partner seat is first released or deactivated. The Philautia self-connection remains available regardless of partner-seat occupancy.
*   **Data-model implication:** Partner connections and the self-connection must remain distinguishable so seat-cap enforcement cannot count the self-connection as a partner seat.
*   **Revalidation basis:** Explicit human approval during the evidence-first historical baseline workshop. This resolves ambiguity in early historical versions in favour of the later v10 clarification, DEC-037 self-connection model, and the implemented Stage 2.4 five-partner-seat cap.

### DEC-004 — Private by Default & Separate Consent — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** A person's answers and reflections belong only to them. Joining a connection does not reveal private information; sharing always requires a separate, clear choice.
*   **🛠️ Canonical rule:** All personal check-ins, reflections, Connection Profiles, and emotional-needs data are private by default. Joining a connection does not authorize sharing. Every transition into a shared state requires explicit, purpose-specific, voluntary, and revocable consent.
*   **Consent boundary:** Consent for one purpose, data item, or shared feature must not be treated as blanket permission for another. Refusing or withdrawing consent must not remove access to unrelated private features.
*   **Data boundary:** Private records and partner-visible shared records must remain structurally isolated. Private content must never become shared through inference, default settings, connection membership, or administrative access.
*   **Audit implication:** Governed sharing and consent changes require durable, timestamped evidence without exposing the private content itself.
*   **Revalidation basis:** Explicit human approval during the evidence-first historical baseline workshop. Historical v1, v2, v4, and v10 decision logs consistently state this boundary; the current encrypted vault, bilateral consent gate, consent receipts, export, and deletion implementation evidence reinforces it.

### DEC-005 — Strict Micro-Surveillance Ban — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** MyFive must not let people monitor one another. It shows no read receipts, online status, location, last-active time, or response-speed tracking.
*   **🛠️ Canonical rule:** Prohibit partner-facing read receipts, presence indicators, activity status, location tracking, response-time monitoring, and behavioural surveillance. These signals must not be inferred or exposed, including through engagement, responsiveness, or relationship scores.
*   **Collection boundary:** Do not collect surveillance data merely to hide it from the interface. Operational metadata may be processed only when necessary for security, delivery integrity, or legal compliance, with strict purpose limitation and no partner-facing exposure.
*   **Consent boundary:** The prohibited partner-monitoring features must not be enabled through connection-level or bilateral consent; avoiding coercive interpersonal monitoring is a product safety boundary.
*   **Revalidation basis:** Explicit human approval during the evidence-first historical baseline workshop. Historical v1, v2, v4, and v10 decision logs consistently prohibit read receipts, location tracking, activity status, and response-cadence monitoring.

### DEC-006 — Ban Coercive Engagement; Allow Neutral History — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** MyFive must not create guilt, punishment, streak loss, or pressure when someone takes a break. A user may still calmly review their own history without being scored.
*   **🛠️ Canonical rule:** Prohibit coercive streaks and engagement mechanics that punish silence, missed check-ins, pauses, or ended connections. Neutral, non-scored personal history may be shown without urgency, loss framing, comparison, or rewards tied to continued use.
*   **Prohibited mechanics:** Do not use streak resets, shame or urgency messages, punitive reminders, competitive leaderboards, engagement scores, artificial scarcity, or loss of product access as consequences of inactivity.
*   **Permitted history:** Private chronological records, append-only Connection Profile snapshots, and calm reflection timelines are permitted when they do not rank the user, prescribe frequency, or frame inactivity as failure.
*   **Pacing relationship:** Notification pacing under DEC-034 must respect this boundary and remain optional, reversible, non-coercive, and easy to pause or disable.
*   **Revalidation basis:** Explicit human approval during the evidence-first historical baseline workshop. Historical v1, v2, v4, and v10 decision logs consistently ban coercive streaks and punishment for silence; DEC-037 separately supports neutral private append-only history.

### DEC-007 — Neon PostgreSQL + Drizzle Relational Foundation — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** Neon is MyFive's main server database, with Drizzle providing structured access to it. Zero synchronization and each user's encrypted browser-local vault remain separate layers with separate responsibilities.
*   **🛠️ Canonical rule:** Use Neon PostgreSQL as the canonical server-side relational system of record, accessed through Drizzle ORM. Zero is the synchronization layer and must not be treated as the relational system of record. Encrypted browser-local vaults remain separate from both Neon and Zero.
*   **Architecture boundary:** Server-side relational records, synchronized application state, and encrypted browser-local private data must remain explicitly distinguishable in architecture, implementation, and documentation. This decision does not authorize synchronizing private vault payloads to the server.
*   **Provider boundary:** Replacing Neon or weakening the explicit Neon stack contract requires a separately approved architecture and migration decision.
*   **Revalidation basis:** Explicit human approval of Option A during the evidence-first historical baseline workshop. This preserves the current integrated stack contract, canonical PRD architecture, Drizzle schemas, and existing migration evidence without introducing a provider migration.

### DEC-008 — Replit Reserved VM Application Runtime — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** MyFive runs on an always-on Replit Reserved VM. Moving the production application to another provider or splitting it across runtime providers requires a separate decision.
*   **🛠️ Canonical rule:** Use Replit Reserved VM as the canonical production runtime for MyFive's SvelteKit application and server processes. The deployed application must bind to Replit's assigned `PORT` and use environment-managed runtime configuration.
*   **Migration boundary:** A move from Replit, a split-runtime topology, or a change that weakens the explicit `ReplitReservedVM` stack contract requires a separately approved architecture and migration decision.
*   **Validation boundary:** This decision selects the runtime target; it does not verify plan pricing, production reliability, capacity, or Zero connection behaviour. Those claims require direct deployment and operational validation before they may become enforced metrics.
*   **Revalidation basis:** Explicit human approval of Option A during the evidence-first historical baseline workshop. Historical Decision Log v10, the current canonical PRD, and existing Replit-specific runtime integrations support continuity with Replit while preserving later migration as a separately governed choice.

### DEC-009 — No Runtime Notion Dependency; Mirror Allowed — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** MyFive does not depend on Notion to operate. GitHub holds the canonical documents, while Notion may display non-authoritative copies or support project tracking.
*   **🛠️ Canonical rule:** MyFive must not use Notion as a runtime CMS, application database, or authoritative configuration source. Runtime content and configuration must reside in the repository or approved application data stores. Notion may serve as a downstream documentation mirror or project-tracking workspace.
*   **Synchronization boundary:** Manual or automated GitHub-to-Notion documentation mirroring is permitted when GitHub remains authoritative and the mirror identifies its source version, commit, and synchronization timestamp. Mirror drift or failure must not affect the deployed MyFive application.
*   **Scope boundary:** This decision governs MyFive only. It neither approves nor requires removal of unrelated Green Elephant Notion integrations; those integrations remain subject to their own decisions and migration work.
*   **Revalidation basis:** Explicit human approval of Option A during the evidence-first historical baseline workshop. This reconciles historical Decision Log v10's runtime-decommissioning intent with the current PRD's GitHub-authoritative Notion mirror guidance and the absence of a MyFive-specific runtime Notion dependency in the reviewed code.

### DEC-010 — Resend Server-Side Transactional Email Provider — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** When a separately approved MyFive workflow is allowed to send a transactional email, it uses Resend from the Replit server. Choosing Resend does not switch email on or approve any particular message.
*   **🛠️ Canonical rule:** Use Resend as MyFive's canonical transactional email provider, invoked only from authenticated server-side code running on Replit. Resend credentials and sender configuration must remain in environment-managed secrets and must never be exposed to browser clients or committed to the repository.
*   **Activation boundary:** Keep MyFive outbound email disabled by default behind an auditable kill switch until activation is explicitly approved. This decision does not approve marketing email, a message category, trigger, recipient rule, sender identity, subject, body, attachment, or template.
*   **Delivery boundary:** Each permitted transactional email purpose must be separately defined with its lawful basis or consent rule, minimum necessary data, retry and duplicate-suppression behaviour, failure handling, and verification evidence.
*   **Scope boundary:** This decision governs MyFive email delivery and does not alter unrelated Green Elephant messaging workflows.
*   **Revalidation basis:** Explicit human approval of Option A during the evidence-first historical baseline workshop. Historical Decision Log v10 and the existing server-side Resend client and connector kill-switch checks support provider continuity; reviewed MyFive routes do not currently establish outbound activation.

### DEC-011 — Replit Billing Verification & Scalable Compute Governance — VERIFY WITH APPROVED OPERATING RULE

*   **Status:** **VERIFY — CURRENT COSTS; APPROVED — SCALABLE COMPUTE GOVERNANCE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** The current Replit billing plan is capped, but MyFive may incur variable compute costs and may need a higher plan as usage grows. The historical `$20/month` claim is not treated as the platform's fixed total cost.
*   **🛠️ Canonical rule:** Architect and budget MyFive for a capped base Replit plan plus variable compute and usage charges. Capacity-driven movement to a higher Replit plan is permitted in principle when supported by measured demand, but each actual billing-plan or spending-limit change requires explicit human authorization before execution.
*   **Verification boundary:** Verify the active base plan, its cap, included resources, variable-compute rates, current invoices, alerts, and spending controls directly in the Replit billing console. Historical statements do not establish the current amount or account state.
*   **Growth boundary:** Plan capacity, compute consumption, reliability, and unit economics must be reviewed as usage grows. Product and deployment requirements must not assume a permanent `$20` all-in infrastructure ceiling.
*   **Revalidation basis:** Explicit human selection of Option A with clarification that the billing plan is capped while compute costs may vary and future growth may require the next plan. This preserves cost control without blocking approved platform growth.

### DEC-012 — Human-Led Non-Verbal Communication; No Generative Mediation — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** MyFive helps people notice and voluntarily communicate relationship states through non-verbal visual expression. It must not write messages, apologies, boundaries, or relationship responses for them.
*   **🛠️ Canonical rule:** Design MyFive as a human-led, non-verbal communication enhancement. Permanently prohibit generative AI, LLMs, and chatbots from authoring, rewriting, suggesting, simulating, evaluating, or mediating interpersonal communication on behalf of users. Maintain DEC-035's broader exclusion of user-facing generative AI unless a separately approved future decision narrows that boundary.
*   **Permitted expression:** User-directed visual, spatial, colour, pattern, and Connection Profile representations may support private reflection and voluntary non-verbal expression when their meaning comes from the user rather than automated interpretation.
*   **Privacy and consent boundary:** Non-verbal does not mean inferred or automatically shared. Representations remain private by default under DEC-004; any partner-visible expression requires separate, explicit, purpose-specific, voluntary, and revocable consent. Do not infer a partner's state or meaning.
*   **Technology boundary:** This decision does not authorize biometrics, camera input, emotion recognition, behavioural inference, diagnosis, or surveillance. DEC-032 remains in force. Internal developer tools remain permitted only outside user-facing interpersonal workflows and must not weaken private-vault isolation.
*   **Scope boundary:** The non-verbal direction is approved as a product principle. Specific new signals, gestures, shared interactions, notification behaviours, or interpretation systems require their own requirements and approval; none are inferred by this decision.
*   **Revalidation basis:** Explicit human approval of Option A with clarification that MyFive should become a non-verbal communication enhancement. This consolidates historical DEC-012 with active DEC-035, DEC-004, DEC-005, DEC-032, and DEC-037 without expanding automatic sharing or sensitive-data processing.

### DEC-013 — Privacy-Preserving EAP Vouchers Without Legal-Exemption Claims — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** Organisations may buy MyFive voucher capacity and receive safe commercial totals, but they must never learn who redeemed a voucher or how an individual uses MyFive. The voucher model reduces privacy risk but is not described as bypassing the law.
*   **🛠️ Canonical rule:** Preserve privacy-isolated B2B EAP vouchers. A purchaser may receive invoices and approved aggregate entitlement totals such as purchased, redeemed, expired, or remaining capacity. Prohibit purchaser access to employee identity, sensitive or relationship data, activity, individual redemption status, and employee-level usage reporting.
*   **Aggregation boundary:** Purchaser-facing totals must remain genuinely non-identifying and limited to benefit administration. Suppress or withhold a total when cohort size, voucher distribution, auxiliary information, or another factor creates a reasonable re-identification risk. Pseudonymized or linkable data must not be represented as anonymous.
*   **Legal boundary:** Do not claim that the voucher architecture sidesteps, bypasses, or creates an exemption from Finnish employment privacy law, the GDPR, or other applicable obligations. Controller and processor roles, lawful bases, notices, contracts, retention, and reporting controls require qualified legal validation for the implemented workflow.
*   **Research evidence:** Finland's current Act on the Protection of Privacy in Working Life limits employer processing to employee data directly necessary for the employment relationship or employer-provided benefits and states that consent cannot override that necessity requirement ([Finlex 759/2004](https://www.finlex.fi/en/legislation/2004/759)). EU case law distinguishes genuinely anonymous information from pseudonymized information that can still be attributed to a person ([CJEU C-683/21](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex%3A62021CJ0683)). These sources inform the safeguard but do not establish product approval or legal sign-off.
*   **Revalidation basis:** Explicit human approval of Option 13A during the evidence-first historical baseline workshop. This preserves DEC-002 and the privacy-isolated Stage 3.3 voucher implementation while correcting the historical legal-exemption claim.

### DEC-014 — Lean MVP with Alpha, Beta, and Theta Phase Governance — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** Keep the product focused while retaining capabilities approved after the original MVP. MyFive is now in **Alpha (MVP)**, moves to **Beta** after sales confirm the MVP, and then moves to **Theta** when sales are being scaled.
*   **🛠️ Canonical rule:** Deliver the smallest coherent, safe, paid self-service release defined by the current canonical PRD. Later approved decisions override the historical no-payment and no-pacing wording. Preserve Stripe, privacy-isolated EAP vouchers, user-controlled notification pacing, GDPR controls, non-verbal Connection Profiles, and the active exclusions.
*   **Canonical phase labels:** **Alpha — Now / MVP:** build, validate, and operate the current approved MVP. **Beta — Sales-confirmed MVP:** begins after recorded sales evidence confirms the MVP. **Theta — Scaling sales:** begins when the product enters deliberate sales, capacity, and operational scaling.
*   **Phase-gate boundary:** Exact sales evidence and thresholds for Alpha-to-Beta and Beta-to-Theta remain pending definition. A phase transition requires recorded evidence and Estève's explicit approval; it must never be inferred from activity, revenue, or elapsed time.
*   **Scope boundary:** A phase transition does not automatically approve features, integrations, spending changes, data uses, or implementation checklist items. Each remains governed by its own approved decision and delivery evidence.
*   **Exclusion boundary:** Biometrics, camera, and rPPG remain excluded under DEC-032. User-facing generative AI remains excluded under DEC-012 and DEC-035. Celestial or space-weather integrations require a separate explicit decision and are not activated by notification-pacing approval.
*   **Revalidation basis:** Explicit human approval of Option 14A with the Alpha, Beta, and Theta lifecycle labels. This preserves the smallest-useful-product discipline while reconciling historical DEC-014 with later approved scope deltas.

### DEC-015 — Sequential Unified SvelteKit Refactor with Revenue Continuity — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** MyFive and the complete Green Elephant website will converge on one Svelte 5, SvelteKit, and Zero architecture. The work happens in two tightly sequential stages: prove MyFive first, then immediately refactor the root website while the existing revenue-producing website and automations remain live until their replacements are proven.
*   **🛠️ Canonical rule:** Adopt Svelte 5, SvelteKit, and Rocicorp Zero as the unified target application and synchronization stack for MyFive and the eventual complete refactor of `greenelephant.org`, deployed on the approved Replit Reserved VM runtime with Neon PostgreSQL and Drizzle. Retire React/Vite/Express legacy surfaces only after their replacement routes and workflows satisfy recorded parity, safety, rollback, and cutover evidence. Any Astro configuration encountered during migration may be retired only after confirming that it is unused or fully replaced.
*   **Two-stage sequence:** **Refactor Stage 1 — MyFive proof of concept:** prove a bounded MyFive vertical slice on SvelteKit + Svelte 5 + Zero, including the Svelte integration approach, Neon replication path, authentication and authorization, private-vault exclusion, reconnect/redeploy behaviour, and rollback. **Refactor Stage 2 — Green Elephant root-site refactor:** begin immediately after Stage 1 exit evidence is recorded, with no planned idle interval, and migrate the remaining public, portal, admin, API, integration, and automation surfaces through reversible vertical slices.
*   **Operational continuity boundary:** Keep the current Green Elephant website available as the live continuity baseline throughout migration. Preserve the working Typeform flows, existing Google integrations, Stripe pay gates, checkout and webhook processing, Satellite Scan purchase/intake/fulfilment infrastructure, existing Resend email automations, schedulers, and their supporting Neon and operational Notion workflows. Do not use a big-bang replacement. Each legacy surface remains active until its replacement passes contract, smoke, parity, provider-callback, and rollback checks.
*   **Revenue boundary:** Migration must not intentionally interrupt the ability to market, sell, receive payment for, fulfil, support, or maintain invoicing records for the existing Green Elephant offers, especially Satellite Scan. If a replacement fails its gate, route traffic and automation back to the verified legacy surface rather than retiring the revenue path.
*   **Email boundary:** Existing Green Elephant Resend automations remain in operation during migration. This continuity approval does not activate MyFive outbound email or weaken DEC-010: every new MyFive recipient, trigger, sender, subject, body, attachment, and template still requires separate approval.
*   **Zero validation boundary:** Zero remains part of the mandatory target stack, but production cutover depends on the Stage 1 proof. If the proof fails, stop the affected cutover and require a separately approved architecture correction; do not silently substitute another synchronization engine. Zero's current official documentation describes a client-server system rather than a local-first system and does not support offline writes, so canonical requirements must not claim otherwise.
*   **Schedule target:** Target completion of both refactor stages by the end of Sunday, `2026-09-06`, in `Europe/Helsinki`. This is an execution target, not permission to skip privacy, security, payment, data-integrity, provider-callback, accessibility, parity, or rollback gates. If the target is missed, keep verified legacy surfaces live until safe cutover evidence exists.
*   **Performance boundary:** Historical bundle-size, framework-comparison, sub-5ms query, sub-50ms interaction, persistent-connection, and 48-hour reliability claims remain `VERIFY` evidence under DEC-036. They are not guaranteed outcomes or blocking compliance requirements until reproduced on the actual MyFive and Replit topology.
*   **Research evidence:** SvelteKit's official Node adapter produces a standalone Node server and accepts `PORT` and `HOST` configuration ([SvelteKit Node servers](https://svelte.dev/docs/kit/adapter-node)). Zero officially provides first-class React and SolidJS integrations plus a low-level TypeScript API for other frameworks, making the exact Svelte integration a proof item ([Install Zero](https://zero.rocicorp.dev/docs/install)). Zero self-hosting requires `zero-cache`, PostgreSQL replication, query/mutate endpoints, WebSocket-capable networking, and a direct upstream database connection, while other Zero database roles may use pooling ([Self-Hosting Zero](https://zero.rocicorp.dev/docs/self-host)). Replit describes Reserved VM as an always-on dedicated runtime, which supports but does not prove the selected topology ([Replit deployment types](https://docs.replit.com/features/publishing/deployment-types)).
*   **Revalidation basis:** Explicit human selection of Option B with a required two-stage, continuity-first sequence. Estève explicitly approved full-site refactoring immediately after the MyFive proof of concept while preserving the current Typeform, Google, Stripe, Satellite Scan, and Resend revenue workflows during migration.

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
    *   Integrate Stripe checkout and webhook routes in the active backend layer of the approved stack. Legacy Express routes may operate as transitional infrastructure during refactoring.
    *   Maintain sponsorship mapping in Drizzle schemas (`shared/schema.ts`) so primary subscribers can sponsor 5 connection seats for partners without partner checkout friction.
    *   Isolate payment metadata from private check-in reflections, strictly maintaining GDPR Article 6/13 data separation.

### DEC-034 (Δ) — Fibonacci & Celestial Notification Pacing — APPROVED & IN SCOPE
*   **Status:** **APPROVED & IN SCOPE**
*   **Owner:** Estève
*   **Basis:** Explicit human approval to include notification pacing in the active product scope.
*   **Rule:** Notification pacing is permitted and in scope. It must remain user-controlled, non-coercive, and privacy-safe, with pacing controls exposed in client settings and clear opt-out behavior.
*   **MVP impact:** Included in MVP, implemented with user-control-first defaults.

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
| **SaaS Billing & Pay Gates** | **IN SCOPE**: Stripe billing and pay gates remain active scope and must be carried through stack refactoring. | Preserves validated monetization while migrating toward the approved SvelteKit target stack. |
| **Biometric Webcam** | **EXCLUDED**: Camera access and biometrics are strictly disabled in MVP. No camera triggers compiled. | Eliminates GDPR Article 9 special-category data liabilities. |
| **User-Facing AI** | **EXCLUDED**: AI interpersonal dialogue mediation is strictly banned (DEC-012). Backend developer tools allowed. | Preserves human emotional craftsmanship and authenticity. |
| **Notification Pacing** | **IN SCOPE (USER-CONTROLLED)**: Notification pacing is approved and must remain optional/toggleable with clear opt-out. | Enforces Nielsen Usability Heuristic #3 (User Control & Freedom) while enabling approved pacing features. |

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

### Stage 3: Stripe Pay Gates & Sponsorship (COMPLETED)
- [x] **3.1** Integrate Stripe Checkout for €4.99/month primary subscription, with webhook-backed entitlement persistence and account-bound return verification.
- [x] **3.2** Implement 5-seat partner invitation & free sponsorship mapping flow (`myfiveSubscriptions`) using expiring, hashed, single-use invitation links and authenticated email-bound acceptance.
- [x] **3.3** Add B2B EAP voucher redemption interface with hashed codes, aggregate-only employer reporting, and unlinkable employee entitlements.

### Stage 4: Data Sovereignty & GDPR Compliance
- [x] **4.1** Implement GDPR Article 17 hard cascade account wipe API and explicit-confirmation button, including Stripe billing identity, MyFive server data, linked portal identity/context, and the encrypted browser vault.
- [x] **4.2** Implement GDPR Article 20 JSON/Markdown data export engine with privacy headers.
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
| Stage 3.3 — privacy-isolated B2B EAP voucher redemption | 11.2.6 | Commit containing this `11.2.6` ledger entry | `20260901_myfive_eap_vouchers.sql` |
| Stage 4.1 — GDPR Article 17 account and vault cascade wipe | 11.2.9 | Commit containing this `11.2.9` ledger entry | No schema migration required |
| Stage 4.2 — GDPR Article 20 JSON/Markdown account and current-browser vault export | 11.2.10 | Commit containing this `11.2.10` ledger entry | No schema migration required |

---

## ✅ Build-Start Checklist

*   [x] Stripe pay gates integrated into existing `GreenElephantorg` checkout pipeline.
*   [ ] Run dynamic code scan on `/client` to ensure zero instances of `getUserMedia` or camera permission requests are compiled.
*   [ ] Confirm all outbound email sending is disabled by default (test mode / kill switch ON) until explicitly approved.
*   [ ] Ensure Google Client ID matches validated credentials on the active Google Cloud Console profile.
*   [ ] Confirm zero plaintext credentials, passwords, or tokens exist in active codebases.
