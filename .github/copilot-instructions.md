# Repository instructions

Read [AGENTS.md](../AGENTS.md) before working in this repository. It defines the
canonical documentation, project boundaries and evidence/query protocol.

Use [docs/project-index.json](../docs/project-index.json) to find the selected
project's sections in the single PRD and decision log. This file is only an adapter
for GitHub Copilot; it does not define another source of product requirements.

For GitHub/Replit release work, surface the open issue titled **Manual Replit release
pending**, provide its exact-SHA copy-paste Bash, and stop before `npm start`, pushing,
database operations, publishing or republishing. Replit does not automatically pull
or publish GitHub `main`; the human performs **Republish**.
