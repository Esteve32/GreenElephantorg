import { isConnectorEnabled } from './connectorGuard';

interface GA4Metrics {
  sessions: number | null;
  uniqueUsers: number | null;
  organicUsers: number | null;
  topTrafficSources: string | null;
  scanPageViews: number | null;
  promptCopyEvents: number | null;
  coachingCTAClicks: number | null;
  returnVisitorRate: number | null;
  promptCopiesPerSession: number | null;
  directTrafficShare: number | null;
}

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const GOOGLE_SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

function isGA4Configured(): boolean {
  return !!(GA4_PROPERTY_ID && GOOGLE_SERVICE_ACCOUNT_KEY);
}

function getPropertyId(): string | null {
  return GA4_PROPERTY_ID || null;
}

function getDateRange(window: string): { startDate: string; endDate: string } {
  const endDate = "today";
  if (window === "7d") return { startDate: "7daysAgo", endDate };
  if (window === "30d") return { startDate: "30daysAgo", endDate };
  return { startDate: "2020-01-01", endDate };
}

async function getAccessToken(): Promise<string | null> {
  if (!GOOGLE_SERVICE_ACCOUNT_KEY) return null;

  try {
    const key = JSON.parse(GOOGLE_SERVICE_ACCOUNT_KEY);
    const jwt = await createJWT(key);
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    if (!tokenRes.ok) {
      console.error("GA4 token exchange failed:", await tokenRes.text());
      return null;
    }

    const tokenData = await tokenRes.json();
    return tokenData.access_token;
  } catch (err) {
    console.error("GA4 service account auth failed:", err);
    return null;
  }
}

async function createJWT(key: { client_email: string; private_key: string }): Promise<string> {
  const crypto = await import("crypto");

  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    iss: key.client_email,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  })).toString("base64url");

  const signInput = `${header}.${payload}`;
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(signInput);
  const signature = sign.sign(key.private_key, "base64url");

  return `${signInput}.${signature}`;
}

