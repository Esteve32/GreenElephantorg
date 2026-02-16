# 🔒 SSL Certificate Fix - Complete Guide

## 🚨 Current Situation

**Your website greenelephant.org is showing this error:**

```
ERR_CERT_DATE_INVALID
Your connection is not private
This server could not prove that it is greenelephant.org; 
its security certificate expired in the last day.
```

**What this means:** The SSL certificate that makes your website secure (HTTPS) has expired. Users cannot safely access your website until this is fixed.

---

## 🎯 What I've Done For You

I cannot directly fix the SSL certificate (only you can do that with your Replit and Namecheap logins), but I've created everything you need to:

1. **Fix it quickly** (15-45 minutes)
2. **Prevent it from happening again** (automated monitoring)

### 📚 Documentation Created

| File | Purpose | Read This If... |
|------|---------|-----------------|
| **[SSL_CERTIFICATE_URGENT.md](./SSL_CERTIFICATE_URGENT.md)** | Quick overview | You want to see what needs to be done |
| **[SSL_QUICK_FIX.md](./SSL_QUICK_FIX.md)** | 15-min checklist | You want step-by-step instructions |
| **[SSL_CERTIFICATE_RENEWAL_GUIDE.md](./SSL_CERTIFICATE_RENEWAL_GUIDE.md)** | Complete guide | You encounter problems or want details |
| **[SSL_MONITORING_SETUP.md](./SSL_MONITORING_SETUP.md)** | Prevention guide | You want to prevent this in the future |

### 🤖 Automation Created

| File | Purpose | What It Does |
|------|---------|--------------|
| **[.github/workflows/ssl-certificate-check.yml](./.github/workflows/ssl-certificate-check.yml)** | GitHub Actions | Checks certificates daily, creates Issues when expiring |
| **[scripts/check-ssl.sh](./scripts/check-ssl.sh)** | Manual checker | Run anytime to check certificate status |

---

## 🚀 Quick Start - DO THIS NOW

### Step 1: Read the Quick Fix (5 minutes)

Open **[SSL_QUICK_FIX.md](./SSL_QUICK_FIX.md)** and read through it once.

It contains a simple checklist with 6 steps:
1. Verify DNS in Namecheap ✓
2. Verify domain in Replit ✓
3. Remove and re-add domain (triggers renewal) ✓
4. Wait 5-30 minutes ✓
5. Update redirect to HTTPS ✓
6. Test everything ✓

**Total time:** 15-45 minutes (most of it is waiting)

### Step 2: Follow the Steps

Work through the checklist in [SSL_QUICK_FIX.md](./SSL_QUICK_FIX.md).

### Step 3: Verify It Worked

1. Visit https://greenelephant.org
2. Look for 🔒 lock icon in address bar
3. No security warning = SUCCESS! 🎉

---

## 🛡️ Prevent This From Happening Again

### Option 1: GitHub Actions (Automated)

**Already set up!** This repository now includes a workflow that:
- ✅ Checks your SSL certificates **every day at 9 AM UTC**
- ✅ Creates a GitHub Issue if certificate is expiring in < 14 days
- ✅ Creates an Issue immediately if certificate is expired
- ✅ Auto-closes the Issue when certificate is renewed

**You'll get notifications via:**
- GitHub email notifications (if enabled)
- GitHub web interface (Issues tab)

**To enable email notifications:**
1. Go to GitHub Settings → Notifications
2. Enable "Email" for "Issues"
3. Make sure "Include your own updates" is checked

### Option 2: UptimeRobot (Recommended Backup)

See [SSL_MONITORING_SETUP.md](./SSL_MONITORING_SETUP.md) for detailed setup.

**Why do this:**
- Free email/SMS alerts
- Monitors site availability (not just SSL)
- 5-minute checks (GitHub Actions only checks daily)
- Takes 10 minutes to set up

---

## 🧪 Test Everything Now

### Test the SSL Check Script

Run this command to check your certificate status right now:

```bash
cd /home/runner/work/GreenElephantorg/GreenElephantorg
./scripts/check-ssl.sh
```

**Expected output while expired:**
```
🔒 Checking SSL Certificates for Green Elephant...

Checking: greenelephant.org
  ❌ EXPIRED! (-1 days ago)
  → Action required: Follow SSL_QUICK_FIX.md
```

**Expected output after fix:**
```
🔒 Checking SSL Certificates for Green Elephant...

Checking: greenelephant.org
  Valid from: Feb 16 12:00:00 2026 GMT
  Valid until: May 17 12:00:00 2026 GMT
  Issued by: Let's Encrypt
  ✅ Valid (90 days remaining)
```

### Test GitHub Actions Workflow

The workflow is set to run automatically every day, but you can trigger it manually:

1. Go to GitHub → Actions tab
2. Select "SSL Certificate Monitoring" workflow
3. Click "Run workflow" button
4. Wait 1-2 minutes
5. Check the results

