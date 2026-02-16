# 🔒 SSL Certificate Renewal Guide - URGENT

## ⚠️ Current Status: SSL Certificate EXPIRED

**Error:** `net::ERR_CERT_DATE_INVALID`  
**Impact:** Users cannot access greenelephant.org securely  
**Date Expired:** Approximately February 15, 2026  
**Action Required:** IMMEDIATE

---

## 🚨 Immediate Fix Steps

### Step 1: Verify DNS Records in Namecheap

**Go to Namecheap Dashboard:**
1. Log in to Namecheap.com
2. Navigate to "Domain List"
3. Click "Manage" next to greenelephant.org
4. Go to "Advanced DNS" tab

**Verify these records exist and are correct:**

```
Type: A Record
Host: @
Value: 34.111.179.208
TTL: Automatic (or 3600)

Type: A Record
Host: www
Value: 34.111.179.208
TTL: Automatic (or 3600)

Type: A Record
Host: interviews
Value: 34.111.179.208
TTL: Automatic (or 3600)

Type: TXT Record
Host: @
Value: replit-verify=8c4dd19f-df5b-42bf-ae51-5b08619e34c5
TTL: Automatic (or 3600)

Type: TXT Record
Host: interviews
Value: replit-verify=[YOUR-INTERVIEWS-CODE]
TTL: Automatic (or 3600)
```

⚠️ **IMPORTANT:** If any of these records are missing or incorrect, the SSL certificate cannot be renewed.

---

### Step 2: Verify Domain in Replit

**Go to Replit Deployment:**
1. Open your Replit project: https://replit.com/@yourworkspace/GreenElephantorg
2. Click "Deployments" tab (left sidebar)
3. Click on your active deployment
4. Click "Settings" → "Domains"

**Check domain status:**
- ✅ **Verified** = Good, proceed to Step 3
- ⏳ **Pending** = Wait 30-60 minutes, then check again
- ❌ **Failed** = Domain verification failed, check DNS records

**If domains show "Failed" or "Not Found":**
1. Click "Link a domain" or "Add custom domain"
2. Enter: `greenelephant.org`
3. Replit will show you DNS records to add
4. Copy the **exact** values shown by Replit
5. Add them to Namecheap (Step 1)
6. Wait 30-60 minutes for DNS propagation
7. Click "Verify" in Replit

---

### Step 3: Force SSL Certificate Renewal

**Once domain is verified:**

**Option A: Re-link Domain (Recommended)**
1. In Replit Deployments → Settings → Domains
2. Find "greenelephant.org" in the list
3. Click the three dots (...) menu
4. Select "Remove domain"
5. Confirm removal
6. Wait 5 minutes
7. Click "Link a domain" again
8. Enter: `greenelephant.org`
9. Replit will automatically provision a new SSL certificate (5-30 minutes)

**Option B: Redeploy Application**
1. In Replit, go to your project
2. Click "Deploy" button (top right, rocket icon 🚀)
3. Select "Autoscale" or your current deployment type
4. Click "Deploy" to create a fresh deployment
5. This will trigger a new SSL certificate request

---

### Step 4: Wait for SSL Certificate Provisioning

**Timeline:**
- ⏳ **5 minutes:** Initial request sent to Let's Encrypt
- ⏳ **10-15 minutes:** Domain verification and certificate generation
- ⏳ **20-30 minutes:** Certificate installed and active
- ✅ **30+ minutes:** HTTPS should work!

**Monitor progress:**
1. Visit: https://greenelephant.org (refresh every 5 minutes)
2. Look for the lock icon 🔒 in browser address bar
3. Click the lock icon → "Certificate" to verify expiration date

---

### Step 5: Update URL Redirect to HTTPS

**After SSL certificate is active:**

**In Namecheap DNS (Advanced DNS tab):**

Find this record:
```
Type: URL Redirect Record
Host: @
Value: http://www.greenelephant.org  ← Change this!
```

Change to:
```
Type: URL Redirect Record
Host: @
Value: https://www.greenelephant.org  ← Use HTTPS!
```

**How to edit:**
1. Click the edit icon (pencil) on the URL Redirect Record
2. Change `http://` to `https://`
3. Make sure "Unmasked" redirect type is selected
4. Save changes

---

## 🔍 Troubleshooting

### "Certificate still shows as expired"

**Clear browser cache:**
- Chrome/Edge: `Ctrl + Shift + Del` → Clear cached images and files
- Firefox: `Ctrl + Shift + Del` → Clear cache
- Safari: Safari → Preferences → Privacy → Manage Website Data → Remove All

**Try different browser:**
- Open in incognito/private mode
- Try a completely different browser

**Check certificate details:**
1. Visit: https://www.sslshopper.com/ssl-checker.html
2. Enter: greenelephant.org
3. Check "Valid From" and "Valid To" dates
4. Should show valid until ~90 days from renewal date

### "Domain verification fails"

**Check DNS propagation:**
1. Visit: https://dnschecker.org
2. Enter: `greenelephant.org`
3. Select "A" record type
4. Should show: `34.111.179.208` in most/all locations
5. If not propagated globally, wait 6-24 hours

**Check TXT record propagation:**
1. Visit: https://dnschecker.org
2. Enter: `greenelephant.org`
3. Select "TXT" record type
4. Should show: `replit-verify=8c4dd19f-df5b-42bf-ae51-5b08619e34c5`
5. If not visible, double-check Namecheap DNS settings

**Common DNS issues:**
- TTL too high (should be 3600 or lower for faster updates)
- Cloudflare proxy enabled (must be "DNS only" - gray cloud ☁️)
- Wrong IP address (must be exact Replit IP)
- Missing @ symbol in host field

### "Replit shows wrong IP address"

**Replit IP addresses can change. To get current IP:**

