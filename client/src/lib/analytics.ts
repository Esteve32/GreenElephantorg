declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    return;
  }

  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(script2);
};

export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
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
  if (typeof window === 'undefined' || !window.gtag) return;
  
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
  if (typeof window === 'undefined' || !window.gtag) return;
  
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
  trackEvent('begin_checkout', 'Satellite Scan', email);
};

export const trackCalendlyClick = (productName: string) => {
  trackEvent('calendly_click', 'Booking', productName);
};

export const trackTypeformStart = (purchaseId: string) => {
  trackEvent('typeform_start', 'Satellite Scan', purchaseId);
};

export const trackReferrer = () => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
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
