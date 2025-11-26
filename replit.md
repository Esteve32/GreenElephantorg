# GreenElephant.org - Conscious Communication Platform

## Overview
GreenElephant.org is a spiritual transformation platform focused on conscious communication, leveraging the "Periodic Table of Conscious Communication" framework. It targets Executive Assistants, TEAL startup founders, and Design & Innovation students through retreats, coaching, research, and educational resources. The platform aims to foster authentic connection and meaningful relationships, transforming conflicts into trust, and positioning communication as a critical human interface beyond AI automation.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React and TypeScript, using Vite for bundling and Wouter for client-side routing. `shadcn/ui` (built on Radix UI) provides the component library, styled with Tailwind CSS and a custom design system. State management uses TanStack Query, and forms are handled with React Hook Form and Zod. The design system is dark mode-first, featuring a "Head-Up Display" (HUD) aesthetic with dark backgrounds, semi-transparent white overlays, a custom color palette based on 8 communication lenses, Poppins for headlines, and Lato for body text. Key pages include Home, Periodic Table, Retreats, Coaching, Team, Resources/Prompts, Contact, Stories, References, and educational pages.

### Backend Architecture
The backend uses Express.js with TypeScript, providing a minimal REST API. It includes an abstract storage interface with an in-memory implementation for development, designed for future migration to Drizzle ORM with PostgreSQL. All API routes are prefixed with `/api`, use JSON for requests/responses, and include request logging.

### Data Storage Solutions
The project is prepared for PostgreSQL using Neon serverless, with Drizzle ORM configured. Schema definitions are in `shared/schema.ts` with Zod validation. The current fallback is in-memory storage.

### Authentication and Authorization
A basic user model is prepared, but authentication is not yet implemented. The planned architecture involves session-based authentication using `express-session` and a PostgreSQL session store via `connect-pg-simple`.

## External Dependencies

### UI Framework
- shadcn/ui (Radix UI primitives)
- Tailwind CSS
- Lucide React (icons)
- Google Fonts: Archivo, Lato

### Third-Party Services
- **Stripe**: Payment processing
- **Calendly**: Direct booking integration
- **YouTube**: Playlist integration
- **LinkedIn**: Company page
- **Resend**: Email notifications
- **Thesys.dev API**: AI-powered communication lens visualization
- **Notion CRM**: Two-way contact sync (database ID: 8818608d251c426c8538920ec88bbde3)

## Notion CRM Integration

### Two-Way Sync Feature
The platform includes automatic two-way synchronization between the database contacts and the Notion CRM:

**Auto-sync on contact creation:**
- New contacts from waitlist, newsletter, or quiz forms are automatically pushed to Notion

**Admin sync endpoints (require authentication):**
- `GET /api/admin/notion/schema` - Verify Notion connection and view database properties
- `GET /api/admin/notion/unsynced` - Get contacts not yet synced to Notion
- `POST /api/admin/notion/push` - Push all contacts to Notion
- `POST /api/admin/notion/pull` - Pull updates from Notion (creates new contacts if they don't exist locally)
- `POST /api/admin/notion/sync` - Full two-way sync (pull first, then push)

**Field mappings:**
- Name → Name (title)
- Email → Email
- Source → Source (select: Waitlist, Newsletter, Recommendation, Quiz)

**Technical notes:**
- Uses Replit's Notion connector for OAuth authentication
- Sync tracking via `notionPageId` and `notionSyncedAt` fields in contacts table
- Pull preserves existing local data; only updates name and sync metadata