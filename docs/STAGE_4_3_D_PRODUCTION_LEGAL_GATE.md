# Stage 4.3-D Production Legal and Privacy Gate

Status: **NOT SATISFIED — PRODUCTION SURVIVOR CUSTODY BLOCKED**

Product decision: Option C survivor custody, approved by Estève on 2026-09-11

Implementation issue: [#12](https://github.com/Esteve32/GreenElephantorg/issues/12)

Canonical requirements: DEC-041, PRD DAT-004, DAT-007, AC-006, and AC-031

This record prevents the approved product direction from being mistaken for a
legal conclusion or production authorization. Branch code and disposable-fixture
testing may proceed. Production migration, deployment, and activation remain
blocked until an accountable qualified reviewer completes every applicable field
below and Estève records the result in the canonical decision ledger.

## Processing decision record

| Required field | Recorded outcome | Accountable approver | Evidence |
| :--- | :--- | :--- | :--- |
| Precise continued-processing purpose | Pending | Pending | Pending |
| Article 6 lawful basis | Pending | Qualified privacy counsel or accountable DPO | Pending |
| Article 9 condition or technical prevention of special-category processing | Pending | Qualified privacy counsel or accountable DPO | Pending |
| Necessity assessment | Pending | Pending | Pending |
| Data-subject rights and reasonable-expectations balancing | Pending | Pending | Pending |
| Retention criterion and periodic review | Survivor deletes the agreement or survivor account is deleted, whichever occurs first; legal validation pending | Pending | DEC-041 / PRD AC-031 |
| Privacy-notice update | Pending | Pending | Pending |
| Erasure, restriction, and objection runbook | Pending | Pending | Pending |
| Live-store and backup erasure procedure | Pending | Pending | Pending |
| Security/access-control review | Pending | Pending | Pending |
| Production migration and rollback approval | Not authorized | Estève | Pending final evidence |

## Lawful-basis assessment requirements

Do not default to consent, contract, or legitimate interests. Record the basis
that actually applies to continued storage for the surviving participant. If
Article 6(1)(f) is proposed, document all three cumulative conditions before
processing: a lawful, present, and precisely articulated interest; necessity;
and a balance showing that the deleted participant's interests, rights, and
freedoms do not prevail. Record the safeguards and the Article 21 objection path.

Joint-agreement free text may contain information about health, sex life, sexual
orientation, religion, politics, or other special categories. The reviewer must
identify a valid Article 9 condition for any such processing or approve controls
that prevent the service from accepting and retaining that content. A UI warning
alone does not prove prevention.

## Transparency and rights checklist

- [ ] Privacy notice states the survivor-custody purpose, lawful basis,
  recipients, retention criterion, rights, and contact route.
- [x] Agreement-creation disclosure is specified verbatim in PRD v1.7.5.
- [x] Account-deletion disclosure is specified verbatim in PRD v1.7.5.
- [ ] Erasure, restriction, or objection requests concerning retained free text
  enter a documented human review and are never automatically refused.
- [ ] The requester receives the recorded outcome and applicable appeal or
  supervisory-authority information.
- [ ] A restore from backup reapplies completed erasure requests before the data
  can be served.

## Technical evidence required for activation

- [ ] Disposable PostgreSQL fixtures prove both deletion orders, survivor read
  and export, frozen no-edit/no-relink behavior, survivor deletion, last-account
  erasure, collision handling, and no orphan in classified data.
- [ ] Authorization tests prove deleted users, unrelated users, administrators,
  and break-glass roles cannot retrieve retained agreement text.
- [ ] Export tests prove no cross-subject identifiers, consent receipt IDs,
  invitation secrets, private profiles, billing secrets, or local-vault data leak.
- [ ] Access logs contain actor, action, connection reference, result, and time,
  without agreement text or other private payloads.
- [ ] Backup retention, key access, restore quarantine, and erasure replay are
  documented and exercised.
- [ ] Migration preflight counts and collision reports are reviewed without
  silently assigning authorship.

## Activation rule

No automated process may mark this gate satisfied. After the qualified review is
complete, Estève must explicitly approve the recorded outcome, update this status,
and run `npm run decision:record` in the same commit. A separate production
migration/deployment approval is still required.

## Primary references

- [GDPR — Regulation (EU) 2016/679](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [EDPB Guidelines 1/2024 on Article 6(1)(f)](https://www.edpb.europa.eu/system/files/2024-10/edpb_guidelines_202401_legitimateinterest_en.pdf)
- [EDPB 2025 coordinated-enforcement report on the right to erasure](https://www.edpb.europa.eu/system/files/2026-02/edpb_cef-report_2025_right-to-erasure_en.pdf)
