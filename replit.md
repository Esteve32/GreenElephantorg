# GreenElephant.org - Conscious Communication Platform

## Overview
GreenElephant.org is a spiritual transformation platform centered on conscious communication using the "Periodic Table of Conscious Communication." It offers retreats, coaching, research, and educational resources to Executive Assistants, TEAL startup founders, and Design & Innovation students. The platform aims to foster authentic connection, transform conflict, and highlight communication's role as a vital human interface beyond AI.

## User Preferences
Preferred communication style: Simple, everyday language.
When user points to elements in the preview, always apply changes to the file that renders that route.
**Email Updates**: Send a friendly update email to esteve@greenelephant.org and anu@greenelephant.org after each website publish summarizing changes, new features, and next steps for inbound marketing.

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
  - Structured data: FAQPage schema on key pages, BreadcrumbList site-wide
  - Target keywords: EA communication training, CEO coaching, virtual assistant training, executive coaching assessment

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