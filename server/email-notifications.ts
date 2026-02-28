import { getUncachableResendClient } from './resend-client';

interface EmailVerificationData {
  email: string;
  code: string;
}

export async function sendVerificationEmail(data: EmailVerificationData) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    await client.emails.send({
      from: fromEmail,
      to: data.email,
      subject: "Verify Your Email - GreenElephant",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; text-align: center;">
          <div style="background: linear-gradient(135deg, #0a1628 0%, #1a6180 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Verify Your Email</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 12px 12px;">
            <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
              Use this code to complete your purchase:
            </p>
            
            <div style="background: #ffffff; border: 2px solid #009999; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #009999;">
                ${data.code}
              </span>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              This code expires in 10 minutes.<br/>
              If you didn't request this, please ignore this email.
            </p>
          </div>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
            GreenElephant.org - Conscious Communication
          </p>
        </div>
      `,
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
              <li><strong>Prompt Library:</strong> <a href="https://greenelephant.org/resources" style="color: #2563eb;">Browse Prompts</a> - Use these prompts to deepen your insights</li>
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
            <strong>Esteve from GreenElephant</strong>
          </p>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
            You're receiving this because you purchased Satellite Scan. If you have questions, reply to this email.
          </p>
        </div>
      `,
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
              <li><strong>Prompt Library:</strong> <a href="https://greenelephant.org/resources" style="color: #2563eb;">Browse Prompts</a></li>
              <li><strong>Video Tutorials:</strong> <a href="https://www.youtube.com/playlist?list=PLYvfWnYASrYcADsrLB75TRKtcYx7BUdxB" style="color: #2563eb;">Watch on YouTube</a></li>
            </ul>
          </div>
          
          <p>
            If you have questions or want to chat before diving in, just reply to this email.
          </p>
          
          <p>
            Looking forward to mapping your communication patterns,<br>
            <strong>Esteve from GreenElephant</strong>
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

interface WebinarWaitlistData {
  customerEmail: string;
  customerName: string | null;
  preferredLens?: string;
}

export async function sendWebinarWaitlistConfirmation(data: WebinarWaitlistData) {
  try {
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
      subject: "Welcome to Play Labs - Your Communication Journey Begins",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">You're on the Play Labs Waitlist!</h2>
          
          <p>Hi ${data.customerName || 'there'},</p>
          
          <p>
            Thank you for joining the Play Labs waitlist! You've taken the first step toward 
            mastering conscious communication through our seasonal webinar series.
          </p>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">What to Expect</h3>
            <ul style="line-height: 1.8; margin-bottom: 0;">
              <li>Monthly webinars following the 8 communication lenses</li>
              <li>Each lens corresponds to a season of the year</li>
              <li>Interactive sessions with real-world applications</li>
              <li>Community of conscious communicators</li>
            </ul>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Explore While You Wait</h3>
            <ul style="line-height: 1.8;">
              <li><strong>Periodic Table:</strong> <a href="https://greenelephant.org/periodic-table" style="color: #2563eb;">Explore all 129 elements</a></li>
              <li><strong>Resources:</strong> <a href="https://greenelephant.org/resources" style="color: #2563eb;">40 communication prompts</a></li>
            </ul>
          </div>
          
          <p>
            We'll be in touch soon with dates for the upcoming webinars.
          </p>
          
          <p>
            Looking forward to exploring conscious communication with you,<br>
            <strong>Esteve from GreenElephant</strong>
          </p>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
            You're receiving this because you signed up for Play Labs at GreenElephant.org. 
            You can unsubscribe at any time by replying to this email.
          </p>
        </div>
      `,
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
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #0a1628 0%, #1a6180 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome, ${firstName}!</h1>
          <p style="color: #87CEEB; margin-top: 10px; font-size: 16px;">Your Satellite Scan is Complete</p>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Congratulations on completing your 90-minute Satellite Scan! Your responses are now safely stored, and we're excited to share them with you immediately.
          </p>
          
          <div style="background-color: #dbeafe; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2563eb;">
            <h2 style="margin-top: 0; color: #1e40af; font-size: 18px;">What Happens Next?</h2>
            <p style="margin-bottom: 0; color: #1e3a8a; line-height: 1.6;">
              <strong>Your personalized dashboard</strong> is being crafted by our human coaches. This isn't automated—we carefully review each response to create a visual map that truly reflects your communication patterns. <strong>Please allow 48-72 hours</strong> for delivery.
            </p>
          </div>
          
          <div style="background-color: #dcfce7; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #16a34a;">
            <h2 style="margin-top: 0; color: #166534; font-size: 20px;">Don't Wait — Start Exploring Your Data Now!</h2>
            <p style="color: #15803d; line-height: 1.6; font-size: 16px;">
              Your scan data is already valuable. We've created <strong>10+ ready-to-use prompts</strong> that help you discover insights about your communication style right away.
            </p>
            
            <div style="background-color: #ffffff; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #166534; font-weight: bold; margin-top: 0; margin-bottom: 15px;">Here's how to use your data:</p>
              <ol style="color: #15803d; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li><strong>Scroll down</strong> to find your complete scan data below</li>
                <li><strong>Copy all your responses</strong> from the table</li>
                <li><strong>Visit our Resources page</strong> and choose a prompt that interests you</li>
                <li><strong>Paste your data</strong> into our GPT assistant and get instant insights</li>
              </ol>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://greenelephant.org/resources" style="display: inline-block; background-color: #16a34a; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(22, 163, 74, 0.3);">Go to Resources & Prompts</a>
            </div>
            <p style="color: #15803d; font-size: 14px; text-align: center; margin-top: 15px; margin-bottom: 0;">
              greenelephant.org/resources
            </p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <h2 style="margin-top: 0; color: #1f2937; font-size: 18px;">Your Quick Summary</h2>
            ${summaryHtml}
            ${situationsHtml ? `
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                <strong style="color: #374151;">Communication Focus Areas:</strong>
                ${situationsHtml}
              </div>
            ` : ''}
          </div>
          
          <div style="margin: 30px 0;">
            <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 15px;">Your Complete Scan Data</h2>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">
              This is your raw data—copy and paste it into our prompts or your favorite AI assistant to start discovering patterns.
            </p>
            <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                  <tr style="background-color: #0a1628;">
                    <th style="padding: 12px; text-align: left; color: #ffffff; font-weight: 600;">Question</th>
                    <th style="padding: 12px; text-align: left; color: #ffffff; font-weight: 600;">Your Response</th>
                  </tr>
                </thead>
                <tbody>
                  ${rawDataRows}
                </tbody>
              </table>
            </div>
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
            <h3 style="margin-top: 0; color: #92400e; font-size: 16px;">Pro Tip</h3>
            <p style="margin-bottom: 0; color: #78350f; line-height: 1.6;">
              Use our <a href="https://chatgpt.com/g/g-bUJ6dvAHK-conscious-communicator" style="color: #2563eb; font-weight: 500;">Conscious Communicator GPT</a> for the best results when exploring your data with prompts from our library.
            </p>
          </div>
          
          <p style="color: #374151; line-height: 1.6;">
            Questions about your data or next steps? Just reply to this email—we're here to help.
          </p>
          
          <p style="color: #374151; margin-top: 25px;">
            Looking forward to your transformation journey,<br>
            <strong>Esteve from GreenElephant</strong>
          </p>
        </div>
        
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            You're receiving this because you completed the Satellite Scan at GreenElephant.org.<br>
            Submitted: ${data.submittedAt}
          </p>
        </div>
      </div>
    `;

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
    
    // Wrap in base email template
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #0a1628 0%, #1a6180 100%); padding: 40px 30px; text-align: center;">
          <img src="https://greenelephant.org/favicon.png" alt="GreenElephant" style="width: 48px; height: 48px; margin-bottom: 15px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">GreenElephant</h1>
          <p style="color: #87CEEB; margin-top: 8px; font-size: 14px;">Conscious Communication</p>
        </div>
        
        <div style="padding: 30px;">
          ${personalizedBody}
        </div>
        
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            You're receiving this as part of your Satellite Scan onboarding journey.<br>
            <a href="https://greenelephant.org" style="color: #009999;">GreenElephant.org</a> - Conscious Communication
          </p>
          <p style="color: #9ca3af; font-size: 11px; margin-top: 10px;">
            Email ${data.sequenceNumber} of 12 in your onboarding sequence
          </p>
        </div>
      </div>
    `;
    
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

function brandedEmailWrapper(title: string, subtitle: string, bodyHtml: string, footerText: string): string {
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
      'Share your approach with others to help them find their flow',
      'Consider increasing complexity gradually to keep growing',
    ],
  },
  challenge: {
    label: 'Challenge / Stress Zone',
    color: '#e67e22',
    description: 'You perceive high challenge but feel your competence isn&rsquo;t matching up. This can lead to stress, anxiety, or feeling overwhelmed.',
    advice: 'The key is to boost your perceived competence &mdash; through feedback, structure, or skill-building. The full Satellite Scan maps exactly where to focus.',
    recommendations: [
      'Seek green feedback&mdash;ask trusted colleagues what you&rsquo;re doing well',
      'Break the challenge into smaller, manageable sub-tasks',
      'Request mentoring or pair up with someone experienced in this area',
      'Bring more structure: clear agendas, time limits, written preparation',
    ],
  },
  comfort: {
    label: 'Comfort Zone',
    color: '#3b82f6',
    description: 'You feel capable but the challenge is low. This can feel safe but may lead to boredom or disengagement over time.',
    advice: 'Consider raising the challenge level &mdash; take on a new communication role, or explore a different lens. The Satellite Scan shows you how.',
    recommendations: [
      'Volunteer for a stretch role&mdash;host a session, mentor someone, take notes for the group',
      'Set a personal challenge within the situation (e.g., ask a provocative question)',
      'Explore adjacent skills that would raise the challenge level',
      'Consider if this comfort is masking avoidance of harder conversations',
    ],
  },
  danger: {
    label: 'Danger / Apathy Zone',
    color: '#ef4444',
    description: 'Both perceived challenge and competence are low, often combined with low motivation. This zone signals disengagement or burnout risk.',
    advice: 'Start small: find one micro-win to rebuild momentum. The Satellite Scan can identify which lenses hold the most potential for re-engagement.',
    recommendations: [
      'Reconnect with your purpose&mdash;why does this situation matter to you?',
      'Seek immediate feedback and support from a trusted peer or coach',
      'Consider whether this role or context truly aligns with your strengths',
      'Start small: identify one micro-skill you can practice today',
    ],
  },
};

export async function sendFlowCheckResultEmail(data: FlowCheckResultEmailData) {
  try {
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
