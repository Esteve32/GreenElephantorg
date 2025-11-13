# Interview Coaching Subdomain Setup Guide

## Overview
This guide will help you set up a subdomain (e.g., `interviews.greenelephant.org` or `coaching.greenelephant.org`) for your new interview coaching landing page, separate from the main GreenElephant.org domain while still connected to it.

## Current Status
✅ Landing page is live at: `/interview-coaching`  
✅ Accessible via: `https://your-replit-url.replit.dev/interview-coaching`  
⏳ Needs: Custom subdomain configuration

## Option 1: Use Replit Custom Domain (Recommended)

### Step 1: Publish Your Replit Project
1. In your Replit project, click the **"Deploy"** button (top right)
2. Select **"Autoscale"** or **"Reserved VM"** deployment
3. Wait for deployment to complete
4. You'll get a production URL like: `https://greenelephant-org.replit.app`

### Step 2: Configure Custom Subdomain
1. Go to your **Replit Deployments** tab
2. Click **Settings** → **Domain**
3. Click **"Link a domain"** or **"Manually connect from another registrar"**
4. Enter your desired subdomain: `interviews.greenelephant.org`

### Step 3: Update DNS Records at Your Domain Registrar
Replit will provide specific DNS records. You'll need to add these to your domain registrar (where you purchased greenelephant.org):

**Required DNS Records:**
```
Type: A
Name: interviews (or your chosen subdomain)
Value: [IP address provided by Replit]
TTL: 3600 (or default)

Type: TXT
Name: interviews (or your chosen subdomain)
Value: [Verification code provided by Replit]
TTL: 3600 (or default)
```

**If using Cloudflare or similar CDN:**
```
Type: CNAME
Name: interviews
Value: greenelephant-org.replit.app (or your Replit deployment URL)
TTL: Auto
Proxy status: DNS only (gray cloud) initially, then switch to Proxied after verification
```

### Step 4: Wait for DNS Propagation
- DNS propagation takes 5 minutes to 48 hours (usually ~1 hour)
- You can check status at: https://dnschecker.org
- Once verified, Replit will automatically provision SSL/TLS certificate

### Step 5: Update Calendly Placeholder Links
Once your subdomain is live, update the Calendly links in `/interview-coaching`:

1. Open `client/src/pages/InterviewCoachingPage.tsx`
2. Search for: `https://calendly.com/PLACEHOLDER-SESSION-1`
3. Replace with your actual Calendly link, e.g.:
   - `https://calendly.com/esteve-greenelephant/interview-coaching-session-1`
   - `https://calendly.com/esteve-greenelephant/interview-coaching-session-2`
   - `https://calendly.com/esteve-greenelephant/interview-coaching-session-3`

## Option 2: Subdomain Redirect (Quick Setup)

If you want a quick solution while setting up custom domain:

### Using Your Domain Registrar
1. Go to your domain registrar's DNS management
2. Add a URL redirect:
   ```
   Source: interviews.greenelephant.org
   Destination: https://your-replit-url.replit.dev/interview-coaching
   Type: 301 Permanent Redirect
   ```

This will redirect `interviews.greenelephant.org` to your Replit-hosted landing page immediately.

**Pros:** Quick setup, no Replit deployment needed  
**Cons:** URL changes in browser, not as professional

## Option 3: Use Same Domain with Path

You can also keep it on the main domain and just link to:
- `https://greenelephant.org/interview-coaching`

Update your LinkedIn profile to link directly to this URL.

**Pros:** No subdomain setup needed, works immediately  
**Cons:** Less distinct branding

## Recommended Subdomain Names

Choose a subdomain that clearly communicates the service:
- `interviews.greenelephant.org` ✨ (Most clear)
- `coaching.greenelephant.org` 
- `career.greenelephant.org`
- `interview-prep.greenelephant.org`
- `get-hired.greenelephant.org`

## Testing Your Subdomain

After setup, verify these items work:
- [ ] Subdomain loads the interview coaching page
- [ ] All internal links work (back to main site)
- [ ] Calendly booking links open correctly
- [ ] SSL certificate is active (https:// with lock icon)
- [ ] Mobile responsiveness
- [ ] Page loads quickly

## Troubleshooting

### "Domain not found" Error
- DNS records haven't propagated yet (wait 1-24 hours)
- Check DNS records are correct at your registrar
- Verify you entered the subdomain correctly in Replit

### SSL Certificate Error
- Wait for Replit to provision certificate (can take 30 minutes after DNS verification)
- Ensure DNS is properly pointing to Replit servers
- Try accessing via http:// first, then https://

### Page Shows 404
- Verify the route `/interview-coaching` exists in your deployment
- Check that you published the latest version of your code
- Restart your Replit deployment

## Next Steps After Subdomain Setup

1. **Add to LinkedIn Profile**
   - Edit your LinkedIn "Featured" section
   - Add link to: `https://interviews.greenelephant.org`
   - Title: "Interview Coaching for 40+ Professionals"
   - Description: "Get confident, prepared, and hired"

2. **Track Organic Traffic**
   - Add Google Analytics to track conversions
   - Monitor LinkedIn click-through rates
   - A/B test different headlines/CTAs

3. **Create Actual Calendly Links**
   - Set up 3 different Calendly event types:
     - "Session 1: Calibration" (90 minutes)
     - "Session 2: Live Roleplay" (120 minutes) 
     - "Session 3: Final Polish" (90 minutes)
   - Update links in the page code

4. **Optional: Custom Email**
   - Set up forwarding: esteve@interviews.greenelephant.org → esteve@greenelephant.org

## Support Resources

- **Replit Docs**: https://docs.replit.com/hosting/deployments/custom-domains
- **DNS Checker**: https://dnschecker.org
- **SSL Checker**: https://www.sslshopper.com/ssl-checker.html

---

## Quick Reference

**Current Landing Page Route:** `/interview-coaching`  
**Price:** €795 for 3-session bundle  
**Target Audience:** Professionals 40+ seeking interview coaching  
**Design:** Clean, trust-building, accessible for non-native English speakers  
**3-Step Process:** Calibration → Live Roleplay → Final Polish  

**Need help?** Contact Replit support or refer to the Replit documentation linked above.
