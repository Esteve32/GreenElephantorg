# GreenElephant.org - Conscious Communication Platform

## Overview
GreenElephant.org is a spiritual transformation platform focused on conscious communication, utilizing the "Periodic Table of Conscious Communication." It provides retreats, coaching, research, and educational resources to Executive Assistants, TEAL startup founders, and Design & Innovation students. The platform's goal is to cultivate authentic connection, transform conflict, and emphasize communication's role as a vital human interface beyond AI.

## User Preferences
Preferred communication style: Simple, everyday language.
When user points to elements in the preview, always apply changes to the file that renders that route.
**Email Updates**: Send a friendly update email to esteve@greenelephant.org and anu@greenelephant.org after each website publish summarizing changes, new features, and next steps for inbound marketing.
**GitHub Sync**: After every website publish, always prompt the user with a ready-to-push GitHub commit summary and ask them to confirm before pushing. Use the `pushToGitHub()` function in `server/github-push.ts` to push the full codebase to GitHub repo `Esteve32/GreenElephantorg` (main branch). This is a mandatory post-publish step -- never skip it. Always remind the user even if they don't ask.
**GitHub Orchestration**: GreenElephantOS repo (`Esteve32/GreenElephantOS`) contains Google Apps Scripts, contracts, and docs. GreenElephantorg repo is the website backup.
**Post-Publish Checklist (MANDATORY)**: Every time the site is published/deployed, remind the user to run these two external checks if they haven't already:
  1. **W3C Accessibility validator** — https://validator.w3.org/ (HTML validity) and https://wave.webaim.org/ (WCAG accessibility audit). Check at minimum: homepage, Scan page, FlowCheck page, Connect page.
  2. **ACX100 self-audit** — The AI-Human Experience Framework by Arbora Partners (arbora.partners). Rate each of the 8 sections (I–VIII) on a 1–5 scale. Sections most relevant to GreenElephant: II (Transparency/Explainability of AI tools), III (Accountability), V (Fairness/Non-Discrimination), VI (Technical Robustness). The full ACX100 framework is saved at `.agents/skills/acx100/SKILL.md`.

