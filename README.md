# Green Elephant — website and product documentation

Start here: **[PRD](docs/PRD.md)** · **[Decision log](docs/DECISION_LOG.md)** ·
**[Agent instructions](AGENTS.md)** · **[Machine-readable project index](docs/project-index.json)**

| Project | Current work | Requirements | Decisions |
| --- | --- | --- | --- |
| AI Literacy Training Portal (AI-LIT) | Active discovery: offer clarity, search findability and a simple visitor journey | [AI-LIT](docs/PRD.md#ai-literacy) | [AI-LIT decisions](docs/DECISION_LOG.md#ai-literacy-decisions) |
| MyFive / My5 (MY5) | Paused, no resumption date; preserve draft work | [MY5](docs/PRD.md#my5) | [Pause and history](docs/DECISION_LOG.md#my5-decisions) |

## One editable PRD and one decision log

GitHub is the authority for both files. Project sections separate their scopes;
stable IDs make them easy for humans and agents to query. The JSON index contains
routes and provenance, not duplicate requirements or decisions.

Notion pages are mirrors of the relevant sections of these two files. The existing
Growth Playbook is historical strategy evidence for discovery, not another project
or a competing portal PRD. Notion AI usage limits do not block editing the GitHub
documents. No mirror integration or automatic synchronization is implemented by
this documentation change.

The alternative is one folder and one PRD/log pair per project. That would mean
four canonical files. We retain the requested single pair for now. If size later
justifies splitting, move each section once and replace the old location with a
pointer; never maintain both versions. GitHub Wiki would add another storage
location and is unnecessary for this arrangement.

## Repository map

```text
AGENTS.md                  Agent read order, authority and query rules
README.md                  Navigation and mirror workflow
docs/
  README.md                Documentation map
  PRD.md                   AI-LIT section + paused MY5 baseline
  DECISION_LOG.md          Shared decisions + AI-LIT + paused MY5 history
  project-index.json       Machine-readable routing and source provenance
  operations/              Current deployment and secret-management procedures
  archive/                 Historical material; never current instructions
attached_assets/           Source assets required by the Vite build
client/                    Existing React/Vite website
server/                    Existing Express application
shared/                    Shared types and Drizzle schema
scripts/
  record-decision-version.mjs  Updates the shared document revision ledger
.local-sources/            Private Notion ZIP archives; ignored by Git
```

Other existing documents in `docs/` are supporting/historical material. They do not
override the project-specific PRD and decision log. Application directories are
unchanged by this documentation consolidation; directory layout is not a decision
about the portal's future architecture.

## Reading and querying from Notion or another agent

1. Read `AGENTS.md` and `docs/project-index.json`.
2. Resolve GitHub `main` to a commit once, then read the PRD and log at that same
   commit. On a review branch, identify it explicitly as an unmerged candidate.
3. Select AI-LIT or MY5, read the current shared decisions and relevant project
   state, then follow the requirement/decision IDs. Read preserved history only
   in that scope.
4. Include the project, ID, status, source SHA, file/anchor and open gate in answers.
   Report inability to access GitHub instead of claiming cached material is current.

Example request for Notion AI:

> Consult Esteve32/GreenElephantorg. Read AGENTS.md and docs/project-index.json,
> then the AI-LIT sections of docs/PRD.md and docs/DECISION_LOG.md at the same main
> commit. What remains undecided about the first offer? Cite the requirement or
> decision IDs and commit links. If GitHub is unavailable, state that limitation.

This prompt requires an authorized GitHub-reading connection or supplied file
content in the calling tool. A public permalink alone does not configure a connector.

## Notion mirror contract

Use the existing project page IDs in `project-index.json`. Each page can show both
the PRD section and relevant decisions from the same Git commit. Shared decisions
must accompany each project view. Read-only means an operating convention here;
Notion permissions and sync automation still need configuration.

Each mirror must display:

- Project ID and a clear "Mirror — edit through a GitHub PR" notice.
- Living links to the canonical files on main.
- Commit-pinned links, source paths and source commit SHA.
- Sync timestamp and status: CURRENT, STALE, UNKNOWN or FAILED.

A living link follows the latest main version:

`https://github.com/Esteve32/GreenElephantorg/blob/main/docs/PRD.md#ai-literacy`

A reviewable snapshot uses the actual source commit in place of `<SHA>`:

`https://github.com/Esteve32/GreenElephantorg/blob/<SHA>/docs/PRD.md#ai-literacy`

Mirror refresh procedure (manual now; potential automation later):

1. Fetch the source pair at one main commit and compare those source files with
   the mirror's previous SHA. Unrelated code commits do not imply document drift.
2. Detect manual mirror edits and report conflicts before overwriting. Reconcile
   useful edits through a GitHub PR; Notion never silently overwrites canonical files.
3. Update the relevant project sections, shared decisions and metadata together.
   Preserve unrelated Notion content, tasks, comments and historical references.
4. Read back and compare the rendered content. Mark CURRENT only after both
   requirements and decisions match. A partial write is FAILED, not current.
5. Keep the last verified SHA on failure; report UNKNOWN when comparison cannot
   be made. Notion updates need not be atomic, so never claim an atomic replacement.

Mirror work is separate from Replit deployments and application runtime. Store a
future dedicated integration token in 1Password; scope access to the intended pages
and inject credentials into the chosen runtime when synchronization is implemented.
Never put a token in Git, a document, a terminal paste shared with an agent, or a log.
The old MyFive sync recipe inside its preserved PRD is historical and superseded here.

## Source preservation and migration

The three supplied Notion ZIPs were retained byte-for-byte under
`.local-sources/notion-2026-09-30/`. Their SHA-256 hashes and page IDs are in the
project index. The MyFive moodboard remains inside its original ZIP.

This repository is public. Raw exports include personal/client/financial material
and historical prompts, so they are deliberately excluded from Git. Relevant
product content is consolidated into the canonical pair with source attribution,
proposal status and conflicts. Client names and transaction details are not needed
in the public requirements. Linked pages are references, not fully imported content.

The newest MyFive requirements and ledger were recovered from feature commit
`3e9b050cc1b133496087ff4e2c87c125131a9bac` and preserved verbatim inside the
canonical documents. All original ledger rows remain. This imports documentation
only: main's application code has not gained the feature branch's security changes.

The documentation branch begins at main commit
`31f299c047d3d0fab80b8f33c7e049bc9fbbb2a4`.
Until publication/merge, GitHub main and Notion still contain their previous docs.
See [source reconciliation](docs/DECISION_LOG.md#source-reconciliation).

## Desktop and laptop workflow

Use a separate GreenElephantorg checkout on each computer, with this same origin.
The filesystem path can differ; all canonical document paths are repository-relative.

```bash
git clone https://github.com/Esteve32/GreenElephantorg.git
cd GreenElephantorg
git config user.name "Estève Pannetier"
git config user.email "email@estevepannetier.com"
git status --short --branch
git fetch origin
```

On a computer with Nix installed, enter the shared Node.js environment and start
the development server:

```bash
nix develop
npm ci
npm run repo:check
npm run dev
```

If Nix is unavailable on a computer, use a Node version manager such as `nvm` with
the checked-in `.nvmrc`:

```bash
nvm install
nvm use
npm ci
npm run repo:check
npm run dev
```

Before changing computers, commit the intended files and explicitly push the work
branch when ready. The other computer can then fetch that branch. GitHub cannot
recover edits or commits that have never left the first computer. Private source
ZIPs need a separate private transfer and hash verification; they are not cloned.

A commit author email is not a cryptographic signature. Signing, if used, needs a
separately configured key. This setup does not change global Git identity or Arbora.

Use branches and review PRs for documentation changes. Update the decision log when
approval or scope changes, then record its revision:

```bash
npm run decision:record -- --summary "PROJECT-ID: approved change" --approved-by "Estève Pannetier"
```

The intended delivery direction is GitHub `main` to Replit. The recovered source now
builds without relying on committed `dist/` output, but the supported automatic
publish trigger still requires verification in this app's Replit Publishing settings.
See [the Replit deployment procedure](docs/operations/replit-deployment.md).

## Existing application tooling

The repository contains React/Vite/Express/TypeScript and a locked npm dependency
tree. Node.js 24 is the shared runtime baseline: `.nvmrc` configures local version
managers, GitHub Actions pins Node 24 and the repository check verifies it matches
`.nvmrc`, `flake.nix` plus `flake.lock` give both computers the same Nix development
shell, and `replit.nix` configures Replit. Commands are defined in
`package.json`: `npm ci`, `npm run check`, `npm run repo:check`, `npm run build`,
`npm run dev` and `npm start`. CI blocks repository/configuration errors, production
build failures and critical dependency vulnerabilities. Existing TypeScript errors
and high-severity dependency findings are reported as known follow-up work; the
workflow does not yet claim a functional browser test suite or a production deploy.

Before running the app, verify a suitable runtime and use isolated development
services. The application needs environment configuration such as database and
session credentials; use Replit deployment secrets or a private local environment.
Use [`.env.example`](.env.example) for names only and read the
[secret inventory](docs/operations/secrets.md). Never copy secret values into GitHub
issues, pull requests, agent prompts or logs.
