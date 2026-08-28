# GreenElephant.org Architecture, Environments, Access and Integration Audit

**Status:** Baseline specification for the next website update and codebase refactor  
**Repository:** `Esteve32/GreenElephantorg`  
**Branch reviewed:** `main`  
**Repository tree reviewed at:** `d12fe91dc80993435377cb07bb7fc97f54f008a4`  
**Audit date:** 2026-08-28  
**Scope:** Runtime environments, access boundaries, data stores, external bridges, agent/MCP surfaces, operational risks, and a proposed target architecture.

> This document is a code-backed inventory, not a confirmation that every configured service is currently healthy or that every secret is present in every deployment. Items marked **unverified** require inspection of the Replit deployment, DNS provider, service dashboards, and secret stores.

---

## 1. Executive summary

GreenElephant.org is no longer only a public website. It is a single full-stack application containing:

- a public marketing and product website;
- assessments, quizzes, lead capture and checkout flows;
- a client coaching portal;
- a broad admin/control-room interface;
- a CRM synchronization layer;
- email campaigns and onboarding automation;
- payments and webhook processing;
- analytics, research and SEO tooling;
- OAuth connections for individual portal users;
- AI-assisted content and dashboard generation;
- direct and Replit-mediated integrations with external systems;
- repository-local agent skills and machine-readable service discovery.

The current architecture is operationally convenient but highly concentrated. The React SPA, admin application, client portal, API, background schedules, integration adapters, webhook handlers and data-access layer are built and deployed together. The main risk is therefore not an isolated implementation defect; it is the size of the shared blast radius.

The next update should begin by defining explicit trust zones and integration ownership. The recommended target is a modular monolith first—not an immediate microservice rewrite—with:

1. separately identifiable public, portal and admin application surfaces;
2. feature modules with their own routes, schemas and services;
3. one integration adapter per external system;
4. a central encrypted credential/token vault boundary;
5. durable background jobs outside the web process;
6. explicit environment configuration and validation;
7. an API/MCP strategy that distinguishes public agent discovery, internal AI tools and privileged operational actions.

---

## 2. Current system at a glance

### 2.1 Runtime stack

| Layer | Current implementation |
|---|---|
| Browser application | React 18, Vite, TypeScript, Wouter, TanStack Query |
| UI | Tailwind CSS, Radix/shadcn-style primitives, Framer Motion, Recharts |
| Web/API server | Express 4, TypeScript, Node.js |
| Authentication | Express sessions stored in PostgreSQL; admin password/roles; portal password and OAuth flows |
| Primary database | PostgreSQL on Neon via Drizzle ORM |
| Session database | PostgreSQL through `connect-pg-simple`, sharing the Neon pool |
| Payments | Stripe Payment Intents and webhooks |
| Email | Resend, directly or through a Replit connector |
| CRM | Notion, mainly through a Replit connector; separate per-user Notion OAuth also exists |
| Analytics | Google Analytics 4 Data API and Fathom |
| AI generation | Thesys API using the OpenAI SDK compatibility layer |
| Hosting/development | Replit-oriented development and deployment |
| Source continuity | Public GitHub repository plus a custom Replit-to-GitHub push implementation |
| Scheduling | In-process `setInterval`/startup schedulers |
| Build | Vite client build plus esbuild server bundle |

### 2.2 Main code concentration

| File | Role | Refactor concern |
|---|---|---|
| `server/routes.ts` | Most public, admin, payment, webhook and integration routes | Approximately 291 KB; too many domains and trust levels in one file |
| `server/portal-auth.ts` | Portal authentication and user OAuth connectors | Approximately 58 KB; auth and external data access are tightly coupled |
| `server/email-notifications.ts` | Transactional and campaign email templates/sending | Approximately 99 KB; presentation, orchestration and delivery are combined |
| `server/storage.ts` | Broad persistence facade | Approximately 88 KB; central dependency and large change surface |
| `shared/schema.ts` | Most database tables and validation types | Approximately 38 KB; limited feature ownership |
| `client/src/App.tsx` | Public, admin and portal route registry | One browser bundle/build owns all application surfaces |

---

## 3. Environment map

### 3.1 Environments visible in code and documentation