async function runGA4Report(
  accessToken: string,
  dateRange: { startDate: string; endDate: string },
  metrics: Array<{ name: string }>,
  dimensions?: Array<{ name: string }>,
  dimensionFilter?: Record<string, unknown>,
): Promise<Record<string, unknown>[] | null> {
  const body: Record<string, unknown> = {
    dateRanges: [dateRange],
    metrics,
  };
  if (dimensions) body.dimensions = dimensions;
  if (dimensionFilter) body.dimensionFilter = dimensionFilter;

  try {
    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      console.error("GA4 report failed:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data.rows || [];
  } catch (err) {
    console.error("GA4 report request failed:", err);
    return null;
  }
}

export async function fetchGA4Metrics(window: string): Promise<GA4Metrics> {
  if (!(await isConnectorEnabled("google-analytics"))) {
    console.log('⏸️ Google Analytics connector disabled — returning null metrics');
    return {
      sessions: null, uniqueUsers: null, organicUsers: null, topTrafficSources: null,
      scanPageViews: null, promptCopyEvents: null, coachingCTAClicks: null,
      returnVisitorRate: null, promptCopiesPerSession: null, directTrafficShare: null,
    };
  }
  const nullMetrics: GA4Metrics = {
    sessions: null,
    uniqueUsers: null,
    organicUsers: null,
    topTrafficSources: null,
    scanPageViews: null,
    promptCopyEvents: null,
    coachingCTAClicks: null,
    returnVisitorRate: null,
    promptCopiesPerSession: null,
    directTrafficShare: null,
  };

  if (!isGA4Configured()) {
    return nullMetrics;
  }

  const propertyId = getPropertyId();
  if (!propertyId) {
    console.warn("GA4: GA4_PROPERTY_ID not set (VITE_GA_MEASUREMENT_ID alone cannot be used for Data API — set GA4_PROPERTY_ID to the numeric property ID)");
    return nullMetrics;
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    console.warn("GA4: Could not obtain access token, returning null metrics");
    return nullMetrics;
  }

  const dateRange = getDateRange(window);
  const result = { ...nullMetrics };

  try {
    const [sessionsReport, scanPagesReport, promptEventsReport, coachingEventsReport, trafficReport, organicReport] = await Promise.all([
      runGA4Report(accessToken, dateRange, [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "newUsers" },
      ]),
      runGA4Report(accessToken, dateRange, [{ name: "screenPageViews" }], undefined, {
        filter: {
          fieldName: "pagePath",
          stringFilter: { matchType: "EXACT", value: "/scan" },
        },
      }),
      runGA4Report(accessToken, dateRange, [{ name: "eventCount" }], [{ name: "eventName" }], {
        filter: {
          fieldName: "eventName",
          stringFilter: { matchType: "EXACT", value: "prompt_copied" },
        },
      }),
      runGA4Report(accessToken, dateRange, [{ name: "eventCount" }], [{ name: "eventName" }], {
        filter: {
          fieldName: "eventName",
          stringFilter: { matchType: "EXACT", value: "coaching_cta_clicked" },
        },
      }),
      runGA4Report(accessToken, dateRange, [{ name: "sessions" }], [{ name: "sessionSource" }]),
      runGA4Report(accessToken, dateRange, [{ name: "totalUsers" }], [{ name: "sessionDefaultChannelGroup" }], {
        filter: {
          fieldName: "sessionDefaultChannelGroup",
          stringFilter: { matchType: "EXACT", value: "Organic Search" },
        },
      }),
    ]);

    if (sessionsReport && sessionsReport.length > 0) {
      const row = sessionsReport[0] as Record<string, unknown>;
      const metricValues = (row.metricValues || []) as Array<{ value: string }>;
      result.sessions = parseInt(metricValues[0]?.value || "0");
      result.uniqueUsers = parseInt(metricValues[1]?.value || "0");
      const newUsers = parseInt(metricValues[2]?.value || "0");
      const returningUsers = result.uniqueUsers - newUsers;
      result.returnVisitorRate = result.uniqueUsers > 0
        ? Math.round((returningUsers / result.uniqueUsers) * 100)
        : 0;
    }

    if (organicReport && organicReport.length > 0) {
      const row = organicReport[0] as Record<string, unknown>;
      const metricValues = (row.metricValues || []) as Array<{ value: string }>;
      result.organicUsers = parseInt(metricValues[0]?.value || "0");
    }

    if (scanPagesReport && scanPagesReport.length > 0) {
      const row = scanPagesReport[0] as Record<string, unknown>;
      const metricValues = (row.metricValues || []) as Array<{ value: string }>;
      result.scanPageViews = parseInt(metricValues[0]?.value || "0");
    }

    if (promptEventsReport && promptEventsReport.length > 0) {
      const row = promptEventsReport[0] as Record<string, unknown>;
      const metricValues = (row.metricValues || []) as Array<{ value: string }>;
      result.promptCopyEvents = parseInt(metricValues[0]?.value || "0");
      if (result.sessions && result.sessions > 0) {
        result.promptCopiesPerSession = Math.round((result.promptCopyEvents / result.sessions) * 100) / 100;
      }
    }

    if (coachingEventsReport && coachingEventsReport.length > 0) {
      const row = coachingEventsReport[0] as Record<string, unknown>;
      const metricValues = (row.metricValues || []) as Array<{ value: string }>;
      result.coachingCTAClicks = parseInt(metricValues[0]?.value || "0");
    }

    if (trafficReport && trafficReport.length > 0) {
      const rows = trafficReport as Array<Record<string, unknown>>;
      const sources = rows.map(r => {
        const dims = (r.dimensionValues || []) as Array<{ value: string }>;
        const mets = (r.metricValues || []) as Array<{ value: string }>;
        return { source: dims[0]?.value || "unknown", sessions: parseInt(mets[0]?.value || "0") };
      }).sort((a, b) => b.sessions - a.sessions);

      const totalSessions = sources.reduce((s, r) => s + r.sessions, 0);
      result.topTrafficSources = sources.slice(0, 3).map(s => s.source).join(", ");

      const directSessions = sources.find(s => s.source === "(direct)")?.sessions || 0;
      result.directTrafficShare = totalSessions > 0
        ? Math.round((directSessions / totalSessions) * 100)
        : 0;
    }
  } catch (err) {
    console.error("GA4 metrics fetch error:", err);
  }

  return result;
}

export { isGA4Configured };
