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
