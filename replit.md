# Replit agent entrypoint

This repository is controlled from GitHub. Replit is a development and deployment
runtime, not an independent source of truth.

Read in this order:

1. `AGENTS.md`
2. `docs/project-index.json`
3. `docs/DECISION_LOG.md#shared-decisions`
4. The selected project section in `docs/PRD.md` and `docs/DECISION_LOG.md`
5. `docs/operations/replit-deployment.md`
6. `docs/operations/secrets.md`

AI-LIT remains in active discovery. MY5 remains paused. Pulling, building or
deploying this repository does not approve either project's open product decisions.

Never force-push `main`, manufacture a replacement Git tree, commit secrets, or
publish automatically because a connector is active. Use a branch and pull request
for source changes. A deployment must identify the exact GitHub commit it uses.

