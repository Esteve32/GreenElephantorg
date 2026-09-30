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
   configuration, build from source, and block critical dependency vulnerabilities.
   TypeScript errors and existing high-severity dependency findings remain visible
   but non-blocking until their separate remediation work is reviewed.
3. The pull request is merged to protected `main`.
4. The Replit workspace checks out `main`, pulls the merge commit and verifies the
   exact Git SHA without creating Replit-only changes.
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
npm run build
test "$(git rev-parse HEAD)" = "$expected_sha"

if [ -n "$(git status --porcelain)" ]; then
  echo "STOP: verification changed tracked or untracked files"
  git status --short --branch
  exit 1
fi

git status --short --branch

echo "READY: ask the human to review Replit Publishing and click Republish"
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
- Keep the critical-vulnerability audit blocking; review and reduce existing high
  findings in focused dependency-update pull requests.
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
- AI-LIT discovery status and the MY5 pause remain unchanged by deployment work.

## Rollback

Record the previous deployed GitHub commit before publication. Roll back by selecting
that known-good commit in the supported Replit deployment interface and rebuilding;
do not rewrite GitHub history.
