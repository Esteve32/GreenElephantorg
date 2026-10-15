# GitHub to Replit deployment

## Authority and current status

GitHub `main` is the intended source of truth. Replit is the build and deployment
runtime. The recovery branch `replit/reconcile-20260930` preserves the Replit
workspace checkpoint at `87ea3c3b8a99e6581c064cc7dad972c43bdb26c7`.

As of 2026-09-30, source recovery, a secret-free `.replit` configuration and
reproducible production builds are established. The Replit Publishing overview and
settings show a live Autoscale deployment with a manual **Republish** action. They do
not expose a source branch, deployed Git commit or automatic GitHub publish trigger.
An active Replit GitHub connector proves API access; it does not by itself prove
source synchronization or automatic publication.

The runtime baseline is Node.js 24: `.nvmrc` configures local version managers,
GitHub Actions pins Node 24 and the repository check verifies it matches `.nvmrc`,
`flake.nix`/`flake.lock` provide a shared Nix shell for both computers, and
`replit.nix` installs the matching Node 24 package in Replit. The repository check
also verifies the Replit build/start commands against the npm scripts.

The Nix flake pins Nixpkgs 26.05 for repeatable local setup. Refresh `flake.lock`
and the Replit Nix channel together during a planned runtime update; the 26.05
Nixpkgs release receives security updates through 2026-12-31.

## Credential-safe Git preflight

The Replit Shell may have a credential-bearing token in its local HTTPS `origin`
URL. If Replit's `replit-git-askpass` fails, `git fetch` can print that URL in
the password prompt. Never ask a user to type a token at that prompt or paste the
prompt into chat.

Before fetching, run the credential check in the release block below. It tests the
configured `origin` without printing it and stops if HTTPS user-info is present.
Do not run `git remote -v`, `git remote get-url`, `git config --list`, shell
tracing, environment dumps, or verbose network logging to diagnose credentials.
Use the approved GitHub connection or a secure credential manager. If a credential
is displayed, stop and revoke it with the provider before continuing. If Replit's
Shell is stuck at a prompt, press Ctrl+C; if that fails, stop or close the Shell
session from Replit's UI.

## Supported flow today

1. A change is reviewed in a GitHub pull request.
2. Required GitHub checks install from the lockfile, validate repository/runtime
   configuration, run the release tests, build from source, and block high and
   critical dependency vulnerabilities. TypeScript checking is blocking;
   moderate transitive audit findings remain to review.
3. The pull request is merged to protected `main`.
4. The Replit workspace fetches `main`, creates a local release branch at the exact
   approved SHA and verifies it without creating Replit-only code changes.
5. A human selects **Republish** in Replit Publishing. Replit runs `npm ci`,
   `npm run build`, then `npm start` from the workspace snapshot.
6. A smoke check verifies the public deployment and records the Git commit that was
   present in the workspace when **Republish** was selected.

This is a controlled manual release, not continuous deployment. Do not automate
steps 4 or 5 with a Replit browser-session cookie or an undocumented private API.
Keep publication manual until Replit exposes a supported deployment trigger for this
app, or move the deployment to a platform with a documented GitHub deployment hook.

## Automatic human reminder

Every push to GitHub `main` runs `.github/workflows/replit-release-reminder.yml`.
The workflow creates or refreshes one open issue titled **Manual Replit release
pending**. The issue names the exact `main` SHA and provides a ready-to-paste Bash
block. If another merge lands before publication, the same issue is updated to the
newest SHA instead of creating a queue of stale release issues.

Agents must surface the open issue during GitHub/Replit work and stop at the human
boundary. The preparation block fetches GitHub, refuses a dirty workspace, creates
a new local-only release branch at the exact SHA, verifies Node.js 24, installs from
the lockfile, validates the repository, builds, and checks that HEAD did not move.
It intentionally does not start the application because startup activates schedulers.
It never pushes or publishes.