| Environment | Purpose | Location/identity | Credentials | Data | Confidence |
|---|---|---|---|---|---|
| Local developer machine | Type checking, development, build | Any checkout running `npm run dev` | Local environment variables | Usually shared remote Neon unless overridden | Inferred from scripts |
| Replit workspace/development | Primary interactive development environment | Replit workspace; code expects `REPL_IDENTITY` and `REPLIT_DEV_DOMAIN` | Replit secrets plus connector broker | Neon and connected external services | Strong evidence |
| Replit deployment/production | Public production server | Documentation references `greenelephant-org.replit.app`; custom domain expected | `WEB_REPL_RENEWAL`, deployment secrets and connectors | Production Neon and live services | Strong evidence; live status unverified |
| Public web domain | Customer-facing origin | `https://greenelephant.org` and some references to `www.greenelephant.org` | TLS/DNS managed outside repository | Browser and API traffic | Strong evidence; DNS owner unverified |
| Interview subdomain | Documented secondary entry point | `https://interviews.greenelephant.org` | DNS and Replit custom-domain configuration | Same app route in current documentation | Documented; live status unverified |
| GitHub repository | Public source/backup/continuity layer | `Esteve32/GreenElephantorg`, default branch `main` | Replit GitHub connector and human GitHub access | Source plus committed build output/assets | Confirmed |
| Neon PostgreSQL | Application and session persistence | `DATABASE_URL` | Database URL secret | Users, contacts, purchases, OAuth tokens, settings, audit logs, sessions and product data | Confirmed in code |
| External SaaS environments | Third-party processing/storage | Google, Notion, Stripe, Resend, etc. | API keys, OAuth credentials or Replit connector tokens | Service-specific data | Confirmed in code; account ownership unverified |

### 3.2 Missing or unclear environment separation

No dedicated staging environment, staging database, preview deployment policy, or environment-specific external-service account strategy is visible in the repository.

This creates several likely risks:

- development may call production APIs or read/write production data;
- OAuth callback URLs may be assembled dynamically from `REPLIT_DEV_DOMAIN` or default to the production domain;
- webhook testing may occur against the same handlers and tables as production;
- schema changes use `drizzle-kit push` rather than a clearly reviewed migration promotion path;
- scheduled jobs start when the application process starts, including in environments where they may not be intended;
- connector state is stored at application level, but connector credentials are environment/platform level.

### 3.3 Recommended environment model

| Environment | Database | External services | Scheduled jobs | Deployment gate |
|---|---|---|---|---|
| Local | Local PostgreSQL or isolated Neon branch | Mocks/sandboxes; no production OAuth | Disabled by default | Type check and tests |
| Preview per PR | Ephemeral/branched DB | Sandboxes or read-only test credentials | Disabled | Automated tests, migrations, security checks |
| Staging | Dedicated staging DB | Stripe test mode, test Resend domain, test OAuth apps, staging Notion DB | Explicit staging jobs only | Smoke/E2E approval |
| Production | Production DB | Production accounts and least-privilege credentials | Dedicated job runner | Manual promotion and rollback plan |

Add a typed configuration module that validates configuration once at startup and exposes groups such as `publicConfig`, `databaseConfig`, `emailConfig`, `paymentConfig` and `oauthConfig`. Avoid reading `process.env` throughout route implementations.

---

## 4. Access and trust-boundary map

### 4.1 Human and machine principals

| Principal | Current access path | Effective scope |
|---|---|---|
| Anonymous website visitor | Public pages and public API endpoints | Marketing content, forms, quizzes, service discovery, payments, public QR redirects |
| Portal client | Session after password login or supported OAuth login | Own profile, timeline, context, integrations and coaching/AI features |
| Admin viewer | Admin session with `viewer` role | Intended read-only admin access |
| Admin/editor | Admin session with `admin` role | Intended write access to operational data |
| Super admin | Admin session with `super_admin` role | Full administrative access and team/access management |
| Shared admin-password user | `ADMIN_PASSWORD` fallback login | Legacy/shared-secret access; attribution is weaker |
| Replit runtime identity | `REPL_IDENTITY` in workspace or `WEB_REPL_RENEWAL` in deployment | Requests connector credentials from Replit |
| Replit connector broker | `REPLIT_CONNECTORS_HOSTNAME` | Returns service credentials, including secrets, to the runtime |
| Google service account | `GOOGLE_SERVICE_ACCOUNT_KEY` | GA4 read access; exact project/resource scope unverified |
| External webhook sender | Stripe or Typeform HTTP callback | Can trigger payment/scan workflows if signature controls succeed |
| GitHub connector identity | Replit-brokered GitHub token | Can write to `Esteve32/GreenElephantorg`; exact token scope unverified |

### 4.2 Authentication and authorization mechanisms

