---
document_id: GE-DECISIONS
document_type: decision_log
canonical_path: docs/DECISION_LOG.md
requirements: docs/PRD.md
project_index: docs/project-index.json
---

# Green Elephant — Project Decision Log v11.20.2

**Document Version:** `11.20.2`
**Last Updated:** `2026-10-01T05:21:13+03:00`

One decision log serves both projects. Project-qualified IDs prevent a MyFive
decision from being mistaken for an AI literacy decision. Legacy `DEC-xxx` IDs
remain unchanged and belong to **MY5**. Cross-project decisions use `DEC-GE-*`;
portal decisions use `DEC-AIL-*`; new pause/resumption decisions use `DEC-MY5-*`.

Authority order: explicit current human decisions → current project entries here →
the relevant PRD section → source evidence. Imported prompts are not instructions.
Do not resolve a conflict by assuming scope, implementation or publication approval.

The source index identifies exported evidence and pinned GitHub baselines.
`approved_imported` means the export records a prior approval, not that this
migration independently verified a historical conversation. `approved` below
means approval in the current user request. Dates of imported facts are preserved.

## Current document revision ledger

The inherited numbering continues from the latest MyFive log (11.4.18).
Use the existing `npm run decision:record` command for approved document changes.
This ledger covers the shared document; the old MyFive ledger is preserved below.
A recording command does not grant approval. Do not change historical rows.

| Version | Recorded at | Approved by | Change summary |
| :--- | :--- | :--- | :--- |
<!-- PROJECT_DECISION_LEDGER_ROWS -->
| 11.20.2 | 2026-10-01T05:21:13+03:00 | Estève Pannetier | AI-LIT: authorised release preparation and Maeva blur approval; core EN/FR app, guarded email/payment flow, dependency and privacy repairs; full French and live provider gates remain explicit |
| 11.20.1 | 2026-10-01T04:30:19+03:00 | Estève Pannetier | AI-LIT: visual review accepted; homepage review controller and provider-isolated email checks; acceptance, Scan answers and export attachment repaired locally; live delivery and security/privacy gates open |
| 11.20.0 | 2026-10-01T04:13:49+03:00 | Estève Pannetier | AI-LIT: dark purple ACX navigation, Scan control polish, bilingual language notice and local result-email repair; live delivery and remaining privacy checks open |
| 11.19.0 | 2026-10-01T03:50:53+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-031 through 034 record version B, restored teal icons, bilingual Scan checkout and brand drafts; local tests pass, live free-order test returns 403 and email/privacy gates remain open |
| 11.18.0 | 2026-10-01T03:10:46+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-030 records Scan buying links, ordered ACX contents, research philosophy and two illustrated article options; originals preserved and local checks pass |
| 11.17.0 | 2026-10-01T03:00:19+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-029 records authentic AI writing, conscious prompting, communication rhythm, Arbora attribution and full French scope; homepage/article translation batch prepared and locally checked |
| 11.16.1 | 2026-10-01T02:40:48+03:00 | Estève Pannetier | AI-LIT: ACX draft build and eight HTTP checks pass; unchanged TypeScript baseline, retained footer links and pending browser review recorded |
| 11.16.0 | 2026-10-01T02:38:20+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-028 records Speech Lab styled ACX guide, communication icons, original wordmark font and Scan learning support; local drafts await review |
| 11.15.0 | 2026-10-01T02:14:44+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-027 approves 1–5 coaching capacity, distinct offers, portrait and coach titles; practical communication examples and bios prepared in concept 05 |
| 11.14.2 | 2026-10-01T02:01:24+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-026 records smooth gradients, plain-language direction and two private Maeva image variants; final copy and image approval remain open |
| 11.14.1 | 2026-10-01T01:47:30+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-025 restores retained footer sitemap links in concept 03 and adds the missing public Signals URL to the XML sitemap |
| 11.14.0 | 2026-10-01T01:43:36+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-024 approves dark-only brand continuity and content direction; concept 02 remains a local visual review candidate |
| 11.13.3 | 2026-10-01T01:30:15+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-023 records Maeva source choice and private design preview; SEO handoff remains research with crawler and publication gates open |
| 11.13.2 | 2026-10-01T01:15:54+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-022 records bounded header accessibility repair, passing local checks and open browser acceptance; PR boundaries remain proposed |
| 11.13.1 | 2026-10-01T01:06:26+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-021 local parking validated with production build and seven HTTP tests; baseline TypeScript/audit debt and browser review remain explicit |
| 11.13.0 | 2026-10-01T01:01:54+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-021 approves parking webinar, webinars and calendar pages while preserving their sources and data |
| 11.12.2 | 2026-10-01T00:49:47+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-020 approves training-page copy and Maeva homepage placement; replacement image and Drive source link pending |
| 11.12.1 | 2026-10-01T00:45:31+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-019 approves EUR 100 extra-participant pricing and conditional VAT wording; authorises short training-page draft for review |
| 11.12.0 | 2026-10-01T00:42:08+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-018 approves discovery workshop duration, group size, base price, inclusions and English-first release; surcharge amount and conditional VAT wording remain open |
| 11.11.0 | 2026-10-01T00:31:00+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-017 approves five-section homepage and complete communication-layer coverage; reconciles incoming navigation handoff without adopting conflicting audience, menu, prices or release language |
| 11.10.0 | 2026-10-01T00:25:53+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-016 approves AI Literacy Training, Our Approach and About main navigation, Calendly CTA and logo-to-Home link; page outlines and URLs remain open |
| 11.9.2 | 2026-10-01T00:21:02+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-015 confirms optional Fathom recording with explicit agreement before starting; Esteve will apply replacement Calendly copy manually |
| 11.9.1 | 2026-10-01T00:18:28+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-014 records Esteve-confirmed Calendly URL and public page/host verification; event copy and recording policy remain open while the event is being revised |
| 11.9.0 | 2026-10-01T00:06:54+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-014 selects Discuss your training needs as the homepage CTA linking to a Calendly discovery call with Esteve; exact event URL remains pending |
| 11.8.0 | 2026-10-01T00:02:55+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-013 corrects ACX 4 to team members within an organisation; approves four-day practice depth and limits discovery workshops to mapping plus ACX 1-2 practical takeaways |
| 11.7.0 | 2026-09-30T23:57:22+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-011 approves training/main-menu and supporting-service/footer placement; DEC-AIL-012 adopts author-supplied ACX pedagogy with distinct source provenance and open curriculum-depth gates |
| 11.6.0 | 2026-09-30T23:43:44+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-008/009/010 record confidence-first human-centred positioning, retained coaches and supporting services, four-day beginner journey and existing-stack boundary; detailed curriculum and placement gates remain open |
| 11.5.0 | 2026-09-30T23:28:24+03:00 | Estève Pannetier | AI-LIT: DEC-AIL-007 approves independent-professional message priority with team, entrepreneur, intrapreneur and HR/union-funded training compatibility; offer and implementation gates remain open |
| 11.4.19 | 2026-09-30T20:29:16+03:00 | Estève Pannetier | DEC-GE-PRD-001: consolidate one PRD and decision log with separate AI-LIT discovery and paused MY5 scopes; preserve branch history and source provenance |

<a id="shared-decisions"></a>
## Shared documentation decisions

<a id="dec-ge-prd-001"></a>
### DEC-GE-PRD-001 — GitHub authority and two project scopes

- **Project:** shared
- **Status:** approved
- **Decision date:** 2026-09-30
- **Approver:** Estève Pannetier
- **Approval evidence:** current request: "This is good. I want to do that with GitHub as the main" and the request for one PRD, one log, separated My5/AI literacy and agent guidance.
- **Decision:** `docs/PRD.md` is the single editable requirements document;
  `docs/DECISION_LOG.md` is the single decision authority. Both distinguish AI-LIT
  and MY5. Notion holds derived mirrors. README and the machine-readable index
  route readers to these documents; they do not contain alternate requirements.
- **Organization selected for this local candidate:** sections in the existing pair
  of files, stable project/requirement/decision IDs, and a reference-only JSON index.
  This fulfills the requested one-pair structure without additional project logs.
- **Supersedes:** SRC-AI-LIT's 2026-09-30 Notion-as-canonical SSOT and governance
  entries, its cross-platform handoff protocol, and conflicting repository-wide
  authority language in the legacy MyFive baseline. History remains preserved.
- **Scope limit:** local documentation consolidation. Does not resume MyFive,
  select the portal's stack, authorize a feature build, merge, push or deploy.
- **Affected requirements:** GE-PRD authority; AI-LIT and MY5 sections.
- **Delivery status:** local candidate; mirrors and GitHub main await publication.

<a id="ai-literacy-decisions"></a>
## AI-LIT decisions and pending choices

| ID | Status | Date | Approver attribution | Decision | Source / affected PRD |
| --- | --- | --- | --- | --- | --- |
| DEC-AIL-001 | approved_imported | 2026-09-30 | Estève, as recorded in SRC-AI-LIT | Simplify greenelephant.org into an AI literacy training portal. Discovery only. | SRC-AI-LIT, Decisions; AI-LIT purpose |
| DEC-AIL-002 | approved_imported | 2026-09-30 | Estève, as recorded in SRC-AI-LIT | Serve engineers/professionals in teams and independent professionals/solopreneurs. Reference contexts do not grant public-use consent. | SRC-AI-LIT, Decisions; AI-LIT-REQ-001 |
| DEC-AIL-003 | approved_imported | 2026-09-30 | Estève, as recorded in SRC-AI-LIT | English/French reach across Finland, UK, France and wider Northern Europe; launch order remains open. | SRC-AI-LIT, Decisions; AI-LIT-REQ-002 |
| DEC-AIL-004 | approved_imported | 2026-09-30 | Estève, as recorded in SRC-AI-LIT | Keep MyFive separate and paused; do not inherit its architecture or tasks. | SRC-AI-LIT, Decisions and Architecture distinction; AI-LIT exclusions |
| DEC-AIL-005 | superseded | 2026-09-30 | Historical attribution in SRC-AI-LIT | Notion owns the portal PRD and decisions; GitHub owns technical evidence. Superseded by DEC-GE-PRD-001. | SRC-AI-LIT, Approved SSOT / Approved governance |
| DEC-AIL-006 | pending | 2026-09-30 | None | Niche, priority problem, offer, conversion, language rollout, access model, architecture and baseline remain undecided. | AI-LIT-TBD-001 through AI-LIT-TBD-009 |


<a id="dec-ail-007"></a>
### DEC-AIL-007 — Independent-professional priority with organisational compatibility

- **Project:** AI-LIT
- **Status:** approved
- **Decision date:** 2026-09-30
- **Approver:** Estève Pannetier
- **Approval evidence:** workshop response: "independent professionals, yes";
  includes lawyers, therapists, coaches, creatives, engineers, fractional EAs,
  consultants and teachers; "I want to be able to cater for both audiences."
  Estève also explicitly includes teams, independent entrepreneurs and
  intrapreneurs, with employer/HR budgets or union training as funding contexts.
- **Decision:** independent professionals lead the public message. The training
  offer must also be compatible with teams and people working inside organisations,
  including intrapreneurs. Support both individual enquiries and enquiries involving
  an employer/HR budget or union training programme. Do not restrict the offer to
  lawyers or infer a single profession from Maeva's testimonial.
- **Affected PRD IDs:** AI-LIT-REQ-001, AI-LIT-REQ-013, AI-LIT-TBD-001,
  AI-LIT-AC-001.
- **Refines / supersedes:** refines the broad audience direction in DEC-AIL-002;
  supersedes only the unresolved audience-priority aspect of DEC-AIL-006.
  Preserve both earlier rows as history; their other open choices remain open.
- **Open gates:** priority problem, search niche/market, offer format and price,
  primary conversion, language rollout, page/navigation structure, organisational
  purchasing process and funder-specific requirements. No claim of funding
  eligibility or accreditation is approved by this audience decision.
- **Delivery status:** recorded in the local working tree; not yet committed,
  pushed or merged. Website implementation and production release are not
  authorised by this record. MY5 remains paused and unchanged.

<a id="dec-ail-008"></a>
### DEC-AIL-008 — Human-centred AI literacy and confidence-first positioning

- **Project:** AI-LIT
- **Status:** approved
- **Decision date:** 2026-09-30
- **Approver / evidence:** Estève's initial brand/project boundaries and subsequent
  explicit selection of option A, confidence and independence with AI.
- **Decision:** lead with confidence and independence using AI, while retaining
  human judgement. Green Elephant remains a communication expert. AI augments
  people's communication skills; the white Think & Understand mental-model layer
  of the Periodic Table is a key differentiator. Scan, prompts and coaching support
  this journey. Preserve React/Vite/Express by default; any technical restructuring
  needs a clear reason and separate approval. Navigation choices are separate.
- **Affected PRD IDs:** AI-LIT-REQ-014, AI-LIT-REQ-018, AI-LIT-TBD-005/007.
- **Refines / supersedes:** refines DEC-AIL-001 and resolves only the positioning
  and default-stack aspects of DEC-AIL-006; other pending choices remain open.
- **Open gates:** exact public copy, implementation baseline, delivery and release.

