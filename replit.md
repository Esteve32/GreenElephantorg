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

## Credential-safe Shell and Git use

Follow the **Credential-safe Git and terminal use** rules in `AGENTS.md`. Replit's
`replit-git-askpass` can fail while Git prints a credential-bearing HTTPS remote in
its password prompt. Never display the raw remote URL or ask the user to paste a full
authentication prompt. If a token/password prompt appears, do not type a token:
press Ctrl+C; if the Shell is stuck, stop or close that Shell session in Replit.
Use the connected GitHub integration or another secure credential manager. If a
credential is exposed, stop and revoke it before further Git network operations.

Never force-push `main`, manufacture a replacement Git tree, commit secrets, or
publish automatically because a connector is active. Use a branch and pull request
for source changes. A deployment must identify the exact GitHub commit it uses.

At the start of deployment work, check for the open GitHub issue titled **Manual
Replit release pending**. If it exists, show the human its target SHA and copy-paste
Bash. If GitHub `main` is newer than the deployed SHA, explicitly say that a manual
workspace sync and human **Republish** are required. You may run the preparation
commands after the human asks, but stop before `npm start`, pushing, database work,
publishing or republishing. Never click **Republish** for the human.
