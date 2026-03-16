# GreenElephant.org - Conscious Communication Platform

## Overview
GreenElephant.org is a spiritual transformation platform focused on conscious communication, leveraging the "Periodic Table of Conscious Communication." It offers retreats, coaching, research, and educational resources to Executive Assistants, TEAL startup founders, and Design & Innovation students. The platform aims to foster authentic connection, transform conflict, and highlight communication's critical role as a human interface beyond AI.

## User Preferences
Preferred communication style: Simple, everyday language.
When user points to elements in the preview, always apply changes to the file that renders that route.
**Email Updates**: Send a friendly update email to esteve@greenelephant.org and anu@greenelephant.org after each website publish summarizing changes, new features, and next steps for inbound marketing. Always include a **TLDR section** at the top written in plain, human-friendly language (not technical) — a short paragraph explaining what changed and why it matters. This makes the emails work as quick reporting for non-technical readers.
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
The frontend uses React, TypeScript, Vite, Wouter for routing, `shadcn/ui` components, and Tailwind CSS for styling with a dark mode "Head-Up Display" aesthetic. It features a custom color palette, Poppins for headlines, Lato for body text, TanStack Query for state, and React Hook Form with Zod for forms.

### Backend
The backend is an Express.js application with TypeScript, providing a minimal REST API. It uses an abstract storage interface (in-memory for development, Drizzle ORM with PostgreSQL planned). All API routes are prefixed with `/api`, use JSON, and include request logging.

### Data Storage
The project is configured for PostgreSQL using Neon serverless and Drizzle ORM. Schema definitions are in `shared/schema.ts` with Zod validation. In-memory storage serves as a fallback.

### Authentication
- **Admin auth**: Google OAuth 2.0 (primary) with password fallback, supporting Super Admin, Admin, and Viewer roles. Admin users managed in `admin_users` table.
- **Client portal auth**: Email/password, Google OAuth 2.0, LinkedIn OpenID Connect (OIDC).
- **Client user tables**: `client_users` and `client_subscriptions` (Stripe).
- **Audit Logging**: All admin write operations are logged in `audit_logs` table.

### Key Features
- **Notion CRM Integration**: Two-way sync for contacts and user data.
- **Email Systems**: Fibonacci-timed onboarding, GDPR-compliant transactional emails, admin notifications.
- **Content & Assessments**: Prompt Library, GBR Taxonomy, "Check-my-FLOW" assessment, "Decoding Hub" (5 GBR-annotated speeches: Mandela, JFK, Obama, MLK, Steve Jobs).
- **Admin Dashboards**: Comprehensive dashboards for customer journeys, email control, webinar management, external service integrations.
- **AI-Powered Tools**: Prompt Generator, Content Flywheel Lab (LinkedIn content engine with 4 generators), AI Tools Dashboard, Research Flywheel (PMF testing, lead generation). All admin AI pages include an **AI Context Selector** — a HITL control showing connected data sources (Notion, Google Sheets, Stripe, Fathom, Typeform, Local CRM) with toggles to scope which context feeds into AI queries. Preferences persist in `admin_settings`.
- **Client Portal**: Dashboard (Space Elevator Timeline with view modes: All/Milestones/Learning + search), Settings (with profile photo upload), Playground (Prompt Library, Explore & Build, Visualize), HUD Tools organized into 3 groups: Main tools (AI Agent/yellow, Flow Check/green, Reflection/teal, Micro Habits/orange, Learning/blue, Prepare/red), Extras (Milestone, Presencing/Wisdom Council, Scans, Emotional Landscape), Utility (Upload/white, Export/white — in settings area alongside Settings & Logout). Portal uses brand-skinnable CSS variables (--hud-bg, --hud-glass, --hud-border, --hud-accent, etc.) for GreenElephant/Arbora switching.
- **Emotional Landscape**: Spotify-powered coaching mirror HUD tool. Shows valence/energy scatter plot, mood quadrant analysis (Activated & Upbeat / Intense & Driven / Calm & Content / Contemplative & Deep), coaching insights, recent tracks with audio features. Saves snapshots to timeline under "alignment" lens.
- **SaaS Settings**: Admin page for managing Scan-as-a-Service with pricing tiers, subscription pathways, revenue projections, and a Value Prop Editor. Supports subscription coupons.
- **Coaching Cockpit**: Admin page for visualizing the Satellite Scan coaching workflow.
- **Debriefing Tool**: Admin page for tracking coaching session debriefs, persisted to PostgreSQL (`coaching_debriefs` table). CRUD via `/api/admin/debriefs`.
- **Access & Security**: Admin page for team member management, role assignment, and audit log viewing.
- **QR Command Center**: Admin page for generating/managing QR codes. Master QR (permanent, always points to portal login) + campaign QR codes. GDPR-compliant scan tracking with IP geolocation (country, city, ISP, device type). QR images in PNG/SVG with teal branding. Routes: `/qr/:slug` (public redirect+track), `/api/admin/qr-codes/*`.
- **Privacy Policy**: Comprehensive GDPR-compliant policy.

## External Dependencies

### UI Framework
- shadcn/ui (Radix UI primitives)
- Tailwind CSS
- Lucide React (icons)
- Google Fonts: Poppins, Lato

### Third-Party Services
- **Stripe**: Payment processing
- **Calendly**: Live API integration (CALENDLY_API_TOKEN) — event types, scheduled events, user profile. Admin page shows live data.
- **YouTube**: Playlist integration
- **LinkedIn**: Company page + OpenID Connect login (OIDC)
- **Resend**: Email notifications
- **Thesys.dev API**: AI-powered communication lens visualization
- **Notion CRM**: Two-way contact synchronization + Pipeline OS to-do board
- **Fathom Analytics**: Privacy-first website analytics via OAuth (sites, visitors, pageviews)
- **Spotify**: Portal connector via OAuth — recently played tracks with audio features (valence, energy, danceability). Emotional Landscape coaching insight tool. Routes: `/api/portal/spotify/connect`, `/callback`, `/disconnect`, `/status`, `/recent-tracks`.
- **Oura Ring**: Portal connector via OAuth — readiness, sleep, and activity scores for biometric-communication correlation. GDPR-consented with token refresh. Routes: `/api/portal/oura/connect`, `/callback`, `/disconnect`, `/status`, `/daily`.