After the block passes, the human leaves database copying disabled and selects
**Republish**. Close the reminder issue only after the public domains and `/api/ping`
pass and the exact SHA has a successful GitHub production deployment record.

If the workflow is unavailable, replace `<GITHUB_MAIN_SHA>` below with the reviewed
SHA and provide this whole block to the human:

```bash
bash <<'REPLIT_RELEASE'
set -euo pipefail

expected_sha="<GITHUB_MAIN_SHA>"

if ! git config --get remote.origin.url >/dev/null 2>&1; then
  echo "STOP: Git remote origin is missing"
  exit 1
fi

if git config --get remote.origin.url | grep -E '^https?://[^/]*@' >/dev/null; then
  echo "STOP: origin contains HTTPS credentials; do not display it or enter a token"
  exit 1
fi

git fetch origin

if [ -n "$(git status --porcelain)" ]; then
  echo "STOP: the Replit workspace is not clean"
  git status --short --branch
  exit 1
fi

test "$(git rev-parse origin/main)" = "$expected_sha"
release_branch="replit/release-${expected_sha:0:8}"

if git show-ref --verify --quiet "refs/heads/$release_branch"; then
  echo "STOP: $release_branch already exists; inspect it instead of rewriting it"
  exit 1
fi

git switch --create "$release_branch" "$expected_sha"
case "$(node --version)" in
  v24.*) ;;
  *) echo "STOP: Node.js 24 is required"; exit 1 ;;
esac

npm ci
npm run repo:check
npm run test:release
npm run check
npm run build
npm audit --audit-level=high
test "$(git rev-parse HEAD)" = "$expected_sha"

if [ -n "$(git status --porcelain)" ]; then
  echo "STOP: verification changed tracked or untracked files"
  git status --short --branch
  exit 1
fi

git status --short --branch

echo "BUILD VERIFIED: complete the release gates in docs/operations/replit-deployment.md before human Republish"
REPLIT_RELEASE
```

## Replit commands

- Runtime: Node.js `24.x` (`nodejs-24` in `.replit`)
- Development: `npm run dev`
- Clean dependency install: `npm ci`
- Production build: `npm run build`
- Production start: `npm start`
- Port mapping: local `5000` to external `80`

Generated `dist/` output is not tracked. Every deployment must build it from the
selected source commit.

## Website-only Replit preview

For page review without connecting the database, schedulers, email or payments,
use `npm run preview:website -- 5000`. In Replit this binds to `0.0.0.0`, matching
the existing port mapping. Local previews continue to bind to `127.0.0.1:5180`.
The website-only preview returns 503 for `/api` and marks responses noindex.
It is not evidence that production providers work.

Both Vite development and built preview use the exact `REPLIT_DEV_DOMAIN`
hostname supplied by the workspace. If it is unavailable, set `GE_PREVIEW_HOST`
to the exact hostname shown by Replit Preview, without `https://`, a path or a
port, then restart the preview process. These are public hostnames, not secrets.
Do not use `allowedHosts: true`, `*.replit.dev` or `.replit.dev`; other workspaces
must remain blocked. The source configuration is `vite.config.ts`, not a new
`vite.config.js`. A host setting does not publish the website.

If the process is `vite preview`, rebuild first and restart that preview after
the configuration change. Prefer the website-only command above for page review:
it preserves the application's public metadata/status behavior and explicitly
disables backend actions. Do not use `npm start` to fix a preview error.

Before release, preserve any Replit-only commits on their existing branch and
review their differences from the selected GitHub commit. Preserve dirty files
before switching branches. The release preparation block above deliberately
selects a clean exact GitHub SHA; a workspace merge containing extra unreviewed
Replit commits is not the same release. Do not reset, discard, force-push or copy
the development database as a shortcut.

## Safety gates

As of 2026-09-30, GitHub `main` is protected. It requires a pull request and the
strict `Source build` check, requires conversation resolution, enforces the rule
for administrators, and blocks force-pushes and branch deletion. Required approvals
are set to zero for the current single-maintainer workflow. Add an independent
reviewer and revisit the approval count if repository ownership changes.