#### Admin

- Session flag: `req.session.isAdmin`.
- Role support: `super_admin`, `admin`, `viewer`.
- Middleware: `requireAdminAuth`, `requireAdminRole`, and `requireWriteAccess`.
- Password hashing: scrypt with random salt for the database-stored admin hash.
- Legacy fallback: plain comparison against the `ADMIN_PASSWORD` environment variable.
- Audit middleware covers the `/api/admin` namespace and redacts a limited set of exact field names.

#### Portal

- Session-backed client identity.
- Password credentials and password-reset fields exist.
- Google and LinkedIn can authenticate portal users.
- Notion, Spotify and Oura are user-authorized connectors.
- Portal tokens are persisted on the `client_users` record.

#### Session security

Positive controls:

- PostgreSQL-backed sessions;
- `httpOnly` cookies;
- secure cookies in production;
- `sameSite: "lax"`;
- required `SESSION_SECRET`;
- one-week expiry.

Items requiring remediation or confirmation:

- no centralized CSRF control is visible;
- no session rotation policy is evident from the reviewed startup code;
- no global rate limiter or brute-force protection is visible;
- admin and portal roles should be tested route-by-route, not inferred from namespace;
- OAuth state, PKCE and token-refresh handling require dedicated security tests;
- shared-password fallback should be retired after named admin accounts are established.

### 4.3 Credential and token storage

The schema stores Notion, LinkedIn, Spotify and Oura access/refresh tokens as text columns on `client_users`. The reviewed code does not establish application-level encryption for these values.

**Required redesign:**

1. Encrypt OAuth credentials at rest with a versioned application key or external secret/vault service.
2. Store only the minimum tokens and scopes required.
3. Separate credential records from general profile records.
4. Record provider, subject, scopes, expiry, consent time, revocation state and last refresh.
5. Never return tokens through general user/profile serialization.
6. Add key rotation and mass-revocation procedures.
7. Treat database backups as containing live third-party credentials until migration is complete.

---

## 5. Configuration and secret inventory

The following variables are referenced in runtime code.

### 5.1 Core runtime

| Variable | Purpose | Required status |
|---|---|---|
| `NODE_ENV` | Development/production behavior | Required operationally |
| `PORT` | HTTP listener; defaults to 5000 | Optional |
| `DATABASE_URL` | Neon/PostgreSQL and session store | Required |
| `SESSION_SECRET` | Session signing | Required |
| `ADMIN_PASSWORD` | Legacy/shared admin fallback | Optional but currently operationally significant |
| `REPLIT_DEV_DOMAIN` | Development callback/base URL construction | Replit development only |

### 5.2 Replit connector bridge

| Variable | Purpose |
|---|---|
| `REPLIT_CONNECTORS_HOSTNAME` | Replit connection-broker host |
| `REPL_IDENTITY` | Workspace runtime identity |
| `WEB_REPL_RENEWAL` | Deployment runtime identity/renewal token |
| `REPL_ID` | Enables Replit-specific Vite development plugins |

These variables allow the server to request credential-bearing connector configuration using `include_secrets=true`. They are a high-value trust boundary.

### 5.3 Google

| Variable | Purpose |
|---|---|
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | User/admin Google OAuth |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | GA4 Data API service account |
| `GA4_PROPERTY_ID` | GA4 property |
| `VITE_GA_MEASUREMENT_ID` | Browser Google Analytics identifier |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | Server-side Sheets data source |

### 5.4 Other integrations

