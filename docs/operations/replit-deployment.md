# GitHub to Replit deployment

## Authority and current status

GitHub `main` is the intended source of truth. Replit is the build and deployment
runtime. The recovery branch `replit/reconcile-20260930` preserves the Replit
workspace checkpoint at `87ea3c3b8a99e6581c064cc7dad972c43bdb26c7`.

As of 2026-09-30, source recovery, a secret-free `.replit` configuration and
reproducible production builds are established. The automatic publish trigger is
**not yet established**. An active Replit GitHub
connector proves API access; it does not by itself prove source synchronization or
automatic publication.

## Target flow

1. A change is reviewed in a GitHub pull request.
2. Required GitHub checks install from the lockfile and build from source.
3. The pull request is merged to protected `main`.
4. Replit receives that exact commit through a supported source-control connection.
5. Replit runs `npm ci`, `npm run build`, then `npm start`.
6. A smoke check verifies the public deployment and records the deployed commit.

Do not automate step 4 or 5 with a Replit browser-session cookie or an undocumented
private API. If the app's Publishing settings expose a native GitHub auto-publish
control, prefer that supported control. Otherwise keep publication manual until a
supported Replit deployment trigger is available.

## Replit commands

- Development: `npm run dev`
- Clean dependency install: `npm ci`
- Production build: `npm run build`
- Production start: `npm start`
- Port mapping: local `5000` to external `80`

Generated `dist/` output is not tracked. Every deployment must build it from the
selected source commit.

## Safety gates

- Never force-push GitHub from the deployed application.
- Never deploy from an unreviewed Replit-only commit.
- Never run `scripts/post-merge.sh` as an automatic deployment hook: it contains a
  forced database schema push and requires a separate migration decision.
- Keep production secrets in Replit's deployment secret store, not in Git or build
  logs. See [`secrets.md`](secrets.md).
- AI-LIT discovery status and the MY5 pause remain unchanged by deployment work.

## Rollback

Record the previous deployed GitHub commit before publication. Roll back by selecting
that known-good commit in the supported Replit deployment interface and rebuilding;
do not rewrite GitHub history.
