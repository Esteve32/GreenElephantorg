import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  // First, check for RESEND_API_KEY in environment/secrets (preferred fallback)
  if (process.env.RESEND_API_KEY) {
    console.log('📧 Using RESEND_API_KEY from environment');
    return {
      apiKey: process.env.RESEND_API_KEY,
      fromEmail: process.env.RESEND_FROM_EMAIL || 'esteve@greenelephant.org'
    };
  }

  // Try the Replit connector
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('Resend API key not found. Please set RESEND_API_KEY in secrets.');
  }

  try {
    connectionSettings = await fetch(
      'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
      {
        headers: {
          'Accept': 'application/json',
          'X_REPLIT_TOKEN': xReplitToken
        }
      }
    ).then(res => res.json()).then(data => data.items?.[0]);

    if (!connectionSettings || (!connectionSettings.settings.api_key)) {
      throw new Error('Resend connector not configured');
    }
    
    console.log('📧 Using Resend from Replit connector');
    return {apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email};
  } catch (error: any) {
    throw new Error(`Resend not connected. Please set RESEND_API_KEY in secrets. Error: ${error.message}`);
  }
}

export async function getUncachableResendClient() {
  const {apiKey, fromEmail} = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail: fromEmail
  };
}