| Service | Variables |
|---|---|
| Notion portal OAuth | `NOTION_OAUTH_CLIENT_ID`, `NOTION_OAUTH_CLIENT_SECRET` |
| LinkedIn | `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` |
| Spotify | `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` |
| Oura | `OURA_CLIENT_ID`, `OURA_CLIENT_SECRET` |
| Stripe | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| Resend | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` |
| Typeform | `TYPEFORM_PERSONAL_ACCESS_TOKEN`, `TYPEFORM_FORM_ID` |
| Calendly | `CALENDLY_API_TOKEN` |
| Fathom | `FATHOM_CLIENT_ID`, `FATHOM_CLIENT_SECRET`, `FATHOM_ACCESS_TOKEN` |
| Thesys | `THESYS_API_KEY` |

No values should be added to this document or committed to the repository. Add an `.env.example` containing names, descriptions and safe placeholders only.

---

## 6. Integration and outward-bridge catalog

### 6.1 Integration matrix

| System | Bridge type | Direction | Authentication owner | Data crossing boundary | Current code |
|---|---|---|---|---|---|
| Neon PostgreSQL | Direct database connection | Read/write | Deployment secret | Nearly all operational and identity data | `server/db.ts`, `server/storage.ts` |
| GitHub | Replit connector → Octokit | Outbound write/read | Replit-connected account | Entire workspace source tree and commit metadata | `server/github-client.ts`, `server/github-push.ts` |
| Notion CRM | Replit connector → Notion SDK | Bidirectional | Replit-connected workspace | Contacts, channels, CRM fields, research and campaign activity | `server/lib/notionClient.ts`, `notionSync.ts` |
| Notion per-user | Direct OAuth and REST | Bidirectional | Each portal client | Workspace identity, pages and scan export data | `server/portal-auth.ts` |
| Google Sheets | Replit connector → Google API | Mainly inbound; research export outbound | Replit-connected Google identity | Satellite Scan/source data and research output | `server/lib/googleSheets.ts`, routes |
| Gmail | Replit connector → Gmail API | Inbound | Replit-connected mailbox | Thread metadata, snippets and research leads | `server/lib/gmailClient.ts` |
| Google Analytics 4 | Direct service-account REST | Inbound | Google service account | Aggregated website metrics | `server/lib/ga4Client.ts` |
| Google OAuth | Direct OAuth | Bidirectional auth flow | OAuth application | User identity/profile | `server/portal-auth.ts`, routes |
| Stripe | Direct SDK + inbound webhooks | Bidirectional | Stripe secret and webhook secret | Customer metadata, amount, product, payment status | `server/routes.ts` |
| Resend | Direct key or Replit connector | Outbound plus open-tracking callback | Deployment key or connector | Email addresses, names, message content, campaign events | `server/resend-client.ts`, email/routes |
| Typeform | Direct REST + inbound webhook | Bidirectional | PAT and webhook configuration | Assessment responses and contact data | `server/lib/typeformClient.ts`, routes |
| Calendly | Direct REST | Inbound | API token | Profile, event types and scheduled events | `server/routes.ts` |
| Fathom | Direct OAuth/token REST | Inbound | Admin OAuth or access token | Sites, current visitors and aggregate analytics | `server/routes.ts` |
| Thesys | OpenAI-compatible SDK endpoint | Outbound/inbound response | Thesys API key | Prompts, coaching/CRM context and generated UI/content | `server/lib/thesysApi.ts` |
| ChatGPT | External links only in reviewed runtime | Browser navigation | User's ChatGPT account | User-chosen interaction with custom GPT | email/routes content |
| LinkedIn | Direct OAuth/OIDC and API | Bidirectional | Portal user or admin OAuth app | Identity, profile and tokens; generated outbound content support | `server/portal-auth.ts`, routes |
| Spotify | Direct OAuth and API | Inbound | Portal user | Identity, recent tracks and audio features | `server/portal-auth.ts` |
| Oura | Direct OAuth and API | Inbound | Portal user | Identity, readiness, sleep and activity data | `server/portal-auth.ts` |
| YouTube | External content links/embeds | Inbound/browser | Public | Playlist/video consumption | content/routes |
| ip-api.com | Direct unauthenticated HTTP | Outbound/inbound | None | Visitor IP address; returns coarse geolocation/ISP | QR route in `server/routes.ts` |

### 6.2 Replit connector bridge behavior

GitHub, Gmail, Google Sheets and operational Notion access use the same pattern:

1. the runtime selects `REPL_IDENTITY` or `WEB_REPL_RENEWAL`;
2. it sends that value as `X_REPLIT_TOKEN`;
3. it calls the Replit connector broker with `include_secrets=true`;
4. it selects the first matching connection;
5. it extracts an access token or API credential;
6. it creates a service SDK client.

Resend uses a direct environment key first and falls back to the connector.

Consequences:

- the Replit runtime identity is effectively a credential-broker key;
- account selection is implicit (`items[0]`) rather than configured by stable connection ID;
- scopes and connected account identities are not recorded in the repository;
- moving away from Replit requires replacing this broker with direct OAuth/service credentials;
- connection-health validation should report provider identity, scopes, expiry and environment without revealing secrets.

### 6.3 GitHub bridge risk

`server/github-push.ts` is not a normal Git workflow. It scans `/home/runner/workspace`, creates blobs and a new tree, then force-updates `main`. The tree is created without a base tree and the ref update uses `force: true`.

Risks include:

- deleting repository files that are absent from the Replit workspace;
- overwriting intervening GitHub changes;
- bypassing pull-request review and branch protections;
- accidentally committing generated output, screenshots, local artifacts or sensitive files not present in the exclusion list;
- treating public GitHub as a mirror while also editing it as a collaboration source.

**Recommendation:** retire this push path. Use ordinary Git commits and pull requests, protect `main`, require status checks, and define whether GitHub or Replit is the authoritative source. GitHub should be authoritative for the refactor.

### 6.4 Google bridge split

“Google” currently means several independent trust relationships:

- browser analytics through the public GA measurement ID;
- GA4 server reporting through a service account;
- admin/portal identity through OAuth;
- Google Sheets through a Replit-connected user;
- Gmail research through a Replit-connected mailbox;
- documented Google Slides/Sheets source assets for the Satellite Scan portal.

These must be inventoried as separate Google Cloud projects/OAuth clients/service accounts with separate scopes and owners.

### 6.5 Notion bridge split

There are also two distinct Notion relationships:

- an operational GreenElephant CRM connection mediated by Replit;
- individual portal-user OAuth connections stored per client.

They should not share code, scopes, databases or data-retention rules. Name them explicitly as `notion-crm` and `notion-user-export`.

### 6.6 ChatGPT, OpenAI and Thesys

Current evidence supports three different concepts:

1. the `openai` npm package is installed;
2. server-side generation uses it as a client for `https://api.thesys.dev/v1/embed`, authenticated with `THESYS_API_KEY`;
3. the product links users to custom GPT experiences hosted at `chatgpt.com`.

