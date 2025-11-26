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
              <li>Include the Typeform scan link: <a href="https://greenelephantorg.typeform.com/individualscan">Start Satellite Scan</a></li>
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
              <li><strong>Dashboard timeline:</strong> Create their personalized dashboard within 48-72 hours after they complete the scan</li>
              <li><strong>Follow-up:</strong> Set reminder to check if they completed the Typeform in 3-4 days</li>
            </ol>
          </div>
          
          <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #166534;">✅ Customer Resources (Sent Automatically)</h3>
            <ul style="line-height: 1.8;">
              <li><strong>Typeform Scan:</strong> <a href="https://greenelephantorg.typeform.com/individualscan">https://greenelephantorg.typeform.com/individualscan</a></li>
              <li><strong>Prompt Library (Notion):</strong> <a href="https://www.notion.so/3bef0d0b3de44a2ea31e8a37fd45a8bc?v=2b541c855f3380f5913e000cf9d65640">Access Prompts</a></li>
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
      subject: `Welcome to Satellite Scan - Start Your 90-Minute Assessment 🎯`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to Your Satellite Scan! 🛰️</h2>
          
          <p>Hi ${data.customerName || 'there'},</p>
          
          <p>Thank you for purchasing the Satellite Scan! You're about to map your communication patterns across 8 research-backed lenses.</p>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="margin-top: 0; color: #1e40af;">Start Your Scan Now</h3>
            <p style="margin-bottom: 15px;">Set aside 90 minutes of uninterrupted time for the best results.</p>
            <a href="https://greenelephantorg.typeform.com/individualscan" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Begin Your Satellite Scan</a>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">📚 Your Resources</h3>
            <p>While you wait for your personalized dashboard (delivered within 48-72 hours after you complete the scan), explore these resources:</p>
            <ul style="line-height: 1.8;">
              <li><strong>Prompt Library:</strong> <a href="https://www.notion.so/3bef0d0b3de44a2ea31e8a37fd45a8bc?v=2b541c855f3380f5913e000cf9d65640" style="color: #2563eb;">Access on Notion</a> - Use these prompts to deepen your insights</li>
              <li><strong>Video Tutorials:</strong> <a href="https://www.youtube.com/playlist?list=PLYvfWnYASrYcADsrLB75TRKtcYx7BUdxB" style="color: #2563eb;">Watch on YouTube</a> - Learn how to interpret your results</li>
            </ul>
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #92400e;">⏰ Important: Dashboard Timeline</h3>
            <p style="margin-bottom: 0;">Your personalized dashboard is manually created by our coaches—it's not automated. After you complete the scan, please allow <strong>48-72 hours</strong> for us to review your responses and build your custom visual map.</p>
          </div>
          
          <p>Questions? Just reply to this email and we'll help you out.</p>
          
          <p>
            Looking forward to mapping your communication patterns,<br>
            <strong>The GreenElephant Team</strong>
          </p>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
            You're receiving this because you purchased Satellite Scan. If you have questions, reply to this email.
          </p>
        </div>
      `,
    });
    
    console.log('✅ Satellitescan purchase notification email sent to:', adminEmail);
    console.log('✅ Satellitescan welcome email sent to customer:', data.customerEmail);
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
      subject: "Haven't forgotten about you - Your Satellite Scan awaits 🎯",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Your Communication Dashboard Is Waiting</h2>
          
          <p>Hi ${customerName || 'there'},</p>
          
          <p>
            We noticed you haven't completed your Satellite Scan Typeform yet. No pressure - but we wanted to 
            make sure the link didn't get lost in your inbox.
          </p>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Complete Your 90-Minute Scan</h3>
            <p>Click here to start: <a href="https://greenelephantorg.typeform.com/individualscan" style="color: #2563eb; font-weight: bold;">Take the Satellite Scan</a></p>
            <p style="margin-bottom: 0; color: #1e3a8a;">
              <strong>Remember:</strong>
              <ul style="margin-top: 8px;">
                <li>60-90 minutes of focused time</li>
                <li>Best done in one sitting</li>
                <li>Your personalized dashboard delivered within 48-72 hours after completion</li>
              </ul>
            </p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">📚 Your Resources Are Ready</h3>
            <p>While you prepare to take the scan, explore these resources:</p>
            <ul style="line-height: 1.8;">
              <li><strong>Prompt Library:</strong> <a href="https://www.notion.so/3bef0d0b3de44a2ea31e8a37fd45a8bc?v=2b541c855f3380f5913e000cf9d65640" style="color: #2563eb;">Access on Notion</a></li>
              <li><strong>Video Tutorials:</strong> <a href="https://www.youtube.com/playlist?list=PLYvfWnYASrYcADsrLB75TRKtcYx7BUdxB" style="color: #2563eb;">Watch on YouTube</a></li>
            </ul>
          </div>
          
          <p>
            If you have questions or want to chat before diving in, just reply to this email.
          </p>
          
          <p>
            Looking forward to mapping your communication patterns,<br>
            <strong>The GreenElephant Team</strong>
          </p>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
            You're receiving this because you purchased Satellite Scan. If you'd like to cancel or have 
            questions, reply to this email and we'll help you out.
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
