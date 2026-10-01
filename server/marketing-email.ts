import { db } from './db';
import { contacts, newsletterSubscriptions } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { isMarketingSuppressed } from './email-operations';
import { publicSiteOrigin, verifiedEmailToken } from './delivery-security';
import { escapeEmailHtml } from './scan-results-email';

export async function eligibleMarketingContacts() {
  const subscribed = await db.select({ contact: contacts }).from(contacts).innerJoin(newsletterSubscriptions,eq(contacts.id,newsletterSubscriptions.contactId));
  const unique = new Map(subscribed.map(row=>[row.contact.id,row.contact]));
  const allowed=[];
  for(const contact of Array.from(unique.values())) {
    if(contact.consentGiven === 'true' && !(await isMarketingSuppressed(contact.id))) allowed.push(contact);
  }
  return allowed;
}
export function marketingFooter(contactId:string): {html:string;headers:Record<string,string>} {
  const token=verifiedEmailToken(contactId,process.env.EMAIL_UNSUBSCRIBE_SECRET || '');
  const url=`${publicSiteOrigin(process.env.PUBLIC_SITE_URL)}/api/email/unsubscribe?contact=${encodeURIComponent(contactId)}&token=${token}`;
  return {html:`<p style="font-size:12px;line-height:1.6">You subscribed to Green Elephant updates. / Vous êtes inscrit·e aux actualités Green Elephant.<br><a href="${escapeEmailHtml(url)}">Unsubscribe / Se désinscrire</a></p>`,headers:{'List-Unsubscribe':`<${url}>`,'List-Unsubscribe-Post':'List-Unsubscribe=One-Click'}};
}