1. In Replit project, click "Deployments"
2. Click "Settings" → "Domains"
3. Look for "IP Address" or when adding domain, Replit shows current IP
4. Update Namecheap A records to match this exact IP

**Or use command line:**
```bash
# Check current IP for Replit deployment
nslookup whenconversationsfracturetrust.replit.app

# Should return an IP like: 34.111.179.208 or similar
# Use this IP in your Namecheap A records
```

---

## 🛡️ Prevention: Avoid Future Expirations

### Set Up Certificate Expiration Monitoring

**Option 1: Use UptimeRobot (Free)**
1. Sign up at: https://uptimerobot.com
2. Add monitor for: https://greenelephant.org
3. Select "Keyword" monitor type
4. Set alert emails: esteve@greenelephant.org, anu@greenelephant.org
5. Will alert you if site becomes inaccessible

**Option 2: Use SSL Certificate Checker (Free)**
1. Sign up at: https://www.sslshopper.com/ssl-monitoring.html
2. Add: greenelephant.org
3. Set alert threshold: 14 days before expiration
4. Get email reminders to renew certificate

**Option 3: Use Replit Notifications**
1. In Replit project settings
2. Enable deployment notifications
3. Enable email alerts for deployment issues
4. Check "SSL certificate expiration warnings"

### Calendar Reminders

**Add recurring calendar events:**
- **Every 60 days:** Check SSL certificate expiration date
- **Every 90 days:** Review and update DNS records if needed
- **Set reminder:** 2 weeks before certificate expires (Let's Encrypt certs last 90 days)

**To check expiration date manually:**
1. Visit: https://greenelephant.org
2. Click lock icon 🔒 in address bar
3. Click "Certificate" → View full certificate
4. Check "Valid to" date
5. Should be ~90 days from last renewal

---

## 📋 Verification Checklist

After completing the renewal steps, verify everything works:

- [ ] Visit https://greenelephant.org (not http://)
- [ ] Lock icon 🔒 appears in browser address bar
- [ ] No security warnings or errors
- [ ] Certificate shows "Valid" with future expiration date (90 days out)
- [ ] Click lock icon → "Connection is secure"
- [ ] Certificate issued by "Let's Encrypt" or "R3"
- [ ] Certificate valid for: greenelephant.org, www.greenelephant.org
- [ ] Visit https://www.greenelephant.org (with www)
- [ ] Visit https://interviews.greenelephant.org
- [ ] All subdomains show valid certificate
- [ ] No browser warnings on any device (desktop, mobile)

**Test on multiple devices:**
- [ ] Desktop browser (Chrome, Firefox, Safari, Edge)
- [ ] Mobile browser (iOS Safari, Android Chrome)
- [ ] Incognito/private mode
- [ ] Different network (mobile data, different WiFi)

---

## 🆘 Emergency Fallback Options

### If SSL Certificate Cannot Be Renewed Immediately

**Temporary Fix: Use Replit Subdomain**

While fixing the SSL certificate, you can temporarily direct users to the Replit subdomain which has a valid certificate:

**Update social media links, email signatures, etc. to:**
```
https://whenconversationsfracturetrust.replit.app
```

This domain has an automatically-managed Replit SSL certificate that won't expire.

**Cloudflare Universal SSL (Alternative)**

If Replit SSL continues to fail, consider using Cloudflare:

1. Sign up at: https://www.cloudflare.com (free plan)
2. Add site: greenelephant.org
3. Update nameservers at Namecheap to Cloudflare's nameservers
4. Cloudflare will automatically provision SSL certificate
5. Set SSL mode to "Flexible" or "Full"
6. Certificate managed by Cloudflare (auto-renews)

---

## 📞 Getting Help

### Replit Support
- **Support Portal:** https://replit.com/support
- **Discord:** https://replit.com/discord
- **Email:** support@replit.com
- **Common issue:** "SSL certificate expired for custom domain"

### Namecheap Support
- **Live Chat:** 24/7 available in Namecheap dashboard
- **Support Portal:** https://www.namecheap.com/support/
- **Ask about:** "DNS records for Replit deployment"

### Let's Encrypt Status
- **Status Page:** https://letsencrypt.status.io
- Check if Let's Encrypt is experiencing issues

---

## 🎯 Quick Summary

**What happened:**
- SSL certificate for greenelephant.org expired on ~Feb 15, 2026
- Let's Encrypt certificates last 90 days and must be renewed
- Replit auto-renews IF domain verification is valid

**Why it happened:**
- Domain verification may have failed silently
- DNS records may have changed or become invalid
- Automatic renewal process encountered an error

**How to fix:**
1. ✅ Verify DNS records in Namecheap
2. ✅ Verify domain ownership in Replit
3. ✅ Re-link domain or redeploy to trigger certificate renewal
4. ⏳ Wait 30 minutes for SSL certificate provisioning
5. ✅ Update URL redirect to HTTPS
6. ✅ Verify certificate works on all devices

**Prevent future issues:**
- Set up monitoring (UptimeRobot, SSL Checker)
- Add calendar reminders every 60 days
- Keep DNS records stable and unchanged
- Don't remove TXT verification records

---

## ✅ Completion

Once all steps are complete and verified:
- [x] SSL certificate renewed and active
- [x] HTTPS works for greenelephant.org
- [x] HTTPS works for www.greenelephant.org
- [x] HTTPS works for interviews.greenelephant.org
- [x] URL redirect points to HTTPS
- [x] Monitoring set up for future expirations
- [x] Team notified of resolution

**Document completion date:** _______________  
**Certificate expiration date:** _______________  
**Next check date (60 days):** _______________

---

**Last Updated:** February 16, 2026  
**Maintained By:** Green Elephant DevOps Team
