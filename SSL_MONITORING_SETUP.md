# SSL Certificate Monitoring Setup Guide

## Overview

This guide explains how to set up automated monitoring for your SSL certificates to prevent future expiration issues.

## Automated Monitoring Options

### Option 1: GitHub Actions Monitoring (Recommended)

Create a GitHub Action that runs daily to check SSL certificate expiration and alerts you before it expires.

**Benefits:**
- Free
- Automated
- Integrated with your repository
- Can create GitHub Issues when certificate is expiring

**Setup:**

1. Create `.github/workflows/ssl-check.yml` in your repository
2. Add the monitoring workflow (simplified example below - see actual implementation in this repo)
3. Configure GitHub repository secrets for notifications
4. Enable GitHub Issues for alerts

**Simplified Example Workflow:**

> **Note:** This is a simplified example for illustration. The actual implementation in this repository (`.github/workflows/ssl-certificate-check.yml`) includes more sophisticated features like automatic issue management, better error handling, and detailed summaries.

```yaml
name: SSL Certificate Check

on:
  schedule:
    # Run daily at 9:00 AM UTC
    - cron: '0 9 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  check-ssl:
    runs-on: ubuntu-latest
    steps:
      - name: Check SSL Certificate Expiration
        run: |
          DOMAIN="greenelephant.org"
          DAYS_THRESHOLD=14  # Alert if expires within 14 days
          
          # Get certificate expiration date
          EXPIRY_DATE=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
          
          # Convert to seconds since epoch
          EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
          NOW_EPOCH=$(date +%s)
          
          # Calculate days until expiration
          DAYS_UNTIL_EXPIRY=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))
          
          echo "Certificate expires on: $EXPIRY_DATE"
          echo "Days until expiration: $DAYS_UNTIL_EXPIRY"
          
          # Check if certificate is expired or expiring soon
          if [ $DAYS_UNTIL_EXPIRY -lt 0 ]; then
            echo "::error::SSL certificate for $DOMAIN has EXPIRED!"
            exit 1
          elif [ $DAYS_UNTIL_EXPIRY -lt $DAYS_THRESHOLD ]; then
            echo "::warning::SSL certificate for $DOMAIN expires in $DAYS_UNTIL_EXPIRY days!"
            exit 1
          else
            echo "::notice::SSL certificate for $DOMAIN is valid for $DAYS_UNTIL_EXPIRY more days"
          fi

      - name: Check www subdomain
        run: |
          DOMAIN="www.greenelephant.org"
          EXPIRY_DATE=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
          EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
          NOW_EPOCH=$(date +%s)
          DAYS_UNTIL_EXPIRY=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))
          
          echo "www certificate expires on: $EXPIRY_DATE"
          echo "Days until expiration: $DAYS_UNTIL_EXPIRY"
          
          if [ $DAYS_UNTIL_EXPIRY -lt 14 ]; then
            echo "::warning::www subdomain certificate expires in $DAYS_UNTIL_EXPIRY days!"
          fi

      - name: Check interviews subdomain
        run: |
          DOMAIN="interviews.greenelephant.org"
          EXPIRY_DATE=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
          EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
          NOW_EPOCH=$(date +%s)
          DAYS_UNTIL_EXPIRY=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))
          
          echo "interviews certificate expires on: $EXPIRY_DATE"
          echo "Days until expiration: $DAYS_UNTIL_EXPIRY"
          
          if [ $DAYS_UNTIL_EXPIRY -lt 14 ]; then
            echo "::warning::interviews subdomain certificate expires in $DAYS_UNTIL_EXPIRY days!"
          fi

      - name: Create Issue on Failure
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '🔒 SSL Certificate Expiring Soon or Expired',
              body: `## SSL Certificate Alert
              
              The SSL certificate check has detected an issue with greenelephant.org certificates.
              
              **Action Required:**
              1. Check the [workflow logs](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }})
              2. Follow steps in \`SSL_QUICK_FIX.md\` to renew certificate
              3. See \`SSL_CERTIFICATE_RENEWAL_GUIDE.md\` for detailed troubleshooting
              
              **Quick Links:**
              - [SSL Quick Fix Guide](https://github.com/${{ github.repository }}/blob/main/SSL_QUICK_FIX.md)
              - [Detailed Renewal Guide](https://github.com/${{ github.repository }}/blob/main/SSL_CERTIFICATE_RENEWAL_GUIDE.md)
              - [Replit Deployments](https://replit.com)
              - [Namecheap DNS](https://namecheap.com)
              
              **Detected on:** ${{ new Date().toISOString() }}`,
              labels: ['ssl', 'urgent', 'infrastructure']
            })
