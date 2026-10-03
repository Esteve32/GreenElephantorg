declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Legacy purchase, assessment and form trackers remain disabled. Public landing
// measurement is owned by marketing-tracker.ts; do not turn these broad helpers
// back on merely because a visitor accepts marketing-page analytics.
export const initGA = () => {};
const hasAnalyticsConsent = () => false;

export const trackPageView = (url: string) => {
  if (!hasAnalyticsConsent() || typeof window === 'undefined' || !window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  window.gtag('config', measurementId, {
    page_path: url
  });
};

export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
) => {
  if (!hasAnalyticsConsent() || typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const trackPurchase = (
  transactionId: string,
  productName: string,
  amount: number,
  currency: string = 'EUR'
) => {
  if (!hasAnalyticsConsent() || typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: amount,
    currency: currency,
    items: [{
      item_name: productName,
      price: amount,
      quantity: 1
    }]
  });
};

export const trackScanStart = (email: string) => {
  trackEvent('begin_checkout', 'Satellite Scan');
};

export const trackCalendlyClick = (productName: string) => {
  trackEvent('calendly_click', 'Booking', productName);
};

export const trackTypeformStart = (purchaseId: string) => {
  trackEvent('typeform_start', 'Satellite Scan');
};

export const trackReferrer = () => {
  if (!hasAnalyticsConsent() || typeof window === 'undefined' || !window.gtag) return;
  
  const referrer = document.referrer;
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  
  const isPartnerReferral = 
    referrer.includes('arbora.partners') ||
    referrer.includes('estevepannetier.com') ||
    utmSource === 'arbora' ||
    utmSource === 'estevepannetier';
  
  if (isPartnerReferral || utmSource) {
    window.gtag('event', 'partner_referral', {
      referrer_url: referrer,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      is_partner: isPartnerReferral
    });
  }
};

export const PARTNER_LINKS = {
  arbora: 'https://arbora.partners/nest',
  esteve: 'https://estevepannetier.com'
} as const;

export const trackScanCTAClicked = (location: string) => {
  trackEvent('scan_cta_clicked', 'Satellite Scan', location);
};

export const trackFlowCheckCompleted = (zone: string) => {
  trackEvent('flow_check_completed', 'Flow Check', zone);
};

export const trackNewsletterSubscribed = () => {
  trackEvent('newsletter_subscribed', 'Newsletter', 'footer');
};

export const trackWebinarSignup = (lens?: string) => {
  trackEvent('webinar_signup', 'Webinar', lens ?? 'all');
};

export const trackContactFormSubmitted = (intent: string) => {
  trackEvent('contact_form_submitted', 'Contact', intent);
};

export const trackQuizCompleted = (score: number) => {
  trackEvent('quiz_completed', 'Quiz', undefined, score);
};

export const trackPromptCopied = (lens: string) => {
  trackEvent('prompt_copied', 'Resources', lens);
};

export const trackCoachingCTAClicked = (location: string) => {
  trackEvent('coaching_cta_clicked', 'Coaching', location);
};
