import { getUncachableResendClient } from './resend-client';

interface PurchaseNotificationData {
  customerEmail: string;
  customerName: string | null;
  packageName: string;
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
