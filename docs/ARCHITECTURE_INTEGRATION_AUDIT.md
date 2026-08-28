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


---

## 15. Project-management infrastructure catalog

This section converts the architectural assessment into a tool-by-tool inventory suitable for a project management system. **Current** means implemented in the repository; it does not guarantee that credentials, subscriptions, callbacks or production connections are currently healthy.

### 15.1 Databases and data storage

| Tool or component | Status | Purpose | Main consumers | Recommended ownership |
|---|---|---|---|---|
| PostgreSQL | Current | Primary relational system for identity, operational, product and automation data | Public API, portal, admin, jobs | Platform/data owner |
| Neon | Current | Managed PostgreSQL hosting and connection endpoint | Express server and session store | Platform owner |
| Drizzle ORM | Current | Type-safe TypeScript database access and schema definitions | Server services and repositories | Engineering |
| Drizzle Kit | Current | Applies schema changes through `db:push` | Development/deployment workflow | Engineering/platform |
| `shared/schema.ts` | Current | Central table, validation and TypeScript model definition | Nearly every feature | Split among feature owners |
| `server/storage.ts` | Current | Shared persistence facade containing most data operations | Routes, schedulers, sync and portal | Split among feature owners |
| PostgreSQL session store | Current | Persists browser authentication sessions through `connect-pg-simple` | Admin and portal authentication | Identity/platform |
| Notion CRM | Current integration | Operational view of contacts, customer state, reach channels and campaigns | Marketing, sales, admin and automation | Operations/CRM owner |
| Google Sheets | Current integration | Scan/source-data import and research-data export | Coaching portal and research tools | Coaching/data owner |
| Browser/TanStack Query cache | Current | Holds fetched client state temporarily | Public, portal and admin browser applications | Frontend engineering |
| In-memory server caches/maps | Current, limited | Holds token connection settings and activity throttling state | Integration clients and admin auth | Replace or constrain |

#### Data domains currently represented in PostgreSQL

The database contains or is designed to contain the following classes of information:

- named administrator accounts, roles, status and login activity;
- shared administrative settings and the legacy admin password hash;
- administrative audit events and source IP addresses;
- portal users, profiles, password hashes and password-reset fields;
- client subscriptions, plans, Stripe customer/subscription references and periods;
- operational contacts and their activity;
- newsletter subscriptions, campaigns, recipients, exclusions and open events;
- recommendation, contact, waitlist and webinar submissions;
- Signals Quiz, FLOW Check and Satellite Scan results;
- purchases, payment-intent references, fulfillment state and reminders;
- prompt resources, prompt votes and AI-related preferences;
- webinar settings, sessions and calendar events;
- onboarding email templates and send logs;
- portal timeline events and user context;
- testimonials and consent/visibility state;
- coupons and pricing configuration;
- connector enablement, kill-switch state and toggle logs;
- SEO suggestions and AI-tool settings/usage;
- QR-code definitions and QR scan telemetry;
- coaching debrief records;
- OAuth access and refresh tokens for user-connected services.

#### Database update backlog

1. Replace schema push in production with reviewed, versioned migrations.
2. Split `shared/schema.ts` into feature-owned modules.
3. Split `server/storage.ts` into feature repositories with narrow interfaces.
4. Create a data dictionary with classification, controller, retention and deletion rules.
5. Add or verify foreign keys, unique constraints, indexes and cascade behavior.
6. Replace text-encoded booleans, counters and states with native types or enums.
7. Isolate OAuth credentials from client profiles and encrypt them at application level.
8. Add database roles with least-privilege access for web, worker, migrations and support.
9. Create separate databases or Neon branches for local, preview, staging and production.
10. Test backup restoration, point-in-time recovery and migration rollback.
11. Add automated detection of orphaned records and synchronization discrepancies.
12. Decide which domains use Neon as the system of record and treat Notion/Sheets as projections or imports.

### 15.2 Email delivery and automation

