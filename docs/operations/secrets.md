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
| Core | `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_PASSWORD`, `PORT`, `NODE_ENV`, `PUBLIC_SITE_URL` |
| Replit platform | `REPL_ID`, `REPLIT_DEV_DOMAIN`, `REPLIT_CONNECTORS_HOSTNAME`, `REPL_IDENTITY`, `WEB_REPL_RENEWAL` |
| Email | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `EMAIL_UNSUBSCRIBE_SECRET` |
| Payments | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_SATELLITESCAN_WEBHOOK_SECRET`, `VITE_STRIPE_PUBLIC_KEY` |
| Google | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_SERVICE_ACCOUNT_KEY`, `GOOGLE_SHEETS_SPREADSHEET_ID`, `GA4_PROPERTY_ID`, `VITE_GA_MEASUREMENT_ID` |
| Analytics | `GA4_COLLECTION_ENABLED` (non-secret runtime switch, false until reviewed), `FATHOM_ACCESS_TOKEN`, `FATHOM_CLIENT_ID`, `FATHOM_CLIENT_SECRET` |
| OAuth | `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `NOTION_OAUTH_CLIENT_ID`, `NOTION_OAUTH_CLIENT_SECRET`, `OURA_CLIENT_ID`, `OURA_CLIENT_SECRET`, `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` |
| Other providers | `CALENDLY_API_TOKEN`, `THESYS_API_KEY`, `TYPEFORM_FORM_ID`, `TYPEFORM_PERSONAL_ACCESS_TOKEN`, `TYPEFORM_WEBHOOK_SECRET` |

Before production publication, confirm each required variable exists in the Replit
deployment environment, identify its owner and backup owner, and test expiry,
rotation and failure behavior without revealing the value.


## AI-literacy release requirements — 2026-10-01

- `TYPEFORM_WEBHOOK_SECRET`: required shared signing secret, identical in Typeform
  and Replit **production**. Missing configuration refuses submissions with 503;
  an invalid signature receives 401. Set it before publishing the release.
- `TYPEFORM_FORM_ID`: pin the actual Scan form. Add the hidden field `language` in
  Typeform so the service email can follow the purchase language. The questionnaire
  and videos themselves remain English.
- `STRIPE_WEBHOOK_SECRET`: signing secret for `/api/webhooks/stripe`.
  If `/api/webhooks/stripe-satellitescan` is separately registered, give it its own
  `STRIPE_SATELLITESCAN_WEBHOOK_SECRET`; otherwise it falls back to the first secret.
  Confirm `payment_intent.succeeded` reaches the intended endpoint successfully.
- `EMAIL_UNSUBSCRIBE_SECRET`: strong random value of at least 32 characters.
  Required before any marketing send. Rotation invalidates previous unsubscribe
  links and needs an operator plan. Transactional Scan emails are separate.
- `PUBLIC_SITE_URL`: HTTPS origin only. Default is `https://www.greenelephant.org`.
  Confirm OAuth callback registrations use that same origin. This is not a secret.
- Resend: verify the actual sending domain, sender address, Reply-To and account
  access. An active connector is not proof of delivery or an accepted DPA.

Never paste secret values into chat, PRs, command output or release evidence. Check
production settings separately from workspace settings. Preserve existing values
and add only the required reviewed configuration.
