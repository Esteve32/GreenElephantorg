---
name: Exact-source release handoffs
description: Avoid confusing automatic agent-asset checkpoints with reviewed GitHub release source.
---

Registering a finished report with `presentAsset` can write tracked agent-asset
metadata and trigger an automatic Replit checkpoint. That checkpoint is not a
reviewed GitHub release merely because the application code is unchanged.

**Why:** Asset delivery interrupted an exact-SHA release handoff by creating a
metadata-only checkpoint referencing an ignored local report.

**How to apply:** Preserve the checkpoint and original branch rather than resetting
them. Build review PRs from reviewed GitHub source; exclude generated metadata
pointing at private or ignored reports. Avoid new asset registrations during an
exact-source handoff, or recheck source identity afterward and report the difference.
