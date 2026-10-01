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

## Supported flow today

1. A change is reviewed in a GitHub pull request.
2. Required GitHub checks install from the lockfile, validate repository/runtime
   configuration, run the release tests, build from source, and block high and
   critical dependency vulnerabilities. Pre-existing TypeScript errors remain
   visible but non-blocking; moderate transitive audit findings remain to review.
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

## Safety gates

As of 2026-09-30, GitHub `main` is protected. It requires a pull request and the
strict `Source build` check, requires conversation resolution, enforces the rule
for administrators, and blocks force-pushes and branch deletion. Required approvals
are set to zero for the current single-maintainer workflow. Add an independent
reviewer and revisit the approval count if repository ownership changes.

- Keep production builds and repository/runtime configuration checks blocking.
- Keep high and critical dependency vulnerability checks blocking. Review moderate
  transitive findings without forcing unreviewed breaking upgrades.
- Remove the TypeScript `continue-on-error` exception after the existing baseline
  errors are repaired.
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
- Analytics initialisation and automatic promotional onboarding are disabled.
  Do not resume them until consent, withdrawal, template purpose and language have
  been checked. Signed marketing unsubscribe requires its separate secret.
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
