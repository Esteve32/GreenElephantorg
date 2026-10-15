---
document_id: GE-PRD
document_type: product_requirements
canonical_path: docs/PRD.md
decision_authority: docs/DECISION_LOG.md
project_index: docs/project-index.json
---

# Green Elephant — Product Requirements

One PRD, two product sections plus shared-system requirements. Version: **2.27.5**.
Owner: Estève Pannetier. Reconciled: 2026-10-05. Workshop updated: 2026-10-07.

The current governance decision is [DEC-GE-PRD-001](DECISION_LOG.md#dec-ge-prd-001).
GitHub owns this PRD and the single decision log. Notion holds derived mirrors.
The shared-document structure is present in GitHub main at `84d5230`.
The website-refresh implementation was merged through PR #48 at
`f433e611544feacfda86c4b418d6ca802a824612`. This establishes GitHub source status,
not production publication or completion of open acceptance gates. Product
proposals remain proposals even when their source recommends them.

| Project ID | Project | State | Entry |
| --- | --- | --- | --- |
| AI-LIT | AI Literacy Training Portal and website findability | Approved website implementation; release verification in progress | [AI literacy](#ai-literacy) |
| MY5 | MyFive relationship application and former unified refactor | Paused; no resumption date | [MyFive](#my5) |

The [project index](project-index.json) is a machine-readable router and source
inventory, not a second specification. Stable IDs below are the query keys.
Use `Fact`, `Approved direction`, `Proposal`, `TBD`, or `Historical` explicitly.
An imported approval is attributed to its source; it is not a new approval by this
migration. A requirement is not proof of implementation.

<a id="green-elephant-os-and-website-boundary"></a>
## Green Elephant OS and website boundary

Green Elephant OS (Notion/Google schemas, scripts and future automation tools)
and this website are two independently managed parts of Green Elephant. Each repo
owns its own canonical PRD and decision log. This shared section records the
website-facing integration requirements; it does not merge the repositories or
authorize a provider write.

| ID | Status | Requirement | OS cross-reference |
| --- | --- | --- | --- |
| GEOS-REQ-001 | Approved process direction | Preserve separate ownership, with one canonical PRD and decision log per repository. | OS DEC-GEOS-001 |
| GEOS-REQ-002 | Approved process direction | Before merging a change to a shared schema, package, field, data flow, calendar label, email payload, consent rule, customer journey or deployment boundary, cross-check the paired PRD and decision log and record both source SHAs. | OS DEC-GEOS-001 |
| GEOS-REQ-003 | Approved evidence rule | Treat integrations as active only when current code/configuration and the receiving system verify them. The OS contracts package is private and is not declared in this website's package.json; adoption is unverified. | OS DEC-GEOS-002 |
| GEOS-REQ-004 | Approved boundary | Do not copy website purchases into Notion unless a later explicit human decision is recorded here. Preserve the boundary stated in website PR #34. | OS DEC-GEOS-003 |
| GEOS-REQ-005 | Approved process direction | Apply the pinned canonical AI Literacy Training Seed instructions when enabled in `docs/agent-settings.yml`; a developer may disable this supplemental layer by setting `seed_instructions.enabled` to `false`. The repository's own instructions and safety boundaries always remain active. | OS DEC-GEOS-004 |
| GEOS-TBD-001 | TBD | Confirm whether any existing website Notion fields or Scan flows match OS schemas, including direction, data fields, purpose, consent, retention, tests and deployed state. | GEOS-REQ-002/003 |

Current website releases follow the
[GitHub-to-Replit deployment runbook](operations/replit-deployment.md):
reviewed GitHub main is authoritative and a human selects Republish. Older OS
notes that claim Replit publishes code back to GitHub are not release authority.

All new proposals affecting this boundary remain proposals until the human
explicitly selects them in workshop mode and the decision is recorded under
[DEC-GE-PRD-002](DECISION_LOG.md#dec-ge-prd-002).

<a id="ai-literacy"></a>
## AI-LIT — AI Literacy Training Portal

**State:** approved website implementation and release preparation, with core
English/French application pages and remaining translation/provider checks. **Source:** SRC-AI-LIT, Notion draft
v0.3 exported 2026-09-30, refined by the current AI-LIT decisions below.
**Owner:** Estève Pannetier. The approved website scope may be merged through a
reviewed PR; production publication and verified delivery remain separate gates.
The MyFive project remains paused.


<a id="ai-lit-email-workshop-20261007"></a>
### Email lifecycle workshop — 7 October 2026

**Status:** requested documentation and source audit; candidate requirements below
are **proposals**, not permission to change sending, contacts, providers or code.
Estève requests an AI-literacy email review covering paid Satellite Scan,
workshop participants, the wider ecosystem and repeat business. Record human
choices here and in [DEC-AIL-080](DECISION_LOG.md#dec-ail-080) before implementation.
Website evidence is pinned to `b1a8c52784861a98d1f0d3ada39bbbcdda332454`;
this section is a later **working-tree draft**. Live Resend settings, saved database
templates, production deployment and inbox delivery have not been inspected.
“Exists in source” below never means “verified sending in production”.

#### Remaining specifications before choosing the next batch

| Area / IDs | Current interpretation | Next evidence or decision |
| --- | --- | --- |
| French coverage — REQ-002/032/064 | Core bilingual routes exist; remaining retained pages and legacy email families are unfinished. The five niche coaching pages remain English first. | Route-by-route and template-by-template inventory and human copy review; do not repeat historical claims that the entire site is bilingual. |
| Role/service alignment — REQ-064, DEC-AIL-065/066 | The coverage table still lists role-specific reflection pages and people/supporting services as pending. Later decisions record several partial repairs, not acceptance of every page. | Reconcile each current page with its acceptance criteria before marking this batch complete. Preserve retained services and their actual offers. |
| Delivery and privacy — REQ-010/035/036, DEC-AIL-037/043/079 | Source safeguards exist; production signatures, correct recipients, actual delivery, access, retention and processor/transfer evidence remain open. | Use the deployment checklist and the message inventory below. Email work directly addresses this unfinished scope. |
| Measurement and release — REQ-075, issues #31/#43 | Source tests are not production publication, consent testing or GA4 receipt. The latest recorded switch changes are owner-reported. | Exact deployment evidence and receiving-system checks. Do not enable collection during this email workshop. |
| Offer details — REQ-017/020/023; TBD-002/004 | Four-day journey hours/price/logistics and some discovery-workshop delivery/preparation details remain open. | Confirm what is bought, included, delivered and when before writing promises into emails. |
| Discovery and access — REQ-009/068 | Search/indexing outcomes, live booking/provider paths and final accessibility/visual acceptance are separate from source markup. | Bounded review with current evidence; no assumed ranking or funding/accreditation claims. |

Earlier PRD checkpoints mentioning TypeScript failures or unfiltered campaign
audiences are historical: later source repairs and the 7 October baseline checks
supersede those engineering observations. They do not close human or production
gates. The current baseline passed 119 release tests, type/repository/build checks;
this is prior source-validation evidence, not a live email test.

#### Current email inventory and gaps

The source has 24 exported sender functions in
[`server/email-notifications.ts`](../server/email-notifications.ts), plus direct
admin batch/campaign/test sends in [routes](../server/routes.ts).
Several functions create both customer and internal messages.

| Journey / source | Current source behavior | Marketing, delivery or privacy review |
| --- | --- | --- |
| Scan address verification — `sendVerificationEmail` | Sends a requested code. | Keep factual, accessible and separate from promotion; verify expiry/rate limits and actual address-verification path. |
| Paid/free-voucher Scan — `sendSatellitescanPurchaseEmail`, `notifyScanPurchase` | EN/FR purchase instructions plus separate internal purchase notice; shared public Typeform link carries language. | Good AI-literacy starting point. Confirm actual intake, English questionnaire/video notice, receipt information and the 48–72-hour coach promise. Service purchase does not subscribe the buyer to a newsletter. |
| Incomplete Scan — `sendSatellitescanReminderEmail`, `remindScanOnce` | A daily in-process check selects incomplete purchases older than 72 hours; durable claim and accepted-send count limit duplicates. Admin reminder route also exists. | “After 72 hours” is a threshold, not an exact send time. Hosted process lifetime/restarts affect scheduling. Stop after completion/refund/cancellation and define recovery before expanding. |
| Submitted Scan — `sendTypeformScanCompletionEmail` | Signed Typeform route; response-event claim; EN/FR complete answers in body and text attachment; participant receives it and both Estève and Anu are copied. | Current owner-approved coach copies are preserved. Checkout discloses them; verify the actual Typeform notice, necessity, coach access and mailbox retention. No employer/organiser receives answers merely because they bought a seat. |
| Coach-prepared results — `sendCoachingRawDataEmail`, `sendCoachingDocLinkEmail`, `sendCoachOnlyEmail` | Manual admin sends of raw answers, dashboard link/summary or internal coach copy. Dashboard sending is not automatically triggered by creating a dashboard. | Verify report readiness and recipient access; offer a reviewed secure-link approach if chosen. Define service delay/support handling. The current source emails private content; a link does not automatically establish authorization. |
| Account/support — `sendPortalDataExportEmail`, `sendPasswordResetEmail`, `sendNudgeDevNotification` | Requested export/reset and internal help notification. | Preserve security/service purpose; verify identity, short-lived access, attachment scope and retention. Do not add offers to security or rights-request messages. |
| Other package purchases — `sendPurchaseNotification` | Generic admin purchase alert; special Interview Mastery customer branch with Scan and booking links. Other packages direct the operator to follow up manually. | Interview copy still says “90-question diagnostic”, conflicting with the current 129-question reflective Scan. Review package promises, language and payment/refund journeys separately; not proof of a workshop purchase flow. |
| Newsletter — `sendNewsletterConfirmationEmail` and admin campaigns | Welcome still promotes communication, retreats and Play Labs. Campaign eligibility uses newsletter membership, consent flag and suppression; bulk sends add signed unsubscribe. | Rebrand around approved AI-literacy value and choices. The welcome itself uses reply-to-unsubscribe rather than the common signed footer. A welcome is not a verified double-opt-in flow. |
| Scan-interest lead — `sendScanInterestConfirmationEmail`, `sendScanInterestAdminNotification` | Delivers free-tool links plus explicit paid-Scan promotion; route also creates a newsletter subscription. | Classify as marketing when it includes an offer. Check the exact permission requested and avoid treating a resource request as blanket permission for all follow-ups. |
| Requested assessments — `sendQuizResultsEmail`, `sendFlowCheckResultEmail`, `sendFlowCheckAdminNotification` | Result messages include paid-Scan promotion; Flow sends an internal result notification. Legacy result/benchmark language remains in email templates. | Separate requested results from offers if chosen. Align interpretation with the reviewed website's non-diagnostic wording; check purpose/recipients and do not segment sales by inferred feelings, vulnerability or private answers. |
| Contact — `sendContactFormEmails` | Receipt plus internal message; promises a personal reply within 24 hours. | Confirm an achievable service promise and owner. An enquiry is not newsletter enrolment. Keep essential reply routing separate from campaigns. |
| Retreat waitlist — `sendWaitlistConfirmationEmail` | Acknowledgement plus internal alert; resource/Scan links and legacy offer language. | Preserve the requested retreat; decide whether other offers need a separate choice. Do not relabel the retreat as AI training without approval. |
| Parked webinars — `sendWebinarWaitlistConfirmation`, `sendWebinarReplayConfirmationEmail` | Sender/API code remains although public webinar/calendar pages are parked. Replay text promises a link later, not verified automatic replay delivery. | Keep parked scope; no resumption through this workshop. Review any residual entry points and recipients before deciding what to retire. |
| Legacy onboarding — `sendOnboardingEmail`, [scheduler](../server/onboarding-scheduler.ts), admin template seeds | Exported scheduler processing and manual trigger are paused. Runtime templates are database-backed. Seed route contains sequences 0–9; scheduler comments describe 0–12; admin/footer language says 12. Seed subject day labels also disagree with delays interpreted from Scan completion. | Do not restart the old cadence. Review purpose, readiness triggers, language, subscription and repetition rules. Database contents and any Resend-hosted automations remain unknown. |
| Internal operations — `sendDailyPulseEmail`, `sendContentFlywheelEmail`; direct admin test sends | Internal activity summary and draft-content review; manual routes exist. | Keep internal-only messages out of customer programmes. The Email Control Room journey-test endpoint sends a pulse-style summary, not the actual journey template. Review financial summaries separately before using them as sales evidence. |

The admin Email Control Room is a **static description**, including `gdpr: true`
flags and an active-looking onboarding list. It is not an audit result. Proposed
future UI should show purpose, source evidence, real activation state and outstanding
checks rather than compliance badges.

#### Proposed service and repeat-business design

**Recommended commercial approach:** make the purchased experience reliable first,
help the learner achieve one useful AI task, then offer the next appropriate
service to people who have chosen that relationship. This is a strategic proposal,
not a claim of increased revenue or a selected send schedule.

| Stage | Proposed experience | Purpose / trigger boundary |
| --- | --- | --- |
| Paid Scan confirmation | One clear next action: open the questionnaire; explain language, time, coach access and support. | Verified purchase or authorized voucher activation; one message per purchase/recipient/purpose. |
| Preparation/reminder | Help an incomplete participant resume; workshop participants also receive agreed session logistics. | Actual incomplete state and agreed cutoff; suppress after completion, cancellation or a relevant support hold. |
| Submission | Confirm receipt, describe the next coach action and realistic delivery time. | Verified response tied to the correct purchase/participant; no claim that a finished dashboard already exists. |
| Results ready | Provide verified access and one small practice task appropriate to the purchased deliverable. | Coach-confirmed readiness, correct participant and permission. Scope included support before setting follow-up volume. |
| Included support / follow-up | Ask whether they can use the material and deliver any contracted follow-up. | Genuinely included service content; a sales invitation is classified separately. |
| Optional AI-literacy practice | Proposed short series: choose a low-risk task, write a clearer request, check the output, reflect on one useful result. | Separate documented marketing choice if the programme promotes services; exact number, timing, languages and stopping rules await selection. |
| Relevant next offer | Invite an individual to appropriate coaching or a four-day journey; invite an organisational buyer to a suitable team workshop. | Explicitly chosen interests and actual service state; avoid score-based targeting, fabricated urgency or unapproved prices. |
| Longer relationship | Optional useful updates, returning-customer check-in and shareable referral invitation. | Agreed permission and frequency; pause conflicting campaigns and stop on objection. Do not collect friends' addresses or auto-send referrals. |

A possible starter marketing cadence is three useful messages after results are
available, followed by at most a monthly update. **This is unselected**, not an
instruction to schedule. Existing contacts need a permission/history review;
do not bulk-enrol or send a “permission request” campaign merely to repair missing
consent. Keep transactional and promotional preferences distinguishable.

Business review should ask whether participants complete the Scan, receive usable
results on time, request suitable further help and make repeat purchases. Track
unsubscribe/complaint/delivery failures as operating signals. Do not infer success
from open pixels or make individual engagement surveillance a requirement.

#### Workshop purchase and participant decisions still needed

Estève's requested design includes a Scan for each workshop participant.
This is a **requested outcome to specify**, not evidence that group checkout,
seat allocation or those inclusions already exist at the advertised price.

- Distinguish payer/buyer, organising contact, participant and assigned coach.
  Current Scan purchase records are per email/payment and have no dedicated
  workshop seat/cohort relationship in the inspected schema.
- Decide enquiry/invoice-assisted booking versus online group checkout, which
  workshop offer includes Scans, and whether current prices cover those Scans.
  Preserve REQ-023's approved price, size and delivery depth until changed explicitly.
- Prefer an invitation each participant accepts with their own language and
  notice/preferences. Decide invitation sender, lawful collection route, expiry,
  replacement seats, duplicate bookings, refunds and cancellation.
- Give the organiser logistics/billing and only the agreed minimal participation
  status. Private answers and individual reports do not become employer/team data
  by default. Define any aggregate output and small-group re-identification risks.
- Choose who prepares/reviews each report and who can see it. Verify the processing
  roles and appropriate lawful basis for employer-sponsored participants; the
  buyer's contract is not automatically a contract with every individual.
- Stop resolving repeat purchases/workshop participation solely by email:
  `markTypeformCompletedByEmail` updates matching purchases. Future delivery must
  identify the intended order, participant and response without exposing identifiers.
- Keep workshop attendance, learning support and marketing choices distinct. An
  organiser cannot subscribe participants to unrelated offers on their behalf.

#### Candidate requirements — no implementation approval

| ID | Status | Candidate / acceptance question |
| --- | --- | --- |
| AI-LIT-REQ-076 | Requested audit and workshop; source review prepared | Maintain a complete sender/trigger/purpose/language/recipient inventory, reconcile remaining specs and review live templates separately. Record choices in this PRD/log before code; use local mockups → checked GitHub PR → human-authorized exact-SHA Replit sync → human Republish. |
| AI-LIT-REQ-077 | Proposed; choice pending | Separate required service messages from optional learning/offers. Define subscription purpose, exact copy/version, time/source, withdrawal and suppression; purchase/result delivery must work without newsletter permission. Existing-contact migration, country-specific exceptions and re-subscription need review. |
| AI-LIT-REQ-078 | Requested workshop outcome; mechanics/price unapproved | Specify one Scan entitlement per relevant workshop participant with separate buyer/organiser/participant/coach roles, individual notice/preferences and controlled report access. Decide sale/seat/invitation/cancellation model before data/schema/code changes. |
| AI-LIT-REQ-079 | Proposed | Define email events and durable per-recipient delivery state; verify signed Resend delivery/bounce/complaint/suppression events, safe retries and staff reconciliation. Provider acceptance, recipient-server delivery and inbox/access checks are distinct. Respect both application preferences and provider suppression. |
| AI-LIT-REQ-080 | Proposed | Audit and revise every retained customer template in EN/FR for AI-literacy positioning, current offer facts, non-diagnostic wording, accessible HTML/plain text, clear sender/reply routing and correct unsubscribe where promotional. Preserve parked services until separately chosen. |
| AI-LIT-REQ-081 | Proposed | Define the full processing map, lawful basis by purpose, recipient access, retention/deletion, processor agreements/transfers and rights workflow, including Typeform, application/storage, Resend, coach mailboxes, report storage and any verified existing OS transfer. No blanket GDPR-compliant label or assumed EEA-only hosting. |
| AI-LIT-REQ-082 | Proposed | Review synthetic local email previews, state/consent/replay tests, then exact approved sender/recipients/subject/body/attachments for an authorized live test. Record provider event, inbox content and accessible report result before marking that path verified. |

**Workshop choice EMAIL-W01 resolved — DEC-AIL-093, 14 October 2026:** purchased-
service emails first; optional learning/offers follow. Estève selected **A in the
new launch-priority question**, which corresponds to **B in this older question**.
This sets work order, not exact copy, cadence, recipients, sending or publication.
Existing full privacy-system and confirmed-opt-in approvals remain in force.
Workshop fulfilment mechanics, report sharing and optional programme details still
need their own decisions/evidence where not already approved.

#### Privacy and provider evidence to collect

This is an operational design review, not legal clearance. The reviewed official
guidance distinguishes purpose-specific lawful processing from blanket consent.
Necessary service processing and marketing need separate analysis; adding an
upsell can change how an otherwise factual email is classified. A conservative
explicit marketing opt-in is proposed for this mixed audience; it is not a claim
that consent is the only lawful route for every professional/customer in every
country. Evaluate any B2B or existing-customer exception for the actual audience
and country before using it.

- Record the controller and processor roles, actual notices and contracts, necessary
  data and recipients. Review open-text Scan answers for possible sensitive data
  without inferring health or other protected characteristics.
- Decide retention per purpose, including copies in inboxes/attachments and backups.
  Keep necessary accounting and minimal suppression records distinct from coaching
  answers and marketing profiles. Verify deletion/export propagation.
- Confirm the real Resend sender domain, SPF/DKIM/DMARC alignment, Reply-To,
  access owners, provider suppression, tracking settings and webhook configuration.
  The inspected app has no Resend delivery/bounce/complaint webhook handler.
  Native provider suppression may still operate; it has not been inspected.
- Review external tracking separately: disabled application open-pixel behavior
  does not prove Resend domain-level tracking is off.
- Keep direct application sends and any Resend Contacts/Topics/Automations
  consistent if those features are selected later. No new list, connector,
  recurring job, provider purchase or transfer is approved by this review.

Official sources checked 7 October 2026:
[EDPB lawful processing](https://www.edpb.europa.eu/sme/be-compliant/process-personal-data-lawfully_en),
[EDPB processing principles and retention](https://www.edpb.europa.eu/sme/learn-the-basics/data-protection-basics_en),
[EDPB controller/processor roles](https://www.edpb.europa.eu/sme/learn-the-basics/data-controller-or-data-processor_en),
[Finnish KKV electronic marketing guidance](https://www.kkv.fi/en/consumer-affairs/marketing-sales-and-indicating-prices/direct-marketing/inappropriate-direct-marketing/),
[CNIL electronic marketing guidance](https://www.cnil.fr/fr/la-prospection-commerciale-par-courrier-electronique-sms-mms-et-automate-dappel),
[UK ICO service versus promotional messages](https://ico.org.uk/for-organisations/advice-for-small-organisations/direct-marketing-and-data-protection/marketing-and-data-protection-in-detail/),
[Resend event meanings](https://resend.com/docs/webhooks/event-types).
Country-specific legal application and signed provider arrangements remain to verify.

#### Delivery workflow and cross-repository boundary

1. Inspect current Git status, current requirements and the selected source SHA.
2. Make workshop choices; record status, human evidence, affected IDs and unresolved
   details here and in the single decision log. Do not create a second authority.
3. Prepare local fictional/synthetic email mockups and journey scenarios. Approve
   purpose/content and implementation scope before changing application code.
4. Implement in a reviewable local branch; run applicable repository, release,
   TypeScript/build and privacy/recipient/state checks. Review the final diff.
5. Commit/push/open the reviewed GitHub PR when authorized; merge only when
   authorized and checks pass. Update release issue #31 for the actual merged SHA.
6. Preserve Replit-only work, manually synchronize to that exact reviewed source,
   complete production checks and keep development-database copying disabled.
   The human selects **Republish**; verify production separately.
7. Live email tests need exact final-message/recipient approval. Code review and
   local previews alone do not grant permission to send to existing contacts.

GreenElephantOS main was freshly resolved and its PRD/log read at
`83391d8520a6bfb2e010590686d6e32797490b62`. Website GEOS-REQ-002/003/004 and
OS GEOS-REQ-002/003/004, DEC-GEOS-001/002/003 govern this review.
No OS schema/contract/provider/data transfer changes are made by this documentation
batch, so no paired implementation PR is needed yet. Source contains older Notion
sync calls for several lead/campaign paths; their runtime destination and authority
remain unverified. The prohibition on introducing purchase-to-Notion copying
remains. Reopen paired review before any shared operational change.


<a id="ai-lit-ropa-workshop-20261007"></a>
### RoPA, consent evidence and admin email controls — 7 October 2026

**Status:** requested product direction, recorded in [DEC-AIL-081](DECISION_LOG.md#dec-ail-081).
Estève requests an application-owned RoPA in the Replit deployment, ideally a
Google Sheets mirror, links between email purposes, website buttons, Typeform
consent and subsequent changes, and weekly admin summaries instead of daily or
default individual alerts. This extends REQ-081; it does not approve the detailed
schema, data import, live sending or deployment. Application code is unchanged.

#### Source alignment and vocabulary

- Interpret “Roper/Ropa” as **record of processing activities (RoPA)**, pending
  identification of the current source. Drive metadata searches found historical
  GDPR/Typeform email-preference material, not a confirmed current RoPA.
  Do not copy contact rows or infer current permission from those filenames.
- A RoPA describes activities/purposes and their handling. A restricted consent
  ledger records an individual's choices and evidence. An operational event log
  records execution. These are linked records with different access/retention
  rules, not interchangeable proof of compliance.
- “Bio is not the same as user” is unresolved: confirm whether this means
  **buyer versus participant**, or **profile/bio versus account**. Do not silently
  substitute either interpretation. Pending confirmation, the proposed design
  separates account authentication, person/profile, payer/order, workshop organiser,
  participant/seat and assigned coach. One person may hold multiple roles.
- The existing application uses Drizzle with a Neon-compatible PostgreSQL driver
  and DATABASE_URL. “Inside Replit” means an application-managed feature deployed
  with the website; physical hosting, region, provider contract, backups and
  production/development separation require verification. Do not claim EEA-only
  storage or copy production data into local development.

The register should cover purpose, data/subject categories, recipients, relevant
transfers, retention and security, together with controller/contact information.
Our proposed additional links to legal-basis assessments, notices, controls and
release evidence support maintenance; a populated database alone does not
establish compliance. Basis:
[EDPB record-keeping guidance](https://www.edpb.europa.eu/sme/be-compliant/be-compliant_en)
and [CNIL register guidance](https://www.cnil.fr/fr/RGPD-le-registre-des-activites-de-traitement),
checked 7 October 2026.

#### Proposed linked records and access

These are conceptual records for review, not a database migration.

| Record | Proposed contents and links | Boundary |
| --- | --- | --- |
| Processing activity + version | Stable activity ID; purpose; controller/contact and responsible owner; subject/data categories; legal-basis assessment reference; recipients/processors; transfer safeguards; retention/deletion trigger; security summary; rights contact; review status/date; effective period | Versioned app register, with approved metadata projection to Sheets. Distinguish unknown, drafted, reviewed and live-verified fields. No agent-created human attestation. |
| Collection surface + notice version | Stable surface ID; page/form/button and locale; action type; activity IDs; exact notice/choice text version or secured snapshot/hash; Typeform form/question references; effective period and release SHA | Buttons that navigate or request delivery are not automatically consent controls. Map all relevant surfaces, including checkout, newsletter, result tools, contact, cookies, unsubscribes and Typeform. |
| Person, account and relationship | Separate IDs for subject/contact, login account, payer/order, organiser, seat/participant and coach assignment; scoped access grants | Email is a contact attribute, not the sole join key or proof that two roles are identical. Payment grants no default access to another person's answers. Profile edits do not rewrite consent. Final terminology awaits clarification. |
| Consent/preference evidence | Subject ID; purpose/activity; notice version; affirmative grant, refusal or withdrawal; event/effective times; language/source; minimal evidence reference; idempotency key | Restricted operational store, excluded from the general Sheet mirror. Purpose-specific current state derived from retained events; corrections recorded with provenance. No indefinite retention promise or needless IP/device collection. |
| Email definition and event | Template/version; service/marketing/internal purpose; activity ID; recipient role; eligibility rule; triggering event; permission decision at sending time; provider message ID and outcome | A queued message must recheck current preference/suppression. Provider acceptance is not delivery. Use event IDs and access-controlled evidence instead of copying message bodies/answers into the RoPA. |
| Change/review record | Old/new version; reason; actor; impact on purposes, recipients, retention, notices and permissions; PR/release evidence; effective date; reviewer status | Notice changes do not backdate agreement. Changed purposes require assessment and, where necessary, a fresh choice before the affected optional processing. Separate code deployment from live provider verification. |
| Rights/retention case | Subject reference; request type; identity verification outcome; scoped systems; deadlines/owner; completion evidence and lawful exceptions | Track export, correction, erasure and withdrawal across providers. Deletion and backup expiry are distinct. Exclude identifiable cases from the general mirror. |

Proposed navigation:
**Activity → linked website/form controls → notice versions → restricted consent
evidence → email policy/events → changes and review evidence.**
Register readers must not inherit permission to open private evidence.

Candidate activity inventory, to reconcile with the owner's existing register:
purchase/billing; Scan fulfilment/coaching; workshop administration; account/security;
requested assessments/resources; enquiries/support; optional learning/marketing;
website measurement; admin reporting and compliance operations. Classify by purpose,
not just by vendor. Typeform, Resend, payment provider, application database, coach
mailboxes, report storage, Google and any verified OS integration link to the
activities in which they actually participate.

For Typeform, retain the relevant notice/question version and explicit answer when
consent is the selected basis. Validate signed webhook events and deduplicate them,
but do not equate a valid signature or completed form with valid consent. Use a
scoped invitation/response association to the intended participant and entitlement;
reject or reconcile ambiguous matches instead of completing every order with the
same email. An organiser's purchase or uploaded roster cannot grant each
participant's unrelated marketing permission.

#### Proposed Google Sheets mirror — superseded by DEC-AIL-082

**Historical proposal only:** Estève now selects the authenticated admin view.
See [the current direction](#ai-lit-ropa-finland-20261007); do not build this mirror.

- **Authority:** the operational register in the application is authoritative for
  approved processing records. PRD/decision log remain authoritative for product
  decisions. The Sheet is a one-way derived view, not a second editor of either.
- **Tabs:** Activities; Collection surfaces; Notices index; Email policies;
  Processors/transfers; Retention/security summaries; Changes/reviews; Sync status.
  Keep personal consent events, customer emails, Scan answers, private reports,
  access tokens, detailed security secrets and identifiable rights cases out.
- **Access:** restricted owner-approved Google destination and readers; review
  inherited folder permissions. Protected ranges reduce accidental edits but
  are not an access-control substitute. Mirror only approved fields with scoped
  service access; no public link sharing by default.
- **Reliability:** stable row IDs, schema/source version, source update time,
  last successful sync, revision/hash and row totals. Visible stale/error state;
  retries must be idempotent. Publish a complete validated snapshot before
  marking a version current. Partial failure must not masquerade as a full sync.
- **Changes:** edits in Sheets do not flow silently into Replit. Detect/report
  divergence; owner changes the canonical register and regenerates the mirror.
  Withdrawn/deleted metadata must also be reconciled, with relevant Google
  revision/trash retention documented.
- **Backup:** a synchronized mirror is not a database backup. Define separate
  encrypted backup, retention and tested restore arrangements.
- **Activation:** agree the existing-source mapping, destination, allowed fields,
  access and synchronization trigger before import/connection. Start with a
  synthetic local export/readback test. No live Sheet or recurring sync is
  created in this documentation batch.

#### Admin email controls: requested outcome and implementation specification

**Confirmed direction:** routine individual admin activity alerts off by default;
replace daily summaries with a weekly digest. Exact schedule, recipients and
activation remain pending. Monday 09:00 Europe/Helsinki is a suggested preview
value, not a recorded human choice.

Source explains the reported recurrence: server startup always calls
startDailyPulseScheduler, which schedules 08:00 UTC daily. Separate purchase,
Scan-interest and Flow alerts send immediately. The global Resend switch affects
customer delivery too; it is not the appropriate control for admin notification
preferences. This is a source diagnosis, not a readback of live configuration.

| Control / behaviour | Requested or proposed outcome |
| --- | --- |
| Routine individual alerts | Default OFF. Inventory every admin send path and apply the category preference; never enable implicitly when the server restarts or Resend reconnects. |
| Admin summary cadence | Weekly, with explicit IANA timezone/day/time and approved recipients. No daily scheduler remains active in parallel. Local/test runtimes do not start live sends. |
| Customer confirmations and reminders | Independent of admin settings. Split mixed send functions before gating the admin portion; preserve the purchased service and its existing customer reminder policy. |
| Support/fulfilment work | Durable admin task queue with owner, due date and status. Turning off email must not lose enquiries or Scan/report work. Resolve the current 24-hour contact reply promise before relying only on a weekly view. Any urgent-email exception needs a visible separate opt-in. |
| Weekly content | Minimal counts and links to authenticated admin views; no raw answers, names, email lists or small-group interpretation breakdown by default. Include period/timezone and honest delivery status. |
| Reporting accuracy | Bounded half-open reporting interval; successful purchases only; valid zero-price orders stay zero; missing/invalid amounts shown as unknown. Label gross/net/refunds explicitly. The current parseFloat(amount) fallback incorrectly turns zero into 99.95. |
| Restart/multi-instance safety | Durable unique digest occurrence, atomic claim and provider idempotency where supported; restart, DST and missed-run tests; no automatic replay of an unlimited backlog. Ambiguous outcomes require reconciliation before resending. |
| Provider outcome | Respect send failure/disabled result. The current runner returns success after a false sender result. Record accepted, delivered, failed/unknown distinctly; update the manual trigger and misleading journey-test path. |
| Controls UI | View effective preferences, next occurrence, timezone, recipients, reporting window and last outcome. “Preview” uses synthetic/no-send rendering; live “Send” remains a separate explicit action. Audit preference changes. |

#### Additional requirements and pending workshop choices

| ID | Status | Requirement |
| --- | --- | --- |
| AI-LIT-REQ-083 | Requested; detailed design pending | Application-owned, versioned RoPA linked to source notices, surfaces, email purposes and change/review evidence. Reconcile existing register; evidence-backed access, retention and provider records. |
| AI-LIT-REQ-084 | Superseded by REQ-088 / DEC-AIL-082; retain history only | One-way Google Sheets register mirror with restricted approved metadata, stable IDs, visible freshness/reconciliation, no personal consent or Scan-data replication by default, and independent backup/restore. |
| AI-LIT-REQ-085 | Requested distinction; terminology pending | Separate person/account/profile, payer and participant relations and scoped access. Confirm “bio” versus “buyer”; no email-only identity merge or inferred cross-role permission. |
| AI-LIT-REQ-086 | Requested; schedule/recipient details pending | Routine admin notifications default OFF, weekly summary instead of daily; preserve customer sends, provide visible outstanding tasks and durable duplicate/failure controls. |
| AI-LIT-REQ-087 | Proposed verification criteria | Test notice changes, withdrawal before queued send, webhook replay and ambiguous participant matching; test unauthorized evidence/mirror access, redaction, stale/partial mirror sync, DST/restart digest scheduling and zero-price/refund reporting. |

Pending: current RoPA link/path (or confirmation to start new); meaning of “bio”;
weekly day/time and activation preference; final recipients; Sheet destination/access;
treatment of urgent support/fulfilment alerts. EMAIL-W01 was subsequently resolved
as purchased-service first under DEC-AIL-093; no marketing programme is activated.

**Original next batch (superseded by the current section below):** reconcile the existing register and role terminology,
review a synthetic register/control-screen mockup, then choose the first local
implementation batch. Preserve local IDE → reviewed GitHub → manual exact-SHA
Replit sync → human Republish. Existing live sends remain unchanged until an
authorized production change is deployed. Recheck the OS shared-data boundary
before implementation; no OS change or paired PR is made for this specification.


<a id="ai-lit-ropa-finland-20261007"></a>
### Finnish/EU privacy operations — individual Scan service

**Current direction, 7 October 2026:** [DEC-AIL-082](DECISION_LOG.md#dec-ail-082).
Estève replaces the proposed Google Sheets view with an authenticated website
admin view, requests all four intake channels below, troubleshooting and controlled
emergency access, and confirms private individual use: an HR/employer buyer never
gets the individual's Scan data. REQ-084's Sheet mirror is **superseded**, not an
implementation dependency. No Sheets integration is to be built for this scope.

The product may label the workspace **RoPA & Privacy**, with distinct sections
for the activity register, consent history and privacy cases. A person's choice
creates a consent event linked to an activity; it does not require duplicating an
Article 30 activity for every person. Preserve that distinction in exports and
operator training. The register is an internal accountability document, not the
public privacy notice ([Finnish authority](https://tietosuoja.fi/en/record-of-processing-activities)).

Private use is a product/access boundary, not a GDPR exemption for a commercial
provider. The household exception does not exempt GreenElephant's service
processing ([GDPR Article 2 and recital 18](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679)).
No employer dashboards, employee comparisons, rankings, report access, consent
choices or completion/progress data are exposed to an HR buyer. Payer access is
limited to their billing/order information; fulfilment logistics must not disclose
an individual's private participation details. Review assigned-coach access
separately: existing code copies full Scan answers to both coaches.

#### Four intake channels and the meaning of immediate

**Proposed implementation contract:** save evidence, current purpose-specific
permission and a durable work item in one database transaction. Only then return
success. The admin view reads this canonical state; provider reconciliation is
visible separately. No external-provider acknowledgement is represented as an
atomic local update or as proof of delivery.

| Channel / user story | Required behaviour | Failure and acceptance evidence |
| --- | --- | --- |
| Email preference link | A purpose-scoped, signed link permits easy withdrawal without account creation. GET is safe to open by mail scanners; an intentional POST changes preference. Standard one-click unsubscribe works separately. Commit withdrawal and suppression before confirmation, remove pending optional sends, recheck immediately before provider submission. | Replayed requests have one effect. Expired/invalid grant links cannot activate permission. Previously accepted mail cannot always be recalled; show accepted versus queued. Re-subscription requires a new positive verified choice, never an admin “undo”. |
| Website email/checkbox | Server validates an active purpose and notice version, affirmative value and expected source. Record refusal where needed without making marketing mandatory for service. For new email opt-in, propose address confirmation: pending until verified; no offers while pending. | Missing/unchecked/unknown-version fields never become a grant. Do not trust client-supplied consent prose as the authoritative notice. Cross-device withdrawal and withdrawal racing a queued send are tested. No success response if the durable write fails. |
| Typeform email/consent | Process allowlisted form/question references and the selected answer with the exact notice version. Use signed events and distinct event type/revision identities; bind a response to the correct subject/entitlement. Persist consent independently of completion-email success. | A box tick alone is not guaranteed to emit a webhook. Use a supported partial-submit checkpoint if consent must be captured before final submission; verify account/plan/form configuration. Partial intake must never mark the Scan complete or send a completed report. No grant when version or subject is ambiguous. |
| Privacy/DPO inbox | Every received message to the confirmed mailbox is accounted for as a linked case item, unmatched item or restricted spam/quarantine disposition. Link relevant sent replies too. Preserve message/thread references, timestamps, provenance and reviewed decisions; deduplicate deliveries and reconcile missed events. | No automatic grant, erasure, disclosure or legal conclusion from arbitrary email text or an AI summary. A clear matched withdrawal is provisionally suppressed promptly; identity/scope ambiguity enters urgent review and cannot reactivate marketing. Rights requests elsewhere still count; the DPO address is not an exclusive gate. |

Typeform supports submission/partial-response events, subject to configuration;
this is not browser-keystroke capture. Verify actual deployed form behaviour:
[webhooks](https://www.typeform.com/developers/webhooks/) and
[partial responses](https://help.typeform.com/hc/en-us/articles/21102221958676-Collect-partial-responses).
Do not enable indiscriminate capture after every question merely to capture one
consent field.

For an actual Google Workspace mailbox, a candidate adapter uses Gmail history
plus Pub/Sub, durable cursors, watch renewal and periodic reconciliation; Google
documents that notifications can be delayed or dropped. An alias/group requires
a different confirmed delivery route. OAuth scope, mailbox access and verification
requirements must be reviewed before connection. No domain-wide mailbox access
by default. See [Google push notifications](https://developers.google.com/workspace/gmail/api/guides/push).

**Proposed service targets, not legal deadlines or promises of perfect availability:**
local preference enforcement before a successful response; refreshed admin state
within 5 seconds of local commit; provider events normally processed within
60 seconds of receipt; connector reconciliation every 5 minutes, with an overdue
state after 15 minutes without a successful check. Distinguish idle healthy
channels from absent events. Targets require deployment/load validation and
operator coverage. During stale/unknown permission state, optional sending stops;
privacy intake and necessary service workflows remain available. A provider outage
cannot be described as “immediate everywhere”.

Use source/effective/received/processed times, monotonic subject-purpose revisions
and unique upstream event identities. Do not order solely by arrival time.
Late/replayed grants must not supersede a later withdrawal; ambiguous event order
stays suppressed pending review. An outbox retry cannot revive withdrawn
permission, duplicate a grant or resend a previously accepted message.

#### Admin view and enforceable controls

Proposed route: **/admin/ropa**, reached from the existing authenticated admin hub.
Every API and export checks server-side permission and subject/object scope.
A hidden navigation link is not security. Prefer named Google Workspace admin
accounts with enforced MFA and reauthentication for sensitive actions. Remove
shared-password bootstrap from normal privacy access; preserve a documented,
restricted recovery path. Verify account deactivation/session revocation.

| Section | Controls and evidence |
| --- | --- |
| Overview / activity register | Search purposes, owners, versions, legal-basis review, recipients/transfers, retention and open gaps; export the Article 30 register without individual case content. Separate unknown/draft/reviewed/live-verified states. |
| Consent timeline | Restricted subject lookup, purpose state, notice version, source and reason; grant/refusal/withdrawal/correction history; blocked pending sends and downstream acknowledgement. No editable universal “GDPR compliant” switch. |
| Privacy inbox / cases | Unmatched messages, owner/deputy, receipt time, statutory deadline, identity-verification status, correspondence links, requested rights, reviewed decision and action receipts. Separate provisional classification from a signed human decision. |
| Connector health | Last successful check, freshness, backlog/oldest item, rejected signatures, dead-letter/retry state, mismatch counts and watch expiry. Payload views are redacted. A credential's presence does not prove a working integration. |
| Actions / retention | Pause optional sends, retry a specific safe failed operation, dry-run affected records, scoped rights export and reviewed retention/erasure jobs. Show actual outcome/receipt; no arbitrary SQL or bulk consent grants. |
| Audit / recovery | Record actor, reason, scoped before/after version, case/incident link, approvals and time; protect evidence against alteration, log privileged reads/exports and denied attempts. Monitor log integrity and restore exercises. |
| Notification preferences | Routine individual admin alerts OFF; weekly digest as already requested. DEC-AIL-091 adds the explicit privacy-case email exception: new cases and matters needing review alert the responsible owner through both approved privacy aliases, without requiring an admin visit. Urgent rights deadlines, connector outages and breaches need a separate staffed escalation path; repeated escalation timing remains to be reviewed. |

Suggested access split pending owner selection: privacy administrators can handle
consent/cases; ordinary admins see redacted health; assigned coaches receive only
their authorised service access; buyers/HR/other customers get none. Do not
automatically give existing super_admin accounts all privacy-case content.

**Observed gaps at the current website baseline:**
- GDPRControlsAdmin saves keys such as gdpr_admin_notifications,
  gdpr_double_optin and gdpr_newsletter_enabled, but no corresponding enforcement
  consumers were found in server/shared code. Its retention UI itself says cleanup
  is future work. Existing badges/toggles are not evidence of functioning controls.
- Generic auditMiddleware writes after a successful response, redacts only a small
  top-level secret-name list, and audit failures do not roll back the action.
  Sensitive privacy mutations need durable, minimised audit evidence in the
  transaction, not a best-effort copy of the entire request body.
- Shared-password login attributes access to the bootstrap owner. That is inadequate
  attribution for named emergency use. Verify and repair session/role protections
  before accepting privacy-admin access.
- Typeform currently checks Resend and claims a result-send operation before its
  completion workflow; it does not implement a purpose-specific consent ledger.
  Contact creation can occur after email success. Isolate intake from notification.
- Existing Notion contact sync calls must be reconciled with approved field/purpose
  maps and actual destination access. “Google + Replit + Notion” does not omit
  Typeform, Resend, payments, coach mailboxes or report links from the processor map.

#### Break-glass, changes and erasure

The following protocol is proposed for an actual incident, not a legal exemption:

1. Named authorised responder records an incident/reason and performs strong
   reauthentication. Grant the minimum time-limited scope (suggested maximum
   30 minutes), read-only first, with a visible countdown and automatic revocation.
2. Require another authorised approver for disclosure, broad export or exceptional
   repair where available. Define an honest owner-only recovery procedure and
   subsequent independent review when a second responder is unavailable.
3. Log entry, accesses/actions, denials and expiry in a protected durable audit
   channel. If audit storage is unavailable, sensitive access fails closed or
   uses a pre-reviewed protected emergency journal; never silently bypass logging.
4. Emergency access cannot grant consent, lift a marketing withdrawal, expose Scan
   data to HR, permanently disable auditing, or discard an erasure request.
   Pause optional processing and restore safe operation using documented steps.
5. Close with review and recovery evidence. Reconstruct permissions from validated
   history; do not “roll back” to an old database snapshot that revives consent.

Normal corrections append a new version/reason instead of overwriting past choices.
However **non-destructive editing is not indefinite personal-data retention**.
Approved erasure removes/anonymises eligible payloads and links across relevant
systems, records only necessary evidence of the action, documents lawful holds,
and handles backup expiry and restored-data deletion. Pseudonyms and linkable
hashes remain protected personal data. A mirror/export is not a backup.
The Finnish authority explains erasure, limited exceptions and recipient
notification in its [erasure guidance](https://tietosuoja.fi/en/right-to-erasure).

#### Finnish/EU evidence and additional release gates

These are compliance work items, not an automated legal certification. Legal
interpretation and release evidence need a suitably qualified human review.

| Area | Required evidence / design consequence | Primary source checked 7 October 2026 |
| --- | --- | --- |
| Purpose and consent | Separate service, optional marketing, analytics and optional integrations; freely chosen granular consent, withdrawal and minimal retained proof. Document other applicable lawful bases instead of treating every task as consent-based. | [Finnish consent guidance](https://tietosuoja.fi/en/consent-of-the-data-subject) |
| Electronic marketing | Finnish electronic-communications rules apply alongside GDPR. Review natural-person/sole-trader audiences and any narrowly applicable customer exception; do not assume a work email permits offers. Proposed baseline is separate positive marketing opt-in. | [Finnish authority decision on section 200](https://www.finlex.fi/fi/viranomaiset/tietosuojavaltuutettu/2020/621) |
| Rights and deadlines | Access, correction, erasure, restriction, portability where applicable and objection routes; receipt starts the case clock. Respond without undue delay, normally within one month; track reasoned extensions and timely notice. Simple withdrawal must not wait for this deadline. | [Finnish erasure/response guidance](https://tietosuoja.fi/en/right-to-erasure) |
| Sensitive answers and risk | Inventory actual questions, free text, reports and any AI inference. Avoid unneeded health/special-category data; identify Article 9 condition where relevant. Assess DPIA need before changed processing, including high-personality/private-answer risk. Non-diagnostic copy does not settle the issue. | [Finnish DPIA criteria](https://tietosuoja.fi/en/list-of-processing-operations-which-require-dpia), [GDPR Articles 9/35](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679) |
| Controller and DPO | Confirm legal entity/contact, named responsible owner/deputy and whether formal DPO designation is required. A dpo@ mailbox is not itself appointment or proof of independence. Do not mislabel the owner who determines purposes as an independent DPO without assessing conflicts. | [Finnish DPO guidance](https://tietosuoja.fi/en/data-protection-officers), [designation](https://tietosuoja.fi/en/designating-a-data-protection-officer) |
| Security and incidents | Document proportionate safeguards, access reviews, incident assessment, backups and restoration. Risk-based authority notification may be due within 72 hours of awareness; high-risk affected-person notification is distinct. Weekly summaries cannot be the incident response mechanism. | [Finnish authority breach reminder](https://valtioneuvosto.fi/en/-/6927448/the-office-of-the-data-protection-ombudsman-reminds-controllers-organisations-must-assess-the-severity-of-a-personal-data-breach-to-the-data-subjects) |
| Providers and transfers | Verify signed processing terms, subprocessors, locations/remote access, transfer mechanisms, retention/deletion and AI training terms for each actual service/tier. Do not infer these from the vendor brand or EU region label. Confirm Notion destinations and no wider workspace access. | [GDPR Articles 28/32/44 onward](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679) |
| AI Act | Inventory actual AI systems/models and GreenElephant's provider/deployer role, purpose, oversight, transparency and prohibited-use screening. A RoPA is not an AI Act conformity assessment. No employment selection/evaluation or manipulative use in this individual service. Reassess if purpose changes. | [Commission AI Act overview](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) |
| Current AI-literacy wording | July 2026 amendment changes Article 4 to measures supporting staff/representative AI-literacy development, without guaranteeing an individual's specified level. Revalidate older website compliance/mandatory-training claims; no paid course is automatically a legal certificate. | [Regulation EU 2026/1744, Article 1(5)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202601744), [Commission FAQ](https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers) |

Also review public notices (including indirect collection), cookies/tracking,
age/audience scope, financial-record retention, data minimisation, accessible
EN/FR choice wording and Finnish customer-service needs. Keep the service aimed
at individual entrepreneurs as requested; do not silently rewrite or remove
other published offers during this compliance design batch.

#### Acceptance scenarios and implementation sequence

| Scenario | Pass condition |
| --- | --- |
| Website grant, refusal and re-subscription | Correct purpose/version and address verification; no marketing from unchecked, pending or ambiguous evidence. |
| Withdrawal versus queued send | Canonical suppression commits before success; later send blocked; already submitted provider message honestly identified. |
| Typeform partial then final, duplicate and out-of-order events | Consent and completion are separate; one effect per source revision; no duplicate emails and no old grant revives a withdrawal. |
| Resend/Notion unavailable during intake | Evidence still durable; provider work pending/failed with alert; no false success or customer-data leakage. |
| DPO mail, reply, forwarded thread and spam | Every input accounted for; correct case links; quarantine and mismatches visible; human decisions evidenced; no automatic grant from quoted text. |
| Gmail watch expires / notification is lost | Reconciliation recovers the bounded gap without duplicate cases; stale state visible; optional sends safely paused when eligibility is uncertain. |
| Unauthenticated admin / ordinary admin / HR buyer | Server denies private-case and report access, including guessed URLs, IDs, exports and attachments. |
| Emergency access expiry and failed audit storage | Minimum scope expires; audit preserved; prohibited actions remain denied; no silent bypass. |
| Correction, erasure and backup restore | History remains accountable without retaining unnecessary payload; erased/withdrawn state survives restoration. |
| Weekly summary and urgent incident | Daily/routine alerts stay off; summary excludes private content; urgent case handling has a tested separate route. |

**Phases:** (1) review the synthetic local admin mockup and privacy boundaries;
(2) implement the ledger, enforced admin permissions and website withdrawal path
with isolated tests; (3) add verified Typeform and DPO adapters with reconciliation;
(4) test retention/recovery and provider evidence; (5) authorised exact-SHA GitHub
and manual Replit release, then authorised production acceptance. No production
data import or connector activation is part of the mockup.

| ID | Status | Requirement |
| --- | --- | --- |
| AI-LIT-REQ-088 | User-selected replacement | Authenticated RoPA & Privacy admin workspace replaces the proposed Sheet mirror; server-enforced purpose/case access and troubleshooting. |
| AI-LIT-REQ-089 | Requested outcome; transaction/latency design proposed | All supported website/email preference events update linked evidence and effective permission; downstream work reconciled and optional sends rechecked. |
| AI-LIT-REQ-090 | Requested outcome; form configuration pending | Typeform consent intake handles supported partial/final revisions independently of report sending, with verified notice/subject mapping. |
| AI-LIT-REQ-091 | Alias topology and dual-address routing human-confirmed; delivery/access pending | Privacy mailbox correspondence linked to restricted cases, reviewed decisions and deadlines; deduplication, reconciliation and no autonomous legal decisions. Privacy/DPO-directed system mail targets both approved aliases of one primary mailbox; DEC-AIL-090 clarifies routing and pending verification. |
| AI-LIT-REQ-092 | Requested; protocol details proposed | Auditable corrections, rights-compatible erasure, scoped temporary emergency access, safe recovery and tested failure handling. |
| AI-LIT-REQ-093 | User-confirmed access boundary | Individual entrepreneur's data stays private; HR/employer payer never receives Scan data or personal progress/consent. Assigned coach scope pending. |
| AI-LIT-REQ-094 | Requested evidence programme | Finland/EU compliance evidence matrix, risk/provider/AI-use assessment, end-to-end acceptance and qualified human review before compliance claims. |

**Outstanding facts:** existing register source, verified privacy-mail delivery/access,
named privacy administrators/alternate responder, assigned-coach access, actual
Typeform questions/notices/partial-response plan, retention choices, AI systems and
provider terms. No live credentials or personal records requested in chat.

**Cross-repository:** OS main freshly resolved and PRD/log read at
83391d8520a6bfb2e010590686d6e32797490b62; website base
b1a8c52784861a98d1f0d3ada39bbbcdda332454 plus this working tree.
GEOS-REQ-002/003/004/005 and DEC-GEOS-001/003 remain relevant. No OS/provider changes
in this specification and mockup; a paired OS change or documented boundary review
will be required for Gmail/Notion implementation. The old source-only Notion calls
do not prove an approved receiving-system configuration.

<a id="ai-lit-ropa-implementation-20261008"></a>
### RoPA UX acceptance and first local implementation — 8 October 2026

**Authority:** Estève accepts the mockup UX, requests alignment with existing admin
branding and says to move on; [DEC-AIL-083](DECISION_LOG.md#dec-ail-083).
Reuse the website's charcoal surfaces, teal accents, Poppins headings, Lato body
font, cards, badges, focus states and responsive layout. Retain the accepted
navigation and individual-privacy boundaries. Do not import MY5's distinct theme.

First bounded local implementation: auditable marketing withdrawal behind the
existing signed unsubscribe link. Save a minimal withdrawal event and existing
marketing suppression atomically; retain the previous notice text/time rather
than fabricating a historical grant. A failure returns a retry response, never a
success assertion. Replay is idempotent; old suppressed contacts are not backfilled
as newly consented. Missing/deleted contacts remain non-marketable without recreating
a person record. Do not add personal email/body/IP data to the event.

The first ledger slice records withdrawals only. It is not a full RoPA, grant
capture, provider reconciliation, automated retention or production-ready privacy
workspace. A scoped additive migration is prepared and tested only on a disposable in-memory
PostgreSQL fixture. Production migration review and multi-connection checks remain
release gates.
Existing service sends and private-data recipients are not changed by this slice.

**Local implementation evidence:** withdrawal service plus PostgreSQL transaction
adapter, minimal privacy_preference_events schema and scoped SQL migration;
existing unsubscribe route now uses the isolated handler and service. Existing
suppression markers remain authoritative for marketing exclusion. Contact consent
flags become false without rewriting original wording/time. Event keys are
pseudonymous, not anonymous. A deleted-contact link records no recreated person.
One recorded withdrawal per contact is intentionally supported in this slice;
future re-subscription requires a reviewed versioned-transition design.

**Checks:** 127 release tests passed (8 new isolated service/HTTP tests), TypeScript
and production build passed; mockup desktop/mobile interactions passed and branded
screenshots inspected. The release service tests model transaction failure/concurrency. A separate
PGlite 0.5.8 / Drizzle 0.45.3 check executed the real migration and production
adapter against synthetic in-memory PostgreSQL: duplicate requests, SQL-triggered
rollback, retry, contact deletion and purpose constraints passed. PGlite has one
connection, so this does not verify Neon transport or multi-process locking.
No application/production database was accessed or migrated.

**Not ready for release:** review the real deployment schema and verify Neon
transport/multiple-connection concurrency before a production migration.
Do not deploy this code ahead of its migration: an absent evidence table makes
withdrawal return 503. Do not use schema-wide db:push on the brownfield database.
Marketing send/withdrawal races already in flight, grant capture, provider outbox,
Notion acknowledgement, privacy-admin access, automatic retention and the weekly
scheduler are not resolved by this first slice. Never claim the complete workflow
is finished from the new tests. Existing emails remain live until a separately
reviewed deployment changes them.

Named privacy-admin access, DPO mailbox, coach scope, retention and weekly schedule
remain pending; no real private admin view is enabled before access is settled.

| ID | Status | Requirement |
| --- | --- | --- |
| AI-LIT-REQ-095 | UX accepted; styling requested | Align the accepted RoPA mockup with existing website admin branding and components, with responsive and readable states. |
| AI-LIT-REQ-096 | Local implementation requested continuation | First withdrawal-history slice: signed-link routing, atomic suppression/evidence, idempotent replay, failure handling and isolated tests; reviewed additive migration before deployment. |

Website base b1a8c52784861a98d1f0d3ada39bbbcdda332454 plus working tree. OS main
re-resolved to 83391d8520a6bfb2e010590686d6e32797490b62, whose PRD/log were read.
GEOS-REQ-002/003/004/005 remain relevant. This slice stays inside the website and
adds no OS transfer or adapter, so no paired OS implementation is required.
Gmail/Notion work still requires its own boundary review. No production migration,
live send, push/merge, Replit sync or publication is authorized by UX acceptance.

<a id="ai-lit-privacy-admin-20261008"></a>
### Restricted privacy administration — local continuation, 8 October 2026

Authority: Estève's instruction to continue the accepted admin UX; DEC-AIL-084.
Prepare a branded /admin/ropa page and a minimal withdrawal-history API. This is
a read-only first slice; the full processing-activity register, cases, intake,
recovery, retention and weekly digest remain unfinished.

| ID | Status | Requirement |
| --- | --- | --- |
| AI-LIT-REQ-097 | Locally implemented and tested; activation pending | Default-closed privacy access: named admin/Google-subject bindings, current active admin role, recent named Google session, no shared-password or automatic super-admin bypass. |
| AI-LIT-REQ-098 | Locally implemented and tested | Minimal paginated withdrawal history with durable access audit before response; no raw email, Scan answers, contact keys or mail bodies; distinct unavailable and empty states. |

Implementation defaults are conservative safeguards, not a human selection of
named administrators: deployment-only PRIVACY_ADMIN_GOOGLE_BINDINGS maps admin IDs
to Google subjects; empty/malformed configuration denies access. A session from a
verified Google callback expires for privacy reads after 30 minutes. Recheck the
current admin record on each request; removed, disabled or viewer accounts fail
closed. Google sign-in alone does not prove Workspace MFA or DPO appointment.
Owner must confirm named users and MFA/operating arrangements before activation.
No bindings are supplied or enabled by this work.

Rotate successful admin login sessions and strictly check the OAuth state and
verified v2 userinfo identity before marking a Google session. Identity model
reference: [Google OAuth userinfo](https://developers.google.com/resources/api-libraries/documentation/oauth2/v2/python/latest/oauth2_v2.userinfo.html)
and [Google OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect),
checked 8 October 2026. Live OAuth verification remains a release check.

Use the existing audit_logs table through a direct transactional insert: admin
identity, read action and returned row count only. Do not use the best-effort
logger. Failure to read or durably audit returns 503 with no records. Generic
audit viewers can see this minimal administrative action, never subjects or event
references. Audit-history controls and durable denied-access logging remain
future work; this is not an immutable compliance archive.

The browser stores results only in mounted component memory, clears them when
hidden/expired or a refresh fails, and rechecks access on return. The server
enforces authorization independently of the UI. Existing website admin endpoints
are not hardened or covered by this new gate; broader legacy-data access review
remains necessary. No claim of a website-wide privacy boundary follows from it.

Processing activities and individual evidence stay distinct. No mock records in
the app; incomplete inbox/recovery controls say so and cannot perform writes.
The new page inherits existing admin cards, typography, charcoal and teal theme.
Google Sheets remains cancelled. No HR or buyer reporting is introduced.

Website b1a8c52784861a98d1f0d3ada39bbbcdda332454 plus working tree; OS main rechecked
at 83391d8520a6bfb2e010590686d6e32797490b62 (same PRD/log snapshot already read).
GEOS-REQ-002/003/004/005 cross-check: website-only read/access layer, no OS adapter,
transfer or contract change; no paired OS PR required for this slice.
Mailbox, coach scope, weekly schedule/recipients and retention decisions remain
pending. Production migration, named-access activation, GitHub and Replit release
require the previously recorded gates. Local checks: 135 release tests, TypeScript and build passed for the first page.
Actual PostgreSQL adapter checks covered tied microsecond pagination, minimal
audit payloads, audit failure and retry. Isolated browser fixtures passed the five
tabs, pagination, empty/error/denied/sign-in states, expiry, hidden-tab clearing,
noindex and mobile overflow. These use fictional records; no real admin login or
production database was exercised. Later named-owner changes require their own
final check below.

<a id="ai-lit-admin-identities-20261008"></a>
### Named Google administrators and on-demand access — 8 October 2026

Estève identifies one sole owner-level administrator, a separate daily account and
a secondary administrator; future individually approved admins use the exact
greenelephant.org domain. The owner's explicitly named external address is the
single exception. DEC-AIL-085 records this direction. Exact operational addresses
and proposed configuration are kept in the ignored local handover, not public
configuration. Neither Google tenant membership nor the domain grants access.

| ID | Status | Requirement |
| --- | --- | --- |
| AI-LIT-REQ-099 | Approved direction; local implementation candidate | Sole configured owner exception; ordinary daily/secondary administrators; exact team domain plus individually created accounts; fresh named Google login for owner controls. |
| AI-LIT-REQ-100 | Approved direction; local implementation candidate | Owner can add, change, deactivate and reactivate staff access; record changes and audit atomically; preserve accounts on removal; protect the owner from normal team edits. |

ADMIN_OWNER_EMAIL is deployment-managed and empty by default. Existing non-owner
super_admin rows receive effective admin permissions, not owner permissions.
Active account/domain/current role checks now apply through requireAdminAuth;
session claims alone cannot retain disabled access. Team creation allows only
Admin or Viewer at greenelephant.org. Owner creation/transfer is a separately
reviewed operator procedure; regular invitations cannot add/promote an owner.
No domain-wide automatic provisioning, emailed invitations, or privacy grant is
performed. First Google login still requires an existing approved account.

Invite/change/deactivate actions and minimal before/after audit entries share one
database transaction. Existing DELETE compatibility route deactivates rather than
deleting the row. The server protects the sole owner from edits/deactivation via
this interface. Accounts can be reactivated deliberately; audit evidence remains.
Denied attempts, immutable audit storage, owner recovery, scheduled access review,
MFA enforcement/verification and broader permission coverage remain future work.
This is not a claim of complete GDPR compliance.

The legacy shared-password fallback remains ordinary-admin only and cannot use
owner controls or privacy records. Replacing/removing that fallback requires the
reviewed account transition; do not advertise it as a named identity or break-glass
protocol. The current-account guard also blocks non-read methods for viewers. Legacy
endpoints outside that guard and any GET side effects still need review.
Estève selected privacy access for his two accounts only. The secondary
administrator and future staff get no automatic privacy assignment. Estève confirms the two addresses are separate Google sign-in accounts. Their
actual Google subjects and existing website records still need verification;
mismatched primary addresses fail closed.

Activation needs review of existing account rows, Google subject bindings, exact
owner configuration, Workspace MFA, staging Google login and rejection cases.
Do not auto-promote, create, migrate or disable production accounts in this batch.
Website base/OS SHA and website-only boundary remain as recorded above; no OS
adapter or paired OS implementation required. Final checks: 143 release tests pass; TypeScript and production compilation pass.
Actual production SQL adapters were exercised with synthetic PGlite PostgreSQL:
withdrawal rollback/replay, precise pagination, audit failure, owner protection,
account creation, deactivation/reactivation and rollback on failed team audit.
Browser checks cover the actual branded RoPA page and owner access screen with
intercepted fictional responses. No real Google OAuth, production account or
provider was tested. PGlite remains single-connection; Neon/multi-process and
production migration checks remain release gates. Build retains its existing
large-chunk warning. Shared-password removal and a complete legacy-route access
audit remain needed before describing all administration as named-only.

<a id="ai-lit-google-only-admin-20261008"></a>
### Google-only admin access and controlled recovery — 8 October 2026

Estève selected option A: remove shared-password admin access, reject existing
password sessions and prepare controlled operator recovery (DEC-AIL-086). This
supersedes the retained fallback described in the previous implementation snapshot.
The sole-owner/team/privacy assignments in DEC-AIL-085 remain unchanged.
Estève reconfirms that the secondary administrator retains all ordinary admin
tools while excluded from RoPA/consent history. Team management and its security
audit remain owner-only; a privacy denial must not disable ordinary admin access.

| ID | Status | Requirement |
| --- | --- | --- |
| AI-LIT-REQ-101 | Approved; local implementation candidate | Use individually approved Google accounts for all website admin access. Retire password login/change endpoints and UI; reject sessions without Google provenance and require the subject to match the current active account, including legacy admin endpoints and status checks. No public bootstrap or fallback. |
| AI-LIT-REQ-102 | Approved; procedure prepared, live rehearsal pending | Document controlled operator recovery with verified identity/approval, scoped backup and repair, preserved IDs/audit history, affected-session revocation and fresh-login checks. Recovery must not create another owner or expand privacy access without a separate decision. |

Implementation: password routes return 410 without credential/account writes;
shared-password sessions fail even while their cookies remain valid. Four portal
admin routes and the Fathom callback now use current named-account authorization.
The old hash is omitted from settings reads and removed from allowed settings writes;
no stored setting or production secret is deleted. The login/access pages show
Google sign-in and recovery guidance. Ordinary cookie lifetime and separate
30-minute owner/privacy gates remain unchanged; customer portal login is separate.
See the [transition/recovery runbook](operations/admin-access-recovery.md).

Validation: 151 release tests pass on Node 24, including signed legacy-cookie
rejection and the secondary-admin ordinary/owner/privacy separation. TypeScript
and production build pass (existing large-chunk warning). Isolated desktop/mobile
browser checks pass for Google-only login and owner recovery controls, with external
requests blocked and fictional identities. Real Google identities, MFA,
staging callback/recovery rehearsal, owner/bindings configuration and production
release remain open. No accounts, production database or provider settings changed.
The combined withdrawal migration still needs its own release gates.

Cross-repository review: website working tree based on
b1a8c52784861a98d1f0d3ada39bbbcdda332454; GitHub main rechecked unchanged. OS main
83391d8520a6bfb2e010590686d6e32797490b62 re-resolved; its PRD/log read at that SHA.
GEOS-REQ-002/003/004/005 apply. This changes website access only, with no OS adapter,
payload, schema or provider transfer; no paired OS implementation is required.

<a id="ai-lit-admin-learning-20261008"></a>
### Admin teaching layer and Google MFA direction — 8 October 2026

Estève requests an admin section usable in AI-literacy training, with short
hover explanations and expandable descriptions of Break Glass Protocol, RoPA,
GDPR, consent and related concepts. He requests robust Google MFA with SMS and
alternative-email recovery, and confirms control of the GreenElephant Workspace.
DEC-AIL-087 records the request; DEC-AIL-088 records the subsequent package A approval.

| ID | Status | Requirement |
| --- | --- | --- |
| AI-LIT-REQ-103 | Approved request; local implementation candidate | Add accessible contextual definitions and expandable examples with sources and honest implementation status. Provide a separate administrator teaching view using fictional examples and no operational records/actions. Ordinary admins can teach without receiving privacy permissions. |
| AI-LIT-REQ-104 | Package A approved; local verification implemented; live checks pending | Prefer passkeys, retain SMS fallback, and prepare independent recovery email and offline backup codes. Enforce Workspace MFA for the intended managed admin accounts; protect the external owner separately. Prepare signed Google MFA evidence validation that denies missing/invalid evidence. Verify provider eligibility, actual Finnish-carrier delivery and recovery without the primary phone before rollout. Do not represent named Google login, email recovery or a refreshed website session as verified MFA. |
| AI-LIT-REQ-105 | Approved; local login/access and settings troubleshooting implemented; wider coverage and live acceptance pending | Give beginner administrators short, contextual troubleshooting instructions throughout admin, prioritising login, MFA and recovery. Use expandable steps, supplementary hover/focus definitions, direct official help links, expected results and a clear next action when stuck. Keep help usable before login and by keyboard/touch. |

The local candidate adds /admin/training, eleven sourced topics, and fictional
consent/RoPA and emergency-recovery walkthroughs. A dedicated status endpoint returns only an access boolean; the view displays
no account identity or operational records. It has no write
controls. Short definitions work on hover/focus; expanded examples work by keyboard,
click and touch. Toolbox links appear in login, Access & Security, RoPA and GDPR
screens; the Admin Hub links to the teaching view. Leaving teaching for operational
pages is explicit. This is an English admin teaching layer; bilingual public-site
release requirements remain separate.

Unconnected legacy GDPR switches are disabled and labelled; the two existing
connected settings remain available. Unverified retention defaults and automatic
legal-page success icons are removed. The toolboxes distinguish local implementation,
unconnected features, operational verification and legal/organisational responsibility.
They do not certify GDPR or AI Act compliance. No live consent, account or provider
configuration is changed by training interactions.

MFA preparation: [existing recovery runbook](operations/admin-access-recovery.md)
now distinguishes Workspace enforcement, external-owner protection, SMS delivery,
recovery email and Google Security Bundle evidence. Estève selected package A:
passkeys preferred, SMS fallback, independent recovery email and offline backup codes.
Signed MFA claim validation is implemented and tested locally. On 8 October 2026,
Estève confirmed the Google readiness checks complete, including the website OAuth
client matching the production client ID. This is human-reported configuration
evidence; the agent did not inspect live settings. Live sign-in, signed claims, SMS
delivery and recovery acceptance remain pending. Existing owner and two-account privacy
assignments remain unchanged, including ordinary access for the secondary admin.

Beginner troubleshooting acceptance (DEC-AIL-088): explain technical terms on first
use; aim for eighth-grade English, short sentences and one action per step. Each
guide states what happened, what to try first, the expected result, and what to do
if it fails. Put extra detail behind a labelled expansion; essential help cannot
depend on hover. Support keyboard, touch and screen readers. Avoid time pressure,
competing calls to action and repeated sign-in loops. Link directly to the relevant
official setting/help page and identify whether the user, website owner, Workspace
administrator or hosting operator can fix it. Never ask users to paste secrets.

Cover wrong/unapproved/disabled accounts, restricted privacy access, expired
sessions, configuration/callback/cookie failures, unavailable Google service,
missing MFA evidence, SMS failure, lost phones and owner recovery. Public help
must not reveal the approved-account list or private recovery contacts. A safe
support reference must exclude tokens, codes and raw provider responses. Use
fictional training examples. Show local implementation, provider checks and live
verification as separate states; never infer success from a setup checkbox.

The local callback now validates a signed Google ID token, including explicit MFA
evidence and a nonce bound to the sign-in attempt; it no longer trusts userinfo alone. The callback address is the configured PUBLIC_SITE_URL
origin plus /api/admin/auth/google/callback; the source default is
https://www.greenelephant.org. Google configuration readiness is now human-confirmed
as described above. The deployed candidate revision and successful live
authentication remain unverified. Google’s documented Security Bundle prerequisites
have been checked by Estève; actual signed claims must still be observed on the
intended backend before activation.
Missing provider support is a rollout blocker, not permission to weaken the gate.
The [recovery runbook](operations/admin-access-recovery.md#beginner-configuration-checks)
provides review steps. The local implementation now requests signed `amr` and
`auth_time`, requires explicit `mfa`, checks signature/issuer/audience/expiry/nonce
and current approved identity, rotates the session, and rejects older sessions
without MFA provenance. One-use state, a ten-minute attempt limit and PKCE bind the
callback to its originating attempt. No offline tokens or forced Google
reauthentication are requested. Google authentication time is stored separately
from website login time; the existing thirty-minute website window is unchanged.

Pre-login help covers configuration, wrong/inactive accounts, expired attempts,
cookies/session storage, provider failures, unavailable MFA evidence, lost phone,
SMS and controlled recovery. RoPA, owner controls, training and Admin Hub failures
use contextual guidance. Permission denials direct ordinary admins to their tools
instead of a sign-in loop. Unknown provider/error values are never echoed.
The wider requirement to explain all admin feature failures remains ongoing;
the earlier bounded batch covers authentication, recovery and access checks.
The next local wave extends this pattern to GDPR & Data Controls: loading and
failed reads never display guessed Off values; 401/403 responses explain the next
action; an unconfirmed save requires a read before another write. Only connected
controls remain actionable after a successful read, using the backend’s existing
default-allowed behavior when their keys are absent; malformed values remain
unavailable. No server permissions,
provider settings, consent rules or operational data flows change.

**Settings-wave validation — 2026-10-08:** TypeScript, production build and nine
existing admin-session tests pass on Node 24. Isolated browser fixtures cover
loading, 401/403/500/503, malformed payloads/values, uncertain-save readback without
repeated writes, successful and denied saves, return-to-tab failure, server defaults,
keyboard help, accessible control names and desktop/mobile overflow. Existing
login/recovery/access-help browser checks also pass after the shared-component edit;
screenshots inspected. External requests were blocked and settings responses were
fictional. This does not attest human screen-reader acceptance or live operations.
The full 161-test result below belongs to the preceding MFA wave and was not rerun
for this settings-only change. No auth/session/role backend implementation changed.
Website main re-resolved unchanged at b1a8c52784861a98d1f0d3ada39bbbcdda332454;
OS main re-resolved unchanged at 83391d8520a6bfb2e010590686d6e32797490b62, with
its current PRD/log read. GEOS-REQ-002/003/004/005 remain unaffected: no shared
schema, adapter, transfer or release-boundary change; no paired OS implementation.

Sources checked 2026-10-08: Finland’s Data Protection Ombudsman, EDPB, official Google
Account/Workspace/OIDC guidance, and Microsoft emergency-access guidance as a concept
reference only. The content links to those sources. Validation: 161 release tests,
TypeScript and production build pass on Node 24 (existing chunk-size warning).
Synthetic RSA fixtures exercise the actual Google signature verifier. Isolated
HTTP tests cover failed evidence, state/replay, storage/provider failures and all
three role scenarios. Desktop/mobile browser checks and screenshot review cover
keyboard expansion, focus definitions, accessible names, no horizontal overflow,
401/403/503 help, recovery and training without private API calls. These checks are
not a human screen-reader session, real Google login, SMS delivery, phone-loss
rehearsal or human rollout acceptance.
Website base b1a8c52784861a98d1f0d3ada39bbbcdda332454 and OS main
83391d8520a6bfb2e010590686d6e32797490b62 freshly re-resolved unchanged; OS PRD/log
already read at that SHA. GEOS-REQ-002/003/004/005 checked: no OS schema, adapter or
data transfer changes; no paired OS implementation. Workspace policy changes would
need their own reviewed operational scope. No push, migration or publication.

<a id="ai-lit-full-privacy-system-20261008"></a>
### Full privacy system — successive local batches, 8 October 2026

**Authority:** Estève selects option B: “Entire privacy system as well: activity
register, individual consent history, privacy cases, Typeform/mailbox intake and
retention workflows, built in successive local batches.” DEC-AIL-089 records this
implementation direction. This extends the local continuation scope; it does not
select factual mailbox configuration, lawful bases, retention periods or live
provider actions. Earlier REQ-088–105 boundaries remain in force.

| ID | Status | Requirement |
| --- | --- | --- |
| AI-LIT-REQ-106 | Approved phased local implementation; incomplete | Build the linked activity register, individual consent evidence, privacy cases, Typeform/mailbox intake and retention workflows in reviewable local batches. Preserve purpose-specific permissions, human decisions, separate records and synthetic validation; never infer consent, a DPO appointment or production readiness. |
| AI-LIT-REQ-107 | Local activity-register candidate | Create and edit activity metadata; stable activity IDs and preserved versions; purpose/notice/surface/provider/assessment references; explicit review status/evidence; search, paginated history and audited register-only export behind existing named privacy access. No individual consent grants or case messages in this register. |

**First batch:** REQ-105 Email Control Room access/loading/history guidance plus
REQ-107 activity register. Control Room access is checked before opening; viewer
send controls remain disabled. Unavailable/malformed history is distinct from no
records, retries only read, stale history is hidden on refresh failure, and support
help excludes raw errors. Legacy static footer markers are labelled as inventory,
not a GDPR certification. Existing email-send paths and schedules are unchanged;
no test emails are sent by this batch.

The RoPA register starts empty. Human-entered activity metadata includes controller
and contact details, responsibilities, purposes, people/data categories, recipients,
transfers/safeguards, retention, security and assessment references. This follows the
[EDPB record-keeping guidance](https://www.edpb.europa.eu/sme/be-compliant/be-compliant_en)
and [Finnish authority RoPA guidance](https://tietosuoja.fi/en/record-of-processing-activities),
checked 8 October 2026; these fields do not establish substantive compliance.
Blank fields are explicitly unknown. Linked references describe metadata; they do
not activate providers or resolve the future consent subject/notice mapping.

Technical implementation defaults: two additive tables hold current records and
version snapshots. Each save requires a reason, expected version and unique request
reference; stale edits conflict and the same accepted request can be replayed without
another version. Account status/identity is checked again inside the write transaction.
Record changes, their history and minimal audit evidence commit together. Audited
reads/exports fail closed. No payload is copied by the legacy generic audit middleware.
Writes require the configured website origin and JSON. Existing named privacy/MFA
and thirty-minute session gates apply; no owner/ordinary-admin bypass is added.

Editing a reviewed record starts a draft. Marking reviewed requires completed
fields or a recorded explanation, human review evidence and explicit confirmation;
live-verified status additionally requires recorded live evidence. These are
human-maintained labels, not agent attestations. Archiving is a versioned status,
not personal-data erasure. No automatic deletion or indefinite-retention policy
is established. Earlier versions remain restricted.

Reads use 25-record pages; version history is paginated too. Search is literal,
not a SQL pattern. The JSON export includes the whole register up to a bounded
1,000-activity limit and refuses larger exports instead of silently truncating.
It excludes consent/case tables. No data from production or historic exports is
imported. The SQL migration is prepared and tested locally only; apply through a
separately reviewed migration plan, never startup migration or schema-wide db:push.

**Validation — local candidate only:** 167 release tests pass on Node 24, including
six new RoPA schema/HTTP boundary tests. TypeScript/build pass (existing bundle-size
warning). The actual additive SQL and production store adapter pass isolated PGlite
PostgreSQL checks: current/version persistence, same-request replay, conflicting keys,
stale/overlapping edits, audit rollback on creation/update, failed-audit reads/exports,
write-time account revocation, activity/history pagination, literal search/status
filtering, bounded complete export and minimal audit payloads. PGlite has one
connection: Neon transport, multi-process locking and production migration remain
unverified. Browser fixtures pass Control Room access/loading/viewer/history failure,
empty/malformed responses and retries without email requests; RoPA denial, empty/error
recovery, draft creation, retry of an uncertain save with the same request ID,
version edit/history, search/export and focus revocation. Desktop/mobile keyboard,
no-overflow and screenshot checks pass. This is not human screen-reader acceptance.
All browser API responses and database records were synthetic; external browser
requests were blocked. No full backend, mail send or scheduler was started.

**Remaining REQ-106 batches:** purpose/notice-version and subject mapping with
individual grant/refusal/withdrawal/correction history; private cases and reviewed
actions; configured Typeform and mailbox adapters with reconciliation; approved
retention/erasure and recovery validation. The existing withdrawal-only ledger is
preserved. Mailbox address/type is now human-confirmed in DEC-AIL-090; delivery/access,
Typeform mapping and retention rules remain factual or human inputs, not inferred
defaults. No live connector or scheduler is activated.
The weekly digest remains a separate existing requirement with schedule/recipients
pending. The full privacy system is not complete after this first register batch.

**Mailbox clarification — DEC-AIL-090:** Estève confirms two privacy aliases of
one primary Google Workspace mailbox and requests both as recipients of every
privacy/DPO-directed system notification or forwarded request. This routing applies
to privacy-directed mail, not every customer email. Exact operational addresses stay
in private configuration/local handover notes. MX propagation/provisioning and delivery
are still being checked; this is human-reported topology, not verified readiness.
Google documents that [aliases share the primary mailbox](https://developers.google.com/workspace/admin/directory/v1/guides/manage-user-aliases);
two aliases do not provide an independent backup inbox or guarantee delivery.

The future local adapter must preserve both intended recipients, track submission
and delivery evidence separately where available, expose partial/unknown failure,
and prevent duplicate case actions from retries or alias deliveries. Intake must
isolate privacy-addressed correspondence within the primary mailbox and exclude
unrelated personal/business mail. Use provider message identity and case correlation;
never collapse distinct requests solely by sender or subject. Prevent loops from
system notifications delivered back into the intake mailbox. These are implementation
constraints for later synthetic tests, not claims that routing/intake already works.
No autonomous replies, real test sends, mailbox connection or live settings changes
are authorized by this clarification.

**Source / release boundary:** website main and working-tree base
b1a8c52784861a98d1f0d3ada39bbbcdda332454; OS main freshly re-resolved unchanged at
83391d8520a6bfb2e010590686d6e32797490b62, whose PRD/log were read in this session.
GEOS-REQ-002/003/004/005 checked: this batch has no shared schema or OS transfer;
website-owned tables only, so no paired OS implementation. Recheck before real
mailbox/Notion adapters. Production migration, Neon multi-process checks, human UI
acceptance and supervised live MFA/recovery remain separate. No commit, push, merge,
provider action, production database change or deployment is authorised here.

<a id="ai-lit-final-workshop-decisions-20261009"></a>
### Next privacy batch and email alerts — 9 October 2026

**Authority:** Estève explicitly selects 1A, 2A and 3A and adds that this needs
push emails in case he does not see the admin interface. DEC-AIL-091 records these
choices. These are approved product directions; implementation remains pending.

- **Next bounded batch:** build the purpose/notice-version and individual
  consent-history foundation first, preserving the existing withdrawal enforcement
  and replay guarantees. Mailbox integration follows in a separate local batch.
- **Confirmed email opt-in:** NEW optional email subscriptions and re-subscriptions
  remain pending until the person confirms the email address. A fresh positive,
  purpose-specific choice and the applicable notice version are required; a previous
  verification alone cannot reactivate a withdrawal. No optional marketing while
  pending. Do not infer grants for legacy contacts or make marketing a service condition.
  Necessary service messages retain their separate rules. Confirmation wording and
  live sending require their own review; this decision does not send any messages.
- **Initial privacy-case responsibility:** Estève reviews new privacy cases; deputy
  remains unassigned. Bind responsibility to the existing approved identity rather
  than creating another login or expanding access. This is operational responsibility,
  not a formal DPO appointment. The existing two-account privacy restriction remains.

| ID | Status | Requirement |
| --- | --- | --- |
| AI-LIT-REQ-108 | Approved direction; not implemented or activated | Send privacy-case attention notifications by email to both approved privacy aliases, independently of whether Estève opens the admin interface. Preserve restricted case content, duplicate/failure evidence and the existing access boundaries. |

**Privacy email exception:** interpret “push emails” as event-triggered email,
not browser/mobile push. The initial implementation should alert on new cases and
new matters needing human attention, including urgent deadlines or intake failures.
This is the explicit privacy-work exception to REQ-086's off-by-default routine
individual admin alerts; the weekly routine digest and other email settings are
unchanged. Privacy attention must not wait for the weekly digest. Exact repeated
reminder/escalation intervals remain open; do not invent a staffed deputy or a
guaranteed response/delivery time.

Implementation constraints for the later local alert batch: persist the case event
and notification work together; dispatch independently of the admin page; use both
configured aliases under DEC-AIL-090. Keep emails brief, with a generic attention
reason and an authenticated website link. Exclude names, addresses, message bodies,
consent details, attachments and bearer-access tokens from notification content.
The link must enforce the existing privacy/MFA checks, never grant access itself.
Distinguish queued/submitted/delivered/failed/unknown evidence; do not mark a case
read or handled merely because an email was sent. Use deduplicated work, bounded
retries and reconciliation for ambiguous outcomes; prevent notifications returning
to the aliases from creating new cases or alert loops. Validate with fictional
messages and an injected fake sender. Provider readiness, final message review and
supervised live delivery remain gates; no actual sender/scheduler is enabled here.

**Validation / source boundary:** this decision batch updates documentation only.
Earlier 167-test and PostgreSQL/browser evidence validates the earlier local register
and Control Room candidate, not these new consent or alert workflows. Website base
b1a8c52784861a98d1f0d3ada39bbbcdda332454 plus working tree; OS PRD/log previously
read at 83391d8520a6bfb2e010590686d6e32797490b62. No fresh remote-resolution claim,
OS schema, adapter or transfer change; GEOS-REQ-002/003/004/005 boundary unchanged.
Recheck current sources and receiving-system contracts before integrations.
No commit, push, merge, production database change, live email or deployment.

<a id="ai-lit-launch-email-20261014"></a>
### Launch email gap review and first reliability repair — 14 October 2026

**Authority / status:** Estève requests faster local website/backend development
because customers are ready to buy. Continue existing approved service preservation
and DEC-AIL-089/091 privacy scope in reviewable batches. This is local implementation
evidence under DEC-AIL-092, not approval of a new marketing programme, changed offers,
message content, live sends or release. The previous consent-first privacy choice
remains approved; the service defect below is a bounded reliability repair.

| Path / requirement | Current working-tree evidence | Remaining launch work or gate |
| --- | --- | --- |
| Scan purchase and questionnaire reminder — REQ-035/036 | EN/FR templates, purchase claims and provider-acceptance checks exist. Manual purchase-email recovery now shares the automatic claim and original language. | Exact final-message/provider/inbox acceptance; actual intended backend revision; original questionnaire link and language checks. Reminder scheduling is process-dependent, not an exact delivery guarantee. |
| Scan submission and coach results — REQ-035/036, REQ-089/106 | Signed submission and event deduplication exist; complete response email preserves approved coach copies; dashboard-ready email remains a manual coach action. | Correct subject/order association: current completion still updates by email. Consent intake must be durable independently of Resend availability; actual Typeform question/notice/participant mapping is unknown. Coach access, retention and human content review remain gates. Do not activate partial-response intake using this completion path. |
| Individual consent — REQ-089/106, DEC-AIL-091 | Withdrawal-only history and suppression exist; activity register is locally tested. | Purpose/notice-version and subject-linked pending/confirmed/refused/withdrawn history, fresh address-confirmed opt-in, replay/order/race checks. No inferred legacy grants. This remains the next approved privacy implementation batch. |
| Privacy attention — REQ-108, DEC-AIL-090/091 | Dual-alias routing, initial responsible owner and minimal alert requirements are approved. | Case/event storage and independent outbox/dispatch with fake-sender tests, per-recipient/unknown evidence and loop prevention; actual mailbox intake and supervised delivery later. No dependence on opening admin. |
| Routine admin mail — REQ-086 | Existing daily scheduler still starts with the backend; weekly digest and default-off routine controls are unfinished. | Category controls independent of customer service, outstanding-task visibility, durable weekly occurrence and honest summary/outcome; final weekly recipients/timezone/day/time still need selection. Do not start the full backend to preview these changes. |
| Optional learning/offers — REQ-076/077/080, DEC-AIL-080/091/093 | Legacy onboarding execution/manual trigger remain paused; confirmed opt-in direction is approved. | Purchased-service readiness leads; optional learning/offers follow. Programme scope, content, cadence and exact-message review remain open. Legacy packages and welcome families still need source/copy review; do not re-enable old sequences to accelerate launch. |

**Repair implemented:** `/api/admin/satellitescan/:purchaseId/resend-emails`
retains its URL and existing named-admin/write gates, but now checks/reuses the
original purchase-email operation. Only a successful purchase with a recorded EN/FR
language can enter it. Missing/invalid historical language requires review rather
than defaulting to English. Already accepted operations submit nothing again;
pending/unknown attempts require provider reconciliation. A false combined result
can mean partial acceptance: inspect both customer and internal messages, never
blindly retry the pair. Database/configuration failures return minimal errors.
No message body, sender, recipient or scheduler policy was changed.

The admin action is labelled **Check purchase email**, with an explicit confirmation,
visible delivery limitation and keyboard/touch-expandable review steps. Success
means recorded provider acceptance, including an earlier accepted operation; it does
not claim a new send, recipient-server delivery or inbox access. A separately reviewed
resend after reconciliation remains future operator work, not a bypass added here.

**Local validation:** 175 release tests pass on Node 24, including eight new
service/callback recovery regressions. Focused 21 tests, TypeScript and production
build pass; existing bundle-size warning remains. Tests cover EN/FR, valid zero-price
orders, historical/invalid language, unsuccessful purchases, manual/automatic replay
and concurrency, partial/unknown acceptance, receipt failure, missing purchases and
redacted HTTP errors. Real senders use a fake provider; no live email or database.
The initial sandbox run could not bind loopback listeners and was stopped; the
complete suite passed with loopback access. New help copy is build-checked; human
visual/screen-reader acceptance remains open. Earlier browser/SQL evidence is
historical and does not attest this new UI copy or a production migration.

**Next bounded batch / acceptance:** preserve the consent-first privacy selection:
add purpose/notice-version and individual history with synthetic mappings, retaining
withdrawal suppression and fresh confirmation requirements. Accept only when tests
prove pending/refused/unknown cannot market, stale/replayed evidence cannot revive a
withdrawal, and evidence/current state/audit commit together. Do not send confirmation
emails or infer real Typeform mappings. Later case/alert, adapter/reconciliation,
routine-admin and retention batches remain distinct. The sales priority is clear;
the complete email system is not launch-ready on the strength of this repair alone.

**Source / release:** website main freshly resolved unchanged at
`b1a8c52784861a98d1f0d3ada39bbbcdda332454`; candidate is that base plus uncommitted
working tree on `codex/local-website-continuation`. OS main freshly resolved at
`83391d8520a6bfb2e010590686d6e32797490b62`, with its PRD/log read at that SHA.
GEOS-REQ-002/003/004/005 checked: website-only recovery behavior, no shared schema,
package, Notion/OS transfer or receiving-system integration change; no paired OS
implementation needed. Existing source work was copied and hash-verified before
editing; this is a source backup, not a provider/database backup. No commit, push,
merge, production mutation, deployment, live email or full-backend startup occurred.
Human-confirmed Google readiness is retained. Live MFA/login/SMS/recovery stays
separate for the intended backend and supervised Friday 16 October 2026 Helsinki
checkpoint; no duplicate schedule was created and no new receipt is claimed.

<a id="ai-lit-service-first-20261014"></a>
### Purchased-service priority and reminder eligibility — 14 October 2026

**Approved work order — DEC-AIL-093:** Estève selects “A — Purchased-service
emails first; optional learning/offers follow”. This resolves EMAIL-W01 and
prioritises the existing paid/voucher service path. It does not remove the approved
full privacy system or its consent-first ordering within the privacy work, activate
marketing, change an offer or waive live/release gates.

**Local repair:** both the database and memory overdue selectors now require a
successful purchase, incomplete questionnaire with no completion timestamp, no sent
dashboard, zero prior reminders and the existing 72-hour age threshold. Inconsistent
or malformed state is excluded. A valid zero-price voucher remains eligible.
Invalid threshold values fail closed; the 72-hour boundary is inclusive.

The actual manual/scheduled reminder service treats the selected list as a candidate
snapshot: load the original language, reload the purchase by its stable ID, recheck
eligibility, then acquire the existing durable operation claim. Use the current
recipient/name and advance the count to one only after accepted submission.
Previously accepted/pending/unknown attempts are not resubmitted. An accepted send
followed by count-write failure still preserves acceptance against duplicate retry.
No copy, recipient policy, delay, scheduler activation or marketing eligibility
was changed. No new tables or migrations are needed for this repair.

**Limits:** this fresh read closes the stale-list problem; it is not an atomic
transaction with external mail delivery. An order can change after the final read,
and a message already accepted by the provider cannot be recalled by this check.
Refund/cancellation webhook reconciliation and exact Typeform order/participant
association remain open; the guard uses the application's current recorded state.
Existing boolean runner summaries still group skipped/uncertain attempts as not
sent; a richer operator reconciliation view remains follow-up.

**Validation:** 183 release tests pass on Node 24, including eight new reminder
tests. Focused 24 tests, TypeScript, build, repository and whitespace checks pass; the
existing bundle-size warning remains. New tests exercise the actual memory
selector and reminder orchestration with isolated database/provider fixtures:
72-hour/zero-price eligibility, failed/refunded/fulfilled/inconsistent exclusions,
stale and missing records, current recipient/EN-FR language, concurrent/replayed
attempts, provider rejection/exception and failed count writes. No live service ran.
Production SQL filters were reviewed; an additional PGlite integration harness
could not run because the earlier temporary validation dependency is no longer
present. Earlier PostgreSQL evidence does not validate this changed selector;
Neon/production database validation remains an explicit gate.

**Next service batch:** correct submission-to-purchase association and durable
intake independent of notification, starting with a synthetic contract and tests.
Verify actual Typeform form/question/hidden-field/notice mappings before connecting
that contract; do not invent identifiers or complete every order sharing an email.
Review dashboard-ready/manual coach fulfilment and remaining service templates
before supervised provider/inbox checks. Optional learning/offers follow this
service-readiness work. Privacy cases/alerts, consent foundation, weekly controls
and retention remain on the approved backlog.

**Evidence / boundaries:** working tree on `codex/local-website-continuation`,
website base/main resolved earlier this session at
`b1a8c52784861a98d1f0d3ada39bbbcdda332454`; OS PRD/log checked earlier this session
at `83391d8520a6bfb2e010590686d6e32797490b62`. GEOS-REQ-002/003/004/005:
website-owned selection/dispatch only; no shared schema/package/OS transfer or
paired implementation. Pre-edit source snapshot hash-verified. Live MFA/login/SMS/
recovery remains separate for the appropriate backend and supervised Friday
16 October Helsinki checkpoint. No live email, provider mutation, backend startup,
production DB change, commit, push, merge, deployment or duplicate scheduling.

<a id="ai-lit-typeform-intake-20261014"></a>
### Typeform intake foundation and database validation — 14 October 2026

**Authority / state — DEC-AIL-094:** Estève explicitly continues the proposed
Typeform batch and database-provider validation, and asks the agent to inspect
unknown configuration itself. Purchased-service-first DEC-AIL-093 and full privacy
scope DEC-AIL-089/091 remain. This batch implements an **unconnected intake
candidate**, not an activated replacement for the existing webhook.

**Provider inspection, read-only:** the authenticated Typeform editor/share UI
identifies the current individual Scan and confirms its public `individualscan`
alias matches the source email link. The URL-parameter panel shows no configured
custom parameters; its standard respondent/source switches are off. No purchase-
invitation or language binding was verified. The form includes a refusal/early-exit
path, so a final provider event alone must not prove successful service completion.
Webhook UI shows an enabled website destination, an inactive duplicate and a
separate enabled Notion destination. This is configuration evidence, not delivery,
signature-secret equivalence, recipient access or OS integration verification.
No responses/deliveries, target spreadsheets or Notion records were opened.

Replit's UI shows separate Development and Production databases, both with data.
Neither has been established as disposable validation storage. Workspace key-name
inspection shows Typeform signing/API-token names and `DATABASE_URL`; the form-ID
and dedicated validation-URL names were not visible. Values and production secret
contents were not inspected. The standalone Neon console requires sign-in, and the
canonical local checkout has no private `.env` files. No authorized isolated Neon
target was established: live provider transport, multi-connection locks and production
migration remain open. The agent did not ask the owner to supply secrets or infer
that the existing development database is safe for test writes.

**Implemented candidate:**

- Signed, size-bounded webhook parsing requires an explicit form ID, hidden-field
  name and qualifying boolean-question reference. No live defaults are guessed.
  Event IDs/types and response IDs are separate; partial and final are distinct.
  Missing/ambiguous qualifying evidence cannot complete a Scan. The affirmative
  question is a service-mapping criterion, never a marketing/processing consent grant.
- A high-entropy invitation reference is matched by digest to an application-owned
  binding for exactly one purchase and an independently assigned participant reference.
  Bindings require explicit expiry and recorded participant-verification evidence;
  possession of a forwarded invitation alone is insufficient. No invitation issuer,
  identity-verification UI or production assignments are created by this batch.
- The actual store transaction records a minimal event receipt, locks/rechecks the
  binding and successful purchase, updates only that purchase, creates a unique
  service retrieval/review task and appends minimal audit evidence. Failures roll
  everything back before acknowledgement. It has no Resend/provider dependency.
- Partial responses cannot complete or create a result task. Exact replay has one
  effect; event-identity collisions fail; different/changed responses and unmatched,
  expired, revoked, unverified or historical state enter review. No email-only joins,
  automatic newsletter grant, contact/OS transfer or individual report disclosure.
- Receipts/tasks store digests and restricted Typeform references, not raw answers,
  email addresses, original bearer references or consent prose. These references
  remain protected metadata. `pending_retrieval` is not ready-to-send mail: later
  content retrieval, digest/recipient checks and approved messaging are required.
  This is not a full response backup if Typeform data becomes unavailable/deleted.

Three additive tables and a prepared migration support the candidate. No migration
is run at application startup. The new HTTP handler is **not registered** in the
application, and no queue dispatcher/scheduler is enabled. The existing production
route receives only the bounded safety repair: reject partial/unknown event types
or contradictory partial response state before completion/email work. Its old
email-based completion and notification coupling remain until reviewed replacement;
do not describe those live gaps as fixed by an unconnected candidate.

**Database and local validation:** 201 release tests pass on Node 24, including
18 new parser/handler/SQL tests. Ten tests use the actual additive SQL, Drizzle
store, database selector and reminder/operation-claim adapters on isolated PGlite
PostgreSQL. They verify exact order scope for two purchases sharing an email,
partial/final/replay and changed-response behavior, participant/eligibility denials,
atomic rollback on audit/task failure, actual reminder filters, current-state reload
and durable duplicate suppression. All records/providers are synthetic. PGlite is
single-connection PostgreSQL; these tests do not attest Neon WebSocket transport,
multi-process locking or deployment. Earlier reminder SQL-validation gap is now
closed for isolated PostgreSQL, not for Neon.

PGlite `0.3.14` is an exact development-only dependency so the SQL tests can run
from the repository without a vanished temporary install. Existing lock entries,
including optional Replit WASM dependencies, are preserved. The full default-parallel
runner twice failed to decode child-process results for an existing reminder test
file that passed alone. Bounding test-file concurrency to four preserves every test
and yields a passing standard `npm run test:release`; no assertion was removed.
TypeScript/build pass with the existing bundle-size warning. Dependency audit has
zero high/critical findings and six moderate findings in existing toolchain packages;
no automatic audit fix was run. No UI acceptance or real delivery is claimed.

**Next bounded task / connection gate — corrected by DEC-AIL-095:** preserve the
existing website/Stripe pay gate, purchase email, emailed Typeform link and existing
completion webhook. Review how existing purchase/checkout evidence and that same
emailed link can identify the correct order on receipt, with no new customer
invitation, login or verification step. A correlation reference in the existing
link is a possible technique to review, not permission to modify Typeform settings
or event subscriptions. Keep buyer and participant distinct where applicable;
payment or verified buyer email alone must not be claimed as another person's
identity/permission. The staged binding/verification fields are implementation
assumptions to reconcile with this preserved flow, not an approved new journey.
Confirm actual runtime form/signing configuration and reviewed completion/content/
recipient mapping before wiring the candidate. Any required live form edits, test
sends, provider setting changes or migration retain separate authorization. Designate an
isolated Neon test target before provider-specific validation; do not use populated
development/production databases for synthetic migration experiments. Consent history,
privacy attention alerts, weekly admin controls and retention remain open work.

**Source / release:** website main freshly resolved unchanged at
`b1a8c52784861a98d1f0d3ada39bbbcdda332454` plus working tree; OS main unchanged at
`83391d8520a6bfb2e010590686d6e32797490b62`, whose PRD/log were read at that SHA
earlier this session. GEOS-REQ-002/003/004/005 checked: new tables are website-owned,
no shared package/schema/OS transfer or paired implementation; existing Typeform
Notion configuration is not proof of an OS contract and remains to reconcile.
Source backup is separate from database/provider backup. Issue #31 is confirmed
open for the earlier reviewed main; its complete release instructions are retained
privately, not executed. Candidate is uncommitted; production SHA remains unknown.
No commit/push/merge, full backend, production DB change, live test/send, provider
mutation, Replit sync or deployment. Live MFA/login/SMS/recovery stays separate for
the supervised Friday 16 October Helsinki checkpoint; no new schedule was created.

<a id="ai-lit-existing-scan-flow-20261014"></a>
### Preserve the existing paid Scan journey — 14 October 2026

**Human clarification — DEC-AIL-095:** the website shop is the Stripe pay gate;
Typeform is sent by email. The new intake must not trigger differently in Typeform.
Preserve **website shop → Stripe payment → existing purchase email with Typeform
link → existing form completion webhook → website fulfilment**. Backend reliability
and exact-order matching must fit this journey. Do not add another invitation email,
signup/login/verification screen, Typeform trigger, partial-response subscription or
changed notification cadence without a separate human decision.

This corrects the overly broad next-wave invitation/verification proposal, not the
need for scoped order matching or durable receipts. Reuse existing checkout/payment
evidence where its server-side binding is verified. Do not infer buyer/participant
identity equivalence or pretend a generic emailed form link identifies one of several
orders. If a technical mapping cannot be carried through the current link/form,
record the specific gap and propose the smallest compatible change before any live
provider edits. No new customer journey is approved by a backend storage field.

The staged candidate remains unconnected and is preserved for adaptation. Earlier
201-test evidence describes that candidate, not acceptance of its invitation/identity
assumptions or live activation. No runtime/provider change in this clarification;
documentation/repository checks only. Local work remains uncommitted and all live
database, email, supervised MFA/recovery and release boundaries remain unchanged.

<a id="ai-lit-order-reference-20261014"></a>
### Order reference within the existing emailed form link — 14 October 2026

**Authority / status:** local implementation under DEC-AIL-093/094/095 and Estève's
request to complete one further bounded round, then provide a full handover. This
is an **unconnected candidate** within the existing paid Scan journey, not approval
to configure Typeform, create another email/customer step or activate a new intake.
Affected: REQ-035/036/076 and service portions of REQ-089/106.

**Implemented:** an injected reference preparer locks/rechecks the actual successful,
incomplete, unfulfilled purchase, including valid zero-price voucher orders. It
requires the original new-flow language marker; historical/invalid markers require
review. A dedicated injected key derives a stable opaque reference per order and
explicit form/field mapping; only its digest is stored. One binding and minimal audit
commit together. Retries reuse that binding and original expiry; revoked, expired,
completed, multiply bound or differently keyed/mapped records require reconciliation.
No automatic rotation, expiry renewal, send, scheduler or provider call is included.

The purchase/reminder renderer accepts an optional reference for the **same**
`individualscan` link. Existing callers still omit it and retain the original generic
link/copy. English/French HTML/text agree; the fragment is escaped in HTML. The
reference carries no email, name, order/payment ID or answers, but remains protected
bearer metadata. It identifies an order, not the person holding a forwarded link.
Bindings start explicitly unassigned with no participant-verification evidence, so
signed submissions using these new references still enter review in the staged store;
they cannot silently complete an order, grant consent or assert a payer is a participant.

**Connection gaps, now specific:** the actual form has no configured custom URL
parameters. The smallest proposed provider change is to accept one reviewed opaque
order-reference parameter through the existing emailed link and existing completion
webhook; exact name/field mapping must be checked before any provider edit. Confirm
language handling and the actual successful-completion outcome separately, because an
early refusal also reaches an ending. No live parameter/default is invented. The
new-flow checkout stores payment/voucher eligibility and email/language; the current
SatelliteCheckoutPage does **not** verify participant identity. A backend review/
assignment rule fitting the current journey remains necessary; no new customer
verification screen is approved. Do not wire the preparer while this gate would strand
all paid responses in review without an agreed fulfilment path. Dedicated-key storage/
rotation, approved expiry, historical reconciliation, reviewed retrieval/recipient
handling and the actual purchase/reminder send adapter remain connection work.

**Final validation:** all 210 release tests, TypeScript, build, repository and whitespace
checks pass on Node 24.19.0; existing bundle-size warning remains. Website-only local
preview `/scan` and `/fr/scan` respond successfully; backend routes return 503. No
live payment/email/authentication acceptance is inferred.

**Database validation:** nine new tests exercise actual Drizzle/SQL on isolated
PGlite: paid/voucher orders sharing an email, stable retries/original locale/expiry,
unchanged bilingual message copy, ineligible/historical orders, revoked/expired/
rotated/ambiguous bindings, audit rollback/retry, link injection and signed intake
that refuses to infer participant identity. Single-connection concurrency is local
evidence only; Neon transport and multiple-process locking remain unverified. Both
populated Replit databases remain unsuitable for inferred disposable testing.

**Cross-repository / limits:** website base/main checked this session at
`b1a8c52784861a98d1f0d3ada39bbbcdda332454` plus working tree; OS PRD/log previously
read at `83391d8520a6bfb2e010590686d6e32797490b62` (GEOS-REQ-002/003/004/005). Existing
website-owned candidate schema only, no shared contract or new OS transfer; no paired
OS implementation. Prepared migration unchanged and applied only to synthetic PGlite.
The connected legacy webhook still uses broad email-based completion and Resend
availability: this batch does not fix its production matching. Human copy/provider,
production DB, supervised authentication/recovery and release gates remain separate.

<a id="ai-lit-scan-service-review-20261014"></a>
### Owner-reviewed Scan service queue — 14 October 2026

**Approval — DEC-AIL-096:** Estève selected “A — Implement this queue locally”
after reviewing the exact-order/assignment/recipient proposal. The configured named
owner may review the service queue using recent Google/MFA authentication. Hold,
reject and resolve are explicit, versioned actions. Reviewed participant assignment
is separate from verified identity; payment, an email match or a forwarded link
cannot manufacture identity proof. Preserve the current customer journey and
existing coach-copy policy. Missing/ambiguous evidence stays on hold. Affected:
REQ-035/036/076 and service portions of REQ-089/106.

**Local implementation candidate:** owner-only audited pagination/detail, protected
recipient/assignment evidence, strict same-origin actions with mutation IDs and
expected revisions. Original webhook outcomes remain immutable. Future receipts
preserve reference/completion/mapping digests; historical gaps remain null. Resolution
rechecks/locks one successful paid or valid voucher order and binding, commits one
response reservation, exact-order completion, reviewed assignment, owner/deadline
coach task and audit atomically. A unique form/response index also protects the
staged automatic intake. Participant-verification fields remain unchanged. The task
records retrieval pending, not a finished report, content backup or sent message.

The admin page at `/admin/scan-service` supports hold/reject and selecting existing
server-held evidence, with a coach handoff after resolution. It hides private state
on lost visibility/access. No freely typed recipient or raw answers enter these
actions. The injected immutable evidence loader has no live default; no Typeform
reader, mail adapter or scheduler is imported. The route registration remains
unmounted in the application while provider mapping, migrations and evidence
recovery are unverified. An isolated synthetic harness exercises the real route,
SQL and UI without importing full application startup.

**Gates:** actual exact-response reader and canonical response/version comparison;
reviewed evidence provenance, storage/access/retention and report-recipient access;
Typeform field/completion/language mapping; dedicated key/expiry/legacy reconciliation;
isolated Neon migration/transport/multi-process locks; bound message preview, exact
human message approval and delivery reconciliation. The prepared additive migration
must follow the earlier intake migration and refuses existing cross-order response
conflicts. Neither populated Replit database is a disposable target. The legacy
connected webhook and manual result sends remain connection work, not fixed live
behavior. Existing coach-copy disclosures, privacy backlog and Friday supervised
authentication/recovery checks stay separate. No production readiness is claimed.

**Validation:** all 226 standard release tests pass on Node 24.19.0, including
16 new actual SQL/HTTP review tests. TypeScript and build pass; the existing
large-client-chunk warning remains. Browser checks using only fictional data
verified hold/version history, evidence selection, exact-order resolution/coach
handoff and refusal gating. PGlite is single-connection local evidence, not Neon
transport or cross-process acceptance. Source backups remain separate from provider
or database backup. The full application and schedulers were not started.

**Source / cross-repository:** website main/base freshly checked at
`b1a8c52784861a98d1f0d3ada39bbbcdda332454` plus working tree; OS main freshly checked
at `83391d8520a6bfb2e010590686d6e32797490b62`, PRD/log read in this conversation.
GEOS-REQ-002/003/004/005: website-owned schema/review only, no new shared contract or
OS/Notion transfer, so no paired OS implementation. No commit/push/merge, production
DB, provider, mail, full backend or Replit action authorized by this local selection.

<a id="ai-lit-scan-recovery-preview-20261014"></a>
### Exact-response recovery and bound no-send preview — 14 October 2026

**Authority / scope:** Estève asks to combine the supplied continuation prompt into
this chat and continue the local work. This implements the next recovery/provenance
and no-send preview slice under DEC-AIL-093/095/096, preserving the approved journey.
It does not approve provider changes, real respondent reads, a live sender, raw-answer
storage, a new customer step, actual sending or release. Affected REQ-035/036/076 and
service portions of REQ-089/106. Review policy and identity boundary are unchanged.

**Local candidate:** new signed receipts can commit an explicit v1 fingerprint of
response identity/time, mapped order proof and supported typed answers, plus original
question-label order. Object-key/answer-array order is normalized; choice/ranking
array order remains meaningful. Unsupported types, ambiguous fields or absent original
labels leave a recovery gap. Historical rows remain null. No raw content is persisted.

An injected Responses API reader requests one exact response ID with completed-only
filtering, bounded size/deadline and redirects disabled. It checks collection/identity,
qualifying completion, mapped reference, content fingerprint and immutable signed
question-label evidence. Empty recent results remain pending; changed/ambiguous data
stays held. Its raw API-body digest is separate from the signed webhook's raw hashes.
No API token/environment lookup, global transport or production reader is registered.

A protected no-send operation requires a resolved reviewed task, current eligible
order/binding, original language and explicit assignment/recipient evidence. It reads
and audits context, recovers outside database locks, then rechecks/audits that context
before disclosing content. Refunds, reassignment, changed evidence/version, locale or
owner revocation invalidate the result. The draft carries reviewed participant To,
existing Estève/Anu copies, reply address, exact sender/subject/HTML/text/attachment
and a bound fingerprint. Sender is injected, with no live default. Approval remains
`not_approved`; delivery remains `not_attempted`. No send, outbox, task advancement or
`dashboardSent` change is included. The existing pure branded wrapper is extracted
without byte changes and reused by the old senders; no live message copy is changed.

The owner UI can inspect this draft after resolution; private content clears with
visibility/access changes. Its sandboxed HTML view blocks scripts, navigation and
external assets. The isolated harness uses fake API responses/credentials, original
fictional labels and a fictional sender. Real Typeform/review registrations remain
unmounted. No raw-answer/definition storage or retention policy is implied by memory
fixtures. Content access/retention and evidence provenance remain connection gates.

**Provider semantics checked:** Typeform documents exact `included_response_ids`,
completed-only filtering and a possible lag for very recent results. Its webhook
reference maps token to response ID, but example API items contain differing token/
response_id values. This candidate holds conflicting identity fields; receiving-system
validation must settle actual configured behavior before connection. It never falls
back to searching by email or trusting a different raw JSON representation.
See the [Responses reference](https://www.typeform.com/developers/responses/reference/retrieve-responses/)
and [webhook identity reference](https://www.typeform.com/developers/webhooks/example-payload/).

**Remaining gates:** actual form/reference/completion/language mapping; API region,
identity-field behavior and exact approved runtime credentials; durable protected
original-definition/recovery provenance, content storage/access/retention; isolated
Neon migration/transport/locking; bound approval/dispatch and actual delivery. A third
additive prepared migration follows intake and review migrations; only synthetic
PGlite execution is authorized here. Both populated Replit DBs remain excluded.
Legacy email-based completion and unbound manual result sends are still connection
work. Coach-report retrieval/readiness/access is separate from this completion copy.

**Validation:** all 241 standard release tests pass on Node24.19.0, including
15 new recovery/preview cases; focused SQL/HTTP/sender run55passed. TypeScript and
build pass with the existing bundle-size warning. Desktop browser checks verified
resolution, exact participant/coach envelope, plain text, sandboxed HTML with links
removed, and complete attachment using fictional data only. No provider response,
live MFA, real inbox, Neon transport or multiple-process acceptance is inferred.

**Source / boundary:** website main/base freshly resolved unchanged at
`b1a8c52784861a98d1f0d3ada39bbbcdda332454` plus working tree; OS main unchanged at
`83391d8520a6bfb2e010590686d6e32797490b62`, paired PRD/log read in this conversation.
GEOS-REQ-002/003/004/005: website-only digest/preview, no new shared package or OS
transfer, no paired OS implementation. Source backup is separate from DB/provider
backup. Production SHA remains unknown; no commit/push/merge, provider/production
mutation, live email, full backend/scheduler or Replit deployment.

<a id="ai-lit-learning-qr-20261014"></a>
### Action learning in data administration and brochure link counts — 14 October 2026

Estève asks for these two changes before continuing real provider mapping. This
is an approved local implementation request. Estève subsequently chose to retain
the printed QR; no live activation or brochure replacement is authorised by that choice. Decision: [DEC-AIL-097](DECISION_LOG.md#dec-ail-097).

| ID | Status | Requirement |
| --- | --- | --- |
| AI-LIT-REQ-109 | Approved default; local learning candidate | For RoPA databases and data/privacy-leadership interfaces, teach through a small real action and a short check. Use progressive disclosure, short plain-English explanations around eighth-grade level, contextual hover/focus meanings and persistent click/tap examples/actions. Explain acronyms beside controls; keep essential cautions visible. Keyboard and touch must work. Examples must not populate real records, appoint CDO/DPO roles, select legal bases or certify compliance. |
| AI-LIT-REQ-110 | Existing brochure QR retained by owner; separate attribution unavailable; live analytics delivery unverified | Keep the QR already printed on the brochure, pointing to `https://www.greenelephant.org/`. Report any existing consented homepage analytics as mixed-source homepage visits, never as brochure scans. Do not replace the QR, route all homepage traffic through a campaign counter or infer brochure attribution from direct/unknown traffic. Separate /qr/ campaign functionality remains available for other explicitly identified links. Preserve consent choices and minimise counter records. |

**Implemented locally:** a reusable field-help/action-learning pattern; meanings,
examples and actions for all 14 RoPA fields; three expandable field groups; status,
metadata and review help; existing general admin tooltip icons now support a
persistent keyboard/tap-open explanation; order-review learning prompts. Scoped
personal working preferences are saved outside Git, without changing the pinned
seed. Existing RoPA data schemas, validation, permissions and review attestations
are unchanged.

The brochure QR decodes to `https://www.greenelephant.org/` (no marker). Estève
chooses to keep it: “I want to use the QR that I have from the brochures.” The
replacement choice is settled. The admin screen records this choice, removes the
replacement preset and links to existing analytics setup/status. Existing consented
homepage page views can include these visits alongside other sources; they are not
a brochure-scan count and do not cover every scan. No new root redirect, tracking
cookie, source guess or customer question is added. Live analytics delivery at
this exact address is not active according to the public configuration: collection
is disabled and no measurement ID is exposed (read-only check; event/property
verification remains open). The prior candidate generator/assets are
retained for recovery/future explicitly approved links, not selected for this print.

The public QR handler now records only the campaign reference; the existing store
adds its row ID and timestamp. It saves no visitor IP/hash, browser, referrer,
device or location and makes no geo-provider request. HEAD and advertised preview
requests do not count; repeats/shared links/bots can. Target validation also covers
legacy records. Redirects are temporary/no-store and counter failure preserves
the validated destination. Historical fields are not purged. EN/FR privacy copy
states this mechanism; retention/notice review and production acceptance remain
open. This is not a compliance certification or a new legal-basis decision.

**Validation:** 248/248 release tests, including seven new real HTTP QR cases;
TypeScript/build pass. Browser checks cover keyboard-open learning, real versioned
save of a fictional draft, 390px wrapping, tap-open/escape-close help, and one
local QR open appearing in the separate fictional campaign count. Original and
generated QR PNGs decode locally to their exact expected payloads. These checks
do not verify the live route, Neon target or final printed brochure.

**Cross-repository:** website base/HEAD
`b1a8c52784861a98d1f0d3ada39bbbcdda332454` plus working tree; OS PRD/log read at
`83391d8520a6bfb2e010590686d6e32797490b62`. GEOS-REQ-002/003/004/005 checked:
website-only help and existing QR storage; no OS data transfer, schema/package
contract change or OS implementation. Provider mapping, named-recipient gates,
isolated Neon validation, human message approval and human release remain open.
[Brochure runbook](operations/qr-brochure.md).

<a id="ai-lit-privacy-completion-20261015"></a>
### Privacy completion candidate and live Typeform wording — 15 October 2026

This status under [DEC-AIL-100](DECISION_LOG.md#dec-ail-100) supersedes earlier
"current implementation" descriptions for the paths below. It does not mark the
whole privacy programme complete. Estève subsequently authorises the agent to merge the tested foundation through
PR #63 under DEC-AIL-101, then continue the next local integration batch. Replit
publication remains a separate human step. GitHub source and live provider settings differ.

| Area | Verified implementation | Still required before activation/completion |
| --- | --- | --- |
| Two Typeform questions | Readiness: “Are you ready to start your Satellite Scan?” Optional raw answers: “Which email address should receive your raw Scan answers?” Short descriptions explain the choice beside each question. Published and public definition compared with the original: four text changes only; routing/types/required settings unchanged. | The form is English; this wording edit does not certify its other privacy statements, sensitive questions or timing promises. |
| Actual Typeform mapping | Stable readiness ID `kyfdA3IJdQ6u`, final answer IDs and accepted/refusal ending IDs are recorded in `server/typeform-mapping.ts`. A signed accepted ending plus required answers is required, rather than readiness alone. V2 recovery ignores generated field/choice refs. | Declare/review the hidden order parameter `service_reference`; inspect an isolated signed complete payload/API recovery; persist protected original evidence; mount the reviewed path at the existing webhook URL; preserve purchase language; complete evidence-backed participant assignment and service dispatch. Same-link order evidence never verifies a person. |
| Choice history | Immutable bilingual notice versions; fresh pending requests; signed POST confirmation or refusal; withdrawal; same-request deduplication; old/superseded/expired links blocked. No legacy grants inferred. New handlers are feature-gated and old withdrawal remains usable while they are disabled. | Owner-reviewed live notice wording, final confirmation message and supervised delivery; complete other collection-surface adapters and historical reconciliation. |
| Marketing enforcement | New marketing gates require current notice, confirmed choice, current contact address, no suppression and no recovery hold. The final submission holds the same contact lock as withdrawal. Provider acceptance errors are not success. | Supervised production checks; inventory every remaining optional path. A message already submitted cannot be recalled by a later withdrawal. |
| Cases and privacy attention | Source-scoped request deduplication; responsible owner; one-calendar-month review target; identity, hold and outcome controls; durable attention work. Restricted panels show history and exact drafts, including trace CC. New workers/sends OFF by default. | Verified mailbox identity/alias mapping, resumable history/cursor reconciliation, loop prevention, per-recipient/provider delivery reconciliation and signed delivery webhook. Unknown/submitting outcomes remain held; no blind retries. Review target is operational, not a legal deadline determination. |
| Routine admin mail | Automatic daily digest startup removed. Durable weekly occurrence keys and reviewed recipient references exist; restart/DST tested. No weekly schedule or deadline-alert window is selected by default. | Split/gate every mixed immediate admin/customer path, persist routine outstanding tasks, and finish weekly settings/digest UI. No global Resend disablement as a substitute for category preferences. |
| Retention and recovery | Owner-reviewed metadata rules, bounded expiring dry run, changed-version/hold rejection, explicit application and processing recovery hold/resume. Blank policy periods remain unknown. | Full retention inventory and reviewed legal/business periods; cross-provider/mailbox/backup acknowledgements, restore rehearsal and independent privacy review. Current redaction covers only named workflow metadata; it does not erase contacts, orders, providers or backups. |
| Review and release | Local SQL/HTTP tests and a fictional browser check. Additive migration prepared, never applied to a connected database. | Designated isolated Neon validation, named/MFA production evidence, final full privacy/security review, Estève's PR review/merge, exact-SHA manual Replit release and public smoke checks. Both existing Replit databases contain data. Issue #43 remains deferred and analytics collection OFF. |

Runtime gates and configuration names are documented in
[the secrets inventory](operations/secrets.md#privacy-workflow-candidate).
The owner authorises merging the disabled foundation under DEC-AIL-101 while the
remaining implementation stays explicitly unfinished. Do not mistake the source
merge, passing tests or published Typeform text for backend activation.

<a id="ai-lit-release-assembly-20261015"></a>
### Unified handover and release preparation — 15 October 2026

Status evidence under [DEC-AIL-098](DECISION_LOG.md#dec-ail-098). Estève asks to
feed the supplied purchased-service handover into this work so GitHub has one
source of truth for PRs, while leaving issue #43 and production/GA4 privacy checks
for later. This authorises reconciliation and concrete preparation, not activation,
publication, a new consent policy or a claim that the local branch is deployed.

**Authority:** keep this PRD and the existing decision log as the sole canonical
requirements/decision pair. GitHub PRs, their reviewed commits and actual checks
are the PR-state authority. Local handovers and the dated inventory below are
reconciliation evidence, not a parallel PR ledger. Query GitHub again before
publishing a PR or choosing a release SHA.

**Reconciled input:** the supplied handover is the earlier 77-file/PRD2.26.0/
log11.27.0 checkpoint of this same checkout and base, not another branch to merge.
All 77 source paths remain in the 95-file candidate: 61 byte-identical, 16 updated
by later preserved work, 18 additional paths. Its proposed exact-response recovery
and bound no-send preview are already implemented under DEC-AIL-096's follow-up.
Do not repeat that work or overwrite current state with the older handover.
Paid-service priority DEC-AIL-093, same existing customer journey DEC-AIL-095 and
owner-assignment policy DEC-AIL-096 remain settled; full privacy backlog remains.

**GitHub snapshot, 15 October 2026:**

| Item | Verified state | Treatment |
| --- | --- | --- |
| PR #55 | Merged; reviewed main `b1a8c52784861a98d1f0d3ada39bbbcdda332454` | Existing release target in issue #31, not proof of production identity |
| PRs #56–61 | Open dependency updates | Separate maintenance scope; not merged or bundled by this preparation |
| PR #4 | Open MY5 baseline | Remains paused; no implementation, merge or closure |
| Local 95-file candidate | Uncommitted; no matching open integration PR found | Prepare one coherent review draft; no invented commit SHA or PR number |
| Issue #43 | Deferred by current user; earlier deliberate collection hold retained | No account/config inspection, enablement or closure in this batch |

**Preparation outcome:** identify the existing reviewed commit separately from a
future integration commit. Prepare an exact-SHA source-only release handover, the
complete issue #31 Bash, a conditional analytics activation/rollback plan and a
reviewable integration PR title/body. Do not create a second canonical PR record,
commit/push the dirty candidate automatically or silently include dependency PRs.
No new PR/commit exists until it is actually created and verified in GitHub.

The reviewed commit's isolated source archive passes 119/119 release tests,
TypeScript, build and repository checks using existing local dependencies. This
is not a new clean install, current dependency audit, Replit verification or live
acceptance. PR #55's pre-merge CI run116 also reports success. Earlier 248 local
candidate tests describe different source; do not label the reviewed commit as
having the candidate's features or test count.

**Activation remains conditional:** collection stays off. Before any later change,
complete issue #43 production-source/stream/privacy/retention/consent gates and
verify the exact deployed/rollback commit. A later reviewed app-scoped
`GA4_COLLECTION_ENABLED=true` change and human Republish remain separate. For
purchased-service activation, real Typeform mapping/recipient evidence, protected
capture/retention, dedicated keys, isolated Neon checks and approved exact messages
remain open; staging routes/readers stay unconnected. Preparation clears none of
these gates. Keep the printed homepage QR under REQ-110; mixed homepage traffic
cannot become a brochure-scan count. MY5 remains paused and the separate supervised
MFA/recovery checkpoint is preserved without duplicate scheduling.

**Cross-repository:** website base/main above plus working tree; pinned OS
`83391d8520a6bfb2e010590686d6e32797490b62` PRD/log previously read and main rechecked.
GEOS-REQ-002/003/004/005: evidence consolidation and existing release boundaries
only; no new shared contract, data transfer or OS implementation.

#### GitHub publication approved — 15 October 2026

Estève now explicitly requests creating or updating the GitHub PR and pushing the
candidate to main. [DEC-AIL-099](DECISION_LOG.md#dec-ail-099) authorises committing
and pushing the reviewed local candidate, using one matching integration PR and
merging through required checks. This supersedes the preparation-only publication
limit for this candidate. It does not approve Replit publication, analytics
collection, provider/DB activation or actual messages. Preserve issue #43's deferred
checks, paused MY5 PR #4 and unrelated dependency PRs. Record the actual PR/head and
merged main SHA after GitHub confirms them; no future SHA is inferred here.

### Final release repair

| ID | Status | Requirement | Evidence |
| --- | --- | --- | --- |
| AI-LIT-REQ-070 | Local repair; human acceptance pending | Make each Periodic Table “View Related Prompts” action open Resources filtered to the element’s existing communication lens. Offer a clear route back to all prompts; support API and fallback prompts, ignore unknown lens values and show an honest empty state. Preserve prompt text, votes and provider behavior. | Estève reports the broken button during final release checks; 2026-10-06; DEC-AIL-073 |
| AI-LIT-REQ-071 | User choice A; implementation evidence | Replace the public personal Scan example with wholly fictional, clearly labelled partial practice inputs across eight lenses. Remove personal answers and identifiers from the shipped example; retain the Copy Sample Data interaction. Commit, push and open the reviewed website PR after checks. Merge and Replit publication remain separate. | Estève selected option A on 2026-10-06; DEC-AIL-074 |
| AI-LIT-REQ-072 | Requested repair; implementation candidate | Permit the exact Replit workspace hostname in Vite development and built preview, retain host checks, and run the provider-isolated website preview on the forwarded port. Review GitHub maintenance blockers and preserve Replit-only work before selecting an exact reviewed release SHA. Human Republish and live provider checks remain separate. | Estève requests GitHub blocker resolution and a Replit preview repair, 2026-10-07; DEC-AIL-075 |
| AI-LIT-REQ-073 | Implemented in PR #51; source validation passed | Resolve issue #50 without suppressing TypeScript diagnostics, make type checking blocking in CI and release preparation, then resolve active website PRs before producing the final Replit handoff. Preserve paused MyFive PR #4 as explicitly selected. | Estève requests issue #50 before republishing and selects keeping MyFive draft #4 open, 2026-10-07; DEC-AIL-076 |
| AI-LIT-REQ-074 | Implemented in PR #52; CI passed | Resolve the active website maintenance queue on the clean TypeScript baseline: current pinned checkout/setup-node actions, Google client compatibility and resizable-panel API migration. Retire superseded proposals without deleting branches; preserve paused MY5 #4. | Estève requests the remaining website PRs resolved before Replit handoff, 2026-10-07; DEC-AIL-077 |
| AI-LIT-REQ-075 | Requested follow-up; production evidence pending | Address issue #43 in a separately reviewed PR: verify existing bounded consent behavior, provide value-free runtime checks and resolve the Replit configuration source with the existing GA4 stream. Keep collection off until the account/privacy gates pass; merge does not prove event receipt or start the observation window. | Estève explicitly requests #43 tackled in a new PR and merged, 2026-10-07; DEC-AIL-078 |

### Purpose and audience

Simplify greenelephant.org so a suitable visitor can understand the AI literacy
training offer and take one clear, approved next step. Clarity, search findability,
maintainability and real delivery capacity come before a platform rebuild.

| ID | Status | Requirement / direction | Evidence |
| --- | --- | --- | --- |
| AI-LIT-REQ-001 | Approved direction | Lead the public message with independent professionals: lawyers, therapists, coaches, creatives, engineers, fractional executive assistants (EAs), consultants and teachers. The offer must also serve independent entrepreneurs, teams and intrapreneurs (innovators working inside organisations). Leading with independent professionals does not exclude the organisational audience. | Estève workshop approval, 2026-09-30; DEC-AIL-007 refines DEC-AIL-002 |
| AI-LIT-REQ-002 | Approved direction | Support English- and French-speaking reach in Finland, the UK, France and wider Northern Europe. English-first remains the launch baseline. Prepare French versions of every retained public page, including the homepage and ACX article, in small reviewable batches. French preparation is authorised now; the publication schedule remains open. | SRC-AI-LIT, Audience and learner needs; DEC-AIL-003/018/029 |
| AI-LIT-REQ-003 | Proposal | Help visitors understand practical, safe AI use in their work, offer fit, preparation, delivery, follow-up and access to approved materials. Validate these needs. | SRC-AI-LIT, sections 2–4 |
| AI-LIT-REQ-004 | Partly resolved | The primary conversion action is a discovery call with Estève through Calendly under AI-LIT-REQ-021. First-release search niche, priority problem and detailed offer remain open. | SRC-AI-LIT, sections 2–3 and 10; DEC-AIL-014 |
| AI-LIT-REQ-005 | Proposal | Discover training → understand an offer → enquire or enrol → access materials. Compare this with simpler existing routes. | SRC-AI-LIT, section 4 |
| AI-LIT-REQ-006 | Approved main navigation; remaining page details open | Main menu: AI Literacy Training (discovery workshop and four-day journey), Our Approach (ACX and the Periodic Table's mental-model, verbal, non-verbal and intention layers), and About (Estève, Anu and Jonas). The Discuss your training needs button links to the approved Calendly event; the logo returns to Home. Supporting services remain in the approved footer group. Homepage section order is approved in AI-LIT-REQ-022. Final URLs, other page outlines, resources and legal/footer details remain open. | Estève approves the main menu and homepage structure, 2026-10-01; DEC-AIL-016/017 refine SRC-AI-LIT section 5 |
| AI-LIT-REQ-007 | Discovery requirement | Classify existing content, components and integrations as reuse, hide/retire, replace, or awaiting Estève. | SRC-AI-LIT, architecture distinction |
| AI-LIT-REQ-008 | Discovery requirement | Compare laptop, GitHub and Replit evidence; select a recoverable application baseline before implementation. Do not infer deployed code from main. | SRC-AI-LIT, sections 8–10 |
| AI-LIT-REQ-009 | Bounded header repair implemented locally; browser acceptance open | Provide keyboard access, semantic structure and readable contrast. Checkpoint 2 repairs current header disclosure semantics, separates desktop links/buttons, provides focus-visible styles and preserves the skip link/main landmark. Rendered HTML and build checks pass; actual keyboard, responsive, contrast and assistive-technology verification remain open. This does not approve or implement the future navigation design. | SRC-AI-LIT, section 9; Estève continues bounded repairs; DEC-AIL-022 |
| AI-LIT-REQ-010 | Draft requirement | Any enquiry/enrolment data needs a purpose, owner, retention approach and understandable privacy/consent information. | SRC-AI-LIT, section 9 |
| AI-LIT-REQ-011 | Draft requirement | Assign human ownership for offer content, enquiries and materials, and require validation evidence and a rollback path for later implementation changes. | SRC-AI-LIT, section 9 |
| AI-LIT-REQ-012 | Draft requirement | Keep secrets out of source and evidence; runtime secrets remain in Replit and human-held credentials in 1Password. | SRC-AI-LIT, section 9; current user workflow |
| AI-LIT-REQ-013 | Approved direction | Make training suitable for both independent professional enquiries and organisational or union-supported enquiries, including people seeking training through employer/HR budgets or union training programmes. Delivery format, purchasing process and any funder-specific requirements remain to be agreed; do not claim funding eligibility or accreditation without evidence. | Estève workshop approval, 2026-09-30; DEC-AIL-007 |
| AI-LIT-REQ-014 | Approved direction | Green Elephant remains a communication expert positioned toward human-centred AI literacy. Lead with confidence and independence using AI, with human judgement and agency at the centre. AI augments communication skills. The Periodic Table differentiates the approach: highlight its white Think & Understand mental-model layer while briefly and accurately including the verbal (Say & Write), non-verbal (Do & Move) and feeling/intention (Feel & Intend) layers. Do not present mental models as the whole method. Scan, prompts and coaching support the primary journey. Exact public wording remains subject to review. | Estève's brand boundaries, selection of outcome A and all-layer correction; DEC-AIL-008/017 |
| AI-LIT-REQ-015 | Approved direction | Keep all three coaches in About using the approved titles: Estève — AI communication coach; Anu — communication coach and trainer; Jonas — conflict coach and trainer. Add short, plain-English skill descriptions grounded in the existing profiles. Existing copy is evidence to review, not authority for new AI-expertise, clinical-outcome or performance claims. Source-based candidate bios are recorded below under DEC-AIL-027. | Estève workshop instruction; DEC-AIL-009 |
| AI-LIT-REQ-016 | Approved direction | Retain Conflict Bootcamp training using Satellite Scan as a base, with Jonas and Estève in French or English; retain Coaching Journeys for EAs, executives and B2B teams using Satellite Scan as a base, with Anu, Jonas or Estève. Reconnect both services to AI literacy and place their navigation links in the footer group More ways to work with us. Exact service copy remains open. | Estève workshop instruction; DEC-AIL-009; placement approved in DEC-AIL-011 |
| AI-LIT-REQ-017 | Approved direction | Include a four-day, part-time, hands-on coaching journey for 1–5 people, including solo participation, for beginners. Focus on AI safety, clear requests (prompts) and independence in work with AI, informed by the supplied training model. Avoid action-learning jargon in public copy; make coaching and feedback clear. Feature this journey under AI Literacy Training in the main menu. Provide strong hands-on ACX 1–2 practice, guided ACX 3 work and an ACX 4 overview. Detailed exercises, facilitated hours, logistics and price remain open; the discovery workshop has a narrower promise under AI-LIT-REQ-020. | Estève workshop instruction; DEC-AIL-010/011/012/013/027; SRC-AI-LIT-TRAINING-01 |
| AI-LIT-REQ-018 | Approved boundary | Preserve React/Vite/Express by default. Discuss page/navigation architecture separately from software architecture. Any technical restructuring requires a clear reason and Estève's approval. | Estève's initial project boundaries; DEC-AIL-008 |
| AI-LIT-REQ-019 | Approved pedagogical direction | Use Estève's ACX article as the basic pedagogy for AI literacy: begin with human communication (Do, Think, Say, Feel; Human-to-Self and Human-to-Human), then explain personal AI chats, connected workflows, participating agents and AI-supported work across team members within an organisation (ACX 4). ACX 4 is not positioned as operating AI systems across an entire organisation. Preserve human judgement and awareness of information filtering throughout. Delivery depth is approved separately for each format; exact exercises and completion outcomes remain open. | Estève identifies his article as the basic pedagogy and corrects ACX 4 scope; DEC-AIL-012/013; SRC-AI-LIT-ACX-01 |
| AI-LIT-REQ-020 | Approved offer boundary | The discovery workshop maps the different ACX levels and provides practical takeaways at ACX 1–2 only. It must not promise guided ACX 3 work or the four-day journey's ACX 1–4 learning programme. Mapping levels 3–4 explains the landscape; it does not extend the workshop's practical delivery scope. Duration, group size, base price and inclusions are approved under AI-LIT-REQ-023. Exact exercises, delivery mode and workshop-specific enquiry details remain open. | Estève workshop approvals, 2026-10-01; DEC-AIL-013/018 |
| AI-LIT-REQ-021 | Approved direction | Use Discuss your training needs as the main homepage button. Link directly to Calendly to book a discovery call with Estève, who helps the visitor identify suitable training. This call is distinct from the discovery workshop and the four-day journey. The approved destination is [Estève's discovery-call booking page](https://calendly.com/greenelephant/free-ai-literacy-discovery-call), supplied by Estève and publicly reachable on 2026-10-01. Recording with Fathom is optional and requires the participant's explicit agreement before recording starts; an unrecorded call remains available. Estève will update the Calendly description manually using supplied draft copy. Final website/event wording about duration and cost remains to be aligned. Slot availability and end-to-end booking have not been tested. | Estève approves the action, URL and optional recording with explicit agreement, 2026-10-01; DEC-AIL-014/015 |
| AI-LIT-REQ-022 | Superseded homepage structure | Historical approved order: (1) clear promise, audience introduction and booking button; (2) comparison of discovery workshop and four-day journey; (3) human-centred approach with ACX and all four Periodic Table communication layers; (4) people and experience; (5) practical questions and repeated CTA. The 2026-10-05 workshop supersedes this order with AI-LIT-REQ-045 while preserving the approved CTA, offers, evidence gates and supporting-service placement. | DEC-AIL-017; superseded in part by DEC-AIL-047 |
| AI-LIT-REQ-023 | Approved workshop package | Discovery workshop: 3.5 hours including a break; group size 6–12, maximum 16; EUR 2,400 excluding applicable VAT covers up to 12 participants, with EUR 100 excluding applicable VAT for each additional participant 13–16 (EUR 2,800 before VAT for 16). Participant materials, a preparation call and a follow-up call with the team lead are included. Call lengths, material formats and delivery mode remain open. Use the approved conditional VAT wording below; confirm invoice treatment from billing details and the service supplied. | Estève workshop approvals, 2026-10-01; DEC-AIL-018/019 |
| AI-LIT-REQ-024 | Approved copy | Use the short English training-page copy below, approved in the workshop chat. Approval covers the wording; remaining visuals and website implementation are separate. | Estève approves the copy, 2026-10-01; DEC-AIL-020 |
| AI-LIT-REQ-025 | Approved parked scope | Park /webinar, /webinars and /calendar. Preserve their original components and data for later; show a simple paused page without registration or webinar fetches, hide public navigation/promotional entry points, remove these URLs from the sitemap and mark their pages noindex. This is reversible parking, not deletion or a scheduled relaunch. Provider jobs and stored data are outside this UI change. | Estève requests webinar parking and explicitly selects all three pages, 2026-10-01; DEC-AIL-021 |
| AI-LIT-REQ-026 | Approved visual boundary; revised preview pending review | The AI-LIT public website uses a dark UI only, with no light variant or light-mode switch. Reuse the existing Green Elephant brand: Poppins 700 headings, Lato body text, near-black base, established atmospheric dark blues, teal accents, existing logo and restrained Earth/aurora imagery. Preserve readable contrast, responsive layout and reduced-motion support. Avoid generic prompt-card hero decoration; keep the accepted content direction and review a simpler image-led opening. The original Periodic Table artwork remains unchanged, including its white mental-model layer. | Estève requests dark-only UI and existing-site typography/colour/styling, accepts the content direction, 2026-10-01; DEC-AIL-024 |
| AI-LIT-REQ-027 | Approved footer coverage | Provide a complete grouped footer sitemap as an alternative to the simplified main menu. Preserve retained public pages, existing working section links, AI/Privacy/Cookie policies and Terms, contact/social links and account-entry links. Keep the three parked webinar/calendar pages and paused My5 out of AI-LIT navigation. The visitor footer and search-engine XML sitemap have different purposes: account/admin entry links may remain in the footer, but private routes, fragments, external sites and duplicate aliases do not enter the XML sitemap. | Estève asks to restore all kept working links, specifically AI Policy, 2026-10-01; DEC-AIL-025 |
| AI-LIT-REQ-028 | Approved refinement direction; candidate copy/design pending review | Use smooth full-width transitions with matching section-edge colours, without abrupt black/dark-blue bands. Give the unchanged Periodic Table a matching dark surround. Reduce visible text, use short everyday English aimed at an eighth-grade reading level, and explain retained terms through accessible optional disclosures. Preserve prices, offer depth, complete communication-layer coverage, footer destinations and testimonial meaning. Compare the supplied Maeva scene privately with the portrait; do not infer final image or publication approval. | Estève requests smooth gradients, less text, explained ACX and a full-page image trial, 2026-10-01; DEC-AIL-026 |
| AI-LIT-REQ-029 | Approved clarity direction; candidate wording recorded below | Make the offers visually distinct with participant counts, time commitment and learning purpose. Connect Think, Say, Feel and non-verbal human skills to practical AI use. Explain human-to-self reflection before prompting, human-to-AI exchanges, AI-to-AI handoffs and human-to-human discussion across ACX levels; do not equate the four connections with the four levels. Use examples, plain English and optional detail; retain human checking and the ACX 4 team-member boundary. | Estève requests clearer offers and tangible communication/ACX explanations, 2026-10-01; DEC-AIL-027 |

| AI-LIT-REQ-030 | Approved article and communication-label direction; draft copy pending review | Add thin on-brand icons and explicit H2S (human to self), HAI (human to AI), A2A (AI to AI) and H2H (human to human) labels. Adapt Estève’s original ACX article into a useful English guide, linked from the homepage ACX explanation and toward training. Use the Speech Lab / colour-decoding page as the visual reference. Preserve current ACX scope and offer depth; explain labels without claiming universal standards. Clarify included Satellite Scan prompts and practice materials as support for ACX learning, with training booked separately. | Current user request and Speech Lab style clarification, 2026-10-01; DEC-AIL-028; SRC-AI-LIT-ACX-01 |


| AI-LIT-REQ-031 | Approved copy direction; revised wording pending review | Say/write covers clear instructions, checking AI drafts, authentic tone and care for the reader. Feel/intend connects conscious communication to conscious prompting and clear intent. Non-verbal communication includes timing, pace, pauses and follow-ups, with AI supporting preparation and people choosing the rhythm. Briefly credit Estève’s AI and communication research with Arbora as the origin of ACX. Do not turn this attribution into certification, validated measurement or numerical influence claims. | Estève’s wording request and author-supplied research provenance, 2026-10-01; DEC-AIL-029 |
| AI-LIT-REQ-032 | Approved French scope; first draft batch prepared | Prepare French for every retained public page in small batches. Batch 1 covers the new homepage and full ACX article, including visible navigation, footer labels and accessible text. Use plain French with vous, retain brand/framework names with French explanations, and preserve offer terms and source quotations. Later batches cover shared application navigation, training/services/Scan, resources/tools/coaches, and policies. Private portal/admin interfaces, paused My5 and parked webinars remain outside this public-page translation scope. | Estève explicitly selects every retained public page delivered in small batches, 2026-10-01; DEC-AIL-029 |

| AI-LIT-REQ-033 | Version B selected; purple refinement comparison pending | Link the homepage Scan-help section directly to the existing Satellite Scan landing page with buying options. Keep levels 1–4 together in the article contents. Improve reading flow with original author drawings, accessible explanations and enlargement links. Explain ACX as Estève’s practical synthesis of AI/communication research with Arbora and a human-centred position grounded in agency and sovereignty. Compare simple code-generated level visuals plus optional originals against full original drawings. Preserve source labels and the current team-member ACX 4 boundary. | Current user request and supplied original artwork, 2026-10-01; DEC-AIL-030; SRC-AI-LIT-ACX-VISUALS-01 |

| AI-LIT-REQ-034 | Version B and purple icon direction approved; refinement candidates pending review | Keep all original ACX level drawings visible in both languages. Add a consistent, sketch-inspired SVG family in canonical Green Elephant purple (#5C4E99) to article levels and homepage ACX descriptions. Compare compact ink badges with a more distinctive sketchbook-ribbon treatment. Use full labels and numbers; preserve original artwork colours and distinguish communication connections from ACX levels. | Estève explicitly selects version B and asks for purple sketch-inspired icons and another graphic treatment, 2026-10-01; DEC-AIL-031 |
| AI-LIT-REQ-035 | Direction approved; local and bilingual review batch prepared | Connect the Scan to AI literacy, especially ACX 1–2, preserve original hero graphics and existing testimonials, prepare private client stories, and verify bilingual checkout without unapproved publication. | Current user requests; DEC-AIL-032 |
| AI-LIT-REQ-036 | Brand direction approved; exact wording pending review | Align footer, article and offers around humane AI use, human judgment and a practical conflict-to-trust benefit. Supply every new copy change in English and French and review links each workshop turn. Test only approved email copies/recipients; separate provider acceptance, delivery and privacy compliance. | Current user requests and explicit email approval; DEC-AIL-033 |
| AI-LIT-REQ-037 | Approved correction | Replace rejected sketch-derived icons with clean teal outline symbols for ACX and new navigation. Keep version B original drawings and original Scan hero treatment. | Explicit user correction; DEC-AIL-034 |
| AI-LIT-REQ-038 | Approved direction; local review | Dark ACX click targets with consistent purple outline icons, level numbers and names; raised Scan button and stacked arrow; English-only Scan notice in both languages; results-email repairs with both coaches copied. | DEC-AIL-035; visual and live-delivery acceptance open |
| AI-LIT-REQ-039 | Approved and merged; further visual refinement proposed | Five differentiated coaching pages for lifetime archives, next-chapter ventures, everyday AI confidence, facilitators/coaches and employer-funded experienced specialists. Launch all five in English in one window; prepare French later. Retain the four-day journey and independent-professional homepage priority; use the existing airy dark Poppins/Lato brand. | DEC-AIL-038/041/045; merged through PR #42 at `ef0199a`; production equivalence not independently verified |
| AI-LIT-REQ-040 | Repair requested; local candidate, runtime unverified | Reuse existing GA4 for a three-month landing-page comparison. The owner no longer finds the old homepage cookie choice: restore EN/FR Accept/Reject and withdrawal. Candidate tracks only public home/Scan/five coaching page views and selected enquiry/checkout-link clicks after acceptance, excludes private and assessment data, and reads a validated public measurement ID at runtime. Collection defaults off pending deployment/account/browser checks; do not start the comparison without delivery evidence. | Estève's GA repair request and clarification, 2026-10-03; DEC-AIL-039/043 |
| AI-LIT-REQ-041 | Restored visuals accepted and merged | Preserve the accepted homepage/Maeva changes. Restore the fuller historical Scan content blocks and corresponding FR translations, without the walkthrough or screen mockups. Reuse the original coloured lens icons, circular/stacked explorer, role switches, deliverable/process icons and revisit timing circles/timeline; adapt labels and controls for EN/FR and responsive use. Preserve current privacy and self-reflection limits, original hero, testimonials, terms and purchased inclusions. Keep English-materials notices under spacious CTAs in each page's language, and fade section glows to transparent at all edges over one dark base. | Estève's correction request, 2026-10-03; DEC-AIL-043/044/045; merged through PR #42 at `ef0199a`; owner reports subsequent republication, not independently verified here |
| AI-LIT-REQ-042 | Approved working boundary | Develop the next website-refresh candidate in a local Git worktree based on current GitHub `main`. Review copy, layout and small page changes through HTML rendered in the IDE/local browser before any PR. Replit inspection, synchronization, publication and deployment verification are outside this refresh phase. The user reports completing the GitHub synchronization and Replit republication during the preceding weekend; this is accepted as the working assumption for planning, not independently verified production evidence. | Estève's current instruction, 2026-10-05; DEC-AIL-046 |
| AI-LIT-REQ-043 | Approved homepage-refresh direction; exact copy and composition in workshop | Build a shorter customer-as-hero homepage that defines AI literacy near the top, names beginners explicitly, exposes all four ACX levels immediately after the hero, links the audience paths more clearly to target visitors, keeps the approved CTA, moves the two learning formats to the bottom of the main narrative, and reduces the homepage prominence of the Periodic Table and Satellite Scan. Preserve the approved brand, offer facts, evidence limits and separate offer-depth boundaries. | SRC-AI-LIT-ANU-20261005; SRC-AI-LIT-STORYBRAND-20261005; Estève's completion criteria, 2026-10-05; DEC-AIL-046/047 |
| AI-LIT-REQ-044 | Local visual acceptance in progress | Provide an IDE-rendered HTML implementation for desktop and mobile review. The first viewport should answer what Green Elephant offers, how it helps and what action to take; the page should expose a plain-language AI-literacy definition and visible ACX progression without relying on collapsed controls. Validate heading hierarchy, readable body sizing, keyboard operation, reduced motion, responsive wrapping and no horizontal overflow before proposing a PR. Homepage composition, five differentiated photographic heroes and niche-specific ACX sections are ready for rendered review. | SRC-AI-LIT-ANU-20261005; SRC-AI-LIT-STORYBRAND-20261005; DEC-AIL-046/048/049/050/051/052/053/054 |
| AI-LIT-REQ-045 | Approved homepage completion criteria | Completion requires: materially less visible text; less small text, with essential explanatory and decision copy never dependent on fine print; four large, visible ACX levels immediately after the hero; the two learning formats at the bottom of the main page narrative; more concrete examples and outcomes; a stronger landing-page hero; the eyebrow direction `AI training built for beginners`; an explicit promise; a useful `Explore the training` subtext/link; clearer connection between professionals, coaches, facilitators and the selected target groups; and implementation of the copy selected from this PRD. Exact promise, subtext, typography scale and middle-section order are workshop decisions. | Estève's workshop completion criteria, 2026-10-05; DEC-AIL-047 |
| AI-LIT-REQ-046 | Approved five-page visual and transition criteria; local candidate | Give each coaching landing page a meaningful, differentiated image within the approved directly-overhead home-office photographic family. Across every page, replace abrupt black-to-dark-blue boundaries with long, soft gradients whose edge colours meet without a visible line, including the fade over each hero photograph. Review transitions over the full page at desktop and mobile widths; do not judge isolated sections only. | Estève's workshop completion criteria and selection/refinement of Option B, 2026-10-05–06; DEC-AIL-047/053 |
| AI-LIT-REQ-047 | Approved hero copy; bilingual local candidate | Use the English eyebrow `AI training built for beginners`, headline `Start using AI without becoming an AI expert.`, and promise `Practise a useful AI conversation and a simple connected workflow. Then understand how guided agents and AI-supported teamwork work—so you know your ACX level and your next practical step.` Retain the approved discovery-call CTA. Link to the ACX section with `Explore the four ACX levels` and the tangible sequence `Chat · Workflow · Agent · Teamwork`. The faithful French counterpart is a local translation candidate for visual and language review. | Estève approves Option D, 2026-10-06; DEC-AIL-048 |
| AI-LIT-REQ-048 | Approved ACX presentation; bilingual local candidate | Use four large, always-visible cards directly below the hero. Desktop uses one four-card row, tablet a two-by-two grid, and phone one card per row. Each card combines the existing large ACX outline icon, level, tangible action and explicit human check: Chat—ask, improve and check; Workflow—connect repeatable steps and approve handoffs; Agent—set a goal, limits and check-ins; Teamwork—agree roles, sharing and decisions. Remove the old collapsed homepage ACX block. Preserve the honest offer-depth note and link to the full guide. French wording remains a local translation candidate. | Estève selects Option A, 2026-10-06; DEC-AIL-049 |
| AI-LIT-REQ-049 | Approved homepage middle order; bilingual local candidate | After ACX, show five large starting-point paths that state the target visitor and a concrete task. Then show the human-centred method, coaches with permission-backed evidence, and the two learning formats. Keep practical questions and the repeated CTA last. The English cards link to the five approved English landing pages; the French cards describe the paths without inventing unavailable French destinations. Use responsive three-plus-two, two-column and one-column layouts and smooth matching section-edge gradients. | Estève selects middle-order Option A, 2026-10-06; DEC-AIL-050 |
| AI-LIT-REQ-050 | Approved compact People-and-AI method; bilingual local candidate | Replace the large homepage Periodic Table presentation and two disclosures with four visible human actions: clarify the goal, set boundaries, check the work and make the decision. State that these responsibilities apply at every ACX level. Keep the Periodic Table and Satellite Scan as two secondary links to their dedicated pages. Use four columns, then two, then one; keep essential action text at 17px or larger and continue the matching dark gradient into the people section. | Estève selects method Option A, 2026-10-06; DEC-AIL-051 |
| AI-LIT-REQ-051 | Approved audience wording clarification; bilingual local candidate | Read the earlier phrase as `for professionals, coaches and facilitators`, not `four professionals`. Keep three coach profiles—Estève, Anu and Jonas—and explicitly connect their combined AI, communication and conflict expertise to independent professionals, coaches, facilitators, experienced specialists and teams. Do not create a fourth profile or treat Maeva's testimonial as a coach profile. | Estève selects clarification Option A, 2026-10-06; DEC-AIL-052 |
| AI-LIT-REQ-052 | Owner-approved photographic family; anatomy-reviewed v3 assets pending publication review | Use original, realistic, directly-overhead documentary scenes of lived-in Scandinavian home offices. Across the five-page family, vary visible age, gender presentation, skin tone, hairstyle and clothing while avoiding stereotype-led styling. Show no faces. Use ordinary domestic details, imperfect natural light, traditional pale-yellow/yellow Post-it notes, nearly vertical laptop screens whose displays cannot be seen, and varied messy printouts with folds, edits and wear. Every candidate must pass a full-resolution self-critique for one coherent person, exactly two plausible arms and hands, believable joints and no fused or duplicated anatomy before it enters the page. Avoid symmetrical studio styling, pristine grids, visible client data, readable text, third-party logos and identifiable people. Preserve prompt/output provenance and complete the project's normal rights, privacy and publication review; generated origin is not represented as legal clearance. | Estève requests more human diversity and explicit hallucination/anatomy checking, then accepts the five v3 images as perfect, 2026-10-06; DEC-AIL-053/055 |
| AI-LIT-REQ-053 | Approved niche-specific ACX explanation; English local candidate | Each of the five coaching pages must show four visible ACX cards explaining what the learner can do in that niche at ACX 1 Chat, ACX 2 Workflow, ACX 3 Agent and ACX 4 Teamwork. Every card pairs one concrete capability with an explicit human check or decision. Reuse the homepage's exact four purple outline icons, purple level/name treatment and purple card edge so the progression is recalled consistently; retain teal for the human-check cue. Use four columns on wide screens, two on tablet and one on phone. | Estève requests clearer niche-level ACX explanations and homepage-aligned purple recall cues on all five pages, 2026-10-06; DEC-AIL-054/055 |
| AI-LIT-REQ-054 | Approved seamless-gradient and spacing refinement; local candidate reviewed at desktop and phone widths | Across all five coaching pages, use one shared near-black edge colour for the landing-page base, hero-photo fade and both ends of every dark-blue section gradient. The hero overlay must begin at the header colour, move gradually through the photograph and finish at the page base. Use long multi-stop gradients, generous vertical spacing and exact matching edge colours; do not use an abrupt black-to-blue boundary or a one-pixel seam. Review every hero crop at 1440 × 900 and 390 × 844, one representative complete page at desktop width, the ACX grid at both widths and horizontal overflow before owner review. | Estève reports remaining black lines and asks for mobile/desktop rechecking plus a more airy treatment, 2026-10-06; DEC-AIL-055 |
| AI-LIT-REQ-055 | Approved image-visibility direction; headline placement refined by REQ-056 | Give the five accepted v3 photographs a large hero area at their original colour and brightness. Concentrate the overlay at the header and bottom edges, with a long fade into the copy rather than a dark wash over the whole scene. Preserve the approved images and ACX styling. Match every section edge and fade into the footer and cookie-settings strip. The niche introduction and CTA may require scrolling, while desktop navigation retains the enquiry CTA. REQ-056 supersedes the initial placement of the headline below the photograph. | Estève requests more visible photographs, redesigned heroes and overlays, generous space and transition checks, 2026-10-06; DEC-AIL-056/057 |
| AI-LIT-REQ-056 | Approved refinement direction; layout and draft copy implemented locally for review | Lift only the large headline into the desktop photograph's lower fade so it is visible without scrolling; keep supporting copy and niche CTA below. On phones, preserve the full scene and show the headline immediately beneath its fade within the first screen. Review all five pages at desktop and phone sizes. Rewrite each niche's four ACX examples from that visitor's perspective, using familiar tasks, named outputs and explicit human checks instead of abstract process language. Preserve the Chat → Workflow → Agent → Teamwork progression and the coaching-depth limits: practise 1–2, guided 3, explore 4. Exact new wording remains a review candidate, not an approved promise. | Estève requests first-screen headline visibility and role-based self-critique followed by direct draft copy edits, 2026-10-06; DEC-AIL-057 |

| AI-LIT-REQ-057 | Approved presentation direction; local bilingual candidate | Replace the English/French homepage sky hero with a slow carousel using the five approved niche photographs, generous space and matching soft edge fades. Keep the headline stable while scenes change, retain approved copy and section order, and provide accessible pause/previous/next controls. Load only one responsive image initially, load later scenes on demand, wait for decoding before changing them, stop automatic advancement offscreen/in hidden tabs, and default to manual on reduced-motion, data-saving or detected 2G connections. Move the prior homepage sky photograph to both Satellite Scan heroes with a left-side scroll-linked elevator marker; disable decorative motion for reduced-motion users. Preserve all Scan offers, checkout, notices and content. | Estève requests the five-case homepage carousel, fast small-device/slow-network loading, airy gradients and sky/elevator Scan treatment in English and French, 2026-10-06; DEC-AIL-058 |

| AI-LIT-REQ-058 | Option A approved; bilingual local candidate | Keep the spacious photographic carousel and headline unchanged. Replace REQ-047's supporting promise with: `AI literacy means knowing when to use AI, how to check its answers, and when not to use it. Practise chats and workflows. Explore agents and teamwork.` Supply a faithful French counterpart. Remove the repeated audience strip between the hero and ACX; retain audience descriptions in the five paths and coach introduction. Compact the supporting-copy/CTA area and its spacing so ACX arrives sooner without shrinking the photographs or dropping the CTA, exploration link or learning-depth limits. | Estève selects Option A in the requirements review, 2026-10-06; DEC-AIL-059 |

| AI-LIT-REQ-059 | Typography Option A approved; local implementation verified | On both homepage languages and all five coaching pages, use at least 18px (1.125rem at the default root size) for essential explanations, coach biographies, ACX action/check copy and learning/offer limitations, and at least 16px (1rem) for supporting labels. Preserve already-larger introductions and headings. Let cards grow and wrap without clipping; verify desktop and narrow phones. Keep these rules scoped to the reviewed page content, not navigation, footer, Scan, tools or private interfaces. This resolves the typography-floor choice in TBD-010. | Estève selects Option A (18px essential body / 16px supporting labels), 2026-10-06; DEC-AIL-060 |

| AI-LIT-REQ-060 | Copy-trimming direction approved; local wording candidate | Remove repeated explanations from both homepage languages and the five English coaching pages. Keep the approved hero promise, ACX cards and human checks intact. Shorten section introductions; distinguish who the page serves, what material to bring, skills to practise and the next useful output. Do not repeat course facts in prose when they are already visible beside it. Preserve permissions, privacy guidance, training-depth limits, non-guarantees, FAQs, group size, schedule/fee discussion and CTA destinations. | Estève selects Option A to trim repetition while preserving concrete examples and human checks, 2026-10-06; DEC-AIL-061 |

| AI-LIT-REQ-061 | French review and five-path footer approved; wording/layout are local candidates | Review French homepage and Scan wording for beginners without changing offer facts, privacy boundaries, testimonials or English-only notices. Add all five existing coaching-page destinations to the shared EN/FR footer in an always-open, responsive group, reusing homepage titles with labelled outline icons and readable audience descriptions. Mark English destinations explicitly on the French footer; preserve every existing footer destination and parked-page exclusions. Wider sitemap naming/grouping suggestions remain proposals, not implementation approval. | Estève selects A and requests the five footer links plus a beginner sitemap critique without hiding links, 2026-10-06; DEC-AIL-062 |

| AI-LIT-REQ-062 | Footer clarity and photographic cards approved; local candidate | Apply purpose-first footer group/link labels in English and French, keeping every retained destination and all groups expanded; use at least 16px footer links and generous touch targets. Each of the five homepage project cards previews its matching approved niche hero photograph, softly fading into readable copy. Reuse lightweight 640px derivatives with lazy loading; preserve imagery, offers, human checks and the carousel. Make all five cards usable links in both languages, explicitly marking English destinations on French cards. ACX remains the first section after the hero, before project cards and well before the pricing/training packages. | Estève selects footer Option A, requests matching photo backgrounds on the five homepage buttons and ACX before pricing, 2026-10-06; DEC-AIL-063 |

| AI-LIT-REQ-063 | Bilingual sitemap and calmer ACX guide approved; local review candidate | Present the shared English/French footer as a labelled Sitemap / Plan du site with a plain-language definition, consistent action-led branches and teal outline icons for every section. Keep all links visible, including the five project pages, and group data-protection information with policies. Simplify the ACX article into a four-level overview followed by short explanations, concrete tasks and human checks; put deeper terminology and original sketches in optional disclosures. Use the final four-colour drawing as a responsive, softly faded hero background; retain the untouched full drawing and explain its original broader level-4 label. Align body copy at 18px, supporting text at 16px, use an open reading column and verify phone/laptop layouts. Target plain language suitable for an eighth-grade reader and low attention load; do not claim certified reading level or ADHD usability validation. Preserve offer facts, safety boundaries and sources. | Estève requests a simpler map-like bilingual footer and airy, beginner-friendly ACX article, 2026-10-06; DEC-AIL-064 |

| AI-LIT-REQ-064 | Direction approved; Batch 1 EN/FR local candidate; factual/legal review open; other batches pending | Align all retained sitemap destinations with beginner-friendly AI literacy grounded in conscious communication and the accepted homepage brand. Cover copy, headings, typography, spacing, gradients, accessible interactions, metadata and English/French preparation in reviewable batches. Include AI Policy, Privacy, Cookies and Terms, retaining complete and accurate disclosures. Preserve destination links, tool behaviour, approved offers, source artwork and human checks. Separate ordinary language/design alignment from any proposed change to a service promise, legal obligation, processing practice or private application. Suggest selective overhead photography where useful, with no generation or publication implied. | Estève requests all sitemap pages aligned, including privacy and AI policies, and workshop-mode batch reviews, 2026-10-06; DEC-AIL-065 |

| AI-LIT-REQ-065 | Maeva placement and action-card Option A approved; local bilingual implementation | On both homepage languages, keep the four human actions and their Periodic Table / Satellite Scan links together, then show Maeva’s existing quote and portrait before the three-coach introduction. Preserve the hero, ACX, five project paths, offers and testimonial wording. Make the actions more tangible; use action-specific visual cues rather than ACX-level icons, because the checks apply at every level. The current reversible candidate uses teal outline symbols, four responsive cards and one email-drafting example per action. Estève selected Option A: retain the distinct symbols, cards and concrete examples. This approval does not extend to subsequent four-connection or Scan wording candidates. | Estève requests Maeva above the coaches, tangible human-action visuals and an ACX icon comparison, 2026-10-06; DEC-AIL-067 |

| AI-LIT-REQ-066 | Scan/communication-drift refinement requested; local EN/FR Scan and cross-page wording candidate; owner review open | Smooth all Scan hero/section/footer transitions with a consistent edge colour. Replace the two small post-button copy blocks with one concise, readable promise and visible English-intake notice. Restore paired crosses/ticks and a direct communication drift-check link, merge mirror/personality sections, add clear outline cues to revisit cards and make each ACX use concrete. Align current purchase descriptions without changing prices, inclusions, timing, guarantees, questionnaire/scoring, consent collection or payment handlers. Frame `/signals` around everyday communication with self and people, with practical links to AI requests; preserve its question data and score calculation. Prepare four-connection examples across home EN/FR, all five existing English coaching pages and Scan EN/FR as a reversible interpretation candidate. No ADHD usability certification, AI-model training, installed agent or automatic profile-sharing claim. | Estève selects homepage Option A and requests these Scan/coherence refinements, 2026-10-06; DEC-AIL-067/068. Estève selected connections (H2S/H2H/HAI/A2A) under DEC-AIL-070; exact Scan wording/visual acceptance remain open. |

| AI-LIT-REQ-067 | Approved presentation direction; local implementation under review | Across retained public pages linked from the sitemap, photo edges must fade smoothly into matching black/dark-blue surfaces, including hero and landscape/footer photos at desktop and phone sizes. Match each adjacent section colour; make fades proportional to the image rather than fixed-height strips. Preserve original photos, artwork, content, routes and tool behaviours. Estève selects communication connections (H2S/H2H/HAI/A2A) for the requested four types; keep ACX levels, human actions and Think/Say/Do/Feel layers distinct. | Estève: “A + Check all the gradient boundaries in the photos under the sitemap … smooth gradients to black or the dark blues on all pages”; 2026-10-06; DEC-AIL-070 |
| AI-LIT-REQ-068 | Implementation direction approved; local search/learning candidate; human review and public measurement open | Improve organic discovery of the five existing AI coaching pages and the next learning-tool batch through useful visible copy, initial HTML, matching titles/descriptions, factual organization/service data, canonical/language links and descriptive links to existing YouTube videos. Prepare channel-ready video titles/descriptions/scripts from approved offer facts. Treat Google/YouTube/agentic-search visibility as an outcome to measure after publication; do not invent rankings, search volume, transcripts, upload dates, certificates, ratings or coaching prices. Preserve tools, source media, providers, consent and crawler policy. | Estève: “go next and make sure we do the SEO / GEO work on the new pages … organic findability via YouTube, Google and agentic search for AI literacy training”; 2026-10-06; DEC-AIL-071 |

| AI-LIT-REQ-069 | Review acknowledged; requested local release-preparation fixes | Smooth the shared sitemap footer back to the same black as Cookie choices; show green, readable expansions for H2S/H2H/HAI/A2A across home, Scan, coaching and ACX sections, in both existing languages. Repair the current high/critical dependency findings with a verified build, add the new search/policy tests to CI, and align retained Flow-result and role/privacy copy with reflection limits and actual recipient/provider handling. Preserve ratings, scoring, submission behavior, media, prices and service inclusions. The owner reports reviewing the prior candidate; this does not certify legal/provider facts or authorize commit, push, merge, publication or channel edits. | Estève: “i have reviewed, tackle the things you found” plus footer-gradient/acronym requests; 2026-10-06; DEC-AIL-072 |

**Maeva quotation update, 2026-10-06 (DEC-AIL-069):** The owner supplies her full French message and requests a closer EN/FR rendering. Restore her training recommendation, Estève’s quick understanding/adaptation to her needs, practical/supportive teaching, increased autonomy/efficiency/mental clarity and thanks. French preserves her wording with spelling, accent and punctuation corrections; English is labelled as a translation. Use three readable paragraphs. This refines REQ-065’s quote-preservation instruction through an explicit source-based update; her portrait, attribution and position before the three coaches stay in place. English wording/visual review and existing publication gates remain separate.

**Audience priority approved on 2026-09-30:** independent professionals lead the
message; teams, entrepreneurs and intrapreneurs remain supported audiences.
Learners and those organising or funding their training may be different people.
This audience decision does not select separate pages or prices. Subsequent
service, coach, training-format, placement and pedagogy decisions are recorded
in DEC-AIL-008 through DEC-AIL-021. Main navigation and homepage section order
are approved; detailed page content, remaining footer links and the full visitor
journey remain open.

Source reference personas include engineering/team, legal and documentary/video
professions. Named examples and client commercial terms remain in the restricted
source. Their inclusion is product-learning evidence, not permission to publish
names, testimonials, outcomes, case studies or training materials.

### Offer and launch decisions still needed

| ID | Decision needed | Status / owner |
| --- | --- | --- |
| AI-LIT-TBD-001 | Independent-professional priority and five English coaching hypotheses/copy approved. Search vocabulary validation and priority geography remain open. These choices do not establish demand or a winning niche. | Partly resolved by DEC-AIL-007/038/041; remaining choices — Estève |
| AI-LIT-TBD-002 | Discovery workshop scope and package are approved under AI-LIT-REQ-020/023. Workshop pricing and conditional VAT wording are approved. Call lengths, delivery mode, exact exercises and any travel/venue terms remain open. Four-day coaching journey capacity is 1–5, including solo participation, under DEC-AIL-027. Hours, schedule, price and delivery logistics remain open. | Partly resolved by DEC-AIL-010/013/018/019 — Estève |
| AI-LIT-TBD-003 | Discuss your training needs links to Estève's approved Calendly discovery event in AI-LIT-REQ-021. Public page and host verified; optional Fathom recording requires explicit agreement before starting. Manual event-copy update, slot availability and complete booking-path verification remain open. | Action, owner and URL approved in DEC-AIL-014; recording choice approved in DEC-AIL-015 — Estève |
| AI-LIT-TBD-004 | Five new coaching pages launch English first together; French follows in a later reviewed batch. Existing homepage/Scan refinements remain bilingual. French preparation for other retained pages and its release schedule remain open. | DEC-AIL-018/029/038/040 — Estève |
| AI-LIT-TBD-005 | Satellite Scan supports the journey and is the base for retained bootcamp/coaching services. Public materials/access and whether the general AI course requires a Scan remain open. | Partly resolved by DEC-AIL-008/009 — Estève |
| AI-LIT-TBD-006 | Main menu approved: AI Literacy Training, Our Approach, About; Calendly CTA and logo-to-Home link. Conflict Bootcamp and Coaching Journeys remain under More ways to work with us in the footer. The refreshed homepage order is hero, ACX, five starting points, human-centred method and supporting-tool links, Maeva’s evidence, three coaches, two learning formats, then practical questions and CTA. Remaining footer details remain open. | Main navigation DEC-AIL-016; prior homepage DEC-AIL-017; revised hierarchy DEC-AIL-047/050 — Estève |
| AI-LIT-TBD-007 | Preserve React/Vite/Express by default; any technical restructuring needs separate approval. Current GitHub `main` commit `ef0199a2084ea090355e831a314ca25505370262` is selected as the local refresh baseline in `codex/website-refresh-anu`; production equivalence is not required for local visual drafting. | Stack-preservation boundary DEC-AIL-008; local review boundary DEC-AIL-046 |
| AI-LIT-TBD-008 | Replit deployment evidence is outside the current refresh phase. The owner reports a GitHub sync and Replit republication during the preceding weekend; no present task depends on independent deployment verification. | Deferred by current user instruction, 2026-10-05; DEC-AIL-046 |
| AI-LIT-TBD-009 | Three-month GA4 page comparison requested. Verify existing tag/consent behaviour; exact events, attribution, report criteria and collection settings remain proposed. SEO, performance and accessibility thresholds remain open. | Objective selected in DEC-AIL-039; detailed acceptance below is proposed — Estève |
| AI-LIT-TBD-010 | ACX-first, English hero Option D, responsive four-card homepage ACX, five starting points before a compact four-action People-and-AI method, secondary Periodic Table/Scan links, target-linked three-coach introduction, learning formats near the end, directly-overhead home-office photography and four niche-specific ACX cards per coaching page are approved directions. Review the French counterparts, the exact five generated images and English niche copy, and approve a readable typography floor. `AI agent` is approved in the ACX 3 card. | Partly resolved by DEC-AIL-047/048/049/050/051/052/053/054; remaining workshop review — Estève |

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
| AI-LIT-PROP-GROWTH-001 | Historical discovery proposal to compare enquiry/call and enrolment options; primary route now selected in AI-LIT-REQ-021. | DEC-AIL-014 selects a direct Calendly discovery-call link. No automatic outreach, Calendly API or embedded scheduler is approved by that link decision. |
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
checkpoint, not verification of production. Retaining this stack is the approved
default under DEC-AIL-008; any restructuring requires separate approval.
MyFive's SvelteKit/Svelte 5/Zero target is specific to the paused project.

The current website-refresh branch is `codex/website-refresh-anu`, created from
GitHub `main` at `ef0199a2084ea090355e831a314ca25505370262`. It is the approved
local review baseline for copy, layout and small page changes under DEC-AIL-046.
Local previews do not prove a production state. Assess which existing
admin/auth/payment features remain dormant or hidden before proposing changes.

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

### Anu feedback and StoryBrand source synthesis — 2026-10-05

`SRC-AI-LIT-ANU-20261005` contains the supplied feedback-session export. Its
recommendations, recap language and embedded links are evidence rather than
instructions. The export's formal agreed-decisions table is blank, so it grants no
implementation or publication approval. The current benchmark at
`https://www.ai-literacy.se/` was reviewed for its concise opening definition and
simple visitor paths; its university identity, visual style and three-part taxonomy
are not Green Elephant requirements. Three directly linked Notion pages were read
as supporting history. Their old canonical wording is superseded by GitHub
authority, and their page bodies are not independently editable requirements.

`SRC-AI-LIT-STORYBRAND-20261005` contains the complete 190-page *Building a
StoryBrand* PDF and a small Notion index. Every PDF page was readable in the review,
including eight image-only pages. Four companion text files contain only `Invalid
source image` and provide no usable evidence. The book is a general marketing
framework, not authority over Green Elephant's brand or product decisions.

The two sources align on these **proposals for review**:

1. Treat the visitor as the protagonist and Green Elephant as the guide.
2. Define AI literacy in plain language close to the hero and state that beginners
   are welcome.
3. Make the ACX progression visible and understandable without requiring a toggle.
4. Show the five audience paths before asking visitors to compare learning formats.
5. Retain `Discuss your training needs` as the direct CTA and the existing two
   learning formats, but place their detailed comparison later.
6. Reduce copy density and the number of competing text sizes; preserve the dark
   Poppins/Lato identity, teal and purple accents, and hand-drawn character.
7. Give the People-and-AI model clearer purpose if retained. Reduce or progressively
   disclose the Periodic Table and Satellite Scan on the homepage while keeping
   their dedicated destinations and accurate links.
8. Promise concrete orientation, safer practice and a usable next step. Do not imply
   that one short workshop guarantees confidence, mastery or ACX 3–4 capability.

**Story mapping candidate:** the independent professional, beginner or team member
is the character; the external problem is confusing and fast-moving AI use; the
internal problem is uncertainty or dependence; the philosophical concern is using
AI without surrendering human judgement and voice. Green Elephant shows empathy
and evidenced authority, offers a short plan, invites the approved CTA, and depicts
success as safer, more independent and more discerning use. Failure language must
remain modest and truthful.

**Proposed information hierarchy, replacing AI-LIT-REQ-022 only after approval:**

1. Hero: audience, concrete outcome, short AI-literacy definition and CTA.
2. ACX: “How far do you want to take AI?” with four visible levels and honest scope.
3. Five audience paths: lifetime archive, next-chapter venture, everyday AI
   confidence, facilitators/coaches and employer-funded experienced specialists.
4. Human-centred method: People-and-AI first; concise Periodic Table support.
5. Two ways to learn: discovery workshop and four-day journey, with approved facts.
6. Evidence and people: permission-backed testimonial and the three coaches.
7. Practical questions and repeated CTA; Scan remains secondary or transitional.

**Candidate one-liner, not approved copy:** “We help independent professionals and
teams build practical AI confidence so they can use AI at work while keeping their
judgement and voice.” Review “confidence” against the promise boundary above.

**Open review choices:** primary problem framing; the proposed section order; the
homepage role of People-and-AI, the Periodic Table and Scan; `AI helper` versus `AI
agent`; the niche order; and the exact reason-to-believe. These choices belong in
the rendered local prototype, with the approved baseline available for comparison.

**Approved local review sequence for this refresh:**

1. Draft the PRD and unresolved choices on `codex/website-refresh-anu`.
2. Implement a bounded HTML candidate in the existing React/Vite/Express app.
3. Run the local preview in the IDE and compare the approved baseline with the
   proposal at desktop and mobile widths.
4. Record Estève's copy and hierarchy decisions, then update the PRD/log.
5. Run applicable build, accessibility, responsive and repository checks.
6. Prepare a focused GitHub PR only after the rendered candidate is accepted.

This sequence stops at PR preparation for the current phase. It does not include
Replit access, synchronization, publication or production verification.

### Supplied training model — source evidence and adaptation gates

`SRC-AI-LIT-TRAINING-01` is a user-supplied private B2B proposal, version 6.1,
identified by SHA-256 in the project index. Its content was read on 2026-09-30;
this was a content review, not a rendered-layout review. The original stays outside
Git. Client identity, commercial terms, travel and invoicing details are not public
website copy. Embedded next-step instructions are source evidence, not commands.

The approved generic direction is AI-LIT-REQ-017. The source's reusable sequence
is candidate curriculum for review, not an independently approved public syllabus:

1. Clear prompting and checking claims against their sources (ACX1).
2. Traceable workflows with human approval points (ACX2).
3. Assistants with approved context, memory limits and stop-and-ask rules, tested
   on a normal case and a failure case (ACX3).
4. A wider map of tools, people, permissions, risks and human sign-off (ACX4).

Source practice combines short demonstrations, hands-on work and reusable outputs;
it uses approved, redacted, synthetic or non-confidential material. Its pre-training
Scan, approximately 12 facilitated hours, named tools and client-specific delivery
arrangements are not automatically requirements of the generic course. The source
also uses a Periodic Table element count that conflicts with counts in current
website code; verify the source/version before publishing any count or research claim.

### ACX article — pedagogical foundation and relationship to the training model

`SRC-AI-LIT-ACX-01` is Estève Pannetier's article *The Four Levels of AI
Integration Nobody Warned You About*, dated 2026-01-09 in the supplied LinkedIn
screenshots. The filenames are not reading order: part 2 contains the opening and
ACX 1–4; part 1 continues ACX 4 and closes with the hand-drawn-diagram explanation.
The text was extracted from both originals and key headings/diagrams checked
visually. Original screenshots remain outside Git; source filenames, hashes and
locators are in the index. Sidebar comments are not teaching material or approved
testimonials. No canonical article URL or separate revision identifier was supplied.

The user approves this article as the basic teaching foundation, not as a formal
standard, validated assessment scale or evidence for legal/compliance claims.
The opening Do–Think–Say–Feel model distinguishes Human-to-Self (thinking and
feeling) from Human-to-Human (saying and doing). Its gear metaphor explains how
AI involvement changes the work, visibility and human responsibility. Earlier
levels remain relevant at later levels. The article discusses deletion, distortion
and generalisation as a lens on information filtering; this record attributes that
framing to the author and does not independently validate its scientific claims.

| Source level | Article framing (source context) | Client-proposal teaching adaptation |
| --- | --- | --- |
| ACX 1 | Personal AI chats; close human control and responsibility | Clear prompting and source checking |
| ACX 2 | Builders/workflows connect people, tools and information; handoffs need documentation and ownership | Traceable workflow and a human approval point |
| ACX 3 | Agents participate in work; humans set goals, coordinate and retain decision rights; observed activity does not reveal private thought or feeling | A bounded assistant with approved context, limits and normal/failure tests |
| ACX 4 | The article frames an interconnected AI environment with oversight and accountable owners. Current teaching scope is corrected to work across team members within an organisation under DEC-AIL-013. | Map tools, people, permissions, risks and human sign-off |

The proposal's exercises introduce these ideas; they are not proof that a learner
or organisation operates at the corresponding ACX level. Four training days do not
establish ACX 4 operational readiness. DEC-AIL-013 corrects the current teaching
scope of ACX 4 to **AI-supported work across team members within an organisation**,
not operation of organisation-wide AI infrastructure. This current user correction
governs the website and course descriptions; the original article remains unchanged.

### Approved delivery depth by format

| Format | Approved learning scope | Promise boundary |
| --- | --- | --- |
| Discovery workshop | Map the different ACX levels; practical takeaways at ACX 1 and 2 only | Mapping ACX 3–4 does not promise practical/guided delivery at those levels or the four-day programme |
| Four-day, part-time journey | Strong hands-on practice at ACX 1–2; guided ACX 3 work; ACX 4 overview | Covers the ACX 1–4 learning programme at these distinct depths; does not promise mastery or operational readiness at every level |

Approved by Estève on 2026-10-01 in DEC-AIL-013. Keep these scopes distinct in
offer cards, page descriptions and enquiry copy. Exact exercises, completion
outcomes, journey hours and delivery logistics remain open. DEC-AIL-018 approves
the discovery workshop package below; DEC-AIL-019 approves its surcharge and
conditional VAT wording. The four-day journey price remains open. The connection between the Periodic Table's white Think
& Understand layer and each exercise remains a curriculum-design task.

### Approved discovery workshop package

Approved by Estève on 2026-10-01 in DEC-AIL-018/019:

- **Duration:** 3.5 hours, including a break.
- **Group:** 6–12 participants; maximum 16. Each additional participant 13–16
  costs EUR 100 excluding applicable VAT; 16 participants cost EUR 2,800 before VAT.
- **Base price:** EUR 2,400 excluding applicable VAT, for up to 12 participants.
- **Included:** participant materials, a preparation call and a follow-up call
  with the team lead. No call duration or specific material format is yet promised.
- **Learning boundary:** map ACX levels; practical takeaways at ACX 1–2 only.
- **Website release:** English first; French follows later.

The handoff's EUR 100 surcharge is now explicitly approved in DEC-AIL-019. Its
readiness poll and 30-minute preparation/follow-up durations are not included by
inference. Delivery mode and travel/venue terms remain open.

**VAT copy — approved conditional wording in DEC-AIL-019:**

> Prices exclude VAT. VAT is added where applicable. Eligible cross-border EU
> business purchases are subject to reverse charge. We confirm the VAT treatment
> using your billing details and the service supplied.

Estève requested an EU B2B VAT note. The requested blanket statement that all
European B2B sales need no VAT is not adopted: reverse charge has conditions and
exceptions and is not a VAT exemption. [Your Europe guidance](https://europa.eu/youreurope/business/finance-and-tax/vat/cross-border-vat/index_en.htm)
and [Finnish Tax Administration guidance, section 7.7.2](https://www.vero.fi/en/detailed-guidance/guidance/48679/value-added-taxation-of-cross-border-supply-and-acquisition-of-services/)
were checked on 2026-10-01. The latter distinguishes training services from
admission to educational events. Estève approves the conditional wording and
applicable-treatment approach in DEC-AIL-019. This closes the copy decision; it
does not establish a blanket exemption or verify any particular customer invoice.

### Training-page copy — approved

Drafting authorised in DEC-AIL-019; copy approved by Estève on 2026-10-01 in
DEC-AIL-020. The corresponding workshop-chat copy is the approved public wording
below. It is not yet implemented. Maeva stays on the homepage; her image and
remaining publication details are tracked separately below.

**AI literacy for work, with human judgement at the centre**

Build confidence using AI while staying in charge of your thinking, communication
and decisions. For independent professionals, entrepreneurs and people working
within teams and organisations.

**Start with a discovery workshop**

In 3.5 hours, including a break, explore the four ACX levels of working with AI
and practise at levels 1 and 2: conversations with AI and connected workflows.
Leave with practical takeaways you can apply to your work.

For **6–12 participants**, with a maximum of 16. **€2,400**, plus €100 for each
participant above 12. Prices exclude applicable VAT.

Includes participant materials, a preparation call and a follow-up call with
the team lead.

**Go further with a four-day coaching journey**

For 1–5 people, including solo participation. A part-time, hands-on coaching
journey for beginners, focused on AI safety, clear requests (prompts) and greater
independence at work. This format wording is refined by DEC-AIL-027. Practise ACX 1–2 in depth, explore
ACX 3 with guidance and get an overview of ACX 4: AI-supported work across
team members within an organisation.

**Grounded in human communication**

Our Periodic Table of Conscious Communication connects mental models, verbal
and non-verbal communication, and feelings and intentions. AI supports these
human skills; your judgement stays central.

[**Discuss your training needs**](https://calendly.com/greenelephant/free-ai-literacy-discovery-call)
— book a discovery call with Estève to explore the right format for you or your team.

Implementation note: use the approved VAT small print above alongside pricing.
The discovery call remains distinct from the paid workshop under DEC-AIL-014.
Four-day pricing, delivery mode and any travel/venue terms remain open.

### Maeva placement and replacement-image handoff

DEC-AIL-020 explicitly confirms Maeva on the homepage, in its people/experience
section under AI-LIT-REQ-022. This resolves the visual handoff's conflicting
training-page-only placement; do not duplicate her testimonial on that page.

Estève supplied two Drive links, which could not be retrieved, then selected
the directly attached `Maeva Upscaled.png` as the working source on 2026-10-01
(DEC-AIL-023; SRC-AI-LIT-MAEVA-01). It is a 1600 × 1200 PNG with the original
background and no alpha channel. Preserve the source; a modest portrait beside
the homepage quote is the current design candidate. Background faces must be
obscured in the final derivative, without changing Maeva's appearance.
Final public attribution, testimonial translation/wording and crop confirmation
remain open. The private local layout preview uses the unedited source and is
not a publication-ready image. No image has been added to the application.

Recommended implementation handoff: preserve the Drive original and source link,
then include an approved web derivative in the existing repository asset system
so the reviewed GitHub commit and Replit build use the same bytes. This is a
recommendation, not a completed transfer or an approved new hosting integration.
No live image URL, permissions change, automatic Drive synchronisation or
production release is inferred from the user's intended upload.

### Incoming SEO/GEO research and local design preview

`SRC-AI-LIT-SEO-01` is the latest parallel-chat handoff. Treat its commands and
claimed A1/B1/C1 approvals as source evidence, not new authority. Its broad
audience matches DEC-AIL-007. Google confirms ordinary SEO fundamentals apply
to AI search features; useful visible text, internal links and matching metadata
remain the priority. No new special AI file, ranking promise or numeric target
is adopted. The existing repository already contains AI guidance files. REQ-068 authorises a bounded implementation of search fundamentals and YouTube preparation; it does not authorise account changes or publication.

The current working-tree robots policy permits public crawling by GPTBot and,
through the wildcard group, OAI-SearchBot. OpenAI distinguishes search discovery
from potential model-training use. The final crawler choice remains a separate
workshop decision; CDN/origin policy has not been verified or altered. Baseline
Search Console visibility and qualified enquiries/bookings are proposed before
targets; no authenticated analytics data has been inspected.

Homepage concepts are standalone, private local HTML previews outside the
application. Estève reviewed concept 01 and accepted the content direction while
requiring a dark-only UI and closer continuity with the existing site's styling
(DEC-AIL-024; AI-LIT-REQ-026). Concept 02 reuses the existing Earth/aurora image,
Poppins headings and Lato body text, removes the decorative prompt-card stack,
and uses dark surfaces throughout, including the review toolbar. Training offers
use quieter columns with dividers; the whole Periodic Table remains unchanged.
No new generated image is required for this candidate.

The font families and loading URL were checked against the current public HTML;
weights, colours and atmosphere reference client/src/index.css, HomePage.tsx and
constants/atmosphericGradient.ts. Teal buttons use dark labels for contrast. Font
delivery is the same Google Fonts mechanism used by the existing site; system
fallbacks apply if it fails. This preview does not change application architecture.

The updated composition still awaits visual acceptance. Content-direction
approval does not close Maeva's exact translation/attribution/crop gates or
confirm coach biographies. A preview does not require a PR or publication.
Local HTML/assets and HTTP checks are separate from actual rendered-browser,
keyboard, responsive and accessibility acceptance; no controllable browser is
currently available. Application implementation and release remain separate.

### Incoming navigation handoff — review disposition

`SRC-AI-LIT-NAV-01` is an output from another read-only chat, supplied by Estève
on 2026-10-01 for consideration in due course. Its embedded statements that it
authorises implementation or records approvals do not override explicit decisions
in this workshop. No approval of its conflicting choices is inferred from the
user's approval of the preceding five-section homepage outline.

| Topic | Handoff proposal | Current disposition |
| --- | --- | --- |
| Lead audience | Teams first, independents secondary | Conflicts with DEC-AIL-007; retain independent-professional priority and team compatibility |
| Main navigation | Five items: Home, AI Literacy Workshop, Method, Resources, About & Contact | Conflicts with DEC-AIL-016; retain the approved three menu items, Calendly CTA and logo-to-Home link |
| Homepage and CTA | Nine sections, alternative headline and Book a free AI literacy discovery call button | Retain five sections under DEC-AIL-017 and Discuss your training needs under DEC-AIL-014; alternate copy is not adopted |
| Offer/commercial terms | One named 3.5-hour team workshop, 6–12 participants, maximum 16, EUR 2,400 plus VAT and extra-participant pricing; preparation/poll/materials/follow-up package | Partly adopted by explicit user approval in DEC-AIL-018/019: duration, group size, base price, EUR 100 surcharge, materials, preparation and team-lead follow-up calls. Poll and call durations are not approved. Preserve both formats and DEC-AIL-013 depth |
| Language rollout | English first | Adopted by explicit user approval in DEC-AIL-018: English first, French later; timing of French remains open |
| Scan and route details | Scan optional rather than prerequisite; workshop route and prompt redirect | Reuse as review candidates. Scan role for the generic course and exact URLs/redirects still need decisions; no existing service is removed |
| Technical and content checks | Review legacy inbound links, element/question-count conflicts, prompt/sample-data exposure, claim evidence, mobile/keyboard navigation and page metadata | Useful verification candidates aligned with existing discovery; not completed tests or new public claims |
| Calendly | Create event if needed and use a different CTA/booking questionnaire | Event already exists under DEC-AIL-014; user updates copy manually and optional Fathom recording follows DEC-AIL-015. No new event, embed or questionnaire adopted |

The handoff alone does not authorise decisions. DEC-AIL-018 subsequently selects
the workshop package and publication language through explicit user approval;
new architecture and implementation scope are not authorised by the attachment. The original remains outside Git and is identified by its
hash and source locator in the existing project index. Its external legal reference
has not been assessed here and does not establish compliance.

### Footer sitemap coverage

DEC-AIL-025 closes the retained-footer-link coverage requirement. The private
concept 03 footer groups links under Explore, Tools & resources, Satellite Scan,
More ways to work with us, Connect, and Policies. Social/email and existing
Portal/Admin login entries remain available below. All existing non-parked
Footer.tsx destinations are retained, alongside active public pages that were
missing from that footer (including Signals, Virtual Assistants and Retreats).
The EU data-protection destination is an informational link; its old compliance
claim is not adopted as verified evidence.

Existing Programs, Connect and Resources fragments are checked against section
IDs in their page sources. Preview menu items use local section anchors until
new page routes are agreed; retained-page links open the existing public website.
These links do not assert that the older destination copy is already redesigned.

The search-engine XML sitemap already retained the four policy pages. The audit
found the existing public, indexable /signals route missing; it is added locally
without inventing a lastmod date. All 20 XML destinations are represented in the
preview footer (Home uses its local preview link). Original parked-page exclusions
and private-route exclusions remain. Route/fragment coverage and XML validation
are separate from browser navigation and authenticated account-flow verification.

### Beginner navigation review — 2026-10-06

**Status:** AI-LIT-REQ-061 footer addition and French editorial review implemented
in the working tree. Footer labels/grouping and French project-card links have
since been selected and implemented under REQ-062 / DEC-AIL-063. Header changes,
breadcrumbs and the three-part learning signpost remain proposals.
This is a source/UI-based critique, not a usability study or measured comprehension
score. Source baseline: `ef0199a2084ea090355e831a314ca25505370262` plus local edits.

- [x] Five coaching links in a separate always-open group before the existing
  directory: “Learn AI through your own project” / “Apprendre l’IA à partir de
  votre projet”. Reuse homepage titles and audiences; use book, lightbulb,
  conversation, people and briefcase outline icons with text, never icons alone.
- [x] French links state “Page en anglais”; no invented French niche routes.
  Use `hreflang` for destination language, not `lang="en"` on French labels.
- [x] Review French homepage, Scan shell, restored sections and FAQ wording.
  Prefer “Relier les étapes” over “Flux de travail”; define an agent through its
  tasks; explain prompts as examples of requests. Simplify awkward translations
  and keep the Scan delivery timing tied to questionnaire completion. Offer,
  safety, testimonial, price and refund terms are not redefined.
- [ ] Owner accepts the revised French wording and footer presentation.

**Critique:** the training-first header is short and the five examples provide
recognisable entry points. The footer still asks a newcomer to distinguish brand
names, tools, paid services, audience pages and two similarly named interview
coaching links. “Four ACX levels”, “four human actions”, “five starting points”
and “two learning formats” are different dimensions, not a sequence of courses.
At this review checkpoint, the French homepage's five cards were non-clickable
while the footer provided labelled English links. REQ-062 resolves this gap with
five photographic links carrying an explicit English-page notice.

| Beginner question / observed friction | Proposed improvement — keep every destination | UI treatment |
| --- | --- | --- |
| Where should I start? “Explore” and “AI Literacy Training” require interpretation. | Rename Explore → Start here; main training label → Learn AI / Apprendre l’IA. Add a direct “Choose your project” anchor to the five paths. | Compass/book icon with text; visibly separated introductory group; preserve current section destinations. |
| Are five paths five different courses? How do they relate to ACX? | Add “Choose a project. Practise at your ACX level. Pick a learning format.” Make clear that the five paths are examples for the coaching journey, not prerequisites or five extra offers. | Three short labelled steps; retain purple only for ACX progression and teal for actions. No extra carousel or hidden detail. |
| Is Satellite Scan an AI skill test or a technical scanner? | Label it “Understand your communication — Satellite Scan” / “Mieux comprendre votre communication — Satellite Scan”. Describe it as optional personal reflection with a coach-prepared dashboard, not an AI proficiency test. | Separate group with a compass icon; show the existing price and English-questionnaire notice close to entry links. No new guarantee. |
| What do the resource names mean? | Use purpose + brand: “Explore communication skills — Periodic Table”; “Reflect on a situation — Flow Check”; “Recognise communication patterns — Signals”; “Explore speech examples — Speech Lab”; “Example requests for AI — Prompt Library”. | One short descriptor per link, icons as supporting cues. Add Free/Paid or time badges only where verified. |
| Why two interview links and several kinds of coaching? | Keep both routes but label their role: “Interview programme details” for /programs#interview-coaching and “Interview coaching page” for /interview-coaching. Group retained non-AI services under “Communication coaching & other services”. | Group spacing and descriptive link titles, not deletion or accordions. Preserve all existing service routes. |
| Where will this link take me, and in which language? | Make the French five-path cards link to their existing English pages with “Page en anglais”, matching the footer. Add top breadcrumbs on niche pages; retain their existing bottom “Explore the other coaching journeys” link. | Visible destination-language text; consistent title/icon across card, footer and niche breadcrumb; no automatic language redirect. |

Suggested next batch: the descriptive footer labels, group headings and spacing
first; then header anchors/breadcrumbs and the French path-card consistency repair.
Keep all retained links expanded on mobile, raise remaining 14–15px footer labels
to 16px, use generous touch targets and clear keyboard focus. Costs: a longer
footer and more scrolling, but less guessing. Avoid adding icons to every legal
or account link. Keep account access and policies distinct from learning choices.

**Suggested validation before acceptance:** ask a real beginner to find (1) a
first AI task, (2) the two training formats, (3) what Scan provides and costs,
(4) an example prompt, and (5) a French/English destination. Ask what they expect
before clicking; record confusion rather than inventing a comprehension score.

<a id="ai-lit-sitewide-alignment-20261006"></a>
### Sitewide alignment workshop — 2026-10-06

**Evidence/status:** working-tree inventory at base
`ef0199a2084ea090355e831a314ca25505370262`; direction approved under
AI-LIT-REQ-064 / DEC-AIL-065, with service-preservation Option A approved in
DEC-AIL-066. This is a route/source-code triage, not a completed
visual, content, security or legal audit of every page. No page code changed in
this checkpoint. The footer has 43 links in each language and 27 distinct local
destinations per language after removing fragments; external destinations are
not pages we can rewrite. The ACX article is included as a linked learning page.

#### Coverage and proposed batch order

| Batch | Complete route coverage | Current position / next work |
| --- | --- | --- |
| 1 — Trust and policy foundation | `/ai-policy`, `/privacy`, `/terms`, `/cookies` | EN/FR copy and shared layout implemented as a local candidate. Full details, contents links, Poppins/Lato 18px/16px, reciprocal language routes/metadata, sitemap and French cookie-choice presentation prepared. Targeted checks pass; legal seller/controller, retention, active connector coverage, live settings and legal approval remain open. No decorative photography. |
| 2 — Learn and practise | `/periodic-table`, `/flow-check`, `/signals`, `/decode`, `/resources` including `#prompts` | `/signals`, Flow Check and Periodic Table surrounding copy are local candidates. `/decode` and `/resources` now have shared learning introductions, practical tasks, FAQs and initial HTML under REQ-068; exact owner acceptance remains open. Legacy result/prompt content is preserved and may need separate review. Explain who each tool helps, one real task and a next step toward learning. Preserve table artwork, tool mechanics, scoring, outputs, safety notices and anchors. Rewrite surrounding copy, not validated questionnaire items without review. |
| 3 — Personal reflection by role | `/for-executive-assistants`, `/for-ceos`, `/for-virtual-assistants`, `/executive-coaching-assessment` | Pending. Link communication reflection to practical AI use without diagnostic, hiring-screening or guaranteed-result claims; align to current Scan inclusions and separately booked training. |
| 4 — People and supporting services | `/connect` including `#team`, `#references`, `#contact`; `/coaching`; `/programs` including `#ea-coaching`, `#interview-coaching`; `/interview-coaching`; `/retreats` | Implementation pending; Option A approved under DEC-AIL-066. Keep the existing coaching, interview and retreat services. Simplify language and align design; explain how their communication skills support AI literacy without implying AI training is included in every service. Preserve approved prices, scope and deliverables. Flag unsupported existing claims for review rather than treating them as verified promises. No invented testimonials or research claims. |
| 5 — Existing refresh and French completion | `/`, `/fr`, `/scan`, `/fr/scan`, `/ai-coaching/lifetime-archive`, `/ai-coaching/next-chapter-business`, `/ai-coaching/everyday-confidence`, `/ai-coaching/facilitators-and-coaches`, `/ai-coaching/experienced-specialists`; `/blog/acx-levels-ai-literacy` and its `/fr` variant | Existing local refresh retained. EN/FR Scan refinement, aligned checkout descriptions and four-connection examples are local candidates under REQ-066; interpretation/owner review remains open. Regression/copy consistency review still needed; five niche French pages and remaining public French routes are not implemented. Add actual routes/content/metadata and only then update language links. |
| 6 — Entry points and end-to-end checks | `/portal/login`, `/admin/login`, all retained footer destinations and language notices | Review public entry-page typography/instructions only. Preserve authentication/security and do not redesign authenticated portal/admin workflows. Keep external social, booking, email and EU guidance links; check destinations without submitting forms. |

Suggested learning thread, for wording review:
**EN:** Know what you want. Give useful context. Check the answer. Choose what
to share. **FR:** Clarifiez votre objectif. Donnez le contexte utile. Vérifiez
la réponse. Choisissez ce que vous partagez.

#### Definition of done for each page

- [ ] Plain-language purpose and a useful next action; technical terms explained.
- [ ] Short paragraphs, a consistent heading hierarchy and optional deeper detail
  where appropriate. Do not bury rights, risks, prices or consent disclosures.
- [ ] Homepage Poppins/Lato, dark/teal system, purple ACX cues, 18px reading text
  and 16px supporting text; ample space, visible focus and usable touch targets.
- [ ] Soft section/photo transitions at phone and desktop sizes; no text hidden
  behind decoration. Functional diagrams may retain necessary compact labels
  only with an accessible readable equivalent.
- [ ] English/French content, accessible labels, metadata, canonical/hreflang and
  real destinations agree. Untranslated destinations remain explicitly labelled.
- [ ] Existing forms, scoring, consent, payment and login behaviours preserved.
- [ ] Targeted tests, build, mobile/desktop visual review, link checks and owner
  review recorded separately. No claim of grade-level or ADHD validation without
  measurement/user testing. Global TypeScript errors remain a separate gate.

#### Policy triage — not legal clearance

`PrivacyPolicyPage.tsx` names controllers and clinical services, states retention
periods, promises immediate token deletion and says connected Notion data is never
read. These need service-specific verification, not editorial assumptions.
`AIPolicyPage.tsx` still has an “EU AI Act Compliance” heading, a broad risk
classification, claims that all generated material is labelled and checked, and
a human-only processing statement. Validate each before revising or retaining.
AI-generated website illustration disclosure must describe the real asset use;
do not present staged/generated scenes as documentary client photographs.

Required next checks: controller identity/contact; data categories and purposes;
legal bases; actual recipients including coach copies; AI/provider use and data
sent; retention/deletion implementation and practice; transfers and agreements;
rights/contact process; optional recording/analytics; service-specific automated
processing. Code presence alone does not prove live use or provider settings.
Separate coach-prepared dashboards from automated assistance and avoid “no
profiling” as a substitute for explaining automated decisions.

Read on 2026-10-06: the [European Commission's privacy-information guidance](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/obligations_en)
supports plain-language information while retaining purposes, legal bases,
retention and rights. The [Commission's AI-literacy Q&A](https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers)
is a current reference for a separate AI Act review; the course is not to be
marketed as certification or a compliance guarantee. Owner confirmation and
appropriate legal review remain release gates for unresolved policy claims.

#### Batch 1 implementation checkpoint — 2026-10-06

**Local candidate, not policy approval or publication.** All four trust pages now
share authored EN/FR copy and a dark/teal Poppins/Lato reading layout, with a short
summary, contents links and all full-detail sections visible. Real `/fr/privacy`,
`/fr/ai-policy`, `/fr/terms` and `/fr/cookies` routes, initial HTML, metadata,
reciprocal language links and sitemap entries were added. French footer labels
and the existing cookie-panel link/visibility were repaired; tracking payloads,
collection conditions and consent decisions were not changed.

Existing service prices, refund windows and topic coverage are retained. Copy
distinguishes coach preparation from AI assistance, treats a human-only option
as a question rather than a guarantee, removes the blanket AI risk classification
and corrects the outdated claim that EU Replit hosting requires Enterprise.
GDPR response wording and consumer-rights safeguards are draft legal clarifications,
not evidence that operational schedules or contracts have been legally approved.

Verification: 41 content/navigation/analytics/checkout tests and 12 public HTTP tests;
build, repository and whitespace checks pass. Phone-width browser checks at
390px covered all eight pages without horizontal overflow and with 18px Lato
body text; desktop Privacy, AI Policy and Terms were visually sampled. Browser
automation had intermittent timeouts, so an exhaustive desktop visual audit is
not claimed. Full TypeScript still fails in existing examples, PromptsPage,
auth/portal-auth/routes/storage; no diagnostics in Batch 1 files.

Open facts: legal seller/controller and business contact details; per-purpose
legal bases; retention and deletion across database, inboxes, exports, recordings
and backups; enabled AI models, input categories and review practices; provider
agreements/locations; GA account settings; complete live cookie/embed inventory.
Additional Spotify/Oura connection and data-fetch code, Google Sheets/admin
context gathering and database-hosting coverage need owner confirmation before
the notice is called complete. Do not activate, disable or redesign those tools
in this presentation batch. Human factual and legal review remain separate gates.

GreenElephantOS is unaffected by the implementation: no shared payload, actual
processing practice, consent collection rule, contract activation or provider
integration changed. Reopen the paired-repository check if owner verification
requires such a change. Preserve all earlier dirty work and untracked assets.

#### Selective image suggestions — not approved assets

- Reuse accepted overhead photographs first, without suggesting pictured people
  are actual clients or staff. Keep the unchanged Periodic Table and ACX drawings.
- If needed for resources: ceiling-view home desk with a real-looking annotated
  draft, two distinct messy printouts, pale-yellow notes and a near-vertical
  monitor. Show a tangible task rather than another generic office.
- If needed for communication coaching: ceiling-view two-person practice setup
  with notes and space between chairs. Natural age/clothing diversity, no visible
  AI-looking faces; inspect limb counts, hands, chair/table geometry and objects.
- No new image generation now. Review need, rights/provenance, realism and
  responsive compressed crops before approval. Policies/login use icons/space.

### Concept 04 — smooth transitions, plain English and image comparison

DEC-AIL-026 authorises a lighter reading load and smooth black/dark-blue section
transitions in the private full-page preview. Matching gradient endpoints and
full-width section backgrounds replace the hard boundaries around the method,
people and FAQ sections. The Periodic Table keeps its complete, unchanged image
on a black surround; neither its labels nor image edges are edited away.

Candidate homepage copy uses shorter sentences and everyday words. Native
details/summary controls explain the ACX levels, included materials/calls and
VAT, with FAQs initially closed. Prices, group limits and duration remain
visible. ACX means the existing four-level teaching map; no invented acronym
expansion, score or qualification is claimed. Explain prompts as requests and
agents as tools that take several steps towards a goal under human limits and
checks. Preserve practical levels 1–2 only for the short workshop; the four-day
journey retains hands-on 1–2, guided 3 and an overview of 4 across team members.

The approved VAT paragraph and proposed Maeva quotation are unchanged. The
optional plain-English VAT explanation links to the EU's cross-border VAT
guidance, checked on 2026-10-01. These are candidate homepage edits, not a silent
replacement of the approved training-page copy or final quote approval.
Eighth-grade English is an editorial target, not a certified readability result.

Two complete page variants use identical content: the earlier portrait remains
the recommended baseline, while SRC-AI-LIT-MAEVA-02 is shown at its full landscape
ratio in an alternate image trial. The supplied scene's bright setting and
unclear laptop text may distract from the testimonial. The user's description
is retained as source context; authenticity, extent of generation/editing and
permission for this version are not verified. Do not publish it as evidence of
a real training session without resolving those facts. Both originals remain
unchanged outside Git. The previous portrait's background-face obscuring gate
and both images' final attribution/quote/crop gates remain open.

Private comparison uses desktop/mobile controls and a Maeva image selector.
Local structure, assets, footer coverage and gradient endpoints are checked;
actual rendered browser, keyboard and visual acceptance remain open. No
application redesign or production release follows from this preview.

### Concept 05 — distinct offers, connected human skills and coach profiles

DEC-AIL-027 selects the original-background portrait SRC-AI-LIT-MAEVA-01 and
rejects the pool scene SRC-AI-LIT-MAEVA-02 for the homepage. The scene stays in
source history but is no longer offered in the current preview controls. This
closes the image-choice gate, not the final background-face treatment, crop,
quote/translation or attribution gates.

The preview now contrasts a 3.5-hour discovery workshop for 6–16 people with a
four-day, part-time, hands-on coaching journey for 1–5 people. The workshop's
standard 6–12 package, maximum 16 and extra-participant pricing remain intact.
Counts, durations and purpose are visible; a distinct dark coaching panel and
large participant numbers support comparison without arbitrary ACX colours.
The journey includes coaching/feedback on real tasks. Price and detailed hours
are still open, and the four ACX delivery depths remain unchanged.

The human skills section connects thinking to goals/checks, speaking/writing to
clear requests and sharing, feeling/intention to noticing uncertainty and purpose,
and non-verbal skills to tone, pauses and body language in conversations with
people about AI work. A disclosure explains four connections: human-to-self,
human-to-AI, AI-to-AI and human-to-human. The prompt begins with self-reflection;
sending it and reading the answer is human-to-AI communication. These are
connections across the learning levels, not a replacement ACX taxonomy.
The four levels use concrete examples: a checked conversation; connected tools
with checked handoffs; a bounded agent taking several steps; and team members
agreeing roles, sharing and decisions while using AI. No AI feelings or human
body language are attributed to AI tools.

User-approved titles and source-grounded candidate bios:

| Person | Approved title | Candidate short skills text | Existing profile basis |
| --- | --- | --- | --- |
| Estève | AI communication coach | Helps people explain ideas clearly and use AI tools while keeping their own voice. | ConnectPage.tsx coaches entry: growing voice, AI-powered communication tools, collaboration |
| Anu | communication coach and trainer | Helps assistants and other professionals speak with confidence, handle hard conversations and be heard at work. | ConnectPage.tsx coaches entry: support professionals, confidence, difficult conversations, recognition |
| Jonas | conflict coach and trainer | Helps people and teams work through conflict and talk across different backgrounds. | ConnectPage.tsx coaches entry: team conflict resolution and cross-cultural support |

These descriptions do not import old clinical, scientific-validity, experience-year
or outcome claims. The named titles are explicitly approved; the new sentences
are paraphrases prepared in response to the user's request. The user's "then I
think we're good to go" follows requested edits; it does not itself authorise
production release or close the existing testimonial gates.

### Concept 06 — communication icons and the ACX article

DEC-AIL-028 records the requested article and the confirmed Speech Lab visual
reference. The original header in commit `be664cc` uses inherited Lato, 18px,
weight 600 and tight tracking. Concept 06 matches that wordmark treatment; Poppins
remains the heading font. Existing Lucide Brain, MessagesSquare, Network and Users
icons accompany H2S, HAI, A2A and H2H with full visible definitions. They are
communication connections across ACX levels, not replacement levels. A2A is also
a specific Agent2Agent protocol; the broader teaching label does not imply a
protocol implementation. HAI/H2S are the chosen labels, not asserted standards.

The repository-authored draft lives in `shared/acx-article.ts`, rendered by
`client/src/pages/AcxArticlePage.tsx` at `/blog/acx-levels-ai-literacy`. The private
preview uses the same authored body, with local links back to the training section.
The draft adapts the supplied screenshot source, retains the gear progression,
adds practical examples and clearly attributes the original LinkedIn article of
9 January 2026. It applies the later team-member correction to ACX 4. It is not
presented as a verbatim reproduction or an independently validated framework.

The existing Express page handler includes the same static article text and
BlogPosting metadata in initial HTML. The page has a title, description,
canonical URL, author, source citation, section headings and descriptive links.
The draft remains noindex and outside the XML sitemap. No publication date,
ratings, certification, ranking guarantee or special AI search file is invented.
Before release, review the copy, link the final approved training destination,
check desktop/mobile rendering, and explicitly approve publication/indexing.
The current app still has its existing homepage; concept 06 is a private design
preview, not a completed React homepage replacement.

Satellite Scan copy now describes the existing personal dashboard, advanced
communication prompts, coaching videos and worksheets as support for the ACX
journey. Personal reflection and checked chats support levels 1–2; guided helpers
and team handoffs remain learning applications, not newly delivered agent systems.
The draft guide explains that training/coaching are booked separately. Resource
fulfilment/access checks and exact level-tagged material mapping remain open.
No new raster images or graphics generation are required for this pass. The
original selected Maeva portrait and all existing testimonial gates are unchanged.

### Concept 07 — intent, voice, rhythm and French batch 1

DEC-AIL-029 refines the three communication descriptions. The Think/Understand
layer remains unchanged. Revised English candidate wording:

- **Say & write:** Give AI clear instructions. Check its drafts for meaning and
  tone, so your words still sound like you and respect the reader.
- **Feel & intend:** Conscious communication means conscious prompting. Notice
  what you feel and make your intent clear in each exchange with AI.
- **Non-verbal communication:** Use AI to plan timing, pace and pauses. Choose
  when to speak, wait or follow up, so the rhythm stays human.

The article expands timing/rhythm with one practical paragraph. Its opening gently
attributes ACX to the AI and communication research Estève has been doing with
Arbora and links to https://www.arbora.partners/research. This origin is supplied
by the author in the current conversation. The public URL returned HTTP 200 on
2026-10-01; its JavaScript-rendered research body was not independently reviewed.
The copy does not claim external validation, certification or influence percentages,
or import internal Arbora evidence or product permissions into Green Elephant.

**French batch 1:** complete homepage and article copy are available in private
previews, with English/French switches, translated headings, questions, labels,
alt text and footer navigation. The source artwork remains unchanged and its
English labels are explicitly noted in French. Maeva’s French excerpt uses her
supplied original words; final excerpt, attribution and image gates remain open.
The homepage translation draft is `client/src/content/ai-literacy/homepage.fr.json`;
the article draft is `shared/acx-article-fr.ts`. These are editorial assets, not
another PRD/log or a new translation framework. The French article is not yet a
public application route. Both private French previews are noindex.

Remaining batches and visible checkpoints:

1. Review English refinements and French homepage/article copy and layout.
2. Integrate the approved homepage and bilingual header/footer into the existing
   React application. Add stable language URLs, document language and matching
   canonical/alternate-language metadata together; do not link nonexistent routes.
3. Translate retained training, Scan and service pages, then resources/tools and
   coach/contact pages. Preserve forms, offers and original-source labels.
4. Translate policies faithfully for separate wording review; do not silently
   change their substance or imply new legal approval.
5. Check language switching, remaining English, links, forms and mobile layouts;
   add only approved public translations to the sitemap after publication approval.

Retained-page coverage inventory (current routes, not invented French URLs):

| Batch | Pages | Current status |
| --- | --- | --- |
| Homepage and article | `/`, `/blog/acx-levels-ai-literacy` | Full French private drafts prepared; app-wide French routing not implemented |
| Offers and services | `/scan`, `/coaching`, `/programs`, `/for-executive-assistants`, `/for-ceos`, `/for-virtual-assistants`, `/executive-coaching-assessment`, `/interview-coaching`, `/retreats` | French pending |
| Tools, resources and people | `/flow-check`, `/periodic-table`, `/decode`, `/resources`, `/signals`, `/connect` | French pending; retain original resource/artwork language labels |
| Policies | `/privacy`, `/terms`, `/cookies`, `/ai-policy` | French translation and wording review pending |

Existing aliases should resolve to the corresponding language destination when
bilingual routes are implemented; do not translate each alias into duplicate content.
External booking/resources and private account entry links need clear language
expectations rather than a claim that their destinations have been translated.

Each batch can form a focused PR after its review checkpoint. The current local
French preview explicitly says that links to remaining public pages open English
pages. Calendly remains the approved external destination; no translated booking
event or third-party resource is invented. No sitewide French-completion claim,
software architecture change, GitHub push or production release is implied.

### Concept 08 — article visuals and two review treatments

DEC-AIL-030 records the requested Scan buying link, article flow and research
position. The homepage Scan disclosure and the article now link to `/scan` (the
existing landing page with purchase controls). They do not bypass the landing
page or change checkout, price or payment behaviour. Private previews use the
live absolute URL; French links clearly remain part of the still-English site.

The contents now has two semantic groups: levels 1–4 stay in a single ordered
list, while foundations and practical next steps stay together. On medium screens
the groups form two columns; on narrow screens they stack without interleaving
the level sequence. Open reading sections replace the repeated boxed panels.
The gear origin story is optional so the main argument is easier to follow.

The introduction calls ACX a practical research synthesis derived from Estève’s
AI/communication research with Arbora. It states the human-centred philosophical
position: people choose goals, set limits and can question or stop AI. The author’s
use of meta-analysis is expressed as synthesis in this plain-English guide; no
new claim of a formal statistical meta-analysis, peer review or validated measure
is made. The same explanation is reflected in the French draft.

`SRC-AI-LIT-ACX-VISUALS-01` preserves source paths, SHA-256 hashes and public asset
paths for six unedited author-supplied originals. The Think/Say/Do/Feel colour
hand drawing is the main foundation illustration, surrounded by a dark navy frame,
a thin teal border and a restrained shadow. Full image proportions and marks are
preserved. The simpler connection sketch and level drawings can be enlarged in a
new tab. Alt text, captions and adjacent explanations carry the useful meaning.
English labels remain visible in the originals and are acknowledged in French.

Two review candidates are prepared in both languages:

- **A — Simple + original (recommended, not yet selected):** distinct lightweight
  SVG level visuals with short human-check cues. The corresponding original level
  drawing is in a native disclosure beneath the text. Original foundation drawing
  stays visible. This is the current local app draft, not a production selection.
- **B — Original drawings:** original ACX 1–4 illustrations remain fully visible at
  their sections, using the same dark frames. This fuller visual treatment is a
  private preview alternative; it carries more small-label detail for phone readers.

The supplied tall pencil scroll is useful research background but is not inserted
into the main reading path; its 405px source width and extreme height are poor for
inline reading. The opportunity slide is not used: its survival narrative and dense
text distract from the beginner learning guide. No source images are redrawn,
recoloured, cropped, filtered or replaced by generated bitmap art.

Source diagrams use H2A where the current guide uses HAI, and the historical level
4 artwork includes AI governance/infrastructure. An adjacent source note makes
that difference explicit. The course still concerns team members, and the older
artwork does not expand the approved offer. Visual selection, mobile/browser
acceptance and production image-performance review remain open.

### Concept 09 — version B selected; purple sketch symbols (superseded styling)

DEC-AIL-034 later replaces the icon styling below with clean teal outlines; version B remains selected.

DEC-AIL-031 selects **version B** for English and French: original level drawings
remain fully visible. The prior A/B decision is closed. The separate choice of
purple refinement remains open; it does not reopen the original-image selection.

The canonical brand kit `client/src/constants/brandKit.ts` defines the existing
Dynamics indigo/purple as `#5C4E99`. The older CSS `--dynamics` HSL value differs;
this local icon treatment follows the canonical swatch without changing the
whole site's colour system. Purple serves as a requested shared visual accent,
not a claim that the ACX levels correspond to the Dynamics lens. Near-white text
and a pale-purple backing keep the exact dark-purple ink readable. The computed
ink/backing contrast is about 5:1; rendered accessibility review remains open.

Four SVG motifs are redrawn in code from the supplied drawings: a chat robot,
connected thought clouds, a guided agent/person and connected people in a circle.
The fourth keeps the source's circular/network idea while expressing the approved
team-member scope. These are new interpretations, not exact vector traces or
unaltered author drawings. Original raster diagrams remain byte-for-byte intact.
SVG paths are language-neutral and decorative next to visible numbers and labels.

Two B refinements are available in both article and homepage previews:

- **B1 — Ink badges:** compact purple motifs on pale-purple seals, next to the
  level number and short cue. This is the current local article candidate.
- **B2 — Sketchbook ribbons (recommended, not yet selected):** the same symbols
  with irregular seal edges, purple margin lines and numbered marker tabs. The
  homepage repeats this treatment around the four optional ACX descriptions.

The preview controller switches page, language, treatment and viewport width.
Old version-B preview URLs point to the selected B structure with B1 icons.
No raster artwork is recoloured or replaced. The existing homepage remains a
private design preview, and French app routing remains in the later translation
batch. No imagery-generation service, dependency, software architecture change,
production publication or paused My5 work is involved.

### Concept 10 — Scan learning promise, bilingual checkout and one brand voice

AI-LIT-REQ-035 / DEC-AIL-032: the Scan helps people understand their communication
habits and turn them into instructions, context, tone and checks for AI. It does
not automatically train a model or install an agent. ACX 1 and 2 are the primary
practice use cases; 3 covers agent limits and 4 team-member agreements. Personal
profiles are not shared by default. Training and coaching remain separate.

English Scan hero/ACX content is implemented locally; matching French copy and a
private full review layout are prepared. The original Earth/aurora graphic and
scroll/elevator treatment remain in the app and are restored in both previews.
Legacy Scan detail sections and all existing testimonials remain unchanged.
The full French legacy Scan page, shared header and remaining public pages still
need their translation batches; translated copy previews are not deployed routes.

The Scan checkout is now a bounded bilingual component within the existing
React/Vite/Express app. Its query parameter selects English or French, including
Stripe Elements. No forced Finnish billing address is supplied. Missing Stripe
configuration shows an unavailable state instead of crashing the app. Paid
checkout verifies the server price/currency; partial coupons cannot display a
reduction the endpoint will not apply. Full-Scan vouchers use the existing
server-validated free-purchase path. Payment confirmation reads Stripe status;
a query string alone cannot prove success. No schema, package or deployment change.

Client stories are private third-person drafts based on Estève's descriptions,
not invented quotations or proof of Scan-only results. Four stories and Maeva's
exact French excerpt/draft English translation await subject/excerpt/attribution
approval. None has been added to the app's public testimonial arrays.

AI-LIT-REQ-036 / DEC-AIL-033: one proposed brand voice connects the offers:

| Use | English candidate | French candidate |
| --- | --- | --- |
| Short promise | Human skills. Thoughtful AI. | L’humain d’abord. L’IA avec discernement. |
| Supporting promise | Understand how you work, explore what AI can help with, and stay in charge. | Comprenez votre façon de travailler, explorez ce que l’IA peut vous apporter et gardez la main. |
| Conflict benefit | Use AI to prepare for difficult conversations, clear up misunderstandings and build trust between people. | Utilisez l’IA pour préparer les conversations difficiles, clarifier les malentendus et renforcer la confiance entre les personnes. |
| Footer | Made with love for human growth. AI on your terms. | Créé avec amour pour votre développement. L’IA à votre service. |

The Scan supports self-understanding; workshops introduce practice; coaching and
hands-on training build it around real work. Conflict transformation is a concrete
supporting benefit, not a second competing headline. `shared/brand-voice.ts` holds
the current bilingual candidate. Exact wording still awaits copy review. Avoid
hype, fear, guaranteed outcomes or unverified scientific/compliance badges.

AI-LIT-REQ-037 / DEC-AIL-034 supersedes the sketch-derived purple icon treatment:
Estève rejected the hand-drawn icons and requested the prior clean teal outline
style. Use chat, workflow, agent and people motifs, with visible ACX numbers and
labels. The selected version B keeps all original article drawings visible.
New homepage navigation uses the same thin outline style in both languages.
Old B1/B2 preview URLs remain usable but no longer show the rejected badges.

### Checkout and email verification — bounded current evidence

- Local production build and repository checks pass. The eight isolated public
  HTTP tests and six checkout tests pass. Five email acceptance tests pass.
  TypeScript retains its prior 35 diagnostics; none is in the new Scan components.
- Resend errors now fail the local send result; customer/admin attempts are
  independent. Acceptance IDs are logged without personal payloads. Both original
  message templates remain unchanged. Provider acceptance is not inbox delivery.
- Read-only production coupon validation accepted the supplied test voucher; its
  EUR 100 discount covers the EUR 99.95 Scan. This is an application voucher, and
  the zero-cost path bypasses Stripe card processing and payment webhooks.
- After reviewing the exact customer/admin email previews, Estève approved test
  sends. The first production free-order request returned HTTP 403 with no
  successful purchase ID on 2026-10-01 at 00:46:22 UTC. No retry or second/third
  address was attempted. A subsequent read-only OPTIONS request received
  Cloudflare error 1010 (client-signature blocking); the same cause for the original
  POST is an inference because its body/headers were not retained. Order acceptance and email delivery are unverified.
- Admin/Resend audit findings remain open: a purchase creates blanket consent in
  CRM; newsletter population does not filter purpose-specific permission; an
  onboarding sequence includes a coaching upsell. These need a separate bounded
  consent/marketing repair and runtime template review. No GDPR compliance claim.
- Browser inventory is empty, so rendered browser/mobile acceptance and admin UI
  inspection are unverified. Live Resend delivery access and production sender
  settings are unavailable. No production release or database cleanup occurred.

### Current local review — dark ACX and Scan polish (2026-10-01)

DEC-AIL-035 supersedes the previous teal ACX colour and rejected pale label boxes.
Clean outlines, numbers and level names use the same readable purple tint on dark
surfaces. Blog overview and contents link to each level, with return links below.
English/French homepage and Scan previews reuse that treatment. Original article
artwork is preserved rather than recoloured. The Scan button has a raised surface
without inherited text shadow; its arrow sits below the scroll label. The CSS
scroll track is sharper; the original 1408 × 768 Earth image still limits large-screen sharpness.

The French sales/checkout preview and new bilingual checkout include the explicit
English-only questionnaire/video notice. Full retained-page French routing remains
an unfinished batch; static French previews are not evidence of deployed French pages.

Three result-email templates have isolated EN/FR renderers, selectable escaped text,
full UTF-8 attachments and HTTPS-only dashboard links. Provider acceptance is checked
separately from delivery. Admin results/dashboard actions offer a language choice and
require write access. Typeform completion retains both coach CCs by owner approval
and defaults to English. Participant notice, authenticity/deduplication, upstream
answer completeness, other senders, consent/marketing separation and actual inbox
and dashboard-access checks remain open. Private first-person client drafts use the
approved temporary Miko attribution; they are not published client-confirmed quotes.

Local checks: 26 isolated HTTP/checkout/email tests pass; production build, repository
checks and diff whitespace check pass. Six bilingual preview URLs return HTTP 200;
overview/return anchors resolve. TypeScript retains the same 35 pre-existing errors
(by file/error code). Paused My5 blocks match HEAD. Purple contrast against the four
chosen dark surfaces is 7.91:1 or higher. Browser appearance remains unverified.
No production email sends, merge or deployment.

### Accepted visual review and email verification batch (2026-10-01)

Estève accepts the current dark homepage/blog/Scan treatment (DEC-AIL-036). The
private homepage-first controller offers English/French and desktop/mobile widths;
that width switch is not a real-device test. A separate private email review page
shows completion, raw-response, dashboard and data-export drafts.

Local email changes: a shared Resend send guard rejects returned errors/invalid IDs;
all direct batch/newsletter routes use it. Scan extraction preserves duplicate
questions and other-choice answers. The portal export includes its complete JSON
attachment. Three result messages have explicit coach Reply-To. Tests exercise
actual sender payloads with a fake provider, preserving both coach copies and all
129 synthetic answers. No provider calls, database mutations or background jobs.

Live readiness is still blocked. Dashboard delivery remains a manual coach action.
Typeform authenticity/deduplication, durable delivery, reminder retry/concurrency,
reset-link origin validation, remaining legacy HTML escaping, participant notices,
marketing permission and suppression need separate bounded repairs and validation.
No runtime Resend/Replit credentials or browser connection are available here. The
previous shop 403 remains unresolved; no new live emails have been sent. Changed
outgoing messages require exact review before sending. Design approval is not a
GDPR certification or production release approval.

Local validation for this batch: 42 isolated tests pass, including four actual-sender
payload tests with a fake provider. The final build, repository check and diff check
pass. TypeScript retains the same 35 pre-existing file/error-code diagnostics. Ten
homepage/email review URLs return HTTP 200; preserved My5 blocks remain unchanged.

### Release preparation checkpoint — 2026-10-01

Under DEC-AIL-037, Estève has authorised the website implementation, final checks,
a reviewed pull request and merge to GitHub main. Replit publication remains a
separate human action. His latest message approves Maeva’s portrait crop and
blurred background; the public asset and hash are recorded in the source index.

- **Implemented in the actual app:** approved dark homepage and full illustrated
  ACX guide in English and French; French Scan sales page and checkout/confirmation;
  complete footer links, purple ACX labels, English-only Scan notice and retained
  English service/resource/policy destinations clearly marked `(EN)` in the French
  footer. React/Vite/Express remains the application structure.
- **Still required for the approved full French scope:** retained service, resource,
  tool, coach and policy pages, and remaining legacy email families. The first
  translated batch is not evidence that every retained public page is bilingual.
- **Scan email implementation:** English/French purchase, reminder, submitted-results,
  dashboard-link and data-export templates; full answer text/attachments, selectable
  result blocks instead of unsupported email JavaScript; both approved coaches stay
  copied on the results email. Dashboard-ready sending remains a manual coach action.
- **Safeguards:** checked Resend acceptance, durable send claims, signed Typeform and
  Stripe webhooks, server-validated payments/vouchers, explicit marketing eligibility,
  signed unsubscribe and disabled automatic promotional onboarding/open tracking.
  Provider acceptance is not inbox-delivery evidence.
- **Release gates:** production webhook secrets and Typeform language field, exact
  final email review, authorised free-order/provider/inbox tests, retention/provider
  arrangements and remaining translations. Local tests do not certify GDPR compliance
  or establish a successful production payment or email delivery.
- **Operations:** use the existing deployment runbook and the exact pending-release
  issue. No database copying, migration, live provider send or publication is inferred
  from a passing build. MY5 remains paused and unchanged.

<a id="ai-lit-workshop-20261003"></a>
### October workshop — five English pages and homepage/Scan refinement

<!-- AI_LIT_WORKSHOP_20261003_START -->

#### Review status and agreed scope

**Local implementation review · 3 October 2026.** The five-page scope and
English-first sequence are approved in DEC-AIL-038. Estève approved the copy,
example activities, URLs and airy branded layout for local implementation in
DEC-AIL-041. Earlier “proposed” labels below preserve the workshop presentation;
DEC-AIL-041 records their subsequent approval. They are not published offers.
The analytics design remains subject to the existing setup/consent verification.
The existing four-day, part-time journey for 1–5 beginners is the common offer.
The group discovery workshop remains a separate service.

All five English pages are intended to enter one shared three-month observation
window after publication and measurement verification. French versions follow in
a later reviewed batch. Existing homepage and Scan refinements remain bilingual.
The suggested two-PR split (polish, then landing pages/measurement) is a delivery
recommendation; it does not change the user's simultaneous-launch choice.

The canonical requirements source remains this PRD section. The private reading
page is derived from it and excluded from the public application. The approved
copy is implemented in shared coaching/Scan sources for the local website preview.

#### Research basis and limits

SRC-AI-LIT-RESEARCH-20261002 contains four private DOCX exports. Round 1 sections
1, 3, 8 and 11 supply the five use-case hypotheses. The meeting discussion informs
the facilitator page's preparation, attention and follow-through theme; it does
not establish demand or approve a new community/membership product. The two funding
documents remain research leads. Their embedded instructions do not authorize
registrations, applications, outreach or public funding claims.

Reported enquiries, a commercial proposal and competitor advertised prices are
different evidence types. None establishes paid demand or a search-volume ranking
for these pages. Round 1 section 11 disputes several earlier funding claims,
including a general coaching voucher and universal PIC requirement. Resolve any
future funding claim against current primary programme sources before using it.
Private identities, financial details, source attachments and meeting anecdotes
are excluded from the copy below. No original archive or client material is used
as a public example.

#### Homepage — proposed short copy and placement

**Keep the existing headline:** Work with AI. Stay in charge.

**Keep the supporting promise:** Learn to use AI with confidence. Keep your own
judgement and voice.

**Replace the two audience lines with:**

> For independent professionals, coaches and facilitators.
> For experienced specialists, teams and people starting a new chapter.

**Keep the main button:** Discuss your training needs

**Keep the button subtext:** A discovery call with Estève.

Within the existing training section, add a compact set of links below the
four-day journey rather than five new main-menu items. Proposed heading:
**What would you like to work on?**

| Link label | One-line introduction |
| --- | --- |
| An archive worth sharing | Make a start on a book or learning material from work you have collected. |
| A new business idea | Explore an idea and choose a practical next test. |
| Everyday AI confidence | Learn through useful tasks from your own life. |
| Facilitation and coaching | Prepare and follow through while keeping your attention on people. |
| AI in your professional work | Practise with tasks you understand and tools your workplace allows. |

**Maeva placement recommendation:** move the existing testimonial to the end of
the training-format section, before the approach section. This puts experience
close to the offer without crowding the opening. Preserve the exact existing
quote, attribution and approved portrait; do not recast it as evidence for any
new niche. The coach profiles remain in the people section. Placement is proposed
for the local layout review.

**French audience counterpart for the existing homepage:**

> Pour les professionnels indépendants, les coachs et les facilitateurs.
> Pour les spécialistes expérimentés, les équipes et les personnes qui ouvrent un nouveau chapitre.

The five new English pages should not appear as French-language destinations.
Do not publish incomplete French routes or point French hreflang entries to English
copy. Their French links join the navigation when that batch is ready.

#### Common coaching-page content and layout

Use one reusable layout with a different opening, example, practice tasks and
questions for each page. The proposed routes below are new candidates and do not
replace the retained `/coaching`, assistant or executive pages.

**Page order:** clear headline and introduction; first CTA; who it is for; one
concrete example; what the participant can practise; shared journey information;
two relevant questions; repeated CTA. Keep paragraphs short and give buttons
consistent space above and below. Retain the dark brand, Poppins headings and Lato
body type. The page's most important text must be readable before JavaScript runs.

**Shared journey panel — proposed public copy:**

> Four days. Part-time. Built around a real task.
>
> A coaching journey for 1–5 people, including solo learners. Designed for
> beginners, with time to practise, ask questions and review what AI produces.
> You choose a goal with your coach, try a manageable piece of work and build
> habits you can keep using.
>
> Discuss the project, schedule, delivery format and fee with Estève before booking.

**Shared main CTA:** Discuss your training needs

**Destination:** the existing approved Calendly discovery-call link in
AI-LIT-REQ-021. This proposal does not change the event, embed a scheduler or create
a separate booking system.

**CTA subtext:** Bring one task or idea you would like to explore.

**Shared beginner FAQ:**

**Do I need to know how to use AI already?** The journey is designed for beginners.
We start with your goal and what you already know, then agree a manageable task.

**Editorial note:** exact exercises and takeaways below are draft examples. Agree
delivery feasibility, daily contact hours, price, tool access/costs and location
before final publication. Do not substitute the workshop's EUR 2,400 price. Do not
imply that Satellite Scan is included or required in every journey; that remains
AI-LIT-TBD-005.

#### Page 1 — A lifetime archive

**Proposed route:** `/ai-coaching/lifetime-archive`

**SEO title:** AI Coaching for Archives and Personal Projects | GreenElephant

**Meta description:** Learn to use AI with your notes, interviews or research. Explore an outline and a small sample for a book or learning project, with human coaching.

**Headline:** Turn a lifetime of work into something others can learn from.

**Introduction:** You have notes, interviews, films or research worth sharing.
Learn how AI can help you organise a small part of it and explore a shape for your
book or learning project. You choose the meaning, the audience and the voice.

**Who this is for:** Researchers, educators, filmmakers and other people with
experience or material they want to pass on. You may be starting a new chapter or
returning to a project that has waited for years.

**A place to begin:** Choose a small set of material you own or have permission
to use. Together, explore recurring themes, keep track of their sources and try
an outline. Then test a short passage or lesson to see what fits your intention.

**What you can practise:**

- Organising a manageable sample and keeping its source labels.
- Asking AI to suggest themes and an outline, then checking them yourself.
- Drafting a small sample in a voice you can recognise as your own.

**A useful next step:** An outline and a tested sample can help you decide what to
develop next. We agree a realistic scope for the journey; a finished book is a
larger project.

**Do I need to digitise everything first?** Start by discussing the material and
its format. We can agree which small, usable sample to bring and what preparation
it needs.

**What happens to private material?** You decide what can be used. We discuss
permissions and tool settings before uploading anything; confidential items can
stay out of the exercise.

**Final invitation:** Tell us about the material—and who you hope it will help.

#### Page 2 — A next-chapter venture

**Proposed route:** `/ai-coaching/next-chapter-business`

**SEO title:** AI Coaching for Your Next Business Idea | GreenElephant

**Meta description:** Explore a new business idea through personal AI coaching. Clarify a customer problem, draft an offer and plan a small test using your experience.

**Headline:** Explore your next business idea with AI—on your terms.

**Introduction:** Bring an idea and the experience behind it. Learn to use AI to
ask better questions, explore an offer and prepare a small real-world test.

**Who this is for:** People considering a small venture after a long career,
during a transition or alongside their current work. You do not need a finished
business plan to begin.

**A place to begin:** Suppose you want to turn something you know into a service.
Use AI to explore who might need it, draft questions for those people and write a
first description of the offer. Check the assumptions before deciding what to do.

**What you can practise:**

- Turning a broad idea into a clear customer question.
- Drafting an offer in words that sound like you.
- Preparing one small test and deciding what you want to learn from it.

**A useful next step:** A clearer offer draft, a short list of assumptions and a
manageable next experiment. You keep the business decisions; AI helps you explore
and prepare.

**Will AI tell me whether the idea will work?** AI can suggest possibilities, but
real people provide the evidence. We help you distinguish a promising suggestion
from an assumption that still needs testing.

**Can I bring an idea that is still rough?** Yes. A question such as “Could my
experience help someone with this problem?” is enough for a discovery conversation.

**Final invitation:** Bring the idea you keep coming back to.

#### Page 3 — Everyday AI confidence

**Proposed route:** `/ai-coaching/everyday-confidence`

**SEO title:** Personal AI Coaching for Everyday Life | GreenElephant

**Meta description:** Learn to use AI through everyday tasks you choose. Practise asking clear questions, checking answers and keeping control, with patient personal coaching.

**Headline:** Feel more confident using AI in everyday life.

**Introduction:** Start with something useful to you: writing a message, planning
a personal project or understanding unfamiliar information. Learn at a manageable
pace, with a person who helps you ask, try and check.

**Who this is for:** Adults who want practical help getting started with AI. Your
questions and interests shape the work; you do not need a technical background.

**A place to begin:** Bring a letter or a planning task with private details
removed. Practise asking for an explanation or a first draft. Compare it with the
original, spot what needs checking and make the result your own.

**What you can practise:**

- Giving enough context without sharing unnecessary personal details.
- Asking follow-up questions when an answer is unclear.
- Checking sources and changing a draft so it expresses what you mean.

**A useful next step:** A few repeatable tasks you have practised yourself, plus
simple notes to help you try them again.

**What if I find AI overwhelming?** We start with one task and explain each step.
There is room to ask questions and repeat what needs more practice.

**Can someone else arrange the journey for me?** Talk with us about who will
attend and who will pay. The learner helps choose the goal and what they want
to share.

**Final invitation:** What is one everyday task you would like help with?

**Editorial boundary:** initial examples avoid medical tasks. If later copy
includes health-information literacy, limit it to finding/checking information and
preparing questions for a clinician; it must not promise diagnosis or treatment.
Do not use age-based assumptions or publish private family/health anecdotes.

#### Page 4 — Facilitators and coaches

**Proposed route:** `/ai-coaching/facilitators-and-coaches`

**SEO title:** AI Training for Facilitators and Coaches | GreenElephant

**Meta description:** Build a practical AI workflow for preparation and follow-through. Personal coaching for facilitators and coaches who want to keep their attention on people.

**Headline:** Use AI around your work. Keep your attention on people.

**Introduction:** Explore how AI can support preparation, writing and follow-up
in your professional practice. Keep your own judgement, voice and responsibility
for the people you work with.

**Who this is for:** Facilitators, business coaches and learning designers who
want to connect scattered AI experiments into a useful working routine.

**A place to begin:** Take a fictional or approved brief. Use AI to explore a
session outline, check whether the activities serve the goal and prepare a
follow-up summary. Review what each step adds—and where your attention matters.

**What you can practise:**

- Turning a brief into useful preparation questions.
- Adapting an outline or exercise to a particular group.
- Checking a summary against the source and turning it into clear next steps.

**A useful next step:** A small preparation-to-follow-up workflow you have tried,
with clear points for your own review.

**Is this coaching from an AI chatbot?** Your learning is guided by a human coach.
You practise with AI tools as part of your own professional work.

**Do I need to bring client recordings?** No. Use a fictional, anonymised or
explicitly approved example. Client recordings are not needed to learn the steps.

**Final invitation:** Which repeatable part of your work would you like to improve?

#### Page 5 — Experienced specialists

**Proposed route:** `/ai-coaching/experienced-specialists`

**SEO title:** AI Coaching for Experienced Professionals | GreenElephant

**Meta description:** Use your expertise as the starting point for learning AI. Practise reports, research or recurring work with personal coaching; discuss employer sponsorship.

**Headline:** Keep your expertise. Build new ways of working with AI.

**Introduction:** You know your field. Learn to use AI with the reports, research
and questions you already understand, so your experience guides the work.

**Who this is for:** Experienced specialists who want focused, beginner-friendly
practice with relevant tasks. An employer may be organising the learning, or you
may be exploring it yourself.

**A place to begin:** Use a public or approved sample report. Ask AI to help
structure a summary, identify questions and prepare a repeatable draft. Check each
important claim against its source before deciding what is useful.

**What you can practise:**

- Giving clear instructions drawn from your own expertise.
- Comparing an AI answer with reliable source material.
- Building a small working template and a checklist for reviewing its output.

**A useful next step:** A task you have practised end to end, a reusable guide and
a clearer sense of where AI helps your work.

**Can my employer arrange this?** Start with a discovery conversation. We discuss
the learning goal, participant needs, scope and fee before a booking is confirmed.
Employer payment or reimbursement is not automatic.

**Can I use workplace material?** Only material and tools your organisation
allows. A public, fictional or appropriately approved example can be used for
practice instead.

**Final invitation:** Bring one professional task you know well and would like
to approach differently.

#### Satellite Scan — English copy proposal

This is a shorter content proposal for the product page, not a change to the
questionnaire or purchased service. Existing original hero artwork and checkout
remain in scope to preserve. The walkthrough and device/dashboard mockups are
removed from the page layout. Included guides and the actual customer dashboard
remain part of the offer.

**Headline:** Help AI communicate more like you.

**Introduction:** Notice your communication habits. Use what you learn to give
AI clearer instructions, keep your own voice and check its answers.

**Offer line:** A personal communication assessment, a dashboard prepared by a
coach, and prompts and exercises to help you practise.

**Price and button:** Get your Satellite Scan — €99.95

**Unboxed subtext directly below the button:**

> Questionnaire and video guides currently in English. Automatic translations may be inaccurate.

**What is included**

- A self-reflection questionnaire: allow about 90 minutes.
- A dashboard prepared by a coach, normally within 48–72 hours of completion.
- More than 10 communication prompts, video guides and practice materials.

**How it works**

1. Buy your Scan and check your email for the next steps.
2. Complete the questionnaire at your own pace.
3. Use your dashboard and prompts to explore a real task and review what you learn.

**Bring your own voice to AI**

Start with your goal, your preferred tone and what matters to you. Practise turning
those choices into a clear request. Read the answer, check it and change what
doesn't fit.

**Is coaching included?** Training and coaching are booked separately. The Scan
supports personal reflection and practice; it does not train an AI model for you.

**What do the results tell me?** They describe patterns in your own responses.
Use them for reflection and coaching, rather than hiring or performance reviews.

**Short privacy note:** Share only what an AI tool needs. Leave out private client
or workplace information.

**Final CTA:** Get your Satellite Scan — €99.95

Repeat the same English-language materials disclosure below the final CTA. Place
any retained terms/refund links next to the buying context; do not remove product
terms or alter checkout conditions as part of copy shortening.

**Secondary link:** Discuss your training needs

#### Satellite Scan — matching French copy proposal

**Titre :** Aidez l’IA à communiquer à votre manière.

**Introduction :** Repérez vos habitudes de communication. Appuyez-vous sur ce
que vous découvrez pour donner des consignes plus claires à l’IA, garder votre
propre voix et vérifier ses réponses.

**Présentation :** Un bilan personnel de communication, un tableau de bord
préparé par un coach, et des consignes et exercices pour pratiquer.

**Prix et bouton :** Acheter votre Satellite Scan — 99,95 €

**Texte sans encadré, directement sous le bouton :**

> Questionnaire et guides vidéo actuellement en anglais. Les traductions automatiques peuvent être inexactes.

**Ce qui est inclus**

- Un questionnaire de réflexion personnelle : prévoyez environ 90 minutes.
- Un tableau de bord préparé par un coach, normalement sous 48 à 72 heures après le questionnaire.
- Plus de 10 consignes pour l’IA, des guides vidéo et des exercices de communication.

**Comment ça marche**

1. Achetez votre Scan, puis consultez les prochaines étapes dans votre boîte mail.
2. Répondez au questionnaire à votre rythme.
3. Utilisez votre tableau de bord et les consignes pour essayer une tâche réelle et faire le point.

**Gardez votre voix dans vos échanges avec l’IA**

Partez de votre objectif, du ton souhaité et de ce qui compte pour vous. Entraînez-vous
à transformer ces repères en une demande claire. Lisez la réponse, vérifiez-la et
changez ce qui ne vous convient pas.

**Le coaching est-il inclus ?** La formation et le coaching se réservent séparément.
Le Scan vous aide à réfléchir et à pratiquer ; il n’entraîne pas de modèle d’IA
pour vous.

**Que m’apprennent les résultats ?** Ils décrivent des tendances dans vos propres
réponses. Utilisez-les pour la réflexion personnelle et le coaching, plutôt que
pour le recrutement ou l’évaluation au travail.

**Note de confidentialité :** Ne partagez avec un outil d’IA que les informations
nécessaires. Écartez les données privées de vos clients ou de votre travail.

**Bouton final :** Acheter votre Satellite Scan — 99,95 €

Repeat the French materials-language notice beneath the final French CTA.
Retain equivalent product terms/refund links in French. Translate navigation,
accessible labels and footer context as well as body text; proper product names
remain unchanged. No English explanatory paragraph belongs on this French page.

**Lien secondaire :** Parlons de vos besoins de formation

**Scope note for both Scan drafts:** the existing price, material count and
turnaround are carried over from current source, not newly validated provider
performance. Confirm their current accuracy before release. These short drafts
also need the retained ACX/framework links and product-specific essential terms
checked during the layout pass. Public removal of additional explanatory sections
or testimonials is not implied by this draft.

#### GA4 and the three-month comparison — proposed implementation brief

**First reconcile the existing setup.** Estève reports a live Accept/Reject
choice and installed GA tracking. Current source has disabled browser analytics
and cookie-policy wording saying analytics is not used; the HTML check found no
GA/GTM loader. Identify the actual property/data stream, tag delivery mechanism
and consent manager. Reuse what is already present where it works. A configured
measurement ID or server reporting credential is not proof of event collection.

**Proposed measurement:**

| Question | Proposed evidence | Interpretation |
| --- | --- | --- |
| Are people finding each page? | Landing-page sessions by source/medium/campaign; Search Console page/query data where access exists | Visibility and traffic quality; keep referral and search traffic distinct |
| Do they take the next step? | Existing `calendly_click` event extended with a fixed use-case slug, language and CTA position | Booking-link interest, not a completed appointment |
| Do suitable enquiries follow? | Confirmed calls and qualified enquiries by use case, initially tallied manually from information volunteered in the enquiry | No automated calendar/CRM integration is implied |
| Do they become customers? | Aggregate proposals and paid engagements by use case, reviewed outside GA unless a later integration is approved | Do not infer sales from clicks or copy client data into analytics |

Use the five fixed route slugs as the `use_case` values; no free-text goals,
names, email addresses, questionnaire responses or private document references in
event parameters. Keep existing event history and avoid creating a second tag.
Check initial page loads and in-app navigation separately so one visit does not
produce duplicate page views. Consent acceptance must not duplicate the current
page view either. Leave unrelated ad/personalisation settings unchanged.

Proposed campaign convention: `utm_campaign=coaching_journeys_90d`, a real
source/medium such as `linkedin / organic_social`, and the fixed case slug in
`utm_content`. Review links before use; no campaign messages have been sent.
Country, language, source and the kind of promotion may differ, so this is a
portfolio comparison, not a randomised A/B test. A page with more promotion does
not establish a better niche. Compare like traffic sources and disclose small
sample sizes and consent-related gaps.

Begin the shared clock only after all five approved English pages are live,
measurement has passed a consent-aware browser check, and the GA4 destination
shows the expected events. Record actual start/end dates then. Use a lightweight
weekly data-quality check and reviews at days 30, 60 and 90; no scheduled automation
is created by this draft. Low traffic means insufficient evidence, not a failed
market. Report counts as well as rates.

**Technical verification proposal:** use Google Tag Assistant to check the tag and
the banner's initial, Accept, Reject and withdrawal states; inspect relevant network
requests/cookies and GA4 Realtime or DebugView; ensure page and event behaviour
matches the selected consent design. Reconcile the cookie/privacy copy with the
observed implementation. The banner's presence alone does not establish these
results. The measurement mode and retention settings remain to inspect.

Reference: [Google tag verification](https://support.google.com/analytics/answer/15756111?hl=en),
[consent-mode verification](https://support.google.com/analytics/answer/14218557?hl=en),
and [GA4 landing-page reporting](https://support.google.com/analytics/answer/12931766?hl=en).
These technical references are not a legal-compliance certification.

#### Build and review sequence

1. Review the proposed copy and agree feasible journey activities; confirm open
   coaching schedule/price/delivery details before public offers are final.
2. Implement homepage and EN/FR Scan refinements on the local branch. Preserve
   exact testimonial wording, existing buying terms, original artwork and working
   checkout destinations. Review both languages on desktop and mobile.
3. Implement the five English pages using one content-driven layout. Add unique
   titles/descriptions/canonical URLs and internal links; serve meaningful initial
   HTML for each new page and English Scan, using the existing Express/Vite stack.
   Add only published pages to the sitemap. Keep French equivalents out of
   hreflang until the translated pages exist.
4. Reconcile and test existing analytics/consent, then prepare the agreed landing
   report. Confirmed booking attribution may begin with a manual tally; do not
   label outbound clicks as confirmed bookings.
5. Run the applicable repository/release checks and review the actual pages.
   Prepare PRs with the source/OS cross-check below. After reviewed merges, use
   the refreshed manual Replit release issue; the human selects Republish.

**Cross-repository record:** website base
`2a029447065922649ed4391a275221694a7ad424`; OS main
`83391d8520a6bfb2e010590686d6e32797490b62`. The OS PRD/log were read at that
commit. Website GEOS-REQ-002/003/004 and OS GEOS-REQ-002/003/004,
DEC-GEOS-001/002/003 apply. This draft introduces no OS schema, shared package,
calendar field or customer transfer, so no paired OS change is proposed. The
website manifest still has no shared contracts dependency; no receiving-system
integration is asserted. Any later shared flow needs its own explicit record.

**2026-10-03 batch state:** copy/layout implemented under DEC-AIL-041 and
owner-reviewed under DEC-AIL-042/045. The batch was merged through PR #42; current
GitHub `main` resolves to merge commit `ef0199a2084ea090355e831a314ca25505370262`,
which is the new local-refresh baseline. The owner reports completing GitHub/Replit
synchronization and republication during the preceding weekend; this PRD does not
independently verify that production deployment. Preview locally with
`npm run preview:website` at `http://127.0.0.1:5180` (backend actions unavailable).
Existing account/billing/provider settings are untouched. Production build,
repository checks, 62 isolated release tests and 7 new page checks pass. The full
type check has legacy errors in unchanged files. The owner accepts the preview;
independent mobile/keyboard/font checks, existing GA4/consent verification and
live provider/release gates remain open. The pre-PR audit reports zero high or
critical dependency findings and eight moderate findings; dependency versions
are unchanged. Do not start the three-month comparison before verified measurement.

<!-- AI_LIT_WORKSHOP_20261003_END -->

### Discovery acceptance and progress

| ID | Acceptance | State |
| --- | --- | --- |
| AI-LIT-AC-001 | Broad audience, reference contexts, languages and reach recorded | Audience priority and organisational/union-funded compatibility approved in DEC-AIL-007; languages and reach remain source-recorded under DEC-AIL-003 |
| AI-LIT-AC-002 | Current capabilities classified as reuse / hide-retire / replace / awaiting Estève | Open |
| AI-LIT-AC-003 | A recoverable baseline is selected without losing work | Current GitHub `main` at `ef0199a` selected for `codex/website-refresh-anu`; Replit comparison deferred outside this phase under DEC-AIL-046 |
| AI-LIT-AC-004 | Niche, problem, first offer, primary conversion and language rollout approved | Partial: audience/problem direction, formats, Calendly conversion, workshop package and English-first release approved; detailed offer and pricing questions remain under AI-LIT-TBD-002 |
| AI-LIT-AC-005 | Journey/pages and acceptance criteria approved | Partial: main navigation DEC-AIL-016 and homepage baseline DEC-AIL-017 remain approved; replacement hierarchy and local acceptance are proposed in AI-LIT-REQ-043/044 |
| AI-LIT-AC-006 | Architecture and baseline decision supported by evidence | React/Vite/Express preserved; GitHub `main` at `ef0199a` selected for local refresh under DEC-AIL-046; no architecture change proposed |
| AI-LIT-AC-007 | Implementation backlog records project, repository/branch, acceptance, validation, blocker and last verification | Current draft records `codex/website-refresh-anu`, source commit, proposal gates and local-render acceptance; no website code implemented in this documentation batch |

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
