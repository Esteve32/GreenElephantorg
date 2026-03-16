import { getUncachableResendClient } from './resend-client';
import { isConnectorEnabled } from './lib/connectorGuard';

interface EmailVerificationData {
  email: string;
  code: string;
}

export async function sendVerificationEmail(data: EmailVerificationData) {
  try {
    if (!(await isConnectorEnabled("resend"))) {
      console.log(`⏸️ Resend connector disabled — skipping verification email to ${data.email}`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();

    await client.emails.send({
      from: fromEmail,
      to: data.email,
      subject: "Your verification code — GreenElephant",
      html: brandedEmailWrapper(
        "Verify your email",
        "One step to complete your purchase",
        `
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 20px 0;">
          Use the code below to complete your purchase. It expires in 10 minutes.
        </p>
        <div style="background-color:#111111;border:2px solid #009999;border-radius:8px;padding:28px;margin:24px 0;text-align:center;">
          <span style="font-size:38px;font-weight:700;letter-spacing:12px;color:#009999;font-family:'Poppins',Arial,sans-serif;">
            ${data.code}
          </span>
        </div>
        <p style="color:#777777;font-size:13px;line-height:1.6;margin:0;">
          If you didn't request this, you can safely ignore this email.
        </p>
        `,
        "You received this because you initiated a purchase at GreenElephant.org. This is a one-time transactional email."
      ),
    });

    console.log(`✅ Verification email sent to: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send verification email to ${data.email}:`, error);
    return false;
  }
}

interface PurchaseNotificationData {
  customerEmail: string;
  customerName: string | null;
  packageName: string;
  packageId: string;
  amount: string;
  paymentIntentId: string;
  purchaseId: string;
}

interface SatellitescanPurchaseData {
  customerEmail: string;
  customerName: string | null;
  amount: string;
  paymentIntentId: string;
  purchaseId: string;
}

export async function sendPurchaseNotification(data: PurchaseNotificationData) {
  try {
    if (!(await isConnectorEnabled("resend"))) {
      console.log(`⏸️ Resend connector disabled — skipping purchase notification for ${data.customerEmail}`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    
    const adminEmails = ['esteve@greenelephant.org', 'anu@greenelephant.org'];
    const isInterviewMastery = data.packageId === 'interview-mastery';
    
    // Determine action items based on package
    let actionItemsHtml = '';
    let customerEmailHtml = '';
    
    if (isInterviewMastery) {
      actionItemsHtml = `
        <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">Interview Mastery Bundle - Action Required</h3>
          <ol style="line-height: 1.8;">
            <li>Customer has received automatic welcome email with Scan + Calendly links</li>
            <li>Monitor for Typeform completion within 3-4 days</li>
            <li>Prepare dashboard within 48-72 hours after scan completion</li>
            <li>First coaching session will be booked via Calendly</li>
          </ol>
        </div>
      `;
      
      // Send customer welcome email for Interview Mastery Bundle
      customerEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0a1628 0%, #1a6180 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to Interview Mastery!</h1>
            <p style="color: #87CEEB; margin-top: 10px; font-size: 16px;">Your bundle includes Satellite Scan + 3 Coaching Sessions</p>
          </div>
          
          <div style="padding: 30px;">
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Hi ${data.customerName || 'there'},
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Thank you for investing in your Interview Mastery journey! You're about to unlock powerful insights about your communication style and learn how to present your authentic self with confidence.
            </p>
            
            <div style="background-color: #dcfce7; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #16a34a;">
              <h2 style="margin-top: 0; color: #166534; font-size: 18px;">Step 1: Complete Your Satellite Scan</h2>
              <p style="color: #15803d; line-height: 1.6;">
                Start with the 90-minute diagnostic to map your unique communication patterns. This data will power your personalized coaching sessions.
              </p>
              <div style="text-align: center; margin-top: 15px;">
                <a href="https://greenelephantorg.typeform.com/individualscan" style="display: inline-block; background-color: #16a34a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Start Your Satellite Scan</a>
              </div>
            </div>
            
            <div style="background-color: #dbeafe; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2563eb;">
              <h2 style="margin-top: 0; color: #1e40af; font-size: 18px;">Step 2: Book Your First Coaching Session</h2>
              <p style="color: #1e3a8a; line-height: 1.6;">
                Schedule your first 1-hour coaching session. We recommend completing the Satellite Scan first, but you can book now to secure your preferred time.
              </p>
              <div style="text-align: center; margin-top: 15px;">
                <a href="https://calendly.com/greenelephant/3-session-interview-mastery" style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Book Coaching Session</a>
              </div>
            </div>
            
            <div style="background-color: #f3f4f6; padding: 25px; border-radius: 8px; margin: 25px 0;">
              <h2 style="margin-top: 0; color: #1f2937; font-size: 18px;">What's Included in Your Bundle</h2>
              <ul style="line-height: 1.8; margin: 0; padding-left: 20px; color: #374151;">
                <li><strong>Full Satellite Scan:</strong> 90-question diagnostic mapping your communication patterns</li>
                <li><strong>3 x 1-Hour Coaching Sessions:</strong> Personalized interview preparation</li>
                <li><strong>Interview Communication Analysis:</strong> Data-driven insights for interviews</li>
                <li><strong>Mock Interview:</strong> Practice with real-time feedback</li>
                <li><strong>Post-Interview Debrief:</strong> Celebrate wins and refine your approach</li>
              </ul>
            </div>
            
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <h3 style="margin-top: 0; color: #92400e; font-size: 16px;">Dashboard Timeline</h3>
              <p style="margin-bottom: 0; color: #78350f; line-height: 1.6;">
                After completing your Satellite Scan, please allow <strong>48-72 hours</strong> for us to review your responses and build your personalized visual map.
              </p>
            </div>
            
            <p style="color: #374151; line-height: 1.6;">
              Questions? Just reply to this email—we're here to help you succeed.
            </p>
            
            <p style="color: #374151; margin-top: 25px;">
              Ready to ace your next interview,<br>
              <strong>Esteve from GreenElephant</strong>
            </p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              You're receiving this because you purchased the Interview Mastery Bundle at GreenElephant.org.
            </p>
          </div>
        </div>
      `;
      
      await client.emails.send({
        from: fromEmail,
        to: data.customerEmail,
        subject: `Welcome to Interview Mastery - Start Your Scan + Book Coaching 🎯`,
        html: customerEmailHtml,
      });
      
      console.log('✅ Interview Mastery welcome email sent to:', data.customerEmail);
    } else {
      actionItemsHtml = `
        <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">Action Required</h3>
          <ol style="line-height: 1.8;">
            <li>Email the customer at <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></li>
            <li>Welcome them to the program</li>
            <li>Include the Typeform scan link: <a href="https://greenelephantorg.typeform.com/individualscan">Start Satellite Scan</a></li>
            <li>Provide any onboarding materials</li>
          </ol>
        </div>
      `;
    }
    
    // Send notification to admins
    await client.emails.send({
      from: fromEmail,
      to: adminEmails,
      subject: `New Purchase: ${data.packageName} - €${data.amount}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Purchase Received!</h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Customer Details</h3>
            <p><strong>Name:</strong> ${data.customerName || 'Not provided'}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Purchase Details</h3>
            <p><strong>Package:</strong> ${data.packageName}</p>
            <p><strong>Package ID:</strong> ${data.packageId}</p>
            <p><strong>Amount:</strong> €${data.amount}</p>
            <p><strong>Payment ID:</strong> ${data.paymentIntentId}</p>
            <p><strong>Purchase ID:</strong> ${data.purchaseId}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          ${actionItemsHtml}
          
          <p style="color: #6b7280; font-size: 14px;">
            This notification was automatically sent from GreenElephant.org
          </p>
        </div>
      `,
    });
    
    console.log('✅ Purchase notification email sent to:', adminEmails.join(', '));
    return true;
  } catch (error) {
    console.error('❌ Failed to send purchase notification email:', error);
    return false;
  }
}

export async function sendSatellitescanPurchaseEmail(data: SatellitescanPurchaseData) {
  // CRITICAL: Validate customer email before attempting to send
  if (!data.customerEmail || !data.customerEmail.includes('@')) {
    console.error('❌ CRITICAL: sendSatellitescanPurchaseEmail called with invalid/empty customerEmail:', data.customerEmail);
    console.error('❌ Purchase data:', JSON.stringify(data, null, 2));
    return false;
  }
  if (!(await isConnectorEnabled("resend"))) {
    console.log(`⏸️ Resend connector disabled — skipping Satellitescan purchase emails for ${data.customerEmail}`);
    return false;
  }
  
  console.log('📧 Attempting to send Satellitescan purchase emails...');
  console.log('📧 Customer email:', data.customerEmail);
  console.log('📧 Customer name:', data.customerName || 'Not provided');
  
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    console.log('📧 Resend client obtained, from email:', fromEmail);
    
    const adminEmail = 'esteve@greenelephant.org';
    
    // Send notification to admin
    await client.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `🎯 New Satellitescan Purchase - €${data.amount}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Satellitescan Beta Purchase! 🚀</h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Customer Details</h3>
            <p><strong>Name:</strong> ${data.customerName || 'Not provided'}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Purchase Details</h3>
            <p><strong>Product:</strong> Satellitescan Beta</p>
            <p><strong>Amount:</strong> €${data.amount}</p>
            <p><strong>Payment ID:</strong> ${data.paymentIntentId}</p>
            <p><strong>Purchase ID:</strong> ${data.purchaseId}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">⚡ Action Required</h3>
            <ol style="line-height: 1.8;">
              <li><strong>Dashboard timeline:</strong> Create their personalized dashboard within 48-72 hours after they complete the scan</li>
              <li><strong>Follow-up:</strong> Set reminder to check if they completed the Typeform in 3-4 days</li>
            </ol>
          </div>
          
          <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #166534;">✅ Customer Resources (Sent Automatically)</h3>
            <ul style="line-height: 1.8;">
              <li><strong>Typeform Scan:</strong> <a href="https://greenelephantorg.typeform.com/individualscan">https://greenelephantorg.typeform.com/individualscan</a></li>
              <li><strong>Prompt Library:</strong> <a href="https://greenelephant.org/resources">Access Prompts</a></li>
              <li><strong>Video Tutorials (YouTube):</strong> <a href="https://www.youtube.com/playlist?list=PLYvfWnYASrYcADsrLB75TRKtcYx7BUdxB">Watch Tutorials</a></li>
            </ul>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            This notification was automatically sent from GreenElephant.org
          </p>
        </div>
      `,
    });
    
    // Send confirmation email to customer
    await client.emails.send({
      from: fromEmail,
      to: data.customerEmail,
      subject: "Your Satellite Scan is confirmed — begin when you're ready",
      html: brandedEmailWrapper(
        "Satellite Scan confirmed",
        "Your 90-minute communication diagnostic is ready",
        `
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
          Hi ${data.customerName?.split(' ')[0] || 'there'},
        </p>
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 24px 0;">
          Thank you for your purchase. You're about to map your communication patterns across 8 research-backed lenses. Set aside 90 uninterrupted minutes and start when you feel focused.
        </p>
        <div style="text-align:center;margin:0 0 28px 0;">
          <a href="https://greenelephantorg.typeform.com/individualscan" style="display:inline-block;background-color:#009999;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:6px;font-family:'Poppins',Arial,sans-serif;font-weight:600;font-size:15px;">
            Begin Your Satellite Scan
          </a>
        </div>
        <div style="background-color:#111111;padding:22px;border-radius:8px;margin:0 0 20px 0;border-left:3px solid #009999;">
          <h3 style="font-family:'Poppins',Arial,sans-serif;margin-top:0;color:#009999;font-size:15px;font-weight:600;">Dashboard timeline</h3>
          <p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0;">
            Your personalized dashboard is built by our coaches — not automated. After you complete the scan, allow <strong style="color:#e0e0e0;">48–72 hours</strong> for delivery.
          </p>
        </div>
        <div style="background-color:#111111;padding:22px;border-radius:8px;margin:0 0 20px 0;">
          <h3 style="font-family:'Poppins',Arial,sans-serif;margin-top:0;color:#e0e0e0;font-size:15px;font-weight:600;">Explore while you wait</h3>
          <ul style="color:#cccccc;font-size:14px;line-height:2;margin:0;padding-left:18px;">
            <li><a href="https://greenelephant.org/resources" style="color:#009999;text-decoration:none;">Communication Prompt Library</a> — 40+ AI-ready prompts</li>
            <li><a href="https://greenelephant.org/periodic-table" style="color:#009999;text-decoration:none;">Periodic Table of Conscious Communication</a></li>
            <li><a href="https://www.youtube.com/playlist?list=PLYvfWnYASrYcADsrLB75TRKtcYx7BUdxB" style="color:#009999;text-decoration:none;">Video Tutorials on YouTube</a></li>
          </ul>
        </div>
        <p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0;">
          Questions? Reply to this email and we'll get back to you.<br><br>
          <strong style="color:#e0e0e0;">Esteve from GreenElephant</strong>
        </p>
        `,
        "You received this because you purchased Satellite Scan at GreenElephant.org. This is a transactional confirmation email sent under legitimate interest."
      ),
    });
    
    console.log('✅ Satellitescan purchase notification email sent to admin:', adminEmail);
    console.log('✅ Satellitescan welcome email sent to customer:', data.customerEmail);
    console.log('✅ Both Satellitescan emails sent successfully');
    return true;
  } catch (error: any) {
    console.error('❌ CRITICAL: Failed to send satellitescan purchase email');
    console.error('❌ Error details:', error?.message || error);
    console.error('❌ Customer email was:', data.customerEmail);
    console.error('❌ Full error:', JSON.stringify(error, null, 2));
    return false;
  }
}

export async function sendSatellitescanReminderEmail(customerEmail: string, customerName: string | null) {
  try {
    if (!(await isConnectorEnabled("resend"))) { console.log(`⏸️ Resend disabled — skipping reminder for ${customerEmail}`); return false; }
    const { client, fromEmail } = await getUncachableResendClient();
    const firstName = customerName?.split(' ')[0] || 'there';

    await client.emails.send({
      from: fromEmail,
      to: customerEmail,
      subject: "Your Satellite Scan is still waiting for you",
      html: brandedEmailWrapper(
        "Your scan is waiting",
        "Pick it up whenever you're ready",
        `
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
          Hi ${firstName},
        </p>
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 24px 0;">
          We noticed you haven't completed your Satellite Scan yet. No pressure — we just wanted to make sure the link didn't get buried.
        </p>
        <div style="text-align:center;margin:0 0 28px 0;">
          <a href="https://greenelephantorg.typeform.com/individualscan" style="display:inline-block;background-color:#009999;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:6px;font-family:'Poppins',Arial,sans-serif;font-weight:600;font-size:15px;">
            Complete Your Satellite Scan
          </a>
        </div>
        <div style="background-color:#111111;padding:22px;border-radius:8px;margin:0 0 20px 0;border-left:3px solid #009999;">
          <h3 style="font-family:'Poppins',Arial,sans-serif;margin-top:0;color:#009999;font-size:15px;font-weight:600;">A few things to remember</h3>
          <ul style="color:#cccccc;font-size:14px;line-height:2;margin:0;padding-left:18px;">
            <li>90 minutes of focused, uninterrupted time</li>
            <li>Best done in one sitting</li>
            <li>Your personalized dashboard is delivered within 48–72 hours of completion</li>
          </ul>
        </div>
        <p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0;">
          Have a question before you start? Just reply here.<br><br>
          <strong style="color:#e0e0e0;">Esteve from GreenElephant</strong>
        </p>
        `,
        "You received this because you purchased Satellite Scan at GreenElephant.org. To unsubscribe from reminders, reply with the word STOP."
      ),
    });

    console.log(`✅ Reminder email sent to: ${customerEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send reminder email to ${customerEmail}:`, error);
    return false;
  }
}

interface WebinarWaitlistData {
  customerEmail: string;
  customerName: string | null;
  preferredLens?: string;
}

export async function sendWebinarWaitlistConfirmation(data: WebinarWaitlistData) {
  try {
    if (!(await isConnectorEnabled("resend"))) { console.log(`⏸️ Resend disabled — skipping sendWebinarWaitlistConfirmation`); return false; }
    const { client, fromEmail } = await getUncachableResendClient();
    
    const adminEmail = 'esteve@greenelephant.org';
    const lensName = data.preferredLens ? data.preferredLens.charAt(0).toUpperCase() + data.preferredLens.slice(1) : 'All lenses';
    
    await client.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `Play Labs Waitlist: New Signup`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Play Labs Waitlist Signup</h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${data.customerName || 'Not provided'}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></p>
            <p><strong>Preferred Lens:</strong> ${lensName}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            This notification was automatically sent from GreenElephant.org Calendar & Play Labs page.
          </p>
        </div>
      `,
    });
    
    await client.emails.send({
      from: fromEmail,
      to: data.customerEmail,
      subject: "You're on the Monthly Lens Webinar list",
      html: brandedEmailWrapper(
        "You're on the list",
        "Monthly Lens Webinars — one lens, one hour, real conversations",
        `
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
          Hi ${data.customerName?.split(' ')[0] || 'there'},
        </p>
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 24px 0;">
          Thank you for joining the waitlist. Each month we go deep on one lens from the Periodic Table of Conscious Communication — live theory, live practice, and live Q&A. You'll hear from us as soon as the next session is scheduled.
        </p>
        <div style="background-color:#111111;padding:22px;border-radius:8px;margin:0 0 20px 0;border-left:3px solid #009999;">
          <h3 style="font-family:'Poppins',Arial,sans-serif;margin-top:0;color:#009999;font-size:15px;font-weight:600;">What to expect</h3>
          <ul style="color:#cccccc;font-size:14px;line-height:2;margin:0;padding-left:18px;">
            <li>Monthly sessions, each focused on one of the 8 communication lenses</li>
            <li>Live interaction — mic and camera open for Satellite Scan holders</li>
            <li>Chat access for all guests, free of charge</li>
            <li>Replay link sent after each session</li>
          </ul>
        </div>
        <div style="background-color:#111111;padding:22px;border-radius:8px;margin:0 0 24px 0;">
          <h3 style="font-family:'Poppins',Arial,sans-serif;margin-top:0;color:#e0e0e0;font-size:15px;font-weight:600;">Explore in the meantime</h3>
          <ul style="color:#cccccc;font-size:14px;line-height:2;margin:0;padding-left:18px;">
            <li><a href="https://greenelephant.org/periodic-table" style="color:#009999;text-decoration:none;">Periodic Table of Conscious Communication</a></li>
            <li><a href="https://greenelephant.org/resources" style="color:#009999;text-decoration:none;">Prompt Library — 40 AI-ready prompts</a></li>
            <li><a href="https://greenelephant.org/scan" style="color:#009999;text-decoration:none;">Satellite Scan — map your communication patterns</a></li>
          </ul>
        </div>
        <p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0;">
          Looking forward to exploring this with you,<br><br>
          <strong style="color:#e0e0e0;">Esteve from GreenElephant</strong>
        </p>
        `,
        "You received this because you signed up for the Monthly Lens Webinar waitlist at GreenElephant.org. To unsubscribe, reply with the word UNSUBSCRIBE."
      ),
    });
    
    console.log('✅ Webinar waitlist confirmation sent to:', data.customerEmail);
    return true;
  } catch (error) {
    console.error('❌ Failed to send webinar waitlist confirmation:', error);
    return false;
  }
}

interface TypeformScanData {
  customerEmail: string;
  customerName: string | null;
  formattedSummary: {
    firstName?: string;
    lastName?: string;
    role?: string;
    jobTitle?: string;
    country?: string;
    education?: string;
    gender?: string;
    birthYear?: string;
    experience?: string;
    communicationSituations?: string;
  };
  rawData: Record<string, string>;
  submittedAt: string;
}

export async function sendTypeformScanCompletionEmail(data: TypeformScanData) {
  try {
    if (!(await isConnectorEnabled("resend"))) { console.log(`⏸️ Resend disabled — skipping sendTypeformScanCompletionEmail`); return false; }
    const { client, fromEmail } = await getUncachableResendClient();
    
    const adminEmails = ['esteve@greenelephant.org', 'anu@greenelephant.org'];
    const firstName = data.formattedSummary.firstName || 'Explorer';
    
    // Build raw data table rows
    const rawDataRows = Object.entries(data.rawData)
      .filter(([_, value]) => value && value.trim() !== '')
      .map(([question, answer]) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top; font-weight: 500; color: #374151; width: 40%;">${question}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top; color: #1f2937;">${answer}</td>
        </tr>
      `).join('');
    
    // Build formatted summary section
    const summaryItems = [];
    if (data.formattedSummary.role) summaryItems.push(`<strong>Role:</strong> ${data.formattedSummary.role}`);
    if (data.formattedSummary.jobTitle) summaryItems.push(`<strong>Job Title:</strong> ${data.formattedSummary.jobTitle}`);
    if (data.formattedSummary.country) summaryItems.push(`<strong>Country:</strong> ${data.formattedSummary.country}`);
    if (data.formattedSummary.education) summaryItems.push(`<strong>Education:</strong> ${data.formattedSummary.education}`);
    if (data.formattedSummary.experience) summaryItems.push(`<strong>Experience:</strong> ${data.formattedSummary.experience}`);
    
    const summaryHtml = summaryItems.length > 0 
      ? `<ul style="line-height: 1.8; margin: 0; padding-left: 20px;">${summaryItems.map(item => `<li>${item}</li>`).join('')}</ul>`
      : '<p style="color: #6b7280;">Summary data not available</p>';
    
    // Communication situations
    const situationsHtml = data.formattedSummary.communicationSituations 
      ? `<p style="line-height: 1.6; color: #1f2937;">${data.formattedSummary.communicationSituations}</p>`
      : '';

    // Customer email content
    const customerEmailHtml = brandedEmailWrapper(
      `Scan complete, ${firstName}`,
      "Your responses are in — your dashboard is being built",
      `
      <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 20px 0;">
        Congratulations on completing your 90-minute Satellite Scan. Your responses are safely stored and your coaches are reviewing them now.
      </p>
      <div style="background-color:#111111;padding:22px;border-radius:8px;margin:0 0 20px 0;border-left:3px solid #009999;">
        <h3 style="font-family:'Poppins',Arial,sans-serif;margin-top:0;color:#009999;font-size:15px;font-weight:600;">What happens next</h3>
        <p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0;">
          Your personalized dashboard is built by hand — not automated. Each response is reviewed carefully to create a visual map of your communication patterns. Allow <strong style="color:#e0e0e0;">48–72 hours</strong> for delivery.
        </p>
      </div>
      <div style="background-color:#111111;padding:22px;border-radius:8px;margin:0 0 20px 0;border-left:3px solid #009999;">
        <h3 style="font-family:'Poppins',Arial,sans-serif;margin-top:0;color:#009999;font-size:15px;font-weight:600;">Use your data now — don't wait</h3>
        <p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0 0 16px 0;">
          Your scan data is already valuable. Copy your responses from the table below and paste them into any of the 40+ prompts in our library for instant insights.
        </p>
        <ol style="color:#cccccc;font-size:14px;line-height:2;margin:0;padding-left:18px;">
          <li>Scroll down and copy your full scan data from the table</li>
          <li>Go to the Resources page and pick a prompt</li>
          <li>Paste into our GPT assistant for immediate analysis</li>
        </ol>
        <div style="text-align:center;margin:20px 0 0 0;">
          <a href="https://greenelephant.org/resources" style="display:inline-block;background-color:#009999;color:#ffffff;padding:14px 28px;text-decoration:none;border-radius:6px;font-family:'Poppins',Arial,sans-serif;font-weight:600;font-size:15px;">
            Go to Resources &amp; Prompts
          </a>
        </div>
      </div>
      ${summaryHtml ? `
      <div style="background-color:#111111;padding:22px;border-radius:8px;margin:0 0 20px 0;">
        <h3 style="font-family:'Poppins',Arial,sans-serif;margin-top:0;color:#e0e0e0;font-size:15px;font-weight:600;">Your quick summary</h3>
        <div style="color:#cccccc;font-size:14px;line-height:1.8;">${summaryHtml}</div>
        ${situationsHtml ? `<div style="margin-top:14px;padding-top:14px;border-top:1px solid #222;"><strong style="color:#009999;">Communication focus areas:</strong>${situationsHtml}</div>` : ''}
      </div>
      ` : ''}
      <div style="margin:0 0 24px 0;">
        <h3 style="font-family:'Poppins',Arial,sans-serif;color:#e0e0e0;font-size:15px;font-weight:600;margin:0 0 8px 0;">Your complete scan data</h3>
        <p style="color:#777777;font-size:13px;margin:0 0 14px 0;">Copy and paste this into any prompt or AI assistant to start discovering patterns.</p>
        <div style="border:1px solid #1a1a1a;border-radius:8px;overflow:hidden;">
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <thead>
              <tr style="background-color:#0f1f2e;">
                <th style="padding:12px;text-align:left;color:#009999;font-weight:600;width:40%;">Question</th>
                <th style="padding:12px;text-align:left;color:#009999;font-weight:600;">Your response</th>
              </tr>
            </thead>
            <tbody>
              ${rawDataRows.replace(/style="padding: 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top; font-weight: 500; color: #374151; width: 40%;"/g, 'style="padding:10px;border-bottom:1px solid #1a1a1a;vertical-align:top;font-weight:500;color:#cccccc;width:40%;"').replace(/style="padding: 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top; color: #1f2937;"/g, 'style="padding:10px;border-bottom:1px solid #1a1a1a;vertical-align:top;color:#e0e0e0;"')}
            </tbody>
          </table>
        </div>
      </div>
      <div style="background-color:#111111;padding:18px;border-radius:8px;margin:0 0 24px 0;">
        <p style="color:#cccccc;font-size:13px;margin:0;">
          For best results, use our <a href="https://chatgpt.com/g/g-bUJ6dvAHK-conscious-communicator" style="color:#009999;text-decoration:none;">Conscious Communicator GPT</a> when exploring your data with prompts from our library.
        </p>
      </div>
      <p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0;">
        Questions about your data? Just reply here.<br><br>
        <strong style="color:#e0e0e0;">Esteve from GreenElephant</strong><br>
        <span style="color:#777777;font-size:12px;">Submitted: ${data.submittedAt}</span>
      </p>
      `,
      "You received this because you completed the Satellite Scan at GreenElephant.org. This is a transactional email sent under legitimate interest."
    );

    // Send to customer
    await client.emails.send({
      from: fromEmail,
      to: data.customerEmail,
      cc: adminEmails,
      subject: `Your Satellite Scan Data is Ready, ${firstName}!`,
      html: customerEmailHtml,
    });
    
    console.log('✅ Typeform scan completion email sent to:', data.customerEmail);
    console.log('✅ CC sent to admins:', adminEmails.join(', '));
    return true;
  } catch (error) {
    console.error('❌ Failed to send Typeform scan completion email:', error);
    return false;
  }
}

// Onboarding email automation - Fibonacci sequence emails
interface OnboardingEmailData {
  customerEmail: string;
  customerName: string | null;
  subject: string;
  body: string; // HTML body from template
  sequenceNumber: string;
}

export async function sendOnboardingEmail(data: OnboardingEmailData): Promise<boolean> {
  try {
    if (!(await isConnectorEnabled("resend"))) { console.log(`⏸️ Resend disabled — skipping sendOnboardingEmail`); return false; }
    const { client, fromEmail } = await getUncachableResendClient();
    
    const firstName = data.customerName?.split(' ')[0] || 'Explorer';
    
    // Replace template variables in body
    const personalizedBody = data.body
      .replace(/\{\{firstName\}\}/g, firstName)
      .replace(/\{\{customerName\}\}/g, data.customerName || 'Explorer')
      .replace(/\{\{email\}\}/g, data.customerEmail);
    
    const personalizedSubject = data.subject
      .replace(/\{\{firstName\}\}/g, firstName)
      .replace(/\{\{customerName\}\}/g, data.customerName || 'Explorer');
    
    // Wrap in branded dark HUD template
    const emailHtml = brandedEmailWrapper(
      "GreenElephant",
      "Conscious Communication",
      `<div style="color:#cccccc;font-size:15px;line-height:1.7;">${personalizedBody}</div>`,
      `You're receiving this as part of your Satellite Scan onboarding journey (email ${data.sequenceNumber} of 12). To unsubscribe, reply with the word UNSUBSCRIBE.`
    );
    
    await client.emails.send({
      from: fromEmail,
      to: data.customerEmail,
      subject: personalizedSubject,
      html: emailHtml,
    });
    
    console.log(`✅ Onboarding email #${data.sequenceNumber} sent to: ${data.customerEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send onboarding email #${data.sequenceNumber} to ${data.customerEmail}:`, error);
    return false;
  }
}

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
              <h1 style="font-family: 'Poppins', Arial, sans-serif; color: #ffffff; margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -0.5px;">${title}</h1>
              ${subtitle ? `<p style="color: #009999; margin-top: 8px; margin-bottom: 0; font-size: 15px; font-weight: 500;">${subtitle}</p>` : ''}
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

function tealButton(text: string, href: string): string {
  return `<a href="${href}" style="display: inline-block; background-color: #009999; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; letter-spacing: 0.3px;">${text}</a>`;
}

function darkCard(content: string, borderColor?: string): string {
  const border = borderColor ? `border-left: 3px solid ${borderColor};` : '';
  return `<div style="background-color: #111111; padding: 22px; border-radius: 8px; margin: 20px 0; ${border}">${content}</div>`;
}

interface NewsletterConfirmationData {
  email: string;
  name: string | null;
}

export async function sendNewsletterConfirmationEmail(data: NewsletterConfirmationData) {
  try {
    if (!(await isConnectorEnabled("resend"))) { console.log(`⏸️ Resend disabled — skipping sendNewsletterConfirmationEmail`); return false; }
    const { client, fromEmail } = await getUncachableResendClient();

    const body = `
      <p style="font-size: 16px; line-height: 1.7; color: #e0e0e0;">
        Hi ${data.name || 'there'},
      </p>
      <p style="font-size: 16px; line-height: 1.7; color: #cccccc;">
        Thank you for subscribing to the GreenElephant newsletter. You'll receive insights on conscious communication, updates on upcoming retreats and Play Labs sessions, and practical tools for transforming how you connect with others.
      </p>
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #009999; font-size: 16px; font-weight: 600;">What You'll Receive</h3>
        <ul style="line-height: 2; margin-bottom: 0; color: #cccccc; padding-left: 18px;">
          <li>Research-backed communication insights</li>
          <li>Early access to retreats and events</li>
          <li>New prompts and resources from our library</li>
          <li>Updates on the Periodic Table of Conscious Communication</li>
        </ul>
      `, '#009999')}
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #e0e0e0; font-size: 16px; font-weight: 600;">Explore While You're Here</h3>
        <ul style="line-height: 2; padding-left: 18px;">
          <li><a href="https://greenelephant.org/periodic-table" style="color: #009999; text-decoration: none;">The Periodic Table of Conscious Communication</a></li>
          <li><a href="https://greenelephant.org/resources" style="color: #009999; text-decoration: none;">Communication Prompts & Resources</a></li>
          <li><a href="https://greenelephant.org/scan" style="color: #009999; text-decoration: none;">Satellite Scan - Map Your Patterns</a></li>
        </ul>
      `)}
      <p style="color: #cccccc; line-height: 1.7;">
        Looking forward to sharing this journey with you,<br>
        <strong style="color: #e0e0e0;">Esteve from GreenElephant</strong>
      </p>
    `;

    await client.emails.send({
      from: fromEmail,
      to: data.email,
      subject: "Welcome to the GreenElephant Newsletter",
      html: brandedEmailWrapper(
        'Welcome to the Community',
        'Conscious Communication Insights',
        body,
        'You\'re receiving this because you subscribed to the GreenElephant newsletter at greenelephant.org.<br/>To unsubscribe, simply reply to this email with "unsubscribe".'
      ),
    });

    console.log(`✅ Newsletter confirmation email sent to: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send newsletter confirmation email to ${data.email}:`, error);
    return false;
  }
}

interface ScanInterestConfirmationData {
  email: string;
  name: string | null;
}

export async function sendScanInterestConfirmationEmail(data: ScanInterestConfirmationData) {
  try {
    if (!(await isConnectorEnabled("resend"))) { console.log(`⏸️ Resend disabled — skipping sendScanInterestConfirmationEmail`); return false; }
    const { client, fromEmail } = await getUncachableResendClient();

    const body = `
      <p style="font-size: 16px; line-height: 1.7; color: #e0e0e0;">
        Hi ${data.name || 'there'},
      </p>
      <p style="font-size: 16px; line-height: 1.7; color: #cccccc;">
        Thank you for your interest in the Satellite Scan. Here's a free tool to start exploring your communication patterns right away.
      </p>
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #009999; font-size: 16px; font-weight: 600;">Check Your Communication Flow &mdash; Free</h3>
        <p style="color: #cccccc; font-size: 14px; line-height: 1.6;">
          The Flow Check measures your motivation, perceived challenge, and perceived competence in a specific communication situation. Based on Csikszentmihalyi's flow model, it maps you into one of 4 zones: Flow, Challenge, Comfort, or Danger.
        </p>
        <p style="color: #999999; font-size: 14px; line-height: 1.6;">
          It takes about 2 minutes and gives you a personalized interpretation of your results with actionable insights.
        </p>
        <div style="text-align: center; margin-top: 16px;">
          ${tealButton('Take the Free Flow Check', 'https://greenelephant.org/flow-check')}
        </div>
      `, '#009999')}
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #e0e0e0; font-size: 16px; font-weight: 600;">Go Deeper with the Full Satellite Scan</h3>
        <p style="color: #cccccc; font-size: 14px; line-height: 1.6;">
          The Flow Check measures 1 of 8 lenses. The full Satellite Scan maps your patterns across all 8 communication lenses with 129 questions, delivering a personalized dashboard and access to our complete prompt library.
        </p>
        <div style="text-align: center; margin-top: 16px;">
          ${tealButton('Get Your Full Scan &mdash; &euro;99.95', 'https://greenelephant.org/checkout?product=satellitescan')}
        </div>
      `)}
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #e0e0e0; font-size: 16px; font-weight: 600;">Or Try the Free Signals Quiz</h3>
        <p style="color: #cccccc; font-size: 14px; line-height: 1.6;">
          Get a quick snapshot of your communication style in just 6 questions with our free Signals Quiz.
        </p>
        <div style="text-align: center; margin-top: 16px;">
          <a href="https://greenelephant.org/signals" style="display: inline-block; color: #009999; padding: 12px 24px; text-decoration: none; border: 1px solid #009999; border-radius: 6px; font-weight: 600; font-size: 14px;">Take the Free Quiz</a>
        </div>
      `)}
      <p style="color: #cccccc; line-height: 1.7;">
        Looking forward to supporting your communication journey,<br>
        <strong style="color: #e0e0e0;">Esteve from GreenElephant</strong>
      </p>
    `;

    await client.emails.send({
      from: fromEmail,
      to: data.email,
      subject: "Check Your Communication Flow - Free Assessment from GreenElephant",
      html: brandedEmailWrapper(
        'Your Communication Flow Check',
        'Discover Which Zone You\'re In',
        body,
        'You\'re receiving this because you signed up for communication insights at greenelephant.org.<br/>To unsubscribe, simply reply to this email with "unsubscribe".'
      ),
    });

    console.log(`✅ Scan interest confirmation email sent to: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send scan interest confirmation email to ${data.email}:`, error);
    return false;
  }
}

export async function sendScanInterestAdminNotification(data: { email: string; name: string | null }) {
  try {
    if (!(await isConnectorEnabled("resend"))) { console.log(`⏸️ Resend disabled — skipping sendScanInterestAdminNotification`); return false; }
    const { client, fromEmail } = await getUncachableResendClient();
    const adminEmail = 'esteve@greenelephant.org';

    await client.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `New Scan Interest Lead: ${data.email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Scan Interest Lead</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${data.name || 'Not provided'}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Source:</strong> Scan page lead magnet (Flow Check + updates)</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Next Steps</h3>
            <ul style="line-height: 1.8;">
              <li>Contact has been synced to Notion CRM with "Scan Interest" channel</li>
              <li>They received a link to the free Flow Check and communication insights</li>
              <li>Consider a personal follow-up in 3-5 days if no purchase</li>
            </ul>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This notification was automatically sent from GreenElephant.org Scan page.</p>
        </div>
      `,
    });

    console.log(`✅ Scan interest admin notification sent for: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send scan interest admin notification:`, error);
    return false;
  }
}

interface WaitlistConfirmationData {
  email: string;
  name: string | null;
  retreatType: string;
  motivation: string;
}

export async function sendWaitlistConfirmationEmail(data: WaitlistConfirmationData) {
  try {
    if (!(await isConnectorEnabled("resend"))) { console.log(`⏸️ Resend disabled — skipping sendWaitlistConfirmationEmail`); return false; }
    const { client, fromEmail } = await getUncachableResendClient();

    const adminEmail = 'esteve@greenelephant.org';
    const retreatName = data.retreatType === 'provence' ? 'Equinoxe Provence' : data.retreatType === 'lapland' ? 'Equinoxe Lapland' : data.retreatType || 'Equinoxe Retreat';

    await client.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `Retreat Waitlist: New Signup - ${retreatName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Retreat Waitlist Signup</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${data.name || 'Not provided'}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Retreat:</strong> ${retreatName}</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Motivation</h3>
            <p style="color: #374151; line-height: 1.6;">${data.motivation}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This notification was automatically sent from GreenElephant.org Retreats page.</p>
        </div>
      `,
    });

    const customerBody = `
      <p style="font-size: 16px; line-height: 1.7; color: #e0e0e0;">
        Hi ${data.name || 'there'},
      </p>
      <p style="font-size: 16px; line-height: 1.7; color: #cccccc;">
        Thank you for your interest in the ${retreatName} retreat. We've received your application and you're now on the waitlist.
      </p>
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #009999; font-size: 16px; font-weight: 600;">What Happens Next</h3>
        <ul style="line-height: 2; margin-bottom: 0; color: #cccccc; padding-left: 18px;">
          <li>We review every application personally</li>
          <li>When spots open up, we'll contact you directly</li>
          <li>You'll receive details about dates, location, and what to expect</li>
        </ul>
      `, '#009999')}
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #e0e0e0; font-size: 16px; font-weight: 600;">Explore While You Wait</h3>
        <ul style="line-height: 2; padding-left: 18px;">
          <li><a href="https://greenelephant.org/periodic-table" style="color: #009999; text-decoration: none;">The Periodic Table of Conscious Communication</a></li>
          <li><a href="https://greenelephant.org/resources" style="color: #009999; text-decoration: none;">Communication Prompts & Resources</a></li>
          <li><a href="https://greenelephant.org/scan" style="color: #009999; text-decoration: none;">Try the Satellite Scan</a></li>
        </ul>
      `)}
      <p style="color: #cccccc; line-height: 1.7;">
        We're excited about your interest in conscious communication,<br>
        <strong style="color: #e0e0e0;">Esteve from GreenElephant</strong>
      </p>
    `;

    await client.emails.send({
      from: fromEmail,
      to: data.email,
      subject: `You're on the ${retreatName} Waitlist`,
      html: brandedEmailWrapper(
        "You're on the Waitlist",
        retreatName,
        customerBody,
        'You\'re receiving this because you joined the retreat waitlist at GreenElephant.org.<br/>To unsubscribe, simply reply to this email with "unsubscribe".'
      ),
    });

    console.log(`✅ Waitlist confirmation emails sent for: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send waitlist confirmation email to ${data.email}:`, error);
    return false;
  }
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  intent: string;
}

