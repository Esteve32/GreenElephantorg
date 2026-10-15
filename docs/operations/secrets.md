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
| Restricted admin configuration | `ADMIN_OWNER_EMAIL`, `PRIVACY_ADMIN_GOOGLE_BINDINGS` (private assignments, blank by default; no values in Git) |
| Core | `DATABASE_URL`, `SESSION_SECRET`, `PORT`, `NODE_ENV`, `PUBLIC_SITE_URL` |
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

## Retired shared admin password — local Google-only candidate

`ADMIN_PASSWORD` and stored `admin_password_hash` are no longer read for admin
login under DEC-AIL-086. Neither value should be added for new deployments of this
candidate. Existing production values are not removed by this code; clean them up
only during reviewed rollout after verifying the deployed revision. Do not export
them for review. Follow [admin transition and recovery](admin-access-recovery.md)
for the named-account preflight, session rejection and controlled operator recovery.

<a id="privacy-workflow-candidate"></a>
## Privacy workflow candidate

- `PRIVACY_WORKFLOWS_ENABLED=false`: new notice/choice/case operations remain unavailable until the additive migration and access configuration are verified. Existing withdrawal suppression stays active independently while this flag is false. Legacy marketing flags alone no longer authorise campaigns.
- `PRIVACY_WORKER_ENABLED=false`: no new background privacy work unless explicitly enabled together with workflows. The former daily digest scheduler is no longer started.
- `PRIVACY_MAIL_SENDING_ENABLED=false`: independent final transport gate. An enabled worker still needs a fingerprint-matched human approval and the Resend connector. Previewing or approving a draft does not turn this flag on.
- `PRIVACY_CONFIRMATION_KEY`: separate 32-byte key encoded as 64 hexadecimal characters. Never reuse provider/webhook keys; rotation invalidates pending confirmation drafts and links, requiring reconciliation.
- `PRIVACY_MAIL_FROM`, `PRIVACY_MAIL_REPLY_TO`: reviewed sender identity and reply address. No live default is inferred. Domain/return-path/processor checks remain external gates.
- `PRIVACY_ATTENTION_ALIASES`: exactly two distinct approved privacy aliases, comma separated. This is routing, not a grant of website access. Restricted Google/MFA bindings remain separately required. New privacy drafts always CC the owner's traceability address under the 15 October instruction; this does not change other existing customer-message recipients.
- `PRIVACY_WEEKLY_DAILY_RECIPIENT`: private address resolved only when the owner selects that recipient reference. Weekly timezone/day/time, recipients and any deadline-attention window must be explicitly reviewed in the saved settings; none is seeded.

The actual Typeform definition inspected on 15 October is English and declares no
hidden parameters. Its ready-to-start and optional raw-answer email questions are
not marketing consent or participant identity. `service_reference` remains a
provider setup gate. The v2 mapping derives service language from the recorded
purchase, not an assumed Typeform language response. Earlier `language` setup notes
above describe the legacy path and are not evidence of a verified provider field.
Do not enable new intake or sends from these names alone.

## Order-aware Typeform runtime — next local batch

The earlier no-hidden-parameter observation is superseded by the 15 October
DEC-AIL-102 public readback: `service_reference` is now declared and published.
Run `npm run typeform:preflight` for a read-only public configuration check.

- `TYPEFORM_ORDER_INTAKE_ENABLED=false`: default retains the existing handler. Enabling mounts the reviewed order-aware intake at the **same** `/api/typeform-webhook` URL. A failure in enabled mode never invokes the email-matching path. Deploy/validate all intake, service-review, content and originals migrations first. No schema-wide push or startup migration.
- `TYPEFORM_FORM_ID`: must match the reviewed Individual Scan mapping exactly. The signing secret and connector must also be ready; public definition success alone does not prove them.
- `TYPEFORM_EVIDENCE_KEY`: separate random 32-byte AES key, encoded as 64 hex characters. `TYPEFORM_EVIDENCE_KEY_ID` is its non-secret version label. Keys stay outside the database and repository. Originals contain private answers and the original reference/signature, so they are encrypted before storage. Application writes preserve first capture; the database is not claimed immutable. Dedicated access, backup, retention and deletion rules remain required.
- `TYPEFORM_ORDER_LINKS_ENABLED=false`: independently gates purchase/reminder link preparation. It requires order-aware intake configuration, a separate `TYPEFORM_ORDER_REFERENCE_KEY` and an explicitly reviewed `TYPEFORM_ORDER_REFERENCE_TTL_HOURS`. No duration is seeded. Expiry derives from the original purchase time and is preserved on retries. Do not copy the placeholder `xxxxx` from Typeform's generic Share screen into customer links.
- `TYPEFORM_SERVICE_PREVIEW_FROM`: reviewed sender address for no-send completion previews. Exact recovery also needs the existing scoped Typeform token. No extra Google/Notion permissions or real responses were read by local tests.

Key loss or rotation, including a changed webhook signing secret, holds recovery
when an original cannot be verified/decrypted. Retain old keys only under a reviewed
operator policy; do not silently re-encrypt/replace originals or downgrade checks.
No retention period is invented here. Metadata retention controls do not erase this
new original/assignment evidence or provider/backups; include those in the full
reviewed retention inventory before activation.

## Service-email delivery controls — local candidate

- `SERVICE_EMAIL_CONTROL_ENABLED=false`: opt-in shared ledger and owner controls for Scan purchase, reminder and separately approved completion messages. Enabling it requires the existing privacy foundation plus `migrations/20261015_service_email.sql`, validated by the Replit agent. It does not cover every legacy coaching or marketing sender.
- `SERVICE_EMAIL_SENDING_ENABLED=false`: separate operator transport gate; the saved queue also starts paused. Turning on one switch cannot bypass the other. Disabling control while sending remains queued is not a safe rollback; pause and reconcile first.
- `SERVICE_EMAIL_ENCRYPTION_KEY`: dedicated 32-byte key encoded as 64 hexadecimal characters. Separate from Typeform evidence/reference and provider keys. Pending purchase/reminder envelopes are encrypted with AES-256-GCM and authenticated to job/draft IDs. Completion content is recovered and rechecked rather than stored again. Key rotation holds unreadable pending drafts; never reset their claims.
- `RESEND_SERVICE_WEBHOOK_SECRET`: signing secret for `/api/webhooks/resend-service`. Original bytes and Svix headers are verified with the installed Resend SDK; credentials are never passed to the browser. Do not confuse this with the Typeform or Stripe signing secret.
- `SERVICE_EMAIL_CRON_SECRET`: separate secret of at least 32 characters for the bearer-authenticated POST `/api/internal/service-email-tick`. Replit owns the real schedule. No schedule is created or activated by this source change; do not duplicate an existing trigger. A tick checks at most five approved jobs, with a shared one-request-per-second reservation.

The free-plan defaults are local ceilings of 100 recipient places per UTC day and 3,000 per UTC month, confirmed in Resend documentation on 15 October 2026. To/CC copies each count. They are not live account usage: other applications, privacy messages, legacy senders and inbound mail share the provider quota but are outside these counters. Set lower caps where appropriate; use Resend Usage for the account total. Provider quota/rate errors or uncertain acceptance remain held, with no automatic resend.

`npm run service-email:preflight` reads configuration booleans only. Optional `-- --dns greenelephant.org` reads public DNS. It never starts the backend, accesses a database, retrieves email content or sends mail. A configured secret or active connector is not proof that the production endpoint, schedule, DKIM/return-path or receiving mailbox works. Use the [service-email verification loop](replit-deployment.md#service-email-verification-loop).
