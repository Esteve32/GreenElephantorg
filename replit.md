# GreenElephant.org - Conscious Communication Platform

## Overview
GreenElephant.org is a spiritual transformation platform centered on conscious communication using the "Periodic Table of Conscious Communication." It offers retreats, coaching, research, and educational resources to Executive Assistants, TEAL startup founders, and Design & Innovation students. The platform aims to foster authentic connection, transform conflict, and highlight communication's role as a vital human interface beyond AI.

## User Preferences
Preferred communication style: Simple, everyday language.
When user points to elements in the preview, always apply changes to the file that renders that route.
**Email Updates**: Send a friendly update email to esteve@greenelephant.org and anu@greenelephant.org after each website publish summarizing changes, new features, and next steps for inbound marketing.
**GitHub Sync**: After every website publish, always prompt the user with a ready-to-push GitHub commit summary and ask them to confirm before pushing. Use the `pushToGitHub()` function in `server/github-push.ts` to push the full codebase to GitHub repo `Esteve32/GreenElephantorg` (main branch). This is a mandatory post-publish step -- never skip it. Always remind the user even if they don't ask.
**GitHub Orchestration**: GreenElephantOS repo (`Esteve32/GreenElephantOS`) contains Google Apps Scripts, contracts, and docs. GreenElephantorg repo is the website backup. See `docs/ORCHESTRATION_PLAN.md` in GreenElephantOS for the full architecture.
**New Page / Feature Checklist (MANDATORY)**: Every time a new page, form, or user-facing feature is added or modified, run through this checklist before considering the work complete. Remind the user of any gaps found:
  1. **GDPR-compliant emails**: Does any form collect user data (email, name, etc.)? If yes, ensure a confirmation/transactional email is sent via Resend using the branded dark HUD template (`brandedEmailWrapper` in `server/email-notifications.ts`). Include a GDPR footer explaining why they received the email and how to unsubscribe.
  2. **Consent gating**: Is explicit consent collected before any email is sent? Newsletter and marketing require opt-in checkbox with `consentText`. Transactional emails (contact form auto-reply) are allowed under legitimate interest but must be one-time, non-marketing.
  3. **Sign-up loop closed**: Does the user get feedback after submitting? Every form must show a success state AND send a confirmation email. No silent submissions — the customer should always know their action was received.
  4. **Admin notification**: Should esteve@greenelephant.org be notified? Waitlist signups, contact form messages, and purchase events should trigger an admin notification email with the relevant details.
  5. **Notion CRM sync**: Is the new contact/interaction being synced to Notion? All user-facing form submissions should call the Notion upsert flow and update the appropriate "Channels Reached" field.
  6. **Branded email style**: Client-facing emails must use the dark HUD template (dark bg #0a0a0a, teal #009999, Poppins headings, Lato body, GreenElephant logo). Admin-only notification emails can stay plain/light.

## Brand Kit
Canonical brand values are saved in `client/src/constants/brandKit.ts`. This is the source of truth for all colour decisions.

**Two separate colour systems:**
- **8 Lens colours** — identify each communication lens in the Periodic Table (Influence=red, Attitude=orange, Chaordic=amber, Flow=lime-green, Alignment=forest-green, Needs=blue-teal, Ego=sky-blue, Dynamics=indigo)
- **4 Flow Zone colours** — Csikszentmihalyi model zones in Check-my-FLOW (Flow=teal #009999, Challenge=orange #E67E22, Comfort=blue #2980B9, Danger=red #C0392B)
- These two systems coexist and must remain visually distinct. Never conflate them.

**Background direction:** Brand assets use deep navy-black (#0A0C14) not pure black. Target HUD aesthetic references: Fuzu Dashboard slides and the Micro-Habit HUD slide.

**Pending/future colour refinements:**
- `--needs` CSS should shift from pure cyan (180 100% 35%) toward blue-teal (184, 88%, 35%) to match brand swatch
- `--dynamics` CSS should darken slightly to match brand indigo
- Web backgrounds could warm from pure black toward deep navy (#0A0C14)

**Content ideas logged:**
- **Colour-coded transcript viewer** (`/decode`): BUILT. Mandela 1994 Pretoria address annotated with GreenBlueRed behaviour segments; hover tooltips with analysis; GBR stats bar; sticky sidebar with legend + CTAs. Add more speeches by extending the `ALL_SPEECHES` array in `DecodePage.tsx`.
- **Lottie animations**: Fully implementable via `lottie-react`. Need `.json` files from user (source from lottiefiles.com). Good candidates: HUD ring spin, element card hover pulse, form success checkmark.

## System Architecture

### Frontend
The frontend uses React with TypeScript, Vite, and Wouter for routing. UI components are built with `shadcn/ui` (Radix UI) and styled with Tailwind CSS, following a dark mode-first "Head-Up Display" aesthetic. It features a custom color palette based on 8 communication lenses, Poppins for headlines, and Lato for body text. State management uses TanStack Query, and forms are handled with React Hook Form and Zod. The homepage employs a gradient architecture pattern for seamless visual transitions.

### Backend
The backend is an Express.js application with TypeScript, providing a minimal REST API. It includes an abstract storage interface with an in-memory implementation for development, designed for future migration to Drizzle ORM with PostgreSQL. All API routes are prefixed with `/api`, use JSON, and include request logging.

### Data Storage
The project is configured for PostgreSQL using Neon serverless and Drizzle ORM. Schema definitions are in `shared/schema.ts` with Zod validation. Currently, in-memory storage is used as a fallback.

### Authentication
A basic user model exists, and session-based authentication using `express-session` and a PostgreSQL session store via `connect-pg-simple` is planned.

### Key Features
- **Notion CRM Integration**: Two-way sync for contacts (waitlist, newsletter, quiz, purchases) with Notion CRM.
  - **Upsert Logic**: Searches by email before creating - prevents duplicates when same email submits multiple forms
  - **Email Normalization**: All emails trimmed and lowercased for consistent matching
  - **Race Condition Prevention**: Locking mechanism ensures concurrent syncs for same email don't create duplicates
  - **Error Propagation**: API failures trigger retries instead of incorrectly creating new pages
- **Onboarding Email System**: Fibonacci-timed email sequences for nurturing customers post-purchase.
- **Transactional Confirmation Emails**: GDPR-compliant auto-reply emails for all user-facing forms:
  - Newsletter signup: Welcome email to subscriber
  - Retreat waitlist: Confirmation to applicant + admin notification to esteve@
  - Contact form: Auto-reply to sender ("we'll respond in 24h") + admin notification to esteve@
  - Signals Quiz: Results email with score, interpretation, and Satellite Scan CTA (only if email provided)
  - All emails include GDPR footer explaining why they received the email + reply-to-unsubscribe
- **Webinar Waitlist**: GDPR-compliant waitlist for Play Labs sessions.
- **Prompt Library**: Curated communication prompts accessible via `/resources` and an admin interface.
- **Channels Reached Tracking**: Tracks user touchpoints (Newsletter, Purchase, Quiz, Webinar, Waitlist) for CRM and targeting.
- **Batch Email System**: Allows admins to send targeted emails to filtered segments of contacts.
- **Webinar Admin Settings**: Database-backed webinar page configuration via admin panel "Webinar" tab:
  - Countdown timer date/time (Finland timezone)
  - Host name(s), session title/subtitle/duration
  - Bonus offer description and CTA button text customization
  - Settings stored in `webinar_settings` table, fetched by `/webinar` page via `/api/webinar-settings`
  - ADHD-proof UI: clear labels, helper text, one Save button, Preview Page link
- **Newsletter Campaign System**: Reusable newsletter campaigns with:
  - Create/edit campaigns with HTML content templates
  - Recipient management with manual exclusion option
  - Open tracking via embedded 1x1 pixel
  - Notion CRM sync to "Satellite Scan Reachout Campaign Comments" column
  - Admin UI workflow: Select recipients → Edit content → Send → Track opens
- **SEO Architecture**: Optimized for executive communication coaching search traffic
  - Target audiences: Executive Assistants, CEOs, Virtual Assistants, Executive Coaching seekers
  - Dedicated landing pages: `/for-executive-assistants`, `/for-ceos`, `/for-virtual-assistants`, `/executive-coaching-assessment`
  - Audience hub: `/choose-your-path` - links to all 3 audience pages with Satellite Scan benefits
  - Structured data: FAQPage schema on 8+ pages, BreadcrumbList site-wide, Event schema on webinar page
  - Target keywords: EA communication training, CEO coaching, virtual assistant training, executive coaching assessment
  - `sitemap.xml` and `robots.txt` in `client/public/` — 25 URLs indexed, admin/checkout/API blocked
  - All 26 public pages now have `<SEO>` component with title, description, canonical, keywords, breadcrumbs
  - Internal linking: audience pages cross-link to quiz (`/signals`), scan, and webinar
- **Check-my-FLOW Assessment**: Native flow state assessment at `/flow-check`
  - Based on Csikszentmihalyi's 1988 flow model — measures Motivation, Challenge, Competence (0-10 perception scales)
  - 4 zones: Flow (balanced high), Challenge/Stress (high challenge, low competence), Comfort (low challenge, high competence), Danger/Apathy (both low)
  - Motivation modifies: if < 5, Flow degrades to Comfort, Challenge degrades to Danger
  - Multi-step form: Welcome → Situation (11 + Other) → Role (7 types) → Sliders → Optional email capture
  - Backend: `/api/flow-check` endpoint, `flow_check_results` table in PostgreSQL
  - Email: `sendFlowCheckResultEmail` (branded result with zone, scores, Scan CTA) + `sendFlowCheckAdminNotification`
  - Notion CRM sync with "Flow Check" channel, contact source: `flow_check`
  - Results show 2D grid (Challenge vs Competence), zone interpretation, video link, Satellite Scan CTA
  - Admin: `GET /api/admin/flow-checks` for all submissions
- **Scan Page Lead Magnet**: Now promotes Flow Check as primary CTA (replaced 3 generic prompts)
  - Email capture still available as secondary path via `/api/scan-interest`
  - Branded confirmation email via `sendScanInterestConfirmationEmail` in `server/email-notifications.ts`
  - Contact source: `scan_interest` in schema enum
- **Scan Page Social Proof**: Testimonial section with NPS badge (9.2/10), client count (200+), 5 testimonials, trust signals
- **Quiz → Scan Funnel**: Quiz results now show primary CTA to Satellite Scan purchase (€99.95) with visual teaser comparing quick check vs full scan; secondary CTA to coaching/retreats
- **Webinar Recurring Infrastructure**: Past sessions section, Event/VideoObject structured data, "Next Session" badge, dynamic month/year in SEO title

### Periodic Table of Conscious Communication
- **Element Count**: Currently 146 elements across 8 lenses (Influence, Attitude, Chaordic, Flow, Alignment, Needs, Ego, Dynamics)
- **Data Source**: `client/src/data/periodicElements.ts`
- **IMPORTANT**: When adding/removing elements, update the element count in:
  - `client/src/pages/PeriodicTablePage.tsx` (hero text: "146 micro-habits...")
  - `client/src/pages/PeriodicTablePage.tsx` (img alt text)

## External Dependencies

### UI Framework
- shadcn/ui (Radix UI primitives)
- Tailwind CSS
- Lucide React (icons)
- Google Fonts: Poppins, Lato

### Third-Party Services
- **Stripe**: Payment processing
- **Calendly**: Booking integration
- **YouTube**: Playlist integration
- **LinkedIn**: Company page
- **Resend**: Email notifications
- **Thesys.dev API**: AI-powered communication lens visualization
- **Notion CRM**: Two-way contact synchronization

### Satellite Scan Portal (Planned)
A client login portal to replace the Google Slides dashboard with an interactive web experience. Full build plan saved as the `satellite-scan-portal` skill (`.agents/skills/satellite-scan-portal/SKILL.md`). Say "let's work on the Satellite Scan Portal" to resume.
- **Source spreadsheet**: `11dKNeCJcKizW63dmFxggO1-D5K3wGLKZ8sMKRTZAKVo`
- **Dashboard template**: Google Slides `129c1JmY5kqBfTAtUMnTYXFeCcZf52Gj_84vlG8InOAM`
- **Estimated effort**: 76-119h agent time across 6 phases (auth, data pipeline, charts, layout, AI text, PDF export)
- **Key components**: ~15 chart types using Recharts, client login, coach admin, PDF download

### AgentOps & AI Agent Readiness
Infrastructure for machine-readable brand discovery (per martech.org "AI agents reshape marketing 2026"):
- **GREENPRINT**: `docs/FUTURE_PLANS.md` — master upgrade strategy document (call it "GREENPRINT" for short)
- **`/llms.txt`**: Plain-prose brand description for LLM context windows (like robots.txt for AI agents); at `client/public/llms.txt`
- **`GET /api/services`**: Schema.org ItemList of all 6 services with pricing, audience, format — agent-readable product catalogue
- **`GET /api/coaches`**: Schema.org Person objects for Esteve and Anu — agent-readable coach profiles
- **Organization JSON-LD**: Injected on every page via `SEO` component — `@type: Organization` with knowsAbout, founder, sameAs
- **Service JSON-LD**: `PRODUCT_STRUCTURED_DATA` in `client/src/components/SEO.tsx` now uses `@type: ["Product", "Service"]` for all offerings
- **`docs/AGENTOPS_FLOWS.md`**: All 8 automation pipelines documented as named flows (AgentOps layer documentation)
- **Flow Check zone formula**: Now consistent across frontend + backend (`effCh = challenge + (motivation-5)*0.8`)