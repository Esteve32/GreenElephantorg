import { google } from 'googleapis';
import { isConnectorEnabled } from './connectorGuard';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  const gmailRes = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=gmail',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json());

  const gmailConnection = gmailRes.items?.[0];

  if (!gmailConnection) {
    throw new Error('Gmail connector not configured. Add the Gmail integration in Admin > Connected Tools before using email harvesting.');
  }

  connectionSettings = gmailConnection;

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!accessToken) {
    throw new Error('Gmail OAuth token missing. Re-authenticate the Gmail connector in Admin > Connected Tools.');
  }
  return accessToken;
}

export async function getGmailClient() {
  const accessToken = await getAccessToken();
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.gmail({ version: 'v1', auth: oauth2Client });
}

export interface EmailThread {
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
  messages: Array<{
    id: string;
    from: string;
    to: string;
    date: string;
    subject: string;
    body: string;
  }>;
}

export async function harvestEmailChains(query: string, maxResults: number = 20): Promise<EmailThread[]> {
  if (!(await isConnectorEnabled("gmail"))) {
    throw new Error('Gmail connector is currently disabled. Enable it in Admin > Connected Tools.');
  }

  const gmail = await getGmailClient();
  const threads: EmailThread[] = [];

  const listRes = await gmail.users.threads.list({
    userId: 'me',
    q: query,
    maxResults,
  });

  if (!listRes.data.threads) return [];

  for (const thread of listRes.data.threads.slice(0, maxResults)) {
    const threadRes = await gmail.users.threads.get({
      userId: 'me',
      id: thread.id!,
      format: 'metadata',
      metadataHeaders: ['From', 'To', 'Subject', 'Date'],
    });

    const messages = (threadRes.data.messages || []).map(msg => {
      const headers = msg.payload?.headers || [];
      const getHeader = (name: string) => headers.find(h => h.name?.toLowerCase() === name.toLowerCase())?.value || '';
      return {
        id: msg.id || '',
        from: getHeader('From'),
        to: getHeader('To'),
        date: getHeader('Date'),
        subject: getHeader('Subject'),
        body: msg.snippet || '',
      };
    });

    if (messages.length > 0) {
      threads.push({
        threadId: thread.id!,
        subject: messages[0].subject,
        from: messages[0].from,
        to: messages[0].to,
        date: messages[0].date,
        snippet: threadRes.data.messages?.[0]?.snippet || '',
        messages,
      });
    }
  }

  return threads;
}
