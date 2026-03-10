# GreenElephant.org - Conscious Communication Platform

## Overview
GreenElephant.org is a spiritual transformation platform focused on conscious communication, utilizing the "Periodic Table of Conscious Communication." It provides retreats, coaching, research, and educational resources to Executive Assistants, TEAL startup founders, and Design & Innovation students. The platform's goal is to cultivate authentic connection, transform conflict, and emphasize communication's role as a vital human interface beyond AI.

## User Preferences
Preferred communication style: Simple, everyday language.
When user points to elements in the preview, always apply changes to the file that renders that route.
**Email Updates**: Send a friendly update email to esteve@greenelephant.org and anu@greenelephant.org after each website publish summarizing changes, new features, and next steps for inbound marketing.
**GitHub Sync**: After every website publish, always prompt the user with a ready-to-push GitHub commit summary and ask them to confirm before pushing. Use the `pushToGitHub()` function in `server/github-push.ts` to push the full codebase to GitHub repo `Esteve32/GreenElephantorg` (main branch). This is a mandatory post-publish step -- never skip it. Always remind the user even if they don't ask.
**GitHub Orchestration**: GreenElephantOS repo (`Esteve32/GreenElephantOS`) contains Google Apps Scripts, contracts, and docs. GreenElephantorg repo is the website backup. See `docs/ORCHESTRATION_PLAN.md` in GreenElephantOS for the full architecture.
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
The frontend is built with React, TypeScript, Vite, and Wouter for routing. UI components use `shadcn/ui` and are styled with Tailwind CSS, following a dark mode-first "Head-Up Display" aesthetic. It incorporates a custom color palette based on 8 communication lenses, Poppins for headlines, and Lato for body text. State management is handled by TanStack Query, and forms utilize React Hook Form with Zod. The homepage features a gradient architecture for visual transitions.

### Backend
The backend is an Express.js application with TypeScript, providing a minimal REST API. It uses an abstract storage interface with an in-memory implementation for development, planned for migration to Drizzle ORM with PostgreSQL. All API routes are prefixed with `/api`, use JSON, and include request logging.

### Data Storage
The project is configured for PostgreSQL using Neon serverless and Drizzle ORM. Schema definitions are in `shared/schema.ts` with Zod validation. In-memory storage serves as a fallback.

### Authentication
A basic user model exists, and session-based authentication using `express-session` with a PostgreSQL session store is planned.

### Key Features
- **Notion CRM Integration**: Two-way sync for contacts with Notion CRM, including upsert logic, email normalization, and race condition prevention.
- **Email Systems**: Fibonacci-timed onboarding emails, GDPR-compliant transactional confirmation emails for all user-facing forms, and admin notifications.
- **Content & Assessments**: Prompt Library, GBR Taxonomy (146 elements across 8 lenses), "Check-my-FLOW" assessment based on Csikszentmihalyi's model, and a "Decoding Hub" for communication analysis.
- **Webinars**: Monthly Lens Webinars with two-tier access, replay gating, and admin-configurable settings for webinar pages. Upcoming sessions are stored in the `webinar_sessions` DB table and served via `GET /api/webinar-sessions`. Admin CRUD at `/admin/webinar-sessions` (`WebinarSessionsAdmin.tsx`) — add, edit, delete sessions with lens color, date, time, spots left, and sort order fields.
- **Admin Dashboards**: Scan Results Dashboard, Email Control Room (`/admin/email-control-room`) with 6 journey cards and full 16-email inventory, Webinar Sessions admin (`/admin/webinar-sessions`), and an admin interface for managing newsletter campaigns.
- **Daily Pulse**: Automated digest email at 8:00 AM UTC to esteve@greenelephant.org aggregating last-24h activity (scan purchases, revenue, newsletter subs, webinar signups, flow check zones, quiz completions, contact messages). Manual trigger at `POST /api/admin/trigger-pulse`. Logic in `server/daily-pulse.ts`.
- **GA Event Tracking**: Named tracking functions in `client/src/lib/analytics.ts` — `trackScanCTAClicked`, `trackFlowCheckCompleted`, `trackNewsletterSubscribed`, `trackWebinarSignup`, `trackContactFormSubmitted`, `trackQuizCompleted`, `trackPromptCopied`, `trackCoachingCTAClicked`. Uses `VITE_GA_MEASUREMENT_ID` env var via `initGA()`.
- **SEO Architecture**: Optimized for executive communication coaching with dedicated landing pages, structured data (FAQPage, BreadcrumbList, Event, Organization, Product/Service schemas), sitemap, and internal linking.
- **AgentOps & AI Agent Readiness**: Infrastructure for machine-readable brand discovery including `/llms.txt`, `/api/services`, `/api/coaches` endpoints, and detailed documentation of automation pipelines.

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