---
document_id: GE-PRD
document_type: product_requirements
canonical_path: docs/PRD.md
decision_authority: docs/DECISION_LOG.md
project_index: docs/project-index.json
---

# Green Elephant — Product Requirements

One PRD, two product sections plus shared-system requirements. Version: **2.22.13**.
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

### Final release repair

| ID | Status | Requirement | Evidence |
| --- | --- | --- | --- |
| AI-LIT-REQ-070 | Local repair; human acceptance pending | Make each Periodic Table “View Related Prompts” action open Resources filtered to the element’s existing communication lens. Offer a clear route back to all prompts; support API and fallback prompts, ignore unknown lens values and show an honest empty state. Preserve prompt text, votes and provider behavior. | Estève reports the broken button during final release checks; 2026-10-06; DEC-AIL-073 |
| AI-LIT-REQ-071 | User choice A; implementation evidence | Replace the public personal Scan example with wholly fictional, clearly labelled partial practice inputs across eight lenses. Remove personal answers and identifiers from the shipped example; retain the Copy Sample Data interaction. Commit, push and open the reviewed website PR after checks. Merge and Replit publication remain separate. | Estève selected option A on 2026-10-06; DEC-AIL-074 |
| AI-LIT-REQ-072 | Requested repair; implementation candidate | Permit the exact Replit workspace hostname in Vite development and built preview, retain host checks, and run the provider-isolated website preview on the forwarded port. Review GitHub maintenance blockers and preserve Replit-only work before selecting an exact reviewed release SHA. Human Republish and live provider checks remain separate. | Estève requests GitHub blocker resolution and a Replit preview repair, 2026-10-07; DEC-AIL-075 |
| AI-LIT-REQ-073 | Implemented in PR #51; source validation passed | Resolve issue #50 without suppressing TypeScript diagnostics, make type checking blocking in CI and release preparation, then resolve active website PRs before producing the final Replit handoff. Preserve paused MyFive PR #4 as explicitly selected. | Estève requests issue #50 before republishing and selects keeping MyFive draft #4 open, 2026-10-07; DEC-AIL-076 |
| AI-LIT-REQ-074 | Requested maintenance; validated candidate | Resolve the active website maintenance queue on the clean TypeScript baseline: current pinned checkout/setup-node actions, Google client compatibility and resizable-panel API migration. Retire superseded proposals without deleting branches; preserve paused MY5 #4. | Estève requests the remaining website PRs resolved before Replit handoff, 2026-10-07; DEC-AIL-077 |

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
