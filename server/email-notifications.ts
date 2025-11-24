import { getUncachableResendClient } from './resend-client';

interface PurchaseNotificationData {
  customerEmail: string;
  customerName: string | null;
  packageName: string;
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
    const { client, fromEmail } = await getUncachableResendClient();
    
    const adminEmail = 'esteve@greenelephant.org';
    
    // Send notification to admin
    await client.emails.send({
      from: fromEmail,
      to: adminEmail,
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
            <p><strong>Amount:</strong> €${data.amount}</p>
            <p><strong>Payment ID:</strong> ${data.paymentIntentId}</p>
            <p><strong>Purchase ID:</strong> ${data.purchaseId}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Action Required</h3>
            <ol style="line-height: 1.8;">
              <li>Email the customer at <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></li>
              <li>Welcome them to the program</li>
              <li>Include the Calendly booking link: <a href="https://calendly.com/greenelephant/satellite-scan-session">Book Satellite Scan™</a></li>
              <li>Provide any onboarding materials</li>
            </ol>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            This notification was automatically sent from GreenElephant.org
          </p>
        </div>
      `,
    });
    
    console.log('✅ Purchase notification email sent to:', adminEmail);
    return true;
  } catch (error) {
    console.error('❌ Failed to send purchase notification email:', error);
    // Don't throw - we still want to record the purchase even if email fails
    return false;
  }
}

export async function sendSatellitescanPurchaseEmail(data: SatellitescanPurchaseData) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
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
              <li><strong>Email the customer</strong> at <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></li>
              <li><strong>Welcome them</strong> to the Satellitescan beta program</li>
              <li><strong>Send Typeform link:</strong> <a href="https://greenelephantorg.typeform.com/individualscan">https://greenelephantorg.typeform.com/individualscan</a></li>
              <li><strong>Set expectations:</strong> 60-90 minutes to complete the scan</li>
              <li><strong>Dashboard timeline:</strong> You'll create their personalized dashboard within 3-5 business days after completion</li>
              <li><strong>Follow-up:</strong> Set reminder to check if they completed the Typeform in 3-4 days</li>
            </ol>
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #92400e;">📋 Email Template for Customer</h3>
            <p style="font-style: italic; color: #78350f;">
              Subject: Welcome to Satellitescan - Your Personal Communication Dashboard Awaits 🎯
              <br><br>
              Hi ${data.customerName || 'there'},
              <br><br>
              Welcome to the Satellitescan beta! You're among the first conscious leaders testing this AI-powered communication mapping tool.
              <br><br>
              <strong>Next Step:</strong> Complete your 90-minute Typeform scan here:
              <br>
              → <a href="https://greenelephantorg.typeform.com/individualscan">https://greenelephantorg.typeform.com/individualscan</a>
              <br><br>
              <strong>What to expect:</strong>
              <ul>
                <li>60-90 minutes of deep reflection (do it in one sitting if possible)</li>
                <li>Questions about your communication patterns across 8 lenses</li>
                <li>Once you submit, I'll manually create your personalized dashboard within 3-5 business days</li>
              </ul>
              <br>
              This is beta, so your feedback will directly shape the product. Thank you for being an early adopter.
              <br><br>
              Warm regards,
              <br>
              Estève
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            This notification was automatically sent from GreenElephant.org
          </p>
        </div>
      `,
    });
    
    console.log('✅ Satellitescan purchase notification email sent to:', adminEmail);
    return true;
  } catch (error) {
    console.error('❌ Failed to send satellitescan purchase notification email:', error);
    return false;
  }
}

export async function sendSatellitescanReminderEmail(customerEmail: string, customerName: string | null) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    await client.emails.send({
      from: fromEmail,
      to: customerEmail,
      subject: "Haven't forgotten about you - Your Satellitescan awaits 🎯",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Your Communication Dashboard Is Waiting</h2>
          
          <p>Hi ${customerName || 'there'},</p>
          
          <p>
            I noticed you haven't completed your Satellitescan Typeform yet. No pressure - but I wanted to 
            make sure the link didn't get lost in your inbox.
          </p>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Complete Your 90-Minute Scan</h3>
            <p>Click here to start: <a href="https://greenelephantorg.typeform.com/individualscan" style="color: #2563eb; font-weight: bold;">Take the Satellitescan</a></p>
            <p style="margin-bottom: 0; color: #1e3a8a;">
              <strong>Remember:</strong>
              <ul style="margin-top: 8px;">
                <li>60-90 minutes of focused time</li>
                <li>Best done in one sitting</li>
                <li>Your personalized dashboard delivered within 3-5 business days after completion</li>
              </ul>
            </p>
          </div>
          
          <p>
            If you have questions or want to chat before diving in, just reply to this email.
          </p>
          
          <p>
            Looking forward to mapping your communication patterns,<br>
            <strong>Estève</strong><br>
            GreenElephant.org
          </p>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
            You're receiving this because you purchased Satellitescan Beta. If you'd like to cancel or have 
            questions, reply to this email and I'll help you out.
          </p>
        </div>
      `,
    });
    
    console.log(`✅ Reminder email sent to: ${customerEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send reminder email to ${customerEmail}:`, error);
    return false;
  }
}