No direct OpenAI API key or first-party OpenAI API endpoint was found in the reviewed runtime configuration. ChatGPT links do not create a server-to-server data bridge by themselves.

Before the refactor, decide whether AI should be:

- Thesys-only;
- direct OpenAI API;
- provider-agnostic through a small internal AI gateway;
- an external ChatGPT experience with no privileged backend access;
- or a combination with explicitly separated use cases and data policies.

The recommended approach is a provider-agnostic internal interface with use-case-specific data minimization, audit metadata and model configuration.

---

## 7. MCP and agent-readiness assessment

### 7.1 What exists

- Repository-local agent skills under `.agents/skills/`.
- AgentOps pipeline documentation in `docs/AGENTOPS_FLOWS.md`.
- `llms.txt` and `ai.txt` public discovery content.
- A structured `/api/services` endpoint intended for AI-agent shopping/recommendation.
- Admin AI tooling and AI-context preference routes.
- Custom GPT links.
- Conventional APIs and OAuth integrations that could later be exposed through a controlled tool layer.

### 7.2 What does not currently exist

No runtime MCP server, MCP client, MCP manifest, MCP transport, tool schema registry or MCP authorization boundary was found in the reviewed tree. Replit connectors are credential bridges, not MCPs. Agent skills are instruction files, not network-accessible tools.

### 7.3 Recommended MCP strategy

Do not expose the current Express route surface wholesale through MCP. Define three tool classes:

| Class | Example | Authentication | Data policy |
|---|---|---|---|
| Public discovery | List services, public prompts, program information | Anonymous with rate limits | Public content only |
| Client self-service | Read own scan, append reflection, export own data | Portal OAuth/session mapped to scoped tool token | Own records only |
| Internal operations | CRM sync, campaign preparation, analytics readout | Named admin/service identity with approval gates | Least privilege, full audit |

Design requirements:

- explicit JSON schemas and stable tool versions;
- separate read and write tools;
- confirmation/approval for external writes and email sends;
- per-tool authorization, not only session presence;
- idempotency keys for mutations;
- structured audit events with actor, subject, tool, purpose and outcome;
- PII redaction before model calls;
- provider/tool kill switches;
- no raw database or generic HTTP tool;
- no OAuth access tokens in model context;
- data-retention and deletion behavior per tool.

---

## 8. Data flows and operational pipelines

### 8.1 Public lead flow

`Browser → Express validation → PostgreSQL → Notion CRM → Resend → customer/admin`

Used by contact forms, newsletter signup, waitlists, quizzes and FLOW assessment. Code generally attempts to keep the primary user response working if Notion or email fails, which is a good resilience pattern. It needs durable retries and a dead-letter view rather than console-only failure handling.

### 8.2 Purchase flow

`Browser → Express → Stripe Payment Intent → Stripe webhook → PostgreSQL purchase → Notion CRM → Resend/onboarding scheduler`

