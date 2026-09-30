# Secret and integration inventory

This file records names and ownership boundaries only. Never add values, tokens,
private keys, passwords, connection strings or recovery codes.

## Storage boundary

- Replit deployment secrets: application runtime credentials.
- Replit connectors: short-lived or brokered provider credentials managed by Replit.
- GitHub environment secrets: only credentials required by an approved GitHub
  deployment workflow. None are required by the current build-only workflow.
- Local development: a private ignored `.env`; use `.env.example` as the name list.

An integration showing **Active** does not prove correct scopes, account ownership,
production health or MCP capability. A Replit connector is not an MCP server.

## Observed Replit connections

A user-supplied Replit screenshot dated 2026-09-30 showed Google Sheets, GitHub,
Notion and Resend as active. Account identities, scopes, expiry and production health
remain to be verified inside Replit without copying credentials into this repository.

## Runtime variable groups

| Group | Names |
| --- | --- |
| Core | `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_PASSWORD`, `PORT`, `NODE_ENV` |
| Replit platform | `REPL_ID`, `REPLIT_DEV_DOMAIN`, `REPLIT_CONNECTORS_HOSTNAME`, `REPL_IDENTITY`, `WEB_REPL_RENEWAL` |
| Email | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` |
| Payments | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `VITE_STRIPE_PUBLIC_KEY` |
| Google | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_SERVICE_ACCOUNT_KEY`, `GOOGLE_SHEETS_SPREADSHEET_ID`, `GA4_PROPERTY_ID`, `VITE_GA_MEASUREMENT_ID` |
| Analytics | `FATHOM_ACCESS_TOKEN`, `FATHOM_CLIENT_ID`, `FATHOM_CLIENT_SECRET` |
| OAuth | `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `NOTION_OAUTH_CLIENT_ID`, `NOTION_OAUTH_CLIENT_SECRET`, `OURA_CLIENT_ID`, `OURA_CLIENT_SECRET`, `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` |
| Other providers | `CALENDLY_API_TOKEN`, `THESYS_API_KEY`, `TYPEFORM_FORM_ID`, `TYPEFORM_PERSONAL_ACCESS_TOKEN` |

Before production publication, confirm each required variable exists in the Replit
deployment environment, identify its owner and backup owner, and test expiry,
rotation and failure behavior without revealing the value.