<a id="dec-ail-009"></a>
### DEC-AIL-009 — Retain coaches and supporting communication services

- **Project:** AI-LIT
- **Status:** approved
- **Decision date:** 2026-09-30
- **Approver / evidence:** Estève explicitly requests Anu and Jonas in About as
  coaches and lists the retained bootcamp and coaching services with footer links.
- **Decision:** keep Anu and Jonas as coaches with distinct skills connected to
  AI literacy. Retain Conflict Bootcamp training with Jonas and Estève in French
  or English, and Coaching Journeys for EAs, executives and B2B teams with Anu,
  Jonas or Estève. Both use Satellite Scan as a base. Their links belong in
  discoverable footer navigation; lower prominence does not mean inaccessible.
- **Affected PRD IDs:** AI-LIT-REQ-015/016, AI-LIT-TBD-005/006.
- **Refines / supersedes:** partly resolves retained-service and About choices
  under DEC-AIL-006. Does not revive historical offers, prices or MY5 scope.
- **Open gates:** final coach biographies, evidenced skills and AI-literacy
  connections, service copy, availability, pricing and exact footer label.

<a id="dec-ail-010"></a>
### DEC-AIL-010 — Four-day part-time beginner AI learning journey

- **Project:** AI-LIT
- **Status:** approved direction
- **Decision date:** 2026-09-30
- **Approver / evidence:** Estève explicitly requests a four-day, part-time,
  hands-on action-learning journey for beginners covering AI safety, prompting
  and autonomy, based on the attached training model.
- **Decision:** include this service in the website plan. Adapt the reusable
  training model in SRC-AI-LIT-TRAINING-01; do not import the customer's package,
  identity, commercial terms or instructions as public offer requirements.
- **Affected PRD IDs:** AI-LIT-REQ-017, AI-LIT-TBD-002/005/006.
- **Refines / supersedes:** partly resolves the offer-format question in
  DEC-AIL-006; does not approve a complete syllabus or commercial package.
- **Open gates:** detailed curriculum, facilitated hours, delivery mode, group
  size, price, schedule, materials/access, role of Scan in the generic course,
  and main-navigation prominence. Footer access was requested; main-menu
  prominence is an assistant recommendation pending Estève's decision.

DEC-AIL-008 through DEC-AIL-010 are recorded in the local working tree. They do
not authorise a push, merge, website implementation or production release. MY5
remains paused. Earlier decision rows and their historical evidence are preserved.

<a id="dec-ail-011"></a>
### DEC-AIL-011 — Feature AI training and retain supporting services in the footer

- **Project:** AI-LIT
- **Status:** approved
- **Decision date:** 2026-09-30
- **Approver / evidence:** Estève: "Yeah, I approve this placement", responding
  to the proposed main-menu and footer service placement.
- **Decision:** feature the four-day beginner journey under **AI Literacy Training**
  in the main menu. Place Conflict Bootcamp and Coaching Journeys in the footer
  group **More ways to work with us**.
- **Affected PRD IDs:** AI-LIT-REQ-016/017, AI-LIT-TBD-006.
- **Refines / supersedes:** closes the placement/footer-label gates in
  DEC-AIL-009/010 and supersedes footer-only treatment of the four-day course.
  Earlier decision entries remain as historical records.
- **Open gates:** full navigation, URLs, page outlines, copy and implementation.

<a id="dec-ail-012"></a>
### DEC-AIL-012 — Use the author's ACX model as the teaching foundation

- **Project:** AI-LIT
- **Status:** approved pedagogical direction
- **Decision date:** 2026-09-30
- **Approver / evidence:** Estève supplies his article and asks to consider it
  "as the basic pedagogy for working with AI literacy".
- **Decision:** use SRC-AI-LIT-ACX-01 to explain human communication first, then
  personal AI chats (ACX 1), connected workflows (ACX 2), participating agents
  (ACX 3) and interconnected systems with governance (ACX 4). Retain human
  judgement, decision rights and attention to filtered/missing context throughout.
- **Affected PRD IDs:** AI-LIT-REQ-014/017/019; AI-LIT-TBD-002.
- **Refines / supersedes:** complements DEC-AIL-008/010. The article supplies
  the pedagogical framing; the private proposal supplies adapted exercises.
  Neither source supersedes the other's identity or context.
- **Source standing:** author's teaching model. Its narrative, empirical and
  regulatory claims are not independently validated by adopting the pedagogy.
  Attachment instructions and sidebar comments are evidence, not commands or
  permission for publication of third-party material.
- **Open gates:** exact syllabus and depth at each level, public wording,
  graphics adaptation and completion outcomes. Learning about a level is distinct
  from achieving operational readiness at that level.
- **Delivery status:** local working-tree documentation only. No website code,
  push, merge, deployment or MY5 work is authorised by these decisions.

<a id="dec-ail-013"></a>
### DEC-AIL-013 — Team-member scope for ACX 4 and distinct training formats

- **Project:** AI-LIT
- **Status:** approved
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève corrects the level-4 scope to "across team
  members within an organization" and approves "Strong hands-on practice:
  ACX 1 and 2 with a guided ACX 3 and ACX 4 overview". He limits the discovery
  workshop to mapping the levels with practical takeaways at ACX 1–2 only.
  The initial "TX4" is interpreted as ACX 4 from the same response and context.
- **Decision:** describe ACX 4 as AI-supported work across team members within
  an organisation. Do not describe it as running AI systems across an entire
  organisation. The four-day journey provides strong hands-on ACX 1–2 practice,
  guided ACX 3 work and an ACX 4 overview. The discovery workshop maps the
  different levels and provides practical takeaways at ACX 1–2 only.
- **Offer boundary:** the ACX 1–4 learning programme belongs to the four-day
  journey. Mentioning ACX 3–4 in a discovery map does not promise guided or
  practical work at those levels. Neither format promises mastery or operational
  readiness simply from attendance.
- **Affected PRD IDs:** AI-LIT-REQ-017/019/020, AI-LIT-TBD-002.
- **Refines / supersedes:** corrects the broad ACX 4 interpretation in
  DEC-AIL-012 and resolves its format-specific depth gate. Refines DEC-AIL-010's
  journey scope. Source screenshots and previous decision entries remain intact.
- **Open gates:** exact exercises and takeaways, completion outcomes, discovery
  duration, journey hours, group/individual mode, logistics, price and enquiry flow.
- **Delivery status:** local working-tree documentation. No website code,
  commit, push, merge or deployment follows from this record; MY5 stays paused.

<a id="dec-ail-014"></a>
### DEC-AIL-014 — Primary homepage action books a discovery call with Estève

- **Project:** AI-LIT
- **Status:** approved direction and user-confirmed destination; public page/host verified, full booking flow untested
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève: "a with Calendly link to book easily a
  discovery call with Esteve", selecting the proposed Discuss your training needs
  homepage action.
- **Decision:** label the primary homepage button **Discuss your training needs**
  and link directly to the Calendly event for a discovery call with Estève.
  Estève is the human contact for discussing training fit. This conversation is
  separate from the discovery workshop and the four-day training journey.
- **Affected PRD IDs:** AI-LIT-REQ-004/021, AI-LIT-TBD-003,
  AI-LIT-PROP-GROWTH-001.
- **Refines / supersedes:** resolves the primary-conversion/provider choice in
  DEC-AIL-006 and the enquiry-flow choice left open in DEC-AIL-013; does not
  change either training format's scope.
- **Initial evidence gap (resolved by the URL follow-up below):** repository inspection found Scan, feedback and another
  coach's Calendly events. Existing discovery-call buttons route to contact
  pages. None establishes the exact Estève discovery event; await its URL.
- **Open gates:** final event-copy alignment and recording policy, slot
  availability and complete booking-path verification. The supplied URL and host
  are verified as described below; old site copy is not the source for event details.
- **Scope:** direct booking link only. No new API integration, embedded scheduler,
  automatic outreach, website implementation, push, merge or release is approved
  by this documentation record. MY5 remains paused.

#### DEC-AIL-014 follow-up — confirmed booking destination, 2026-10-01

- **Approver / evidence:** Estève supplies the exact event URL and states that
  the existing Calendly event is being tweaked.