export async function sendContactFormEmails(data: ContactFormData) {
  try {
    if (!(await isConnectorEnabled("resend"))) { console.log(`⏸️ Resend disabled — skipping sendContactFormEmails`); return false; }
    const { client, fromEmail } = await getUncachableResendClient();

    const adminEmail = 'esteve@greenelephant.org';
    const intentLabels: Record<string, string> = {
      coaching: 'EA Coaching',
      interview: 'Interview Coaching',
      consulting: 'Consulting',
      general: 'General Inquiry',
    };
    const intentLabel = intentLabels[data.intent] || data.intent || 'General Inquiry';

    await client.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `New Contact Form: ${intentLabel} - ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Intent:</strong> ${intentLabel}</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Message</h3>
            <p style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
          </div>
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Action Required</h3>
            <p style="margin-bottom: 0; color: #1e3a8a;">Reply to <a href="mailto:${data.email}">${data.email}</a> within 24 hours.</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This notification was automatically sent from GreenElephant.org Contact page.</p>
        </div>
      `,
    });

    const customerBody = `
      <p style="font-size: 16px; line-height: 1.7; color: #e0e0e0;">
        Hi ${data.name},
      </p>
      <p style="font-size: 16px; line-height: 1.7; color: #cccccc;">
        Thank you for reaching out. We've received your message and will respond personally within 24 hours.
      </p>
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #888888; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Your Message</h3>
        <p style="color: #999999; line-height: 1.7; white-space: pre-wrap; font-style: italic; margin-bottom: 0;">${data.message}</p>
      `)}
      <p style="font-size: 16px; line-height: 1.7; color: #cccccc;">
        In the meantime, feel free to explore:
      </p>
      <ul style="line-height: 2; padding-left: 18px;">
        <li><a href="https://greenelephant.org/periodic-table" style="color: #009999; text-decoration: none;">The Periodic Table of Conscious Communication</a></li>
        <li><a href="https://greenelephant.org/resources" style="color: #009999; text-decoration: none;">Communication Prompts & Resources</a></li>
      </ul>
      <p style="color: #cccccc; line-height: 1.7;">
        With care,<br>
        <strong style="color: #e0e0e0;">The GreenElephant Team</strong>
      </p>
    `;

    await client.emails.send({
      from: fromEmail,
      to: data.email,
      subject: "We received your message - GreenElephant",
      html: brandedEmailWrapper(
        'Message Received',
        '',
        customerBody,
        'You\'re receiving this one-time confirmation because you submitted a contact form at GreenElephant.org.<br/>No marketing emails will be sent. If you have questions, reply to this email.'
      ),
    });

    console.log(`✅ Contact form emails sent for: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send contact form emails to ${data.email}:`, error);
    return false;
  }
}

interface QuizResultsData {
  email: string;
  name: string | null;
  score: number;
  averageScore: number;
}

export async function sendQuizResultsEmail(data: QuizResultsData) {
  try {
    if (!(await isConnectorEnabled("resend"))) { console.log(`⏸️ Resend disabled — skipping sendQuizResultsEmail`); return false; }
    const { client, fromEmail } = await getUncachableResendClient();

    const scoreLevel = data.score >= 80 ? 'High' : data.score >= 50 ? 'Moderate' : 'Developing';
    const scoreColor = data.score >= 80 ? '#00cc99' : data.score >= 50 ? '#e6a817' : '#e05555';
    const scoreBorderColor = data.score >= 80 ? '#009999' : data.score >= 50 ? '#b8860b' : '#cc3333';
    const scoreMessage = data.score >= 80 
      ? "You show strong conscious communication patterns. Your awareness of how you communicate is a significant asset."
      : data.score >= 50 
        ? "You have a solid foundation in conscious communication with room to grow. Targeted practice can help you strengthen specific areas."
        : "You're at the beginning of your conscious communication journey. The good news? Awareness is the first step, and you've already taken it.";

    const body = `
      <p style="font-size: 16px; line-height: 1.7; color: #e0e0e0;">
        Hi ${data.name || 'there'},
      </p>
      <p style="font-size: 16px; line-height: 1.7; color: #cccccc;">
        Thank you for completing the Signals Quiz. Here are your results:
      </p>
      
      <div style="background-color: #111111; padding: 30px; border-radius: 8px; margin: 24px 0; text-align: center; border: 1px solid #1a1a1a;">
        <p style="margin: 0 0 8px 0; color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Your Score</p>
        <p style="margin: 0; font-size: 56px; font-weight: 700; color: ${scoreColor}; font-family: 'Poppins', Arial, sans-serif;">${data.score}%</p>
        <p style="margin: 8px 0 0 0; color: ${scoreColor}; font-weight: 600; font-size: 16px;">${scoreLevel} Awareness</p>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #1a1a1a;">
          <p style="margin: 0; color: #666666; font-size: 13px;">Community average: ${data.averageScore}%</p>
        </div>
      </div>
      
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #e0e0e0; font-size: 16px; font-weight: 600;">What This Means</h3>
        <p style="color: #cccccc; line-height: 1.7; margin-bottom: 0;">${scoreMessage}</p>
      `, scoreBorderColor)}
      
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #009999; font-size: 16px; font-weight: 600;">Go Deeper with the Satellite Scan</h3>
        <p style="color: #cccccc; line-height: 1.7;">
          The Signals Quiz gives you a snapshot. The <strong style="color: #e0e0e0;">Satellite Scan</strong> gives you the full picture — a 90-minute deep dive mapping your communication patterns across all 8 lenses, with a personalized dashboard created by our coaches.
        </p>
        <div style="text-align: center; margin-top: 18px;">
          ${tealButton('Explore the Satellite Scan', 'https://greenelephant.org/scan')}
        </div>
      `, '#009999')}
      
      <p style="color: #cccccc; line-height: 1.7;">
        Questions about your results? Just reply to this email.<br>
        <strong style="color: #e0e0e0;">Esteve from GreenElephant</strong>
      </p>
    `;

    await client.emails.send({
      from: fromEmail,
      to: data.email,
      subject: `Your Signals Quiz Results: ${scoreLevel} Awareness - GreenElephant`,
      html: brandedEmailWrapper(
        'Your Signals Quiz Results',
        'Communication Awareness Assessment',
        body,
        'You\'re receiving this because you completed the Signals Quiz and opted to receive your results at GreenElephant.org.<br/>To unsubscribe, simply reply to this email with "unsubscribe".'
      ),
    });

    console.log(`✅ Quiz results email sent to: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send quiz results email to ${data.email}:`, error);
    return false;
  }
}

interface FlowCheckResultEmailData {
  email: string;
  name: string | null;
  zone: string;
  situation: string;
  role: string;
  motivation: number;
  challenge: number;
  competence: number;
}

function flowAOrAn(word: string): string {
  return /^[aeiou]/i.test(word.trim()) ? 'an' : 'a';
}

function flowPersonalisedInterpretation(zone: string, situation: string, role: string, motivation: number, challenge: number, competence: number): string {
  switch (zone) {
    case 'flow':
      return `As ${flowAOrAn(role)} ${role} in &ldquo;${situation}&rdquo;, you perceive both high challenge (${challenge}/10) and high competence (${competence}/10), with strong motivation (${motivation}/10). This is the optimal state&mdash;you&rsquo;re stretched just enough to stay engaged without feeling overwhelmed. Your skills match the demands of this situation, creating deep involvement and satisfaction.`;
    case 'challenge':
      return `As ${flowAOrAn(role)} ${role} in &ldquo;${situation}&rdquo;, you perceive high challenge (${challenge}/10) but lower competence (${competence}/10). With motivation at ${motivation}/10, this creates a stress pattern. The situation demands more than you currently feel equipped to handle. This isn&rsquo;t about actual ability&mdash;it&rsquo;s about perception. Targeted support can shift this rapidly.`;
    case 'comfort':
      return `As ${flowAOrAn(role)} ${role} in &ldquo;${situation}&rdquo;, you perceive low challenge (${challenge}/10) but high competence (${competence}/10). With motivation at ${motivation}/10, you&rsquo;re in your comfort zone. While this feels safe, sustained comfort leads to stagnation. Your skills exceed the demands&mdash;which means you have capacity for growth.`;
    case 'danger':
      return `As ${flowAOrAn(role)} ${role} in &ldquo;${situation}&rdquo;, you perceive both low challenge (${challenge}/10) and low competence (${competence}/10), with motivation at ${motivation}/10. This is the danger zone&mdash;neither the situation nor your skills feel adequate. This creates apathy and disengagement, which compounds over time. Urgent attention is needed.`;
    default:
      return '';
  }
}

const FLOW_ZONE_CONFIG: Record<string, { label: string; color: string; description: string; advice: string; recommendations: string[] }> = {
  flow: {
    label: 'Flow Zone',
    color: '#009999',
    description: 'Your perceived challenge and competence are well-balanced, and your motivation is strong. This is the optimal state for growth and engagement.',
    advice: 'Keep nurturing this balance. The Satellite Scan can reveal which of the other 7 communication lenses are also in flow &mdash; and which might need attention.',
    recommendations: [
      'Protect this state&mdash;notice what conditions create it so you can replicate them',
      'Talk to a colleague about what is working &mdash; it can help them find their rhythm too',
      'Consider increasing complexity gradually to keep growing',
    ],
  },
  challenge: {
    label: 'Challenge / Stress Zone',
    color: '#e67e22',
    description: 'You perceive high challenge but feel your competence isn&rsquo;t matching up. This can lead to stress, anxiety, or feeling overwhelmed.',
    advice: 'The key is to boost your perceived competence &mdash; through feedback, structure, or skill-building. The full Satellite Scan maps exactly where to focus.',
    recommendations: [
      'Ask trusted colleagues to share what they notice you doing well',
      'Break the challenge into smaller, manageable sub-tasks',
      'Request mentoring or pair up with someone experienced in this area',
      'Bring more structure to the situation &mdash; a clear agenda, a time limit, written preparation',
    ],
  },
  comfort: {
    label: 'Comfort Zone',
    color: '#3b82f6',
    description: 'You feel capable but the challenge is low. This can feel safe but may lead to boredom or disengagement over time.',
    advice: 'Consider raising the challenge level &mdash; take on a new communication role, or explore a different lens. The Satellite Scan shows you how.',
    recommendations: [
      'Volunteer for a stretch role &mdash; host a session, mentor someone, or take notes for the group',
      'Set a personal challenge within the situation (e.g., ask a question you&rsquo;ve been avoiding)',
      'Explore adjacent skills that would raise the challenge level',
      'Reflect on whether staying comfortable is holding you back from a more meaningful challenge',
    ],
  },
  danger: {
    label: 'Danger / Apathy Zone',
    color: '#ef4444',
    description: 'Both perceived challenge and competence are low, often combined with low motivation. This zone signals disengagement or burnout risk.',
    advice: 'Start small &mdash; find one micro-win to rebuild momentum. The Satellite Scan can identify which lenses hold the most potential for re-engagement.',
    recommendations: [
      'Reconnect with your purpose &mdash; why does this situation matter to you?',
      'Ask for honest perspective from a trusted peer or coach',
      'Ask yourself honestly whether this situation is the right fit for your energy right now',
      'Start small &mdash; identify one specific communication habit to practise today',
    ],
  },
};

export async function sendFlowCheckResultEmail(data: FlowCheckResultEmailData) {
  try {
    if (!(await isConnectorEnabled("resend"))) { console.log(`⏸️ Resend disabled — skipping sendFlowCheckResultEmail`); return false; }
    const { client, fromEmail } = await getUncachableResendClient();
    const zone = FLOW_ZONE_CONFIG[data.zone] || FLOW_ZONE_CONFIG.comfort;

    const body = `
      <p style="font-size: 16px; line-height: 1.7; color: #e0e0e0;">
        Hi ${data.name || 'there'},
      </p>
      <p style="font-size: 16px; line-height: 1.7; color: #cccccc;">
        Here are your Check-my-FLOW results. You assessed your communication flow in the context of <strong style="color: #e0e0e0;">${data.situation}</strong> as ${flowAOrAn(data.role)} <strong style="color: #e0e0e0;">${data.role}</strong>.
      </p>
      ${darkCard(`
        <div style="text-align: center; margin-bottom: 16px;">
          <span style="display: inline-block; background-color: ${zone.color}22; border: 1px solid ${zone.color}; color: ${zone.color}; padding: 8px 20px; border-radius: 20px; font-family: 'Poppins', Arial, sans-serif; font-weight: 600; font-size: 18px; letter-spacing: 0.5px;">${zone.label}</span>
        </div>
        <p style="color: #cccccc; font-size: 14px; line-height: 1.6; text-align: center;">${zone.description}</p>
      `, zone.color)}
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #e0e0e0; font-size: 16px; font-weight: 600;">Your Personalised Interpretation</h3>
        <p style="color: #cccccc; font-size: 14px; line-height: 1.7;">${flowPersonalisedInterpretation(data.zone, data.situation, data.role, data.motivation, data.challenge, data.competence)}</p>
      `)}
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #009999; font-size: 16px; font-weight: 600;">Your Scores</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #999; padding: 8px 0; border-bottom: 1px solid #1a1a1a;">Perceived Motivation</td>
            <td style="color: #e0e0e0; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid #1a1a1a;">${data.motivation}/10</td>
          </tr>
          <tr>
            <td style="color: #999; padding: 8px 0; border-bottom: 1px solid #1a1a1a;">Perceived Challenge</td>
            <td style="color: #e0e0e0; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid #1a1a1a;">${data.challenge}/10</td>
          </tr>
          <tr>
            <td style="color: #999; padding: 8px 0;">Perceived Competence</td>
            <td style="color: #e0e0e0; font-weight: 600; text-align: right; padding: 8px 0;">${data.competence}/10</td>
          </tr>
        </table>
      `)}
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #e0e0e0; font-size: 16px; font-weight: 600;">What To Do Next</h3>
        <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">${zone.advice}</p>
        <ul style="margin: 0; padding-left: 20px; color: #cccccc; font-size: 13px; line-height: 1.8;">
          ${zone.recommendations.map(r => `<li style="margin-bottom: 4px;">${r}</li>`).join('')}
        </ul>
      `)}
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #e0e0e0; font-size: 16px; font-weight: 600;">You Measured 1 of 8 Lenses</h3>
        <p style="color: #cccccc; font-size: 14px; line-height: 1.6;">
          Flow is one of the 8 lenses in the Periodic Table of Conscious Communication. The full Satellite Scan maps all 8 lenses with 129 questions, giving you a complete communication dashboard.
        </p>
        <div style="text-align: center; margin-top: 16px;">
          ${tealButton('Get Your Full Satellite Scan &mdash; &euro;99.95', 'https://greenelephant.org/checkout?product=satellitescan')}
        </div>
      `)}
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #e0e0e0; font-size: 16px; font-weight: 600;">Learn More About Flow</h3>
        <p style="color: #cccccc; font-size: 14px; line-height: 1.6;">
          Watch this short video to understand how to measure and hack communication flow in your work and team:
        </p>
        <div style="text-align: center; margin-top: 12px;">
          <a href="https://youtu.be/EZBP2FByWBg" style="color: #009999; font-size: 14px; text-decoration: none; font-weight: 600;">Watch: Measuring Flow (YouTube)</a>
        </div>
      `)}
      <p style="color: #cccccc; line-height: 1.7;">
        Looking forward to supporting your communication journey,<br>
        <strong style="color: #e0e0e0;">Esteve from GreenElephant</strong>
      </p>
    `;

    await client.emails.send({
      from: fromEmail,
      to: data.email,
      subject: `Your Flow Check Result: ${zone.label} - GreenElephant`,
      html: brandedEmailWrapper(
        'Your Check-my-FLOW Results',
        'Communication Flow Assessment',
        body,
        'You\'re receiving this because you completed the Check-my-FLOW assessment and opted to receive your results at greenelephant.org.<br/>To unsubscribe, simply reply to this email with "unsubscribe".'
      ),
    });

    console.log(`✅ Flow check result email sent to: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send flow check result email to ${data.email}:`, error);
    return false;
  }
}

