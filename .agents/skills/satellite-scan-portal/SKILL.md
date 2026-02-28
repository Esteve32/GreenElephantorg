---
name: satellite-scan-portal
description: Build plan for the Satellite Scan client portal — turning the Google Slides dashboard into an interactive web app with client login, 15+ chart types, and coach admin. Use when the user says "Satellite Scan Portal" or asks about building the client dashboard.
---

# Satellite Scan Portal — Build Plan

## Overview
Turn the existing 70-slide Google Slides "Satellite Scan Dashboard" into an interactive, web-based client portal within the GreenElephant.org React stack. Clients log in to view their personalized communication analysis; coaches manage accounts and assign scan data.

## Trigger Phrases
- "Let's work on the Satellite Scan Portal"
- "Client dashboard" / "client portal"
- "Scan dashboard web app"

## Source Documents
- **Dashboard template**: Google Slides — `https://docs.google.com/presentation/d/129c1JmY5kqBfTAtUMnTYXFeCcZf52Gj_84vlG8InOAM/`
- **Data source**: Google Sheets — `https://docs.google.com/spreadsheets/d/11dKNeCJcKizW63dmFxggO1-D5K3wGLKZ8sMKRTZAKVo/`
- **Spreadsheet ID**: `11dKNeCJcKizW63dmFxggO1-D5K3wGLKZ8sMKRTZAKVo`
- **PDF spec**: `attached_assets/_🔬_(Template)_Master_Individual_Satellite_Scan_Dashboard_Gree_1772220585878.pdf`

