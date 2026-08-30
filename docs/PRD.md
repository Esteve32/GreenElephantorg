# MyFive — Consolidated PRD — Master v1.4.0 — Codebase Extension & Refactoring

## Document Authority & Repository Integration

This document serves as the canonical **Product Requirements Document (PRD v1.4.0)** for **MyFive** (`myfive.greenelephant.org`), developed as a modular extension and codebase upgrade of the primary **`GreenElephantorg`** repository. 

* **Canonical Location:** `docs/PRD.md` inside the `GreenElephantorg` repository.
* **Governing Decision Authority:** Governed by `docs/DECISION_LOG.md` (Decision Log v11.1).
* **Architecture Strategy:** Brownfield extension and refactoring of the existing `GreenElephantorg` stack (`React` + `Vite` + `Express` + `Neon PostgreSQL` + `Drizzle ORM` + `Stripe`).

---

## v1.4 Change Log (Codebase Extension & Refactoring Update)

1. **Refactoring & Codebase Extension Strategy:** Re-anchored the architecture from a greenfield setup to a brownfield extension of the existing `GreenElephantorg` codebase, reusing its Express server, React/Vite frontend, Neon PostgreSQL database, and Tailwind/Radix UI design system.
2. **Stripe Pay Gates Integration:** Updated Section 3 and Module 1/2 requirements following **Decision Log v11.1 (DEC-033 Δ)** to bring Stripe Pay Gates (€4.99/mo subscription tiers, 5-seat partner sponsorship, and B2B EAP voucher redemptions) into active MVP scope using existing `@stripe/stripe-js` and Express backend checkout routes.
3. **Repository Path Standardization:** Standardized all documentation references to repository-relative paths (`docs/PRD.md` and `docs/DECISION_LOG.md`).
4. **Unified Schema Extension:** Extended the existing Drizzle schema (`shared/schema.ts`) to incorporate MyFive relational tables (`users`, `check_ins`, `relationship_agreements`, `consent_ledger`) alongside existing platform tables.

---

## Table of Contents