| Tool or component | Status | Purpose | Trigger/input | Output |
|---|---|---|---|---|
| Resend | Current | Transactional and campaign delivery | Application workflow | Customer/admin email |
| `server/resend-client.ts` | Current | Creates a Resend client from a direct key or Replit connector | Environment or connector broker | Authenticated Resend SDK |
| `server/email-notifications.ts` | Current | Branded templates, content assembly and send functions | Product workflows | Resend requests |
| Onboarding scheduler | Current | Finds and sends pending sequence messages | Frequent in-process schedule | Onboarding email and log updates |
| Satellite Scan reminder scheduler | Current | Finds overdue scan completions | 24-hour in-process interval | Reminder email and reminder counters |
| Daily pulse scheduler | Current | Builds an operational digest | Daily in-process schedule | Admin digest |
| Newsletter campaign engine | Current | Populates recipients, previews, sends and records campaigns | Admin action | Batch email |
| Email open tracker | Current | Records tracking-pixel requests | Recipient email client | Open timestamp/count and CRM update |
| Gmail client | Current | Reads selected mailbox threads for research | Admin query | Thread metadata/snippets |
| Notion synchronization | Current | Records email/contact/campaign activity in CRM | Email and campaign events | Updated CRM contact/page |

#### Implemented or represented email workflows

| Workflow | Recipient | Principal dependencies |
|---|---|---|
| Contact-form acknowledgement | Submitter | PostgreSQL, Notion, Resend |
| Contact-form notification | Administrator | PostgreSQL, Resend |
| Newsletter welcome | Subscriber | PostgreSQL, Notion, Resend |
| Retreat waitlist confirmation | Applicant | PostgreSQL, Notion, Resend |
| Webinar waitlist confirmation | Applicant | PostgreSQL, Notion, Resend |
| FLOW Check results | Participant | PostgreSQL, Notion, Resend |
| FLOW Check notification | Administrator | PostgreSQL, Resend |
| Signals Quiz results | Participant | PostgreSQL, Notion, Resend |
| Purchase confirmation | Customer | Stripe, PostgreSQL, Notion, Resend |
| Satellite Scan instructions | Customer | Stripe/Typeform, PostgreSQL, Resend |
| Satellite Scan completion | Customer/coach | Typeform, PostgreSQL, Resend |
| Satellite Scan overdue reminder | Customer | PostgreSQL, scheduler, Resend |
| Fibonacci onboarding sequence | Customer | PostgreSQL, scheduler, Resend |
| Coaching raw-data delivery | Coach/customer as configured | PostgreSQL, Resend |
| Coaching document-link delivery | Coach/customer as configured | PostgreSQL, Resend |
| Coach-only message | Coach | PostgreSQL, Resend |
| Email verification | User | PostgreSQL, Resend |
| Password reset | Portal user | PostgreSQL, Resend |
| Portal data export | Portal user | PostgreSQL, Resend |
| Newsletter campaign | Selected contacts | PostgreSQL, Resend, tracking, Notion |
| Test email operations | Administrator-selected target | Admin API, Resend |
| Daily pulse | Administrator | PostgreSQL, scheduler, Resend |

#### Current automation topology

```text
User or administrator action
        |
        v
Express route and validation
        |
        +--> PostgreSQL record/state
        |
        +--> optional Notion CRM synchronization
        |
        +--> Resend delivery
        |
        +--> send log / delivery state
        |
        +--> optional open-tracking callback
```

#### Email automation update backlog

1. Move reminders, onboarding and daily pulse out of the Express process.
2. Introduce a durable job queue, scheduler and dedicated worker.
3. Use idempotency keys per recipient, template, campaign and scheduled occurrence.
4. Add bounded retries, exponential backoff, dead letters and safe replay tooling.
5. Separate email template rendering, workflow orchestration and provider delivery.
6. Add a centralized suppression, unsubscribe and consent service.
7. Ingest and reconcile delivery, bounce, complaint and unsubscribe events.
8. Add per-domain/provider throttling and rate-limit handling.
9. Remove customer email addresses and email bodies from ordinary application logs.
10. Create staging sender domains and an explicit test-recipient allowlist.
11. Version templates and retain the rendered/template version used for each send.
12. Add accessibility, plain-text and link validation to template tests.
13. Record why each message was sent, its lawful/consent basis and retention period.
14. Add campaign approval and preview gates before bulk sends.
15. Add an operational dashboard for queued, sent, failed, suppressed and retried messages.

### 15.3 Hosting, runtime and deployment

