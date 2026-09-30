---
document_id: GE-PRD
document_type: product_requirements
canonical_path: docs/PRD.md
decision_authority: docs/DECISION_LOG.md
project_index: docs/project-index.json
---

# Green Elephant — Product Requirements

One PRD, two independent project sections. Version: **2.0.1**.
Owner: Estève Pannetier. Reconciled: 2026-09-30.

The current governance decision is [DEC-GE-PRD-001](DECISION_LOG.md#dec-ge-prd-001).
GitHub owns this PRD and the single decision log. Notion holds derived mirrors.
This arrangement was published to GitHub `main` in signed commit
[`99b846f`](https://github.com/Esteve32/GreenElephantorg/commit/99b846fbe9276dda0f4d8b5394e6cba1cde5846d).
Notion mirrors have not yet been refreshed from that commit.

| Project ID | Project | State | Entry |
| --- | --- | --- | --- |
| AI-LIT | AI Literacy Training Portal and website findability | Active discovery; implementation not approved | [AI literacy](#ai-literacy) |
| MY5 | MyFive relationship application and former unified refactor | Paused; no resumption date | [MyFive](#my5) |

The [project index](project-index.json) is a machine-readable router and source
inventory, not a second specification. Stable IDs below are the query keys.
Use `Fact`, `Approved direction`, `Proposal`, `TBD`, or `Historical` explicitly.
An imported approval is attributed to its source; it is not a new approval by this
migration. A requirement is not proof of implementation.

<a id="ai-literacy"></a>
## AI-LIT — AI Literacy Training Portal

**State:** active discovery. **Source:** SRC-AI-LIT, Notion draft v0.3 exported
2026-09-30. **Owner:** Estève Pannetier. **Implementation gate:** open.
Current authorization covers documentation consolidation and discovery only.

### Purpose and audience

Green Elephant remains a communication expert. The new positioning applies that
expertise to AI literacy: helping people use AI to augment human communication
without handing over their judgment, voice, relationships or responsibility.
Simplify greenelephant.org so a suitable visitor can understand this human-centred
AI literacy offer and take one clear, approved next step. Clarity, search
findability, maintainability and real delivery capacity come before a platform
rebuild.

| ID | Status | Requirement / direction | Evidence |
| --- | --- | --- | --- |
| AI-LIT-REQ-001 | Approved direction | Serve engineers and other professionals in teams, plus solopreneurs and independent professionals. | SRC-AI-LIT, Audience and learner needs; DEC-AIL-002 |
| AI-LIT-REQ-002 | Approved direction | Support English- and French-speaking reach in Finland, the UK, France and wider Northern Europe. Launch order and simultaneous bilingual release remain undecided. | SRC-AI-LIT, Audience and learner needs; DEC-AIL-003 |
| AI-LIT-REQ-003 | Proposal | Help visitors understand practical, safe AI use in their work, offer fit, preparation, delivery, follow-up and access to approved materials. Validate these needs. | SRC-AI-LIT, sections 2–4 |
| AI-LIT-REQ-004 | TBD | Select one searchable first-release niche and priority problem, then one offer and primary conversion action. | SRC-AI-LIT, sections 2–3 and 10 |
| AI-LIT-REQ-005 | Proposal | Discover training → understand an offer → enquire or enrol → access materials. Compare this with simpler existing routes. | SRC-AI-LIT, section 4 |
| AI-LIT-REQ-006 | Proposal | Consider home, offer detail, facilitator/method, enquiry/enrolment, materials and privacy/accessibility/legal content. Exact pages, URLs and navigation await inventory. | SRC-AI-LIT, section 5 |
| AI-LIT-REQ-007 | Discovery requirement | Classify existing content, components and integrations as reuse, hide/retire, replace, or awaiting Estève. | SRC-AI-LIT, architecture distinction |
| AI-LIT-REQ-008 | Discovery requirement | Compare laptop, GitHub and Replit evidence; select a recoverable application baseline before implementation. Do not infer deployed code from main. | SRC-AI-LIT, sections 8–10 |
| AI-LIT-REQ-009 | Draft requirement | Provide keyboard access, semantic structure and readable contrast; define the eventual accessibility acceptance tests. | SRC-AI-LIT, section 9 |
| AI-LIT-REQ-010 | Draft requirement | Any enquiry/enrolment data needs a purpose, owner, retention approach and understandable privacy/consent information. | SRC-AI-LIT, section 9 |
| AI-LIT-REQ-011 | Draft requirement | Assign human ownership for offer content, enquiries and materials, and require validation evidence and a rollback path for later implementation changes. | SRC-AI-LIT, section 9 |
| AI-LIT-REQ-012 | Draft requirement | Keep secrets out of source and evidence; runtime secrets remain in Replit and human-held credentials in 1Password. | SRC-AI-LIT, section 9; current user workflow |
| AI-LIT-REQ-013 | Approved direction | Keep human agency at the top of the product and message hierarchy. AI supports human thinking and communication; it does not replace the person, speak as them without control, or become the authority for their relationships and decisions. | DEC-AIL-007 |
| AI-LIT-REQ-014 | Approved direction | Position the Periodic Table of Conscious Communication—especially its white **Think & Understand** mental-model layer—as Green Elephant's differentiating method for understanding prompts, AI outputs and human communication choices. | DEC-AIL-007; supplied legacy diagram |
| AI-LIT-REQ-015 | Approved direction | Treat Satellite Scan, the full Periodic Table, Prompt Library and coaching as supporting tools and services for the AI literacy journey, rather than separate competing headline propositions. | DEC-AIL-007 |

Source reference personas include engineering/team, legal and documentary/video
professions. Named examples and client commercial terms remain in the restricted
source. Their inclusion is product-learning evidence, not permission to publish
names, testimonials, outcomes, case studies or training materials.

### Offer and launch decisions still needed

| ID | Decision needed | Status / owner |
| --- | --- | --- |
| AI-LIT-TBD-001 | Narrow SEO niche, highest-value problem and first priority market | TBD — Estève |
| AI-LIT-TBD-002 | Offer name, 1:1/group balance, mode, duration, schedule, capacity and price | TBD — Estève |
| AI-LIT-TBD-003 | Single primary conversion action and its human follow-up | TBD — Estève |
| AI-LIT-TBD-004 | Bilingual launch or staged English/French release | TBD — Estève |
| AI-LIT-TBD-005 | Public materials or human-operated access; any role for Satellite Scan | TBD — Estève |
| AI-LIT-TBD-006 | Retained pages/navigation and first-release journey | TBD after inventory — Estève |
| AI-LIT-TBD-007 | Keep/refactor/replace architecture; application base branch and commit | TBD after recovery — Estève |
| AI-LIT-TBD-008 | Replit workspace/deployment relationship, deployed commit and environment | Unverified current state |
| AI-LIT-TBD-009 | Measurable SEO, performance, accessibility and conversion acceptance criteria | Proposal review needed — Estève |
| AI-LIT-TBD-010 | Canonical Periodic Table version, element count and attribution for the new website | Verify before new public copy or visual adaptation |

### Positioning hierarchy

| Level | Role in the new website |
| --- | --- |
| **Human agency** | The human chooses the purpose, supplies context, interprets output, keeps their voice and remains accountable. |
| **AI literacy** | Practical capability to prompt, question, evaluate and collaborate with AI critically and confidently. |
| **Green Elephant method** | Communication expertise and the Periodic Table's mental models help people see what good prompting and human communication require. |
| **Supporting paths** | Satellite Scan reveals patterns; the Periodic Table supplies the map; the Prompt Library turns models into practice; coaching helps people integrate the learning. |

The Periodic Table is both differentiating evidence and a supporting method. It
should be visible early enough to explain why Green Elephant's AI literacy training
is distinct, without becoming the website's primary product or conversion goal.

**Recommended draft message, pending copy review:**

> **Use AI. Keep your voice.**
>
> Human-centred AI literacy for professionals and teams, grounded in Green
> Elephant's Periodic Table of Conscious Communication.

### Search and growth evidence

SRC-GROWTH is a March–April 2026 strategy source. It is retained as historical
evidence, not a third project or an additional PRD. The portal's September audience
direction governs AI-LIT. The following are **proposals for review**, not an
approved backlog or verified findings about today's website:

| ID | Candidate to assess | Boundary |
| --- | --- | --- |
| AI-LIT-PROP-SEO-001 | Audit page titles/descriptions, meaningful headings, descriptive image text, sitemap, robots configuration and social previews. | Choose search terms after AI-LIT-TBD-001; do not copy old EA/VA keywords automatically. |
| AI-LIT-PROP-SEO-002 | Make audience, offer and primary action clear early on the page; simplify navigation. | Old Scan/Coaching/About navigation and purchase CTA are historical choices. |
| AI-LIT-PROP-SEO-003 | Check mobile speed, image sizes, script loading and public-page dependencies. | March timeouts and old performance targets are not current measurements or approved release thresholds. |
| AI-LIT-PROP-SEO-004 | Consider useful FAQs, educational content and an appropriate landing page for each approved search intent. | Content cadence and channel allocation remain undecided. |
| AI-LIT-PROP-GROWTH-001 | Compare a human enquiry/discovery-call route with enrolment and other conversion options. | No selected booking provider, automatic outreach or new integration. |
| AI-LIT-PROP-GROWTH-002 | Consider permission-backed evidence of facilitator credibility and actual service outcomes. | Never manufacture testimonials, popularity counts, urgency or results. |
| AI-LIT-PROP-GROWTH-003 | Assess whether lead capture, webinars or follow-up would support the chosen offer. | No newsletter, assessment scoring, consent model or email sending approved by this import. |
| AI-LIT-PROP-GROWTH-004 | Decide a small measurement plan after choosing the offer and conversion action. | Historical revenue, beta usage, capacity and funnel numbers are source claims, not current facts. |

Historical growth hypotheses about coaching payment plans, quarterly membership,
EA/VA targeting with CEO sponsorship, webinar cadence, pricing and outbound/inbound
allocation remain in SRC-GROWTH. None is adopted into AI-LIT by this migration.
The source contains inconsistent workload and revenue contexts; preserve those
distinctions instead of combining them into a new target.

### Scope, exclusions and architecture

Discovery includes inventory, a simple visitor journey, reusable capabilities,
first-release acceptance criteria and baseline recovery.

Excluded unless separately approved: MyFive work or stack migration, private
relationship vaults/schema, a new LMS, authentication, payments, certificates,
AI chat or learner agents, progress tracking, production migration and deployment.

The existing repository implementation is React/Vite/Express with TypeScript,
Neon PostgreSQL, Drizzle, Stripe, Resend and Notion integrations. This is a code
checkpoint, not verification of production or a selected portal architecture.
MyFive's SvelteKit/Svelte 5/Zero target is specific to the paused project.

Documentation branches and pull requests may record the current discovery. They are
not the portal's implementation branch or the choice of application baseline.
Assess which existing admin/auth/payment features remain dormant or hidden before
proposing changes.

### Current website audit — 2026-09-30

This is a bounded, read-only snapshot of GitHub `main` at `99b846f`, the known
MyFive branch at `3e9b050`, and the public domain. It is evidence for the workshop,
not authorization to rebase, replace or deploy the application.

#### Confirmed public behavior

- The desktop visitor experience uses a compact **Scan / Coaching / About**
  navigation, an English selector and a **Take the Scan** action. The homepage
  identifies the product as Satellite Scan and addresses Executive Assistants and
  professionals who lead without hierarchy.
- A headless Chrome capture at 390 × 844 showed horizontal clipping of hero copy
  and the primary action. The cookie panel also extended beyond the viewport, with
  controls partly inaccessible. Mobile layout repair is a release blocker for any
  candidate based on this deployment.
- Search-facing requests returned HTTP 200 for the homepage, Scan, Coaching,
  Programs, Flow Check, Periodic Table, Speech Lab, Webinars, Calendar, Resources,
  Connect, Retreats and the three role-specific landing pages checked. These
  responses establish availability only; they are not a performance or content
  approval.
- `robots.txt` and `sitemap.xml` returned HTTP 404. Search metadata therefore
  advertises indexability without these two basic discovery resources.
- Search-facing `/myfive` and `/portal/login` requests returned HTTP 404, while the
  public configuration endpoint reported portal login enabled and SaaS disabled.
  Browser-only routes and search behavior need deliberate reconciliation.
- Root responses included CSP, HSTS, frame, content-type, referrer and permissions
  headers. This is a positive transport/browser-control observation, not a complete
  security or privacy audit.

#### GitHub-to-production mismatch

| Evidence | GitHub `main` | Public deployment | Meaning |
| --- | --- | --- | --- |
| Desktop navigation | `Discover / Scan / Learn / Programs / Connect` in `Header.tsx` | `Scan / Coaching / About` | Live visitor UI is not represented by current main source. |
| Visitor routes | Main router lacks `/drift-check`, `/welcome`, `/blog`, `/micro-habit`, `/ai-transparency` and `/celestial-calendar` | These strings exist in the deployed JavaScript; `/drift-check` has a search-facing page | Live-only work may be uncommitted or stored in another checkout/branch. |
| Main JavaScript asset | `dist/public/index.html` references `index-DHRBtPG_.js` | Live HTML references `index-57VkaKnx.js` | Main is not the exact deployed build. |
| MyFive branch asset | Known branch references `index-3Q1Q0GTU.js` | Live HTML references `index-57VkaKnx.js` | The known MyFive branch is also not the exact deployed build. |
| Delivery automation | No deployment workflow is present on `main`; a baseline-check workflow exists only on the paused feature branch | No verified GitHub-to-production commit mapping | Automatic GitHub → Replit delivery is not established. |

The public response passed through Cloudflare and an Express application, with a
Google proxy visible in headers. Those headers do not identify the deployment's
source commit or prove the current Replit workspace is its build source.

#### Product, brand and copy evaluation

| Area | What works now | What blocks the AI literacy direction |
| --- | --- | --- |
| Visual identity | Aurora/space imagery is distinctive, calm and memorable; the dark teal palette supports the exploration metaphor. | The homepage brands the experience as **Satellite Scan**, not Green Elephant's human-centred AI literacy training. Mobile overflow damages trust. |
| Promise | “You already change the room when you walk in” is emotionally strong and audience-specific. | It promises communication self-awareness without explaining how Green Elephant's communication expertise and mental models help people use AI while retaining agency. |
| Navigation | Three desktop groups are much clearer than the five groups in GitHub main. | Search-facing navigation still exposes ten destinations. The visual UI, crawler view and source disagree. |
| Conversion | A free first action and paid Scan action are visible. | The first AI literacy offer and primary conversion remain undecided; old Scan/coaching actions cannot be assumed to be the new funnel. |
| Content depth | Existing Scan, coaching, framework, resource and role content provides substantial reusable material. | Multiple overlapping pages compete for the same visitor intent. Old EA/VA, coaching, retreat and diagnostic positioning may confuse the new audience. |
| Search/AI readability | Pages expose descriptive titles, headings, structured data and a search-friendly HTML fallback. | Fallback content differs from the browser experience; missing sitemap/robots reduce discovery; claims, prices, named-client references and AI/legal wording require current evidence and permission review. |
| Technical shape | React/Vite/Express already delivers public pages and integrations. | The repository contains 78 TSX page files, a 7,059-line route module and public, portal, admin and paused MyFive surfaces in one runtime. A whole-stack rewrite would add risk before the public journey is settled. |

#### Recommended first-release information architecture — proposal

This proposal deliberately keeps the public choice small while retaining old URLs
until redirects, search value and operational dependencies are verified:

1. **Home** — human-agency promise, AI literacy audience fit, outcomes and one
   primary action. The logo provides the Home link; it need not consume a menu item.
2. **AI Literacy Training** — one new offer page covering the problem, format,
   facilitator, safety approach, expectations and the approved next step.
3. **Our Method** — communication expertise and the Periodic Table, with the white
   **Think & Understand** mental models clearly connected to prompting, evaluating
   AI output and making human communication choices.
4. **Resources** — the Prompt Library and selected AI literacy material; Satellite
   Scan and coaching appear as supporting routes when relevant to the learner.
5. **About** — Green Elephant, facilitators, philosophy, evidence and contact route.

Recommended primary navigation: **AI Literacy / Our Method / Resources / About**,
plus one action for the approved training journey. Satellite Scan and Coaching may
remain discoverable within content and secondary navigation without competing with
the AI literacy promise.

Privacy, terms, cookies and AI policy remain in the footer. Satellite Scan,
Coaching, Programs, role pages, retreats, Flow Check, Speech Lab, webinars,
calendar, portal and MyFive require individual **retain / redirect / unlist / pause**
decisions. Do not delete an old route merely because it leaves primary navigation.

#### Safe baseline-recovery gate

Before a rebase, implementation branch, CI/CD connection or production release:

1. Record the Replit workspace branch, HEAD, working-tree changes and build command.
2. Identify the source of deployed asset `index-57VkaKnx.js` or archive the live
   build and route inventory as rollback evidence.
3. Recover and compare any laptop/work-account commits, stashes and untracked work.
4. Choose the application baseline explicitly: recovered live source, GitHub main,
   or a reconciled branch. Preserve the current production rollback point.
5. Add CI for install, type-check, tests/build and a preview deployment before any
   production synchronization. Connect production only after preview acceptance.

**Senior recommendation:** evolve the current React/Vite/Express application in
small route/content changes after recovery. Do not adopt the paused MyFive stack or
rebuild the whole application merely to simplify navigation and publish one new
offer page.

### Brand, learning materials and linked references

The supplied source identifies these references; linked page contents were not
included in the three exports and are not claimed reviewed here:

- [Green Elephant Timeless Brand](https://app.notion.com/p/b2e418c47fff4cbfafbdba650778f83d): visual/verbal source; palette choices may remain open.
- [Service-design reference](https://app.notion.com/p/4cef8759c1154723b9f4932b53ad8ad2): client-specific delivery example, not the public offer.
- [Proposal reference](https://app.notion.com/p/a10b43aee0b54a099c7513b6747c4de6): positioning/journey evidence; commercial details are restricted.
- [Agreement reference](https://app.notion.com/p/c713ebbd8b8140e4b59c6ebbbbb89e5c): operational/legal reference, not public copy.
- [Development research folder](https://drive.google.com/drive/folders/1p7vI1KjEQ84lfQ3oTSnMcnWhKMunsiK2): further evidence, not automatic scope.
- [Historical website-builder prompt](https://app.notion.com/p/33541c855f3380f190accd67d8e746d3): historical instructions only.

Periodic Table explanations, facilitator biographies, training evidence and existing
legal/privacy/accessibility text require relevance and permission review before reuse.
The original archives retain the complete source links and contextual wording.
The legacy diagram inspected for this workshop labels the white lower layer
**Think & Understand** and displays a Creative Commons BY-NC-ND mark. Existing
website sources also disagree between 129 and 146 elements. Confirm the canonical
version, count, attribution and permitted form of web use before adapting the visual
or making a precise numerical claim.

### Discovery acceptance and progress

| ID | Acceptance | State |
| --- | --- | --- |
| AI-LIT-AC-001 | Broad audience, reference contexts, languages and reach recorded | Source-recorded approval; DEC-AIL-002/003 |
| AI-LIT-AC-002 | Current capabilities classified as reuse / hide-retire / replace / awaiting Estève | Partial — current website audit recorded; route decisions remain open |
| AI-LIT-AC-003 | Laptop/GitHub/Replit comparison completed without losing work | Partial — live/GitHub mismatch proved; exact deployed source and laptop work remain unresolved |
| AI-LIT-AC-004 | Niche, problem, first offer, primary conversion and language rollout approved | Open |
| AI-LIT-AC-005 | Journey/pages and acceptance criteria approved | Open |
| AI-LIT-AC-006 | Architecture and baseline decision supported by evidence | Open |
| AI-LIT-AC-007 | Implementation backlog records project, repository/branch, acceptance, validation, blocker and last verification | Open; implementation not authorized |

Existing Notion task references remain operational pointers, not extra decision logs:
[recovery](https://app.notion.com/p/c4839f0c47964b828ac7c19298a1ab21),
[site inventory](https://app.notion.com/p/aa9553aa5c084028bb84eea9ec6f4adf),
[offer workshop](https://app.notion.com/p/6b7ed9d1a0c442afb526d41a7b08721b),
[Replit verification](https://app.notion.com/p/6eb3cb8245f24142acec982259e9f281).

<a id="my5"></a>
## MY5 — MyFive, paused

**My5 is an alias; MyFive remains the product/technical name.**
Paused by Estève on 2026-09-30 according to SRC-MY5 and reaffirmed in the current
request. No resumption date. Preserve research, attachments, history and draft PR #4.
The portal does not inherit the relationship product's requirements.

The detailed baseline below comes from GitHub commit
`3e9b050cc1b133496087ff4e2c87c125131a9bac`, PRD v1.7.5.
It supersedes the older v1.7.4 document previously on main for historical reference.
Only documentation is carried into this branch; the MyFive implementation is not
merged. Completed-work statements refer to their recorded branch evidence.

Source reconciliation:

- The Notion page contains old build prompts, a 48-hour sprint, pricing experiments,
  early failed audits and links to prior PRD/decision versions. Preserve these as
  history; they do not restart work.
- Early September failed Stage 4.3 checks are followed by the v11.4.18 decision
  record of reviewed remediation. That does not establish production activation.
- Notion pricing experiments differ from the GitHub baseline. Do not turn them into
  a price change; the paused baseline and its decision IDs remain the reference.
- The former whole-site refactor and September deadline are paused history, not
  current AI-LIT scope or a current delivery commitment.
- Resume only after an explicit decision, recovery comparison, and review of open
  legal, privacy, production-migration and release gates.

<a id="my5-baseline"></a>
### Preserved MyFive requirements baseline

The following bounded section preserves the prior document verbatim. Its
references to "canonical", "active", "in scope", commands, deadlines and unified
website migration are scoped to the **paused MyFive baseline**. Current authority
and project state above take precedence. Its historical Notion-sync section is
superseded by the mirror contract in README and AGENTS.

<details>
<summary>MyFive baseline v1.7.5 — preserved for future resumption</summary>

<!-- BEGIN PRESERVED MY5 PRD -->
# MyFive + Green Elephant - Unified Refactor PRD - Master v1.7.5 - Stage 4.3-D Survivor-Custody Baseline

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
- optional user-connected Google Calendar events and explicit Google Drive exports: In scope with granular consent and minimum scopes
- behavioral response monitoring, NFI engagement scoring, and inferred relationship-health alerts: Excluded
- versioned nine-ValueRules™ bilateral gate before shared agreements: In scope
- accessible Resend administration, provider-health HUD, and incident-mode audit controls: In scope without activating outbound email
- 1Password human credential vault with Replit-managed runtime secrets: In scope; runtime vault connection and automatic rotation deferred
- versioned internal human-agency and safety evaluation: In scope; not a certification
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
- each participant must individually accept all nine current ValueRules™ before shared-agreement access
- private product use, export, deletion, withdrawal, and subscription access must not be blocked by the shared-agreement gate
- material ValueRules™ revisions require a new version and fresh acceptance for further shared-agreement use
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
- named, least-privilege break-glass support with a 24-hour maximum, automatic expiry, immediate revocation, and audit trail
- provider- and workflow-specific kill switches plus a global emergency stop
- transactional communications controls
- accessible Resend status, category, preview, failure, queue, suppression, audit, and recovery controls without implicit send activation
- owned incident playbooks and a human-triggered redacted diagnostic bundle
- service-by-service recommissioning checks after an emergency stop
- metadata-only provider and pipeline health HUD with semantic-table fallback and explicit stale or unknown states
- prominent incident-mode state with purpose-limited security audit coverage

### Module 4 - Connections, Notifications, and Pacing

Required capabilities:

- user-configurable pacing and quiet hours
- optional, explicitly selected Fibonacci pacing curves
- reversible pause/mute controls
- per-connection or per-reminder controls
- timezone-aware scheduling behavior
- optional user-connected Google Calendar events and explicit Drive exports

Boundaries:

- pacing must never become coercive
- pacing defaults must be safe, understandable, and easy to disable
- no behavioral response monitoring, inferred engagement-risk scoring, or relationship-health alerting
- delivery throttling may use technical provider errors and queue health, not personal responsiveness

### Module 5 - Architecture, Security, and Delivery

Target architecture:

- SvelteKit + Svelte 5 UI/runtime
- Zero client-server synchronization with an authoritative server and a client-side cache
- Neon PostgreSQL + Drizzle ORM
- Stripe checkout and subscription events
- Replit Reserved VM runtime
- 1Password as the human-controlled credential vault and Replit-managed environment secrets for runtime injection

Experience rendering constraints:

- WebGPU, particles, bloom, and advanced SVG are optional progressive enhancements
- essential journeys must work without WebGPU and with reduced motion enabled
- conventional cards, tables, grids, and boundaries are permitted when they improve accessibility, comparison, hierarchy, or operational control
- privacy, consent, payment, safety, and error-recovery controls must remain visually explicit
- operational colour, glow, and motion must always have textual, semantic, timestamped status equivalents

Security and credential constraints:

- provider-health interfaces expose metadata and evidence state, never secret values or private payloads
- runtime 1Password Connect, automated provider-key rotation, secret synchronization, and offsite log destinations require separate proof and approval
- migration must not rotate or invalidate working production credentials before dependent old and new workflows pass coordinated continuity checks
- incident logs exclude secrets, payment-card data, private vault data, private reflections, and unrestricted payloads

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
| UX-009 | Retention | User controls pacing presets, quiet hours, pause/off, timezone, and per-connection or per-reminder behavior | M4 | settings UI + scheduler | control persistence, opt-out, timezone, and job-cancellation tests |
| DAT-001 | Trust | Private and shared data are structurally isolated | M2 | schema boundaries + query guards | data-boundary test pack |
| DAT-002 | Consent | Shared agreement requires bilateral explicit consent | M2 | consent gating + ledger | consent gate integration tests |
| DAT-003 | Sovereignty | User can export account data | M2 | export pipeline | export contract tests |
| DAT-004 | Sovereignty | Account deletion removes the subject's account and author-owned data without erasing another participant's independently authored data; shared records follow their explicit lifecycle policy | M2 | classified deletion pipeline | two-participant, both-order deletion integrity tests |
| DAT-005 | Ontology | Eight Lenses and Eight Loves remain independent while sharing the approved visual taxonomy | M1/M2 | design tokens + separate schemas | schema independence and token mapping tests |
| DAT-006 | Shared consent | Both participants individually accept the same version of all nine ValueRules™ before shared-agreement access without blocking private use | M1/M2 | consent gate + append-only ledger | nine-item, bilateral, version, reconsent, withdrawal, and private-use tests |
| DAT-007 | Shared-record custody | After one participant deletes their account, the surviving participant retains read, export, and delete access to a frozen joint agreement until they delete it or their account, subject to the recorded production legal gate | M2 | participant lifecycle + frozen agreement state | survivor access, identifier removal, no-edit, final-erasure, and rights-request tests |
| PAY-001 | Monetization | Primary membership is €4.99/month and supports five sponsored partner connections; no annual plan is offered without separate approval | M1/M5 | Stripe checkout + subscription APIs + entitlement model | price, interval, sponsorship, and annual-plan absence tests |
| ADM-001 | Operations | Roles are least-privilege and enforce boundaries | M3 | RBAC and admin endpoints | role access matrix tests |
| ADM-002 | Operations | Scoped provider/workflow switches and a global emergency stop safely pause outbound work and support controlled restart | M3 | control plane toggles + queues | isolation, pause, backlog, duplicate-suppression, and recommissioning tests |
| ADM-003 | Support | Named break-glass grants expire within 24 hours, are immediately revocable and audited, and cannot expose private vault data | M3 | privileged-access service + audit ledger | grant, scope, expiry, revocation, misuse, and private-data-denial tests |
| ADM-004 | Incident response | Operators have owned playbooks and can create a redacted diagnostic bundle without secrets or private payloads | M3/M5 | runbooks + diagnostic exporter | scenario exercises, redaction fixtures, access, retention, and deletion tests |
| ADM-005 | Email operations | Accessible Resend administration exposes safe status, preview, test, delivery, suppression, audit, and recovery controls without implicitly activating sends | M3 | admin control plane + Resend adapter | default-off, authorization, redaction, preview, test-send gate, failure, and recovery tests |
| ADM-006 | Operational visibility | Provider and pipeline health is shown through a metadata-only visual map and equivalent semantic table with explicit timestamp and unknown state | M3/M5 | health collectors + admin HUD | accessibility, staleness, authorization, redaction, and switch-confirmation tests |
| INT-001 | Optional Google connection | User separately authorizes minimum-scope Calendar event operations and explicit Drive exports | M4/M5 | Google OAuth + provider adapters | scope, consent, write preview, disconnect, token-revocation, and cross-account tests |
| SAF-001 | Non-surveillance | The product does not score ignored notifications, infer relationship health, or alert admins about individual responsiveness | M2/M4 | scheduler + telemetry boundaries | prohibited-signal, admin-visibility, aggregation, and retention tests |
| SEC-001 | Credential handling | 1Password holds human-managed credential inventory while Replit injects least-privilege runtime secrets; automated vault connectivity remains absent until separately approved | M3/M5 | secret inventory + runtime configuration | repository scan, access review, rotation rehearsal, recovery, and no-runtime-vault-dependency tests |
| SEC-002 | Incident audit | Active emergency controls produce a prominent incident state and purpose-limited security events without secrets or private content | M3/M5 | admin shell + audit service | activation, correlation, integrity, retention, authorization, and prohibited-payload tests |
| ARC-001 | Delivery | New features are implemented on SvelteKit target stack | M5 | repo architecture + CI checks | architecture gate checklist |
| ARC-002 | Operations | Runtime capacity and cost controls can scale with measured demand | M5 | Replit deployment + billing controls | capacity, invoice, alert, and approval review |
| ARC-003 | Migration | MyFive proves the exact SvelteKit/Svelte 5/Zero/Neon/Replit topology before root-site cutover begins | M5 | MyFive proof deployment + test harness | proof record covering auth, privacy, sync, reconnect, redeploy, and rollback |
| MIG-001 | Migration | Refactor Stage 2 begins immediately after recorded Stage 1 exit evidence | M5/M6 | delivery plan + migration ledger | timestamped Stage 1 exit and Stage 2 start records |
| MIG-002 | Proof gate | The exact synthetic paid MyFive connection journey passes on the target stack before Stage 2 begins | M1-M5 | test deployment + providers + evidence pack | checkout, entitlement, invitation, consent, profile, agreement, export, deletion, sync, and rollback tests |
| MIG-003 | Schedule | The approved two-stage refactor targets 2026-09-06 23:59 Europe/Helsinki without weakening any gate | M5/M6 | plan + migration ledger | scope, timestamp, evidence, deviation, forecast, and no-forced-cutover review |
| CON-001 | Continuity | Legacy production surfaces remain available until each replacement passes its cutover gate | M6 | routing, compatibility adapters, deployment controls | old/new parity, smoke, and rollback tests |
| CON-002 | Revenue | Existing Green Elephant purchase and fulfilment paths remain operational throughout migration | M6 | public site + Stripe + Typeform + Satellite Scan workflows | synthetic purchase-to-fulfilment test and operational reconciliation |
| CON-003 | Integrations | Existing Google, Typeform, Resend, Neon, and operational Notion workflows preserve current behavior during migration | M6 | provider adapters, callbacks, jobs, and schedulers | provider contract tests, callback verification, job health, and duplicate suppression |
| CON-004 | Stabilization | Each cutover receives its approved risk-based observation window and retains verified rollback for at least 24 hours | M6 | health monitoring + per-surface ledger | risk class, continuous window, synthetic reconciliation, incident reset, and rollback-retention tests |
| GOV-001 | Governance | Product work and release claims use the canonical Alpha, Beta, and Theta labels | M5 | PRD, decision log, roadmap, and release records | evidence-backed phase-gate review |
| GOV-002 | Human agency | A versioned internal evaluation maps accessibility, privacy, consent, reversibility, non-surveillance, human authorship, and safety checks to inspectable evidence without certification claims | M1-M6 | evaluation checklist + evidence index | traceability, owner, result, remediation, trigger, and prohibited-claim review |

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

Given participant A confirms account deletion while participant B has independently authored records and a bilateral joint agreement

When deletion is executed

Then A's account access, participant relation, author-owned records, direct agreement identifiers, and consent-receipt links shall be removed according to the classified deletion policy

And B's independently authored records shall remain intact

And the joint agreement shall become permanently frozen while remaining readable, exportable, and deletable only by B

And subsequent authenticated fetches shall return no active account profile for A

And the frozen agreement shall be erased when B deletes it or B's account, whichever occurs first

And accepting A's deletion request shall atomically persist a durable request,
set A's account to `deletion_pending`, rotate A's auth version, and revoke every
stored session before external billing work begins

And every password, OAuth, profile, and protected-resource path shall reject a
pending account or stale auth version, while delayed Stripe webhooks shall not
restore an entitlement for that account

And Stripe customer deletion or subscription cancellation shall run outside the
PostgreSQL transaction with idempotent handling for an already-absent resource,
bounded retry for timeouts, rate limits, and provider 5xx responses, and an
`action_required` state for a non-retryable provider or configuration rejection

And database erasure shall begin only after billing completion is durably
recorded, shall be idempotent, and shall resume without repeating confirmed
billing work after a database failure

And the user-visible response shall distinguish `pending`, `completed`, and
`action_required`, shall say when the account is already locked and signed out,
and shall never claim a cross-system atomic rollback

And deletion operations shall record only allowlisted state, phase, attempt,
timestamp, and error-code evidence without Stripe identifiers, tokens, email
addresses, card data, agreement text, private profiles, or check-in content.

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

### AC-017 Break-glass expiry and isolation

Given a named authorized operator receives a break-glass grant for a recorded support reason

When the approved scope is used, revoked, or reaches its expiry within 24 hours

Then every event shall be appended to the administrative audit trail

And the operator shall never gain access to private browser vaults, private Connection Profile payloads, secrets, or payment-card data.

### AC-018 Layered emergency stop and recovery

Given one outbound provider or workflow is unsafe

When an operator activates its scoped kill switch

Then new work for that scope shall pause without deleting data or falsely completing queued work

And unaffected revenue workflows shall continue where isolation is technically safe

And recommissioning shall require the recorded recovery checklist.

### AC-019 Redacted emergency bundle

Given an authorized operator deliberately requests an incident diagnostic bundle

When the bundle is created

Then its creation and access shall be audited

And it shall contain only purpose-limited operational metadata with no credentials, tokens, payment-card data, private vault content, private reflections, or unrestricted raw payloads.

### AC-020 Granular Google connection

Given a user wants a MyFive Calendar event or Drive export

When the user authorizes that capability

Then the interface shall identify the Google account, requested operation, destination, and minimum verified scope

And Calendar and Drive consent shall remain separately revocable

And no unrelated Google data shall be collected in the background.

### AC-021 User-controlled pacing without response surveillance

Given a user enables a pacing preset

When the user changes quiet hours, pauses a connection, or disables pacing

Then future jobs shall follow the new setting and disabling shall stop future pacing jobs

And the system shall not use ignored notifications, response timing, or partner behavior to score engagement, infer relationship health, or alert administrators.

### AC-022 Versioned bilateral ValueRules™ gate

Given two participants want to use a shared agreement

When either participant has not individually accepted all nine items in the current ValueRules™ version

Then shared-agreement access shall remain blocked without blocking either participant's private product use

And each acceptance or withdrawal shall remain separately attributable in the append-only consent ledger.

### AC-023 Default-off Resend control plane

Given an administrator opens the Resend control plane

When no separately approved outbound configuration is active

Then the interface may show redacted configuration state, previews, failures, queues, suppression, and recovery guidance

But it shall not send a production or test message without an authorized sender, recipient, category, template, and active scoped switch.

### AC-024 Accessible metadata-only health HUD

Given a provider-health signal is healthy, paused, degraded, stale, or unknown

When an authorized operator views the operational HUD without colour or motion

Then the equivalent semantic table shall identify the state, evidence timestamp, source, owner, switch state, and safe next action

And neither view shall expose secret values or private payloads.

### AC-025 Credential-boundary continuity

Given a working legacy workflow depends on a production credential

When the replacement workflow is being prepared

Then the credential shall not be moved, rotated, invalidated, or removed until both paths pass coordinated authentication, callback, continuity, recovery, and rollback checks

And runtime 1Password connectivity or automatic rotation shall remain absent unless separately proven and approved.

### AC-026 Purpose-limited incident mode

Given a break-glass grant or emergency switch becomes active

When an authorized operator uses or ends the emergency control

Then an accessible incident-mode state and correlated audit events shall record the authorized operational facts

And logs shall exclude credentials, tokens, payment-card data, private vault data, private reflections, and unrestricted payloads.

### AC-027 Internal human-agency evaluation

Given a release candidate reaches its review gate

When the versioned internal human-agency and safety evaluation is completed

Then each applicable item shall identify its requirement, owner, evidence, result, remediation, and re-evaluation trigger

And the result shall not be represented as clinical validation, ethical certification, guaranteed safety, or universal suitability.

### AC-028 Exact MyFive proof journey

Given two synthetic participants and Stripe test mode are isolated from production users and charges

When the primary participant completes monthly checkout, sponsors the second participant, both accept the current nine ValueRules™, a private eight-dimensional Connection Profile is created, a consent-gated shared agreement is created, and the test accounts are exported and deleted

Then entitlement, seat limits, consent receipts, private/shared isolation, webhook idempotency, synchronization, reconnect, redeploy, export, deletion, rollback, and legacy-regression evidence shall pass

And Stage 2 shall begin only after the Stage 1 completion evidence is recorded in the decision log.

### AC-029 Sunday target without forced cutover

Given the approved refactor target is 2026-09-06 at 23:59 Europe/Helsinki

When a replacement surface has not passed every applicable gate by that time

Then its verified legacy path shall remain operational

And the unmet evidence and new forecast shall be recorded instead of forcing cutover or claiming completion.

### AC-030 Risk-based stabilization and rollback

Given a replacement slice has passed its applicable parity checks

When it enters stabilization

Then it shall complete a continuous 15-minute static/read-only, 30-minute authenticated/stateful, or 60-minute revenue/external-integration observation window according to its recorded risk class

And the highest-risk class shall include a fully reconciled synthetic success with no unresolved critical error

And the verified legacy rollback path shall remain recoverable for at least 24 hours after cutover.

### AC-031 Surviving-participant agreement custody

Given two verified participants accepted the current ValueRules™ and created a joint agreement under the disclosed survivor-custody terms

When either participant deletes their account

Then the deleted account shall lose all agreement access immediately and permanently

And the agreement shall be immutable and unavailable to new partners, relinking, search, analytics, training, or administrative browsing

And the deleted account ID, cross-subject consent receipt IDs, invitation contact data, and unnecessary linkage metadata shall be erased or de-identified

And the remaining participant alone may read, export, or delete the frozen text

And free text shall be treated as potentially identifying both participants even after direct identifiers are removed

And an erasure, restriction, or objection request concerning retained text shall enter a documented human review rather than be automatically denied

And the last participant's deletion shall erase the text and remove the final relationship shell

And production activation shall fail closed until qualified privacy review records the purpose, lawful basis, retention criterion, rights process, notices, and backup-erasure procedure.

### Stage 4.3-D survivor-custody specification

The approved product purpose is to preserve the surviving participant's access to a joint record they co-created or relied upon. That purpose does not, by itself, establish a lawful basis. Before production activation, Green Elephant shall record the applicable Article 6 lawful basis and obtain qualified privacy review. If Article 6(1)(f) legitimate interests is proposed, the record shall identify a lawful, present, and precisely articulated interest, prove that continued processing is necessary, balance it against the deleted participant's rights and reasonable expectations, and document how objections will be assessed. If agreement text may contain special-category data, the review shall also identify an applicable Article 9 condition or prevent that processing.

The retention criterion is: keep the frozen agreement until the surviving participant explicitly deletes it or the surviving participant's account is deleted, whichever occurs first. A record shall never remain after the last participant is gone. The survivor may read, export, and delete it, but may not edit it, reopen it for collaboration, connect it to another person, or expose it through a shared or administrator view. The service shall not use frozen text for search, recommendations, analytics, model training, or any new purpose.

At agreement creation, both participants shall see this text before giving the consent that unlocks shared writing:

> This is a joint record. If either participant deletes their account, that account immediately loses access. The remaining participant may continue to read, export, and delete the frozen agreement until they delete it or their account. Green Elephant removes the deleted account's direct identifiers, does not permit further editing or sharing through MyFive, and handles any erasure or objection request under the published privacy process.

At account deletion, the deleting participant shall see this text before final confirmation:

> Deleting your account removes your private and account data and permanently revokes your access. A frozen copy of each joint agreement may remain available only to the other participant until they delete it or their account, subject to Green Elephant's published lawful-basis and rights-request process. Free text may still refer to you. Export anything you need before deleting.

The UI shall discourage legal names and highly sensitive details in agreement text, keep the field purpose narrow, and explain that de-identifying database columns cannot remove references written into free text. Access logs shall record survivor reads, exports, and deletion without copying agreement content. Erasure shall propagate through live stores and the documented backup lifecycle, and restored backups shall reapply completed erasure requests before serving data.

The production-readiness record shall link the lawful-basis assessment, privacy notice, rights-request runbook, retention/deletion matrix, backup procedure, security controls, and accountable approver. This specification authorizes implementation and disposable-fixture proof. It does not authorize a production migration, deployment, or claim that Option C is legally sufficient without the recorded review.

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

- [ ] Authenticate a synthetic primary participant and complete the `€4.99/month` Stripe test-mode checkout through webhook-backed five-seat entitlement.
- [ ] Sponsor and accept one invitation with a second synthetic participant, then record separate current nine-ValueRules™ consent receipts for both participants.
- [ ] Create and review one private eight-dimensional Connection Profile, prove that it does not leak to the partner, and create one shared agreement only after bilateral consent.
- [ ] Export and delete the synthetic accounts and current-browser test vault data through the approved sovereignty flows.
- [ ] Execute the journey through UI, authenticated API, Drizzle data access, Zero synchronization where approved, and user-visible error handling.
- [ ] Prove authentication, authorization, consent versioning, seat boundaries, webhook idempotency, and private/shared data isolation.
- [ ] Test reconnect, redeploy, rollback, duplicate events, partial failure, and intermittent connectivity without promising offline writes.
- [ ] Record measured performance and connection behavior as evidence under DEC-036 rather than guaranteed claims.

Stage 1 exit criteria:

- the bounded MyFive journey passes functional, privacy, security, sync, deployment, and rollback tests
- all proof identities, payments, destinations, connections, profiles, and agreements are synthetic, test-bound, and reconciled or deleted
- exact Zero/Svelte/Neon/Replit behavior is recorded
- no regression is detected in the current Green Elephant site
- the decision log records Stage 1 completion before implementation claims advance

### Refactor Stage 2 - Green Elephant root-site refactor

Begin immediately after Stage 1 exit evidence is recorded. Use reversible vertical slices and retain the legacy implementation for each surface until that slice completes its stabilization gate.

Delivery target: complete the approved refactor scope by `2026-09-06T23:59:00 Europe/Helsinki`. This target never overrides an evidence, parity, privacy, continuity, stabilization, reconciliation, or rollback gate. A missed gate keeps the legacy path live and requires a recorded forecast rather than a forced cutover.

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
- [ ] Port the default-off Resend control plane, metadata-only health HUD, scoped emergency controls, incident-mode state, and audit behavior without exposing secrets or activating new message categories.
- [ ] Inventory and verify Google OAuth, Sheets, Analytics, Gmail, Fonts, and documented Slides dependencies separately; do not treat “Google” as one credential or scope.
- [ ] Verify least privilege, cross-user isolation, callback origins, token handling, and break-glass audit behavior.
- [ ] Verify MyFive Calendar and Drive operations use separate consent, minimum scopes, explicit write intent, and independent revocation without changing established Green Elephant Google behavior.

#### Migration Step 2.6 - Stabilization and legacy retirement

- [ ] Run production smoke checks for public discovery, forms, login, checkout, Satellite Scan fulfilment, email automation, portal, and admin operations.
- [ ] Classify and record each slice as static/read-only, authenticated/stateful non-revenue, or revenue/external-integration; use the higher class when uncertain.
- [ ] After parity checks pass, observe static/read-only slices continuously for at least 15 minutes and authenticated/stateful non-revenue slices for at least 30 minutes.
- [ ] Observe revenue and external-integration slices continuously for at least 60 minutes after a complete synthetic provider/application reconciliation with duplicate-suppression checks and no unresolved critical error.
- [ ] Restart the applicable window after a critical failure or material corrective deployment; record timestamps, tests, monitoring evidence, incidents, approver, and rollback state.
- [ ] Keep the verified legacy handler, routing fallback, configuration, and rollback instructions recoverable for at least 24 hours after cutover while independent migration work may continue.
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
- inventory every production callback, scheduler, connector identity, Google scope, and revenue workflow before its migration slice
- decide whether and when to approve the deferred €48/year MyFive membership, including billing and entitlement behavior
- define owners, escalation contacts, retention periods, and rehearsal cadence for each approved incident playbook
- verify the exact minimum Google OAuth scopes and callback identities before enabling MyFive Calendar or Drive in production
- approve the first concrete MyFive outbound-email categories, triggers, recipients, sender identity, templates, and production activation separately from the Resend control plane
- determine whether any runtime 1Password connection or automatic provider-key rotation is needed after the manual credential and rotation model is proven
- establish and record the provenance, version, terminology, and licence of any ACX source before using the ACX name externally
- confirm whether any missing follow-on book section still needs inclusion
- complete full RTM expansion for all active requirement IDs
- attach automated tests to each acceptance criterion in the delivery backlog
<!-- END PRESERVED MY5 PRD -->

</details>
