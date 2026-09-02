# 🔥 SSL Certificate Quick Fix - 15 Minutes

## ⚠️ Certificate Expired - Users Can't Access Site

**Follow these steps IN ORDER:**

---

## ✅ Step 1: Namecheap DNS (5 minutes)

**Go to:** https://namecheap.com → Domain List → greenelephant.org → Advanced DNS

**Verify these records exist:**

| Type | Host | Value | Action |
|------|------|-------|--------|
| A | @ | 34.111.179.208 | ✓ Check exists |
| A | www | 34.111.179.208 | ✓ Check exists |
| A | interviews | 34.111.179.208 | ✓ Check exists |
| TXT | @ | replit-verify=8c4dd19f-df5b-42bf-ae51-5b08619e34c5 | ✓ Check exists |
| TXT | interviews | replit-verify=[code] | ✓ Check exists |

**If ANY record is missing:** Add it using "Add New Record" button

---

## ✅ Step 2: Replit Domain Verification (2 minutes)

**Go to:** Replit.com → Your Project → Deployments → Settings → Domains

**Check status of greenelephant.org:**

- ✅ **"Verified"** → Go to Step 3
- ⏳ **"Pending"** → Wait 15 minutes, refresh, then go to Step 3
- ❌ **"Failed" or not listed** → Do this:
  1. Click "Link a domain"
  2. Enter: greenelephant.org
  3. Follow Replit instructions to add DNS records
  4. Wait 15 minutes
  5. Click "Verify"

---

## ✅ Step 3: Trigger SSL Renewal (3 minutes)

**Option A - Remove and Re-add Domain (Recommended):**

1. In Replit Deployments → Domains
2. Click ⋮ (three dots) next to greenelephant.org
3. Click "Remove domain"
4. Wait 2 minutes
5. Click "Link a domain"
6. Enter: greenelephant.org
7. Click "Add"
8. ✅ Replit will automatically provision new SSL certificate

**Option B - Redeploy:**

1. Click "Deploy" button (top right 🚀)
2. Select your deployment type (Autoscale/Reserved VM)
3. Click "Deploy"
4. ✅ New deployment triggers SSL certificate renewal

---

## ✅ Step 4: Wait for SSL (5-30 minutes)

**While waiting:**
- ☕ Get coffee
- 🔄 Refresh https://greenelephant.org every 5 minutes
- 🔍 Look for 🔒 lock icon in address bar

**When lock icon appears:** SSL is working! Proceed to Step 5.

**If still broken after 30 minutes:** See troubleshooting section in SSL_CERTIFICATE_RENEWAL_GUIDE.md

---

## ✅ Step 5: Update Redirect to HTTPS (2 minutes)

**Go to:** Namecheap → Domain List → greenelephant.org → Advanced DNS

**Find this record:**
```
Type: URL Redirect Record
Host: @
Value: http://www.greenelephant.org  ← Currently HTTP
```

**Edit it:**
1. Click edit (pencil icon)
2. Change to: `https://www.greenelephant.org`  ← Change to HTTPS
3. Save

---

## ✅ Step 6: Test Everything (3 minutes)

**Open browser, test these URLs:**

- [ ] https://greenelephant.org → Shows lock icon 🔒
- [ ] https://www.greenelephant.org → Shows lock icon 🔒
- [ ] https://interviews.greenelephant.org → Shows lock icon 🔒
- [ ] Click lock icon → "Connection is secure"
- [ ] Certificate valid until (should be ~90 days from now)

**Test on phone:**
- [ ] Open https://greenelephant.org on mobile
- [ ] No security warnings

---

## ✅ DONE!

**Certificate renewed:** ✓  
**Site accessible:** ✓  
**HTTPS working:** ✓

---

## 🆘 Quick Troubleshooting

### "Domain verification pending for >1 hour"

**Check DNS propagation:**
```bash
# Visit: https://dnschecker.org
# Enter: greenelephant.org
# Type: A
# Should show: 34.111.179.208 globally
```

If not propagated, wait 6-24 hours.

### "Still shows certificate expired"

**Clear browser cache:**
- Chrome: Ctrl+Shift+Delete → Clear cache
- Try incognito/private mode
- Try different browser

### "Can't find domain in Replit"

You need to add it:
1. Deployments → Settings → Domains
2. Link a domain → greenelephant.org
3. Copy DNS records Replit shows
4. Add to Namecheap Advanced DNS
5. Wait 30 min → Click Verify

---

## 📅 Set Reminder

**Add to calendar:**
```
Event: Check SSL Certificate
Date: [60 days from today]
Repeat: Every 60 days
URL: https://greenelephant.org (click lock icon to check)
```

---

## 📞 Need Help?

- **Full Guide:** See `SSL_CERTIFICATE_RENEWAL_GUIDE.md` in this repo
- **Replit Support:** https://replit.com/support
- **Namecheap Support:** Live chat in dashboard

---

**Estimated Total Time:** 15-45 minutes (depending on DNS propagation)  
**Last Updated:** February 16, 2026