**New Page / Feature Checklist (MANDATORY)**: Every time a new page, form, or user-facing feature is added or modified, run through this checklist before considering the work complete. Remind the user of any gaps found:
  1. **GDPR-compliant emails**: Does any form collect user data (email, name, etc.)? If yes, ensure a confirmation/transactional email is sent via Resend using the branded dark HUD template (`brandedEmailWrapper` in `server/email-notifications.ts`). Include a GDPR footer explaining why they received the email and how to unsubscribe.
  2. **Consent gating**: Is explicit consent collected before any email is sent? Newsletter and marketing require opt-in checkbox with `consentText`. Transactional emails (contact form auto-reply) are allowed under legitimate interest but must be one-time, non-marketing.
  3. **Sign-up loop closed**: Does the user get feedback after submitting? Every form must show a success state AND send a confirmation email. No silent submissions — the customer should always know their action was received.
  4. **Admin notification**: Should esteve@greenelephant.org be notified? Waitlist signups, contact form messages, and purchase events should trigger an admin notification email with the relevant details.
  5. **Notion CRM sync**: Is the new contact/interaction being synced to Notion? All user-facing form submissions should call the Notion upsert flow and update the appropriate "Channels Reached" field.
  6. **Branded email style**: Client-facing emails must use the dark HUD template (dark bg #0a0a0a, teal #009999, Poppins headings, Lato body, GreenElephant logo). Admin-only notification emails can stay plain/light.

## System Architecture

### Frontend
The frontend uses React, TypeScript, Vite, Wouter for routing, `shadcn/ui` for components, and Tailwind CSS for styling with a dark mode "Head-Up Display" aesthetic. It features a custom color palette, Poppins for headlines, Lato for body text, TanStack Query for state, and React Hook Form with Zod for forms. The homepage includes a gradient architecture.

### Backend
The backend is an Express.js application with TypeScript, providing a minimal REST API. It uses an abstract storage interface (in-memory for development, planned for Drizzle ORM with PostgreSQL). All API routes are prefixed with `/api`, use JSON, and include request logging.

### Data Storage
The project is configured for PostgreSQL using Neon serverless and Drizzle ORM. Schema definitions are in `shared/schema.ts` with Zod validation. In-memory storage serves as a fallback.

### Authentication
- **Admin auth**: Google OAuth 2.0 (primary) with password fallback. Role-based access control with 3 levels: Super Admin (full access), Admin (all except access control), Viewer (read-only). Admin users managed in `admin_users` table. Cascading portal access — admin users automatically get linked client portal accounts.
- **Client portal auth**: Email/password registration/login, Google OAuth 2.0, LinkedIn OpenID Connect (OIDC).
- **Client user tables**: `client_users` and `client_subscriptions` (Stripe).
- **Client Portal Pages**: Dashboard (Space Elevator Timeline), Settings, and Playground, with a dedicated login page.
- **Audit Logging**: All admin write operations are logged in `audit_logs` table with user email, action, resource, details, and IP address. Viewable on the Access Control admin page.

### Key Features
- **Notion CRM Integration**: Two-way sync for contacts and user data.
- **Email Systems**: Fibonacci-timed onboarding, GDPR-compliant transactional emails, and admin notifications.
- **Content & Assessments**: Prompt Library, GBR Taxonomy, "Check-my-FLOW" assessment, and a "Decoding Hub".
- **Webinars**: Monthly Lens Webinars with admin CRUD for sessions.
- **Prompt Generator**: AI-powered admin tool for generating Prompt Library entries.
- **Admin Dashboards**: Comprehensive dashboards for various customer journey stages, email control, webinar management, and external service integrations.
- **Testimonials Admin**: CRUD page for managing customer testimonials with GDPR compliance.
- **Backlinks Tracker**: Admin page for tracking external links.
- **SEO/GEO Dashboard**: Admin page with SEO health checklist, GEO readiness, and AI suggestions.
- **Portal Login Toggle**: Admin setting to control public visibility and server-side gating of portal access.
- **Daily Pulse**: Automated daily digest email for activity summary.
- **GA Event Tracking**: Named functions for tracking key user actions.
- **SEO Architecture**: Optimized for executive communication coaching with structured data and sitemap.
- **AgentOps & AI Agent Readiness**: Infrastructure for machine-readable brand discovery and automation.
- **Client Notion OAuth**: Portal users can connect Notion for data push.
- **Prompting Playground**: Interactive portal page with Prompt Library, Explore & Build, and Visualize tools.
- **Portal HUD Tools**: 7 AI-powered tools accessible from the floating HUD on portal pages — Upload (file/text/URL to timeline), Debrief (GBR conversation analysis), Flow Check (3-slider motivation/challenge/competence diagnostic), Reflection (lens-based AI coaching), Export (clipboard/file/email), Micro Habits (AI-generated daily habits with .ics calendar export), Prepare (situation-specific communication prep). Backend: `/api/portal/ai` with Zod-validated input, authenticated portal users only.
- **LinkedIn OAuth (OIDC)**: Allows portal users to sign in with LinkedIn.
- **GDPR Admin Controls**: Admin page for managing data collection, OAuth providers, email controls, and data retention policies.
- **Access & Security**: Admin page at `/admin/access-control` for team member management, role assignment, and audit log viewing. Super Admin only.
- **Privacy Policy**: Comprehensive GDPR-compliant policy.
- **Content Flywheel Lab**: AI-powered LinkedIn content engine with 4 generators (headlines, AI gap, workplace, case study). Features: We/I voice toggle, Creative/Balanced/Precise calibration, CTA auto-suggest, enrichment loop (file upload + text context), GitHub-style Approve/Request Changes review flow, floating agent helper chatbot, SEO/GEO auto-applied to all content, lens calendar (single source of truth). Backend accepts voice, calibration, callToAction, enrichmentText params.
- **Portal Space Elevator Timeline**: Infinite-scroll dashboard with orbital overview (8-lens summary), glowing cable timeline with expandable event cards (scans, coaching, webinars, work/life events), upload/export section with social toggles, and earth ground level at the bottom. Visual metaphor: ground→timeline→orbit.
- **Auto-Connect Scans**: When a portal user logs in (email/password, Google, LinkedIn), the system automatically checks for `satellitescan_purchases` matching their email and creates timeline events for any unlinked scans. Uses `getSatellitescanPurchasesByEmail()` and deduplicates by `toolId`.
- **Admin Journey Stage Reorganization**: Operational tools (LinkedIn Setup, Coupons & Pricing, SaaS Settings, GDPR Controls, Connected Tools, Access & Security) moved from journey stage cards to a dedicated "Settings & Operations" section below the journey stages. Journey cards now only contain customer-facing action tools.
- **Coaching Cockpit**: Admin page at `/admin/coaching-cockpit` (Purchase stage) — visual pipeline for the Satellite Scan coaching workflow. Shows RAW Data→BRAIN→Dashboard→Deliver pipeline, mirrors Google Sheets menu actions (create doc, send to brain, email coaches, compare time/partners/team), with quick links to source spreadsheets and GPT.
- **Debriefing Tool**: Admin page at `/admin/debriefing` (Use More stage) — track coaching session debriefs with key insights, action items, progress ratings, and status workflow (draft→reviewed→shared). Summary cards for active clients, total sessions, and average progress.
- **Case Study Builder**: 4th generator in Content Flywheel Lab — AI-powered case study builder that creates client transformation narratives with before/after analysis, pull quotes, and LinkedIn-ready copy.
- **SaaS Settings**: Admin page at `/admin/saas-settings` (Purchase stage) — Scan-as-a-Service toggle with pricing tiers (one-time scan €99.95, monthly subscription €9.95/mo, coaching journey €2,980), three subscriber pathways (Coach/Pro, EA/VA/Leader, Data Export/API), revenue projections (MRR/ARR), and user flow visualization for both SaaS-on and SaaS-off modes. Server-side feature flag stored in admin_settings. When SaaS is ON: Header shows "Log in" to unauthenticated users (linking to portal login); authenticated portal users see "Take the Scan". Checkout page supports `?product=subscription` for €9.95/month portal subscription with dedicated payment endpoint. Cross-links between subscription and one-time scan on checkout. **Value Prop Editor**: Editable feature/benefit cards grouped by tier (One-Time Scan, Subscription, Coaching Journey) with 120-char limit per feature, add/remove capability. "Preview Changes" shows before/after diff across affected areas (checkout, scan page, emails, T&C). "Confirm & Apply" human-in-the-loop saves to admin_settings and propagates dynamically. **Subscription Coupons**: `/api/subscription/create-payment-intent` accepts couponCode, validates server-side, applies discount to Stripe PaymentIntent. Free subscription path via `/api/subscription/free-purchase` for 100% discount coupons. CheckoutPage coupon input works for both scan and subscription products.
- **Leadership Test Wiring**: Signals Quiz (`/signals`) now properly renders the interactive quiz. Executive Coaching Assessment and ForCEOs pages link directly to the free Signals Quiz and paid checkout, not to the /scan marketing page.
- **AI Tools Dashboard**: Admin page at `/admin/ai-tools` (Use More stage) — control center for AI model connections (ChatGPT default, Gemini via Google). Shows model status, version selection, API key status, test connection buttons. Usage statistics with day/week/month charts, cost estimation with budget alerts, troubleshooting accordion, and activity log table. Currently demo data — real tracking activates when portal AI tools go live.
- **Research Flywheel**: Admin page at `/admin/research-flywheel` (Interest stage) — AI-powered research engine for PMF testing and qualified lead generation. Three tabs: (1) PMF Assumption Generator with LinkedIn free-plan and Sales Navigator filter selectors, Thesys-powered hypothesis formulation, date-stamped assumption tracking, XLS export, and Notion sync; (2) Lead List Generator with why/what/how calibration questions, LinkedIn targeting, Google Sheets export, and XLS download; (3) Gmail Email Chain Harvester for CRM enrichment. Gmail connector added to IntegrationsAdmin. Backend: `server/lib/gmailClient.ts` for Gmail API via Google OAuth, new Thesys functions (`generatePMFAssumptions`, `generateLeadListSuggestions`) in `thesysApi.ts`, routes under `/api/admin/research/*`.

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
- **LinkedIn**: Company page + OpenID Connect login (OIDC)
- **Resend**: Email notifications
- **Thesys.dev API**: AI-powered communication lens visualization
- **Notion CRM**: Two-way contact synchronization + Pipeline OS to-do board (read-only)