import type { Express } from 'express';
import { verifyEmailToken } from './delivery-security';

export function registerEmailPreferenceRoutes(app: Express, dependencies: {
  secret(): string;
  withdraw(contactId: string): Promise<unknown>;
}) {
  // No analytics, third-party resources, redirects or token-bearing referrers.
  const headers = (res: import('express').Response) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Content-Security-Policy', "default-src 'none'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
  };
  app.get('/api/email/unsubscribe', (req, res) => {
    headers(res);
    const { contact, token } = req.query;
    if (!verifyEmailToken(contact, token, dependencies.secret())) {
      return res.status(400).type('text').send('Invalid unsubscribe link / Lien invalide');
    }
    // A mail scanner opening GET must not change the person's preference.
    res.type('html').send('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="robots" content="noindex"><title>Unsubscribe / Se désinscrire</title><body><h1>Stop marketing emails / Arrêter les e-mails marketing</h1><form method="post"><button type="submit">Confirm / Confirmer</button></form></body></html>');
  });
  app.post('/api/email/unsubscribe', async (req, res) => {
    headers(res);
    const { contact, token } = req.query;
    if (!verifyEmailToken(contact, token, dependencies.secret())) {
      return res.status(400).type('text').send('Invalid unsubscribe link / Lien invalide');
    }
    try {
      // Also supports List-Unsubscribe one-click POST, without a login requirement.
      await dependencies.withdraw(contact as string);
      res.type('text').send('Marketing emails stopped. Service emails are unchanged. / E-mails marketing arrêtés. Les e-mails liés à votre service restent actifs.');
    } catch {
      res.status(503).type('text').send('Please try again / Veuillez réessayer');
    }
  });
}