| Tool or component | Status | Purpose |
|---|---|---|
| Replit workspace | Current | Interactive development and connected-service environment |
| Replit deployment | Current/documented | Runs the production-style Node server |
| Replit connector broker | Current | Supplies provider credentials to an authenticated Replit runtime |
| Node.js | Current | Server, scheduler and build runtime |
| Express | Current | HTTP API, sessions, webhooks, static application serving and job startup |
| Vite | Current | React development environment and browser build |
| esbuild | Current | Production server bundling |
| TypeScript | Current | Shared typing across browser, API and database |
| npm/package lock | Current | Dependency installation and version resolution |
| GitHub | Current | Public repository, collaboration surface and continuity layer |
| Custom GitHub push utility | Current; retire | Creates blobs/tree/commit from Replit workspace and force-updates `main` |
| GreenElephant domains | Current/documented | Customer entry points and OAuth/webhook callback origins |
| Static files in Express | Current | Serves the built SPA from `dist/public` |

#### Deployment capabilities not established in the repository

- a dedicated staging deployment;
- pull-request preview environments;
- GitHub Actions or equivalent CI/CD;
- automated database migration gates;
- a dedicated background worker;
- infrastructure-as-code;
- formal blue/green or canary deployment;
- automated rollback;
- dependency and secret security gates;
- environment promotion records.

### 15.4 Browser application and UI

| Tool or component | Purpose |
|---|---|
| React 18 | Public website, portal and admin rendering |
| Wouter | Browser-side route matching and redirects |
| TanStack Query | API requests, caching and mutations |
| React Hook Form | Form state and submission handling |
| Zod | Form/API validation and shared schemas |
| Tailwind CSS | Styling, responsive layouts and design tokens |
| Radix UI | Accessible interaction primitives |
| shadcn-style UI components | Shared application component set |
| Framer Motion | Scroll, entrance and interface animation |
| Recharts | Portal and admin charts |
| Lucide React / React Icons | Interface iconography |
| Google Fonts | Poppins headings and Lato body text |
| QRCode | QR image generation |
| Stripe browser SDK | Secure payment collection |
| Client SEO component | Route-specific browser metadata and structured data |
| `llms.txt`, `ai.txt`, robots and sitemap | Search and agent-discovery metadata |

The browser build currently includes route registrations for public, portal and admin surfaces. Route-level lazy loading reduces initial downloads, but it does not create a security boundary. All authorization must remain enforced by the API.

### 15.5 Identity, access and security components

| Component | Purpose | Current concern |
|---|---|---|
| `express-session` | Browser session management | Needs rotation and CSRF review |
| `connect-pg-simple` | PostgreSQL session persistence | Shares primary database/pool |
| scrypt password hashing | Protects database-stored passwords | Legacy environment password remains |
| Admin roles | `super_admin`, `admin`, `viewer` | Requires route-by-route verification |
| Admin middleware | Authentication, role and write checks | Large route file makes coverage hard to review |
| Portal session identity | Restricts portal information | Needs comprehensive cross-user tests |
| Google OAuth | User/admin sign-in | Scope/project/callback inventory required |
| LinkedIn OAuth/OIDC | User identity and connection | Token encryption required |
| Audit middleware | Records privileged operations | Redaction is exact-field based and incomplete |
| Connector kill switches | Disables configured integrations | Credentials may still remain valid externally |
| PostgreSQL audit logs | Stores admin action history | Immutability and retention need definition |

#### Security infrastructure to add

- centralized security headers;
- global and endpoint-specific rate limits;
- explicit CSRF control;
- encrypted OAuth credential vault;
- named admin identity with MFA;
- automated secret scanning and historical scan;
- dependency and container/runtime scanning;
- structured PII-safe logs;
- application error monitoring;
- webhook signature and replay protection;
- route authorization tests;
- security event alerts;
- edge/WAF protection where appropriate.

### 15.6 Google tools

Track each Google relationship independently.

| Tool | Purpose | Connection |
|---|---|---|
| Google Analytics browser tag | Collects website events | Public measurement ID |
| GA4 Data API | Provides aggregate analytics to admin tooling | Service-account key |
| Google OAuth | Authenticates users/admins | Direct OAuth client credentials |
| Google Sheets API | Reads scan/source data and writes research exports | Replit-connected user |
| Gmail API | Reads selected research threads and message metadata | Replit-connected mailbox |
| Google Slides | Source/template for Satellite Scan dashboard design | Documented resource; runtime usage not established |
| Google Fonts | Delivers Poppins and Lato | Public browser resource |

Project-management records should capture the Google Cloud project, OAuth client, service account, account owner, scopes, callback URLs, environments and data accessed for each row.

### 15.7 Notion tools