export async function sendFlowCheckAdminNotification(data: { email: string; name: string | null; zone: string; situation: string; role: string; motivation: number; challenge: number; competence: number }) {
  try {
    if (!(await isConnectorEnabled("resend"))) { console.log(`⏸️ Resend disabled — skipping sendFlowCheckAdminNotification`); return false; }
    const { client, fromEmail } = await getUncachableResendClient();
    const adminEmail = 'esteve@greenelephant.org';
    const zone = FLOW_ZONE_CONFIG[data.zone] || FLOW_ZONE_CONFIG.comfort;

    await client.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `New Flow Check: ${zone.label} - ${data.email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Flow Check Submission</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${data.name || 'Not provided'}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #166534;">Flow Check Results</h3>
            <p><strong>Zone:</strong> <span style="color: ${zone.color}; font-weight: bold;">${zone.label}</span></p>
            <p><strong>Situation:</strong> ${data.situation}</p>
            <p><strong>Role:</strong> ${data.role}</p>
            <p><strong>Motivation:</strong> ${data.motivation}/10</p>
            <p><strong>Challenge:</strong> ${data.challenge}/10</p>
            <p><strong>Competence:</strong> ${data.competence}/10</p>
          </div>
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Next Steps</h3>
            <ul style="line-height: 1.8;">
              <li>Contact synced to Notion CRM with "Flow Check" channel</li>
              <li>They received branded result email with Satellite Scan CTA</li>
              <li>Consider personal follow-up if in Danger or Challenge zone</li>
            </ul>
          </div>
          <p style="color: #6b7280; font-size: 14px;">Automatically sent from GreenElephant.org Flow Check.</p>
        </div>
      `,
    });

    console.log(`✅ Flow check admin notification sent for: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send flow check admin notification for ${data.email}:`, error);
    return false;
  }
}

