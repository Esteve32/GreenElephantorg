# GreenElephant.org - Conscious Communication Platform

## Overview

GreenElephant.org is a spiritual transformation platform focused on conscious communication, built around the "Periodic Table of Conscious Communication" framework. The platform serves Executive Assistants, TEAL startup founders, and Design & Innovation students through retreats, coaching, research, and educational resources. The application emphasizes inclusive spiritual principles with a unique "Head-Up Display" (HUD) design aesthetic featuring dark backgrounds with semi-transparent white overlays.

**Recent Updates (November 2025)**:
- **UX Enhancements & Button Harmonization (Nov 11 - Late)**:
  - **Button Icons Harmonized**: All buttons now use `currentColor` inheritance for icons/arrows (ArrowRight, Download, AlertTriangle) ensuring automatic color matching with button text across all pages
  - **Enhanced Recommendation Flow**: Transformed "Choose Your Path" into 4-stage interactive experience:
    - **Stage 1 (Questionnaire)**: Progress indicator showing "X of 3 completed" with disabled CTA until all questions answered
    - **Stage 2 (Calculating)**: Framer Motion breathing animation (2.5s) with `useReducedMotion` fallback for accessibility
    - **Stage 3 (Results)**: Personalized recommendation + inline gratitude form (name, email, phone, preferred contact time)
    - **Stage 4 (Submitted)**: Success banner with option to retake assessment
  - **Backend Support**: POST /api/recommendations endpoint with Zod validation, MemStorage persistence, recommendationSubmissions schema
  - **Form Features**: Select dropdown for preferred contact time (Morning/Afternoon/Evening), inline error display, toast notifications, retry capability on error
  
- **Major Content Overhaul (Nov 11)**:
  - **Hero & Messaging**: Transformed main headline from "Transform Conflicts Into Trust" to "Turn Every Conversation Into Sacred Practice"
  - **AI vs Human Narrative**: Added powerful positioning: "Communication is not soft. It's the only interface AI cannot automate for you."
  - **Navigation Reordering**: Services now ordered as Coaching, Consulting, Retreats (previously Retreats, Coaching, Consulting)
  - **Email Migration**: All contact points updated to anu@greenelephant.org throughout the site
  - **Social Links**: Added LinkedIn (greenelephant-org) and YouTube playlist integration to footer
  - **Direct Booking**: Added Calendly link (anu-greenelephant/call-with-anu) to Contact page
  - **Content Refinement**: Removed "healing" from "healing and authentic connection" - replaced with "authentic connection and meaningful relationships"
  
- **Coaching Packages Major Update (Nov 11)**:
  - **Coaching Journey** (NEW): €2,980, ~6 months, unlimited sessions with AI-powered Satellite Scan™
  - **Single Session**: Updated to 120 minutes (from 90), €295 (from €180)
  - **Team Workshop**: Confirmed half-day intensive for up to 10 people at €1,200
  - **Coaching Process Section**: Added 4-step Discovery → Design → Practice → Mastery framework
  - Server-side pricing catalog updated for secure validation
  
- **Retreats Transformation (Nov 11)**:
  - **Dates Switched**: September = Provence, March = Lapland (previously reversed)
  - **Location Update**: Changed from "Tonttumäki" to "Levi" (well-known ski resort) for credibility
  - **Removed Northern Lights**: Now emphasizes "peace and quiet of Finnish nature" (no unguaranteed promises)
  - **Pricing**: Increased to €2,890 (from €2,200-2,400) with clear "Excludes food, accommodation & travel" note
  - **Focus Shift**: Reframed around conflict transformation: "Transform how you see conflict" with specific outcomes

- **Periodic Table Enhancements (Nov 11)**:
  - **Copy-to-Clipboard**: Added one-click copy button for all 129 example prompts with toast confirmation
  - **Category Reorganization**: Moved all "THINK & UNDERSTAND" items into "FEEL & INTEND" category
  - **Example Prompts**: All 129 elements now have NVC-based, emotionally intelligent example prompts
  
- **Partner Updates (Nov 11)**:
  - Removed: Helsinki University
  - Added: Aalto Design Factory
  - Newsletter signup language: Removed frequency promises ("weekly" → generic "insights")

- **Previous Updates (Nov 10)**:
  - **Value Proposition Overhaul**: Implemented comprehensive "Promise → Path → Proof" framework across all 11 pages
  - **Periodic Table**: Added "How to apply today" 3-step guidance with testimonial for credibility
  - Stripe payment integration with secure server-side price validation
  - 8 downloadable resources (periodic table PNG + 7 PDF/image infographics)
  - Applied 66% opacity to periodic table element backgrounds
  - Fixed icon contrast to 95% lightness for visibility on colored lens backgrounds

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
- Home: Hero with "AI vs Human" narrative and framework overview
- Periodic Table: 129 elements with copy-to-clipboard functionality and NVC-based example prompts
- Retreats: "Equinoxe Retreats" - Sept (Provence), March (Levi, Finland) at €2,890
- Coaching: 3 packages including new Coaching Journey (€2,980, 6 months, unlimited sessions)
- Lab (Arbora): Research articles with Aalto Design Factory partnership
  - Route: `/lab` (canonical), `/arbora` (alias)
- Resources/Prompts: Filterable prompt library with downloadable materials
  - Route: `/resources` (canonical), `/prompts` (alias)
- Contact: Intent-based form with direct Calendly booking (anu@greenelephant.org)
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
  - Secure server-side price validation via COACHING_PACKAGES catalog in `shared/packages.ts`
  - EUR currency for European pricing
  - Three coaching packages: Single Session (€295), Coaching Journey (€2,980), Team Workshop (€1,200)
- **Calendly**: Direct booking integration (anu-greenelephant/call-with-anu)
- **YouTube**: Playlist integration for community access
- **LinkedIn**: Company page (greenelephant-org)
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