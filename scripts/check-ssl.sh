#!/bin/bash

# SSL Certificate Checker for Green Elephant
# This script checks the SSL certificates for all Green Elephant domains

DOMAINS=(
  "greenelephant.org"
  "www.greenelephant.org"
  "interviews.greenelephant.org"
)

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔒 Checking SSL Certificates for Green Elephant...${NC}"
echo ""

ALL_VALID=true

for DOMAIN in "${DOMAINS[@]}"; do
  echo -e "${BLUE}Checking: ${DOMAIN}${NC}"
  
  # Get certificate info
  CERT_INFO=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates -issuer 2>/dev/null)
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}  ❌ Failed to retrieve certificate${NC}"
    echo -e "${YELLOW}  → Domain may be unreachable or certificate is invalid${NC}"
    echo ""
    ALL_VALID=false
    continue
  fi
  
  # Extract information
  EXPIRY_DATE=$(echo "$CERT_INFO" | grep "notAfter" | cut -d= -f2)
  START_DATE=$(echo "$CERT_INFO" | grep "notBefore" | cut -d= -f2)
  ISSUER=$(echo "$CERT_INFO" | grep "issuer" | cut -d= -f2-)
  
  # Convert to seconds since epoch
  EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s 2>/dev/null)
  if [ $? -ne 0 ]; then
    # macOS compatibility
    EXPIRY_EPOCH=$(date -j -f "%b %d %T %Y %Z" "$EXPIRY_DATE" +%s 2>/dev/null)
  fi
  
  NOW_EPOCH=$(date +%s)
  
  # Calculate days until expiration
  DAYS_UNTIL_EXPIRY=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))
  
  echo -e "  ${BLUE}Valid from:${NC} $START_DATE"
  echo -e "  ${BLUE}Valid until:${NC} $EXPIRY_DATE"
  echo -e "  ${BLUE}Issued by:${NC} $ISSUER"
  
  # Status check
  if [ $DAYS_UNTIL_EXPIRY -lt 0 ]; then
    echo -e "  ${RED}❌ EXPIRED! (${DAYS_UNTIL_EXPIRY#-} days ago)${NC}"
    echo -e "  ${YELLOW}→ Action required: Follow SSL_QUICK_FIX.md${NC}"
    ALL_VALID=false
  elif [ $DAYS_UNTIL_EXPIRY -lt 14 ]; then
    echo -e "  ${YELLOW}⚠️  EXPIRING SOON! (${DAYS_UNTIL_EXPIRY} days remaining)${NC}"
    echo -e "  ${YELLOW}→ Renew soon to avoid expiration${NC}"
    ALL_VALID=false
  elif [ $DAYS_UNTIL_EXPIRY -lt 30 ]; then
    echo -e "  ${YELLOW}⏰ Good, but check soon (${DAYS_UNTIL_EXPIRY} days remaining)${NC}"
  else
    echo -e "  ${GREEN}✅ Valid (${DAYS_UNTIL_EXPIRY} days remaining)${NC}"
  fi
  
  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$ALL_VALID" = true ]; then
  echo -e "${GREEN}✅ All certificates are valid!${NC}"
  echo ""
  echo "Next check recommended in 30 days."
else
  echo -e "${RED}⚠️  ACTION REQUIRED: One or more certificates need attention!${NC}"
  echo ""
  echo "Quick fix guide: SSL_QUICK_FIX.md"
  echo "Detailed guide: SSL_CERTIFICATE_RENEWAL_GUIDE.md"
  echo ""
  echo "Quick links:"
  echo "  - Replit: https://replit.com"
  echo "  - Namecheap: https://namecheap.com"
  echo "  - SSL Checker: https://www.sslshopper.com/ssl-checker.html"
  exit 1
fi