// Webinar replay gate confirmation email
export async function sendWebinarReplayConfirmationEmail(data: { name: string; email: string }) {
  try {
    if (!(await isConnectorEnabled("resend"))) { console.log(`⏸️ Resend disabled — skipping sendWebinarReplayConfirmationEmail`); return false; }
    const { client, fromEmail } = await getUncachableResendClient();

    await client.emails.send({
      from: fromEmail,
      to: data.email,
      subject: "Your Monthly Lens Webinar replay link",
      html: brandedEmailWrapper(
        "Monthly Lens Webinars",
        "Your replay link is on its way",
        `
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
          Hi ${data.name},
        </p>
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
          Thank you for registering for the GreenElephant Monthly Lens Webinar series. The replay link for the most recent session will be sent to this address within a few hours.
        </p>
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 24px 0;">
          Each month we go deep on one lens from the Periodic Table of Conscious Communication — live theory, live practice, and live Q&A. Future session invitations will come to this inbox.
        </p>
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 8px 0;">
          Want the full experience with mic and camera access?
        </p>
        <a href="https://greenelephant.org/scan" style="display:inline-block;background-color:#009999;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;font-family:Poppins,sans-serif;font-weight:600;font-size:14px;margin-bottom:24px;">
          Get the Satellite Scan — €99.95
        </a>
        `,
        "You received this email because you requested access to the GreenElephant Monthly Lens Webinar replay. To unsubscribe, reply to this email with the word UNSUBSCRIBE."
      ),
    });

    console.log(`✅ Webinar replay gate confirmation sent to: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send webinar replay gate email to ${data.email}:`, error);
    return false;
  }
}

