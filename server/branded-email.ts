import { escapeEmailHtml } from './scan-results-email';

export function brandedEmailWrapper(title: string, subtitle: string, bodyHtml: string, footerText: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <style>
    :root { color-scheme: dark; }
    body, html { margin: 0; padding: 0; background-color: #0a0a0a; }
  </style>
</head>
<body bgcolor="#0a0a0a" style="margin: 0; padding: 0; background-color: #0a0a0a;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0a0a0a" style="background-color: #0a0a0a; width: 100%;">
    <tr>
      <td align="center" style="padding: 24px 12px; background-color: #0a0a0a;" bgcolor="#0a0a0a">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #0a0a0a; border-radius: 12px; overflow: hidden; font-family: 'Lato', Arial, sans-serif;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0a0a0a 0%, #0f1f2e 50%, #0a0a0a 100%); padding: 40px 30px; text-align: center; border-bottom: 1px solid #1a1a1a;">
              <img src="https://greenelephant.org/ge-logo-512.png" alt="GreenElephant" width="48" height="48" style="margin-bottom: 16px; border-radius: 8px; display: block; margin-left: auto; margin-right: auto;" />
              <h1 style="font-family: 'Poppins', Arial, sans-serif; color: #ffffff; margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -0.5px;">${escapeEmailHtml(title)}</h1>
              ${subtitle ? `<p style="color: #009999; margin-top: 8px; margin-bottom: 0; font-size: 15px; font-weight: 500;">${escapeEmailHtml(subtitle)}</p>` : ''}
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 32px 28px; background-color: #0a0a0a;">
              ${bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 28px; border-top: 1px solid #1a1a1a; text-align: center; background-color: #0a0a0a;">
              <p style="color: #555555; font-size: 11px; margin: 0; line-height: 1.6;">
                ${footerText}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
