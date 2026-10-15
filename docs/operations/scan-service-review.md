# Scan service review — local candidate

Authority: [DEC-AIL-096](../DECISION_LOG.md#dec-ail-096),
[scope and gates](../PRD.md#ai-lit-scan-service-review-20261014).
This runbook describes a local, unconnected candidate. It does not activate intake,
configure Typeform, approve a message or authorize a migration or release.

## Inspect with fictional data

In the website checkout, using Node 24:

```bash
npm run preview:scan-review -- 5182
```

Open `http://127.0.0.1:5182/admin/scan-service`. The harness uses an in-memory PGlite
database, a fictional owner session and fictional assignment evidence. It listens
only on loopback, shows a permanent synthetic banner and disables all other API
routes. It imports neither the application entrypoint nor live DB/mail/provider
modules. The owner session expires after 30 minutes; restart to reset it and the
fictional data. Stop with Ctrl+C. Never deploy or expose this harness remotely.

Review the paid receipt, keep it on hold, then select its server-held evidence and
record assignment. The second order sharing the payer email stays untouched. The
result shows an owner, target time and retrieval-pending coach task. The refusal
and generic-link fixtures cannot resolve. Nothing sends or retrieves real answers.

## Ownership, records and transactions

The UI uses component memory, clears private results on visibility changes, access
refresh and authentication expiry, and uses no shared query cache/local storage.
Failed writes retain the same mutation ID for an explicit retry; stale responses
cannot restore hidden private state. Refresh after an uncertain/cancelled attempt.

The staged HTTP registration checks current Google/MFA provenance and a recent
named-owner session on every read/write. The store rechecks and locks the actual
active owner row inside the transaction. Other administrators and viewers have no
queue access. Reads commit minimal audit evidence before returning records.
Writes require the configured origin, JSON, bounded strict bodies and expected
versions. Caller Host/forwarded headers do not define the trusted origin.

The original signed receipt/outcome is preserved. Review state/version and an
append-only action record describe subsequent owner decisions. Holds and rejections
do not complete a purchase. Rejection is terminal in this slice; corrections need
a separately reviewed reconciliation path. A repeated identical mutation returns
the recorded result; changed content or a stale version conflicts.

Resolution locks purchase, binding and existing receipt in that order. It requires
qualifying final-response evidence, exact mapping/reference and an eligible order,
then atomically creates one task, reserves the response, completes that order and
records review/audit evidence. A unique `(form_id,response_id)` index protects all
staged task creation, including automatic intake. Transaction errors roll back all
effects. No identity-verification fields or marketing permissions are written.

## Evidence boundary

The store's injected `evidence(eventId)` reads immutable, server-controlled,
previously recovered evidence only; it must not perform provider/network calls
while database locks are held. There is deliberately no runtime default or route
to upload evidence. A browser can select a reference, never supply a participant,
recipient, digest or completion assertion. The synthetic loader is not a provider
adapter and is never imported by application startup.

Each candidate must match event/form/response/order, original payload and response
digests, incoming reference and mapping digests. It needs separate assignment and
recipient evidence references, a participant reference, recipient and recorded
timestamp. It cannot contradict an existing independently verified participant.
Those references identify protected service evidence, not an automatic identity
attestation. Reviewed assignment is stored on the restricted task; original
binding verification fields remain unchanged.

The existing webhook's raw JSON digest is representation-specific. A future exact
Typeform response reader must establish canonical/versioned comparison rules and
evidence provenance using official provider semantics and fixtures. Do not hash a
different API representation and assume equality. Missing historical completion,
reference or mapping metadata remains null and cannot be overridden here. Recover
and reconcile it through a reviewed later path, or hold the case.

The task stores a reviewed recipient in restricted detail, not in the general
receipt list or audit payload. Raw answers and report content are not stored by
this queue. Processor/content-storage access, retention/deletion and recovered
evidence provenance remain explicit connection gates.

## Migration and connection gates

The prepared migration order is:

1. `migrations/20261014_typeform_service_intake.sql`
2. `migrations/20261014_scan_service_review.sql`

The second migration is additive. Its response index intentionally fails if old
tasks contain conflicting response identities; reconcile them without deleting
history before retrying. No historical evidence is backfilled by assumption.
Validate on a positively designated disposable Neon target. Both populated Replit
databases remain excluded. PGlite tests do not establish Neon transport, production
migration safety or multiple-process locking.

The HTTP registration remains unmounted in `server/routes.ts`. Before mounting,
validate the actual evidence reader, provider mapping/key/expiry policy, migrations,
owner session/access, retrieval/recipient handling and the integrated existing
journey. Mount before the legacy body-copying audit middleware, using this module's
durable minimal audit instead. Do not start the full backend for visual review:
startup enables schedulers. Keep the existing website preview available separately.

## Coach work and sending

The handoff is `pending_retrieval`, owned by the reviewing owner, with a target at
72 hours after the original qualifying submission. Late review does not reset the
existing 48–72-hour customer expectation. The task is visible attention/work, not
response backup, report readiness, mail acceptance or delivery.

Retrieval/progress/report preparation, a bound no-send message preview and durable
dispatch are later work. Keep existing coach-copy policy and actual participant
disclosures; do not route private content to a payer/employer by default. Recipient
access to a report is separate from HTTPS syntax. Exact sender/recipients/subject/
body/attachments need human approval before any live send; edits invalidate that
approval. Unknown provider acceptance requires reconciliation before retry.

The active legacy webhook still matches completion by email and couples it to
Resend. Existing manual coach sends still accept unbound recipient/content input.
These remain integration gates. No live journey is repaired merely by passing this
candidate's local tests or creating a task. `dashboardSent` is not updated here.


## Exact-response recovery and completion preview

The owner can choose **Recover response and preview completion email** after a
reviewed resolution. This exposes a no-send draft: exact sender, participant To,
existing coach Cc/reply address, subject, HTML, plain text, attachment and fingerprint.
The HTML iframe is sandboxed and blocks external assets. There is no approval or
send action. Task state and `dashboardSent` remain unchanged.

New receipts can record v1 content/label digests through the third prepared migration
`migrations/20261014_scan_response_content.sql` after the first two migrations.
Historical nulls cannot be inferred. This projection supports text, email, numeric,
boolean, date, single/multiple-choice answers. Unsupported/extra answer fields,
missing or ambiguous field identities, missing original labels or conflicting API
identities hold recovery. Full provider questionnaire coverage is not established.

`createTypeformResponseReader` takes an explicit mapping, token, injected request
transport and immutable signed-definition lookup. There is no environment or global
fetch default. The deadline is at most five seconds and the JSON body at most2MiB.
The candidate uses the documented api.typeform.com endpoint; actual account region
and token/response_id behavior must be checked before a receiving-system test.
No production reader is registered; no real responses were read in this batch.

The selected v1 projection compares form/response/time, order-reference/mapping
commitments and typed answers. Object-key and answer order are canonicalized;
choice/ranking order is preserved. Original question labels and their order are a
separate signed commitment. Raw webhook, raw API and normalized-content hashes have
different meanings. The reader does not compare their JSON bytes for equality.
Missing recent results are pending, not a fabricated deletion or completed failure.
There is no email-search, arbitrary current-form title or payer-recipient fallback.

The preview first audits/captures the current task/order/recipient/locale, releases
locks, recovers, validates content, then rechecks/audits the unchanged context before
returning. The fingerprint covers task context, provenance and exact message bytes.
It is a draft identifier, not recorded human approval. A changed sender, recipient,
content, attachment or template requires a new human review before any later send.

The harness supplies fictional API items, credentials, original definitions and
sender from memory. This does not select durable raw-content storage, access,
retention or backup. A production evidence/definition capture and provenance route
remains required; provider retrieval alone does not prove a participant or recipient.
Recovery/preview does not advance coach report preparation or attest report access.
The real legacy webhook and manual send routes remain unresolved connection gates.

Primary references checked14October2026:
[Retrieve responses](https://www.typeform.com/developers/responses/reference/retrieve-responses/),
[Webhook identities](https://www.typeform.com/developers/webhooks/example-payload/).