**While certificate is expired:**
- Workflow will FAIL ❌
- GitHub Issue will be created automatically
- Issue contains links to fix guides

**After certificate is fixed:**
- Workflow will PASS ✅
- GitHub Issue will be auto-closed
- Summary shows all certificates valid

---

## 🆘 What If I Get Stuck?

### Problem: Can't log in to Replit
**Solution:** Use "Forgot Password" or contact Replit support at https://replit.com/support

### Problem: Can't log in to Namecheap
**Solution:** Use "Forgot Password" or use Namecheap live chat (24/7)

### Problem: Domain verification fails in Replit
**Solution:** See [SSL_CERTIFICATE_RENEWAL_GUIDE.md](./SSL_CERTIFICATE_RENEWAL_GUIDE.md) section "Domain verification fails"

### Problem: Certificate still shows expired after 2 hours
**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Try incognito mode
3. Try different browser
4. Check https://www.sslshopper.com/ssl-checker.html?hostname=greenelephant.org

### Problem: I don't understand the technical terms
**Solution:** 
- Read [SSL_CERTIFICATE_RENEWAL_GUIDE.md](./SSL_CERTIFICATE_RENEWAL_GUIDE.md) - it has detailed explanations
- Or just follow the checklist in [SSL_QUICK_FIX.md](./SSL_QUICK_FIX.md) step by step

---

## 📞 Support Resources

**Replit Support:**
- Support portal: https://replit.com/support
- Discord: https://replit.com/discord
- Tell them: "SSL certificate expired for custom domain greenelephant.org"

**Namecheap Support:**
- Live chat: Available 24/7 in your Namecheap dashboard
- Support: https://www.namecheap.com/support/
- Tell them: "Need help with DNS records for Replit deployment"

**Tools to Check Status:**
- SSL Checker: https://www.sslshopper.com/ssl-checker.html?hostname=greenelephant.org
- DNS Checker: https://dnschecker.org
- Certificate Transparency: https://crt.sh/?q=greenelephant.org

---

## ✅ After You Fix It

Once the certificate is renewed and everything works:

1. **Test all URLs:**
   - [ ] https://greenelephant.org
   - [ ] https://www.greenelephant.org
   - [ ] https://interviews.greenelephant.org
   - [ ] All show 🔒 lock icon

2. **Set up monitoring:**
   - [ ] GitHub Actions is working (enabled by default)
   - [ ] Optional: Set up UptimeRobot (10 min)
   - [ ] Optional: Add calendar reminder every 60 days

3. **Document completion:**
   - [ ] Close any GitHub Issues related to SSL
   - [ ] Note the certificate expiration date (should be ~90 days from now)
   - [ ] Add calendar reminder for 60 days from now to check again

4. **Notify your team:**
   - [ ] Email esteve@greenelephant.org
   - [ ] Email anu@greenelephant.org
   - [ ] Confirm website is accessible

---

## 📊 Timeline

**How long will each part take?**

| Task | Time | Can Skip? |
|------|------|-----------|
| Read this guide | 5 min | No - read first |
| Verify DNS in Namecheap | 5 min | No - required |
| Re-link domain in Replit | 3 min | No - this triggers renewal |
| Wait for SSL certificate | 5-30 min | No - automatic wait |
| Update redirect to HTTPS | 2 min | Yes - but recommended |
| Test everything | 3 min | No - verify it worked |
| Set up monitoring | 10 min | Yes - but highly recommended |
| **TOTAL** | **15-45 min** | |

**95% of the time is automated waiting.** You'll spend maybe 15 minutes of actual work.

---

## 🎉 Summary

**What happened:**
- SSL certificate expired on Feb 15, 2026
- Users can't access website safely

**What you need to do:**
1. Follow [SSL_QUICK_FIX.md](./SSL_QUICK_FIX.md) (15 min)
2. Wait for certificate renewal (30 min)
3. Test it works (3 min)

**What will prevent this in the future:**
- GitHub Actions monitors certificates daily (already set up!)
- Optional: UptimeRobot for redundancy (10 min setup)
- Optional: Calendar reminders (1 min setup)

**Bottom line:**
- **Fix:** 15 minutes of your time
- **Wait:** 30 minutes for automation
- **Prevent:** Already done! (GitHub Actions configured)

---

**Questions?** See the detailed guides:
- [SSL_QUICK_FIX.md](./SSL_QUICK_FIX.md) - Step-by-step fix
- [SSL_CERTIFICATE_RENEWAL_GUIDE.md](./SSL_CERTIFICATE_RENEWAL_GUIDE.md) - Complete troubleshooting
- [SSL_MONITORING_SETUP.md](./SSL_MONITORING_SETUP.md) - Prevention and monitoring

**Last Updated:** February 16, 2026  
**Priority:** 🔥 URGENT  
**Status:** Awaiting manual fix in Replit
