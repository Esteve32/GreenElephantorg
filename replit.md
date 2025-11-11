# GreenElephant.org - Conscious Communication Platform

## Overview
GreenElephant.org is a spiritual transformation platform centered on conscious communication, utilizing the "Periodic Table of Conscious Communication" framework. It targets Executive Assistants, TEAL startup founders, and Design & Innovation students through retreats, coaching, research, and educational resources. The platform promotes inclusive spiritual principles and features a unique "Head-Up Display" (HUD) design aesthetic with dark backgrounds and semi-transparent white overlays. The business vision is to foster authentic connection and meaningful relationships by transforming conflicts into trust and positioning communication as a critical human interface beyond AI automation.

## Recent Changes (November 11, 2025)

### Team Page Enhancement
- Reordered coaches: Anu Timmerbacka → Jonas Pannetier → Estève Pannetier
- Added "Unique Superpower" badges for each coach highlighting their transformative strengths
- Added "How to Talk 'Green' to [Name]" sections with personalized communication guidance based on LinkedIn profiles
- Fixed languages display bug with defensive Array.isArray guard

### Retreat Waitlist Funnel
- Complete GDPR-compliant email collection system
- Removed "Learn More" button, replaced with single "Join Waitlist" CTA
- WaitlistDialog component with scarcity messaging (limited spots, fills within 3 weeks)
- Form validation: Name, Email, Motivation (minLength=10), GDPR consent checkbox
- Backend: POST /api/waitlist endpoint creates atomically linked contact + waitlist entry
- Automated e2e tests confirm full funnel functionality ✅

### Backend Infrastructure
- GDPR-compliant contact schema with consent tracking (contacts, waitlist_entries, newsletter_subscriptions, signals_quiz_results tables)
- Feature-specific storage interfaces and API endpoints
- Quiz scoring validation with 0-100 bounds and NaN safeguards

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React and TypeScript, using Vite for bundling. Wouter handles client-side routing, and `shadcn/ui` (built on Radix UI) provides the component library. State management relies on TanStack Query for server-side data, and React Hook Form with Zod is used for form handling and validation. Styling is implemented with Tailwind CSS and a custom design system.

The design system is dark mode-first, featuring a HUD aesthetic with dark backgrounds and semi-transparent white overlays. It uses a custom color palette based on 8 communication lenses, a specific typography (Archivo for headlines, Lato for body), and a 4/8/12/16/24/32 pixel spacing scale. Glass-morphism effects with backdrop blur are used for modals and navigation. Icons are light (95% lightness) for optimal contrast on colored backgrounds.

Key pages include Home, Periodic Table (with 129 elements and NVC-based prompts), Retreats, Coaching, Team, Lab, Resources/Prompts, Contact, Stories, "What Is", and "Signals" educational pages. The architecture emphasizes modular, reusable components.

### Backend Architecture
The backend uses Express.js with TypeScript, providing a minimal REST API. It includes an abstract storage interface (`IStorage`) with an in-memory implementation (`MemStorage`) for development, designed for future migration to Drizzle ORM with PostgreSQL. All API routes are prefixed with `/api`, use JSON for requests/responses, and include request logging.

### Data Storage Solutions
The project is prepared for PostgreSQL using Neon serverless, with Drizzle ORM configured. Schema definitions are in `shared/schema.ts` with Zod validation. The current fallback is in-memory storage. The schema includes a Users table with UUID primary keys and uses `drizzle-zod` for type safety.

### Authentication and Authorization
A basic user model is prepared, but authentication is not yet implemented. The planned architecture involves session-based authentication using `express-session` and a PostgreSQL session store via `connect-pg-simple`.

## External Dependencies

### UI Framework
- shadcn/ui (Radix UI primitives)
- Tailwind CSS
- Lucide React (icons)
- Google Fonts: Archivo, Lato

### Development Tools
- Vite
- TypeScript
- ESLint

### Third-Party Services
- **Stripe**: Payment processing for coaching packages and retreats (ACTIVE, EUR currency, server-side price validation)
- **Calendly**: Direct booking integration (anu-greenelephant/call-with-anu)
- **YouTube**: Playlist integration
- **LinkedIn**: Company page (greenelephant-org)
- **Neon Database**: PostgreSQL hosting (Planned)
- **Google APIs**: Dynamic content sourcing (Planned)
- **Notion API**: Content management and updates (Planned)
- **Typeform/VideoAsk**: Interactive client onboarding and feedback (Planned)

### Data Fetching
- TanStack Query

### Styling Utilities
- `class-variance-authority`
- `clsx`
- `tailwind-merge`

### Form Management
- React Hook Form
- Zod

### Date Handling
- `date-fns`

### Interactive Elements
- `embla-carousel-react`
- `cmdk`