- Keep production builds and repository/runtime configuration checks blocking.
- Keep high and critical dependency vulnerability checks blocking. Review moderate
  transitive findings without forcing unreviewed breaking upgrades.
- Keep TypeScript checking blocking; do not suppress new diagnostics to release.
- Never force-push GitHub from the deployed application.
- Never deploy from an unreviewed Replit-only commit.
- Never run `scripts/post-merge.sh` as an automatic deployment hook: it contains a
  forced database schema push and requires a separate migration decision.
- Keep production secrets in Replit's deployment secret store, not in Git or build
  logs. See [`secrets.md`](secrets.md).
- Leave **Copy development database to production database** disabled during routine
  publication. It is a destructive data operation, not a deployment requirement.
- The approved AI-LIT scope and the MY5 pause remain separate; publication does not resume MY5.

## Rollback

Record the previous deployed GitHub commit before publication. Roll back by selecting
that known-good commit in the supported Replit deployment interface and rebuilding;
do not rewrite GitHub history.

## AI-literacy release checklist — 2026-10-01

**Status: release candidate, not evidence of a fully bilingual or production-tested
service.** The current local tests use synthetic data and isolated providers.
No live payment or successful Resend inbox delivery has been demonstrated for this
candidate. The earlier authorised free-order request returned 403 without a purchase
identifier; do not retry blindly or attribute that response to Cloudflare without
checking the event logs.

### 1. Review the actual translated pages

Review `/`, `/fr`, `/scan`, `/fr/scan`, `/blog/acx-levels-ai-literacy`,
`/fr/blog/acx-levels-ai-literacy`, the English/French Scan checkout and confirmation.
Use desktop and phone widths. Check all footer destinations, images and anchor links.

The core pages and critical Scan email templates are bilingual. **Retained legacy
service, resource, tool, coach and policy pages and legacy email families still need
French batches.** Their French footer links are marked `(EN)`. Do not describe this
release as complete French coverage or close AI-LIT-REQ-032 yet.

### 2. Complete production configuration and privacy checks

