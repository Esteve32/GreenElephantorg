# GreenElephant.org - Conscious Communication Platform

## Overview

GreenElephant.org is a spiritual transformation platform focused on conscious communication, built around the "Periodic Table of Conscious Communication" framework. The platform serves Executive Assistants, TEAL startup founders, and Design & Innovation students through retreats, coaching, research, and educational resources. The application emphasizes inclusive spiritual principles with a unique "Head-Up Display" (HUD) design aesthetic featuring dark backgrounds with semi-transparent white overlays.

**Recent Updates (November 2025)**:
- **Content & Language Updates (Nov 10)**:
  - Updated copyright year to 2025 in Footer
  - Replaced ACIM-specific references with inclusive mainstream spiritual language
  - Changed header CTA from "Begin Intake" to "Find Your Path" for improved clarity
  - Added 8 downloadable resources to Resources page (periodic table PNG + 7 PDF/image infographics)
  - Download buttons use accessible `asChild` pattern with proper semantic HTML
- **Value Proposition Overhaul (Nov 10)**: Implemented comprehensive "Promise → Path → Proof" framework across all 11 pages
  - Hero section transformed with "Turn Every Conversation Into Sacred Practice" headline
  - HomePage enhanced with Problem → Promise → Practice three-card section and emotional/spiritual benefits ladder
  - All pages now feature clear above-the-fold benefits: practical outcome (headline) + emotional relief (subhead) + spiritual invitation (tertiary)
  - Periodic Table page: Added "How to apply today" 3-step guidance with testimonial for credibility
  - Coaching page: Pain-focused headline "Stop Repeating the Same Communication Patterns" with persona-specific benefits
  - Retreats page: Added "What You'll Carry Home" section detailing post-retreat integration support
  - Prompts/Arbora/Contact/Stories/WhatIs/Signals: All pages enhanced with benefit-driven copy
  - Architect-verified: Maintains compassionate, non-judgmental tone without manipulative scarcity cues
- Implemented Stripe payment integration with secure server-side price validation
- Created emotionally resonant checkout flow linking problem → pain → solution with "cost of miscommunication" framing
- Updated retreat locations to specific cities: Tonttumäki, Finland and Aix-en-Provence, France
- Applied 66% opacity to periodic table element backgrounds for more elegant, translucent appearance
- Fixed icon contrast to 95% lightness ensuring visibility on all colored lens backgrounds

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool
- Client-side routing via Wouter (lightweight alternative to React Router)
- Component library: shadcn/ui built on Radix UI primitives
- State management: TanStack Query (React Query) for server state
- Form handling: React Hook Form with Zod validation resolvers
- Styling: Tailwind CSS with custom design system