| Tool | Purpose | Connection |
|---|---|---|
| Notion CRM integration | Contact upsert, customer status, channels, campaigns and research synchronization | Replit connector |
| Notion SDK client | Authenticated API wrapper for operational CRM | Replit-brokered token |
| Notion sync service | Matching, pulling, pushing and reconciliation logic | Application service |
| Portal-user Notion OAuth | Allows a client to connect their own workspace | Direct OAuth |
| Portal Notion export | Pushes selected scan/user information to the client's workspace | Per-user token |

Treat the operational CRM as `notion-crm` and the client connection as `notion-user-export`. They require separate owners, scopes, privacy notices and deletion behavior.

### 15.8 Payments, booking, forms and marketing

| Tool | Purpose | Data handled |
|---|---|---|
| Stripe | Payment Intents, subscriptions, purchase confirmation, coupon usage and webhooks | Customer identity, product, amount and payment state |
| Calendly | Reads profile, event types and scheduled events; supplies booking destinations | Coach and attendee scheduling metadata |
| Typeform | Hosts Satellite Scan collection and notifies the server of completion | Assessment responses and contact information |
| Resend | Transactional and campaign delivery | Recipient identity and message content |
| Fathom | Privacy-oriented site and visitor analytics | Site/visitor aggregate information |
| GA4 | Traffic/acquisition/behavior analytics | Browser and aggregate analytics |
| QR tracking | Redirects campaign codes and records scans | Time, user agent, referrer and IP-derived metadata |
| ip-api.com | Converts an IP address into approximate location and ISP | Visitor IP and geolocation response |
| YouTube | Hosts linked/embedded educational content | Browser viewing activity outside core server |
| LinkedIn | Login/profile integration and content/research workflows | Identity, profile and OAuth credentials |

### 15.9 Coaching and portal integrations

| Tool | Purpose | Sensitivity |
|---|---|---|
| Google Sheets | Supplies Satellite Scan source data | Coaching/assessment data |
| PostgreSQL/Neon | Stores portal identity, context, timeline and results | High |
| Notion user export | Sends selected user information to a connected workspace | High |
| Spotify | Reads identity, recently played tracks and audio characteristics | Behavioral |
| Oura | Reads readiness, sleep and activity information | Biometric-adjacent/high |
| Recharts | Displays assessment and coaching visualizations | Derived client data |
| Thesys AI | Generates coaching-related content/interfaces | Depends on supplied context |
| Portal data export | Produces an email-based user export | High |

Spotify and Oura require connector-specific consent, purpose limitation, retention, deletion and inference policies.

### 15.10 AI, ChatGPT, agent and MCP components

| Component | Status | Purpose |
|---|---|---|
| OpenAI JavaScript SDK | Current dependency | Compatible client used by the AI integration layer |
| Thesys API | Current | AI-generated dashboards, content and analysis through an OpenAI-compatible interface |
| Custom GPT links | Current external experience | Opens GreenElephant experiences hosted by ChatGPT |
| Admin AI tooling | Current | Content, prompt, poll, social, research and journey generation |
| AI context preferences | Current | Controls contextual inputs/preferences used by administrative AI features |
| `/api/services` | Current | Structured public information for agent service discovery |
| `llms.txt` and `ai.txt` | Current | Machine-readable public website guidance |
| `.agents/skills/` | Current | Repository-local instructions for coding/operations agents |
| AgentOps documentation | Current | Describes named automated business pipelines |
| Runtime MCP server | Not found | No MCP transport or tool server currently exists |
| Runtime MCP client | Not found | No application-side MCP client currently exists |

Definitions for project tracking:

- A Replit connector is a credential broker, not an MCP.
- An agent skill is an instruction package, not a runtime integration.
- A custom GPT link is user navigation to ChatGPT, not server-to-server access.
- The OpenAI SDK does not prove direct OpenAI API usage; the reviewed AI client targets Thesys.
- Any future MCP work should begin with read-only public discovery, then scoped client tools, then approval-gated internal operations.

### 15.11 Analytics, monitoring and operational controls

| Tool or component | Status | Purpose |
|---|---|---|
| Google Analytics 4 | Current | Traffic and behavior analytics |
| Fathom | Current | Privacy-oriented analytics and current-visitor information |
| Admin analytics views | Current | Combines operational and external analytics |
| Audit logs | Current | Records administrative activity |
| Connector states | Current | Enables/disables individual integrations |
| Global connector kill switch | Current | Pauses managed outbound integrations |
| Connector toggle logs | Current | Records state changes |
| Console logging | Current | Primary runtime diagnostics |
| Daily pulse | Current | Operational digest |
| Request/API logging | Current | Logs method, path, status and truncated JSON response |