Positive controls include server-side package pricing and payment-intent idempotency checks. Required work:

- require webhook secrets in production rather than allowing insecure fallback;
- use a dedicated raw-body parser specifically for Stripe;
- persist webhook event IDs and processing states;
- process side effects through durable jobs;
- reduce customer PII in logs;
- reconcile purchases against Stripe on a schedule.

### 8.3 Satellite Scan flow

`Purchase → Typeform completion webhook → PostgreSQL/CRM → result processing → email and portal`

The Typeform endpoint accepts up to 50 MB. Signature verification was not established by the reviewed startup portion. Reduce the limit, require provider verification, enforce content type, record event IDs and move expensive work to a queue.

### 8.4 Portal connector flow

`Portal client → OAuth provider → callback → token storage → provider API → portal coaching view`

Providers include Google/LinkedIn identity, Notion export, Spotify listening history and Oura biometrics. This is the highest-sensitivity product zone because it combines identity, coaching information, behavioral data and biometrics.

Required controls:

- clear granular consent per connector;
- encrypted token storage;
- provider disconnect and deletion verification;
- strict per-user authorization tests;
- purpose limitation and retention periods;
- no cross-user caching;
- privacy impact assessment for Oura/Spotify-derived coaching inference.

### 8.5 Research/marketing flow

`Admin → Gmail/Notion/Sheets/analytics → database/context → AI generation → admin review → external publication/send`

This should have a mandatory human review boundary before email, social publication or CRM mutation. Preserve source provenance and separate prospect/research data from paying-client coaching data.

### 8.6 Scheduled flows

The web process starts:

- a daily Satellite Scan reminder interval;
- an onboarding scheduler that checks frequently;
- a daily pulse digest scheduler.

In-process scheduling creates duplicate-run risk during restarts, horizontal scaling and previews. Move these to a durable scheduler/queue with database-backed leases, idempotent jobs, retry policies and observable outcomes.

---

## 9. Security, privacy and reliability evaluation

### 9.1 Critical/high priorities

1. **OAuth tokens stored as plaintext text fields.** Encrypt and isolate them.
2. **Custom GitHub force-push to `main).** Retire it and protect the branch.
3. **Sensitive logging.** API response bodies and customer email/payment metadata can reach logs. Adopt structured logging with allowlisted fields.
4. **No evident global rate limiting/security headers/CSRF layer.** Add and test them.
5. **Large unauthenticated webhook/body limits.** Reduce limits and verify signatures.
6. **In-process background jobs.** Replace with durable scheduled work.
7. **Single application blast radius.** Public, admin, portal, OAuth and webhook routes share one process and route module.
8. **Error middleware rethrows after sending a response.** This can create process-level instability; log safely and hand off to process monitoring without throwing from the response middleware.
9. **Production fallback behavior.** Stripe webhooks may proceed without signature verification if the secret is absent; production configuration must fail closed.
10. **Public repository with generated output and screenshots.** Confirm that no confidential assets or user data have ever entered history; add automated secret scanning.

### 9.2 Data-model concerns

- OAuth credentials are mixed with client profile data.
- Several boolean/counter/status fields are represented as text.
- Many logical relationships use string IDs without visible database foreign keys.
- Indexes, uniqueness constraints and cascade behavior need systematic review.
- Schema deployment uses push semantics; production should use versioned migrations.
- Data-retention/deletion metadata is incomplete for analytics, audit, campaign, scan and biometric-derived records.

### 9.3 Frontend and product concerns

- The SPA contains public, portal and admin routes in one route registry/build.
- Route lazy loading helps bundle size, but authorization remains a server responsibility and should be tested independently.
- SEO support exists, including structured data and a reusable SEO component, but client rendering still warrants crawl verification per route.
- Large images and heavy motion create performance risk.
- TanStack Query defaults to infinite stale time and no retries globally, which may be inappropriate for dynamic portal/admin data.
- The build output is committed under `dist/`, duplicating source assets and increasing repository size.
- There is no test script in `package.json`.

### 9.4 Compliance questions to resolve

- Who is controller/processor for each integration?
- Which Notion workspace and Google account own operational data?
- Are Data Processing Agreements in place for coaching, biometric and AI-processing vendors?
- What is the retention period for QR IP/geolocation, email opens, OAuth tokens, analytics and coaching records?
- Does consent cover using Spotify/Oura data to create coaching inferences?
- What data is sent to Thesys, and is it used for provider training or retained?
- Can a client export and delete all data across Neon, Notion, Resend and connected providers?
- Are admin audit logs immutable enough for incident investigation?
- Which geographic regions hold Neon, Replit and vendor data?

---

## 10. Proposed target architecture

### 10.1 Modular-monolith boundaries

```text
apps/
  web-public/        public pages, SEO, assessments and checkout UI
  web-portal/        authenticated client experience
  web-admin/         authenticated operational console
  api/               HTTP composition root