- Complete the required entries in [the secret inventory](secrets.md#ai-literacy-release-requirements--2026-10-01).
  Verify Typeform/Stripe signing in both provider dashboards and Replit production
  before publishing; unsigned webhooks are now refused. No database migration is
  introduced by this change. Do not run `db:push` or copy the development database.
- Confirm the Typeform participant notice describes full answers being sent via
  Resend to the participant with Estève and Anu copied. Keep assessment information
  out of marketing lists. The owner's instruction to copy coaches is not evidence
  of participant notice or consent where required.
- Confirm the legal controller, actual retention/deletion process, processor
  agreements and international-transfer safeguards. This source review is not a
  GDPR certification. Review the [EDPB small-business guide](https://www.edpb.europa.eu/sme/be-compliant/be-compliant_en)
  for the organisational evidence needed alongside technical controls. The application has no automatic assessment anonymisation.
- Replit currently documents US hosting by default, with EU hosting by Enterprise
  arrangement; do not promise EEA-only hosting without evidence of that arrangement.
  [Replit publishing documentation](https://docs.replit.com/learn/projects-and-artifacts/replit-deployments)
- Optional public-page analytics now has a candidate consent implementation, but
  collection defaults off until the GA4 checklist below is complete. Automatic
  promotional onboarding remains disabled. Do not resume it through an analytics
  consent choice. Signed marketing unsubscribe requires its separate secret.
- The new Scan purchase path does not copy purchases into Notion: restoration of
  that transfer was rejected by automatic approval review for lack of specific
  approval for buyer email, name and amount. Existing unrelated integration paths
  are not removed by this change; verify their notices separately.

### 3. Test the email and payment chain with synthetic data

Review the **exact final sender, recipients, subject, body and attachments** with
Estève before sending newly revised templates (AGENTS.md, Email approval safety).
Use only the authorised test inboxes; keep the testing coupon out of this repository.

| Check | Required evidence before marking it passed |
| --- | --- |
| EN and FR free Scan orders | Coupon produces zero total; one purchase per voucher/address; correct language; repeated request does not create another purchase or email |
| Stripe paid branch | In Stripe test mode, correct EUR 99.95 amount, authenticated successful webhook, one purchase record; a 100% voucher alone does not test card payment |
| Purchase email | Resend acceptance ID, delivered event and inbox receipt; working Typeform link and correct hidden language |
| Submitted Scan email | Signed synthetic Typeform response; full answers in order, selectable results block and intact attachment; correct participant plus both coaches; no duplicate on replay |
| Dashboard-ready email | Coach manually sends from cockpit after preparing the real report link; participant can open it with the intended access |
| Data-export email | Logged-in user receives their complete JSON attachment; another visitor cannot request that user's data |
| Reminder | One eligible synthetic order; counted only after Resend acceptance; completed Scan receives no reminder |
| Marketing controls | Non-consenting/suppressed contacts excluded; signed unsubscribe works; opening an email creates no tracking record |

Email clients do not reliably run JavaScript. Result blocks use selectable text and
full attachments, not a JavaScript copy button. Verify selection and attachment
opening in the actual receiving mail client. Resend acceptance, provider delivery,
and inbox receipt are three separate checks.

Reserved `admin_settings` keys beginning `email_ops:v1:` hold hashed send identities,
status/time, locale and suppression. If a send is `pending` or `unknown`, reconcile
it with the exact Resend/purchase event. **Do not delete the claim and retry blindly.**
A partial admin/customer send requires role-specific recovery. Historical paid
purchases without the new locale marker require reconciliation on Stripe replay;
they do not receive a fresh purchase email automatically. The runtime database
transaction/unique constraints have not been exercised locally.

### 4. Check Cloudflare, then publish and verify

- Keep the existing DNS and deployment domains. Confirm origin TLS and use
  [Full (strict)](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/)
  only with a valid origin certificate; do not downgrade to Flexible.
- Confirm `/api/*`, `/admin*`, `/portal*`, `/dashboard*`, checkout and payment
  confirmation are not cached by any custom rule. They return `Cache-Control:
  no-store`; a broad Cache Everything rule must not override this.
- Inspect Security events for failed checkout/provider requests. A browser challenge
  can break server webhooks. On the free plan, **Bot Fight Mode cannot be bypassed
  using a WAF Skip or Page Rule**. Identify the actual blocking service before
  changing a setting; do not disable protections globally as a guess.
  [Cloudflare Bot Fight Mode documentation](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/)
- Only after the above gates pass, the human chooses **Republish**. Keep database
  copying off. Record the previous deployment for rollback first.
- Verify both domains and `/api/ping`, EN/FR routes, checkout and the delivery chain.
  The ping endpoint proves HTTP health only, not database or provider health.
  Record the exact successful GitHub deployment SHA, then close the pending-release
  issue. Leave it open if any required gate remains unresolved.

## GA4 relaunch checklist — candidate prepared 2026-10-03

For dated source/preview evidence, the owner-reported GA4 switch changes and remaining
gates, see [the 7 October verification record](release-verification-2026-10-07.md).
That record is not publication or privacy clearance.

Use the **existing** GreenElephant GA4 property and Web stream. Do not create a
duplicate property or use the numeric `GA4_PROPERTY_ID` as the `G-...` measurement
ID. The numeric ID and service-account credentials support reporting separately;
their presence does not prove browser event delivery.

Before enabling collection:

1. Verify the destination/account owner, processor/transfer arrangements, access
   and retention settings. The browser choice and GA cookies expire after 180
   days; that is not an account-side retention or deletion guarantee. Review the
   updated privacy/cookie wording and EN/FR controls.
2. Turn **Enhanced Measurement off** for the selected Web stream, including
   history-based page views, outbound links, site search, downloads, videos and
   forms. This implementation sends its own page views and two bounded event
   types; extra automatic events could duplicate counts or collect other data.
   Keep Google Signals, advertising and user-provided-data collection off. Verify
   there is no Cloudflare/CMP/GTM or other separately injected tracking tag.
3. In Replit **deployment** settings, verify `VITE_GA_MEASUREMENT_ID` contains that
   existing stream's public `G-...` identifier. Once the above is reviewed, set
   `GA4_COLLECTION_ENABLED=true`. This new switch is deliberately false/missing
   by default. No agent has set it or changed any production secret. The server
   exposes only the validated public ID through `/api/public/analytics-config`,
   with `no-store`; this fixes the build-time Vite/deployment-environment mismatch.
4. Publish only the reviewed commit through the human-controlled release flow.
   Verify the config endpoint returns `enabled:true` on production. Preview and
   non-production hosts must not send analytics, even after pressing Accept.

### Resolve duplicate GA4 settings and verify the effective configuration (#43)

Inspect **Publishing/production** separately from workspace Secrets. Compare the
existing Web stream ID privately with both the Project entry and any linked Account
entry named `VITE_GA_MEASUREMENT_ID`. Replit may give the linked Account entry
precedence. A process receives only the effective value and cannot report which
entry supplied it. Never diagnose this with an environment dump or by printing the
secret values. Check whether another app depends on the Account entry before
changing it; prefer unlinking it from this app over deleting a shared secret.

Keep the exact variable name. Once the chosen source is unambiguous, inspect the
published deployment configuration again; a workspace edit is not proof that an
existing deployment changed. Keep `GA4_COLLECTION_ENABLED=false` until the preceding
account, privacy and consent checks are complete. Changing the Google property or
stream is not part of this task.

Run the value-free check in the intended runtime, replacing the example with the
existing stream's **public** measurement ID:

```bash
npm run analytics:preflight -- --expected-id G-EXISTINGSTREAM --expect disabled
```

After the owner authorizes collection and the reviewed production release uses it,
repeat with `--expect enabled`. The command reads the process environment without
loading `.env`, makes no network calls and prints only statuses. A non-production
runtime, invalid flag, missing/mismatched ID or unexpected enablement fails. A pass
is only configuration evidence for that process: it does not resolve duplicate
sources, attest production settings or prove received events. Do not start the
backend to obtain this check. A clean local/website preview is expected to fail the
production-runtime requirement.

Account-side retention is separate from the site's 180-day consent/cookie expiry.
Record event retention, user retention and the reset-on-new-activity switch as three
separate facts. Do not extend retention or attest processor/transfer terms merely
to run the three-month comparison. Use aggregate reports within the owner's chosen
policy; live acceptance remains a human gate.

Keep issue #43 open until the destination/source, consent matrix and received
`page_view`/`marketing_cta` evidence are complete. A merged verification PR does not
close that production task. Record release/public health evidence in #31 and
analytics evidence in #43; start the common observation window only after all five
English coaching pages and actual events have been checked.

After publishing, use a clean browser and record release evidence in issue #31 and analytics evidence in #43:

- Before choosing and after Reject: no GA/GTM load or analytics collection request.
- Accept: exactly one initial `page_view`; a reload gives one new view. Navigating
  between allowed landing pages gives one view per change, not duplicate history
  events. A blocked loader may result in missing events, never a broken page.
- A discovery-call or Scan checkout-link click emits `marketing_cta`, not a booking
  or purchase event. Check `cta_action`, `cta_position`, `use_case`, `language` and
  the allowlisted public `page_path` in GA4 Realtime/DebugView. Register the custom
  dimensions in the existing account for reporting if needed.
- Only `/`, `/fr`, `/scan`, `/fr/scan` and the five English `/ai-coaching/...` pages
  are measured. Names, emails, answers, scores, purchase IDs, URL queries, hashes
  and full referrers are not sent by the site. No automatic form/assessment events.
  Acquisition uses fixed broad referral categories, not arbitrary UTM values;
  direct/unknown and browser privacy limitations must stay visible in reports.
- “Cookie choices” remains available at the bottom of the allowed pages and
  policies. Withdraw: collection stops, site GA cookies clear and the page reloads
  to remove the loaded library. Rejection persists. Test a second open tab too.
- Test navigation and browser Back/Forward into excluded routes: no private URL
  or assessment payload in analytics. Check mobile layout, keyboard access and
  French wording. Automated unit checks are not a substitute for this browser test.
- Verify received events in the **existing account**. Then record one shared start
  date for the three-month comparison. Configuration and a successful build alone
  do not establish live measurement. Consent-dependent counts are not all visitors.

Google references: [basic consent mode](https://developers.google.com/tag-platform/security/concepts/consent-mode),
[consent setup](https://developers.google.com/tag-platform/security/guides/consent),
[manual page views](https://developers.google.com/analytics/devguides/collection/ga4/views),
[single-page applications](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications).

<a id="service-email-verification-loop"></a>
## Service-email verification loop — candidate, 15 October 2026

Estève retains Replit release and database validation through the Replit agent. Local source work must cross-check this deployment boundary on every email change. GitHub source/tests do not attest current production configuration, account automations or delivery. Do not run the whole backend as a preview: it still starts the existing daily reminder check. This batch adds no background timer or schedule.

### Tool ownership and trigger map

| Step | Website source | Provider / deployment check |
| --- | --- | --- |
| Paid order | Verified Stripe payment-intent success, expected product/amount/currency and unique payment identity; voucher path separately locked | Replit production signing secret and exact Stripe endpoint; test event must not create two orders/notifications |
| Purchase email | Original purchase claim/language; same existing Typeform link with stable order reference; independently tracked customer/admin jobs when new control flag enabled | Resend connector or deployment secret, reviewed From/Reply-To and actual domain. Google MX is mailbox routing, not proof of Resend authentication |
| Reminder | Fresh successful, incomplete, unfulfilled order older than 72h; one durable operation; qualifying response awaiting review pauses it | Existing process timer/manual route and any external schedule must be inventoried in Replit. No second schedule or new cadence assumed |
| Typeform completion | Signature, pinned successful-completion mapping and same-link order reference; protected original; owner-reviewed participant/recipient evidence | Existing `/api/typeform-webhook`, exact form and hidden field, accepted/refusal endings, provider retries; a click/readiness answer does not prove payment, final completion or identity |
| Completion draft | Fresh original/API recovery, exact order/recipient/language/content; human approval separate from submission | Owner reviews exact message, all CCs and attachment. New completion draft includes the trace CC. Raw-answer completion is separate from the later coach dashboard/report |
| Dispatch and receipt | Atomic durable claim, local recipient quotas, shared rate reservation, no retry of submitting/unknown/accepted jobs; signed delivery reports and tagged API reconciliation | Replit-hosted bearer-protected `/api/internal/service-email-tick`; Resend `/api/webhooks/resend-service` with raw signed bytes. Check existing Resend Automations separately before assuming no overlapping send |

### Replit agent's verification record

Record the reviewed source SHA, deployment identity and configuration source without secret values. Re-check this record after any relevant change; do not use another agent's earlier green checks as current production evidence.

1. Validate the additive service-email migration and the existing privacy/Typeform foundations in the target you identify through your established Replit process. Local Mac work deliberately did not validate any database. Run the prepared `npm run test:service-email:db` companion in your Replit validation process; then separately validate the actual target/transport/multiple-connection behaviour. Passing its disposable fixture is not approval of a populated target. Keep development-to-production copying off.
2. Keep `SERVICE_EMAIL_CONTROL_ENABLED=false` and `SERVICE_EMAIL_SENDING_ENABLED=false` until the migration, access, keys, sender and rollback are reviewed. Saved controls start paused. Verify named owner/Google MFA, revoked/expired sessions, Origin protection and the processing-recovery hold. General admins/viewers cannot use these controls.
3. Resolve Resend through the existing Replit connector or approved deployment secret. Check Free plan/current usage, domain verification, exact From/Reply-To, DKIM, SPF return-path and DMARC alignment, plus suppression history. Public DNS readback on 15 October showed Cloudflare nameservers, Google MX, one SPF record listing Google/AmazonSES/Resend and DMARC `p=none`; this is not a DKIM/alignment/reputation or legal attestation. Preserve Google mail routing; never add competing root MX or a second SPF record from a generic setup guide.
4. Inspect actual Replit deployment type, process lifetime, current reminder cron/timer and Resend Automations. Autoscale/process restart can stop an in-process timer. Use one reviewed scheduled caller for the new protected tick if needed. No cron is created by the source. Never put the bearer secret in a URL, browser, log or command output.
5. Verify Cloudflare permits signed POSTs to the exact Stripe/Typeform/Resend callback paths and the authenticated internal tick. A browser challenge/HTML response must not be mistaken for webhook success. Keep protections scoped; do not disable global bot/security controls. Cloudflare is not a substitute for provider signatures.
6. In the owner website queue, review lower recipient caps if other senders/inbound mail use the same account. The local 100/day and 3,000/month defaults count all To/CC recipients of tracked jobs, including uncertain attempts. They are not the Resend account total. Jobs share one request reservation per second; provider429/unknown responses are held, not automatically retried. Purchase/admin jobs can queue independently; one failure must not resend the already accepted counterpart.
7. Use a designated supervised order and approved test recipients through Stripe/voucher → original purchase email/link → Typeform final response → owner evidence/resolution → exact completion preview → explicit approval → one dispatch. Confirm amount/currency/product, recipient, all CCs, original language/reference/expiry, attachment and notice. Do not send real test messages without exact human message/recipient approval. Other legacy coaching/marketing mail remains outside this scoped queue.
8. Subscribe the service webhook to sent/delivered/delayed/bounced/complained/failed/suppressed events. Verify signatures, unchanged replay deduplication, changed-payload conflict, receipt-before-API-acknowledgement, restart and simultaneous cron/manual calls. Bounce/complaint/failure/suppression pauses tracked sending. The callback itself sends nothing; inbound replies/open/click events never trigger this worker.
9. An unknown/submitting job has no retry/reset button. Paste its exact Resend ID into **Check Resend record · sends nothing**. The backend retrieves the record and requires exact job/draft tags; wrong records are rejected. API observation time is labelled separately from original delivery-event time. Do not delete claims to clear an error. A crash after claim can require this reconciliation even when no API call actually occurred.
10. Confirm acceptance, provider mail-server report, each intended recipient/CC and actual inbox/Spam placement separately. A combined provider-message event cannot prove delivery to every CC or reading. Do not enable open/click tracking to fill that gap. Preserve records for retention/recovery review; encrypted queued purchase/reminder drafts and minimal receipts are new retention-inventory items. Never restore/release a processing hold without reconciling provider history and old claims.

Rollback: pause the tracked queue and disable its sending switch first. Preserve claims, encrypted pending messages, key access and provider IDs. Do not disable the control flag to bypass a held queue or fall back to an older sender. Reverting to legacy sending requires separate reconciliation of all approved/submitting/unknown/accepted operations. Uncertainty must stay visible.

Primary references checked15 October 2026: [Resend idempotency (24 hours)](https://resend.com/docs/dashboard/emails/idempotency-keys), [Free-plan quotas and recipient counting](https://resend.com/docs/knowledge-base/account-quotas-and-limits), [signed webhook verification](https://resend.com/docs/webhooks/verify-webhooks-requests), [delivery-event meaning](https://resend.com/docs/webhooks/emails/delivered), [Replit deployment types](https://docs.replit.com/features/publishing/deployment-types), [Cloudflare Google Workspace DNS](https://developers.cloudflare.com/dns/manage-dns-records/how-to/set-up-google-workspace/).