## Existing Infrastructure (already built)
- **Google Sheets integration**: `server/lib/googleSheets.ts` — authenticated via Replit connectors, `getSheetData()` function ready
- **Recharts**: Installed (`recharts@^2.15.2`), wrapper component at `client/src/components/ui/chart.tsx`
- **Auth system**: `express-session` + `connect-pg-simple` in `server/index.ts`, admin auth in `server/auth.ts`
- **Design system**: Dark HUD aesthetic (bg #0a0a0a, teal #009999, 8 lens colors defined in CSS variables), Poppins headings, Lato body
- **Lens colors** (from `client/src/index.css`):
  - Influence: `0 70% 55%` (red)
  - Attitude: `30 100% 60%` (orange)
  - Chaordic: `48 100% 55%` (yellow)
  - Flow: `85 55% 50%` (green)
  - Alignment: `100 40% 45%` (dark green)
  - Needs: `180 100% 35%` (teal)
  - Ego: `210 60% 50%` (blue)
  - Dynamics: `260 35% 50%` (purple)
- **Email system**: Branded dark HUD email wrapper (`brandedEmailWrapper` in `server/email-notifications.ts`)
- **Notion CRM**: Two-way sync via `server/lib/notionSync.ts`

## Hour Estimates Summary
| Phase | Agent Time | Your Review Time |
|-------|-----------|-----------------|
| Phase 1: Auth & Data Model | 10-14h | 1-2h |
| Phase 2: Google Sheets Pipeline | 12-18h | 2-3h |
| Phase 3: Chart Components | 20-35h | 4-6h |
| Phase 4: Dashboard Layout | 16-24h | 2-3h |
| Phase 5: AI Text & Micro-Habits | 10-16h | 2-3h |
| Phase 6: PDF Export & Polish | 8-12h | 1-2h |
| **Total** | **76-119h** | **12-19h** |

## Reference Documents
- `reference/dashboard-spec.md` — Full chart/component specification for each dashboard section
- `reference/data-mapping.md` — Google Sheets column mapping to dashboard data fields

---

## Phase 1: Auth & Client Data Model
**Goal**: Clients can log in and coaches can manage client accounts.

### Database
- Create `scan_clients` table in `shared/schema.ts`:
  - `id` (UUID, PK)
  - `email` (text, unique, not null)
  - `name` (text, not null)
  - `passwordHash` (text, not null)
  - `assignedAt` (timestamp) — when their scan was assigned
  - `spreadsheetRow` (integer) — which row in the master spreadsheet holds their data
  - `createdAt` (timestamp)
  - `lastLoginAt` (timestamp)
- Add insert schema + types

### Auth Routes (in `server/routes.ts`)
- `POST /api/portal/login` — client login (separate from admin)
- `GET /api/portal/check` — check client session
- `POST /api/portal/logout` — destroy client session
- Middleware: `requireClientAuth` in `server/auth.ts`

### Frontend
- `/portal/login` — client login page (dark HUD styled)
- `/portal` — redirect to dashboard if authenticated, login if not

### Coach Admin
- New tab in admin panel: "Client Accounts"
- Create/edit/delete client accounts
- Assign spreadsheet row to each client
- Send welcome email with login credentials (using branded email wrapper)

### GDPR Checklist
- Welcome email sent when account is created (branded dark HUD template)
- GDPR footer explaining why they received the email

---

## Phase 2: Google Sheets Data Pipeline
**Goal**: Each client's scan data flows from the spreadsheet to their portal view.

### Data Fetching
- Extend `server/lib/googleSheets.ts` with:
  - `getClientScanData(spreadsheetId, rowNumber)` — fetch a single client's row
  - `parseClientScanRow(row)` — parse raw values into typed `ScanData` object
- Target spreadsheet: `11dKNeCJcKizW63dmFxggO1-D5K3wGLKZ8sMKRTZAKVo`

### API Routes
- `GET /api/portal/my-scan` — client's own data (uses session to find spreadsheet row)
- `GET /api/portal/scans/:clientId` — coach view of any client's data (admin-protected)

### Caching
- Cache parsed scan data in memory (or Redis if available) with 15-minute TTL
- Invalidate on manual refresh from coach admin

### Data Model
- Create `ScanData` TypeScript interface in `shared/schema.ts` covering all ~30 data fields
- See `reference/data-mapping.md` for full field list

---

## Phase 3: Chart Components
**Goal**: Build ~15 reusable, dark-HUD-styled chart components using Recharts.

### Component Directory
Create `client/src/components/charts/` with:

1. **RadarChart** — 8-lens overview, alignment view (spider/radar)
2. **GaugeMeter** — 1-10 scale displays (competence, motivation, challenge, growth focus, etc.)
3. **HorizontalBarChart** — needs (7 categories), barriers (5 metrics), order/structure scores
4. **CircularChart** — ego triggers (donut/pie), feedback quality
5. **QuadrantPlot** — flow chart (challenge y-axis vs competence x-axis, with zone labels)
6. **SpectrumChart** — chaordic balance (kaamos → chaos → order → control)
7. **PolarityChart** — lead/follow, freedom/love axes
8. **GroupedBarChart** — GBR non-verbal competences (timing, rhythm, body language, silence, intonation)
9. **StackedComparisonChart** — give/receive feedback comparison
10. **StageChart** — team needs (5 formation stages with role mapping)
11. **EgoRolesChart** — 10 ego roles as horizontal bars with role labels
12. **ConversationLevelsChart** — 4 levels of conversation competence
13. **ConflictSpectrumChart** — dysfunctional ↔ functional conflicts
14. **CongruenceChart** — GBR average across verbal/non-verbal/intentions (3×3 grid)
15. **ScoreCard** — simple number display with label, used for single metrics

### Styling Rules
- All charts use dark background (#111111 card bg on #0a0a0a page bg)
- Lens-specific colors from CSS variables
- GBR colors: Green (#009999 area), Blue (#3b82f6 area), Red (#ef4444 area)
- Poppins for chart titles, Lato for labels/values
- Responsive: min-width constraints, graceful mobile fallback

---

## Phase 4: Dashboard Layout & Navigation
**Goal**: Assemble charts into a navigable dashboard matching the slide structure.

### Page Structure
- Route: `/portal/dashboard`
- Section-based layout with sidebar or tab navigation
- Sections (matching slide order):
  1. **Summary** — superpowers, top-level scores
  2. **Ego** — triggers, comparison, hats, demographics, barriers, intentions, verbal
  3. **Dynamics** — relationships, polarity, relationship dynamics
  4. **Influence** — GBR focus, key behaviours, efficacy, non-verbal, intentions, verbal
  5. **Attitude** — growth focus, attitude to change, learning needs, action learning
  6. **Chaordic** — freedom score, wasted time, balance, roles, conversation levels
  7. **Flow** — motivation, competence, challenge, quadrant, perceived feeling, feedback
  8. **Alignment** — radar overview (think/say/feel/do), congruence
  9. **Needs** — individual needs (7 categories), team needs (5 stages), conflicts, assumptions

### Navigation
- Left sidebar or top tabs showing lens icons with lens colors
- Current section highlighted
- Progress dots showing which sections have been viewed
- "Download PDF" button in header

### Layout per Section
- 2-3 column grid on desktop
- Each chart in a dark Card component
- Chart title + description text below each visualization
- Data reference labels (e.g., "7104", "7105") shown as subtle tags

---

## Phase 5: AI Text & Micro-Habits
**Goal**: Display the personalized coaching content alongside the charts.

### Superpowers Section
- 5 numbered items with title + description paragraph
- Rendered as styled cards with numbering
- Source: dedicated columns in Google Sheets (AI-generated per client)

### Coaching Advice
- Three sub-sections: Verbal, Non-Verbal, Values & Intentions
- Each has 3 numbered advice items with:
  - Title
  - Description paragraph
  - "Vinkki" (tip) with example phrases
  - "Ehdotus" (suggestion) with practice exercises
- Rendered as expandable/collapsible cards

### Micro-Habits
- Table format: Habit Name | Trigger | Action | Reward
- 5 custom habits per client + 5 generic habits
- Styled as a dark table or card grid

### Self-Reflection Questions
- 5 numbered questions
- Simple styled list

---

## Phase 6: PDF Export & Polish
**Goal**: Clients can download their dashboard as a PDF; final quality pass.

### PDF Export
- "Download PDF" button generates a PDF matching the Google Slides output
- Use a library like `html2pdf.js` or `@react-pdf/renderer`
- Include all sections, charts rendered as images
- GreenElephant branding (logo, colors, footer)

### Printable Worksheets
- Summary notes template (8 lenses with blank lines)
- Elements notes grid (periodic table element IDs)
- Micro-habit design template

### Coach Admin Enhancements
- View list of all clients with last login date
- Quick link to view any client's dashboard
- Bulk account creation (CSV upload)

### GDPR & Notifications
- Portal welcome email (branded dark HUD template)
- Notion CRM sync: add "Portal" to channels reached
- Admin notification when new client first logs in

### Testing & Polish
- Cross-browser testing
- Responsive layout verification
- Loading states and error handling
- Accessibility check (contrast ratios, keyboard navigation)
