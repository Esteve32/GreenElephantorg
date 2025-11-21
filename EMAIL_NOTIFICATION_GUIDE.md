# Email Notification & Form Submission Guide

## Current State: Data Collection Without Email Notifications

Currently, GreenElephant.org collects form submissions and stores them in memory (MemStorage). **No automated emails are sent** when users submit forms.

## Form Submission Endpoints

### 1. **Waitlist Submissions** (`/api/waitlist`)
**Triggered by:** Retreat waitlist forms on `/retreats` page

**Data Collected:**
- Email
- Name
- Motivation
- Retreat type (provence/lapland)
- GDPR consent text & timestamp

**Current Behavior:**
- Creates/updates contact in `contacts` table
- Creates entry in `waitlist_entries` table
- Returns success message to user
- **NO email sent to sdev@greenelephant.org**

---

### 2. **Newsletter Subscriptions** (`/api/newsletter`)
**Triggered by:** Newsletter signup forms (if implemented)

**Data Collected:**
- Email
- Name
- GDPR consent text & timestamp

**Current Behavior:**
- Creates/updates contact in `contacts` table
- Creates entry in `newsletter_subscriptions` table
- **NO email sent to sdev@greenelephant.org**

---

### 3. **Signals Quiz Results** (`/api/signals-quiz`)
**Triggered by:** Signals quiz completion on `/signals` page

**Data Collected:**
- Quiz score (0-100)
- Answers (JSONB object with 6 questions)
- Optional: Email, name, consent (for follow-up)

**Current Behavior:**
- Creates/updates contact (if email provided)
- Stores quiz result in `signals_quiz_results` table
- **NO email sent to sdev@greenelephant.org**

---

### 4. **Path Recommendations** (`/api/recommendations`)
**Triggered by:** "Choose Your Path" diagnostic on `/choose-your-path` page

**Data Collected:**
- Name
- Email
- Primary goal, time availability, budget range
- Recommended path (retreat/coaching/consulting)

**Current Behavior:**
- Stores in `recommendation_submissions` table
- **NO email sent to sdev@greenelephant.org**

---

## Current Data Storage: In-Memory Only

⚠️ **CRITICAL:** All form submissions are currently stored in **MemStorage** (in-memory), which means:
- Data is lost when the server restarts
- No persistent database connection is active
- You cannot access historical submissions

### To Make Data Persistent (Recommended Next Steps):

1. **Enable PostgreSQL Database:**
   - Already configured in `shared/schema.ts`
   - Need to create Neon PostgreSQL database using Replit tools
   - Update `server/storage.ts` to use PostgreSQL instead of MemStorage

2. **Database Access:**
   - Once PostgreSQL is active, you can query submissions directly
   - Replit provides database GUI for viewing/exporting data

---

## How to Receive Email Notifications

To receive emails at `sdev@greenelephant.org` when forms are submitted, you need to:

### Option 1: Use Replit Integrations (Recommended)

**Search for email integrations:**
```
search_integrations("email notifications")
```

Potential options:
- SendGrid integration
- Mailgun integration
- Resend integration
- Custom SMTP setup

### Option 2: Manual Setup with SendGrid/Resend

1. **Install email package:**
   ```bash
   npm install @sendgrid/mail
   # or
   npm install resend
   ```

2. **Add API key to Replit Secrets:**
   - SENDGRID_API_KEY or RESEND_API_KEY

3. **Update backend routes to send emails:**
   ```typescript
   // Example for waitlist endpoint
   app.post("/api/waitlist", async (req, res) => {
     // ... existing code to save data ...
     
     // Send email notification
     await sendEmail({
       to: "sdev@greenelephant.org",
       subject: "New Retreat Waitlist Entry",
       text: `
         Name: ${name}
         Email: ${email}
         Retreat: ${retreatType}
         Motivation: ${motivation}
       `
     });
     
     res.status(201).json({ message: "..." });
   });
   ```

---

## Recommended Workflow (Without Email Notifications)

### Current Best Practice:

1. **Enable PostgreSQL database** to persist form submissions
2. **Regularly check database** for new submissions via Replit database GUI
3. **Export data** as CSV for follow-up

### Future Enhancement:

1. **Set up email notifications** using SendGrid/Resend
2. **Create admin dashboard** to view submissions in-app
3. **Implement webhook notifications** to Slack or other tools

---

## Testing Form Submissions

To test if forms are working:

1. **Fill out a form** (e.g., waitlist, quiz, recommendation)
2. **Check browser console** for success/error messages
3. **Inspect network tab** to see API response
4. **Query database** (once PostgreSQL is enabled) to verify data

---

## Summary

✅ **What's Working:**
- All forms collect data successfully
- GDPR consent is tracked properly
- Data validation is implemented
- Forms show success messages to users

❌ **What's NOT Working:**
- No email notifications to sdev@greenelephant.org
- Data is not persisted (MemStorage only)
- No way to access historical submissions

📋 **Next Steps:**
1. Enable PostgreSQL database (highest priority)
2. Set up email notifications (SendGrid/Resend)
3. Create admin view for submissions (optional)

---

## Contact Information

For questions about implementing email notifications or database setup:
- Email: sdev@greenelephant.org
- Technical documentation: See `server/routes.ts` and `server/storage.ts`
