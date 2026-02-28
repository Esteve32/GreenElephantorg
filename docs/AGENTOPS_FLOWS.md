# GreenElephant — AgentOps Pipeline Documentation

> Living document. Each pipeline is a named, versioned automated workflow.
> Purpose: make our automation stack legible for AI orchestration tools, future AgentOps platforms, and developer onboarding.

---

## How to read this document

Each pipeline is described with:
- **Trigger** — what starts the flow
- **Steps** — ordered sequence of automated actions
- **Services used** — external APIs involved
- **Error handling** — what happens when a step fails
- **Status** — current operational state

---

## Pipeline 1: Contact Form → CRM + Notifications

**ID**: `contact-form-v1`
**Trigger**: User submits the contact form at `/connect`

**Steps**:
1. Validate form fields (name, email, message, consent checkbox)
2. Upsert contact in Notion CRM (search by email → update or create)
3. Add "Contact Form" to Channels Reached in Notion
4. Send auto-reply email to submitter via Resend (branded dark HUD template)
   - Subject: "We received your message — GreenElephant"
   - Content: confirms receipt, sets 24h response expectation, GDPR footer
5. Send admin notification to `esteve@greenelephant.org` with name, email, message

**Services**: Resend, Notion API
**Error handling**: If Notion fails, email still sends. If email fails, error is logged but contact is saved.
**Status**: Live ✅

---

## Pipeline 2: Newsletter Signup → CRM + Welcome Email

**ID**: `newsletter-v1`
**Trigger**: User submits newsletter opt-in form (homepage, footer, or dedicated page)

**Steps**:
1. Validate email + consent (explicit opt-in required — GDPR)
2. Upsert contact in Notion CRM
3. Add "Newsletter" to Channels Reached in Notion
4. Send welcome email via Resend (branded dark HUD template)
   - Subject: "Welcome to Conscious Communication — GreenElephant"
   - Content: what to expect, links to free tools, GDPR footer with unsubscribe instruction

**Services**: Resend, Notion API
**Error handling**: Duplicate detection via email normalisation (lowercase + trim). Race-condition lock prevents duplicate Notion pages for concurrent signups.
**Status**: Live ✅

---

## Pipeline 3: Retreat Waitlist Signup → CRM + Notifications

**ID**: `retreat-waitlist-v1`
**Trigger**: User submits retreat waitlist form at `/retreats`

**Steps**:
1. Validate form (name, email, consent)
2. Upsert contact in Notion CRM
3. Add "Retreat Waitlist" to Channels Reached in Notion
4. Send confirmation email to applicant (branded dark HUD template)
   - Content: confirms they're on the list, describes what happens next
5. Send admin notification to `esteve@greenelephant.org` with applicant details

**Services**: Resend, Notion API
**Status**: Live ✅

---

## Pipeline 4: Check-my-FLOW Submission → Results + CRM

**ID**: `flow-check-v1`
**Trigger**: User completes the flow assessment at `/flow-check` and optionally provides email

**Steps**:
1. Receive Motivation, Challenge, Competence scores (0–10)
2. Compute effective challenge: `effCh = clamp(challenge + (motivation − 5) × 0.8, 0, 10)`
3. Compute zone from effCh and competence (Flow / Challenge / Comfort / Danger)
4. Save result to `flow_check_results` table in PostgreSQL
5. **If email provided with consent**:
   a. Upsert contact in Notion CRM
   b. Add "Flow Check" to Channels Reached in Notion
   c. Send personalised results email (dark HUD template)
      - Includes: zone badge, personalised interpretation paragraph, scores, recommendations, Satellite Scan CTA
   d. Send admin notification to `esteve@greenelephant.org`
6. Return zone + scores to frontend (shown instantly, before email is sent)

**Services**: PostgreSQL (Neon), Resend, Notion API
**Error handling**: Result is always saved regardless of email/Notion failures. Email failure is logged but does not block the response.
**Status**: Live ✅

---

## Pipeline 5: Signals Quiz → Results + CRM

