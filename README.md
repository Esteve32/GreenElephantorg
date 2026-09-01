# GreenElephant.org — Platform & MyFive Extension Repository

Welcome to the primary repository for **Green Elephant Oy** (`greenelephant.org`) and the **MyFive** relational compass extension (`myfive.greenelephant.org`).

This repository is built as a production-grade full-stack web application (`React` + `Vite` + `Express` + `Neon PostgreSQL` + `Drizzle ORM` + `Stripe`), serving both the main organizational website and the modular **MyFive** relationship ecosystem.

---

## 🏛️ System Architecture Overview

```mermaid
graph TD
    subgraph Client ["Client Tier (React 18 + Vite + Wouter)"]
        Site["Main Website Routes<br/>(/, /scan, /coaching, etc.)"]
        MyFive["MyFive Extension HUD<br/>(/myfive/*)"]
    end

    subgraph Server ["Server Tier (Express.js + Node.js)"]
        MainAPI["Main Platform Router<br/>(/api/*)"]
        MyFiveAPI["MyFive Extension Router<br/>(/api/myfive/*)"]
        AuthMiddleware["Admin & OAuth Middleware"]
    end

    subgraph Storage ["Data Tier (Neon Serverless PostgreSQL)"]
        Drizzle["Drizzle ORM Models (shared/schema.ts)"]
        PlatformTables[("Platform Tables<br/>contacts, users, purchases")]
        MyFiveTables[("MyFive Tables<br/>slots, check_ins, agreements")]
    end

    subgraph Services ["External Integrations"]
        Stripe["Stripe Checkout & Pay Gates"]
        Resend["Resend Transactional Email"]
        Notion["Notion CRM Sync"]
    end

    Site --> MainAPI
    MyFive --> MyFiveAPI
    MainAPI --> AuthMiddleware
    MyFiveAPI --> AuthMiddleware
    AuthMiddleware --> Drizzle
    Drizzle --> PlatformTables
    Drizzle --> MyFiveTables
    MainAPI --> Services
    MyFiveAPI --> Services
```

---

## 🧭 MyFive Extension Architecture & Data Boundaries

**MyFive** operates as a calm, intentional "compass" for up to 5 core relationships, incorporating strict data minimization and GDPR Article 6/17 compliance.

```mermaid
flowchart LR
    subgraph UserHUD ["MyFive HUD (/myfive/dashboard)"]
        Philautia["Philautia Vault<br/>(Slot 0: Self-Care)"]
        Seat1["Partner Seat 1"]
        Seat2["Partner Seat 2"]
        Seat3["Partner Seat 3"]
        Seat4["Partner Seat 4"]
        Seat5["Partner Seat 5"]
    end

    subgraph Vault ["Confidential Private Vault"]
        BlindCheckIn["Private Check-Ins<br/>(100% Blind to Partners & Admins)"]
        Octants["Csikszentmihalyi 8-Octant Flow"]
    end

    subgraph DyadicSpace ["Dyadic Shared Space"]
        ConsentGate{"9 ValueRules™<br/>Consent Gate"}
        SharedAgreements["Living Dyadic Agreements<br/>(Versioned & Timestamped)"]
    end

    subgraph PayGate ["Stripe Pay Gate"]
        B2CPlan["€4.99/mo Primary Plan<br/>(Includes 5 Sponsored Seats)"]
    end

    Philautia --> BlindCheckIn
    UserHUD --> PayGate
    Seat1 & Seat2 & Seat3 & Seat4 & Seat5 --> ConsentGate
    ConsentGate -->|Explicit Both-Partner Consent| SharedAgreements
```

---

## 📂 Repository Directory Structure

```text
GreenElephantorg/
├── docs/
│   ├── PRD.md                       <-- Canonical PRD Master (v1.4.0)
│   └── DECISION_LOG.md              <-- Approved Decision Log (v11.1) & Stage Checklist
├── client/
│   └── src/
│       ├── components/              <-- Shared UI components (Radix UI, Tailwind)
│       ├── pages/
│       │   ├── HomePage.tsx         <-- Existing greenelephant.org pages
│       │   └── myfive/              <-- MyFive extension views & HUD
│       │       ├── LandingPage.tsx   <-- Hero banner & value proposition
│       │       ├── DashboardPage.tsx <-- 5-Dunbar seat HUD & Philautia vault
│       │       ├── CheckInPage.tsx   <-- Private 8-Octant flow check-in
│       │       ├── AgreementPage.tsx <-- Unskippable 9 ValueRules™ Consent Gate
│       │       └── SettingsPage.tsx  <-- Stripe pay gates & GDPR cascade wipe
│       └── App.tsx                  <-- Wouter client router configuration
├── server/
│   ├── index.ts                     <-- Express server entry point
│   ├── routes.ts                    <-- Main platform Express routes
│   └── routes/
│       └── myfive.ts                <-- MyFive API router (/api/myfive/*)
└── shared/
    └── schema.ts                    <-- Unified Drizzle ORM PostgreSQL schema
```

---

## 🚦 Stage-Gated Development Progress

Development follows the stage gates outlined in `docs/DECISION_LOG.md`:

| Stage | Status | Focus Area |
| :--- | :--- | :--- |
| **Stage 0** | **COMPLETED** | Repository scaffolding, PRD v1.4.0, MyFive routes, Express router, Drizzle schemas. |
| **Stage 1** | **COMPLETED** | Organic Holography design system, glassmorphism, 8-Lens GBR synesthetic tokens. |
| **Stage 2** | **COMPLETED** | Private flow check-ins, 9 ValueRules™ Consent Gate, versioned dyadic agreements, and the enforced 5+1 connection-seat cap. |
| **Stage 3** | **IN PROGRESS** | Stripe €4.99/mo recurring Checkout completed; 5-seat partner sponsorship flow and B2B EAP vouchers remain. |
| **Stage 4** | **PLANNED** | GDPR Article 17 hard cascade wipe, Article 20 JSON/Markdown data exports. |
| **Stage 5** | **PLANNED** | WCAG AA contrast audit, Replit production deployment & custom DNS. |

---

## 🛠️ Developer Quickstart

### 1. Prerequisites & Environment Setup
Ensure Node.js (v18+) is installed. Create a `.env` file in the root directory (or configure Secrets in Replit):
```bash
SESSION_SECRET="your-secure-session-secret"
DATABASE_URL="postgres://user:password@endpoint.neon.tech/neondb?sslmode=require"
STRIPE_SECRET_KEY="sk_test_..." # Optional for local test mode
```

### 2. Install Dependencies & Run Development Server
```bash
npm install
npm run dev
```
The server will start on port `5000` (or Replit's assigned port).

### 3. Verify Key Endpoint Routes
* **Main Website**: `http://localhost:5000/`
* **MyFive HUD Landing**: `http://localhost:5000/myfive`
* **MyFive API Health Check**: `http://localhost:5000/api/myfive/health`

---

## 📄 Canonical Governance & Single Source of Truth

For detailed feature specifications, clinical models, and human-approved governance decisions:
* **Product Requirements**: Read [`docs/PRD.md`](docs/PRD.md)
* **Decision Authority**: Read [`docs/DECISION_LOG.md`](docs/DECISION_LOG.md)