```

**To Enable:**
1. Create the workflow file
2. Commit and push to GitHub
3. GitHub will automatically run it daily
4. Receive alerts via GitHub Issues when certificate is expiring

---

### Option 2: UptimeRobot (Free, No Setup)

**Benefits:**
- No code required
- Email/SMS alerts
- Dashboard for monitoring
- Free tier sufficient

**Setup:**

1. Go to https://uptimerobot.com
2. Sign up (free account)
3. Click "Add New Monitor"
4. Configuration:
   - **Monitor Type:** HTTPS
   - **Friendly Name:** Green Elephant SSL
   - **URL:** https://greenelephant.org
   - **Monitoring Interval:** Every 5 minutes
5. Click "Alert Contacts" → Add email:
   - esteve@greenelephant.org
   - anu@greenelephant.org
6. Save

**Repeat for other domains:**
- https://www.greenelephant.org
- https://interviews.greenelephant.org

**Alerts:**
- Get immediate email when site goes down
- Get weekly/monthly summary reports
- Can add SMS alerts (paid)

---

### Option 3: SSL Certificate Monitor (Free)

**Benefits:**
- Specifically designed for SSL monitoring
- Alerts before expiration
- Free tier for 10 domains

**Setup:**

1. Go to https://www.sslshopper.com/ssl-monitoring.html
2. Sign up (free account)
3. Add domain: greenelephant.org
4. Set alert threshold: 14 days before expiration
5. Add notification emails:
   - esteve@greenelephant.org
   - anu@greenelephant.org
6. Repeat for www and interviews subdomains

**You'll receive:**
- Email when certificate expires in < 14 days
- Email when certificate expires
- Email when certificate is renewed

---

### Option 4: Cloudflare (Alternative SSL Management)

If Replit SSL continues to have issues, consider migrating to Cloudflare for SSL management.

**Benefits:**
- Free Universal SSL
- Auto-renewal handled by Cloudflare
- DDoS protection included
- DNS management in one place

**Setup:**

1. Sign up at https://www.cloudflare.com (free plan)
2. Add site: greenelephant.org
3. Cloudflare will scan your existing DNS records
4. Update nameservers at Namecheap:
   - Current: Namecheap DNS
   - New: Cloudflare nameservers (provided by Cloudflare)
5. Wait 24 hours for nameserver propagation
6. In Cloudflare:
   - SSL/TLS → Overview
   - Set to "Full" or "Flexible"
   - Certificate automatically provisioned
7. Add page rules for redirects if needed

**Note:** This changes how SSL is managed but requires changing nameservers.

---

## Manual Check Script

For quick manual checks, you can use this bash script:

**Create:** `scripts/check-ssl.sh`

```bash
#!/bin/bash

# SSL Certificate Checker for Green Elephant

DOMAINS=(
  "greenelephant.org"
  "www.greenelephant.org"
  "interviews.greenelephant.org"
)

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🔒 Checking SSL Certificates for Green Elephant..."
echo ""

