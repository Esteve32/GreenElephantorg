# Stage 4.3-F Final Privacy and Security Audit

Status: **IMPLEMENTATION CANDIDATE — clean CI and explicit human approval pending**
Status date: 2026-09-17
Branch: `feature/seed-mvp`
Pull request: [#4](https://github.com/Esteve32/GreenElephantorg/pull/4)
Delivery issue: [#14](https://github.com/Esteve32/GreenElephantorg/issues/14)
Authority: DEC-041; PRD AC-002, AC-003, AC-006, AC-016, and AC-017

This is an evidence record, not a new product decision. It covers the current
React/Vite/Express implementation and binds the same privacy invariants to the
approved successor stack. It does not authorize a production migration,
deployment, live Stripe action, outbound message, DNS change, merge to `main`,
or Stage 4.3 completion.

## Decision and evidence scaffolding

The durable recovery chain is:

1. `docs/DECISION_LOG.md` records approved rules, scope, and implementation status.
2. `docs/PRD.md` records product requirements and acceptance criteria.
3. Issues #8–#14 record the bounded delivery and evidence gates.
4. `docs/STAGE_4_3_PRIVACY_AUDIT.md` records cross-slice state and residual gates.
5. This file records the final test matrix, commands, environment, findings, and
   approval boundary.
6. Git commits and GitHub Actions preserve immutable implementation and execution
   evidence.

The words **specified**, **built**, **tested**, **approved**, and **activated** are
not interchangeable. The current state is:

| State | Result |
| :--- | :--- |
| Privacy contract specified | Yes — DEC-041 and the listed PRD acceptance criteria |
| A–E branch implementation | Yes — approved slice evidence is linked in the recovery ledger |
| F hardening implementation | Yes in this candidate — MyFive CSP/security headers, redacted error boundary, allowlisted operational errors, and expanded regression tests |
| Local automated evidence | Passing — 33 tests passed and 2 PostgreSQL fixtures skipped only because `TEST_DATABASE_URL` is absent; TypeScript and production build pass |
| Browser inspection | Passing for the private check-in path; details below |
| Dependency audit | Passing — `npm audit` reports zero known vulnerabilities across production and development dependency sets |
| Disposable PostgreSQL evidence | Pending clean GitHub Actions execution for this candidate |
| Human Stage 4.3 approval | Pending; it must be explicit after clean CI evidence is published |
| Production legal/privacy gate for survivor custody | Pending and separate; see `docs/STAGE_4_3_D_PRODUCTION_LEGAL_GATE.md` |
| Production migration/deployment/activation | Not performed and not authorized |

## Requirements trace matrix

| Requirement | Actors and negative cases | Direct evidence | Candidate result |
| :--- | :--- | :--- | :--- |
| AC-002 private check-in isolation | Participant A, participant B, unrelated account, anonymous visitor, admin viewer, admin writer, break-glass operator | Fail-closed HTTP endpoint; source and build inspection; encrypted IndexedDB browser journey; server query/export exclusion; metadata-only request log tests | Pass locally; clean CI pending |
| AC-003 bilateral consent | A only, B only, both, unlinked, unrelated, stale version, incomplete receipt, withdrawal, replayed receipt, concurrent mutation | Consent-policy tests, sanitized denial event inspection, common advisory-lock inspection, disposable PostgreSQL lock waiter proof | Pass locally except PostgreSQL execution pending CI |
| AC-006 deletion | A deletes first, B deletes first, stale session replay, delayed webhook, transient Stripe failure, rejected Stripe request, database failure, retry, completed replay | Stage 4.3-D/E unit and PostgreSQL fixtures | Pass locally except PostgreSQL execution pending CI |
| AC-016 eight-octant calibration | Explicit eight values, `Not assessed`, missing field, extra/inferred field, invalid value, A/B/unrelated/admin/break-glass reads | Exact vocabulary validator test, author-scoped route/export inspection, disposable PostgreSQL actor matrix | Pass locally except PostgreSQL execution pending CI |
| AC-017 break-glass isolation | Admin viewer, admin writer, synthetic break-glass ID | No MyFive admin read route or bypass; account middleware; database actor matrix; schema scan excludes card fields; browser vault has no server read path | Pass locally except PostgreSQL execution pending CI |

## Negative and failure-path matrix

| Case | Expected behavior | Evidence |
| :--- | :--- | :--- |
| ID substitution or unrelated account | No participant/profile/agreement access | Authorization, ownership, export, and PostgreSQL actor tests |
| Linked versus unlinked connection | Only explicit active/survivor participant relations authorize reads | Ownership and consent-policy tests |
| Stale consent or material version change | Agreement write fails closed and appends a minimized reason code | Consent-policy and route contract tests |
| Stale session replay | Account middleware rejects auth-version mismatch | Authorization and deletion tests |
| Concurrent consent/agreement mutation | The second transaction waits on the same slot lock and observes the committed withdrawal | Unit lock-discipline tests plus PostgreSQL waiter proof |
| Malformed JSON | MyFive error boundary returns only `invalid_json`; input and exception are absent from logs | HTTP regression test |
| Export subject confusion | Profiles and consent receipts are filtered by actor; joint records require active or survivor custody | Export source tests and PostgreSQL ownership fixture |
| Log/error leakage | Request logs contain route templates and status only; operational failures contain one allowlisted event code | API logger and Stage 4.3-F error-boundary tests |
| Stripe partial failure | Only redacted classifications persist; retry does not replay completed work | Stage 4.3-E unit and PostgreSQL fixtures |
| Database partial failure | Account remains fail closed; durable request resumes from the database phase | Stage 4.3-E PostgreSQL fixture |
| Deletion replay | Completed requests return completed without repeating Stripe work | Stage 4.3-E PostgreSQL fixture |

## Hardening completed in this candidate

### MyFive browser boundary

- MyFive pages and APIs receive a route-scoped production CSP with same-origin
  scripts and connections, no objects, no framing, and no arbitrary remote image
  endpoint.
- Camera, microphone, and geolocation permissions are disabled for MyFive.
- MyFive responses use `private, no-store`, `no-referrer`, `nosniff`, same-origin
  resource policy, and frame denial.
- Development permits only the inline script and WebSocket allowances required by
  Vite; the production policy contains neither `unsafe-inline` nor `unsafe-eval`
  in `script-src` and permits only same-origin connections.

### Error and log boundary

- MyFive route, authorization, cleanup, scheduler, export, voucher, Stripe, and
  deletion failures emit only a compile-time allowlisted operational event code.
- Raw exception objects, database messages, provider fragments, request bodies,
  response bodies, query strings, concrete route parameters, cookies, and headers
  are not serialized by the MyFive operational or request log paths.
- A MyFive-specific final error handler intercepts malformed JSON and unexpected
  failures before the legacy generic error handler can echo or throw their details.
- Browser-side check-in and ValueRules failure logs no longer pass raw exception
  objects to the console.

## Browser inspection

Environment: production Vite bundle served from a local synthetic static harness
at `127.0.0.1`; no production services, real identities, or real content used.

1. Loaded `/myfive/check-in` and confirmed the UI states: **Blind Vault**,
   **Qualitative Reflection (Private)**, and “Stored only in this browser unless
   you export it.”
2. Flushed the harness request log after the page and lazy assets loaded.
3. Selected `Flow`, entered the synthetic marker
   `SYNTHETIC-STAGE-4-3-F-PRIVATE-SENTINEL`, and completed the check-in.
4. The UI confirmed **Check-In Stored in Vault** and described the encrypted local
   store.
5. The instrumented HTTP harness recorded **no new request** after the octant,
   reflection, and submit actions. The synthetic marker therefore did not leave
   the browser through HTTP during the check-in.
6. Source regression tests separately prove the vault module has no `fetch`,
   `apiRequest`, `XMLHttpRequest`, `WebSocket`, or `sendBeacon` path and that local
   export preparation moves decrypted records only into an in-browser `Blob`.

The authenticated server-export half of the settings journey was not run against
a live account because this audit deliberately has no production or shared test
database credentials. Its actor filters and privacy headers are covered by source,
unit, and disposable-PostgreSQL evidence.

## Commands and local results

Environment snapshot:

- Date/time basis: 2026-09-17, Europe/Helsinki
- Repository: `Esteve32/GreenElephantorg`
- Branch target: `feature/seed-mvp`
- Remote parent before this candidate: `c98ff7ecab2eeb0a7b550a87fe9b2fa547e59739`
- Synthetic data only

| Command | Result |
| :--- | :--- |
| `npm test` | Pass: 35 discovered, 33 passed, 2 PostgreSQL tests skipped because local `TEST_DATABASE_URL` is absent |
| `npx tsc --incremental false` | Pass; this flag avoids writing through the worktree's read-only external `node_modules` symlink |
| `npm run build` | Pass; generated `dist/` remains uncommitted |
| `npm audit --omit=dev --audit-level=critical --json` | Pass: 0 known vulnerabilities; 467 production dependencies |
| `npm audit --audit-level=critical --json` | Pass: 0 known vulnerabilities; 672 total dependencies including development/optional sets |
| Tracked-source credential-literal scan | Pass: no Stripe/GitHub/Google/private-key literal pattern found outside generated output and lockfile |
| Compiled-source camera API scan | Pass: no `getUserMedia` or `mediaDevices.getUserMedia/getDisplayMedia` call in `client/src`, `server`, or `shared` |

The clean-checkout GitHub Actions gate must still run `npm ci`, `npm run check`,
all 35 tests against PostgreSQL 16, and `npm run build` before this evidence may be
presented for human approval.

## Residual risks and unbuilt work

1. The production migrations in Stages 4.3-C through E are plans only and have
   not been executed. The protected deletion flag remains a deployment gate.
2. The qualified legal/privacy gate for the survivor-custody policy remains open.
   Engineering evidence and workshop approval cannot substitute for that review.
3. Quarantined legacy `myfive_check_ins` rows may still exist. The active server
   has no acceptance, read, partner, admin, export, or deletion query for that
   table; production disposition requires a separately approved migration plan.
4. The browser inspection used the current production bundle and a local request
   harness. Authenticated end-to-end export and production CSP compatibility need
   deployment-level synthetic smoke evidence before activation.
5. Dependency-audit results are a dated registry snapshot and must be rerun before
   release.
6. The generic non-MyFive application error handler remains legacy work. MyFive is
   intercepted first by its redacted handler; the broader handler is outside this
   bounded stage and should be addressed in the wider security program.
7. The SvelteKit/Svelte 5/Zero successor implementation is specified but not yet
   built. It must reproduce this matrix before any MyFive surface cuts over; this
   audit is not transferable merely because the API shape appears equivalent.

## Rollback and approval gate

- If any clean CI, PostgreSQL, browser, or reviewer check fails, Stage 4.3 remains
  incomplete. Preserve the failure as evidence, keep affected production features
  disabled or on the verified legacy path, link the failing predecessor, and rerun
  without weakening the assertion.
- The candidate can be rolled back by removing the MyFive security middleware and
  query/test changes in its commit; no schema or production data rollback is needed.
- Only after clean CI evidence is attached to #14 may Estève explicitly approve
  the final Stage 4.3 privacy/security evidence.
- Only that later approval may check 4.3-F and parent 4.3, record the final decision
  version, and close #14. It still does not authorize production activation.