- **Approved URL:** [Free AI Literacy Discovery Call](https://calendly.com/greenelephant/free-ai-literacy-discovery-call).
- **Live verification:** a read-only public request on 2026-10-01 returned HTTP
  200 at the same URL. Page metadata identifies Free AI Literacy Discovery Call
  and Estève Pannetier's Calendar. No booking was made or personal data submitted.
- **Observed event copy, not a new website-copy approval:** the description says
  free, 30-minute, recorded conversation and leads with team leads, HR managers
  and leaders. Align the audience wording with DEC-AIL-007's independent
  professionals plus teams. Recording policy and final duration/cost wording
  remain for confirmation while the event is being edited.
- **Remaining verification:** available slots, complete booking flow and final
  event wording. Public page availability does not prove booking completion.
- **Delivery status:** destination saved in local canonical documents only;
  no Calendly settings or website code changed, and nothing published.

<a id="dec-ail-015"></a>
### DEC-AIL-015 — Optional Fathom recording and manual Calendly copy update

- **Project:** AI-LIT
- **Status:** approved
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève responds yes to optional recording with explicit
  agreement before it starts, confirms Fathom is used, and requests copy he can
  update himself before continuing the website workshop.
- **Decision:** recording with Fathom is optional. Ask for the participant's
  explicit agreement before recording starts; offer the call without recording.
  Supply draft Calendly wording that welcomes independent professionals and
  teams and distinguishes the discovery call from training. Estève applies it.
- **Affected PRD IDs:** AI-LIT-REQ-021, AI-LIT-TBD-003.
- **Refines / supersedes:** closes the recording-choice gate in DEC-AIL-014.
  Its prior page observation remains historical evidence. This decision does not
  treat a booking as recording consent or assert that tool settings enforce consent.
- **Delivery status:** decision recorded locally and replacement copy supplied
  in chat for Estève's review/manual update. No Calendly or Fathom settings changed;
  no recording, website implementation, push, merge or deployment performed.
- **Remaining work:** Estève applies the copy and ensures the actual call setup
  follows the agreed recording choice. Final event wording/booking checks remain.

<a id="dec-ail-016"></a>
### DEC-AIL-016 — Approve the main-menu structure

- **Project:** AI-LIT
- **Status:** approved
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève answers "yes" to the proposed main menu,
  Calendly button, logo-to-Home link and retained footer service group.
- **Decision:** main navigation is **AI Literacy Training** (discovery workshop
  and four-day journey), **Our Approach** (ACX and the Periodic Table's Think &
  Understand layer), and **About** (Estève, Anu and Jonas). The primary button is
  **Discuss your training needs**, linked to the Calendly event in DEC-AIL-014.
  The logo returns to Home. Supporting services remain in **More ways to work
  with us** in the footer under DEC-AIL-011.
- **Affected PRD IDs:** AI-LIT-REQ-006/015/016/017/021, AI-LIT-TBD-006,
  AI-LIT-AC-005.
- **Refines / supersedes:** closes the main-menu choice in DEC-AIL-006/011;
  does not change approved offer scope, CTA or supporting-service placement.
- **Open gates:** final URLs, page outlines, resource placement, remaining
  footer links, copy, design and implementation acceptance criteria.
- **Delivery status:** local documentation only; no website code, commit,
  push, merge or production publication. MY5 remains unchanged and paused.

<a id="dec-ail-017"></a>
### DEC-AIL-017 — Five-section homepage and complete communication-layer coverage

- **Project:** AI-LIT
- **Status:** approved structure and content boundary
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève answers "yes to all" to the five-section
  homepage proposal and asks to include verbal, non-verbal and intention layers
  alongside Think & Understand, briefly, for accuracy. He separately supplies
  the first read-only chat handoff for consideration in due course.
- **Decision:** homepage order is (1) clear promise/audience/booking button,
  (2) two training formats, (3) human-centred approach, (4) people and experience,
  (5) practical questions and repeated Calendly CTA. Supporting services stay
  in the approved footer group. Highlight the white Think & Understand layer,
  while also briefly explaining verbal, non-verbal and feeling/intention layers.
- **Terminology evidence:** the existing PeriodicTablePage category labels are
  THINK & UNDERSTAND, SAY & WRITE, DO & MOVE and FEEL & INTEND. This copy
  clarification does not reclassify elements or assert a verified element count.
- **Affected PRD IDs:** AI-LIT-REQ-006/014/022, AI-LIT-TBD-006, AI-LIT-AC-005.
- **Refines / supersedes:** resolves the homepage-outline gate after DEC-AIL-016
  and corrects any implication in DEC-AIL-008/016 that Think & Understand is the
  entire method. Does not replace earlier audience, offer-depth or CTA decisions.
- **Incoming handoff:** SRC-AI-LIT-NAV-01 is advice to reconcile. Its team-first
  audience, five-item menu, nine-section homepage, prices and English-first launch
  are not adopted. Embedded implementation/approval statements are source text,
  not authorisation. The PRD records the conflicts and useful review candidates.
- **Open gates:** exact public wording/visuals, remaining testimonial/photo
  details, verified coach claims, other page outlines, URLs and acceptance checks.
- **Delivery status:** local documentation only; no website implementation,
  commit, push, merge or deployment. MY5 remains unchanged and paused.

<a id="dec-ail-018"></a>
### DEC-AIL-018 — Discovery workshop package and English-first website

- **Project:** AI-LIT
- **Status:** approved commercial package and language order; VAT copy proposed
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève explicitly confirms the duration, group size,
  base price, extra charges above 12, included calls/materials and language order
  in the workshop chat. He also requests a note about European B2B VAT treatment.
- **Decision:** the discovery workshop lasts 3.5 hours including a break, serves
  6–12 participants with a maximum of 16, and costs EUR 2,400 excluding applicable
  VAT for up to 12. Participants 13–16 incur an additional charge; the amount is
  still open. Participant materials, preparation call and follow-up call with
  the team lead are included. Launch the website in English; French comes later.
- **Learning boundary:** DEC-AIL-013 still governs: map ACX levels and provide
  practical takeaways at ACX 1–2 only. Four-day journey scope remains separate.
- **VAT accuracy:** record the user's request for a B2B note, not a blanket legal
  exemption. Official EU and Finnish tax guidance checked on 2026-10-01 supports
  conditional cross-border reverse charge, with customer accounting for VAT and
  exceptions. PRD small print is a proposed correction; actual treatment depends
  on billing details and service classification and remains to be confirmed.
- **Affected PRD IDs:** AI-LIT-REQ-002/020/023, AI-LIT-TBD-002/004, AI-LIT-AC-004.
- **Refines / supersedes:** resolves the workshop duration, group-size, base-price,
  inclusions and language-order questions left open in DEC-AIL-003/013/017.
  Revises DEC-AIL-017's handoff disposition only for these explicit approvals.
  Earlier audience, navigation, homepage and CTA decisions remain in force.
- **Open details:** surcharge amount (handoff proposes EUR 100 per participant),
  call lengths, specific material formats, delivery mode, travel/venue terms,
  VAT copy/treatment, French-release timing and remaining four-day journey terms.
  The handoff's readiness poll is not adopted by this approval.
- **Delivery status:** local documentation only; no website implementation,
  commit, push, merge or deployment. MY5 remains unchanged and paused.

<a id="dec-ail-019"></a>
### DEC-AIL-019 — Extra-participant price, conditional VAT copy and page drafting

- **Project:** AI-LIT
- **Status:** approved pricing and conditional VAT wording; drafting authorised
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève explicitly approves EUR 100 plus applicable VAT
  per extra participant for participants 13–16, EUR 2,800 before VAT for 16,
  the proposed final VAT wording/applicable-treatment approach, and preparation
  of a short training-page draft.
- **Decision:** supplement the approved EUR 2,400 package for up to 12 with
  EUR 100 per participant above 12, maximum 16. Use the PRD's approved conditional
  VAT wording: VAT where applicable, reverse charge for eligible cross-border
  EU business purchases, treatment confirmed using billing details and service.
- **Boundary:** this approval closes the VAT wording and treatment-policy choice,
  not the factual determination of tax on a particular invoice. It does not
  adopt a blanket European B2B exemption. Existing learning scopes remain intact.
- **Drafting scope:** prepare concise English training-page copy in the existing
  PRD and workshop chat for review. Approval to draft is not approval of the
  resulting wording, website implementation or production publication.
- **Affected PRD IDs:** AI-LIT-REQ-023, AI-LIT-TBD-002, AI-LIT-AC-004.
- **Refines / supersedes:** closes DEC-AIL-018's surcharge amount and VAT-copy
  questions. Maeva placement and other visual-handoff questions remain open.
- **Delivery status:** local documentation and copy draft only; no website code,
  commit, push, merge or deployment. MY5 remains unchanged and paused.

<a id="dec-ail-020"></a>
### DEC-AIL-020 — Approve training copy and retain Maeva on the homepage

- **Project:** AI-LIT
- **Status:** approved copy and testimonial placement
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève states "yes this copy is good" and "Keep Maeva
  on the home page". He says he is preparing the image and will supply it through
  Google Drive so it can be available for the Replit handoff.
- **Decision:** approve the short English training-page copy presented in the
  workshop after DEC-AIL-019. Retain Maeva in the homepage people/experience
  section. Do not move or duplicate her testimonial onto the training page.
- **Source handoff:** replacement image and Google Drive link are pending;
  no file receipt, inspection, transfer or automatic Replit synchronisation is
  claimed. A versioned repository web asset is the assistant's recommended
  handoff; the original and provenance should be preserved.
- **Affected PRD IDs:** AI-LIT-REQ-022/024, AI-LIT-TBD-006.
- **Refines / supersedes:** approves DEC-AIL-019's resulting copy and confirms
  DEC-AIL-017's homepage placement over the later visual handoff's conflicting
  training-page-only proposal. Other visual questions remain separate.
- **Open details:** receive and inspect the replacement image, confirm final
  testimonial wording/translation, public attribution and crop; complete the
  remaining visual and implementation review.
- **Delivery status:** local documentation only; no website code, image edit,
  commit, push, merge or deployment. MY5 remains unchanged and paused.

<a id="dec-ail-021"></a>
### DEC-AIL-021 — Park webinars and calendar without deleting their material

- **Project:** AI-LIT
- **Status:** approved bounded UI and indexing change
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève requests removing webinar promotion while
  parking the material for later. In the focused follow-up he explicitly selects
  "Park all three pages (Recommended)", covering /webinar, /webinars and /calendar.
- **Decision:** keep the original pages and data, replace the active public
  experience with a simple paused page, remove public navigation/promotional
  entry points and sitemap entries, and use noindex. Do not display signup forms
  or fetch webinar data from the parked page. No relaunch date is promised.
- **Boundaries:** no data deletion, provider changes, scheduler changes, email
  action, migration or production release. Noindex is not access control.
  Preserve backend/admin material for later review; this does not disable any
  existing production job or API.
- **Affected PRD IDs:** AI-LIT-REQ-025, AI-LIT-TBD-006.
- **Refines / supersedes:** decides the current webinar/calendar disposition;
  does not change the agreed AI-literacy menu or the other workshop decisions.
- **Delivery status:** local parking implementation complete alongside the
  bounded Checkpoint 1 technical repair. Node 24 production build, repository
  checks and seven isolated HTTP tests (including the built output) pass.
  Type checking retains 35 baseline diagnostic locations/codes; dependency
  audit reports zero critical and 16 high findings on the unchanged lockfile.
  Browser/mobile verification remains unavailable and human checkpoint review
  remains open. No commit, push, merge or publication. MY5 is unchanged and paused.

<a id="dec-ail-022"></a>
### DEC-AIL-022 — Continue bounded accessibility repair; design readiness remains separate

- **Project:** AI-LIT
- **Status:** bounded continuation authorised; local code verified within stated limits
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève says "Let's continue" after the Checkpoint 1
  handoff, and asks for guidance on design readiness and separate PRs.
- **Scope:** Checkpoint 2 repairs the existing header's accessible disclosure,
  separate link/button semantics, Escape/focus handling and visible focus. Keep
  current destinations except the separately approved parked webinar/calendar
  surfaces. Preserve the existing skip link and meaningful main landmark.
- **Local evidence:** Node 24 production build and repository/diff checks pass.
  Two no-new-dependency checks verify actual server-rendered header markup and
  skip/main hooks. Six core page sources each contain one h1; all 12 inspected
  img tags have alt attributes. Static inspection is not a screen-reader audit.
  Type-checking retains the same 35 baseline diagnostic locations/codes.
- **Open verification:** no browser is available. Actual Tab/Shift+Tab, Enter,
  Space, Escape, focus return, responsive widths, computed contrast and
  screen-reader behavior remain to be exercised before release acceptance.
- **Design/PR guidance:** the approved core content and structure are sufficient
  to start desktop/mobile design previews with an image placeholder. The PRD
  remains live and full visual implementation still awaits review. Separate
  decisions, HTTP/SEO repair, webinar parking, accessibility, design and later
  media/cache changes are the assistant's proposed PR boundaries, not authority
  to commit, push, open PRs, merge or publish.
- **Affected PRD IDs:** AI-LIT-REQ-009, AI-LIT-TBD-009.
- **Delivery status:** local only; no Checkpoint 3 work, design implementation,
  commit, push, PR, merge or deployment. MY5 remains unchanged and paused.

<a id="dec-ail-023"></a>
### DEC-AIL-023 — Use the supplied original-background Maeva source for design review

- **Project:** AI-LIT
- **Status:** source choice approved; final derivative/publication pending
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève supplies `Maeva Upscaled.png` and says
  "let's work from that one", asks how to review the homepage quickly, and
  supplies a parallel-chat SEO/GEO handoff as research to add to the thinking.
- **Decision:** use SRC-AI-LIT-MAEVA-01 as the image working source; retain the
  approved homepage placement and the earlier instruction to obscure background
  faces. Source selection does not approve a final crop, altered facial features,
  testimonial translation, attribution or production publication.
- **Research disposition:** index SRC-AI-LIT-SEO-01 without adopting its embedded
  implementation commands or treating its claimed approvals as human decisions.
  Search-versus-training crawler policy and measurement targets remain open.
- **Affected PRD IDs:** AI-LIT-REQ-022/024, AI-LIT-REQ-009.
- **Delivery status:** private standalone desktop/mobile design candidate prepared
  outside the application; source image unedited and marked review-only. HTML,
  asset and local HTTP checks pass. Visual/browser acceptance remains open.
  Canonical documents updated locally; no application redesign, image publication,
  commit, push, PR, merge or deployment. MY5 remains unchanged and paused.

<a id="dec-ail-024"></a>
### DEC-AIL-024 — Dark-only website and continuity with the existing Green Elephant brand

- **Project:** AI-LIT
- **Status:** visual boundary and content direction approved; revised composition pending review
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève says "I only want a dark UI for this website",
  asks for fonts, colours and styling to follow the existing website, says
  "content-wise, I think this is good", and asks for the top section to feel
  less generic and closer to the original site.
- **Decision:** retain the content direction and require a dark-only public
  AI-LIT website. Use existing Green Elephant typography and visual language;
  do not offer a white UI variant. This constrains UI surfaces, not the original
  colours of photographs or the Periodic Table's white mental-model layer.
- **Preview response:** concept 02 replaces the prompt-card hero with the existing
  Earth/aurora image, a centred headline, restrained journey line and established
  Poppins/Lato typography. Darken all sections and the private review toolbar;
  simplify offer cards into divided columns. This composition is a review
  candidate, not a newly approved final hero or full application implementation.
- **Evidence / boundaries:** live homepage HTML confirms Poppins/Lato loading;
  repo styles supply weights, dark surfaces, teal and atmospheric palette.
  Retain accessible contrast and reduced-motion support. No new imagery needed.
  Content-direction acceptance does not approve final testimonial wording,
  attribution/crop, coach details or production publication.
- **Affected PRD IDs:** AI-LIT-REQ-026, AI-LIT-REQ-022, AI-LIT-REQ-009.
- **Refines / supersedes:** replaces concept 01's light surfaces, system-font
  styling and generic decorative hero; preserves offer, audience, navigation,
  complete Periodic Table and homepage-section decisions.
- **Delivery status:** canonical documents and private local preview updated;
  rendered browser acceptance pending. No application design changes, commit,
  push, PR, merge or deployment. MY5 remains unchanged and paused.

<a id="dec-ail-025"></a>
### DEC-AIL-025 — Restore retained links in the visitor footer sitemap

- **Project:** AI-LIT
- **Status:** approved coverage; local preview updated
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève flags the missing AI Policy and other footer
  links and asks that all previously working links to retained pages remain
  available when visitors cannot find them in the top menu.
- **Decision:** provide complete grouped footer navigation, preserving policies,
  retained services/tools/audience pages, working section links, contact/social
  links and existing login entry points. Keep webinar/calendar parking and
  My5 separation intact. The reduced top menu does not justify dropping these
  destinations. Group labels are a reviewable presentation choice.
- **Evidence / implementation:** the application Footer.tsx still contains all
  four policies; their omission was in the design preview. Concept 03 restores
  its non-parked destinations and adds other retained public pages. Existing
  Programs/Connect/Resources fragments are present in source. The XML sitemap
  already contains policy pages; add the missing registered, indexable /signals
  route, without fabricating a modification date. Footer login links do not
  belong in the XML sitemap, and no private dashboard link is introduced.
- **Affected PRD IDs:** AI-LIT-REQ-027, AI-LIT-REQ-006/016/022/025.
- **Refines / supersedes:** closes retained-footer coverage after DEC-AIL-016;
  preserves the approved main menu, footer supporting-service placement and
  parked-page scope. Does not revive webinars or My5.
- **Delivery status:** local preview, XML sitemap and canonical documents only;
  application footer redesign remains for the approved design implementation.
  Browser navigation/account-flow verification remains open. No commit, push,
  PR, merge or deployment; paused My5 sections preserved unchanged.

<a id="dec-ail-026"></a>
### DEC-AIL-026 — Smooth gradients, simpler copy and a private Maeva image trial

- **Project:** AI-LIT
- **Status:** refinement direction approved; preview and alternate image pending review
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève requests no hard gradient transitions, a similar
  background around the Periodic Table, less text, jargon explanations including
  ACX, eighth-grade English, and a full preview testing the new supplied image.
- **Decision:** refine the private full-page design accordingly. Use matching
  section colours at every boundary, preserve original artwork, shorten the
  visible copy and make deeper explanations optional. Keep the approved
  pricing, workshop/programme scope, human-centred layers and retained links.
- **Image scope:** SRC-AI-LIT-MAEVA-02 is an alternate private trial, not a final
  replacement. Preserve the previous portrait as a fallback. The supplied scene
  is not verified as documentary evidence; final origin, use permission and
  suitability must be resolved before any publication. Do not alter Maeva's
  appearance or silently edit her quote to simplify it.
- **Affected PRD IDs:** AI-LIT-REQ-028, AI-LIT-REQ-019/020/022/026/027.
- **Delivery status:** concept 04 has two full-page image variants and review
  controls. Native disclosures explain ACX, included items and VAT. Canonical
  documents/provenance updated locally; new copy and visual acceptance pending.
  No image editing, application design implementation, commit, push, PR, merge
  or deployment. MY5 remains unchanged and paused.

<a id="dec-ail-027"></a>
### DEC-AIL-027 — Distinguish the offers; select the portrait and coach titles

- **Project:** AI-LIT
- **Status:** format capacity, titles and portrait selection approved; requested
  content refinements prepared as a local review candidate
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève specifies a four-day hands-on coaching journey
  for 1–5 people, requests visible participant counts and clearer offer distinction,
  practical human/AI connections across the skills and ACX explanations, selects
  the original Maeva portrait over the pool scene, and supplies exact coach titles.
- **Decision:** retain workshop 6–12 standard/16 maximum, 3.5 hours and approved
  pricing; present the four-day journey as part-time hands-on coaching for 1–5,
  with feedback and real work. Avoid action-learning wording on the public page.
  Do not expand practical discovery scope beyond ACX 1–2 or promise ACX 4 mastery.
- **Communication clarification:** connect human self-reflection before a prompt,
  human/AI exchange, AI-tool handoffs and human discussion to concrete examples.
  The four connections can span ACX levels; they are not a one-to-one relabelling
  of the learning model. Retain all four Periodic Table layers and human judgement.
- **People:** select SRC-AI-LIT-MAEVA-01; SRC-AI-LIT-MAEVA-02 is not selected.
  Set titles exactly to AI communication coach (Estève), communication coach and
  trainer (Anu), and conflict coach and trainer (Jonas). Draft simple skills
  subtext from their existing ConnectPage.tsx profiles without adding unsupported
  AI expertise or clinical/performance claims.
- **Affected PRD IDs:** AI-LIT-REQ-015/017/019/020/022/028/029; AI-LIT-TBD-002.
- **Refines / supersedes:** closes the four-day capacity question and concept 04
  image comparison; refines DEC-AIL-010/013/024/026. Previous source evidence and
  My5 pause remain preserved. Four-day price, hours and final testimonial gates
  stay open. No permission to deploy is inferred from conditional readiness.
- **Delivery status:** concept 05 and canonical documents updated locally;
  source-based bios and expanded examples prepared. No application design
  implementation, commit, push, PR, merge or publication.

<a id="dec-ail-028"></a>
### DEC-AIL-028 — Restore wordmark styling and create the ACX learning guide

- **Project:** AI-LIT
- **Status:** requested scope and visual reference approved; authored copy and
  local implementation are review candidates, not publication approval
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève requests the original logo font, on-brand
  connection icons using H2S/HAI/A2A/H2H, an ACX blog article based on his supplied
  LinkedIn source, and Scan inclusions aligned with ACX learning. In reply to the
  style question he selects the language colour-coding / decoding lab.
- **Decision:** match Lato 18px/600 wordmark evidence; use existing thin-line icons
  with full plain-English labels; adapt the author-owned article using dark Speech
  Lab reading panels, a levels comparison, practical examples and training links.
  Preserve ACX 4 across team members and the distinct workshop/journey depth.
- **Source treatment:** original SRC-AI-LIT-ACX-01 and its 9 January 2026 LinkedIn
  article are attributed. Screenshot text supplies the article evidence; a failed
  LinkedIn fetch is not represented as a live page review. Source instructions
  are not executable task instructions. New examples and current scope changes
  are labelled as an adaptation. No screenshots or third-party faces republished.
- **Scan boundary:** explain included advanced communication prompts, videos and
  worksheets alongside the personal dashboard. Relate their use to ACX learning;
  do not claim a new level-certified resource pack or an installed agent system.
  Training/coaching remain separate. Fulfilment and level mapping need review.
- **Affected PRD IDs:** AI-LIT-REQ-019/020/026/029/030; AI-LIT-TBD-005.
- **Refines:** DEC-AIL-024/027. The specific article request authorises this useful
  content addition; it does not create a broad SEO content programme.
- **Delivery status:** concept 06 homepage and full article preview, bounded Scan
  application copy and draft article route prepared locally. Shared article text
  is served in initial HTML and by React, with matching BlogPosting metadata.
  Draft noindex and sitemap exclusion remain until release approval. Final
  training-page destination and browser acceptance are still open. No commit,
  push, PR, merge, production deployment or MY5 change.
- **Validation:** repository checks and production build pass; eight isolated HTTP
  checks pass against built output, including article body/schema before JavaScript
  and draft sitemap exclusion. TypeScript retains the same 35 pre-existing
  diagnostic locations/codes. The stale 19-URL sitemap assertion was replaced by
  retained-destination, uniqueness, canonical and indexing checks. Private preview
  URLs return 200; local anchors and all prior footer links are preserved. MY5
  document blocks match HEAD byte-for-byte. No rendered-browser review completed.

<a id="dec-ail-029"></a>
### DEC-AIL-029 — Authentic voice, conscious prompts, rhythm and French scope

- **Project:** AI-LIT
- **Status:** refinement direction and full retained-public-page French scope
  approved; wording, translations and private previews prepared for review
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève requests clearer Say/Write, Feel/Intend and
  non-verbal descriptions, attributes ACX development to his AI research with
  Arbora, supplies its research URL, and requests French including the article.
  He explicitly selects “Every retained public page, delivered in small batches”.
- **Decision:** connect AI drafting to the person’s own tone and care for readers;
  connect conscious prompting to clear intent; include timing, pace, pauses and
  follow-ups in non-verbal communication. AI supports planning; people choose.
  Gently credit the author’s Arbora research without adding validation claims.
- **Language:** begin French preparation now. The English-first launch baseline
  is not silently replaced by simultaneous publication. Use reviewable batches
  for every retained public page; keep paused/private work outside this scope.
- **Current implementation:** English article source and homepage preview updated.
  French homepage and article editorial assets prepared with full private previews,
  language links and unchanged offer boundaries. App-wide bilingual navigation,
  French routes, paired metadata and remaining page translations are later batches.
  Private previews clearly identify still-English destination pages.
- **Evidence:** research origin is the author’s current statement. The supplied
  Arbora research URL responds with HTTP 200, but its rendered research body was
  not independently reviewed. No private Arbora source or scientific-validity
  assertion is imported. Maeva’s French excerpt is source-verbatim.
- **Affected PRD IDs:** AI-LIT-REQ-002/029/030/031/032; AI-LIT-TBD-004.
- **Refines:** DEC-AIL-018/027/028. French timing changes from unstarted future
  work to authorised preparation; launch approval remains separate.
- **Open gates:** current copy/translation and visual review; subsequent batches;
  final training-page URLs; original-image/testimonial clearance; PR review and
  explicit production release. No commit, push, merge or deployment performed.
- **Validation:** repository checks, production build and eight isolated built-page
  HTTP checks pass. TypeScript retains the same 35 pre-existing errors. All four
  private homepage/article variants have checked language attributes, one H1,
  working local anchors/images and noindex; French preview URLs return HTTP 200.
  Maeva’s French excerpt matches the user source; paused MY5 blocks match HEAD.
  Rendered-browser, responsive and human translation review remain open.

<a id="dec-ail-030"></a>
### DEC-AIL-030 — Scan buying link and an illustrated ACX reading experience

- **Project:** AI-LIT
- **Status:** requested fixes, source use for local comparison and research stance
  approved; final A/B visual treatment remains a user choice
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève asks for a Scan landing-page link with buying
  options, levels 1–4 together in the contents, stronger Arbora provenance and
  human agency/sovereignty, his own drawings framed in Green Elephant style,
  and two visual options including possible code-generated level icons.
- **Decision:** prepare both options; recommend simple SVG level cues with
  expandable originals for readability. Keep original drawings intact, framed
  in dark navy/teal with subtle depth and readable captions/enlargement links.
  Reflect the same content and structure in the French draft.
- **Source boundary:** SRC-AI-LIT-ACX-VISUALS-01 records six exact originals and
  their hashes. Do not silently replace older H2A or governance/infrastructure
  labels. Explain differences beside the drawings and retain the current HAI
  and team-member ACX 4 scope. Tall pencil scroll and opportunity slide remain
  source material rather than main article illustrations.
- **Research wording:** use practical synthesis and an explicit philosophical
  position. Author-provided research provenance is not statistical-validation,
  certification or published-meta-analysis evidence. No private Arbora content
  is imported from the separate product repository.
- **Affected PRD IDs:** AI-LIT-REQ-019/020/030/031/032/033.
- **Refines:** DEC-AIL-028/029. No change to training depth, prices, Maeva gates,
  MY5 pause, release process or the wider French batch list.
- **Delivery:** English and French local content updated, six unedited assets
  copied, two full article alternatives prepared, homepage Scan links corrected.
  A is the local review candidate, not recorded as the user's final selection.
  No commit, push, PR, merge or deployment.
- **Validation:** repository checks, production build and eight isolated built-page
  HTTP checks pass. Structural checks cover all six private pages: one H1, unique
  anchors, working local links, six available drawings per article and levels 1–4
  kept together. A/B preview URLs and the original drawing return HTTP 200.
  All six copied originals match their recorded SHA-256 hashes; MY5 document
  blocks match HEAD. Browser inventory has no enabled browser, so rendered visual,
  responsive and accessibility acceptance remains open. No dependency changes.

<a id="dec-ail-031"></a>
### DEC-AIL-031 — Keep version B and explore purple sketch-derived level symbols

- **Project:** AI-LIT
- **Status:** version B selected in both languages; purple icon direction approved;
  B1/B2 refinement choice remains open
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève explicitly says to keep version B, asks for
  ACX icons based on his drawings in the correct Green Elephant purple, and
  requests another distinctive treatment in both blog and website descriptions.
- **Decision:** keep all four original level diagrams fully visible. Add four
  language-neutral SVG interpretations of the original robot, thought-cloud,
  agent/person and circular people-connection motifs. Preserve source artwork.
- **Brand:** canonical `LENS_HEX.dynamics` is #5C4E99; use it for the requested
  icon ink. Do not silently substitute a generic purple or migrate the whole
  site's older HSL palette. This accent does not map ACX to a communication lens.
- **Candidates:** B1 uses compact ink badges. B2 adds sketchbook ribbons, margin
  marks and numbered tabs. Recommend B2; do not record it as user-selected yet.
  Both treatments carry across homepage and article, in English and French.
- **Refines / supersedes:** closes the A/B selection under DEC-AIL-030 in favour
  of B. Keeps its original-label note, team-member ACX 4 boundary and open release
  gates. B1/B2 are styling refinements of B, not a return to optional originals.
- **Affected PRD IDs:** AI-LIT-REQ-026/030/032/033/034.
- **Delivery:** local article sources now use B with four purple SVG symbols;
  eight homepage/article/language/treatment previews prepared. No new packages,
  raster alteration, commit, push, PR, merge, deployment or MY5 changes.

<a id="dec-ail-032"></a>
### DEC-AIL-032 — Scan support for AI learning and private client-story drafts

- **Project:** AI-LIT
- **Status:** direction and local implementation approved; copy review and release open
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève requests a plain-language Scan hero, ACX links,
  bilingual sales buttons and checkout checks; explicitly selects story drafts
  for client review instead of fabricated quotes. Later requests original hero
  graphics and elevator treatment.
- **Decision:** connect personal communication awareness to guiding AI, especially
  ACX 1–2. Preserve original Scan imagery and legacy testimonials. Prepare new
  coaching stories privately, including Maeva's supplied words, with permission
  and attribution gates intact. Do not claim Scan results train AI automatically.
- **Affected PRD IDs:** AI-LIT-REQ-030/032/035 (Concept 10).
- **Delivery:** local English hero/ACX implementation, paired French review copy,
  bilingual checkout and isolated payment checks. Full French legacy-page and
  email-template translations are still open. No new stories published.

<a id="dec-ail-033"></a>
### DEC-AIL-033 — Coherent human-first promise and bounded email testing

- **Project:** AI-LIT
- **Status:** brand direction approved; exact slogan candidates pending review;
  exact existing test email templates approved; live tests blocked by HTTP 403
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève asks to reuse the warm footer, connect Scan,
  workshops/coaching/training around humane technology and human agency, retain
  conflict transformation as a benefit, and provide bilingual review links each
  workshop turn. Estève subsequently reviews customer/admin previews and explicitly
  approves the test emails. The supplied voucher and recipients stay in private
  test artifacts rather than this published decision log.
- **Decision:** short promise plus supporting benefit and offer connection; avoid
  replacing human judgment or promoting AI at any cost. Prepare paired EN/FR
  copy. Run only bounded, zero-cost approved test orders; no paid card transaction
  or production deployment authorized by this test request.
- **Test evidence:** coupon validation succeeds; first approved free-order request
  returns HTTP 403, no successful purchase ID, no retry or remaining-recipient
  requests. Delivery is unverified and this flow bypasses Stripe. Local Resend
  acceptance/error handling repaired with five isolated passing tests; templates
  unchanged. See PRD for consent and marketing findings, not compliance assurance.
- **Affected PRD IDs:** AI-LIT-REQ-032/035/036 (Concept 10).

<a id="dec-ail-034"></a>
### DEC-AIL-034 — Restore clean teal outline icons

- **Project:** AI-LIT
- **Status:** approved styling correction; rendered review open
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève explicitly rejects hand-drawn icons and asks to
  return to the style used for the teal icons; requests familiar menu icons too.
- **Decision:** use clean Lucide outline chat/workflow/agent/people symbols with
  teal #009999, visible labels and ACX numbers. Use the same line style for new
  navigation icons in English and French. Preserve the selected version B original
  article drawings and the original Scan hero graphics/scroll effect.
- **Supersedes:** DEC-AIL-031's purple sketch badge/ribbon candidates only. Version
  B selection and original artwork preservation remain approved.
- **Affected PRD IDs:** AI-LIT-REQ-033/034/037 (Concept 10).

<a id="dec-ail-035"></a>
### DEC-AIL-035 — Dark ACX navigation, Scan controls and result-email review

- **Project:** AI-LIT
- **Status:** approved direction; local implementation and private bilingual previews; rendered acceptance and live email delivery open
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève requests matching purple icons, numbers and level names, rejects pale boxes, and retains dark backgrounds. Click targets navigate between the overview and level sections. Latest feedback requests a raised Scan button, a separate downward arrow and clearer elevator graphics.
- **Decision:** keep clean outline icons; remove pale label backing. Use one readable purple tint (#B7A6E8) on dark surfaces for ACX identity, derived from the unchanged brand base #5C4E99. The exact tint is an implementation choice for visual review. Navigation outside ACX keeps its established teal. Preserve version B and original drawings. Add overview links and return links. Button depth comes from the surface shadow, not text shadow; scroll arrow is stacked below its label; narrow CSS track uses crisp lines. Original Earth image remains 1408 × 768; deploy alone cannot improve its resolution.
- **Scan language:** disclose before purchase, in English and French, that the questionnaire and videos are currently English and that translation-tool accuracy is not guaranteed.
- **Results emails:** retain Estève and Anu in Typeform completion CC, per explicit workshop answer. This records owner choice; participant disclosure and lawful processing remain separate review items. Three result-email templates have local English/French rendering, escaped selectable text, complete text attachments, HTTPS dashboard links and checked provider acceptance. Admin raw-data/dashboard sends now select English or French and require write access. No new result emails sent; automatic Typeform completion still defaults to English.
- **Client stories:** first-person drafts stay private. Temporary attribution approved: “Miko and a fellow developer, Finland.” Do not invent the second developer's identity or treat drafted words as client-confirmed quotations. Maeva's supplied French words remain unchanged.
- **Supersedes:** DEC-AIL-034 ACX colour only; clean outline shapes and original artwork remain. Rejected pale-box intermediate preview is not the accepted design.
- **Affected PRD IDs:** AI-LIT-REQ-035/037/038.
- **Open gates:** full French public routing, rendered desktop/mobile review, complete remaining Resend repairs, webhook authenticity/deduplication, answer-preservation audit, purpose-specific consent/marketing separation, inbox delivery and customer dashboard access. No deployment or compliance assurance follows from local tests.

<a id="dec-ail-036"></a>
### DEC-AIL-036 — Accept visual review and finish bounded email checks

- **Project:** AI-LIT
- **Status:** design accepted; local email repairs under review; live delivery blocked
- **Decision date:** 2026-10-01
- **Approver / evidence:** Estève says the reviewed changes are good and requests email checks and a main-homepage review page. This is not production publication approval.
- **Decision:** retain DEC-AIL-035 visual treatment. Provide a homepage-first English/French review controller and separate email previews. Continue provider-isolated tests and bounded repairs without starting the full application or provider jobs.
- **Implementation evidence:** central Resend acceptance guard covers all shared-client sends, including direct newsletter/batch routes; rejected provider responses cannot reach success counters. Typeform extraction preserves repeated titles, all choice values, zero/false/blank and multiline answers. Full JSON export attachment replaces the previous missing attachment. Three result templates have explicit Estève Reply-To. Actual sender payloads are exercised with a fake provider, not just renderer snapshots.
- **Open findings:** dashboard sending is coach-triggered, not an automatic dashboard-created event; Typeform authentication/deduplication and durable delivery, reminder failure/retry handling, reset-link origin, remaining HTML interpolation, participant disclosure and marketing permission/suppression remain open. Credentials and browser connection are unavailable for this session; no live send attempted after the prior shop HTTP 403.
- **Approval boundary:** changed outgoing copy, headers and attachments still require exact final-message review before live sending under the repository email rule. Visual acceptance does not certify GDPR compliance or authorize deployment.
- **Affected PRD IDs:** AI-LIT-REQ-035/036/038; bounded implementation evidence only.

Discovery progress is in the PRD acceptance table. Proposed SEO/growth ideas are
`AI-LIT-PROP-*` requirements candidates, not approved decisions. Add an attributable
decision here when Estève selects one; do not silently change its status.

<a id="my5-decisions"></a>
### DEC-AIL-037 — Release preparation and approved Maeva derivative

- **Project:** AI-LIT
- **Status:** implementation and GitHub PR/merge authorised; Replit publication and
  live delivery verification remain separate
- **Decision date:** 2026-10-01
- **Approver/evidence:** Estève’s request to finish email, bilingual, privacy,
  search and security checks, create the PR and merge to GitHub main; latest explicit
  approval of Maeva’s blurred-background portrait.
- **Affected requirements:** AI-LIT-REQ-018, 025, 030–038; full French scope in
  AI-LIT-REQ-032 remains required and is not reduced by this checkpoint.
- **Decision:** carry the approved dark designs into the existing application,
  prepare the release through the protected-main workflow, and give the human the
  exact Replit release handoff. Retain the current scan questionnaire/video language
  notice and the original approved portrait rather than the pool illustration.
- **Implementation evidence:** actual core EN/FR application routes and early HTML
  content, reciprocal translated-page metadata, public/private cache controls,
  redacted HTTP errors, safer Scan email/payment handling, disabled analytics and
  unconsented promotional automation. Dependency updates remove high and critical
  audit findings; moderate transitive findings and pre-existing TypeScript debt are
  recorded separately from the passing build and focused release tests.
- **Open gates:** retained legacy French pages and email families; production
  credentials/provider configuration; exact final email review and inbox/attachment
  checks; real payment and coupon recording; provider/data-retention/legal details.
  No successful live transaction or complete GDPR compliance is claimed.
- **Operational exception:** automatic approval review rejected restoring the new
  Scan purchase-to-Notion copy because email, name and amount would leave the app
  without specific transfer approval. That copy was not restored and no data was
  sent. Existing unrelated integration paths were not newly authorised.
- **Supersedes:** earlier implementation-not-approved status for the authorised
  website scope only. Preserves DEC-MY5-001, current publication boundaries and
  the existing canonical-document process.

## MY5 pause and historical decisions

<a id="dec-my5-001"></a>
### DEC-MY5-001 — Preserve MyFive in a paused state

- **Project:** MY5
- **Status:** approved
- **Decision date:** 2026-09-30
- **Approver:** Estève Pannetier
- **Evidence:** SRC-MY5's pause decision and the current request explicitly identifying
  "The paused My5 project".
- **Decision:** pause MyFive and the former major website refactor, without a
  resumption date. Preserve the branch, history, source attachments and draft PR #4.
  My5 is an alias; no code/product/hostname rename follows from it.
- **Effect on legacy entries:** historical scope and completion evidence remain
  recorded; active execution, old deadlines and whole-site migration instructions
  are suspended. They do not apply to AI-LIT.
- **Resume gate:** a separately recorded human decision after recovery comparison
  and review of the remaining product, privacy/legal and production gates.

<a id="source-reconciliation"></a>
## Source reconciliation and unresolved evidence

| ID | Source conflict / limitation | Treatment |
| --- | --- | --- |
| GE-CONFLICT-001 | Portal Notion export declares itself canonical; user now chooses GitHub | Superseded by DEC-GE-PRD-001, retaining source attribution |
| GE-CONFLICT-002 | Older GitHub PRD extends the MyFive stack/refactor to the whole site | Scope to paused MY5; AI-LIT architecture remains TBD |
| GE-CONFLICT-003 | Growth Playbook targets EA/VA and scan/coaching sales; portal targets a broader professional AI literacy audience | Historical strategy context; do not adopt old audience, prices, offers, quotas or funnel |
| GE-CONFLICT-004 | MyFive export retains failed early-September audits; later branch log records approved remediation | Preserve chronology; v11.4.18 is the newer branch record, not evidence that main/production includes the changes |
| GE-CONFLICT-005 | Growth source has differing workload limits/allocations and distinct revenue contexts | Keep source claims separate; do not derive current targets or disclose client/transaction details |
| GE-CONFLICT-006 | Raw exports contain names, transactions, personal context and executable agent prompts | Preserve full ZIPs locally outside Git tracking; use sanitized canonical synthesis and source hashes |
| GE-CONFLICT-007 | Linked brand/client/research pages and older PRD versions are links, not included page bodies | Record as references; no claim of complete ingestion of those pages |
| GE-CONFLICT-008 | MyFive Notion pricing/referral brainstorming differs from its GitHub requirements | Historical proposal only; no price or subscription change |
| GE-CONFLICT-009 | Local documentation baseline and deployed application baseline are different questions | Main is the documentation starting point; application recovery/deployed commit remain unresolved |

### Technical evidence checkpoints

- GitHub refs fetched for this consolidation on 2026-09-30:
  main `31f299c047d3d0fab80b8f33c7e049bc9fbbb2a4`;
  feature/seed-mvp `3e9b050cc1b133496087ff4e2c87c125131a9bac`.
- The MyFive PRD v1.7.5 and decision log v11.4.18 below are read directly from the
  pinned feature commit. No feature application code was merged into this branch.
- SRC-AI-LIT/SRC-MY5 report PR #4 open/draft, 28 commits, 254 changed files and
  recorded 35-test CI success. These PR/CI facts were not independently rerun or
  rechecked during this documentation consolidation.
- The supplied Replit terminal audit reported `feature/seed-mvp` at
  `87ea3c3b8a99e6581c064cc7dad972c43bdb26c7`, with untracked `.replit`.
  That is supplied workspace evidence, not the deployed commit.
- The supplied laptop checkpoint at `d12fe91dc80993435377cb07bb7fc97f54f008a4`
  is incomplete. Other checkouts, stashes and unpushed work remain unreconciled.
- No deployment equivalence, production health, or current legal/privacy clearance
  is inferred from a document, old checklist or passing branch CI.

<a id="my5-history"></a>
## Preserved MyFive decision history — v11.4.18

The bounded original below is preserved verbatim, including all ledger rows,
decision IDs, status history and evidence. Its "active", "canonical", deadlines
and process instructions describe the paused MY5 baseline only. Read the current
shared authority and pause entries first. Its version metadata describes the
imported snapshot, not the shared document's current revision.

<details>
<summary>MyFive decision baseline and original ledger — paused</summary>

<!-- BEGIN PRESERVED MY5 DECISIONS -->
# 💞 MyFive — Approved Product Decision Log v11.4.18 (Δ Update) — Drift-Safe / Canonical Source

This log represents the official v11.4 Delta (Δ) Update to the MyFive Approved Product Decision Log, acting as the primary record of human-approved decisions and explicit scope boundaries within the `GreenElephantorg` repository [Approved Product Decision Log].

All specifications are mapped against the canonical baseline of Decision Log v10.0 and v11.0, establishing clear scope boundaries and aligning feature extensions with the approved MyFive target architecture and migration path [Approved Product Decision Log].

---

## 🧭 Authority & Repository Integration

*   **Canonical Source of Truth:** This log is stored directly within the repository at `docs/DECISION_LOG.md` as the canonical record of human-approved decisions for MyFive and the `GreenElephantorg` platform.
*   **Document Version:** `11.4.18`
*   **Last Updated:** `2026-09-17T17:44:07+03:00`
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

### Historical Baseline Review Completion — 2026-09-02

*   **Completed review:** DEC-001 through DEC-031 have now each been explicitly revalidated through recorded human selections in this workshop.
*   **Canonical effect:** The corrected active decision sections and later approved deltas in this document govern implementation. Unsafe, unsupported, absolute, superseded, or conflicting wording from historical v10 remains evidence only.
*   **No inferred expansion:** Completing the historical review does not activate deferred integrations, outbound messages, spending changes, annual billing, production cutovers, or any feature not expressly approved in an active decision.
*   **Next governance work:** Resolve the PRD's recorded open items and implementation proof gates through separately attributable decisions and evidence.

| Version | Recorded at | Approved by | Change summary |
| :--- | :--- | :--- | :--- |
<!-- DECISION_LEDGER_ROWS -->
| 11.4.18 | 2026-09-17T17:44:07+03:00 | Estève | Approved Stage 4.3 final privacy and security evidence and completed issue 14 |
| 11.4.17 | 2026-09-17T16:38:45+03:00 | Estève | Recorded passing Stage 4.3-F final privacy and security evidence |
| 11.4.16 | 2026-09-17T16:31:56+03:00 | Estève | Recorded authorized Stage 4.3-F final privacy and security audit candidate |
| 11.4.15 | 2026-09-15T21:31:24+03:00 | Estève | Approved Stage 4.3-E privacy and security evidence and completed issue 13 |
| 11.4.14 | 2026-09-15T20:48:17+03:00 | Estève | Recorded passing PostgreSQL evidence for Stage 4.3-E |
| 11.4.13 | 2026-09-15T20:44:17+03:00 | Estève | Corrected Stage 4.3-E PostgreSQL fixture setup found by CI run 23 |
| 11.4.12 | 2026-09-15T20:37:00+03:00 | Estève | Recorded authorized Stage 4.3-E implementation candidate and evidence plan |
| 11.4.11 | 2026-09-15T19:18:08+03:00 | Estève | Approved Stage 4.3-D privacy and security evidence |
| 11.4.10 | 2026-09-15T19:11:52+03:00 | Estève | Recorded passing PostgreSQL evidence for Stage 4.3-D |
| 11.4.9 | 2026-09-15T19:07:34+03:00 | Estève | Corrected PostgreSQL subject-id typing found by Stage 4.3-D CI |
| 11.4.8 | 2026-09-15T18:54:46+03:00 | Estève | Added disposable PostgreSQL proof for Stage 4.3-D |
| 11.4.7 | 2026-09-12T02:25:39+03:00 | Estève | Prepared Stage 4.3-D ownership boundaries for privacy review |
| 11.4.6 | 2026-09-12T01:52:42+03:00 | Estève | Approved Stage 4.3-D survivor-access retention policy |
| 11.4.5 | 2026-09-11T21:45:29+03:00 | Estève | Approved Stage 4.3-C privacy and security evidence and completed issue 11 |
| 11.4.4 | 2026-09-11T21:39:07+03:00 | Estève | Corrected Stage 4.3-C status and recorded privacy-audit amendments pending human review |
| 11.4.3 | 2026-09-11T19:26:47+03:00 | Estève | Completed Stage 4.3-C bilateral versioned ValueRules consent for shared agreements |
| 11.4.2 | 2026-09-11T00:05:02+03:00 | Estève | Completed Stage 4.3-B account and privileged authorization controls |
| 11.4.1 | 2026-09-10T23:45:42+03:00 | Estève | Completed Stage 4.3-A server check-in quarantine and metadata-only API logging |
| 11.4.0 | 2026-09-10T23:31:38+03:00 | Estève | Approved DEC-041 MyFive Alpha privacy-isolation contract and bounded remediation sequence |
| 11.3.4 | 2026-09-02T22:56:26+03:00 | Estève | Approved DEC-038 through DEC-040 proof journey, Sunday deadline, and risk-based stabilization |
| 11.3.3 | 2026-09-02T22:24:41+03:00 | Estève | Revalidated DEC-026 through DEC-031 and completed the historical baseline review |
| 11.3.2 | 2026-09-02T22:06:58+03:00 | Estève | Revalidated DEC-020 through DEC-025 operational safety, Google, and pacing controls |
| 11.3.1 | 2026-09-02T22:02:45+03:00 | Estève | Revalidated DEC-016 through DEC-019 product experience baseline |
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

### DEC-016 — Accessible Organic Holography Design Direction — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** MyFive keeps its dark, fluid, bioluminescent Organic Holography identity, but beauty must not make the product harder to read, navigate, or operate. Familiar controls and clear boundaries are allowed whenever they help people use the product safely.
*   **🛠️ Canonical rule:** Use Organic Holography as the MyFive design direction: dark obsidian foundations, fluid gradients, bioluminescent accents, overlapping aura forms, and the approved eight-colour taxonomy. Permit straight lines, grids, cards, boxes, tables, and conventional controls when accessibility, information hierarchy, data comparison, responsive behavior, or operational clarity requires them.
*   **Accessibility boundary:** WCAG requirements, readable contrast, keyboard navigation, focus visibility, semantic structure, reduced-motion preferences, cognitive clarity, and usable error states take priority over decorative fidelity. No visual treatment may obscure consent, privacy, billing, safety, or recovery controls.
*   **Technology boundary:** WebGPU, advanced SVG, particle systems, bloom, and similar effects are optional progressive enhancements, not required dependencies. Every essential journey must retain a stable non-WebGPU fallback. Performance claims remain `VERIFY` under DEC-036.
*   **Root-site boundary:** The Green Elephant root site may reuse approved tokens and motifs during DEC-015's refactor, but public, portal, admin, assessment, payment, Satellite Scan, and automation interfaces remain function-first and subject to parity and continuity gates.
*   **Revalidation basis:** Explicit human approval of Option 16A. This preserves the implemented Organic Holography identity while correcting the historical absolute ban on rigid UI structures and the unsupported requirement for WebGPU effects.

### DEC-017 — Separate Eight Lenses and Eight Loves with Visual Taxonomy — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** The Eight Lenses describe communication perspectives; the Eight Loves describe relational qualities. They stay separate, but can share a consistent colour and storytelling system so the experience feels coherent.
*   **🛠️ Canonical rule:** Model the Eight Lenses and Eight Greek Loves as independent concepts and data dimensions. Preserve this one-to-one visual storytelling taxonomy: Influence → Agape; Attitude → Mania; Chaordic → Eros; Flow → Ludus; Alignment → Pragma; Needs → Storge; Ego → Philia; Dynamics → Philautia.
*   **Semantic boundary:** The mapping is a brand, colour, and storytelling device only. It must not be represented as scientific equivalence, diagnosis, metaphysical fact, causal mechanism, or a constraint on a connection's love composition. Historical “catalyst” labels remain evidence, not canonical product claims.
*   **Data boundary:** Lens records and Love-profile records must remain independently identifiable and queryable. A user may calibrate all eight Love dimensions independently regardless of the visual Lens/Love pairing.
*   **Revalidation basis:** Explicit human approval of Option 17A. This consolidates the implemented design-token map with DEC-037's later rule that the taxonomy must not constrain the eight-dimensional Connection Profile.

### DEC-018 — €4.99 Monthly Membership and Sponsored Connections — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE; ANNUAL PLAN DEFERRED**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** MyFive costs €4.99 per month. A paying member can sponsor up to five partner connections so invitees can join those shared spaces without paying. The historical €48 annual plan is not active yet.
*   **🛠️ Canonical rule:** Offer the MyFive primary membership at `€4.99/month` through Stripe. A primary member receives five active partner-connection seats and may sponsor invitees' access to those shared connections without requiring invitee checkout. A person who buys their own primary membership receives their own five partner-connection seats, subject to DEC-003.
*   **Annual-plan boundary:** `€48/year` remains deferred and unimplemented. It requires a separate explicit decision covering Stripe price configuration, checkout choice, entitlement periods, renewal, cancellation, proration, refunds, customer communication, tax presentation, and migration between billing intervals.
*   **Commercial verification boundary:** VAT treatment, Stripe account pricing, payment-method fees, refunds, discounts, and displayed tax-inclusive or tax-exclusive wording must be verified against the actual business and provider configuration. Historical arithmetic does not create a permanent fee or tax requirement.
*   **Scope boundary:** This decision governs MyFive membership only. It does not change Satellite Scan pricing, root-site offers, EAP voucher pricing, or any other Green Elephant product.
*   **Revalidation basis:** Explicit human approval of Option 18A. This preserves DEC-033 and the implemented monthly Stripe checkout while declining to infer approval for an annual plan that is not currently implemented.

### DEC-019 — Private User-Selected Eight-Octant Flow States — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** For each Love dimension, a person may privately choose Arousal, Flow, Control, Relaxation, Boredom, Apathy, Worry, Anxiety, or leave it not assessed. MyFive explains the choices but never tells the person what they feel.
*   **🛠️ Canonical rule:** Use the canonical Flow-octant values `Arousal`, `Flow`, `Control`, `Relaxation`, `Boredom`, `Apathy`, `Worry`, and `Anxiety`, plus explicit `Not assessed`, for private user-directed Connection Profile calibration across all eight Love dimensions.
*   **Interpretation boundary:** The state must come from the user's explicit selection. MyFive must not infer, diagnose, rank, moralize, or automatically assign a state from behavior, biometrics, partner activity, or another Love/Lens value. Any numeric proximity or ordering metadata must not become a user-worth, relationship-health, or partner-facing score.
*   **Microcopy boundary:** Plain-language and context-sensitive explanations are permitted when they clarify the user's available choices without changing the canonical values or interpreting the user. Historical Typeform wording is source evidence, not mandatory exact copy; every published wording set requires readability, emotional-safety, accessibility, and localization review.
*   **Privacy and history:** Selections remain private by default and may be stored as append-only timestamped snapshots under DEC-004 and DEC-037. Partner visibility requires a separately approved, explicit, purpose-specific, voluntary, and revocable sharing flow.
*   **Claims boundary:** Do not describe the product model as clinically validated, diagnostic, or therapeutic without separately established authoritative evidence and approval.
*   **Revalidation basis:** Explicit human approval of Option 19A. This preserves DEC-037 and the current eight-octant schema while correcting the historical automatic-context and clinical-validation overclaims.

### DEC-020 — Audited Break-Glass Support Access — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** An authorized support person may receive narrowly limited emergency access for no more than 24 hours, but every use must be attributable, justified, visible in the audit trail, and immediately revocable.
*   **🛠️ Canonical rule:** Break-glass support grants must be issued to a named authorized operator, restricted to the minimum roles and surfaces needed for the recorded support reason, expire automatically within 24 hours, and support immediate revocation. Grant, use, attempted misuse, revocation, and expiry events must be appended to the administrative audit trail.
*   **Private-data boundary:** A break-glass grant must not provide access to private browser vaults, private Connection Profile payloads, passwords, payment-card data, provider secrets, or encryption-key material. It must not silently impersonate a participant or bypass bilateral consent.
*   **Activation boundary:** A generic permanent emergency account is prohibited. Granting access requires strong operator authentication, an explicit reason, a defined scope, and a recorded expiry. A shorter duration must be used whenever it is sufficient.
*   **Revalidation basis:** Explicit human approval of Option 20A. This replaces historical broad or fixed-duration interpretations with a 24-hour maximum, least-privilege access, auditability, and private-vault isolation.

### DEC-021 — Layered Emergency Integration Kill Switches — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** Operators can stop one unsafe integration without unnecessarily stopping the others, and can still use a global emergency stop when the blast radius is unclear.
*   **🛠️ Canonical rule:** Provide separately auditable kill switches for Resend, each Google integration, synchronization or replication workers, and other material outbound providers, plus a global emergency stop. A switch pauses new outbound work for its scope without deleting source data, invalidating audit history, or silently marking unsent work as completed.
*   **Recovery boundary:** Recommission providers one at a time through an owned recovery checklist covering incident containment, credential and configuration verification, queue or backlog inspection, duplicate suppression, test execution, operator approval, and post-restart monitoring.
*   **Continuity boundary:** During DEC-015 migration, controls must distinguish MyFive from established Green Elephant revenue and Satellite Scan workflows wherever isolation is technically possible. A global stop is reserved for incidents whose scope cannot safely be contained with a provider- or workflow-specific switch.
*   **Revalidation basis:** Explicit human approval of Option 21A. This retains the historical global emergency capability while adding service-level containment and preventing destructive or ambiguous shutdown behavior.

### DEC-022 — Incident Playbooks and Redacted Emergency Diagnostic Bundle — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** The team will have practical response instructions for the incidents most likely to threaten customers or revenue, and can deliberately export safe diagnostic evidence without packaging secrets or private content.
*   **🛠️ Canonical rule:** Maintain owned, versioned incident playbooks for payment and webhook failures, suspected data exfiltration, DDoS or abusive automation, malicious data injection, transactional-email incidents, provider outages, synchronization failures, containment, recovery, customer communication, and post-incident review.
*   **Bundle boundary:** An emergency diagnostic bundle must be human-triggered, access-controlled, timestamped, and redacted by construction. It may contain relevant configuration state without secret values, service health, versions, request or event identifiers, audit metadata, queue counts, error classifications, and checksums. It must exclude credentials, tokens, payment-card data, private vault content, private reflections, unnecessary personal data, and unrestricted raw production payloads.
*   **Retention boundary:** Bundle creation, access, sharing, retention, and deletion must be logged and governed by the incident's documented purpose. Export does not authorize transmission to an external party without a separate authorized operational basis.
*   **Revalidation basis:** Explicit human approval of Option 22A. This keeps the historical incident-response intent while replacing an unrestricted raw-log export with a privacy-safe diagnostic artifact.

### DEC-023 — Optional User-Connected Google Calendar and Drive Export — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** A MyFive member may deliberately connect Google Calendar for selected events and export selected data to Google Drive. MyFive does not receive a general licence to explore the person's Google account.
*   **🛠️ Canonical rule:** Permit optional MyFive Google Calendar event creation or update and explicit user-initiated Google Drive exports. Each capability requires separate, plain-language consent, the minimum verified OAuth scopes, a clear account indicator, failure-safe behavior, and accessible disconnect and revocation controls.
*   **Access boundary:** Do not request general Drive browsing, unrelated Calendar access, Gmail access, organization-wide access, or background collection. Each write or export must follow a user action or a separately enabled, clearly described scheduling instruction, and must expose what will be written and where.
*   **Migration boundary:** Existing Green Elephant Google workflows and credentials remain operational under DEC-015 until their replacements pass parity and cutover gates. MyFive-specific credentials, scopes, callbacks, tokens, and records must be inventoried separately and must not broaden established root-site access.
*   **Revalidation basis:** Explicit human approval of Option 23A. This approves the useful Calendar and Drive operations from the historical proposal while imposing granular consent, minimum scopes, revocation, and migration isolation.

### DEC-024 — Accessibility-Friendly User-Controlled Pacing — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** Members can choose a pacing rhythm that helps them, including an optional Fibonacci curve, but can always change it, pause it, or turn it off.
*   **🛠️ Canonical rule:** Notification pacing is optional and controlled by the user. Provide quiet hours, timezone awareness, pause, mute, off, and per-connection or per-reminder settings. Fibonacci pacing may be offered as an understandable selectable preset, never as an invisible or compulsory default.
*   **Calendar boundary:** Calendar creation or synchronization is allowed only when DEC-023's Google connection is active and the user separately requests or enables the relevant event behavior. Disabling pacing must stop future pacing jobs without removing access to manual reminders.
*   **Claims boundary:** Describe the feature in plain accessibility and user-control language. Do not claim that pacing is “ADHD-proof,” medically effective, clinically validated, or universally suitable without separately approved authoritative evidence.
*   **Revalidation basis:** Explicit human approval of Option 24A. This consolidates DEC-034 with concrete controls and corrects the historical automatic and medicalized framing.

### DEC-025 — No Behavioral Response Monitoring or Relationship-Health Scoring — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** MyFive may keep message delivery safe, but it will not watch ignored notifications and turn them into a judgment about a person or relationship.
*   **🛠️ Canonical rule:** Do not compute NFI or equivalent engagement-risk scores from ignored messages, response timing, notification interaction, partner activity, or inferred emotional state. Do not automatically change interpersonal pacing, warn administrators about a person's engagement, or label relationship health from such behavior.
*   **Permitted operations:** The system may throttle or retry work using technical delivery evidence such as provider errors, rate limits, bounce state, queue depth, duplicate risk, or system volume. Users may change their own pacing at any time. Administrators may see aggregate operational delivery health that does not expose private content or profile individual responsiveness.
*   **Privacy boundary:** Operational telemetry must remain purpose-limited, minimized, access-controlled, and subject to documented retention. It must not be repurposed into behavioral surveillance, partner comparison, emotional inference, or coercive engagement optimization.
*   **Revalidation basis:** Explicit human approval of Option 25A. This rejects the historical response-monitoring NFI loop while retaining necessary technical delivery safeguards and user-directed pacing.

### DEC-026 — Versioned Nine-ValueRules™ Shared-Agreement Gate — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** Before two people enter a shared agreement, each person separately reviews and accepts all nine ValueRules™. A person can still use MyFive privately without crossing that shared boundary.
*   **🛠️ Canonical rule:** Present Respect, Kindness, Privacy, Self-Awareness, Curiosity, Humility, Collective Intelligence, Social Learning, and Transparency as nine individually accepted items in the unskippable boundary immediately before shared-agreement access. Record each participant's separate receipt with rule-set version, accepted rule identifiers, account, connection, and timestamp in the append-only consent ledger.
*   **Scope boundary:** The gate controls shared-agreement functionality, not registration, subscription, private reflection, private Connection Profiles, export, deletion, or withdrawal. One participant's acceptance never substitutes for the other's. Withholding or withdrawing consent must not create punishment, pressure, or partner-facing blame.
*   **Revision boundary:** A material change to the rule set, meaning, purpose, or sharing behavior requires a new version and fresh acceptance before further shared-agreement use. Historical receipts remain preserved as evidence of the version accepted at the time.
*   **Claims boundary:** ValueRules™ are a product communication agreement, not proof of legal compliance, safety, compatibility, therapeutic benefit, or relationship quality.
*   **Revalidation basis:** Explicit human approval of Option 26A. The rule matches the current individually validated nine-item gate and corrects the historical claim that the gate itself guarantees legal compliance.

### DEC-027 — Accessible Resend Administrative Control Plane Without Behavioral Experimentation — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** Administrators get a clear place to understand and safely control transactional email, but the system does not experiment on people's responsiveness or resurrect the rejected NFI monitoring loop.
*   **🛠️ Canonical rule:** Provide an accessible Resend administrative control plane showing provider and kill-switch state, approved message categories, sender configuration status without secret values, template preview, explicitly authorized test-send controls, delivery failures, queues, retries, suppression state, audit history, and contextual recovery guidance.
*   **Activation boundary:** This decision does not activate MyFive outbound email or approve any sender, recipient, message category, trigger, subject, body, attachment, template, experiment, or production test. DEC-010's default-off and separate-approval rules remain controlling.
*   **Experiment boundary:** Live A/B messaging experiments, automated engagement optimization, and NFI-style downshifts based on ignored messages or personal responsiveness are not approved. A future experiment requires a separate decision defining purpose, population, variants, lawful data, success and guardrail metrics, stopping rules, consent or notice, retention, and review.
*   **Language boundary:** Describe the interface as accessible, beginner-supportive, and recoverable. Do not claim it is “ADHD-proof,” anxiety-proof, error-free, or universally usable.
*   **Revalidation basis:** Explicit human approval of Option 27A. This preserves the useful operational control surface while enforcing DEC-010, DEC-025, and the ban on unsupported medicalized claims.

### DEC-028 — Accessible Metadata-Only Security and Integration Health HUD — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** Operators can quickly see which important services are healthy, paused, degraded, or unverified, without exposing credentials or relying on colour and animation alone.
*   **🛠️ Canonical rule:** Provide a visual operational map for material providers and pipelines, including Resend, approved Google capabilities, synchronization or replication, database connectivity, Stripe, and other inventoried dependencies. Pair the Organic Holography view with an accessible semantic table showing last verified state, timestamp, evidence source, ownership, active switch state, and safe next action.
*   **Security boundary:** Display status metadata only. Never render secret values, tokens, private payloads, payment-card data, encryption keys, user reflections, or unrestricted logs. Credential creation, reveal, copying, and editing remain outside this HUD.
*   **Control boundary:** Emergency controls must use the scoped switches and recovery rules in DEC-021, clear consequences, intentional confirmation, authorization checks, and audit events. Colour, glow, motion, or a claimed “real-time” state must never be the only status signal; stale and unknown states must be explicit.
*   **Revalidation basis:** Explicit human approval of Option 28A. This keeps the historical visual threat-model concept while adding accessible fallback, evidence timestamps, safe status semantics, and strict separation from secret material.

### DEC-029 — Human-Controlled 1Password Vault with Replit-Managed Runtime Secrets — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE; RUNTIME CONNECT AND AUTOMATIC ROTATION DEFERRED**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** People may manage production credentials in 1Password, while the deployed application receives only the runtime secrets it needs through Replit's managed environment. MyFive will not depend on a new automated vault bridge until that bridge is separately proven and approved.
*   **🛠️ Canonical rule:** Use 1Password as the human-controlled administrative credential vault and recovery inventory, and use Replit-managed environment secrets to inject least-privilege values into the approved runtime. Maintain a provider-specific rotation and emergency-revocation runbook with named ownership, recovery access, validation, and audit evidence.
*   **Deferred boundary:** 1Password Connect or another runtime API dependency, automatic provider-key rotation, secret synchronization, and 1Password as an operational log destination remain deferred. Each requires a separate proof covering identity and service accounts, permissions, network dependency, availability and recovery, supported provider rotation behavior, auditability, cost, and failure-safe rollback.
*   **Authentication boundary:** Human authentication may use security controls supplied by the credential provider and device. The application must not claim to implement biometric authentication, collect biometric data, or infer that WebAuthn always uses biometrics.
*   **Migration boundary:** Existing working credentials must not be rotated, moved, invalidated, or removed during DEC-015 migration until the dependent legacy and replacement workflows have passed coordinated callback, authentication, rollback, and continuity checks.
*   **Revalidation basis:** Explicit human approval of Option 29A. This approves a clear human-vault/runtime-injection model while declining the historical unproven automated runtime, biometric, rotation, and offsite-log bundle.

### DEC-030 — Purpose-Limited Incident Mode and Operational Audit Logging — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** When emergency controls are active, authorized operators see an unmistakable incident-mode state and the system records the security-relevant actions needed for investigation—without copying secrets or private relationship content into logs.
*   **🛠️ Canonical rule:** Activate a prominent, accessible incident-mode banner whenever a break-glass grant, provider kill switch, or global emergency stop is active. Increase purpose-limited security audit coverage for actor, authorization, reason, scope, target, action, result, timestamp, expiry, revocation, correlation identifier, and recovery state. Preserve integrity and restricted access according to the approved retention policy.
*   **Data boundary:** Do not log credentials, tokens, encryption keys, payment-card data, private browser-vault content, private reflections, unnecessary personal data, or unrestricted request and response bodies. Incident logging is not authorization for continuous behavioral monitoring.
*   **Records boundary:** Operational incident logs and incident records are distinct from the organization's record of processing activities and other compliance documentation. Do not label decorative log markers as legal compliance records. Sending logs offsite or into a credential vault requires a separately approved destination, purpose, access model, data-processing terms, retention, deletion, and recovery design.
*   **Revalidation basis:** Explicit human approval of Option 30A. This preserves fast visual recognition and high-quality incident evidence while correcting the historical ROPA and 1Password-log conflation.

### DEC-031 — Versioned Internal Human-Agency and Safety Evaluation — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** MyFive will repeatedly check whether the product protects accessibility, privacy, consent, human agency, and calm use, but passing an internal checklist is not a clinical or ethical certification.
*   **🛠️ Canonical rule:** Maintain a versioned internal evaluation checklist, which may be described as ACX-inspired only when its referenced source and version are recorded. Map every checklist item to a canonical decision or PRD requirement, an accountable owner, inspectable evidence, a pass/fail or documented-risk result, remediation, and a re-evaluation trigger.
*   **Coverage boundary:** The checklist must include accessibility, comprehension, error recovery, user control, reversibility, consent, private-by-default behavior, non-surveillance, non-coercion, non-diagnostic language, human authorship, incident safety, and migration continuity. It supplements rather than replaces specialist accessibility, security, privacy, legal, payment, or clinical review where such review is required.
*   **Claims boundary:** Do not claim “absolute alignment,” clinical validation, ethical certification, guaranteed safety, or universal suitability from this internal assessment. If ACX provenance, terminology, licence, or applicability cannot be established, label the checklist as an internal MyFive Human-Agency and Safety Evaluation.
*   **Revalidation basis:** Explicit human approval of Option 31A. This retains structured self-evaluation while replacing the historical guarantee language with traceable, testable, reviewable evidence.

### DEC-038 — Exact Test-Bound MyFive Proof Journey — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** The proof of concept is complete when two test participants can travel through one realistic paid MyFive connection journey and safely remove their test data, while the current Green Elephant business remains untouched.
*   **🛠️ Canonical rule:** Prove this exact bounded journey on the SvelteKit, Svelte 5, Zero, Neon PostgreSQL, Drizzle, Stripe, and Replit Reserved VM target: authenticate a primary test participant; complete a `€4.99/month` Stripe test-mode checkout; receive webhook-backed five-seat entitlement; create and accept one sponsored invitation with a second test participant; record each participant's separate current nine-ValueRules™ consent; create and review a private eight-dimensional Connection Profile without partner leakage; create one shared agreement only after bilateral consent; export the test account data; and complete the approved deletion path for the test identities and their browser-vault test data.
*   **Test-data boundary:** Use synthetic identities, test-mode payment instruments, non-production message destinations, isolated test records, and explicitly labelled test connections. Do not use real private reflections, production charges, uninvolved recipients, production marketing sends, or unapproved Google writes to prove the journey.
*   **Proof evidence:** Record functional results plus authentication, authorization, seat-cap, consent-version, private/shared isolation, webhook idempotency, Zero synchronization, reconnect, intermittent-connectivity, redeploy, export, deletion, rollback, and legacy-regression evidence. Performance observations remain evidence under DEC-036, not guarantees.
*   **Handoff rule:** Stage 2 begins immediately after the decision log records the complete Stage 1 evidence. Passing a smaller signup or private-check-in demo is insufficient; completing unrelated production features is not required.
*   **Approval basis:** Explicit human approval of Option 38A.

### DEC-039 — Sunday Refactor Target at 23:59 Europe/Helsinki — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** The team is aiming to finish the approved refactor by the end of Sunday, but the clock never justifies breaking payments, Satellite Scan, privacy, or rollback safety.
*   **🛠️ Canonical rule:** Set the target for completing the approved two-stage refactor scope to `2026-09-06T23:59:00 Europe/Helsinki`. Plan and report delivery against that local civil-time deadline, including the timezone name so daylight-saving interpretation is not lost.
*   **Safety boundary:** The date is an aggressive delivery target, not an automatic cutover, legacy-retirement, feature-activation, phase-transition, spending, or risk-acceptance authorization. Every applicable proof, privacy, parity, continuity, reconciliation, stabilization, and rollback gate remains mandatory.
*   **Miss rule:** If a surface cannot safely satisfy its gate by the target, keep its verified legacy path operational, record the unmet evidence and new forecast, and continue the sequential refactor. Never force an unsafe cutover or conceal unfinished scope to claim the date was met.
*   **Approval basis:** Explicit human approval of Option 39A.

### DEC-040 — Risk-Based Stabilization with 24-Hour Rollback Retention — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** Simple pages can settle quickly; accounts, payments, and integrations get more observation. The old path remains ready for rollback for at least a day even while work continues onto the next slice.
*   **🛠️ Canonical rule:** After the relevant automated and manual parity checks pass, apply a minimum continuous observation window of 15 minutes to static or read-only public surfaces; 30 minutes to authenticated, administrative, or stateful non-revenue surfaces; and 60 minutes to payments, fulfilment, schedulers, email automation, Typeform, Satellite Scan, Google, Notion, Zero replication, and other external or revenue-bearing integrations.
*   **Evidence boundary:** The 60-minute class also requires at least one complete synthetic success with provider-side and application-side reconciliation, duplicate-suppression checks where applicable, and no unresolved critical error. Every window requires monitored logs and health signals appropriate to the surface. A critical failure or material corrective deployment restarts the applicable window.
*   **Rollback boundary:** Keep the verified legacy handler, routing fallback, configuration, and rollback instructions available for at least 24 hours after cutover. Work may continue to the next independent slice during that retention period, but the legacy path must not be deleted, invalidated, or made unrecoverable.
*   **Classification boundary:** Record the risk class, start and end timestamps, tests, monitoring evidence, incidents, reconciliation, approver, and rollback state in the per-surface migration ledger. When classification is uncertain, use the higher-risk window.
*   **Approval basis:** Explicit human approval of Option 40A.

---

### DEC-041 — MyFive Alpha Privacy-Isolation Contract — APPROVED & ACTIVE BASELINE

*   **Status:** **APPROVED & ACTIVE BASELINE**
*   **Owner:** Estève
*   **🧠 Plain-language meaning:** Anonymous visitors may use the private check-in vault in their own browser, but MyFive must verify an account before saving relationship data on the server. Private check-ins stay browser-local unless the user explicitly exports them. A shared agreement requires current consent from both participants, and one participant must not be able to erase or expose the other's independently authored data.
*   **🛠️ Canonical rule:** Apply the following privacy contract to the Alpha implementation and all successor-stack replacements. Stage 4.3 remains incomplete until each rule has direct test evidence and human privacy/security approval.
*   **Authentication boundary:** Anonymous use is permitted only for the browser-local private vault. Require a verified MyFive account before server persistence of slots, invitations, consent receipts, agreements, Connection Profiles, subscriptions, exports, or deletion requests. Anonymous-to-account reconciliation is excluded from Alpha unless separately approved.
*   **Private check-in boundary:** Remove or hard-disable the server check-in endpoint for Alpha and remove the server `myfiveCheckIns` persistence path unless a separately approved encrypted-sync design supersedes this rule. Approved product wording is “Stored only in this browser unless you export it”; absolute confidentiality claims are prohibited. XSS prevention, CSP, dependency review, and sensitive-log exclusion are part of the vault boundary.
*   **Bilateral consent boundary:** Store one immutable receipt per participant, connection slot, and material ValueRules version. Agreement creation or update is permitted only when both linked account IDs have complete receipts for the current version. A rejected attempt may append a non-sensitive reason code such as `partner_current_consent_missing`, but must never copy private answers or Connection Profile data. A material rules update resets agreement-write eligibility for both participants until both re-consent.
*   **Ownership and deletion boundary:** Individually authored private or profile data belongs to its author. Deleting one account must not delete the other participant's independently authored data. A joint agreement is a distinct shared record: deletion revokes the deleting subject's participation and hides or locks the record, while final erasure or retention follows an explicitly documented joint-record policy. Slot ownership must never be treated as ownership of every record under the slot.
*   **Joint-agreement survivor-custody policy (Option C):** When one participant deletes their account, immediately and permanently revoke that account's access, freeze every joint agreement against edits, remove the deleted account's direct identifiers and consent-receipt links, and preserve the other participant's read, export, and delete access. Retain the frozen agreement only until the surviving participant deletes it or deletes their account, whichever occurs first; erase it when no participant remains. Survivor custody may not be used for search, analytics, training, new sharing, relinking, or a new partner. Green Elephant must disclose this lifecycle before agreement creation and again at account deletion, warn that free text may still refer to the deleted participant, and provide a documented process for erasure, restriction, and objection requests concerning retained text.
*   **Survivor-custody production gate:** Option C records Estève's product decision, not a claim of legal sufficiency. Before production activation, qualified privacy counsel or the accountable DPO must record the specific purpose and lawful basis for continued processing, any Article 9 condition required by the content risk, the necessity and rights-balancing assessment where Article 6(1)(f) is proposed, the applicable privacy-notice text, the rights-request procedure, and backup-erasure handling. Production behavior must fail closed while that record is absent; implementation and disposable-fixture testing may proceed without representing the policy as legally validated.
*   **Deletion and billing boundary:** Fail closed by marking the account deletion-pending and revoking every active session. Commit durable deletion state before external Stripe work. Stripe cancellation or customer deletion must be idempotent, retryable, observable, and safely resumable after partial failure. User-visible status must distinguish pending, completed, and action-required states and must not imply atomic success across Stripe and PostgreSQL.
*   **Provisional partner-data boundary:** Before invitation acceptance, store only a user-chosen nickname or label and relationship type, discourage legal names, provide a clear notice, allow immediate owner deletion, and expire unaccepted invitations plus provisional partner data after 30 days. Acceptance links the connection by internal user ID; typed labels must not be used to infer identity.
*   **Export boundary:** Export the authenticated subject's authored data, consent evidence, account and subscription state, and approved view of shared-record metadata, including both owned and explicitly linked slots. Never export another participant's private check-ins or Connection Profile payloads. Browser-vault export remains local, explicit, and user-triggered.
*   **Session, administration, and logging boundary:** Use a per-user session/auth version or equivalent global-revocation mechanism. Voucher creation requires a write-capable administrator role and an immutable audit event. Application logging must use an allowlist and redact tokens, invitation URLs, voucher codes, cookies, authorization values, emails, credentials, and free-text/private payloads before serialization.
*   **Stage 4.3 proof gate:** Direct regression tests must prove AC-002, AC-003, AC-006, AC-016, and AC-017; evidence must cover partner, administrator, anonymous, authenticated, export, deletion, consent-version, session-revocation, logging, and partial-failure paths. Stage 4.3 may be checked complete only after the evidence is linked and a human privacy/security review approves it.
*   **Delivery order:** Deliver as separately bounded and approved units: (A) remove misleading server check-in surfaces and redact logs; (B) enforce authentication on server-persisted MyFive routes; (C) implement bilateral consent and tests; (D) redesign ownership, export, and deletion; (E) implement global session revocation and idempotent Stripe deletion orchestration; and (F) complete the privacy regression suite and human review. Each unit follows the one-numbered-step-per-commit protocol.
*   **Evidence:** GitHub issue #8 records the static findings, positive controls, risks, required decisions, and acceptance gates reviewed before this approval.
*   **Approval basis:** Estève explicitly approved the recommended privacy-contract bundle in the Codex workshop on 2026-09-10.

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
- [x] **4.3** Audit check-in queries to ensure 100% blind vault isolation from partner views & admins. Final privacy/security evidence approved by Estève on 2026-09-17 in #14; production activation remains separately gated.
  - [x] **4.3-A** Disable server private-check-in acceptance and reads, quarantine the legacy table mapping without destructive migration, remove response-body logging, and replace absolute vault claims with the approved browser-local wording.
  - [x] **4.3-B** Enforce account and privileged authorization on MyFive persistence.
  - [x] **4.3-C** Implement bilateral versioned ValueRules consent for shared agreements. Privacy/security evidence approved by Estève on 2026-09-11 in #11.
  - [x] **4.3-D** Separate data ownership and rebuild export/deletion boundaries. Privacy/security evidence approved by Estève on 2026-09-15 in #12; production activation remains subject to the qualified legal/privacy gate.
  - [x] **4.3-E** Add global session revocation and idempotent Stripe deletion orchestration. Privacy/security evidence approved by Estève on 2026-09-15 in #13; production activation remains separately gated.
  - [x] **4.3-F** Complete the privacy regression suite and obtain human Stage 4.3 approval. Approved by Estève on 2026-09-17 in #14.

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
| Stage 4.3-A — server check-in quarantine and metadata-only API logging | 11.4.1 | Commit containing this `11.4.1` ledger entry | No schema migration; legacy table retained and quarantined |
| Stage 4.3-B — account, record, Stripe-webhook, and privileged voucher authorization | 11.4.2 | Commit containing this `11.4.2` ledger entry | No schema migration required |
| Stage 4.3-C — bilateral versioned ValueRules consent for shared agreements | 11.4.3–11.4.5 | Initial branch implementation: `3c52d20`; audit correction: `63202fe`; approval: commit containing `11.4.5` | Additive plan only: `20260911_myfive_bilateral_value_rules_consent.sql`; no production migration run; privacy/security evidence approved in #11 |
| Stage 4.3-D — ownership, export, deletion, and joint-agreement survivor custody | 11.4.6–11.4.11 | Option C specification: commit containing `11.4.6`; implementation: `10bc4bf`; fixture batch: `b002365`; PostgreSQL typing correction: `fa2a497`; passing evidence record: `90d6548`; approval: commit containing `11.4.11` | Additive, production-unexecuted plan: `20260912_myfive_ownership_boundaries.sql`; CI run 19 exposed `42P08`; corrected CI runs 20 and 21 passed 28/28 tests against PostgreSQL 16, type-check, and build; Estève approved privacy/security evidence on 2026-09-15; qualified production legal/privacy validation remains pending |
| Stage 4.3-E — global session revocation and resumable Stripe deletion | 11.4.12–11.4.15 | Implementation candidate: `2970e7e`; fixture correction: `db0e290`; passing evidence: `8f7b52f`; approval: commit containing `11.4.15` | Additive, production-unexecuted plan: `20260915_myfive_resumable_account_deletion.sql`; CI run 23 failed on PostgreSQL `42601` in parameterized multi-statement fixture setup; corrected CI runs 24 and 25 passed 31/31 tests against PostgreSQL 16, type-check, and build; Estève approved privacy/security evidence on 2026-09-15; production activation remains separately gated |
| Stage 4.3-F — final cross-stage privacy/security audit | 11.4.16–11.4.18 | Candidate: `91e42f7`; passing evidence: `46f7145`; approval: commit containing `11.4.18` | No migration; MyFive CSP/security headers, redacted error handling, allowlisted operational events, cross-stage regression coverage, and browser/dependency/source-scan evidence; CI runs 27 and 28 passed 35/35 tests against PostgreSQL 16, type-check, and build; Estève approved the final privacy/security evidence on 2026-09-17; production activation and the qualified survivor-custody legal/privacy gate remain separate |

---

## ✅ Build-Start Checklist

*   [x] Stripe pay gates integrated into existing `GreenElephantorg` checkout pipeline.
*   [ ] Run dynamic code scan on `/client` to ensure zero instances of `getUserMedia` or camera permission requests are compiled.
*   [ ] Confirm all outbound email sending is disabled by default (test mode / kill switch ON) until explicitly approved.
*   [ ] Ensure Google Client ID matches validated credentials on the active Google Cloud Console profile.
*   [ ] Confirm zero plaintext credentials, passwords, or tokens exist in active codebases.
<!-- END PRESERVED MY5 DECISIONS -->

</details>
