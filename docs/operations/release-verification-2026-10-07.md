# GreenElephant — final release verification, 7 October 2026

This is dated verification evidence, not a new PRD or approval authority. Follow
[the canonical deployment runbook](replit-deployment.md), [secret inventory](secrets.md)
and [DEC-AIL-079](../DECISION_LOG.md#dec-ail-079).

## Status

**Not yet cleared for publication.** Reviewed base:
`81a6bc5eec307e71bb0bee0ee6b70aba593e3ddc`.
The next release must use the exact GitHub SHA after this PR is reviewed and merged.
The owner requested publication; the supported action is still human Republish.
No agent publication, backend startup, database operation or provider send is
authorized by this evidence record.

## Preserved Replit work

- Original Replit SHA: `3df532c78e68adbcd961646c8b7c67150a1bb588`.
- Original branch and named backup
  `backup/replit-before-reviewed-release-20261007-3df532c7` were preserved.
- Dirty files and the uploaded handover were preserved in a permission-700 private
  local backup. Its location/readbacks remain local, not in this public document.
- Unique old changes concerned Replit runtime/preview settings, lockfile metadata
  and agent notes; no additional website functionality was found.
- The prior release branch also preserves the automatic agent-asset metadata
  checkpoint `3b850c8c8b265304845c1b0244c0c0dd7df09df1`. This generated checkpoint
  is not reviewed website source and is not included in the new PR.
- No branch reset, overwrite, force-push or private-source upload is required.

## Actual checks on the reviewed base

| Check | Result / limitation |
| --- | --- |
| Node | v24.13.0 |
| Repository structure/assets | Passed |
| Release tests | 117 passed, zero failed |
| TypeScript | Zero diagnostics with a process-only 4 GB Node heap; default heap exhausted memory, not a type error |
| Production build | Passed; non-blocking large-chunk warning |
| Dependency audit | Zero high/critical and six moderate findings |
| Replit locked clean install | **Not fulfilled:** supported installer ran `npm install --no-audit`, not `npm ci`; generated lockfile metadata was preserved and reviewed contents restored |

This PR's changed source requires its own checks and required GitHub **Source build**
CI. CI executes `npm ci`; a successful CI install does not become evidence that the
same command ran inside Replit. Do not suppress diagnostics or force audit upgrades.

## Real preview evidence and media repair

Only `npm run preview:website -- 5000` is permitted for website review. It uses the
exact current development hostname, binds `0.0.0.0` in Replit and refuses unrelated
Host values. No wildcard/second Vite config, backend startup or production command
change is needed.

Prior real proxied Preview checks:

- Desktop 1280×720 and phone 390×844 completed Periodic Table → Influence Strategies
  → View Related Prompts → Resources with `lens=influence` → Show all prompts.
  The final route was `/resources#prompt-library`, with no lens query.
- The filter label and URL behavior passed. Fetched prompt content could not be
  verified because website-only APIs intentionally return 503.
- Unrelated Host returned 403; preview `/api/ping` returned the expected 503.
- French cookie controls fit the phone screen; checked pages had no horizontal
  document overflow.
- Site GA/GTM attempts were zero before choice, after Reject, immediately after
  Accept and after reload. Resources' embedded media separately attempted 20
  DoubleClick advertising requests; the test browser blocked them.

The candidate repair must mount no iframe or load a remote thumbnail before an
explicit video choice. Accepting site analytics is not video permission. The
placeholder explains that loading YouTube may set cookies; closing the player
removes it. `youtube-nocookie.com` is not a promise of tracking-free playback.
Existing titles, external watch links and downloads remain available.

Recheck the repaired journey with real provider requests monitored and blocked
where playback would otherwise call third parties. Do not use synthetic Google
analytics responses as event-receipt evidence.

### Candidate verification after the repair

- Repository checks and production build passed. TypeScript passed; all **119**
  release tests passed. Dependencies and the reviewed lockfile are unchanged.
- The saved Run workflow contains only `npm run preview:website -- 5000`. Node
  module, build/start commands, deployment type and domains are unchanged.
- Real proxied desktop and phone browsing found **zero** GA/GTM, media or
  DoubleClick attempts before a video choice. All 23 video placeholders stayed local.
- Reject and Accept were exercised using the actual `/cookies` controls, then
  navigating to Resources and reloading. Both choices persisted; both produced
  **zero** analytics, media or advertising attempts and zero iframes.
- Resources intentionally has no analytics-cookie control because it is outside
  the marketing allowlist. The first test plan incorrectly expected a control there;
  the corrected carryover checks passed without code changes or response stubs.
- One keyboard-triggered video load mounted exactly one `youtube-nocookie` iframe.
  Its one provider attempt was blocked, not forwarded. All other players remained
  unloaded. Close, reload and navigating away/back left zero iframes and no new
  provider attempts. Actual third-party playback is intentionally unverified.
- At 390×844, the disclosure/button were readable and keyboard-focusable; document
  width stayed within its viewport. All 23 external watch links and six local
  infographic downloads were retained and inspected without external navigation.
- Preview `/api/public/analytics-config` and prompt APIs return the intentional
  **503**, so site analytics is **fail-closed**, not a simulated enabled:false API.
  Prompt-backed features and production event receipt are not verified here.
- Direct server unrelated-Host check returned 403; the Replit proxy itself returned
  404 for the unrelated Host. Website-only `/api/ping` returned the expected 503.

The required GitHub CI result is recorded on the PR at its exact head SHA. This
candidate evidence alone is not review/merge, a completed Replit clean install or
publication clearance.

## GA4 setting changes: owner report, not independent readback

The owner approved disabling Enhanced Measurement and ads personalization and
subsequently reported both switched OFF. No authorized GA4 administration connection
is available to this agent, so these statuses are **owner-reported**, not independently
verified.

- Preserve the existing account/property/Web stream and measurement-variable name.
- Keep Google Signals and user-provided data OFF. Retention was not authorized to
  change. Prior observed retention: events two months, users fourteen months,
  reset-on-new-activity ON; these facts are not privacy approval.
- Keep site collection disabled until destination/access, retention/processor/privacy,
  consent and duplicate-source checks are satisfied.
- Compare Project and linked Account entries privately. Preserve shared Account
  secrets; only approved app-scoped unlinking after dependency review is appropriate.
- Inspect Publishing/production separately from workspace settings.
- Run `analytics:preflight -- --expected-id G-BVMYQ91QQW --expect disabled` only in
  an identified configuration context. The public ID is not a credential. A
  non-production failure is intentional, not production evidence.
- Do not enable collection or claim received `page_view`/`marketing_cta` events
  from a flag, script load, owner's switch change or a source test.

## Outstanding production gates

1. Confirm actual production signing/configuration: Typeform form and hidden language,
   Typeform webhook signature, Stripe webhook endpoints/signatures, conditional
   Satellite Scan secret, sending-domain/account access and signed unsubscribe before
   marketing. Secret tools provide presence statuses only, not provider readbacks.
2. Verify the participant notice explains full answers going to the participant with
   both coaches copied. Keep assessment information out of marketing lists.
3. Review controller, actual retention/deletion, processor agreements, transfers,
   hosting and cookie/media disclosures. No GDPR certification is claimed.
4. Verify approved synthetic purchase/submission/replay and delivery chains. Resend
   acceptance, delivered event and inbox receipt are separate. Sending requires
   approval of exact sender/recipients/subject/body/attachments; none was sent here.
5. Complete retained public-page/email French batches and human review. Core
   bilingual pages do not close AI-LIT-REQ-032.
6. Check Cloudflare TLS, cache exclusions and actual security-event causes without
   globally disabling protections. Keep existing domains and deployment type.
7. Identify the actual previous live deployment/source for rollback. Public ping and
   Autoscale build status do not identify a deployed SHA.
8. Merge the reviewed PR, prepare its exact SHA with a clean tree and leave development
   database copying OFF. Only the owner selects Republish.
9. Record successful public health and exact deployment evidence before closing #31.
   If collection is separately approved/enabled, verify the live consent matrix and
   actual sanitized events on all five English coaching pages before closing #43 or
   starting the shared comparison window.

After an actual publication, complete the eight-section ACX100 self-audit, especially
transparency, accountability, fairness and technical robustness. This record does not
claim that a publication or that audit occurred.