export interface DailyPulseData {
  date: string;
  scanPurchases: number;
  revenue: number;
  newsletterSubs: number;
  webinarSignups: number;
  flowChecks: number;
  flowZones: Record<string, number>;
  quizCompletions: number;
  contactMessages: number;
}

export async function sendDailyPulseEmail(data: DailyPulseData): Promise<boolean> {
  try {
    if (!(await isConnectorEnabled("resend"))) { console.log(`⏸️ Resend disabled — skipping sendDailyPulseEmail`); return false; }
    const { client, fromEmail } = await getUncachableResendClient();

    const zoneRows = Object.entries(data.flowZones)
      .map(([zone, count]) => `
        <tr>
          <td style="padding:6px 12px;color:#cccccc;font-size:13px;border-bottom:1px solid #222;">${zone}</td>
          <td style="padding:6px 12px;color:#009999;font-size:13px;font-weight:600;border-bottom:1px solid #222;text-align:right;">${count}</td>
        </tr>`)
      .join('');

    const statCard = (label: string, value: string | number, note?: string) => `
      <div style="background:#111;border:1px solid #222;border-radius:6px;padding:16px 20px;margin-bottom:12px;">
        <div style="color:#cccccc;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">${label}</div>
        <div style="color:#ffffff;font-size:28px;font-weight:700;font-family:Poppins,sans-serif;">${value}</div>
        ${note ? `<div style="color:#666;font-size:12px;margin-top:4px;">${note}</div>` : ''}
      </div>`;

    const bodyHtml = `
      <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 20px 0;">
        Here is your automated activity summary for the last 24 hours ending <strong style="color:#ffffff;">${data.date}</strong>.
      </p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        ${statCard('Scan Purchases', data.scanPurchases, `€${data.revenue.toFixed(2)} revenue`)}
        ${statCard('Newsletter Subs', data.newsletterSubs)}
        ${statCard('Webinar Signups', data.webinarSignups)}
        ${statCard('Flow Checks', data.flowChecks)}
        ${statCard('Quiz Completions', data.quizCompletions)}
        ${statCard('Contact Messages', data.contactMessages)}
      </div>

      ${data.flowChecks > 0 ? `
      <div style="margin-top:24px;">
        <p style="color:#009999;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Flow Zones Breakdown</p>
        <table style="width:100%;border-collapse:collapse;background:#111;border:1px solid #222;border-radius:6px;overflow:hidden;">
          <tbody>${zoneRows}</tbody>
        </table>
      </div>` : ''}

      <div style="margin-top:28px;">
        ${tealButton('Open Admin Dashboard', 'https://greenelephant.org/admin/submissions')}
        &nbsp;&nbsp;
        <a href="https://greenelephant.org/admin/email-control-room" style="display:inline-block;border:1px solid #009999;color:#009999;padding:12px 20px;text-decoration:none;border-radius:6px;font-family:Poppins,sans-serif;font-weight:600;font-size:14px;">
          Email Control Room
        </a>
      </div>
    `;

    await client.emails.send({
      from: fromEmail,
      to: 'esteve@greenelephant.org',
      subject: `GE Daily Pulse — ${data.date}`,
      html: brandedEmailWrapper(
        'Daily Pulse',
        `Activity summary for ${data.date}`,
        bodyHtml,
        'This email is sent automatically every morning at 8:00 AM UTC to esteve@greenelephant.org. It is an internal admin digest and does not contain customer data shared with third parties.'
      ),
    });

    console.log(`✅ Daily pulse email sent for ${data.date}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send daily pulse email:', error);
    return false;
  }
}

interface ContentFlywheelEmailData {
  recipients: string[];
  generatorType: string;
  lensName: string;
  lensColor: string;
  article: string;
  poll: string;
  artDirection: string;
  seoKeywords: string[];
  seoFaqItems: Array<{ question: string; answer: string }>;
  seoInternalLinks: string[];
}

export async function sendContentFlywheelEmail(data: ContentFlywheelEmailData) {
  try {
    if (!(await isConnectorEnabled("resend"))) {
      console.log('⏸️ Resend connector disabled — skipping content flywheel email');
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();

    const generatorLabels: Record<string, string> = {
      headlines: 'Decode the Headlines',
      'ai-gap': 'The AI Communication Gap',
      workplace: 'Workplace Conflict Decoded',
    };

    const articleHtml = data.article.replace(/\n/g, '<br/>');
    const pollHtml = data.poll.replace(/\n/g, '<br/>');
    const artHtml = data.artDirection.replace(/\n/g, '<br/>');

    const bodyHtml = `
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="display: inline-block; background-color: ${data.lensColor}22; color: ${data.lensColor}; border: 1px solid ${data.lensColor}44; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600;">
          ${data.lensName} Lens
        </span>
      </div>
      <p style="color: #ff6666; font-size: 14px; font-weight: 700; text-align: center; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px;">
        HITL Review — Not for posting until approved
      </p>

      ${darkCard(`
        <h3 style="color: #ffffff; margin: 0 0 16px 0; font-family: 'Poppins', Arial, sans-serif; font-size: 18px;">LinkedIn Article Draft</h3>
        <p style="color: #cccccc; font-size: 13px; margin-bottom: 12px; font-style: italic;">For Esteve's personal LinkedIn profile</p>
        <div style="color: #dddddd; font-size: 14px; line-height: 1.7;">${articleHtml}</div>
      `, data.lensColor)}

      ${darkCard(`
        <h3 style="color: #ffffff; margin: 0 0 16px 0; font-family: 'Poppins', Arial, sans-serif; font-size: 18px;">LinkedIn Poll Draft</h3>
        <p style="color: #cccccc; font-size: 13px; margin-bottom: 12px; font-style: italic;">For GreenElephant company page</p>
        <div style="color: #dddddd; font-size: 14px; line-height: 1.7;">${pollHtml}</div>
      `, '#009999')}

      ${darkCard(`
        <h3 style="color: #ffffff; margin: 0 0 16px 0; font-family: 'Poppins', Arial, sans-serif; font-size: 18px;">Art Direction for Canva</h3>
        <div style="color: #dddddd; font-size: 14px; line-height: 1.7;">${artHtml}</div>
      `, '#663399')}

      ${data.seoKeywords.length > 0 ? darkCard(`
        <h3 style="color: #ffffff; margin: 0 0 12px 0; font-family: 'Poppins', Arial, sans-serif; font-size: 16px;">SEO/GEO Enrichment Summary</h3>
        <p style="color: #999999; font-size: 13px; margin-bottom: 12px;">Keywords: ${data.seoKeywords.join(', ')}</p>
        ${data.seoFaqItems.map(f => `<p style="color: #cccccc; font-size: 13px;"><strong>Q:</strong> ${f.question}<br/><strong>A:</strong> ${f.answer}</p>`).join('')}
        ${data.seoInternalLinks.length > 0 ? `<p style="color: #999999; font-size: 13px; margin-top: 12px;">Internal linking: ${data.seoInternalLinks.join(' | ')}</p>` : ''}
      `, '#669966') : ''}
    `;

    await client.emails.send({
      from: fromEmail,
      to: data.recipients,
      subject: `[Content Flywheel] ${generatorLabels[data.generatorType] || data.generatorType} — ${data.lensName} Lens`,
      html: brandedEmailWrapper(
        'Content Flywheel',
        `${generatorLabels[data.generatorType] || data.generatorType} — ${data.lensName} Lens`,
        bodyHtml,
        'This is an internal GreenElephant admin email. Content requires human review before publishing. Do not forward or post without approval.'
      ),
    });

    console.log(`✅ Content flywheel email sent to ${data.recipients.join(', ')}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send content flywheel email:', error);
    return false;
  }
}

interface CoachingRawDataEmailData {
  coacheeEmail: string;
  coacheeName: string | null;
  rawData: Record<string, string>;
}

export async function sendCoachingRawDataEmail(data: CoachingRawDataEmailData): Promise<boolean> {
  try {
    if (!(await isConnectorEnabled("resend"))) {
      console.log(`⏸️ Resend disabled — skipping coaching raw data email to ${data.coacheeEmail}`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const firstName = data.coacheeName?.split(' ')[0] || 'there';

    const rawDataRows = Object.entries(data.rawData)
      .map(([q, a]) => `<tr><td style="padding:6px 10px;border-bottom:1px solid #222;color:#999;font-size:13px;vertical-align:top;white-space:nowrap;">${q}</td><td style="padding:6px 10px;border-bottom:1px solid #222;color:#e0e0e0;font-size:13px;">${a}</td></tr>`)
      .join('');

    await client.emails.send({
      from: fromEmail,
      to: data.coacheeEmail,
      subject: `Your Satellite Scan Raw Data — GreenElephant`,
      html: brandedEmailWrapper(
        "Your Satellite Scan Data",
        "Copy-paste ready for the Conscious Communicator GPT",
        `
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
          Hi ${firstName},
        </p>
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 24px 0;">
          Here is your raw Satellite Scan data. You can select all the text in the box below and paste it directly into the
          <a href="https://chatgpt.com/g/g-A2D8HFqGl-conscious-communicator" style="color:#009999;text-decoration:none;">Conscious Communicator GPT</a>
          for a personalized analysis.
        </p>
        <div style="background-color:#111111;border:1px solid #333;border-radius:8px;padding:0;margin:0 0 24px 0;overflow:auto;max-height:500px;">
          <table cellpadding="0" cellspacing="0" border="0" style="width:100%;font-family:monospace;">
            ${rawDataRows}
          </table>
        </div>
        <p style="color:#999;font-size:13px;line-height:1.7;margin:0;">
          Questions? Reply to this email and we'll get back to you.
        </p>
        `,
        "You received this because your coach at GreenElephant sent you your Satellite Scan data."
      ),
    });

    console.log(`✅ Coaching raw data email sent to: ${data.coacheeEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send coaching raw data email to ${data.coacheeEmail}:`, error);
    return false;
  }
}

interface CoachingDocLinkEmailData {
  coacheeEmail: string;
  coacheeName: string | null;
  docUrl: string;
  reportText: string;
}

export async function sendCoachingDocLinkEmail(data: CoachingDocLinkEmailData): Promise<boolean> {
  try {
    if (!(await isConnectorEnabled("resend"))) {
      console.log(`⏸️ Resend disabled — skipping coaching doc link email to ${data.coacheeEmail}`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const firstName = data.coacheeName?.split(' ')[0] || 'there';

    const reportHtml = data.reportText
      .split('\n')
      .map(line => line.trim() ? `<p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0 0 8px 0;">${line}</p>` : '<br/>')
      .join('');

    await client.emails.send({
      from: fromEmail,
      to: data.coacheeEmail,
      subject: `Your Coaching Dashboard is Ready — GreenElephant`,
      html: brandedEmailWrapper(
        "Your Coaching Dashboard",
        "Review your personalized communication insights",
        `
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
          Hi ${firstName},
        </p>
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 24px 0;">
          Your coaching dashboard is ready. You can view the full interactive version using the link below,
          or read the summary right here in this email.
        </p>
        <div style="text-align:center;margin:0 0 28px 0;">
          <a href="${data.docUrl}" style="display:inline-block;background-color:#009999;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:6px;font-family:'Poppins',Arial,sans-serif;font-weight:600;font-size:15px;">
            Open Your Dashboard
          </a>
        </div>
        <div style="background-color:#111111;border:1px solid #333;border-radius:8px;padding:22px;margin:0 0 24px 0;">
          <h3 style="font-family:'Poppins',Arial,sans-serif;margin-top:0;color:#009999;font-size:15px;font-weight:600;">Report Summary</h3>
          ${reportHtml}
        </div>
        <p style="color:#999;font-size:13px;line-height:1.7;margin:0;">
          Questions about your results? Reply to this email and your coach will follow up.
        </p>
        `,
        "You received this because your coach at GreenElephant prepared your coaching dashboard."
      ),
    });

    console.log(`✅ Coaching doc link email sent to: ${data.coacheeEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send coaching doc link email to ${data.coacheeEmail}:`, error);
    return false;
  }
}

interface CoachOnlyEmailData {
  coacheeName: string | null;
  rawData: Record<string, string>;
  notes?: string;
}

export async function sendCoachOnlyEmail(data: CoachOnlyEmailData): Promise<boolean> {
  try {
    if (!(await isConnectorEnabled("resend"))) {
      console.log(`⏸️ Resend disabled — skipping coach-only email`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const coachEmails = ['esteve@greenelephant.org', 'anu@greenelephant.org'];
    const coacheeName = data.coacheeName || 'Unknown';

    const rawDataRows = Object.entries(data.rawData)
      .map(([q, a]) => `<tr><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;vertical-align:top;white-space:nowrap;">${q}</td><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:13px;">${a}</td></tr>`)
      .join('');

    await client.emails.send({
      from: fromEmail,
      to: coachEmails,
      subject: `[Internal] Scan Data for ${coacheeName} — Review Before Delivery`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #0f2744 100%); padding: 24px 28px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Internal: Scan Data Review</h1>
            <p style="color: #93c5fd; margin-top: 6px; margin-bottom: 0; font-size: 14px;">Coachee: ${coacheeName}</p>
          </div>
          
          ${data.notes ? `
          <div style="background-color: #fef3c7; padding: 16px 20px; border-left: 4px solid #f59e0b;">
            <h3 style="margin-top: 0; color: #92400e; font-size: 14px;">Coach Notes</h3>
            <p style="color: #78350f; font-size: 14px; margin-bottom: 0;">${data.notes}</p>
          </div>
          ` : ''}
          
          <div style="padding: 24px; background-color: #ffffff;">
            <h3 style="margin-top: 0; color: #1f2937; font-size: 16px;">Raw Scan Data</h3>
            <div style="border:1px solid #e5e7eb;border-radius:6px;overflow:auto;">
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                ${rawDataRows}
              </table>
            </div>
          </div>
          
          <div style="background-color: #f9fafb; padding: 16px 24px; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              This is an internal email — the coachee was NOT notified. Sent automatically from the Coaching Cockpit.
            </p>
          </div>
        </div>
      `,
    });

    console.log(`✅ Coach-only email sent to: ${coachEmails.join(', ')} for coachee: ${coacheeName}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send coach-only email:`, error);
    return false;
  }
}

export async function sendPortalDataExportEmail(email: string, name: string | null, exportData: { timeline: unknown[]; context: Record<string, string> }): Promise<boolean> {
  try {
    if (!(await isConnectorEnabled("resend"))) {
      console.log("⏸️ Resend disabled — skipping portal data export email");
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();

    const eventCount = exportData.timeline.length;
    const exportDate = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    await client.emails.send({
      from: fromEmail,
      to: email,
      subject: "Your Communication Journey Data Export",
      html: brandedEmailWrapper(
        "Your Data Export",
        `Exported on ${exportDate}`,
        `
          <p style="color: #cccccc; font-size: 15px; line-height: 1.8;">
            Hi${name ? ` ${name}` : ""},
          </p>
          <p style="color: #cccccc; font-size: 15px; line-height: 1.8;">
            Here is your complete GreenElephant communication journey data. This export contains
            <strong style="color: #009999;">${eventCount} timeline event${eventCount !== 1 ? "s" : ""}</strong>
            and your stored preferences.
          </p>
          <div style="background: #111; border: 1px solid #222; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; margin: 0 0 8px;">Attached below as JSON:</p>
            <pre style="color: #009999; font-size: 11px; white-space: pre-wrap; word-break: break-all; margin: 0;">${JSON.stringify(exportData, null, 2).slice(0, 3000)}${JSON.stringify(exportData).length > 3000 ? "\n... (truncated — full data in attachment)" : ""}</pre>
          </div>
          <p style="color: #888; font-size: 13px;">
            You can re-export your data anytime from your portal Settings page.
          </p>
        `,
        "This email was sent because you requested a data export from your GreenElephant portal account. Under GDPR Article 20, you have the right to receive your personal data in a structured, commonly used format. If you did not request this, please contact us at hello@greenelephant.org."
      ),
    });

    console.log(`✅ Portal data export email sent to: ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send portal data export email:", error);
    return false;
  }
}

export async function sendNudgeDevNotification(userId: string, context: string): Promise<boolean> {
  try {
    if (!(await isConnectorEnabled("resend"))) {
      console.log("⏸️ Resend disabled — skipping nudge dev notification");
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const adminEmail = 'esteve@greenelephant.org';
    const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Amsterdam', dateStyle: 'medium', timeStyle: 'short' });

    await client.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `Portal Nudge: User ${userId} needs attention`,
      html: brandedEmailWrapper(
        "Portal Nudge",
        "A portal user is requesting help",
        `
        ${darkCard(`
          <p style="color:#009999;font-size:13px;font-weight:600;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:0.5px;">User Details</p>
          <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0;">
            <strong style="color:#e5e5e5;">User ID:</strong> ${userId}<br/>
            <strong style="color:#e5e5e5;">Time:</strong> ${timestamp}
          </p>
        `, '#009999')}
        ${darkCard(`
          <p style="color:#009999;font-size:13px;font-weight:600;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:0.5px;">Context</p>
          <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0;">${context}</p>
        `, '#e8833a')}
        <p style="color:#888888;font-size:13px;line-height:1.6;margin:24px 0 0 0;">
          This nudge was sent from the GreenElephant portal dashboard. Check in with this user to see how you can help.
        </p>
        `,
        "This is an internal admin notification from GreenElephant.org portal. You received this because a portal user used the 'Nudge Dev Team' feature."
      ),
    });

    console.log(`✅ Nudge dev notification sent for user: ${userId}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send nudge dev notification:", error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<boolean> {
  try {
    if (!(await isConnectorEnabled("resend"))) {
      console.log("⏸️ Resend disabled — skipping password reset email");
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();

    await client.emails.send({
      from: fromEmail,
      to: email,
      subject: "Reset your GreenElephant password",
      html: brandedEmailWrapper(
        "Password reset",
        "You requested a password reset",
        `
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 20px 0;">
          Click the button below to set a new password. This link expires in 1 hour.
        </p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${resetUrl}" style="display:inline-block;padding:14px 36px;background:#009999;color:#ffffff;text-decoration:none;border-radius:8px;font-family:'Poppins',sans-serif;font-weight:600;font-size:15px;">
            Reset password
          </a>
        </div>
        <p style="color:#888888;font-size:13px;line-height:1.6;margin:24px 0 0 0;">
          If you didn't request this, you can safely ignore this email. Your password won't change.
        </p>
        `,
        "You received this email because a password reset was requested for your GreenElephant portal account. If you did not make this request, no action is needed."
      ),
    });

    console.log(`✅ Password reset email sent to: ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send password reset email:", error);
    return false;
  }
}
