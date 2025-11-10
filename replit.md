# GreenElephant.org - Conscious Communication Platform

## Overview

GreenElephant.org is a spiritual transformation platform focused on conscious communication, built around the "Periodic Table of Conscious Communication" framework. The platform serves Executive Assistants, TEAL startup founders, and Design & Innovation students through retreats, coaching, research, and educational resources. The application emphasizes ACIM-aligned principles with a unique "Head-Up Display" (HUD) design aesthetic featuring dark backgrounds with semi-transparent white overlays.

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
- Custom color palette based on 8 communication lenses (Influence, Attitude, Chaordic, Flow, Alignment, Needs, Ego, Dynamics)
- Typography: Archivo for headlines, Lato for body text
- Spacing follows 4/8/12/16/24/32 pixel scale
- Glass-morphism effects with backdrop blur for modals and navigation

**Key Pages**:
- Home: Hero section with framework overview and lens visualization
- Periodic Table: Interactive grid of communication elements, filterable by lens
- Retreats: Seasonal event showcases (Lapland/Provence)
- Coaching: Package comparison with 1:1 and team options
- Lab (Arbora): Research articles and insights
- Resources/Prompts: Filterable prompt library and learning materials
- Contact: Intent-based contact form with smart routing
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

**Third-Party Services** (Planned):
- Neon Database: PostgreSQL hosting
- Google APIs: Dynamic content sourcing
- Notion API: Content management and updates
- Typeform/VideoAsk: Interactive client onboarding and feedback
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