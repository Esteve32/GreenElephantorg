# Google-only admin transition and recovery

Decision: [DEC-AIL-086](../DECISION_LOG.md#dec-ail-086).
Requirements: [AI-LIT-REQ-101/102](../PRD.md#ai-lit-google-only-admin-20261008).
Status: local implementation candidate; this procedure has not been run against
staging or production. It does not authorize provider, database or release actions.

## What changes on activation

- Administrators use individually approved Google accounts. No public bootstrap,
  shared password login, password change or password recovery endpoint exists.
  The two retired password POST routes return 410 without checking credentials.
- Existing password sessions and older sessions without signed Google MFA evidence
  stop working. The server checks the session's Google subject against the current
  active administrator record on protected requests, including legacy portal admin
  endpoints and the Fathom connection callback. `/api/admin/check` uses the same
  identity check. Revoked accounts, changed subjects and disallowed domains fail closed.
- Ordinary session-cookie lifetime remains seven days. Owner controls and privacy
  access retain their separate 30-minute website login window. A verified Google MFA
  claim does not prove a fresh Google challenge for each sensitive action.
- Sole owner, daily administrator and secondary administrator assignments remain
  as selected in DEC-AIL-085. Privacy access remains limited to the two separately
  approved accounts. Account recovery must not expand those permissions.
- `ADMIN_PASSWORD` and stored `admin_password_hash` no longer authenticate anyone.
  The old hash is excluded from settings responses and cannot be written through
  the settings API. This code does not delete settings, accounts or audit history.
- Customer portal authentication is a separate surface; its password/reset flow
  is unchanged and cannot establish an administrator session.

## Current readiness evidence — 8 October 2026

Estève reports that the Google readiness checks are complete and the website
OAuth client matches the production client ID. The agent has not independently
inspected those live settings. Reuse this confirmation; do not restart the Google
setup workshop. Account-specific evidence remains in private local notes.

Configuration readiness does not establish the deployed backend revision or live
sign-in/signed-claim, SMS or recovery results. Those checks remain paused until an
authorized environment contains the intended backend and the account holders are
present. The planned supervised checkpoint is Friday, 16 October 2026,
Europe/Helsinki. Reuse an existing scheduling receipt; no duplicate is needed.
This date is neither release approval nor permission for unattended testing.

## Before an authorized rollout

1. In controlled operator access, verify the actual three account records and
   Google identities. Preserve existing record IDs, subjects and history. Confirm
   distinct owner/daily accounts and exact primary addresses; do not derive a
   Google subject from an address. The owner needs an active stored `super_admin`
   row and matching `ADMIN_OWNER_EMAIL`; ordinary staff retain ordinary roles.
2. Verify that the Google OAuth application can accept the external owner account
   as well as the selected organization accounts. Review the exact callback origin,
   client configuration and Google account recovery/MFA arrangements separately.
   Never paste tokens, secrets, backup codes or account exports into review notes.
3. Confirm an authorized operator can reach hosting configuration and the database
   independently of website login. Agree who executes recovery and how the owner
   approves it. No second website owner is implied. If recovery access is missing,
   stop the rollout instead of disabling the only working access path.
4. Capture a protected backup and a minimal record of the relevant account,
   configuration and session state. Rehearse recovery on an isolated copy with
   synthetic data. Confirm how to revoke sessions in the deployed session store.
   Backup and recovery evidence here are distinct from local source-code backups.
5. In an approved staging environment, verify owner login/team management, both
   ordinary admin logins, the two approved privacy bindings, secondary-admin privacy
   denial, disabled/unapproved accounts, changed subject rejection and old password
   session rejection. Confirm retired endpoints do not write accounts or settings.
   Exercise database unavailability and Google failure without enabling a fallback.
6. Complete the existing additive withdrawal-migration gates if releasing the
   combined working tree. Use reviewed migrations, never schema-wide `db:push`.
   Apply the normal [GitHub-to-Replit release gates](replit-deployment.md); the human
   selects Republish. Remove the obsolete runtime password secret only as a
   separately reviewed configuration cleanup after confirming the deployed revision.
   Do not delete audit evidence or account rows to clean up the transition.

## Recovery cases

**An ordinary administrator cannot sign in:** use the appropriate Google account
recovery process first. A working named owner can inspect the existing approved
account, reactivate it when justified, or invite an individually approved team
account. The UI cannot change Google subjects or transfer ownership. A changed
primary address/Google identity requires a reviewed operator procedure; do not
create duplicates or borrow someone else's sign-in.

**The owner cannot sign in:** verify whether Google account access or website
configuration is failing. Recover the existing Google account first when possible.
If website data/configuration needs repair, obtain explicit owner authorization
through an independently verified channel and name the operator, exact affected
record/configuration, intended change and rollback. The daily account cannot
self-promote and the secondary administrator cannot become owner through the UI.
A permanent transfer to another owner is a new human decision, not routine recovery.

**All Google sign-ins fail:** stop access-dependent work, diagnose provider status,
client/callback configuration and session storage through controlled operator access.
Use an isolated environment to verify the fix. Do not enable a shared password or
introduce a public recovery endpoint. A provider outage may leave website admin
access unavailable until service is restored.

## Operator repair and verification

This is a review checklist, not a runnable production migration. Concrete commands
require the actual schema, affected IDs, expected pre-change values and deployment
revision to be verified in the authorized environment first.

1. Back up the affected records securely and record the reason, human approval,
   operator and exact planned before/after change outside public Git. Prefer restoring
   the existing identity and record. Scope any transaction to expected existing
   values and stop if row counts or bindings differ from the reviewed plan.
2. Make only the approved repair; preserve audit history. Record the access repair
   and its minimal before/after evidence atomically with account changes. Review
   deployment configuration changes separately; do not claim they are in the same
   database transaction. Do not clear a subject merely to allow the next claimant
   to bind an account.
3. Revoke affected website sessions using the verified deployed session store.
   A restored account must not silently regain previously issued sessions. If
   selective revocation cannot be verified, agree a wider invalidation scope first
   (it can also sign customers out). Clear/recheck any affected privacy binding;
   never grant a replacement identity privacy access by inference.
4. Verify a fresh Google sign-in, current role, team protection and intended privacy
   access; test the replaced identity and old sessions are denied. Check minimal
   audit evidence. Keep a recovery record without secret values or raw session data.
5. If verification fails, keep access closed. Restore only reviewed safe account/
   configuration values and revoke affected sessions again. Do not roll back to a
   password-enabled application or restore old session rows as an access workaround.
   A code rollback requires a reviewed target retaining Google-only enforcement;
   otherwise pause the rollout and repair forward.

## Evidence limits

Automated local tests use synthetic identities and isolated HTTP sessions. They do
not attest real Google account ownership, MFA, live OAuth callbacks, operator
recovery, production migration, full legacy authorization coverage or compliance.
Provider tokens, old GET side effects and the wider customer portal require their
own reviews. No OS adapter, Notion transfer, email send or provider setting is
changed by this local transition.

## Approved MFA package A — 8 October 2026

Estève confirms that he controls Google Workspace for the greenelephant.org
accounts and requests Google authentication with MFA, SMS and alternative-email
recovery. He selected package A under [DEC-AIL-088](../DECISION_LOG.md#dec-ail-088).
Website owner permissions and Google Workspace administrator roles are different.
No Workspace policy or personal Google security setting has been changed.

Approved package A: use passkeys as the preferred sign-in method, retain SMS as an
available fallback, and prepare offline backup codes plus a separately accessible
recovery email. This is approval of the design and local implementation, with live
configuration and rollout still separate. [Google’s method guidance](https://support.google.com/accounts/answer/185839?hl=en).

For the managed accounts, first enrol and test the chosen methods, then enforce
2-Step Verification for the intended administrator accounts/group in the Workspace
Admin console. Google's “Any” methods policy permits SMS; “Only security key” does
not provide that same flexibility. Confirm available recovery and enrolment options
before enforcement to avoid lockout. Do not silently change policy for unrelated
staff. [Workspace deployment guidance](https://knowledge.workspace.google.com/admin/security/deploy-2-step-verification).

The separate external owner account needs its own verified security setup; the
GreenElephant domain policy does not automatically govern it. Recovery email is an
account-recovery channel, not an interchangeable website MFA factor. Use an address
the owner can reach if the primary account is unavailable; protect it independently
and avoid circular recovery dependencies. [Google recovery options](https://support.google.com/accounts/answer/183723?hl=en).

Finland does not provide a delivery guarantee: test the actual Finnish number
and carrier, including recovery without the primary device. Google notes that SMS
availability varies by location/provider and can be withheld during unusual sign-ins.
Keep a tested method that works without SMS. Never record phone numbers, recovery
addresses, keys or codes in public Git or training slides.
[Google SMS troubleshooting](https://support.google.com/accounts/answer/185834?hl=en).

### Website verification is a separate implementation gate

The local candidate verifies a signed Google ID token and requires explicit MFA
evidence. Google readiness is human-confirmed above; local implementation tests
do not prove a successful live sign-in or the claims returned by Google.
Google now documents optional signed ID-token `amr` and `auth_time` claims through
its Security Bundle, listed under early access and requiring a published, verified
OAuth app and enabled settings. Confirm availability for the actual client.
The local implementation validates the signature, issuer, audience, expiry, nonce,
subject and verified email, and requires `amr` containing `mfa` plus valid `auth_time`. Missing evidence must not be
silently treated as success; test the external owner and both managed accounts.
[Google Security Bundle](https://developers.google.com/identity/siwg/security-bundle).

`auth_time` describes the Google session, not a fresh website password/MFA prompt.
Google documents that Google Account reauthentication requests are not supported.
The existing 30-minute website owner/privacy window is therefore not proof of a
fresh Google second-factor challenge. If per-action step-up is required, design and
review that separately instead of repeatedly redirecting users and claiming MFA.
[Google OIDC claims](https://developers.google.com/identity/openid-connect/openid-connect).

Claim validation and missing/invalid-claim denial tests pass locally. Provider
readiness, live login/recovery tests and human rollout approval remain open. The
training UI distinguishes local implementation from live verification.

The admin flow uses a fresh state, nonce and PKCE verifier; attempts expire after
ten minutes. State is consumed and saved before exchanging the code, then Google
checks the one-use code and PKCE binding. Sessions rotate at start and on success.
A required login audit is written before the success redirect. Failed callbacks
clear the browser cookie and destroy the attempted session; raw provider errors
and tokens are not logged. Routine access guards require stored MFA provenance.
There is no environment switch to bypass missing evidence. Stage and test this
candidate before release: an ineligible project would lock out administrators.
The Google sign-in time is not bounded to the thirty-minute website window; a
separate per-action step-up design would require human review.

## Beginner configuration checks

These are retained reference steps. Estève has confirmed the readiness checks
complete; do not repeat the setup workshop. Revisit only a material configuration
change or a specific failure in the supervised test. Reading a setting does not change it.
Do not switch on enforcement or change live settings during this inspection.
Record only **checked**, **needs attention** or **not checked**, with a short reason.
Never copy a password, client secret, recovery code or sign-in token into notes.

### 1. Check where Google sends you after sign-in

**Who:** the person who manages the website's Google project and hosting settings.

1. Open [Google Auth Platform](https://console.cloud.google.com/auth/overview).
2. Choose the website project, then **Clients**, then its web client.
3. Find **Authorized redirect URIs**. This means “allowed return addresses”.
4. Compare the admin return address with the website's configured address below.

**Expected:** the same address in Google and the website. If the deployed
PUBLIC_SITE_URL is https://www.greenelephant.org, the admin return address is:

`https://www.greenelephant.org/api/admin/auth/google/callback`

<details>
<summary>Show more: wrong address, wrong project, or missing configuration</summary>

The website appends `/api/admin/auth/google/callback` to PUBLIC_SITE_URL.
The `www` part, HTTPS and path must match exactly. A different deployed origin
needs its matching return address. Do not replace the separate customer-portal
callback. The source default is not proof of the deployed setting.

The hosting operator should privately check that GOOGLE_CLIENT_ID identifies this
client, GOOGLE_CLIENT_SECRET is present, and SESSION_SECRET plus the session database
are available. Report presence or a mismatch, never the secret values. A missing
local setting says nothing about production.

If Google shows `redirect_uri_mismatch`, give the operator that error name and the
site address. Do not copy the whole sign-in URL; it can contain temporary codes.
[Google's web sign-in setup help](https://developers.google.com/identity/protocols/oauth2/web-server).

</details>

### 2. Check that both types of account can use the app

**Who:** the Google project administrator.

1. In the same project, open **Audience**.
2. Check that the app can accept the external personal owner account as well as
   the two selected Workspace accounts. An organisation-only audience excludes
   the external owner.
3. Record the current publishing and verification status. Do not change it yet.

**Expected:** all three approved identities are eligible for Google sign-in.
Google eligibility alone does not give website admin access; the website still
requires an active approved account. [Google configuration help](https://developers.google.com/identity/protocols/oauth2/web-server).

### 3. Check whether Google can send proof of MFA

**Who:** the Google project administrator and website developer.

1. Check **Audience → Publishing status** and **Verification Center**.
2. Look in **Settings → Advanced Settings** for authentication-strength and
   session-age claims. A “claim” is a fact Google sends in a signed sign-in result.
3. Record whether those settings exist and are enabled. Do not assume availability.

**Expected:** the actual client can supply signed MFA evidence. Google documents
published/verified status and enabled features as prerequisites, under early access.
If a setting or claim is unavailable, stop the rollout and review the design.
Local verification is implemented; real provider evidence is still required. [Google Security Bundle help](https://developers.google.com/identity/siwg/security-bundle).

### 4. Check MFA for the managed accounts

**Who:** Estève as Workspace administrator.

1. Open [Google Admin](https://admin.google.com/).
2. Go to **Security → Authentication → 2-step verification**.
3. Check which accounts the selected group or organisational unit covers.
4. Check enrolment and allowed methods for the intended website administrators.

**Expected:** those users enrol and test recovery before enforcement. The “Any”
methods option allows the selected SMS fallback; key-only does not. Group policy
can override an organisational-unit setting. Keep unrelated staff outside this
change. [Workspace setup and lockout help](https://knowledge.workspace.google.com/admin/security/deploy-2-step-verification).

### 5. Check recovery before depending on it

**Who:** each account holder; Workspace administrator where managed policy applies.

1. Open [your Google security settings](https://myaccount.google.com/security).
2. Check passkey/2-step verification, backup codes and recovery options.
3. Confirm you can reach the recovery email without the primary Google account.
4. Plan a controlled test using the actual Finnish SIM and a second sign-in method.

**Expected:** a tested way back in if the main phone is lost. The external owner
needs this check separately. Recovery email helps recover an account; it does not
replace ordinary MFA. [Recovery options help](https://support.google.com/accounts/answer/183723?hl=en).

<details>
<summary>Show more: my SMS did not arrive, or my phone is lost</summary>

On Google's sign-in screen, choose **Try another way** when offered. Use a method
you already enrolled, such as a passkey on another accessible device or a backup
code. Enter codes only on Google's own sign-in page. SMS delivery and availability
depend on the carrier and Google's risk checks; Finland alone is not a guarantee.
[Google's SMS and lost-phone help](https://support.google.com/accounts/answer/185834?hl=en).

If no enrolled method works, use [Google account recovery](https://accounts.google.com/signin/recovery).
For managed accounts, ask the Workspace administrator for recovery help. If the
website owner is locked out, use the controlled operator procedure above after
identity verification. Do not share another administrator's login or reactivate
a shared website password.

</details>

## Implemented login and access help pattern

Requirement: [AI-LIT-REQ-105](../PRD.md#ai-lit-admin-learning-20261008).
Concept toolboxes, detailed login/access/recovery cards and signed MFA verification
are implemented locally. Wider per-feature admin troubleshooting and live
acceptance remain separate follow-up work.

Each card should use this pattern:

- **What happened:** one short sentence without unexplained technical terms.
- **Do this first:** one main button or short numbered action.
- **Check the result:** what the user should see when the action works.
- **Still stuck?** a labelled expansion with the next steps, official link and
  the person who can help. Distinguish user actions from operator repairs.

Essential instructions must work without hovering. Tooltips add short definitions;
expansions hold detail and remain usable by keyboard, touch and screen readers.
Public login help must not show account lists, recovery contacts or secret settings.
Support references must omit raw provider errors, URLs with codes and tokens.
Keep retry paths bounded; never claim that choosing a Google account again proves
fresh MFA. Restricted RoPA access should explain the separate permission and return
the user to ordinary admin tools, without implying their whole account is broken.


## Evidence checklist before requesting rollout approval

Record pass/fail/not-checked privately, without token bodies or recovery details:

1. Reuse Estève’s 8 October configuration-readiness confirmation. Keep actual
   signed-claim observations in the live test evidence below; recheck configuration
   only if it changes or the test identifies a specific mismatch.
2. On a controlled deployment of the reviewed candidate, test the external owner,
   privacy delegate and ordinary admin. Confirm their expected owner/privacy/training
   permissions. Confirm missing or invalid evidence blocks login without a bypass.
3. Confirm old sessions stop working, deactivation revokes access and callback
   replay is denied. Test cookie/storage/provider failures and the help instructions.
4. Each person tests an enrolled alternative without the primary phone; test actual
   Finnish SIM delivery separately. Do not delete a working method to simulate loss.
5. Rehearse approved operator recovery with retained identities/history, audit and
   session revocation. Verify fresh sign-in and the same permissions afterward.
6. Complete human keyboard/touch/screen-reader help review and the existing combined
   migration/privacy/release gates. Obtain explicit rollout approval only then.

Local evidence: 161 release tests, TypeScript, build and isolated browser checks;
synthetic fixtures only. No live Google/Workspace/Replit setting was changed.