**Design System**:
- Dark mode first with HUD aesthetic (dark backgrounds, semi-transparent white overlays)
- Custom color palette based on 8 communication lenses with exact taxonomy hex codes:
  - Influence (#cc3333 / Red) - Code 1100
  - Attitude (#ff9933 / Orange) - Code 2100
  - Chaordic (#ffcc00 / Yellow) - Code 3100
  - Flow (#cccc33 / Green) - Code 4100
  - Alignment (#669966 / Green) - Code 5100
  - Needs (#009999 / Teal) - Code 6100
  - Ego (#3399cc / Blue) - Code 7100
  - Dynamics (#666699 / Purple) - Code 8100
- Typography: Archivo for headlines, Lato for body text
- Spacing follows 4/8/12/16/24/32 pixel scale
- Glass-morphism effects with backdrop blur for modals and navigation
- Icon system: Light icons (95% lightness) for optimal contrast on colored lens backgrounds

**Key Pages**:
- Home: Hero section with framework overview and lens visualization
- Periodic Table: Comprehensive 129-element taxonomy with hierarchical category organization
- Retreats: "Equinoxe Retreats" in Lapland (Finland) and Provence (France)
- Coaching: Package comparison with 1:1 and team options
- Lab (Arbora): Research articles and insights
  - Route: `/lab` (canonical), `/arbora` (alias)
- Resources/Prompts: Filterable prompt library and learning materials
  - Route: `/resources` (canonical), `/prompts` (alias)
- Contact: Intent-based contact form with smart routing
- Stories: Transformation narratives organized by lens
- "What Is" and "Signals" educational pages

**Component Architecture**:
- Modular, reusable components (PeriodicElement, PromptCard, RetreatCard, CoachingPackage, etc.)
- Shared UI components from shadcn/ui in `client/src/components/ui/`
- Custom components in `client/src/components/`
- Example components for development reference in `client/src/components/examples/`

### Backend Architecture

**Server Framework**: Express.js with TypeScript
- Minimal REST API setup (routes defined in `server/routes.ts`)
- Session management preparation with `connect-pg-simple`
- Development server with Vite middleware integration for HMR
- Production build via esbuild with ESM output

**Storage Layer**:
- Abstract storage interface (`IStorage`) for database operations
- In-memory implementation (`MemStorage`) as default
- Designed for easy migration to Drizzle ORM with PostgreSQL
- User model defined in shared schema

**API Design**:
- All routes prefixed with `/api`
- JSON request/response format
- Request logging middleware with duration tracking
- Raw body preservation for webhook support

### Data Storage Solutions

**Database**: Prepared for PostgreSQL via Neon serverless
- Drizzle ORM configured but not yet fully implemented
- Schema defined in `shared/schema.ts` with Zod validation
- Migration support via `drizzle-kit`
- Current fallback: In-memory storage for development

**Schema Design**:
- Users table with UUID primary keys
- Schema validation via `drizzle-zod` for type safety
- Shared types between client and server in `shared/` directory

**Future Integrations**:
- Google API for dynamic content management
- Notion API for product/pricing updates and testimonials
- Typeform/VideoAsk embeddings for client interactions

### Authentication and Authorization

**Current State**: Basic user model prepared but no authentication implemented

**Planned Architecture**:
- Session-based authentication using `express-session`
- PostgreSQL session store via `connect-pg-simple`
- Password hashing (library not yet included)
- User credentials in users table

### External Dependencies

**UI Framework**:
- shadcn/ui component library (Radix UI primitives)
- Tailwind CSS with custom configuration
- Lucide React for icons
- Custom fonts: Archivo, Lato (Google Fonts)

**Development Tools**:
- Vite for build and development server
- TypeScript with strict mode enabled
- ESLint and formatting (configured via Replit plugins)
- Hot module replacement in development

**Third-Party Services**:
- **Stripe**: Payment processing for coaching packages and retreats (ACTIVE)
  - Secure server-side price validation via COACHING_PACKAGES catalog
  - EUR currency for European pricing
  - Three coaching packages: Single Session (€180), Transformation Package (€840), Team Workshop (€1,200)
- Neon Database: PostgreSQL hosting (Planned)
- Google APIs: Dynamic content sourcing (Planned)
- Notion API: Content management and updates (Planned)
- Typeform/VideoAsk: Interactive client onboarding and feedback (Planned)
- Custom domain: www.greenelephant.org

**Data Fetching**:
- TanStack Query for server state with custom fetch wrapper
- Credential-based requests for session handling
- Error handling with automatic toast notifications

**Design Assets**:
- Generated images stored in `attached_assets/generated_images/`
- Logo and icons in `attached_assets/`
- Image imports via Vite aliases (`@assets`)

**Styling Utilities**:
- `class-variance-authority` for component variant management
- `clsx` and `tailwind-merge` for conditional class names
- Custom Tailwind theme extending base colors with lens taxonomy

**Form Management**:
- React Hook Form for form state
- Zod schemas for validation
- `@hookform/resolvers` for integration

**Date Handling**:
- `date-fns` for date formatting and manipulation

**Carousel/Interactive Elements**:
- `embla-carousel-react` for image carousels
- `cmdk` for command palette components