for DOMAIN in "${DOMAINS[@]}"; do
  echo "Checking: $DOMAIN"
  
  # Get certificate info
  CERT_INFO=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to retrieve certificate${NC}"
    echo ""
    continue
  fi
  
  # Extract expiration date
  EXPIRY_DATE=$(echo "$CERT_INFO" | grep "notAfter" | cut -d= -f2)
  START_DATE=$(echo "$CERT_INFO" | grep "notBefore" | cut -d= -f2)
  
  # Convert to seconds since epoch
  EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s 2>/dev/null)
  NOW_EPOCH=$(date +%s)
  
  # Calculate days until expiration
  DAYS_UNTIL_EXPIRY=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))
  
  echo "  Valid from: $START_DATE"
  echo "  Valid until: $EXPIRY_DATE"
  
  # Status check
  if [ $DAYS_UNTIL_EXPIRY -lt 0 ]; then
    echo -e "  ${RED}❌ EXPIRED! ($DAYS_UNTIL_EXPIRY days ago)${NC}"
  elif [ $DAYS_UNTIL_EXPIRY -lt 14 ]; then
    echo -e "  ${YELLOW}⚠️  EXPIRING SOON! ($DAYS_UNTIL_EXPIRY days remaining)${NC}"
  else
    echo -e "  ${GREEN}✅ Valid ($DAYS_UNTIL_EXPIRY days remaining)${NC}"
  fi
  
  echo ""
done

echo "Check complete!"
```

**Usage:**

```bash
# Make executable
chmod +x scripts/check-ssl.sh

# Run check
./scripts/check-ssl.sh
```

**Example output:**

```
🔒 Checking SSL Certificates for Green Elephant...

Checking: greenelephant.org
  Valid from: Jan 16 12:00:00 2026 GMT
  Valid until: Apr 16 12:00:00 2026 GMT
  ✅ Valid (59 days remaining)

Checking: www.greenelephant.org
  Valid from: Jan 16 12:00:00 2026 GMT
  Valid until: Apr 16 12:00:00 2026 GMT
  ✅ Valid (59 days remaining)

Checking: interviews.greenelephant.org
  Valid from: Jan 16 12:00:00 2026 GMT
  Valid until: Apr 16 12:00:00 2026 GMT
  ✅ Valid (59 days remaining)

Check complete!
```

---

## Recommended Setup

**For best protection, use multiple layers:**

1. **GitHub Actions** (Primary monitoring)
   - Automated daily checks
   - Creates issues automatically
   - No external dependencies

2. **UptimeRobot** (Backup monitoring)
   - Monitors site availability
   - Immediate alerts if site goes down
   - Email/SMS notifications

3. **Calendar Reminders** (Manual backup)
   - Every 60 days: Check certificate manually
   - Reminder 2 weeks before typical expiration
   - Run manual check script

---

## Quick Setup Checklist

- [ ] Set up GitHub Actions SSL check workflow
- [ ] Create UptimeRobot monitors for all 3 domains
- [ ] Add calendar reminder every 60 days
- [ ] Test GitHub Actions workflow manually
- [ ] Verify UptimeRobot email alerts work
- [ ] Save contact info for Replit/Namecheap support
- [ ] Bookmark SSL checker tools:
  - [ ] https://www.sslshopper.com/ssl-checker.html
  - [ ] https://dnschecker.org
- [ ] Document who has access to:
  - [ ] Replit account
  - [ ] Namecheap account
  - [ ] GitHub repository

---

## Additional Resources

**SSL Certificate Tools:**
- SSL Checker: https://www.sslshopper.com/ssl-checker.html
- SSL Labs Test: https://www.ssllabs.com/ssltest/
- Certificate Transparency Log: https://crt.sh

**DNS Tools:**
- DNS Checker: https://dnschecker.org
- DNS Propagation: https://www.whatsmydns.net
- MX Toolbox: https://mxtoolbox.com

**Documentation:**
- Let's Encrypt: https://letsencrypt.org/docs/
- Replit SSL Docs: https://docs.replit.com/hosting/deployments/custom-domains
- Namecheap DNS Guide: https://www.namecheap.com/support/knowledgebase/category/38/dns-domain-name-server/

---

**Last Updated:** February 16, 2026  
**Next Review:** May 16, 2026 (90 days)