packages/
  auth/
  config/
  database/
  observability/
  jobs/
  integrations/
    google/
    notion-crm/
    notion-user/
    github/
    stripe/
    resend/
    typeform/
    calendly/
    fathom/
    spotify/
    oura/
    ai/
  features/
    contacts/
    assessments/
    purchases/
    portal/
    campaigns/
    analytics/
    research/
    qr/
```

This can remain one deployable unit initially while enforcing dependency boundaries. Split deployments only where security, scale or release cadence justifies it.

### 10.2 Integration adapter contract

Each provider adapter should expose:

- configuration validation;
- connection-health status without secrets;
- typed provider operations;
- timeout, retry and idempotency policy;
- rate-limit handling;
- normalized errors;
- PII classification;
- structured audit metadata;
- disconnect/revoke behavior;
- test/sandbox implementation.

Business workflows should depend on these adapters, not SDKs or `fetch` calls embedded in routes.

### 10.3 Recommended trust-zone separation

| Zone | Contents | May access |
|---|---|---|
| Public edge | Public pages, forms, service discovery, webhook entry points | Narrow public services and queues |
| Portal | Client identity, scan data, user connectors | Own-user services only |
| Admin | CRM, campaigns, analytics, configuration | Role-scoped operational services |
| Worker | Email, sync, imports, scheduled automation | Job-specific provider credentials |
| Credential broker | Encrypted tokens/keys | Only adapter layer |
| Data layer | Feature repositories and migrations | Database through least-privilege roles |

### 10.4 Observability baseline

Implement:

- request IDs and correlation IDs;
- structured logs with PII allowlists;
- error monitoring;
- health/readiness endpoints;
- integration health dashboard;
- queue/job status and dead-letter handling;
- webhook receipt/processing ledger;
- audit events for privileged reads as well as writes;
- uptime and synthetic checks for public, portal and checkout flows.

---

## 11. Refactoring roadmap

### Phase 0 — Verify reality and freeze risky changes

- Confirm production host, deployment ID, DNS owner and current domains.
- Export an inventory of Replit connectors with connected account identity and scopes.
- Inventory Google Cloud projects, OAuth apps and service accounts.
- Inventory Notion workspaces/databases and integration scopes.
- Confirm Stripe mode, webhook endpoints and signing secrets.
- Confirm Neon project, branches, region, backups and roles.
- Enable GitHub secret scanning, Dependabot and protected `main`.
- Disable or remove the force-push endpoint/utility.
- Create a tested database backup and rollback procedure.

### Phase 1 — Safety foundation

- Add typed environment validation and `.env.example`.
- Add Helmet/security headers, rate limits and CSRF strategy.
- Redesign logging and remove response-body/customer-email logging.
- Make webhook configuration fail closed in production.
- Encrypt and isolate OAuth tokens.
- Add request IDs, error monitoring and health checks.
- Fix error middleware.
- Add automated secret, dependency and static analysis.

### Phase 2 — Test and migration foundation

- Add unit tests for validation and business rules.
- Add integration tests for every admin and portal route.
- Add OAuth/webhook contract tests.
- Introduce versioned SQL migrations and schema checks.
- Add E2E smoke tests for signup, login, checkout and admin access.
- Create staging with sandbox services.

### Phase 3 — Modularize without changing behavior

- Split `server/routes.ts` by feature and trust zone.
- Split `storage.ts` into feature repositories.
- Split `shared/schema.ts` into feature schema modules.
- Split email templates, workflow orchestration and Resend delivery.
- Move every external SDK/`fetch` call behind an adapter.
- Separate public, portal and admin route registries.
- Replace global query defaults with feature-appropriate policies.

### Phase 4 — Durable automation

- Add a queue and dedicated worker.
- Move onboarding, reminders and daily pulse out of the web process.
- Queue Notion sync, email sends and webhook side effects.
- Add retries, idempotency, dead letters and replay tooling.

### Phase 5 — Product and agent architecture

- Decide AI provider policy and data-processing rules.
- Create a stable internal AI gateway.
- Version the public service-discovery API.
- Design scoped MCP tools only after trust zones and audit controls exist.
- Require human approval for outbound marketing/content actions.
- Establish consent and retention for biometric/behavioral connectors.

### Phase 6 — Frontend and deployment evolution

- Decide whether public SEO needs SSR/prerendering.
- Separate admin and portal builds or entry points.
- Optimize large images and define performance budgets.
- Stop committing `dist/` and generated screenshots unless explicitly required.
- Move production deployment to a GitHub-driven CI/CD pipeline with preview, staging and production gates.

---

## 12. Decisions required before implementation

| Decision | Options | Recommended default |
|---|---|---|
| Source of truth | Replit workspace or GitHub | GitHub |
| Hosting | Remain on Replit or migrate | Decide after environment inventory; remove proprietary coupling either way |
| Application shape | Single SPA, separate builds, or separate deployments | Separate public/portal/admin builds; modular API |
| AI provider | Thesys, OpenAI, multi-provider | Provider-agnostic gateway |
| CRM authority | Neon, Notion, or dual-master | Neon as system of record; Notion as operational projection |
| Background work | In-process, managed cron, or queue/worker | Queue/worker with durable scheduler |
| User connectors | Keep all, reduce scope, or pause | Keep only with demonstrated coaching value and consent |
| MCP | None, public discovery only, or scoped tools | Start with public read-only discovery; expand after security foundation |
| Admin access | Shared secret plus accounts or named accounts only | Named accounts only with MFA-capable identity |
| Deployment environments | Production only or local/preview/staging/production | Four-level model |

---

## 13. Verification checklist outside the repository

This audit cannot establish the following from source code alone:

- which Replit deployment currently serves production;
- which secrets are set in workspace versus deployment;
- exact connector accounts and OAuth scopes;
- whether connectors are connected, expired or healthy;
- DNS registrar/provider and current records;
- GitHub branch protections and historical secret exposure;
- Neon region, backup policy, branches and database roles;
- vendor billing plans, DPAs and data-retention settings;
- exact OAuth redirect URIs registered with each provider;
- production webhook registrations and recent delivery health;
- whether all routes described as live in documentation are operational.

Record these in a restricted operational inventory. Do not commit secret values, recovery codes, full tokens, private keys or personal access tokens.

---

## 14. Immediate next actions

1. Treat this document as the baseline and assign owners to the external verification checklist.
2. Produce a route-by-route authorization matrix from `server/routes.ts` and `server/portal-auth.ts`.
3. Produce a table-by-table data classification and retention map from `shared/schema.ts`.
4. Confirm connected account identities and scopes in Replit, Google, Notion, Stripe and GitHub.
5. Protect `main` and retire the custom force-push path.
6. Create a staging environment and test-provider accounts.
7. Begin Phase 1 safety work before adding new connectors or agent write capabilities.

---

## Appendix A — Important evidence paths

- `package.json`
- `vite.config.ts`
- `server/index.ts`
- `server/auth.ts`
- `server/portal-auth.ts`
- `server/routes.ts`
- `server/storage.ts`
- `server/db.ts`
- `server/github-client.ts`
- `server/github-push.ts`
- `server/resend-client.ts`
- `server/lib/ga4Client.ts`
- `server/lib/gmailClient.ts`
- `server/lib/googleSheets.ts`
- `server/lib/notionClient.ts`
- `server/lib/notionSync.ts`
- `server/lib/thesysApi.ts`
- `server/lib/typeformClient.ts`
- `server/onboarding-scheduler.ts`
- `server/daily-pulse.ts`
- `shared/schema.ts`
- `client/src/App.tsx`
- `client/src/components/SEO.tsx`
- `client/index.html`
- `docs/AGENTOPS_FLOWS.md`
- `docs/FUTURE_PLANS.md`
- `.agents/skills/`
- `replit.md`
- `DEPLOY_NOW.md`
- `SUBDOMAIN_SETUP_GUIDE.md`

## Appendix B — Terminology

- **Direct integration:** the application holds credentials and calls a provider API directly.
- **Replit connector:** the application uses Replit runtime identity to obtain provider credentials from Replit's connection broker.
- **Bridge:** any controlled path by which data or actions cross from GreenElephant to an external system.
- **MCP:** Model Context Protocol, a structured protocol for exposing tools/resources to AI clients. No runtime MCP implementation was found.
- **Agent skill:** repository-local instructions for an AI coding/operations agent. A skill is not itself an MCP server.
- **System of record:** the authoritative place where a class of data is owned and reconciled.
