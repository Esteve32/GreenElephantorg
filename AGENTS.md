# GreenElephantorg Agent Instructions

## Approved product decision governance

- Treat `docs/DECISION_LOG.md` as the canonical source for approved MyFive scope and implementation status.
- Never infer product approval. Only the user or another explicitly named human approver may approve a decision or scope delta.
- When work changes an approved decision or a stage-checklist status, update the relevant decision-log content and then run:

  `npm run decision:record -- --summary "Concise change summary" --approved-by "Approver name"`

- Use `--level minor` for an approved scope delta and `--level major` only for an explicitly approved new decision-log baseline. The default patch increment is appropriate for implementation-status and governance-record updates.
- Include the decision-log update, generated version/timestamp, ledger row, and implementation changes in the same commit.
- Never rewrite or delete an existing decision-ledger row. Record corrections as a new version.
