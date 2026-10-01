# GreenElephantorg — environment instructions

## Runtime and source of truth

- Node.js 24 is the supported application runtime. Check .nvmrc, package.json,
  GitHub Actions, flake.nix/flake.lock, replit.nix and .replit together before a
  runtime change.
- GitHub main is the reviewed source of truth. Replit is the build and deployment
  environment. A human selects Republish after the documented checks pass.
- Start with docs/operations/replit-deployment.md for release work and
  docs/operations/secrets.md for secret handling.
- Install from the lockfile with npm ci. Use npm run repo:check and the checks
  named in package.json for the task. Do not run npm start as a casual local check;
  startup activates production-like scheduled work.

## Secrets and live data

- Keep runtime secrets in the Replit deployment secret store and human-held
  credentials in the designated password manager. Never commit, print or paste
  tokens, private keys, cookies, connection strings or .env contents.
- Stop at unexpected credential prompts. Do not print raw Git remotes or
  environment/configuration dumps.
- Do not push, migrate a production database, contact live providers, or select
  Replit Republish unless the user explicitly requests that operation.

## Green Elephant OS boundary

GreenElephantOS has its own environment guide and controls Notion/Google OS
sources. The two repositories use a cross-repository impact check, not shared
runtime authority. Read the current OS PRD and decision log when changing shared
schemas, packages, Notion/Google data flows, calendar labels, emails, forms,
consent, payment data or release ownership. A linked repo or package README does
not prove an active connection.

The OS contract package is currently private, and this website package does not
declare it as a dependency. Do not add it or transfer website data to Notion
without a reviewed decision in the relevant canonical decision log.
