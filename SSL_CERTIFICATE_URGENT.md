# 🚨 SSL Certificate Expired - Action Required

## Current Status

**⚠️ CRITICAL: SSL Certificate has EXPIRED**

Users are seeing this error when trying to access greenelephant.org:
```
ERR_CERT_DATE_INVALID
Your connection is not private
This server could not prove that it is greenelephant.org; 
its security certificate expired in the last day.
```

**Date Detected:** February 16, 2026

---

## 🚀 Quick Fix (15 minutes)

**Follow these steps immediately:**

1. **📖 Read the Quick Fix Guide**
   - Open: [`SSL_QUICK_FIX.md`](./SSL_QUICK_FIX.md)
   - Follow the step-by-step instructions
   - Estimated time: 15-45 minutes

2. **🔍 Detailed Troubleshooting (if needed)**
   - Open: [`SSL_CERTIFICATE_RENEWAL_GUIDE.md`](./SSL_CERTIFICATE_RENEWAL_GUIDE.md)
   - Comprehensive troubleshooting and explanations
   - Includes common issues and solutions

---

## 📋 What You Need Access To

Before starting, make sure you have login credentials for:

- ✅ **Replit Account** (where the website is deployed)
- ✅ **Namecheap Account** (where DNS is managed)
- ✅ **Email** (esteve@greenelephant.org and/or anu@greenelephant.org)

---

## 🎯 Summary of Required Actions

### In Replit (Main Fix)
1. Go to Deployments → Settings → Domains
2. Remove and re-add greenelephant.org
3. This triggers automatic SSL certificate renewal
4. Wait 30 minutes for new certificate

### In Namecheap (Verification)
1. Verify DNS records are correct (A records + TXT records)
2. Update URL redirect from `http://` to `https://`

### Wait & Verify
1. Wait 30-60 minutes for SSL provisioning
2. Test https://greenelephant.org
3. Look for 🔒 lock icon in browser

---

## 🛡️ Prevent Future Issues

After fixing the certificate, set up monitoring:

1. **📅 GitHub Actions (Automated)**
   - Already configured in this repository
   - Runs daily to check certificate expiration
   - Creates GitHub Issues automatically when expiring
   - See: `.github/workflows/ssl-certificate-check.yml`

2. **🔔 UptimeRobot (Email Alerts)**
   - Setup guide: [`SSL_MONITORING_SETUP.md`](./SSL_MONITORING_SETUP.md)
   - Free monitoring with email/SMS alerts
   - 5-minute checks

3. **⏰ Calendar Reminders**
   - Set reminder every 60 days to manually check
   - Certificates expire every 90 days
   - Run: `./scripts/check-ssl.sh` to check status

---

## 📞 Need Help?

**Replit Support:**
- Portal: https://replit.com/support
- Discord: https://replit.com/discord
- Common issue: "SSL certificate expired for custom domain"

**Namecheap Support:**
- Live Chat: Available 24/7 in dashboard
- Support: https://www.namecheap.com/support/

**Check Certificate Status:**
- SSL Checker: https://www.sslshopper.com/ssl-checker.html?hostname=greenelephant.org
- DNS Checker: https://dnschecker.org

---

## 🔧 Manual Certificate Check

To quickly check certificate status from command line:

```bash
# Make sure you're in the repository root
cd /home/runner/work/GreenElephantorg/GreenElephantorg

# Run the SSL check script
./scripts/check-ssl.sh
```

**Expected output when expired:**
```
🔒 Checking SSL Certificates for Green Elephant...

Checking: greenelephant.org
  Valid from: Nov 16 12:00:00 2025 GMT
  Valid until: Feb 15 12:00:00 2026 GMT
  Issued by: Let's Encrypt
  ❌ EXPIRED! (-1 days ago)
  → Action required: Follow SSL_QUICK_FIX.md
```

---

## 📚 All Documentation Files

This repository contains complete SSL management documentation:

1. **[SSL_QUICK_FIX.md](./SSL_QUICK_FIX.md)** - 15-minute quick fix guide
2. **[SSL_CERTIFICATE_RENEWAL_GUIDE.md](./SSL_CERTIFICATE_RENEWAL_GUIDE.md)** - Detailed troubleshooting
3. **[SSL_MONITORING_SETUP.md](./SSL_MONITORING_SETUP.md)** - Set up automated monitoring
4. **[HTTPS_AND_FAVICON_FIX.md](./HTTPS_AND_FAVICON_FIX.md)** - Original HTTPS setup (updated with urgent notice)
5. **[.github/workflows/ssl-certificate-check.yml](./.github/workflows/ssl-certificate-check.yml)** - GitHub Actions monitoring
6. **[scripts/check-ssl.sh](./scripts/check-ssl.sh)** - Manual certificate checker script

---

## ✅ Completion Checklist

After completing the fix, verify:

- [ ] https://greenelephant.org shows lock icon 🔒
- [ ] https://www.greenelephant.org shows lock icon 🔒
- [ ] https://interviews.greenelephant.org shows lock icon 🔒
- [ ] No browser security warnings
- [ ] Certificate valid until ~90 days from now
- [ ] URL redirect uses HTTPS instead of HTTP
- [ ] UptimeRobot monitoring configured
- [ ] Calendar reminder set for next check (60 days)
- [ ] GitHub Actions workflow running daily
- [ ] Team notified of resolution

---

## 🎉 After Resolution

Once the certificate is renewed and working:

1. ✅ Close any related GitHub Issues
2. 📧 Email team (esteve@greenelephant.org, anu@greenelephant.org)
3. 📅 Add calendar reminder for 60 days from now
4. 🔔 Verify monitoring is active
5. 📝 Document completion date in this README

**Resolution Date:** _________________  
**Certificate Expires:** _________________  
**Next Check Date:** _________________

---

**Priority:** 🔥 URGENT  
**Impact:** Users cannot access website  
**Estimated Fix Time:** 15-45 minutes  
**Last Updated:** February 16, 2026