**ID**: `signals-quiz-v1`
**Trigger**: User completes the 6-question Signals Quiz at `/signals`

**Steps**:
1. Receive answers, compute pattern score
2. Upsert contact in Notion CRM (if email provided)
3. Add "Quiz" to Channels Reached in Notion
4. Send quiz results email (if email provided)
   - Content: score, interpretation, comparison to Satellite Scan
5. Admin notification to `esteve@greenelephant.org`

**Services**: Resend, Notion API
**Status**: Live ✅

---

## Pipeline 6: Satellite Scan Purchase → Onboarding Sequence

**ID**: `scan-purchase-v1`
**Trigger**: Stripe webhook confirms payment for Satellite Scan product

**Steps**:
1. Receive Stripe `payment_intent.succeeded` or `checkout.session.completed` event
2. Upsert contact in Notion CRM
3. Add "Purchase" to Channels Reached in Notion
4. Send purchase confirmation email (branded)
5. Start Fibonacci onboarding email sequence:
   - Day 1: Welcome + next steps
   - Day 2: How to read your Satellite Scan
   - Day 3: Scheduling your coaching debrief
   - Day 5: Micro-habit starter guide
   - Day 8: Check-in
   - Day 13: Satellite Scan reminder (if Typeform not yet completed)
6. Set reminder scheduler to check for overdue scans every 24h

**Services**: Stripe, Resend, Notion API, PostgreSQL
**Status**: Live ✅

---

## Pipeline 7: Webinar Waitlist → CRM + Confirmation

**ID**: `webinar-waitlist-v1`
**Trigger**: User joins Play Labs webinar waitlist at `/webinar`

**Steps**:
1. Validate email + consent
2. Upsert contact in Notion CRM
3. Add "Webinar" to Channels Reached in Notion
4. Send confirmation email (branded dark HUD template)
   - Content: session details fetched from `webinar_settings` table, Zoom link placeholder
5. Admin notification to `esteve@greenelephant.org`

**Services**: Resend, Notion API, PostgreSQL
**Status**: Live ✅

---

## Pipeline 8: Newsletter Campaign Send → Open Tracking + CRM

**ID**: `newsletter-campaign-v1`
**Trigger**: Admin manually initiates a campaign send from the admin panel

**Steps**:
1. Admin selects recipient segment (all newsletter, or filtered)
2. Admin reviews/edits HTML content
3. On confirm: batch send via Resend to each recipient
4. Each email includes a 1×1 tracking pixel (open tracking)
5. On pixel load: update Notion CRM with open event in "Satellite Scan Reachout Campaign Comments" column
6. Admin can view open stats in admin panel

**Services**: Resend, Notion API
**Status**: Live ✅

---

## Planned Pipelines (Future)

### Pipeline 9: AI Agent Shopping Query → Service Recommendation
**ID**: `agent-service-query-v1` (planned)
**Trigger**: HTTP GET `/api/services` from an AI agent or LLM-powered assistant
**Vision**: A structured response allows AI agents to evaluate, compare, and recommend GreenElephant services to human users without visiting the website directly.
**Status**: Endpoint live ✅ — agent routing layer not yet built

### Pipeline 10: Satellite Scan Portal — Client Data Sync
**ID**: `portal-data-sync-v1` (planned)
**Trigger**: Coach uploads new Satellite Scan data for a client
**Vision**: Syncs data from Google Sheets source to the client portal database. Client sees live charts, coach sees aggregated trends.
**Status**: In design phase — see `.agents/skills/satellite-scan-portal/SKILL.md`

---

## Shared Infrastructure

| Component | Tool | Notes |
|---|---|---|
| Email delivery | Resend | Branded dark HUD template (`brandedEmailWrapper`) |
| CRM | Notion API | Upsert logic prevents duplicates |
| Payment | Stripe | Webhooks for purchase events |
| Database | PostgreSQL (Neon) | Drizzle ORM |
| Scheduler | Node.js setInterval | Runs within Express process — future: move to cron job or Temporal |
| Error logging | `console.error` | Future: move to structured logging (e.g., Pino + Sentry) |