* [Part 1 — Constitution, Socio-Clinical Foundations, & Experience Architecture](#part-1--constitution-socio-clinical-foundations--experience-architecture)
  * [Module 0 — Constitution, Refactoring Strategy & Dependency Map](#module-0--constitution-refactoring-strategy--dependency-map)
  * [Module 1 — Product, Experience, Pay Gates and Human Settings](#module-1--product-experience-pay-gates-and-human-settings)
* [Part 2 — Data Model, Consent, and Admin Operations](#part-2--data-model-consent-and-admin-operations)
  * [Module 2 — Extended Data Model, Data Flow, Consent, and GDPR by Design](#module-2--extended-data-model-data-flow-consent-and-gdpr-by-design)
  * [Module 3 — Admin Control Plane & Operations](#module-3--admin-control-plane--operations)
* [Part 3 — Connections, Notifications, and Technical Delivery](#part-3--connections-notifications-and-technical-delivery)
  * [Module 4 — Connections, Notifications, and Celestial Rhythm](#module-4--connections-notifications-and-celestial-rhythm)
  * [Module 5 — Codebase Architecture, Security, and Modular Delivery](#module-5--codebase-architecture-security-and-modular-delivery)
* [Open Conflicts & Verification Register](#open-conflicts--verification-register)
* [Unified Requirements Index](#unified-requirements-index)

---

# Part 1 — Constitution, Socio-Clinical Foundations, & Experience Architecture

## Module 0 — Constitution, Refactoring Strategy & Dependency Map

This document establishes the canonical constitution, architectural boundaries, and modular contracts for **MyFive** as an extension of **GreenElephantorg**. Operating as **PRD Module 0 (v1.4)**, this framework enforces strict governance over engineering phases, fully integrated with **`docs/DECISION_LOG.md` (v11.1 Update)**.

---

### 1. Constitutional Purpose & Codebase Extension Strategy

#### 1.1 Constitutional Mandate
The purpose of this PRD is to guide the refactoring of `GreenElephantorg` and the implementation of MyFive, maintaining strict adherence to human direction. Every technical deployment, schema migration, or interface component must trace back to `docs/DECISION_LOG.md`.

#### 1.2 The Codebase Integration Model
MyFive is built directly inside the `GreenElephantorg` repository:
* **Frontend:** Modular routes under `client/src/pages/myfive/` sharing the existing Tailwind/Radix UI design system and React component library.
* **Backend:** Express API router mounted at `/api/myfive/` inside `server/routes/myfive.ts`.
* **Database:** Unified Drizzle ORM models in `shared/schema.ts` targeting the primary Neon PostgreSQL instance.
* **Pay Gates & Subscriptions:** Integrated with existing Stripe JS and Express payment endpoints (`server/routes/stripe.ts`).

---

### 2. Methodology & Core Philosophy

- **The Compass Metaphor:** The application provides orientation (a compass) for up to five core relationships, shifting focus from screen retention to real-world relational depth.
- **Anti-Metric Philosophy:** Success is measured in autonomous relationships created and graduation. Time spent in-app is minimized.
- **Hard Dunbar Cap:** One account supports a maximum of five active connection seats with other people, plus a dedicated self-reflection slot (*Philautia*).

---

### 3. Value Proposition & Stripe Pay Gates Integration

#### 3.1 Premium Infrastructure & Pay Gates (In Scope)
MyFive operates as premium emotional infrastructure. In accordance with **Decision Log v11.1 (DEC-033 Δ)**, Stripe pay gates are **IN SCOPE** for the MVP launch, leveraging the existing Stripe integration in `GreenElephantorg`.

#### 3.2 B2C Subscription & The Sponsorship Model (€4.99/mo)
- **Primary Subscription (€4.99/month):** Covers the primary account holder and includes 5 sponsored connection seats.
- **Sponsorship Mechanics:** The subscriber gifts seats to partners or friends. Sponsored partners access the shared dyadic workspace for free without needing their own paid subscription.
- **Payment Processing:** Managed via Stripe Checkout and Stripe Link using existing `@stripe/stripe-js` hooks in `client/src/` and Express backend webhooks.

#### 3.3 B2B Employee Assistance Program (EAP) Vouchers
- **Voucher Model:** HR departments purchase bulk voucher codes (e.g., 100 codes for €1,500).
- **Private Redemption:** Employees redeem codes for isolated B2C accounts. Employer monitoring and aggregate dashboards remain permanently banned to ensure privacy compliance under Finnish labor laws.

---

# Part 2 — Data Model, Consent, and Admin Operations

## Module 2 — Extended Data Model, Data Flow, Consent, and GDPR by Design

### 1. Database Integration (`shared/schema.ts`)

MyFive extends the existing Drizzle ORM schema in `shared/schema.ts` with four isolated tables:

1. **`users` / `myfive_profiles`**: Links primary Google OAuth identity with subscription and sponsorship seat status.
2. **`check_ins`**: Private self-reflection vault for Needs, runic reflections, and flow state evaluations (strictly isolated from partner IDs).
3. **`relationship_agreements`**: Collaborative contracts co-created by a connection dyad.
4. **`consent_ledger`**: Immutable, append-only compliance log for user authorization handshakes and GDPR Article 6 records.

---

## Module 3 — Admin Control Plane & Operations

- **Separation of Duties:** Steward (System Admin), Host (Operational Support), and Participant (User).
- **Resend Transactional Email Engine:** Data-minimized notification templates processed via `greenelephant.org` domain.
- **Emergency Kill Switch:** Covered control plane toggle to immediately pause external API sync loops and outbound messaging.

---

# Part 3 — Connections, Notifications, and Technical Delivery

## Module 5 — Codebase Architecture, Security, and Modular Delivery

### 1. File Structure in `GreenElephantorg`

```text
GreenElephantorg/
├── docs/
│   ├── PRD.md                       <-- Canonical PRD Master (This Document)
│   └── DECISION_LOG.md              <-- Decision Log v11.1
├── client/
│   └── src/
│       ├── components/              <-- Shared UI components
│       └── pages/
│           ├── home.tsx             <-- Existing main site routes
│           └── myfive/              <-- MyFive extension views & HUD
├── server/
│   ├── index.ts                     <-- Express server entry point
│   └── routes/
│       ├── stripe.ts                <-- Stripe Checkout & Webhook handlers
│       └── myfive.ts                <-- MyFive API endpoints
├── shared/
│   └── schema.ts                    <-- Extended Drizzle ORM schema
```

---

## Unified Requirements Index (Key Highlights)

| ID | Title | Module | MoSCoW | Status |
| :--- | :--- | :--- | :--- | :--- |
| **UX-001** | Dark Mode Organic Morphism HUD | M1 | Must | **Active** |
| **UX-002** | Hard 5-Connection Dunbar Cap | M1 | Must | **Active** |
| **UX-007** | Unskippable 9 ValueRules™ Consent Gate | M1 | Must | **Active** |
| **UX-013** | Stripe Pay Gates & €4.99/mo Checkout | M1 | Must | **Active (v11.1)** |
| **DAT-001** | Private Check-ins / Agreements Schema Separation | M2 | Must | **Active** |
| **DAT-004** | Sponsorship Mapping Database Model | M2 | Must | **Active** |
| **ADM-004** | SPF/DKIM/DMARC Resend Email Operations | M3 | Must | **Active** |
