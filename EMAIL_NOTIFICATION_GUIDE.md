# Form Submission Management Guide

## Current State: PostgreSQL Database + Manual Admin Dashboard

GreenElephant.org now stores all form submissions in a **persistent PostgreSQL database**. You can view all submissions through the **Admin Dashboard** at:

**🔗 Bookmark this URL: `https://your-domain.repl.co/admin/submissions`**

No automated email notifications are configured (by design, to keep costs at zero).

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
- Creates/updates contact in `contacts` table (PostgreSQL)
- Creates entry in `waitlist_entries` table (PostgreSQL)
- Returns success message to user
- **NO email sent** (check admin dashboard instead)

---

### 2. **Newsletter Subscriptions** (`/api/newsletter`)
**Triggered by:** Newsletter signup forms (if implemented)

**Data Collected:**
- Email
- Name
- GDPR consent text & timestamp

**Current Behavior:**
- Creates/updates contact in `contacts` table (PostgreSQL)
- Creates entry in `newsletter_subscriptions` table (PostgreSQL)
- **NO email sent** (check admin dashboard instead)

---

### 3. **Signals Quiz Results** (`/api/signals-quiz`)
**Triggered by:** Signals quiz completion on `/signals` page

**Data Collected:**
- Quiz score (0-100)
- Answers (JSONB object with 6 questions)
- Optional: Email, name, consent (for follow-up)

**Current Behavior:**
- Creates/updates contact if email provided (PostgreSQL)
- Stores quiz result in `signals_quiz_results` table (PostgreSQL)
- **NO email sent** (check admin dashboard instead)

---

### 4. **Path Recommendations** (`/api/recommendations`)
**Triggered by:** "Choose Your Path" diagnostic on `/choose-your-path` page

**Data Collected:**
- Name
- Email
- Primary goal, time availability, budget range
- Recommended path (retreat/coaching/consulting)

**Current Behavior:**
- Stores in `recommendation_submissions` table (PostgreSQL)
- **NO email sent** (check admin dashboard instead)

---

## Current Data Storage: PostgreSQL (Persistent) ✅

✅ **IMPLEMENTED:** All form submissions are now stored in **PostgreSQL database**, which means:
- Data persists across server restarts
- You can access historical submissions anytime
- GDPR-compliant with proper consent tracking

### How to Access Your Data:

1. **Admin Dashboard (Recommended):**
   - Visit: `https://your-domain.repl.co/admin/submissions`
   - Bookmark this URL for easy access
   - View all submissions organized by type (Waitlist, Newsletter, Quiz, Recommendations, Contacts)
   - Real-time data from PostgreSQL

2. **Replit Database GUI (Alternative):**
   - Use Replit's built-in database viewer
   - Export data as CSV for backup/analysis

---

## How to Add Email Notifications (Optional)

If you later want to receive emails at `esteve@greenelephant.org` when forms are submitted, you can:

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
       to: "esteve@greenelephant.org",
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

## Current Workflow ✅

### How It Works Now:

1. ✅ **PostgreSQL database enabled** - All submissions persist permanently
2. ✅ **Admin dashboard created** - View all submissions at `/admin/submissions`
3. ✅ **Manual checking** - Bookmark the admin URL and check as needed
4. ✅ **Export capability** - Use Replit database GUI to export CSV

### Future Enhancements (Optional):

1. **Add email notifications** using Resend/SendGrid (requires API key)
2. **Implement daily digest emails** to reduce notification volume
3. **Add webhook notifications** to Slack for real-time alerts

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
- GDPR consent is tracked properly with timestamps
- Data persists in PostgreSQL database
- Admin dashboard at `/admin/submissions` for manual checking
- Forms show success messages to users

📋 **How to Check Submissions:**
1. Bookmark: `https://your-domain.repl.co/admin/submissions`
2. Visit the page to see all submissions organized by type
3. Export from Replit database GUI if needed

💡 **Future Options (If Desired):**
- Add email notifications using your own email service API key
- Set up daily digest emails to minimize notifications
- Integrate with Slack for real-time alerts

---

## Contact Information

For technical questions:
- Email: esteve@greenelephant.org
- Admin Dashboard: `/admin/submissions`
- Technical documentation: See `server/routes.ts` and `server/storage.ts`
