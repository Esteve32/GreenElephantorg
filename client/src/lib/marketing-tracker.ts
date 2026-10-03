import { CONSENT_KEY, CONSENT_DAYS, readConsent, consentRecord, marketingPath, validMeasurementId, pageViewEvent, ctaEvent, type AnalyticsChoice, type MarketingEvent } from '../../../shared/marketing-analytics';

export interface TrackerDriver {
  readChoice(): string | null;
  writeChoice(record: string): void;
  path(): string;
  referrer(): string;
  productionHost(): boolean;
  config(): Promise<{enabled:boolean;measurementId:string|null}>;
  load(id: string, initial: MarketingEvent): void;
  send(event: MarketingEvent): void;
  stop(): void;
}

// Single owner of consent, initialization and deduplication; easy to test without
// loading Google or creating analytics events during local verification.
export function createMarketingTracker(driver: TrackerDriver) {
  let epoch = 0, loaded = false, loading: Promise<void> | null = null, lastPath: string | null = null;
  let volatileChoice: AnalyticsChoice | null = null;
  const choice = () => {
    try { return volatileChoice ?? readConsent(driver.readChoice()); } catch { return volatileChoice; }
  };
  const allowed = () => choice() === 'accepted' && driver.productionHost() && !!marketingPath(driver.path());
  const stop = () => { epoch++; loading = null; loaded = false; lastPath = null; driver.stop(); };
  const visit = async () => {
    if (!allowed()) { stop(); return; }
    if (!loaded) {
      if (loading) return loading;
      const current = ++epoch;
      const task = (async () => {
        try {
          const config = await driver.config();
          if (current !== epoch || !allowed() || config.enabled !== true || !validMeasurementId(config.measurementId)) return;
          const initial = pageViewEvent(driver.path(), driver.referrer());
          if (!initial) return;
          driver.load(config.measurementId, initial);
          loaded = true;
          lastPath = initial.params.page_path;
          driver.send(initial);
        } catch { /* Blockers/offline/missing config fail closed; navigation still works. */ }
        finally { if (current === epoch) loading = null; }
      })();
      loading = task;
      return task;
    }
    const event = pageViewEvent(driver.path(), driver.referrer());
    if (event && event.params.page_path !== lastPath) { driver.send(event); lastPath = event.params.page_path; }
  };
  return {
    choice, visit, stop,
    async choose(value: AnalyticsChoice) {
      // A failed storage write never reuses an old acceptance during this visit.
      volatileChoice = value;
      try { driver.writeChoice(consentRecord(value)); volatileChoice = null; } catch { /* session-only choice */ }
      if (value === 'rejected') { stop(); return; }
      await visit();
    },
    click(href: string, position: string | null) {
      if (!allowed() || !loaded) return;
      const event = ctaEvent(driver.path(), href, position);
      if (event) driver.send(event);
    },
  };
}

type GtagWindow = Window & {dataLayer?: unknown[]; gtag?: (...args: unknown[])=>void};
let singleton: ReturnType<typeof createMarketingTracker> | undefined;