Operational tooling still required:

- centralized log storage and search;
- error/exception monitoring;
- application performance monitoring;
- uptime and synthetic customer-flow checks;
- job/queue monitoring;
- webhook receipt and processing ledger;
- alert policies and incident routing;
- database observability;
- service-level objectives;
- provider health and credential-expiry monitoring.

### 15.12 Development and repository tooling

| Tool or component | Status | Purpose |
|---|---|---|
| GitHub repository | Current | Source storage and collaboration |
| npm and lock file | Current | Dependency management |
| TypeScript compiler | Current | Static type checks through `npm run check` |
| Vite Replit plugins | Current in development | Error overlay, development banner and cartography |
| Drizzle Kit | Current | Schema deployment |
| Repository agent skills | Current | AI-assisted implementation guidance |
| Repository documentation | Current | Architecture, AgentOps, design and future plans |
| Committed `dist/` | Current; reconsider | Stores generated browser output |
| Root screenshots/assets | Current; reconsider | Stores visual review artifacts and large images |

Quality tooling to establish:

- unit test framework;
- API integration tests;
- browser E2E tests;
- automated accessibility tests;
- linting and formatting checks;
- bundle-size budgets;
- migration verification;
- pull-request checks and required reviews;
- automated dependency updates;
- license and software-bill-of-materials reporting.

### 15.13 Recommended project-management epics

| Epic | Objective | Typical deliverables |
|---|---|---|
| Environment separation | Prevent development from affecting production | Local/preview/staging/production matrix, isolated DBs and provider sandboxes |
| Database integrity and migrations | Make schema change safe and reviewable | Versioned migrations, constraints, indexes, restore test |
| Email automation and durable jobs | Make communication workflows observable and retryable | Queue, worker, scheduler, suppression and delivery events |
| Identity and access hardening | Replace shared access and verify least privilege | Named admins, MFA path, authorization matrix and tests |
| OAuth credential protection | Protect connected-user accounts | Encrypted vault, rotation, revocation and scope inventory |
| Integration adapter refactor | Remove provider code from route handlers | One typed adapter per provider and contract tests |
| Google rationalization | Clarify projects, identities and scopes | Google account/service inventory and environment separation |
| Notion separation | Separate CRM from user exports | Two adapters, two policies and reconciliation ownership |
| GitHub source-of-truth migration | Establish safe collaboration and delivery | Protected `main`, PR workflow and removal of force-push |
| Observability and incident response | Detect and diagnose failures safely | Logs, errors, alerts, runbooks and SLOs |
| Application-surface separation | Reduce public/portal/admin blast radius | Separate route registries/builds and trust boundaries |
| Testing and CI/CD | Prevent regressions and unsafe promotion | CI checks, E2E tests, preview/staging and deployment gates |
| Privacy and lifecycle management | Make retention/consent/deletion enforceable | Data inventory, DPIA items, deletion workflows and evidence |
| AI provider governance | Control what models receive and why | Provider gateway, model policy, PII minimization and audit |
| Agent API and MCP strategy | Expose safe, scoped machine operations | Public read-only tools, client-scoped tools and approval gates |
| SEO, accessibility and performance | Improve public experience and discoverability | Route audit, SSR/prerender decision, budgets and WCAG checks |
| Repository cleanup | Reduce size and accidental publication | Remove generated output, reorganize assets and history review |

### 15.14 Suggested fields for each tool record

When transferring this catalog into a project-management or configuration-management tool, use:

- tool/service name;
- category;
- business purpose;
- technical purpose;
- owner and backup owner;
- environment;
- account/workspace/project identity;
- authentication method;
- secret location;
- OAuth scopes or API permissions;
- data read;
- data written;
- personal/sensitive data classification;
- system of record;
- upstream dependencies;
- downstream consumers;
- callback/webhook URLs;
- health-check method;
- rate limits;
- failure behavior;
- retry/idempotency behavior;
- retention/deletion policy;
- DPA/vendor-review status;
- monthly cost and renewal owner;
- current status;
- desired status;
- migration/refactor epic;
- last access review;
- last recovery test;
- operational runbook link.