export function browserMarketingTracker() {
  if (singleton) return singleton;
  const win = window as GtagWindow;
  let id: string | null = null;
  let tag: HTMLScriptElement | null = null;
  let expiryTimer: ReturnType<typeof setInterval> | undefined;
  const disable = (value: boolean) => { if (id) (window as unknown as Record<string,unknown>)[`ga-disable-${id}`] = value; };
  const clearCookies = () => {
    const names = document.cookie.split(';').map(x=>x.trim().split('=')[0]).filter(x=>/^_ga(?:_|$)/.test(x));
    for (const name of names) for (const domain of ['', location.hostname, '.greenelephant.org', 'greenelephant.org']) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain?`; Domain=${domain}`:''}`;
    }
  };
  const tracker = createMarketingTracker({
    readChoice:()=>{
      const record = localStorage.getItem(CONSENT_KEY);
      // A saved acceptance is not usable when the browser prevents changing it.
      // Writing the identical value does not renew its recorded timestamp.
      if (record !== null) localStorage.setItem(CONSENT_KEY,record);
      return record;
    },
    writeChoice:record=>{
      try { localStorage.setItem(CONSENT_KEY,record); }
      catch (error) {
        // In particular, never leave an old acceptance behind after withdrawal.
        try { localStorage.removeItem(CONSENT_KEY); } catch { /* subsequent reads fail closed */ }
        throw error;
      }
    },
    path:()=>location.pathname, referrer:()=>document.referrer,
    productionHost:()=>location.protocol === 'https:' && /^(www\.)?greenelephant\.org$/.test(location.hostname),
    async config() {
      const response = await fetch('/api/public/analytics-config', {credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(5000)});
      if (!response.ok) throw new Error('Analytics unavailable');
      return response.json();
    },
    load(measurementId, initial) {
      // Do not attach a second tag if an external installation appears later.
      if (!id && (typeof win.gtag === 'function' || document.querySelector('script[src*="googletagmanager.com"]'))) throw new Error('Existing analytics installation needs review');
      id = measurementId;
      disable(false);
      win.dataLayer = [];
      win.gtag = function() { win.dataLayer!.push(arguments); };
      win.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
      win.gtag('consent','update',{analytics_storage:'granted'});
      win.gtag('set','ads_data_redaction',true);
      win.gtag('set','url_passthrough',false);
      win.gtag('js',new Date());
      win.gtag('config',id,{...initial.params,send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,
        cookie_expires:CONSENT_DAYS*86400,cookie_update:false,ignore_referrer:true,
        // Explicit overrides prevent arbitrary UTM strings being read by the tag.
        campaign_source:initial.params.acquisition_source,campaign_medium:'unspecified',
        campaign_name:'unspecified',campaign_id:'unspecified',campaign_term:'unspecified',campaign_content:'unspecified'});
      tag = document.createElement('script'); tag.async = true;
      tag.id = 'ge-consented-analytics'; tag.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(tag);
      expiryTimer = setInterval(()=>{if(tracker.choice()!=='accepted') { tracker.stop(); location.reload(); }},60000);
    },
    send(event) {
      // Keep implicit GA event metadata sanitized too, not just page_view.
      win.gtag?.('set',{page_location:event.params.page_location,page_referrer:'',page_title:event.params.page_title});
      win.gtag?.('event',event.name,{...event.params,send_to:id});
    },
    stop() {
      disable(true);
      if (expiryTimer) { clearInterval(expiryTimer); expiryTimer = undefined; }
      // No consent-update call here: basic mode must not send denied-state pings.
      if (tag) { tag.remove(); tag = null; }
      if (id) { win.dataLayer = []; win.gtag = ()=>{}; }
      clearCookies();
    },
  });
  singleton = tracker;
  // Disable BEFORE history changes, so the tag cannot observe private URLs.
  // Reload once when a loaded tag leaves the permitted public surface or consent
  // is withdrawn: removing a script element alone does not unload its listeners.
  const leaveAllowedSurface = (url: string | URL | null | undefined) => {
    if (!url || !id) return false;
    const target = new URL(url,location.href);
    if (target.origin === location.origin && !marketingPath(target.pathname)) {
      tracker.stop(); location.assign(target.href); return true;
    }
    return false;
  };
  for (const method of ['pushState','replaceState'] as const) {
    const original = history[method].bind(history);
    history[method] = (data: unknown, unused: string, url?: string | URL | null) => {
      if (!leaveAllowedSurface(url)) original(data,unused,url);
    };
  }
  window.addEventListener('popstate',()=>{
    if (id && !marketingPath(location.pathname)) { tracker.stop(); location.reload(); }
  });
  window.addEventListener('pageshow',event=>{
    // Back/Forward cache may restore the old Google listeners with the document.
    // Start from a clean document rather than attaching a second library.
    if (event.persisted && id) { tracker.stop(); location.reload(); }
    else void tracker.visit();
  });
  window.addEventListener('storage',event=>{
    if(event.key === CONSENT_KEY || event.key === null) {
      if(tracker.choice() !== 'accepted') { tracker.stop(); if(id) location.reload(); }
      else void tracker.visit();
      window.dispatchEvent(new Event('ge:consent-changed'));
    }
  });
  document.addEventListener('click',event=>{
    const anchor = (event.target instanceof Element ? event.target.closest('a[href]') : null) as HTMLAnchorElement | null;
    if (!anchor) return;
    tracker.click(anchor.getAttribute('href')!,anchor.dataset.ctaPosition ?? anchor.dataset.testid?.match(/-(hero|closing)$/)?.[1] ?? null);
  },true);
  return tracker;
}

export function chooseAnalytics(choice: AnalyticsChoice) {
  const hadTag = !!document.getElementById('ge-consented-analytics');
  const task = browserMarketingTracker().choose(choice);
  window.dispatchEvent(new Event('ge:consent-changed'));
  if (choice === 'rejected' && hadTag) location.reload();
  return task;
}

export const openCookiePreferences = () => window.dispatchEvent(new Event('ge:cookie-preferences'));
