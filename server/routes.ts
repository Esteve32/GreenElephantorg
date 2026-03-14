import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { storage } from "./storage";
import { requireAdminAuth, verifyAdminPassword, requireAdminRole, requireWriteAccess, auditMiddleware, logAuditEvent, hashAdminPassword } from "./auth";
import { fetchGA4Metrics, isGA4Configured } from "./lib/ga4Client";
import { isConnectorEnabled } from "./lib/connectorGuard";
import Stripe from "stripe";
import { COACHING_PACKAGES, type PackageId } from "@shared/packages";
import { 
  insertRecommendationSubmissionSchema, 
  insertContactSchema,
  insertWaitlistEntrySchema,
  insertWebinarWaitlistEntrySchema,
  insertNewsletterSubscriptionSchema,
  insertSignalsQuizResultSchema,
  insertPurchaseSchema,
  insertContactMessageSchema,
  insertSatellitescanPurchaseSchema,
  insertPromptSchema,
  insertFlowCheckResultSchema,
  insertTestimonialSchema,
  type InsertOnboardingEmailTemplate
} from "@shared/schema";
import { fromError } from "zod-validation-error";
import { sendPurchaseNotification, sendSatellitescanPurchaseEmail, sendSatellitescanReminderEmail, sendWebinarWaitlistConfirmation, sendTypeformScanCompletionEmail, sendVerificationEmail, sendNewsletterConfirmationEmail, sendScanInterestConfirmationEmail, sendScanInterestAdminNotification, sendWaitlistConfirmationEmail, sendContactFormEmails, sendQuizResultsEmail, sendFlowCheckResultEmail, sendFlowCheckAdminNotification, sendCoachingRawDataEmail, sendCoachingDocLinkEmail, sendCoachOnlyEmail, sendPortalDataExportEmail } from "./email-notifications";
import { getSheetData } from "./lib/googleSheets";
import { generateDashboardUI } from "./lib/thesysApi";
import { 
  syncContactWithNotion, 
  pushAllContactsToNotion, 
  pullContactsFromNotion, 
  fullSync as notionFullSync,
  getNotionDatabaseSchema,
  getUnsyncedContacts,
  markContactAsCustomer,
  syncNewsletterToNotion
} from "./lib/notionSync";

// Stripe integration from blueprint:javascript_stripe
// Gracefully handle missing Stripe keys to allow app to start
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
let stripe: Stripe | null = null;

if (STRIPE_KEY) {
  stripe = new Stripe(STRIPE_KEY, {
    apiVersion: "2023-10-16" as any, // Using stable version with type assertion
  });
  console.log('✓ Stripe initialized successfully');
} else {
  console.warn('⚠ Warning: STRIPE_SECRET_KEY not found. Payment functionality will be disabled.');
  console.warn('  To enable payments, add STRIPE_SECRET_KEY to your deployment secrets.');
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use("/api/admin", auditMiddleware);

  // Stripe payment route for coaching packages (one-time payments)
  // Server-side price validation to prevent client tampering
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ 
        message: "Payment processing is currently unavailable. Please contact support." 
      });
    }
    if (!(await isConnectorEnabled("stripe"))) {
      return res.status(503).json({
        message: "Payment processing is currently disabled. Please contact support."
      });
    }

    try {
      const { packageId, customerEmail, customerName } = req.body;
      
      // Validate package exists in server-side catalog
      if (!packageId || !(packageId in COACHING_PACKAGES)) {
        return res.status(400).json({ message: "Invalid package" });
      }

      const packageInfo = COACHING_PACKAGES[packageId as PackageId];
      const amount = packageInfo.price;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "eur", // GreenElephant pricing is in EUR
        metadata: {
          packageId: packageId,
          packageName: packageInfo.name,
          customerEmail: customerEmail || '',
          customerName: customerName || '',
        },
        receipt_email: customerEmail || undefined,
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Stripe payment intent error:", error);
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Stripe webhook to capture successful payments
  // IMPORTANT: This endpoint uses raw body for signature verification
  app.post("/api/webhooks/stripe", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Stripe not configured" });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    try {
      let event: Stripe.Event;

      // Verify webhook signature for security
      if (webhookSecret) {
        const signature = req.headers['stripe-signature'];
        if (!signature) {
          console.error('⚠️ Webhook signature missing');
          return res.status(400).json({ message: 'Missing stripe-signature header' });
        }

        try {
          // Verify the event using Stripe's library
          event = stripe.webhooks.constructEvent(
            (req as any).rawBody,
            signature,
            webhookSecret
          );
          console.log('✅ Webhook signature verified');
        } catch (err: any) {
          console.error('❌ Webhook signature verification failed:', err.message);
          return res.status(400).json({ message: `Webhook signature verification failed: ${err.message}` });
        }
      } else {
        // No signature verification (development/testing only)
        console.warn('⚠️ STRIPE_WEBHOOK_SECRET not set - signature verification disabled (NOT SECURE FOR PRODUCTION)');
        event = req.body;
      }

      // Handle successful payment
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Extract metadata with fallback to receipt_email
        const { packageId, packageName, customerName } = paymentIntent.metadata;
        // Use metadata customerEmail first, then fall back to receipt_email
        const customerEmail = paymentIntent.metadata.customerEmail || paymentIntent.receipt_email || '';
        const amount = (paymentIntent.amount / 100).toString(); // Convert cents to EUR
        
        console.log('📧 Payment Intent customer email sources:');
        console.log('  - metadata.customerEmail:', paymentIntent.metadata.customerEmail || 'NOT SET');
        console.log('  - receipt_email:', paymentIntent.receipt_email || 'NOT SET');
        console.log('  - Final customerEmail:', customerEmail || 'EMPTY!');

        // Validate required metadata - LOUD ERROR for missing email
        if (!customerEmail || !packageName) {
          console.error('❌ CRITICAL: Missing required metadata in payment intent:', paymentIntent.id);
          console.error('❌ customerEmail:', customerEmail || 'MISSING');
          console.error('❌ packageName:', packageName || 'MISSING');
          return res.status(400).json({ message: 'Invalid payment intent metadata' });
        }

        // Check if purchase already exists (idempotency)
        const existingPurchase = await storage.getPurchaseByPaymentIntent(paymentIntent.id);
        
        if (!existingPurchase) {
          // Store purchase in database
          const purchase = await storage.createPurchase({
            customerEmail: customerEmail,
            customerName: customerName || undefined,
            packageId: packageId || 'unknown',
            packageName: packageName,
            amount: amount,
            stripePaymentIntentId: paymentIntent.id,
            status: 'succeeded',
          });

          console.log('🎉 NEW PURCHASE! 🎉');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log(`Customer: ${customerName || 'Not provided'}`);
          console.log(`Email: ${customerEmail}`);
          console.log(`Package: ${packageName}`);
          console.log(`Amount: €${amount}`);
          console.log(`Payment ID: ${paymentIntent.id}`);
          console.log(`Purchase ID: ${purchase.id}`);
          console.log(`Time: ${new Date().toISOString()}`);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

          // Send email notification to admin
          const emailSent = await sendPurchaseNotification({
            customerEmail,
            customerName: customerName || null,
            packageName,
            packageId: packageId || 'unknown',
            amount,
            paymentIntentId: paymentIntent.id,
            purchaseId: purchase.id,
          });

          if (!emailSent) {
            console.log('⚠️ Email notification failed - manual follow-up required');
            console.log('👉 ACTION REQUIRED: Email customer at:', customerEmail);
            console.log('👉 Include Calendly link: https://calendly.com/greenelephant/satellite-scan-session');
          }

          if (paymentIntent.metadata.product === 'portal_subscription' && paymentIntent.metadata.couponCode) {
            try {
              const coupon = await storage.getCouponByCode(paymentIntent.metadata.couponCode);
              if (coupon) {
                await storage.incrementCouponUsage(coupon.id);
                console.log(`✓ Coupon usage incremented for: ${paymentIntent.metadata.couponCode}`);
              }
            } catch (err: any) {
              console.log('Coupon usage increment error:', err.message);
            }
          }

          // Sync purchase to Notion CRM first (creates contact if doesn't exist)
          try {
            await markContactAsCustomer(customerEmail, {
              productName: packageName,
              amount: amount,
              customerName: customerName || undefined
            });
            // Add purchase channel to contact's channels reached (after contact is created)
            await storage.addChannelToContact(customerEmail, 'Purchase');
            console.log(`✓ Purchase channel added for: ${customerEmail}`);
          } catch (err: any) {
            console.log('Notion sync for purchase error:', err.message);
          }
        } else {
          console.log('ℹ️ Duplicate webhook event received for payment:', paymentIntent.id);
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // Typeform webhook endpoint - receives scan completion data and sends email with results
  // Note: This route uses express.raw() middleware with 50mb limit defined in index.ts
  app.post("/api/typeform-webhook", async (req, res) => {
    try {
      if (!(await isConnectorEnabled("typeform"))) {
        console.log('⏸️ Typeform connector disabled — rejecting webhook');
        return res.status(503).json({ message: "Typeform integration is currently disabled" });
      }
      console.log('📬 Typeform webhook received');
      
      // Parse raw buffer to JSON (since we use express.raw for this route to handle large payloads)
      let body: any;
      try {
        const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : req.body;
        body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
        console.log('📦 Payload size:', Buffer.isBuffer(req.body) ? req.body.length : JSON.stringify(req.body).length, 'bytes');
      } catch (parseError: any) {
        console.error('❌ Failed to parse Typeform payload:', parseError.message);
        return res.status(400).json({ message: 'Invalid JSON payload' });
      }
      
      const { form_response } = body;
      
      if (!form_response) {
        console.error('❌ Invalid Typeform webhook payload - missing form_response');
        return res.status(400).json({ message: 'Invalid webhook payload' });
      }

      const { answers, definition, submitted_at } = form_response;
      
      if (!answers || !definition) {
        console.error('❌ Invalid Typeform webhook payload - missing answers or definition');
        return res.status(400).json({ message: 'Invalid webhook payload structure' });
      }

      // Build a map of field IDs to field titles
      const fieldTitles: Record<string, string> = {};
      if (definition.fields) {
        for (const field of definition.fields) {
          fieldTitles[field.id] = field.title || field.id;
        }
      }

      // Extract raw data (question -> answer pairs)
      const rawData: Record<string, string> = {};
      let customerEmail = '';
      let firstName = '';
      let lastName = '';
      let role = '';
      let jobTitle = '';
      let country = '';
      let education = '';
      let gender = '';
      let birthYear = '';
      let experience = '';
      let communicationSituations = '';

      for (const answer of answers) {
        const fieldId = answer.field?.id;
        const fieldTitle = fieldTitles[fieldId] || fieldId;
        
        // Get the answer value based on type
        let answerValue = '';
        
        switch (answer.type) {
          case 'text':
          case 'short_text':
          case 'long_text':
            answerValue = answer.text || '';
            break;
          case 'email':
            answerValue = answer.email || '';
            customerEmail = answerValue;
            break;
          case 'number':
            answerValue = answer.number?.toString() || '';
            break;
          case 'boolean':
            answerValue = answer.boolean ? 'Yes' : 'No';
            break;
          case 'choice':
            answerValue = answer.choice?.label || answer.choice?.other || '';
            break;
          case 'choices':
            answerValue = answer.choices?.labels?.join(', ') || answer.choices?.other || '';
            break;
          case 'date':
            answerValue = answer.date || '';
            break;
          case 'url':
            answerValue = answer.url || '';
            break;
          case 'file_url':
            answerValue = answer.file_url || '';
            break;
          case 'payment':
            answerValue = `${answer.payment?.amount} ${answer.payment?.currency}`;
            break;
          default:
            answerValue = JSON.stringify(answer) || '';
        }

        rawData[fieldTitle] = answerValue;

        // Extract specific fields for summary based on common patterns in field titles
        const lowerTitle = fieldTitle.toLowerCase();
        
        if (lowerTitle.includes('first name')) {
          firstName = answerValue;
        } else if (lowerTitle.includes('last name')) {
          lastName = answerValue;
        } else if (lowerTitle.includes('work role') || lowerTitle.includes('identifies your work')) {
          role = answerValue;
        } else if (lowerTitle.includes('job title')) {
          jobTitle = answerValue;
        } else if (lowerTitle.includes('country') || lowerTitle.includes('nationality')) {
          country = answerValue;
        } else if (lowerTitle.includes('education') || lowerTitle.includes('highest degree') || lowerTitle.includes('school') || lowerTitle.includes('your h')) {
          education = answerValue;
        } else if (lowerTitle.includes('gender')) {
          gender = answerValue;
        } else if (lowerTitle.includes('birth') || lowerTitle.includes('year') && lowerTitle.includes('born')) {
          birthYear = answerValue;
        } else if (lowerTitle.includes('how long') || lowerTitle.includes('experience') || lowerTitle.includes('months')) {
          experience = answerValue;
        } else if (lowerTitle.includes('teamwork') || lowerTitle.includes('communication') && lowerTitle.includes('situation')) {
          communicationSituations = answerValue;
        }
      }

      // If no email found, log warning but still send to admins
      if (!customerEmail) {
        console.warn('⚠️ No customer email found in Typeform response');
        // Try to find email in hidden fields
        if (form_response.hidden && form_response.hidden.email) {
          customerEmail = form_response.hidden.email;
        }
      }

      // Format submission date
      const submittedAt = submitted_at 
        ? new Date(submitted_at).toLocaleString('en-GB', { 
            dateStyle: 'medium', 
            timeStyle: 'short',
            timeZone: 'Europe/Helsinki'
          })
        : new Date().toLocaleString('en-GB', { 
            dateStyle: 'medium', 
            timeStyle: 'short',
            timeZone: 'Europe/Helsinki'
          });

      console.log('📊 Scan data received for:', firstName, lastName);
      console.log('📧 Customer email:', customerEmail || 'Not provided');
      console.log('📝 Total answers:', Object.keys(rawData).length);

      // Send the email with scan data
      if (customerEmail) {
        const emailSent = await sendTypeformScanCompletionEmail({
          customerEmail,
          customerName: firstName ? `${firstName} ${lastName}`.trim() : null,
          formattedSummary: {
            firstName,
            lastName,
            role,
            jobTitle,
            country,
            education,
            gender,
            birthYear,
            experience,
            communicationSituations,
          },
          rawData,
          submittedAt,
        });

        if (emailSent) {
          console.log('✅ Scan completion email sent successfully');
        } else {
          console.error('❌ Failed to send scan completion email');
        }
        
        // Mark Satellitescan purchase as typeform completed (updates "Typeform: Pending" to "Done")
        try {
          const updatedCount = await storage.markTypeformCompletedByEmail(customerEmail);
          if (updatedCount > 0) {
            console.log(`✅ Marked ${updatedCount} Satellitescan purchase(s) as Typeform completed for:`, customerEmail);
          }
        } catch (purchaseError: any) {
          console.error('⚠️ Purchase update error (non-blocking):', purchaseError.message);
        }

        // Save self-reported role to satellitescan purchase record
        if (role) {
          try {
            await storage.updateSatellitescanRole(customerEmail, role);
            console.log(`✅ Saved role "${role}" for ${customerEmail}`);
          } catch (roleError: any) {
            console.error('⚠️ Role update error (non-blocking):', roleError.message);
          }
        }
        
        // Sync contact to Notion CRM with scan submission date
        try {
          const customerName = firstName ? `${firstName} ${lastName}`.trim() : null;
          const submissionDate = submitted_at ? new Date(submitted_at) : new Date();
          
          // Check if contact exists, if not create one
          let contact = await storage.getContactByEmail(customerEmail);
          if (!contact) {
            contact = await storage.createContact({
              email: customerEmail,
              name: customerName || undefined,
              consentGiven: 'true',
              consentText: 'Satellite Scan completion via Typeform',
              source: 'quiz' as any, // Using quiz as source type for scans
              channelsReached: ['Quiz'],
            });
            console.log('✅ New contact created for scan submitter:', customerEmail);
          }
          
          // Add Quiz channel if not already present
          await storage.addChannelToContact(customerEmail, 'Quiz');
          
          // Update scan submitted date on contact (for Notion sync)
          await storage.updateScanSubmittedAt(customerEmail, submissionDate);
          console.log('✅ Scan submission date recorded:', submissionDate.toISOString());
          
          // Re-fetch contact to get updated scanSubmittedAt for Notion sync
          contact = await storage.getContactByEmail(customerEmail);
          
          // Sync to Notion
          if (contact) {
            await syncContactWithNotion(contact.id);
            console.log('✅ Contact synced to Notion CRM:', customerEmail);
          }
        } catch (notionError: any) {
          console.error('⚠️ Notion sync error (non-blocking):', notionError.message);
        }
      } else {
        console.warn('⚠️ Skipping customer email - no email address available');
        // Still log the data for manual follow-up
        console.log('📋 Manual follow-up required for:', firstName, lastName);
      }

      // Always respond 200 to acknowledge receipt
      res.json({ received: true, message: 'Typeform webhook processed' });
    } catch (error: any) {
      console.error("Typeform webhook error:", error);
      // Still return 200 to prevent Typeform from retrying
      res.json({ received: true, error: error.message });
    }
  });

  // Email verification endpoints for checkout flow
  app.post("/api/email/send-verification", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ message: "Valid email address is required" });
      }
      
      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store verification in database
      await storage.createEmailVerification(email, code);
      
      // Send verification email via Resend
      const sent = await sendVerificationEmail({ email, code });
      
      if (sent) {
        res.json({ 
          message: "Verification code sent to your email",
          expiresIn: 600 // 10 minutes in seconds
        });
      } else {
        res.status(500).json({ message: "Failed to send verification email. Please try again." });
      }
    } catch (error: any) {
      console.error("Email verification send error:", error);
      res.status(500).json({ message: "Failed to send verification code" });
    }
  });
  
  app.post("/api/email/verify", async (req, res) => {
    try {
      const { email, code } = req.body;
      
      if (!email || !code) {
        return res.status(400).json({ message: "Email and code are required" });
      }
      
      const verification = await storage.getEmailVerification(email, code);
      
      if (!verification) {
        return res.status(400).json({ message: "Invalid or expired verification code" });
      }
      
      // Mark as verified
      await storage.markEmailVerified(email);
      
      res.json({ 
        message: "Email verified successfully",
        verified: true
      });
    } catch (error: any) {
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Verification failed. Please try again." });
    }
  });

  // Recommendation submission endpoint
  app.post("/api/recommendations", async (req, res) => {
    try {
      const validationResult = insertRecommendationSubmissionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromError(validationResult.error);
        return res.status(400).json({ 
          message: validationError.message 
        });
      }

      const submission = await storage.createRecommendationSubmission(validationResult.data);
      
      res.status(201).json({ 
        message: "We're honored to guide your journey. You'll hear from us within 24 hours.",
        submission: {
          id: submission.id,
          recommendedPath: submission.recommendedPath,
        }
      });
    } catch (error: any) {
      console.error("Recommendation submission error:", error);
      res.status(500).json({ 
        message: "We encountered an issue saving your information. Please try again." 
      });
    }
  });

  // Waitlist submission endpoint - creates contact + waitlist entry
  app.post("/api/waitlist", async (req, res) => {
    try {
      const { email, name, motivation, retreatType, consentText } = req.body;
      
      // Validate contact data
      const contactValidation = insertContactSchema.safeParse({
        email,
        name,
        consentGiven: "true",
        consentText,
        source: "waitlist"
      });

      if (!contactValidation.success) {
        const validationError = fromError(contactValidation.error);
        return res.status(400).json({ message: validationError.message });
      }

      // Check if contact already exists
      let contact = await storage.getContactByEmail(email);
      let isNewContact = false;
      if (!contact) {
        contact = await storage.createContact(contactValidation.data);
        isNewContact = true;
      }

      // Add waitlist channel to contact's channels reached
      await storage.addChannelToContact(email, 'Waitlist');

      // Sync contact to Notion CRM with updated channels (async, don't block response)
      syncContactWithNotion(contact.id).catch(err => 
        console.log('Notion sync deferred:', err.message)
      );

      // Validate waitlist entry
      const entryValidation = insertWaitlistEntrySchema.safeParse({
        contactId: contact.id,
        motivation,
        retreatType
      });

      if (!entryValidation.success) {
        const validationError = fromError(entryValidation.error);
        return res.status(400).json({ message: validationError.message });
      }

      const entry = await storage.createWaitlistEntry(entryValidation.data);

      sendWaitlistConfirmationEmail({
        email,
        name: name || null,
        retreatType: retreatType || '',
        motivation: motivation || '',
      }).catch(err => console.log('Waitlist confirmation email failed:', err.message));

      res.status(201).json({
        message: "You're on the list! We'll reach out when spots open up.",
        entry: { id: entry.id }
      });
    } catch (error: any) {
      console.error("Waitlist submission error:", error);
      res.status(500).json({
        message: "We encountered an issue. Please try again."
      });
    }
  });

  // Contact form submission endpoint
  app.post("/api/contacts", async (req, res) => {
    try {
      const { name, email, message, intent } = req.body;
      
      // Validate contact message data
      const validation = insertContactMessageSchema.safeParse({
        name,
        email,
        message,
        intent
      });

      if (!validation.success) {
        const validationError = fromError(validation.error);
        return res.status(400).json({ message: validationError.message });
      }

      const contactMessage = await storage.createContactMessage(validation.data);

      sendContactFormEmails({
        name,
        email,
        message,
        intent: intent || 'general',
      }).catch(err => console.log('Contact form email failed:', err.message));

      res.status(201).json({
        message: "We're grateful for your message. We'll respond with care and attention within 24 hours.",
        contactMessage: { id: contactMessage.id }
      });
    } catch (error: any) {
      console.error("Contact form submission error:", error);
      res.status(500).json({
        message: "We encountered an issue. Please try again."
      });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email, name, consentText } = req.body;

      const contactValidation = insertContactSchema.safeParse({
        email,
        name,
        consentGiven: "true",
        consentText,
        source: "newsletter"
      });

      if (!contactValidation.success) {
        const validationError = fromError(contactValidation.error);
        return res.status(400).json({ message: validationError.message });
      }

      // Check if contact already exists
      let contact = await storage.getContactByEmail(email);
      let isNewContact = false;
      if (!contact) {
        contact = await storage.createContact(contactValidation.data);
        isNewContact = true;
      }

      // Add newsletter channel to contact's channels reached
      await storage.addChannelToContact(email, 'Newsletter');

      // Sync contact to Notion CRM with updated channels (async, don't block response)
      syncContactWithNotion(contact.id).catch(err => 
        console.log('Notion sync deferred:', err.message)
      );

      const subscription = await storage.createNewsletterSubscription({
        contactId: contact.id
      });

      if (contactValidation.data.consentGiven === 'true') {
        sendNewsletterConfirmationEmail({
          email,
          name: name || null,
        }).catch(err => console.log('Newsletter confirmation email failed:', err.message));
      }

      res.status(201).json({
        message: "Welcome to the community!",
        subscription: { id: subscription.id }
      });
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      res.status(500).json({
        message: "We encountered an issue. Please try again."
      });
    }
  });

  app.post("/api/scan-interest", async (req, res) => {
    try {
      const { email, name, consentText } = req.body;

      const contactValidation = insertContactSchema.safeParse({
        email,
        name,
        consentGiven: "true",
        consentText,
        source: "scan_interest"
      });

      if (!contactValidation.success) {
        const validationError = fromError(contactValidation.error);
        return res.status(400).json({ message: validationError.message });
      }

      let contact = await storage.getContactByEmail(email);
      let isNewContact = false;
      if (!contact) {
        contact = await storage.createContact(contactValidation.data);
        isNewContact = true;
      }

      await storage.addChannelToContact(email, 'Scan Interest');

      syncContactWithNotion(contact.id).catch(err => 
        console.log('Notion sync deferred:', err.message)
      );

      const subscription = await storage.createNewsletterSubscription({
        contactId: contact.id
      });

      if (contactValidation.data.consentGiven === 'true') {
        sendScanInterestConfirmationEmail({
          email,
          name: name || null,
        }).catch(err => console.log('Scan interest confirmation email failed:', err.message));
      }

      sendScanInterestAdminNotification({
        email,
        name: name || null,
      }).catch(err => console.log('Scan interest admin notification failed:', err.message));

      res.status(201).json({
        message: "Check your inbox for your free prompts!",
        subscription: { id: subscription.id }
      });
    } catch (error: any) {
      console.error("Scan interest subscription error:", error);
      res.status(500).json({
        message: "We encountered an issue. Please try again."
      });
    }
  });

  // Check-my-FLOW assessment endpoint
  app.post("/api/flow-check", async (req, res) => {
    try {
      const { email, name, consentText, situation, customSituation, role, motivation, challenge, competence } = req.body;

      const m = Math.min(10, Math.max(0, Math.round(Number(motivation))));
      const ch = Math.min(10, Math.max(0, Math.round(Number(challenge))));
      const co = Math.min(10, Math.max(0, Math.round(Number(competence))));

      if (isNaN(m) || isNaN(ch) || isNaN(co)) {
        return res.status(400).json({ message: "motivation, challenge, and competence must be numbers between 0-10" });
      }

      // Motivation shifts perceived challenge (matching the frontend formula)
      const effCh = Math.min(10, Math.max(0, ch + (m - 5) * 0.8));
      let zone: "flow" | "challenge" | "comfort" | "danger";
      if (effCh >= 5 && co >= 5) {
        zone = "flow";
      } else if (effCh >= 5 && co < 5) {
        zone = "challenge";
      } else if (effCh < 5 && co >= 5) {
        zone = "comfort";
      } else {
        zone = "danger";
      }

      const displaySituation = situation === 'other' && customSituation ? customSituation : situation;

      const resultValidation = insertFlowCheckResultSchema.safeParse({
        situation: displaySituation,
        customSituation: customSituation || null,
        role,
        motivation: m,
        challenge: ch,
        competence: co,
        zone,
        contactId: null,
      });

      if (!resultValidation.success) {
        const validationError = fromError(resultValidation.error);
        return res.status(400).json({ message: validationError.message });
      }

      const result = await storage.createFlowCheckResult(resultValidation.data);

      if (email && consentText) {
        const contactValidation = insertContactSchema.safeParse({
          email,
          name,
          consentGiven: "true",
          consentText,
          source: "flow_check"
        });

        if (contactValidation.success) {
          let contact = await storage.getContactByEmail(email);
          if (!contact) {
            contact = await storage.createContact(contactValidation.data);
          }

          await storage.addChannelToContact(email, 'Flow Check');

          syncContactWithNotion(contact.id).catch(err =>
            console.log('Notion sync deferred:', err.message)
          );

          sendFlowCheckResultEmail({
            email,
            name: name || null,
            zone,
            situation: displaySituation,
            role,
            motivation: m,
            challenge: ch,
            competence: co,
          }).catch(err => console.log('Flow check result email failed:', err.message));

          sendFlowCheckAdminNotification({
            email,
            name: name || null,
            zone,
            situation: displaySituation,
            role,
            motivation: m,
            challenge: ch,
            competence: co,
          }).catch(err => console.log('Flow check admin notification failed:', err.message));
        }
      }

      const zoneLabels: Record<string, string> = {
        flow: "Flow Zone",
        challenge: "Challenge / Stress Zone",
        comfort: "Comfort Zone",
        danger: "Danger / Apathy Zone"
      };

      res.status(201).json({
        zone,
        zoneLabel: zoneLabels[zone],
        motivation: m,
        challenge: ch,
        competence: co,
        situation: displaySituation,
        role,
        resultId: result.id,
      });
    } catch (error: any) {
      console.error("Flow check submission error:", error);
      res.status(500).json({
        message: "We encountered an issue processing your flow check. Please try again."
      });
    }
  });

  // ── AGENT-READABLE MACHINE API ──────────────────────────────────────────────
  // Structured JSON endpoints for AI agents, LLMs, and automated systems.
  // These are public, cacheable, and intentionally flat/parseable.

  app.get("/api/services", (_req, res) => {
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.json({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "GreenElephant Services",
      "description": "Conscious communication coaching, assessments, and retreats by GreenElephant.",
      "url": "https://greenelephant.org",
      "itemListElement": [
        {
          "@type": "Service",
          "position": 1,
          "name": "Satellite Scan — Communication Diagnostic",
          "description": "AI-powered assessment mapping your communication patterns across 8 lenses (Influence, Attitude, Chaordic, Flow, Alignment, Needs, Ego, Dynamics). 129 questions. Delivered as a visual dashboard. Used as the baseline for all coaching.",
          "url": "https://greenelephant.org/scan",
          "serviceType": "Communication Assessment",
          "audience": "Executive Assistants, Founders, Team Leaders, Virtual Assistants",
          "offers": { "@type": "Offer", "price": "99.95", "priceCurrency": "EUR", "availability": "https://schema.org/InStock" },
          "format": "Online self-assessment + PDF report",
          "duration": "Approximately 45 minutes"
        },
        {
          "@type": "Service",
          "position": 2,
          "name": "Check-my-FLOW — Free Flow Assessment",
          "description": "Free 5-minute assessment based on Csikszentmihalyi's 1988 flow model. Measures perceived Motivation, Challenge, and Competence in a specific communication situation. Maps you to one of 4 zones: Flow, Challenge/Stress, Comfort, or Danger/Apathy.",
          "url": "https://greenelephant.org/flow-check",
          "serviceType": "Communication Assessment",
          "audience": "Anyone navigating a challenging communication context",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR", "availability": "https://schema.org/InStock" },
          "format": "Online multi-step form with instant results",
          "duration": "Approximately 5 minutes"
        },
        {
          "@type": "Service",
          "position": 3,
          "name": "Coaching Journey",
          "description": "Comprehensive communication coaching program. Includes Satellite Scan as baseline, biweekly 120-minute sessions, unlimited check-in calls, and ongoing messaging support. Continues until your personalised SMART communication goal is reached.",
          "url": "https://greenelephant.org/coaching",
          "serviceType": "Executive Communication Coaching",
          "audience": "Leaders, Executives, Founders seeking deep behavioural change",
          "offers": { "@type": "Offer", "price": "2980", "priceCurrency": "EUR", "availability": "https://schema.org/InStock" },
          "format": "Video call sessions (remote)",
          "duration": "Approximately 6 months"
        },
        {
          "@type": "Service",
          "position": 4,
          "name": "Single Coaching Session",
          "description": "One-off 120-minute deep-dive into your communication patterns. Uses Satellite Scan results to identify triggers, blind spots, and strengths. Co-creates micro-habits for your specific context.",
          "url": "https://greenelephant.org/coaching",
          "serviceType": "Executive Communication Coaching",
          "audience": "Individuals wanting targeted support for a specific communication challenge",
          "offers": { "@type": "Offer", "price": "295", "priceCurrency": "EUR", "availability": "https://schema.org/InStock" },
          "format": "Video call (remote)",
          "duration": "120 minutes"
        },
        {
          "@type": "Service",
          "position": 5,
          "name": "Team Communication Workshop",
          "description": "Interactive half-day or full-day workshop using the Periodic Table of Conscious Communication. Builds shared language, reduces conflict, and installs communication micro-habits across a team.",
          "url": "https://greenelephant.org/coaching",
          "serviceType": "Team Workshop",
          "audience": "Teams of 6–30, HR managers, People & Culture leaders",
          "offers": { "@type": "Offer", "price": "1200", "priceCurrency": "EUR", "availability": "https://schema.org/InStock" },
          "format": "In-person or virtual",
          "duration": "Half-day or full-day"
        },
        {
          "@type": "Service",
          "position": 6,
          "name": "Conscious Communication Retreat — Finland",
          "description": "Multi-day immersive retreat in the Finnish archipelago combining conscious communication practice with nature, movement, and stillness. Limited cohorts. Apply to join the waitlist.",
          "url": "https://greenelephant.org/retreats",
          "serviceType": "Immersive Retreat",
          "audience": "Leaders, coaches, and professionals seeking deep reflection and renewal",
          "offers": { "@type": "Offer", "price": "2800", "priceCurrency": "EUR", "availability": "https://schema.org/LimitedAvailability" },
          "format": "In-person, Finland",
          "duration": "4–5 days"
        }
      ]
    });
  });

  app.get("/api/coaches", (_req, res) => {
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.json({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "GreenElephant Coaches",
      "itemListElement": [
        {
          "@type": "Person",
          "position": 1,
          "name": "Esteve Camprubí",
          "jobTitle": "Founder & Lead Communication Coach",
          "description": "Communication strategist and coach. Creator of the Periodic Table of Conscious Communication and the Satellite Scan diagnostic. Works with Executive Assistants, TEAL founders, and innovation leaders across Europe.",
          "url": "https://greenelephant.org/team",
          "email": "esteve@greenelephant.org",
          "knowsAbout": ["Conscious Communication", "Executive Coaching", "Behavioural Change", "TEAL Organisations", "Flow Theory", "Micro-habits"],
          "worksFor": { "@type": "Organization", "name": "GreenElephant", "url": "https://greenelephant.org" },
          "availableLanguage": ["English", "Spanish", "Catalan", "French"]
        },
        {
          "@type": "Person",
          "position": 2,
          "name": "Anu Moisio",
          "jobTitle": "Retreat Host & Movement Coach",
          "description": "Yoga teacher and movement specialist. Co-hosts the GreenElephant retreats in Finland. Integrates somatic practice and conscious presence into communication coaching.",
          "url": "https://greenelephant.org/team",
          "knowsAbout": ["Yoga", "Somatic Practice", "Retreat Facilitation", "Conscious Movement", "Mindfulness"],
          "worksFor": { "@type": "Organization", "name": "GreenElephant", "url": "https://greenelephant.org" },
          "availableLanguage": ["English", "Finnish"]
        }
      ]
    });
  });

  // ── ADMIN ENDPOINTS ──────────────────────────────────────────────────────────

  // Admin: get all flow check results
  app.get("/api/admin/flow-checks", requireAdminAuth, async (req, res) => {
    try {
      const results = await storage.getAllFlowCheckResults();
      res.json(results);
    } catch (error: any) {
      console.error("Error fetching flow check results:", error);
      res.status(500).json({ message: "Failed to load flow check results" });
    }
  });

  // Webinar/Play Labs waitlist endpoint (GDPR-compliant)
  app.post("/api/webinar-waitlist", async (req, res) => {
    try {
      const { email, name, consentText, preferredLens, interests } = req.body;

      // Validate contact with GDPR consent
      const contactValidation = insertContactSchema.safeParse({
        email,
        name,
        consentGiven: "true",
        consentText,
        source: "webinar"
      });

      if (!contactValidation.success) {
        const validationError = fromError(contactValidation.error);
        return res.status(400).json({ message: validationError.message });
      }

      // Check if contact already exists
      let contact = await storage.getContactByEmail(email);
      let isNewContact = false;
      if (!contact) {
        contact = await storage.createContact(contactValidation.data);
        isNewContact = true;
      }

      // Add webinar channel to contact's channels reached
      await storage.addChannelToContact(email, 'Webinar');

      // Sync contact to Notion CRM with updated channels (async, don't block response)
      syncContactWithNotion(contact.id).catch(err => 
        console.log('Notion sync deferred:', err.message)
      );

      // Validate and create webinar waitlist entry
      const waitlistValidation = insertWebinarWaitlistEntrySchema.safeParse({
        contactId: contact.id,
        preferredLens,
        interests
      });

      if (!waitlistValidation.success) {
        const validationError = fromError(waitlistValidation.error);
        return res.status(400).json({ message: validationError.message });
      }

      const waitlistEntry = await storage.createWebinarWaitlistEntry(waitlistValidation.data);

      // Send confirmation email (async, don't block response)
      sendWebinarWaitlistConfirmation({
        customerEmail: email,
        customerName: name || null,
        preferredLens
      }).catch(err => console.log('Webinar email notification failed:', err.message));

      res.status(201).json({
        message: "You're on the list! We'll notify you when our next Play Labs session is scheduled.",
        waitlistEntry: { id: waitlistEntry.id }
      });
    } catch (error: any) {
      console.error("Webinar waitlist error:", error);
      res.status(500).json({
        message: "We encountered an issue. Please try again."
      });
    }
  });

  // Signals quiz submission endpoint
  app.post("/api/signals-quiz", async (req, res) => {
    try {
      const { score, answers, email, name, consentText } = req.body;

      let contactId = null;

      // If email provided, create/get contact
      if (email) {
        const contactValidation = insertContactSchema.safeParse({
          email,
          name,
          consentGiven: "true",
          consentText: consentText || "I consent to receive my quiz results",
          source: "quiz"
        });

        if (contactValidation.success) {
          let contact = await storage.getContactByEmail(email);
          let isNewContact = false;
          if (!contact) {
            contact = await storage.createContact(contactValidation.data);
            isNewContact = true;
          }
          contactId = contact.id;
          
          // Add quiz channel to contact's channels reached
          await storage.addChannelToContact(email, 'Quiz');
          
          // Sync contact to Notion CRM with updated channels (async, don't block response)
          syncContactWithNotion(contact.id).catch(err => 
            console.log('Notion sync deferred:', err.message)
          );
        }
      }

      const quizValidation = insertSignalsQuizResultSchema.safeParse({
        contactId,
        score, // Zod will coerce to number and validate bounds (0-100)
        answers
      });

      if (!quizValidation.success) {
        const validationError = fromError(quizValidation.error);
        return res.status(400).json({ message: validationError.message });
      }

      const result = await storage.createSignalsQuizResult(quizValidation.data);
      const averageScore = await storage.getQuizAverageScore();

      if (email && (consentText || contactId)) {
        sendQuizResultsEmail({
          email,
          name: name || null,
          score: parseInt(result.score),
          averageScore,
        }).catch(err => console.log('Quiz results email failed:', err.message));
      }

      res.status(201).json({
        message: "Quiz complete!",
        result: {
          id: result.id,
          score: parseInt(result.score),
          averageScore
        }
      });
    } catch (error: any) {
      console.error("Signals quiz submission error:", error);
      res.status(500).json({
        message: "We encountered an issue. Please try again."
      });
    }
  });

  // Get signals quiz average score
  app.get("/api/signals-quiz/average", async (_req, res) => {
    try {
      const averageScore = await storage.getQuizAverageScore();
      res.json({ averageScore });
    } catch (error: any) {
      console.error("Quiz average fetch error:", error);
      res.status(500).json({
        message: "Could not fetch average score"
      });
    }
  });

  // Admin login endpoint (password-based, auto-creates super_admin on first login)
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ message: "Password required" });
      }
      
      if (await verifyAdminPassword(password)) {
        const bootstrapEmail = "esteve@greenelephant.org";
        let adminUser = await storage.getAdminUserByEmail(bootstrapEmail);
        if (!adminUser) {
          adminUser = await storage.createAdminUser({
            email: bootstrapEmail,
            name: "Esteve",
            role: "super_admin",
            invitedBy: null,
            isActive: "true",
            avatarUrl: null,
            googleId: null,
          });
        }

        if (adminUser.isActive !== "true") {
          return res.status(403).json({ message: "Account is disabled" });
        }

        req.session.isAdmin = true;
        req.session.adminUserId = adminUser.id;
        req.session.adminEmail = adminUser.email;
        req.session.adminRole = adminUser.role;

        await storage.updateAdminUser(adminUser.id, { lastLoginAt: new Date() });

        const existingPortalUser = await storage.getClientUserByEmail(adminUser.email);
        if (!existingPortalUser) {
          await storage.createClientUser({
            email: adminUser.email,
            name: adminUser.name || adminUser.email.split("@")[0],
            googleId: null,
            avatarUrl: null,
          });
        }

        const existingHash = await storage.getAdminSetting("admin_password_hash");
        if (!existingHash) {
          const hashed = await hashAdminPassword(password);
          await storage.setAdminSetting("admin_password_hash", hashed);
        }
        
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return res.status(500).json({ message: "Login failed" });
          }
          logAuditEvent(adminUser!.email, "admin_login", "/admin/login", { method: "password" });
          res.json({ message: "Login successful" });
        });
      } else {
        res.status(401).json({ message: "Incorrect password" });
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Admin password change (super_admin only)
  app.post("/api/admin/change-password", requireAdminAuth, requireAdminRole("super_admin"), async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new password required" });
      }
      if (!(await verifyAdminPassword(currentPassword))) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters" });
      }
      const hashed = await hashAdminPassword(newPassword);
      await storage.setAdminSetting("admin_password_hash", hashed);
      logAuditEvent(
        req.session?.adminEmail || "unknown",
        "change_admin_password",
        "admin_settings",
        {},
        req.ip
      );
      res.json({ message: "Password updated. Note: The ADMIN_PASSWORD environment variable should also be updated to match." });
    } catch (error: any) {
      console.error("Password change error:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  // Admin Google Auth
  app.get("/api/admin/auth/google", async (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({ message: "Google login is not configured" });
    }

    const { randomBytes } = await import("crypto");
    const state = randomBytes(16).toString("hex");
    req.session.adminOAuthState = state;

    const { getBaseUrl } = await import("./portal-auth");
    const redirectUri = `${getBaseUrl(req)}/api/admin/auth/google/callback`;
    const scope = encodeURIComponent("openid email profile");
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=select_account&state=${state}`;

    console.log("Admin Google OAuth: redirecting to Google. Redirect URI:", redirectUri);

    req.session.save(() => {
      res.redirect(authUrl);
    });
  });

  app.get("/api/admin/auth/google/callback", async (req, res) => {
    try {
      const { code, state, error: googleError } = req.query;

      if (googleError) {
        console.error("Admin Google OAuth returned error:", googleError, req.query);
        return res.redirect(`/admin/login?error=google_${googleError}`);
      }

      if (!code) {
        console.warn("Admin Google OAuth callback: no code received. Query:", req.query);
        return res.redirect("/admin/login?error=no_code");
      }

      if (state !== req.session.adminOAuthState) {
        console.warn("Admin Google OAuth state mismatch. Session state:", req.session?.adminOAuthState ? "present" : "missing", "Query state:", state ? "present" : "missing");
        return res.redirect("/admin/login?error=state_mismatch");
      }
      delete req.session.adminOAuthState;

      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        return res.redirect("/admin/login?error=not_configured");
      }

      const { getBaseUrl: getBase } = await import("./portal-auth");
      const redirectUri = `${getBase(req)}/api/admin/auth/google/callback`;

      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: code as string,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        return res.redirect("/admin/login?error=token_failed");
      }

      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const googleUser = await userInfoRes.json();

      if (!googleUser.email) {
        return res.redirect("/admin/login?error=no_email");
      }

      const normalizedEmail = googleUser.email.toLowerCase();

      let adminUser = await storage.getAdminUserByGoogleId(googleUser.id);

      if (!adminUser) {
        adminUser = await storage.getAdminUserByEmail(normalizedEmail);
        if (adminUser) {
          adminUser = await storage.updateAdminUser(adminUser.id, {
            googleId: googleUser.id,
            avatarUrl: googleUser.picture || adminUser.avatarUrl,
            name: adminUser.name || googleUser.name,
            lastLoginAt: new Date(),
          }) || adminUser;
        }
      } else {
        await storage.updateAdminUser(adminUser.id, { lastLoginAt: new Date() });
      }

      if (!adminUser || adminUser.isActive !== "true") {
        return res.redirect("/admin/login?error=not_authorized");
      }

      req.session.isAdmin = true;
      req.session.adminUserId = adminUser.id;
      req.session.adminEmail = adminUser.email;
      req.session.adminRole = adminUser.role;

      // Cascading portal access: auto-create/link client user
      let clientUser = await storage.getClientUserByEmail(normalizedEmail);
      if (!clientUser) {
        clientUser = await storage.createClientUser({
          email: normalizedEmail,
          name: googleUser.name || adminUser.name,
          googleId: googleUser.id,
          avatarUrl: googleUser.picture,
        });
      } else if (!clientUser.googleId) {
        await storage.updateClientUser(clientUser.id, {
          googleId: googleUser.id,
          avatarUrl: googleUser.picture || clientUser.avatarUrl,
          name: clientUser.name || googleUser.name,
        });
      }

      req.session.save((err) => {
        if (err) {
          console.error("Session save error after admin Google auth:", err);
          return res.redirect("/admin/login?error=session_failed");
        }
        logAuditEvent(normalizedEmail, "admin_login", "/admin", { method: "google", role: adminUser!.role });
        res.redirect("/admin/submissions");
      });
    } catch (error: any) {
      console.error("Admin Google OAuth error:", error);
      res.redirect("/admin/login?error=callback_failed");
    }
  });

  // Admin logout endpoint
  app.post("/api/admin/logout", async (req, res) => {
    const email = req.session?.adminEmail;
    if (req.session) {
      req.session.isAdmin = false;
      req.session.adminUserId = undefined;
      req.session.adminEmail = undefined;
      req.session.adminRole = undefined;
    }
    if (email) {
      logAuditEvent(email, "admin_logout", "/admin");
    }
    res.json({ message: "Logged out successfully" });
  });

  // Check admin authentication status
  app.get("/api/admin/check", async (req, res) => {
    const isAuthenticated = req.session && req.session.isAdmin === true;
    if (isAuthenticated && req.session?.adminUserId) {
      const adminUser = await storage.getAdminUserById(req.session.adminUserId);
      return res.json({
        isAuthenticated: true,
        user: adminUser ? {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          avatarUrl: adminUser.avatarUrl,
          role: adminUser.role,
        } : null,
        role: req.session.adminRole,
      });
    }
    res.json({ isAuthenticated: !!isAuthenticated, role: req.session?.adminRole || null });
  });

  // Access Control API routes (super_admin only)
  app.get("/api/admin/team", requireAdminAuth, requireAdminRole("super_admin"), async (_req, res) => {
    try {
      const users = await storage.getAllAdminUsers();
      res.json(users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        avatarUrl: u.avatarUrl,
        role: u.role,
        invitedBy: u.invitedBy,
        isActive: u.isActive,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
      })));
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.post("/api/admin/team/invite", requireAdminAuth, requireAdminRole("super_admin"), async (req, res) => {
    try {
      const { email, role, name } = req.body;
      if (!email || !role) {
        return res.status(400).json({ message: "Email and role required" });
      }
      const validRoles = ["super_admin", "admin", "viewer"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be super_admin, admin, or viewer" });
      }
      const normalizedEmail = email.toLowerCase().trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return res.status(400).json({ message: "Invalid email address" });
      }
      if (!normalizedEmail.endsWith("@greenelephant.org")) {
        return res.status(400).json({ message: "Team members must use a @greenelephant.org email address" });
      }
      const existing = await storage.getAdminUserByEmail(normalizedEmail);
      if (existing) {
        return res.status(409).json({ message: "This user already has admin access" });
      }
      const adminUser = await storage.createAdminUser({
        email: normalizedEmail,
        name: name || null,
        role,
        invitedBy: req.session?.adminEmail || null,
        isActive: "true",
        avatarUrl: null,
        googleId: null,
      });
      const existingPortalUser = await storage.getClientUserByEmail(normalizedEmail);
      if (!existingPortalUser) {
        await storage.createClientUser({
          email: normalizedEmail,
          name: name || normalizedEmail.split("@")[0],
          googleId: null,
          avatarUrl: null,
        });
      }
      logAuditEvent(
        req.session?.adminEmail || "unknown",
        "invite_team_member",
        "admin_users",
        { invitedEmail: normalizedEmail, role },
        req.ip
      );
      res.json(adminUser);
    } catch (error: any) {
      console.error("Team invite error:", error);
      res.status(500).json({ message: "Failed to invite team member" });
    }
  });

  app.patch("/api/admin/team/:id", requireAdminAuth, requireAdminRole("super_admin"), async (req, res) => {
    try {
      const { role, isActive } = req.body;
      const validRoles = ["super_admin", "admin", "viewer"];
      const validActiveValues = ["true", "false"];
      const updates: any = {};
      if (role) {
        if (!validRoles.includes(role)) {
          return res.status(400).json({ message: "Invalid role" });
        }
        updates.role = role;
      }
      if (isActive !== undefined) {
        if (!validActiveValues.includes(isActive)) {
          return res.status(400).json({ message: "isActive must be 'true' or 'false'" });
        }
        updates.isActive = isActive;
      }
      const updated = await storage.updateAdminUser(req.params.id, updates);
      if (!updated) {
        return res.status(404).json({ message: "User not found" });
      }
      logAuditEvent(
        req.session?.adminEmail || "unknown",
        "update_team_member",
        "admin_users",
        { targetUser: updated.email, changes: updates },
        req.ip
      );
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update team member" });
    }
  });

  app.delete("/api/admin/team/:id", requireAdminAuth, requireAdminRole("super_admin"), async (req, res) => {
    try {
      const user = await storage.getAdminUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.role === "super_admin") {
        return res.status(403).json({ message: "Cannot remove a super admin" });
      }
      await storage.deleteAdminUser(req.params.id);
      logAuditEvent(
        req.session?.adminEmail || "unknown",
        "remove_team_member",
        "admin_users",
        { removedEmail: user.email },
        req.ip
      );
      res.json({ message: "Team member removed" });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to remove team member" });
    }
  });

  // Audit log endpoints
  app.get("/api/admin/audit-logs", requireAdminAuth, requireAdminRole("super_admin"), async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const offset = parseInt(req.query.offset as string) || 0;
      const filters: { userEmail?: string; actionType?: string } = {};
      if (req.query.userEmail) filters.userEmail = req.query.userEmail as string;
      if (req.query.actionType) filters.actionType = req.query.actionType as string;
      const logs = await storage.getAuditLogs(limit, offset, filters);
      const total = await storage.getAuditLogCount(filters);
      res.json({ logs, total });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // Admin endpoints for viewing submissions (protected)
  app.get("/api/admin/waitlist", requireAdminAuth, async (_req, res) => {
    try {
      const entries = await storage.getAllWaitlistEntries();
      res.json(entries);
    } catch (error: any) {
      console.error("Admin waitlist fetch error:", error);
      res.status(500).json({ message: "Could not fetch waitlist entries" });
    }
  });

  app.get("/api/admin/newsletter", requireAdminAuth, async (_req, res) => {
    try {
      const subscriptions = await storage.getAllNewsletterSubscriptions();
      res.json(subscriptions);
    } catch (error: any) {
      console.error("Admin newsletter fetch error:", error);
      res.status(500).json({ message: "Could not fetch newsletter subscriptions" });
    }
  });

  app.get("/api/admin/quiz", requireAdminAuth, async (_req, res) => {
    try {
      const results = await storage.getAllSignalsQuizResults();
      res.json(results);
    } catch (error: any) {
      console.error("Admin quiz fetch error:", error);
      res.status(500).json({ message: "Could not fetch quiz results" });
    }
  });

  app.get("/api/admin/recommendations", requireAdminAuth, async (_req, res) => {
    try {
      const submissions = await storage.getAllRecommendationSubmissions();
      res.json(submissions);
    } catch (error: any) {
      console.error("Admin recommendations fetch error:", error);
      res.status(500).json({ message: "Could not fetch recommendations" });
    }
  });

  // Satellitescan payment route (€99.95)
  app.post("/api/satellitescan/create-payment-intent", async (req, res) => {
    console.log("📦 Satellite Scan payment intent request received");
    
    if (!stripe) {
      console.error("❌ Stripe not configured");
      return res.status(503).json({ 
        message: "Payment processing is currently unavailable. Please contact support." 
      });
    }
    if (!(await isConnectorEnabled("stripe"))) {
      return res.status(503).json({
        message: "Payment processing is currently disabled. Please contact support."
      });
    }

    try {
      const { customerEmail, customerName } = req.body;
      console.log("📧 Customer:", customerEmail, customerName);
      
      // Satellite Scan pricing: €99.95 (server-side validation)
      const SATELLITE_SCAN_PRICE = 99.95;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(SATELLITE_SCAN_PRICE * 100), // Convert to cents
        currency: "eur",
        metadata: {
          product: "satellitescan",
          customerEmail: customerEmail || '',
          customerName: customerName || '',
        },
        receipt_email: customerEmail || undefined,
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Satellitescan payment intent error:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post("/api/subscription/create-payment-intent", async (req, res) => {
    console.log("📦 Portal subscription payment intent request received");
    
    if (!stripe) {
      return res.status(503).json({ 
        message: "Payment processing is currently unavailable. Please contact support." 
      });
    }
    if (!(await isConnectorEnabled("stripe"))) {
      return res.status(503).json({
        message: "Payment processing is currently disabled. Please contact support."
      });
    }

    try {
      const { customerEmail, customerName, couponCode } = req.body;
      
      const SUBSCRIPTION_PRICE = 9.95;
      let finalAmount = SUBSCRIPTION_PRICE;
      let appliedCoupon: string | null = null;

      let couponStatus: string | null = null;

      if (couponCode) {
        const coupon = await storage.getCouponByCode(couponCode);
        if (!coupon || coupon.isActive !== "true") {
          couponStatus = "invalid";
        } else {
          const withinUsageLimit = !coupon.maxUses || parseInt(coupon.usedCount) < parseInt(coupon.maxUses);
          if (!withinUsageLimit) {
            couponStatus = "exhausted";
          } else {
            const discount = parseFloat(coupon.discountAmount);
            finalAmount = Math.max(0, SUBSCRIPTION_PRICE - discount);
            appliedCoupon = couponCode;
            couponStatus = "applied";
          }
        }
      }

      if (finalAmount < 0.50) {
        return res.json({ clientSecret: null, freeAccess: true, amount: 0, couponStatus });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(finalAmount * 100),
        currency: "eur",
        metadata: {
          product: "portal_subscription",
          packageId: "portal_subscription",
          packageName: `Portal Subscription${appliedCoupon ? ' (Coupon: ' + appliedCoupon + ')' : ''}`,
          customerEmail: customerEmail || '',
          customerName: customerName || '',
          couponCode: appliedCoupon || '',
        },
        receipt_email: customerEmail || undefined,
      });
      
      res.json({ clientSecret: paymentIntent.client_secret, amount: finalAmount, couponStatus });
    } catch (error: any) {
      console.error("Subscription payment intent error:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post("/api/subscription/free-purchase", async (req, res) => {
    try {
      const { customerEmail, customerName, couponCode } = req.body;

      if (!customerEmail || !couponCode) {
        return res.status(400).json({ success: false, message: "Email and coupon code are required" });
      }

      const coupon = await storage.getCouponByCode(couponCode);
      if (!coupon || coupon.isActive !== "true") {
        return res.status(400).json({ success: false, message: "Invalid or inactive coupon" });
      }
      if (coupon.maxUses && parseInt(coupon.usedCount) >= parseInt(coupon.maxUses)) {
        return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
      }
      const SUBSCRIPTION_PRICE = 9.95;
      const discountedAmount = Math.max(0, SUBSCRIPTION_PRICE - parseFloat(coupon.discountAmount));
      if (discountedAmount >= 0.50) {
        return res.status(400).json({ success: false, message: "Coupon does not cover full subscription price" });
      }

      await storage.incrementCouponUsage(coupon.id);

      const freePurchaseId = `FREE-SUB-${crypto.randomUUID()}`;

      let clientUser = await storage.getClientUserByEmail(customerEmail);
      if (!clientUser) {
        clientUser = await storage.createClientUser({
          email: customerEmail,
          name: customerName || null,
          passwordHash: null,
          googleId: null,
          linkedinSub: null,
          linkedinAccessToken: null,
          avatarUrl: null,
          notionAccessToken: null,
          notionWorkspaceId: null,
        });
      }

      const existingSub = await storage.getClientSubscriptionByUserId(clientUser.id);
      if (!existingSub) {
        await storage.createClientSubscription({
          userId: clientUser.id,
          stripeCustomerId: null,
          stripeSubscriptionId: freePurchaseId,
          status: "active",
          plan: "portal_subscription",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        });
      } else {
        await storage.updateClientSubscription(existingSub.id, {
          status: "active",
          stripeSubscriptionId: freePurchaseId,
          currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        });
      }

      try {
        await markContactAsCustomer(customerEmail, {
          productName: 'Portal Subscription (Free - ' + couponCode + ')',
          amount: '0.00',
          customerName: customerName || undefined
        });
        await storage.addChannelToContact(customerEmail, 'Purchase');
      } catch (err: any) {
        console.log('Notion sync for free subscription error:', err.message);
      }

      console.log(`✅ Free subscription activated for ${customerEmail} using coupon ${couponCode}`);

      res.json({ success: true, message: "Free subscription activated!", purchaseId: freePurchaseId });
    } catch (error: any) {
      console.error("Free subscription error:", error);
      res.status(500).json({ success: false, message: "Error processing free subscription: " + error.message });
    }
  });

  // Free purchase endpoint for 100% discount coupons
  app.post("/api/satellitescan/free-purchase", async (req, res) => {
    try {
      const { customerEmail, customerName, couponCode } = req.body;

      if (!customerEmail || !couponCode) {
        return res.status(400).json({ 
          success: false, 
          message: "Email and coupon code are required" 
        });
      }

      // Validate coupon and ensure it provides full discount
      const coupon = await storage.getCouponByCode(couponCode);
      if (!coupon) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid coupon code" 
        });
      }

      // Check if coupon is active
      if (coupon.isActive !== "true") {
        return res.status(400).json({ 
          success: false, 
          message: "Coupon is inactive" 
        });
      }

      // Check if coupon has remaining uses
      if (coupon.maxUses && parseInt(coupon.usedCount) >= parseInt(coupon.maxUses)) {
        return res.status(400).json({ 
          success: false, 
          message: "Coupon usage limit reached" 
        });
      }

      // Check if coupon covers full price (€99.95)
      const SATELLITE_SCAN_PRICE = 99.95;
      if (parseFloat(coupon.discountAmount) < SATELLITE_SCAN_PRICE) {
        return res.status(400).json({ 
          success: false, 
          message: "Coupon does not cover full purchase price" 
        });
      }

      // Generate a free purchase ID
      const freePurchaseId = `FREE-${crypto.randomUUID()}`;

      // Create the purchase record
      await storage.createSatellitescanPurchase({
        customerEmail,
        customerName: customerName || null,
        amount: "0.00",
        stripePaymentIntentId: freePurchaseId,
        status: "succeeded",
      });

      // Increment coupon usage
      await storage.incrementCouponUsage(coupon.id);

      // Send confirmation email using existing notification system
      console.log('📧 Attempting to send free purchase email to:', customerEmail);
      try {
        const emailSent = await sendSatellitescanPurchaseEmail({
          customerEmail,
          customerName: customerName || '',
          amount: "0.00 (FREE - Coupon: " + couponCode + ")",
          paymentIntentId: freePurchaseId,
          purchaseId: freePurchaseId,
        });
        if (emailSent) {
          console.log('✅ Free purchase notification emails sent successfully to:', customerEmail);
        } else {
          console.error('⚠️ Free purchase email function returned false - email may not have been sent to:', customerEmail);
        }
      } catch (emailError: any) {
        console.error('❌ CRITICAL: Email notification failed for free purchase:', emailError?.message || emailError);
        console.error('❌ Customer email was:', customerEmail);
      }

      console.log(`✅ Free Satellite Scan activated for ${customerEmail} using coupon ${couponCode}`);

      // Sync purchase to Notion CRM first (creates contact if doesn't exist)
      try {
        await markContactAsCustomer(customerEmail, {
          productName: 'Satellite Scan (Free - ' + couponCode + ')',
          amount: '0.00',
          customerName: customerName || undefined
        });
        // Add purchase channel to contact's channels reached (after contact is created)
        await storage.addChannelToContact(customerEmail, 'Purchase');
        console.log(`✓ Purchase channel added for: ${customerEmail}`);
      } catch (err: any) {
        console.log('Notion sync for free purchase error:', err.message);
      }
      
      res.json({ 
        success: true, 
        message: "Free Satellite Scan activated!",
        purchaseId: freePurchaseId 
      });
    } catch (error: any) {
      console.error("Free purchase error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error processing free purchase: " + error.message 
      });
    }
  });

  // Extended webhook handler for satellitescan purchases
  app.post("/api/webhooks/stripe-satellitescan", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Stripe not configured" });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    try {
      let event: Stripe.Event;

      if (webhookSecret) {
        const signature = req.headers['stripe-signature'];
        if (!signature) {
          console.error('⚠️ Webhook signature missing');
          return res.status(400).json({ message: 'Missing stripe-signature header' });
        }

        try {
          event = stripe.webhooks.constructEvent(
            (req as any).rawBody,
            signature,
            webhookSecret
          );
          console.log('✅ Webhook signature verified (satellitescan)');
        } catch (err: any) {
          console.error('❌ Webhook signature verification failed:', err.message);
          return res.status(400).json({ message: `Webhook signature verification failed: ${err.message}` });
        }
      } else {
        console.warn('⚠️ STRIPE_WEBHOOK_SECRET not set - signature verification disabled');
        event = req.body;
      }

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        const { product, customerName } = paymentIntent.metadata;
        // Use metadata customerEmail first, then fall back to receipt_email
        const customerEmail = paymentIntent.metadata.customerEmail || paymentIntent.receipt_email || '';
        const amount = (paymentIntent.amount / 100).toString();
        
        console.log('📧 Satellitescan Payment Intent customer email sources:');
        console.log('  - metadata.customerEmail:', paymentIntent.metadata.customerEmail || 'NOT SET');
        console.log('  - receipt_email:', paymentIntent.receipt_email || 'NOT SET');
        console.log('  - Final customerEmail:', customerEmail || 'EMPTY!');

        if (product === 'satellitescan' && customerEmail) {
          const existingPurchase = await storage.getSatellitescanPurchaseByPaymentIntent(paymentIntent.id);
          
          if (!existingPurchase) {
            const purchase = await storage.createSatellitescanPurchase({
              customerEmail: customerEmail,
              customerName: customerName || undefined,
              amount: amount,
              stripePaymentIntentId: paymentIntent.id,
              status: 'succeeded',
            });

            console.log('🎉 NEW SATELLITESCAN PURCHASE! 🎉');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`Customer: ${customerName || 'Not provided'}`);
            console.log(`Email: ${customerEmail}`);
            console.log(`Amount: €${amount}`);
            console.log(`Payment ID: ${paymentIntent.id}`);
            console.log(`Purchase ID: ${purchase.id}`);
            console.log(`Time: ${new Date().toISOString()}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            const emailSent = await sendSatellitescanPurchaseEmail({
              customerEmail,
              customerName: customerName || null,
              amount,
              paymentIntentId: paymentIntent.id,
              purchaseId: purchase.id,
            });

            if (!emailSent) {
              console.log('⚠️ Email notification failed - manual follow-up required');
              console.log('👉 ACTION REQUIRED: Email customer at:', customerEmail);
              console.log('👉 Include Typeform link: https://greenelephantorg.typeform.com/individualscan');
            }

            // Sync purchase to Notion CRM first (creates contact if doesn't exist)
            try {
              await markContactAsCustomer(customerEmail, {
                productName: 'Satellite Scan',
                amount: amount,
                customerName: customerName || undefined
              });
              // Add purchase channel to contact's channels reached (after contact is created)
              await storage.addChannelToContact(customerEmail, 'Purchase');
              console.log(`✓ Purchase channel added for: ${customerEmail}`);
            } catch (err: any) {
              console.log('Notion sync for satellitescan error:', err.message);
            }
          } else {
            console.log('ℹ️ Duplicate webhook event received for satellitescan payment:', paymentIntent.id);
          }
        } else if (product === 'satellitescan' && !customerEmail) {
          // LOUD ERROR: Customer email is missing
          console.error('❌ CRITICAL: Satellitescan payment received WITHOUT customer email!');
          console.error('❌ Payment Intent ID:', paymentIntent.id);
          console.error('❌ This purchase cannot be processed - manual intervention required');
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Satellitescan webhook error:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // Webinar replay gate — GDPR-compliant
  app.post("/api/webinar/replay-gate", async (req, res) => {
    try {
      const { name, email, consent } = req.body;
      if (!email || !consent) {
        return res.status(400).json({ message: "Email and consent are required" });
      }
      const normalizedEmail = email.toLowerCase().trim();
      const consentText = "Agreed to receive webinar replay link and occasional updates about upcoming Monthly Lens Webinars.";

      // Upsert contact
      let contact = await storage.getContactByEmail(normalizedEmail);
      if (!contact) {
        contact = await storage.createContact({
          email: normalizedEmail,
          name: name?.trim() || undefined,
          consentGiven: "true",
          consentText,
          source: "webinar",
          channelsReached: ["Webinar"],
        });
      }
      await storage.addChannelToContact(normalizedEmail, "Webinar");

      // Sync to Notion CRM
      try {
        const { pushContactToNotion } = await import('./lib/notionSync');
        const freshContact = await storage.getContactByEmail(normalizedEmail);
        if (freshContact) {
          await pushContactToNotion(freshContact);
        }
      } catch (notionErr: any) {
        console.error("⚠️ Notion sync error (webinar replay gate):", notionErr.message);
      }

      // Send confirmation email
      try {
        const { sendWebinarReplayConfirmationEmail } = await import("./email-notifications");
        await sendWebinarReplayConfirmationEmail({ name: name?.trim() || "there", email: normalizedEmail });
      } catch (emailErr: any) {
        console.error("⚠️ Replay gate email error:", emailErr.message);
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("Webinar replay gate error:", error);
      res.status(500).json({ message: "Could not process your request" });
    }
  });

  // Admin: Scan Results dashboard endpoint
  app.get("/api/admin/scan-results", requireAdminAuth, async (_req, res) => {
    try {
      const purchases = await storage.getAllSatellitescanPurchases();
      res.json(purchases);
    } catch (error: any) {
      console.error("Scan results fetch error:", error);
      res.status(500).json({ message: "Could not fetch scan results" });
    }
  });

  app.get("/api/admin/saas-settings", requireAdminAuth, async (_req, res) => {
    try {
      const saasEnabled = await storage.getAdminSetting("saas_enabled");
      const subscriptionPrice = await storage.getAdminSetting("saas_subscription_price");
      const scanPrice = await storage.getAdminSetting("saas_scan_price");
      const journeyPrice = await storage.getAdminSetting("saas_journey_price");
      const subFeatures = await storage.getAdminSetting("saas_subscription_features");
      const scanFeatures = await storage.getAdminSetting("saas_scan_features");
      const journeyFeatures = await storage.getAdminSetting("saas_journey_features");

      const defaultSubFeatures = [
        "Unlimited Satellite Scans",
        "Prompting Playground",
        "Personal development data dashboard",
        "Calendar event & micro-habit suggestions",
        "Data export to Notion, Google Calendar",
        "Growth tracking over time",
      ];
      const defaultScanFeatures = [
        "1 Satellite Scan (129 questions)",
        "Personalized dashboard within 48-72h",
        "Access to public Prompt Library",
        "No portal access",
      ];
      const defaultJourneyFeatures = [
        "Everything in Subscription",
        "6 months 1:1 coaching sessions",
        "Lifetime portal access (no monthly fee)",
        "Priority dashboard delivery",
        "Direct coach communication channel",
      ];

      res.json({
        saasEnabled: saasEnabled === "true",
        subscriptionPriceMonthly: subscriptionPrice ? parseFloat(subscriptionPrice) : 9.95,
        scanOneTimePrice: scanPrice ? parseFloat(scanPrice) : 99.95,
        coachingJourneyPrice: journeyPrice ? parseFloat(journeyPrice) : 2980,
        subscriptionFeatures: subFeatures ? JSON.parse(subFeatures) : defaultSubFeatures,
        oneTimeScanFeatures: scanFeatures ? JSON.parse(scanFeatures) : defaultScanFeatures,
        coachingJourneyFeatures: journeyFeatures ? JSON.parse(journeyFeatures) : defaultJourneyFeatures,
      });
    } catch (error) {
      res.json({
        saasEnabled: false,
        subscriptionPriceMonthly: 9.95,
        scanOneTimePrice: 99.95,
        coachingJourneyPrice: 2980,
        subscriptionFeatures: [],
        oneTimeScanFeatures: [],
        coachingJourneyFeatures: [],
      });
    }
  });

  app.post("/api/admin/saas-settings", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { saasEnabled, subscriptionPriceMonthly, scanOneTimePrice, coachingJourneyPrice, subscriptionFeatures, oneTimeScanFeatures, coachingJourneyFeatures } = req.body;
      await storage.setAdminSetting("saas_enabled", String(!!saasEnabled));
      if (subscriptionPriceMonthly !== undefined) {
        await storage.setAdminSetting("saas_subscription_price", String(subscriptionPriceMonthly));
      }
      if (scanOneTimePrice !== undefined) {
        await storage.setAdminSetting("saas_scan_price", String(scanOneTimePrice));
      }
      if (coachingJourneyPrice !== undefined) {
        await storage.setAdminSetting("saas_journey_price", String(coachingJourneyPrice));
      }
      if (subscriptionFeatures !== undefined) {
        await storage.setAdminSetting("saas_subscription_features", JSON.stringify(subscriptionFeatures));
      }
      if (oneTimeScanFeatures !== undefined) {
        await storage.setAdminSetting("saas_scan_features", JSON.stringify(oneTimeScanFeatures));
      }
      if (coachingJourneyFeatures !== undefined) {
        await storage.setAdminSetting("saas_journey_features", JSON.stringify(coachingJourneyFeatures));
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to save SaaS settings" });
    }
  });

  app.get("/api/admin/ai-tools/settings", requireAdminAuth, async (_req, res) => {
    try {
      const settings = await storage.getAllAdminSettings();
      const aiSettings = settings.filter(s => s.key.startsWith("ai_tools_"));
      res.json(aiSettings.map(s => ({ key: s.key, value: s.value })));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI tools settings" });
    }
  });

  app.post("/api/admin/ai-tools/settings", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { key, value } = req.body;
      if (!key || typeof key !== "string" || !key.startsWith("ai_tools_")) {
        return res.status(400).json({ message: "Key must start with ai_tools_" });
      }
      await storage.setAdminSetting(key, String(value));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to save AI tools setting" });
    }
  });

  app.get("/api/admin/ai-tools/usage", requireAdminAuth, async (req, res) => {
    try {
      const range = (req.query.range as string) || "week";
      const usageByPeriod: Record<string, { period: string; tokens: number; requests: number; cost: number }[]> = {
        day: [
          { period: "00:00", tokens: 1200, requests: 3, cost: 0.024 },
          { period: "06:00", tokens: 450, requests: 1, cost: 0.009 },
          { period: "12:00", tokens: 3800, requests: 8, cost: 0.076 },
          { period: "18:00", tokens: 2100, requests: 5, cost: 0.042 },
        ],
        week: [
          { period: "Mon", tokens: 8200, requests: 18, cost: 0.164 },
          { period: "Tue", tokens: 5400, requests: 12, cost: 0.108 },
          { period: "Wed", tokens: 12600, requests: 28, cost: 0.252 },
          { period: "Thu", tokens: 9100, requests: 20, cost: 0.182 },
          { period: "Fri", tokens: 7300, requests: 16, cost: 0.146 },
          { period: "Sat", tokens: 2100, requests: 5, cost: 0.042 },
          { period: "Sun", tokens: 1800, requests: 4, cost: 0.036 },
        ],
        month: [
          { period: "Week 1", tokens: 42000, requests: 95, cost: 0.84 },
          { period: "Week 2", tokens: 38500, requests: 82, cost: 0.77 },
          { period: "Week 3", tokens: 51200, requests: 110, cost: 1.02 },
          { period: "Week 4", tokens: 46800, requests: 98, cost: 0.94 },
        ],
      };

      const byFeature = [
        { feature: "Prompt Generator", tokens: 12400, pct: 32 },
        { feature: "FlowCheck Analysis", tokens: 9800, pct: 25 },
        { feature: "Content Flywheel", tokens: 8600, pct: 22 },
        { feature: "Debrief Summary", tokens: 4200, pct: 11 },
        { feature: "Case Study Builder", tokens: 3900, pct: 10 },
      ];

      const byModel = [
        { model: "gpt-4o", tokens: 34200, pct: 88 },
        { model: "gpt-4o-mini", tokens: 3600, pct: 9 },
        { model: "gemini-1.5-pro", tokens: 1100, pct: 3 },
      ];

      res.json({
        timeline: usageByPeriod[range] || usageByPeriod.week,
        byFeature,
        byModel,
        runningTotal: 3.57,
        projectedMonthly: 8.92,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI usage data" });
    }
  });

  app.get("/api/admin/ai-tools/activity", requireAdminAuth, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const allActivity = [
        { id: "1", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), model: "gpt-4o", feature: "Prompt Generator", tokensUsed: 1820, status: "success", durationMs: 4200 },
        { id: "2", timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), model: "gpt-4o", feature: "FlowCheck Analysis", tokensUsed: 2340, status: "success", durationMs: 5800 },
        { id: "3", timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), model: "gpt-4o", feature: "Content Flywheel", tokensUsed: 3100, status: "success", durationMs: 7100 },
        { id: "4", timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), model: "gpt-4o", feature: "Debrief Summary", tokensUsed: 1560, status: "error", durationMs: 12000 },
        { id: "5", timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(), model: "gpt-4o", feature: "Prompt Generator", tokensUsed: 2080, status: "success", durationMs: 3900 },
        { id: "6", timestamp: new Date(Date.now() - 1000 * 60 * 200).toISOString(), model: "gpt-4o", feature: "Case Study Builder", tokensUsed: 4200, status: "success", durationMs: 9500 },
        { id: "7", timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(), model: "gpt-4o-mini", feature: "FlowCheck Analysis", tokensUsed: 980, status: "success", durationMs: 2100 },
        { id: "8", timestamp: new Date(Date.now() - 1000 * 60 * 420).toISOString(), model: "gpt-4o", feature: "Content Flywheel", tokensUsed: 2760, status: "success", durationMs: 6300 },
        { id: "9", timestamp: new Date(Date.now() - 1000 * 60 * 500).toISOString(), model: "gpt-4o", feature: "Prompt Generator", tokensUsed: 1450, status: "success", durationMs: 3200 },
        { id: "10", timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(), model: "gpt-4o-mini", feature: "Debrief Summary", tokensUsed: 890, status: "success", durationMs: 1800 },
        { id: "11", timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(), model: "gpt-4o", feature: "Content Flywheel", tokensUsed: 3300, status: "error", durationMs: 15000 },
        { id: "12", timestamp: new Date(Date.now() - 1000 * 60 * 840).toISOString(), model: "gpt-4o", feature: "Case Study Builder", tokensUsed: 5100, status: "success", durationMs: 11200 },
      ];

      const start = (page - 1) * limit;
      const items = allActivity.slice(start, start + limit);

      res.json({
        items,
        total: allActivity.length,
        page,
        limit,
        totalPages: Math.ceil(allActivity.length / limit),
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI activity log" });
    }
  });

  app.get("/api/admin/analytics-status", requireAdminAuth, async (_req, res) => {
    const measurementId = process.env.VITE_GA_MEASUREMENT_ID || null;
    const ga4PropertyId = process.env.GA4_PROPERTY_ID || null;
    const serviceKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || null;
    res.json({
      clientTrackingConfigured: !!measurementId,
      serverApiConfigured: !!(ga4PropertyId && serviceKey),
      measurementId,
    });
  });

  // Admin funnel metrics endpoint
  app.get("/api/admin/funnel-metrics", requireAdminAuth, async (req, res) => {
    try {
      const window = (req.query.window as string) || "all";
      const now = new Date();
      let windowStart: Date | null = null;
      if (window === "7d") {
        windowStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (window === "30d") {
        windowStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      const inWindow = (dateStr: string | Date | null | undefined): boolean => {
        if (!windowStart || !dateStr) return !windowStart;
        const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
        return d >= windowStart;
      };

      const [
        allContacts,
        allScanPurchases,
        allPurchases,
        allNewsletterSubs,
        allWebinarSignups,
        allFlowChecks,
        allQuizResults,
        allContactMessages,
        allWaitlist,
        allCoupons,
        allEmailLogs,
      ] = await Promise.all([
        storage.getAllContacts(),
        storage.getAllSatellitescanPurchases(),
        storage.getAllPurchases(),
        storage.getAllNewsletterSubscriptions(),
        storage.getAllWebinarWaitlistEntries(),
        storage.getAllFlowCheckResults(),
        storage.getAllSignalsQuizResults(),
        storage.getAllContactMessages(),
        storage.getAllWaitlistEntries(),
        storage.getAllCoupons(),
        storage.getAllOnboardingEmailLogs(),
      ]);

      const fContacts = allContacts.filter(c => inWindow(c.createdAt));
      const fScanPurchases = allScanPurchases.filter(p => inWindow(p.createdAt));
      const fPurchases = allPurchases.filter(p => inWindow(p.createdAt));
      const fNewsletter = allNewsletterSubs.filter(s => inWindow(s.createdAt));
      const fWebinar = allWebinarSignups.filter(w => inWindow(w.createdAt));
      const fFlowChecks = allFlowChecks.filter(f => inWindow(f.createdAt));
      const fQuiz = allQuizResults.filter(q => inWindow(q.createdAt));
      const fMessages = allContactMessages.filter(m => inWindow(m.createdAt));
      const fWaitlist = allWaitlist.filter(w => inWindow(w.createdAt));
      const fEmailLogs = allEmailLogs.filter(l => inWindow(l.createdAt));

      const totalRevenue = fScanPurchases.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
        + fPurchases.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
      const totalPurchaseCount = fScanPurchases.length + fPurchases.length;
      const avgOrderValue = totalPurchaseCount > 0 ? Math.round(totalRevenue / totalPurchaseCount * 100) / 100 : 0;

      const couponsUsed = allCoupons.reduce((sum, c) => sum + parseInt(c.usedCount || "0"), 0); // all-time (no per-coupon timestamp)

      const typeformCompleted = fScanPurchases.filter(p => p.typeformCompleted === "true").length;
      const typeformRate = fScanPurchases.length > 0 ? Math.round((typeformCompleted / fScanPurchases.length) * 100) : 0;

      const sentEmails = fEmailLogs.filter(l => l.status === "sent").length;
      const reminderEmails = fScanPurchases.filter(p => parseInt(p.remindersCount || "0") > 0).length;

      const notionSynced = allContacts.filter(c => c.notionSyncedAt && inWindow(c.createdAt)).length;
      const notionSyncRate = fContacts.length > 0 ? Math.round((notionSynced / fContacts.length) * 100) : 0;

      const multiFlowMap = new Map<string, number>();
      fFlowChecks.forEach(fc => {
        const key = fc.contactId || fc.id;
        if (key) {
          multiFlowMap.set(key, (multiFlowMap.get(key) || 0) + 1);
        }
      });
      const repeatFlowUsers = Array.from(multiFlowMap.values()).filter(c => c > 1).length;

      const contactsWith3PlusChannels = allContacts.filter(c => {
        const channels = c.channelsReached || [];
        return channels.length >= 3 && inWindow(c.createdAt);
      }).length;

      const scanEmails = new Set(fScanPurchases.map(p => p.customerEmail.toLowerCase()));
      const newsletterContactIds = new Set(fNewsletter.map(n => n.contactId));
      const scanAndNewsletter = allContacts.filter(c => {
        return scanEmails.has(c.email.toLowerCase()) && newsletterContactIds.has(c.id) && inWindow(c.createdAt);
      }).length;

      const referralMessages = fMessages.filter(m => {
        const text = (m.message || "").toLowerCase();
        return text.includes("recommend") || text.includes("referred") || text.includes("colleague");
      }).length;

      const ga4Enabled = await isConnectorEnabled("google-analytics");
      const ga4 = ga4Enabled ? await fetchGA4Metrics(window) : null;
      const ga4Connected = ga4Enabled && isGA4Configured();

      let typeformApiRate: number | null = null;
      let typeformApiResponses: number | null = null;
      const typeformEnabled = await isConnectorEnabled("typeform");
      if (typeformEnabled && process.env.TYPEFORM_PERSONAL_ACCESS_TOKEN && process.env.TYPEFORM_FORM_ID) {
        try {
          const { getTypeformFormStats } = await import("./lib/typeformClient");
          const stats = await getTypeformFormStats(process.env.TYPEFORM_FORM_ID);
          typeformApiRate = stats.completionRate;
          typeformApiResponses = stats.totalResponses;
        } catch (err: any) {
          console.warn("Typeform API enrichment failed (non-blocking):", err.message);
        }
      }

      const referralWaitlist = fWaitlist.filter(w => {
        const text = (w.motivation || "").toLowerCase();
        return text.includes("referral") || text.includes("recommend") || text.includes("colleague") || text.includes("referred");
      }).length;

      const webinarContactIds = new Set(fWebinar.map(w => w.contactId));
      const scanContactEmails = new Set(fScanPurchases.map(p => p.customerEmail.toLowerCase()));
      const webinarScanOverlap = allContacts.filter(c => {
        return webinarContactIds.has(c.id) && scanContactEmails.has(c.email.toLowerCase()) && inWindow(c.createdAt);
      }).length;

      let prevPeriodStart: Date | null = null;
      let prevPeriodEnd: Date | null = null;
      if (window === "7d") {
        prevPeriodEnd = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        prevPeriodStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      } else if (window === "30d") {
        prevPeriodEnd = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        prevPeriodStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      }

      const inPrevWindow = (dateStr: string | Date | null | undefined): boolean => {
        if (!prevPeriodStart || !prevPeriodEnd || !dateStr) return false;
        const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
        return d >= prevPeriodStart && d < prevPeriodEnd;
      };

      const pContacts = allContacts.filter(c => inPrevWindow(c.createdAt));
      const pScanPurchases = allScanPurchases.filter(p => inPrevWindow(p.createdAt));
      const pPurchases = allPurchases.filter(p => inPrevWindow(p.createdAt));
      const pNewsletter = allNewsletterSubs.filter(s => inPrevWindow(s.createdAt));
      const pWebinar = allWebinarSignups.filter(w => inPrevWindow(w.createdAt));
      const pFlowChecks = allFlowChecks.filter(f => inPrevWindow(f.createdAt));
      const pQuiz = allQuizResults.filter(q => inPrevWindow(q.createdAt));
      const pMessages = allContactMessages.filter(m => inPrevWindow(m.createdAt));
      const pWaitlist = allWaitlist.filter(w => inPrevWindow(w.createdAt));
      const pEmailLogs = allEmailLogs.filter(l => inPrevWindow(l.createdAt));

      const prevRevenue = pScanPurchases.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
        + pPurchases.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
      const prevPurchaseCount = pScanPurchases.length + pPurchases.length;
      const prevAvgOrderValue = prevPurchaseCount > 0 ? Math.round(prevRevenue / prevPurchaseCount * 100) / 100 : 0;

      const prevTypeformCompleted = pScanPurchases.filter(p => p.typeformCompleted === "true").length;
      const prevTypeformRate = pScanPurchases.length > 0 ? Math.round((prevTypeformCompleted / pScanPurchases.length) * 100) : 0;

      const prevSentEmails = pEmailLogs.filter(l => l.status === "sent").length;
      const prevReminderEmails = pScanPurchases.filter(p => parseInt(p.remindersCount || "0") > 0).length;

      const prevNotionSynced = allContacts.filter(c => c.notionSyncedAt && inPrevWindow(c.createdAt)).length;
      const prevNotionSyncRate = pContacts.length > 0 ? Math.round((prevNotionSynced / pContacts.length) * 100) : 0;

      const prevMultiFlowMap = new Map<string, number>();
      pFlowChecks.forEach(fc => {
        const key = fc.contactId || fc.id;
        if (key) prevMultiFlowMap.set(key, (prevMultiFlowMap.get(key) || 0) + 1);
      });
      const prevRepeatFlowUsers = Array.from(prevMultiFlowMap.values()).filter(c => c > 1).length;

      const prevContactsWith3PlusChannels = allContacts.filter(c => {
        const channels = c.channelsReached || [];
        return channels.length >= 3 && inPrevWindow(c.createdAt);
      }).length;

      const prevScanEmails = new Set(pScanPurchases.map(p => p.customerEmail.toLowerCase()));
      const prevNewsletterContactIds = new Set(pNewsletter.map(n => n.contactId));
      const prevScanAndNewsletter = allContacts.filter(c => {
        return prevScanEmails.has(c.email.toLowerCase()) && prevNewsletterContactIds.has(c.id) && inPrevWindow(c.createdAt);
      }).length;

      const prevReferralMessages = pMessages.filter(m => {
        const text = (m.message || "").toLowerCase();
        return text.includes("recommend") || text.includes("referred") || text.includes("colleague");
      }).length;

      const prevReferralWaitlist = pWaitlist.filter(w => {
        const text = (w.motivation || "").toLowerCase();
        return text.includes("referral") || text.includes("recommend") || text.includes("colleague") || text.includes("referred");
      }).length;

      const prevWebinarContactIds = new Set(pWebinar.map(w => w.contactId));
      const prevScanContactEmails = new Set(pScanPurchases.map(p => p.customerEmail.toLowerCase()));
      const prevWebinarScanOverlap = allContacts.filter(c => {
        return prevWebinarContactIds.has(c.id) && prevScanContactEmails.has(c.email.toLowerCase()) && inPrevWindow(c.createdAt);
      }).length;

      type MetricEntry = { label: string; value: any; prev?: number | null };
      const hasPrev = prevPeriodStart !== null;
      const prevOrNull = (n: number): number | null => hasPrev ? n : null;

      const funnel: Record<string, {
        primary: MetricEntry;
        secondary: MetricEntry[];
        source: string;
        gaNote?: string;
      }> = {
        AWARENESS: {
          primary: { label: "Sessions", value: ga4.sessions, prev: null },
          secondary: [
            { label: "Unique Users", value: ga4.uniqueUsers, prev: null },
            { label: "Organic Users", value: ga4.organicUsers, prev: null },
            { label: "Top Traffic Sources", value: ga4.topTrafficSources, prev: null },
            { label: "Total Contacts (DB)", value: fContacts.length, prev: prevOrNull(pContacts.length) },
          ],
          source: ga4Connected ? "GA4 + DB" : "Database",
          ...(!ga4Connected && { gaNote: "Connect GA4 Data API for sessions, users, organic traffic, and top sources" }),
        },
        INTEREST: {
          primary: { label: "Quiz Completions", value: fQuiz.length, prev: prevOrNull(pQuiz.length) },
          secondary: [
            { label: "/scan Page Views", value: ga4.scanPageViews, prev: null },
            { label: "Coaching CTA Clicks", value: ga4.coachingCTAClicks, prev: null },
            { label: "Flow Checks", value: fFlowChecks.length, prev: prevOrNull(pFlowChecks.length) },
          ],
          source: ga4Connected ? "GA4 + DB" : "Database",
          ...(!ga4Connected && { gaNote: "Connect GA4 for /scan page views and coaching CTA click tracking" }),
        },
        ENGAGEMENT: {
          primary: { label: "Newsletter Signups", value: fNewsletter.length, prev: prevOrNull(pNewsletter.length) },
          secondary: [
            { label: "Webinar Signups", value: fWebinar.length, prev: prevOrNull(pWebinar.length) },
            { label: "Contact Messages", value: fMessages.length, prev: prevOrNull(pMessages.length) },
            { label: "Prompt Copies", value: ga4.promptCopyEvents, prev: null },
            { label: "Waitlist Entries", value: fWaitlist.length, prev: prevOrNull(pWaitlist.length) },
          ],
          source: ga4Connected ? "GA4 + DB" : "Database",
          ...(!ga4Connected && { gaNote: "Connect GA4 for prompt copy event tracking" }),
        },
        PURCHASE: {
          primary: { label: "Total Revenue", value: `€${totalRevenue.toFixed(2)}`, prev: prevOrNull(prevRevenue) },
          secondary: [
            { label: "Scan Purchases", value: fScanPurchases.length, prev: prevOrNull(pScanPurchases.length) },
            { label: "Other Purchases", value: fPurchases.length, prev: prevOrNull(pPurchases.length) },
            { label: "Avg Order Value", value: `€${avgOrderValue.toFixed(2)}`, prev: prevOrNull(prevAvgOrderValue) },
            { label: window === "all" ? "Coupons Used" : "Coupons Used (all-time)", value: couponsUsed },
          ],
          source: "Stripe + DB",
        },
        ONBOARDING: {
          primary: { label: "Typeform Rate", value: `${typeformApiRate !== null ? typeformApiRate : typeformRate}%`, prev: prevOrNull(prevTypeformRate) },
          secondary: [
            { label: "Typeform Completed", value: typeformCompleted, prev: prevOrNull(prevTypeformCompleted) },
            ...(typeformApiResponses !== null ? [{ label: "Typeform API Responses", value: typeformApiResponses, prev: null as number | null }] : []),
            { label: "Onboarding Emails Sent", value: sentEmails, prev: prevOrNull(prevSentEmails) },
            { label: "Reminders Triggered", value: reminderEmails, prev: prevOrNull(prevReminderEmails) },
            { label: "Notion Sync Rate", value: `${notionSyncRate}%`, prev: prevOrNull(prevNotionSyncRate) },
          ],
          source: typeformEnabled && process.env.TYPEFORM_PERSONAL_ACCESS_TOKEN && process.env.TYPEFORM_FORM_ID ? "Database + Typeform API" : "Database",
        },
        USE: {
          primary: { label: "Repeat Flow Users", value: repeatFlowUsers, prev: prevOrNull(prevRepeatFlowUsers) },
          secondary: [
            { label: "Total Flow Checks", value: fFlowChecks.length, prev: prevOrNull(pFlowChecks.length) },
            { label: "Prompt Copies/Session", value: ga4.promptCopiesPerSession, prev: null },
            { label: "Return Visitor Rate", value: ga4.returnVisitorRate !== null ? `${ga4.returnVisitorRate}%` : null, prev: null },
          ],
          source: ga4Connected ? "GA4 + DB" : "Database",
          ...(!ga4Connected && { gaNote: "Connect GA4 for return visitor rate, session frequency, and prompt copies per session" }),
        },
        "USE MORE": {
          primary: { label: "3+ Channels", value: contactsWith3PlusChannels, prev: prevOrNull(prevContactsWith3PlusChannels) },
          secondary: [
            { label: "Scan + Newsletter", value: scanAndNewsletter, prev: prevOrNull(prevScanAndNewsletter) },
            { label: "Webinar + Scan", value: webinarScanOverlap, prev: prevOrNull(prevWebinarScanOverlap) },
          ],
          source: "Database",
        },
        ADVOCACY: {
          primary: { label: "Referral Mentions", value: referralMessages, prev: prevOrNull(prevReferralMessages) },
          secondary: [
            { label: "Referral-Sourced Waitlist", value: referralWaitlist, prev: prevOrNull(prevReferralWaitlist) },
            { label: "Direct Traffic Share", value: ga4.directTrafficShare !== null ? `${ga4.directTrafficShare}%` : null, prev: null },
          ],
          source: ga4Connected ? "GA4 + DB" : "Database",
          ...(!ga4Connected && { gaNote: "Connect GA4 for direct traffic share and referral source tracking" }),
        },
      };

      res.json({ window, funnel });
    } catch (error: any) {
      console.error("Funnel metrics error:", error);
      res.status(500).json({ message: "Could not compute funnel metrics" });
    }
  });

  // Admin endpoint for satellitescan purchases
  app.get("/api/admin/satellitescan", requireAdminAuth, async (_req, res) => {
    try {
      const purchases = await storage.getAllSatellitescanPurchases();
      res.json(purchases);
    } catch (error: any) {
      console.error("Admin satellitescan fetch error:", error);
      res.status(500).json({ message: "Could not fetch satellitescan purchases" });
    }
  });

  // Admin endpoint for all product purchases (Interview Mastery, Coaching, etc.)
  app.get("/api/admin/purchases", requireAdminAuth, async (_req, res) => {
    try {
      const purchases = await storage.getAllPurchases();
      res.json(purchases);
    } catch (error: any) {
      console.error("Admin purchases fetch error:", error);
      res.status(500).json({ message: "Could not fetch purchases" });
    }
  });

  // Admin endpoint to send reminder emails for overdue satellitescan completions
  // Should be triggered by external cron service (cron-job.org, GitHub Actions, etc.)
  // Example: Daily at 10:00 AM UTC
  // Idempotency: Only processes purchases with remindersCount=0, increment happens BEFORE send
  // Rate limiting: Recommend max 1 call per 24h to prevent accidental duplicate processing
  app.post("/api/admin/satellitescan/send-reminders", requireAdminAuth, requireWriteAccess, async (_req, res) => {
    try {
      // Find purchases older than 72 hours (3 days) with no typeform completion and no reminders sent
      const hoursThreshold = 72;
      const overduePurchases = await storage.getOverdueSatellitescanPurchases(hoursThreshold);
      
      console.log(`📧 Checking for overdue satellitescan purchases (older than ${hoursThreshold}h)...`);
      console.log(`Found ${overduePurchases.length} purchases needing reminders (remindersCount=0)`);

      if (overduePurchases.length === 0) {
        return res.json({ 
          success: true, 
          message: 'No overdue purchases found',
          sent: 0,
          failed: 0
        });
      }

      const results = {
        sent: 0,
        failed: 0,
        details: [] as Array<{ email: string; success: boolean; error?: string }>
      };

      // Send reminder emails with idempotency protection
      // Increment count BEFORE sending to prevent double-sends on network failures
      for (const purchase of overduePurchases) {
        try {
          // Increment reminder count BEFORE sending to prevent double-sends
          const currentCount = parseInt(purchase.remindersCount);
          await storage.updateSatellitescanReminderCount(purchase.id, currentCount + 1);
          
          // Now attempt to send email
          const emailSent = await sendSatellitescanReminderEmail(
            purchase.customerEmail,
            purchase.customerName
          );

          if (emailSent) {
            results.sent++;
            results.details.push({ email: purchase.customerEmail, success: true });
            console.log(`✅ Reminder sent to: ${purchase.customerEmail}`);
          } else {
            // Email failed to send, but count is already incremented (prevents retry spam)
            results.failed++;
            results.details.push({ email: purchase.customerEmail, success: false, error: 'Email send failed (count incremented to prevent retry)' });
            console.log(`⚠️ Email failed for ${purchase.customerEmail}, but count incremented to prevent future retries`);
          }
        } catch (error: any) {
          // Error during processing - count may or may not be incremented depending on where failure occurred
          results.failed++;
          results.details.push({ email: purchase.customerEmail, success: false, error: error.message });
          console.error(`❌ Failed to process reminder for ${purchase.customerEmail}:`, error);
        }
      }

      console.log(`📊 Reminder summary: ${results.sent} sent, ${results.failed} failed`);
      
      res.json({
        success: true,
        message: `Processed ${overduePurchases.length} overdue purchases`,
        sent: results.sent,
        failed: results.failed,
        details: results.details
      });
    } catch (error: any) {
      console.error("Send reminders error:", error);
      res.status(500).json({ message: "Could not send reminder emails", error: error.message });
    }
  });

  // Admin endpoint to manually resend purchase emails for a specific Satellitescan purchase
  app.post("/api/admin/satellitescan/:purchaseId/resend-emails", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { purchaseId } = req.params;
      
      // Find the purchase
      const purchases = await storage.getAllSatellitescanPurchases();
      const purchase = purchases.find(p => p.id === purchaseId);
      
      if (!purchase) {
        return res.status(404).json({ success: false, message: "Purchase not found" });
      }
      
      console.log(`📧 Manual email resend triggered for: ${purchase.customerEmail}`);
      
      // Send the purchase emails
      const emailSent = await sendSatellitescanPurchaseEmail({
        customerEmail: purchase.customerEmail,
        customerName: purchase.customerName || 'Valued Customer',
        amount: purchase.amount,
        paymentIntentId: purchase.stripePaymentIntentId,
        purchaseId: purchase.id
      });
      
      if (emailSent) {
        console.log(`✅ Manual email resend successful: ${purchase.customerEmail}`);
        res.json({ 
          success: true, 
          message: `Emails resent to ${purchase.customerEmail}` 
        });
      } else {
        console.error(`❌ Manual email resend failed: ${purchase.customerEmail}`);
        res.status(500).json({ 
          success: false, 
          message: "Failed to send emails - check server logs" 
        });
      }
    } catch (error: any) {
      console.error("Manual email resend error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Admin endpoint to sync a specific contact to Notion
  app.post("/api/admin/contacts/:email/sync-notion", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { email } = req.params;
      
      // Find the contact
      const contact = await storage.getContactByEmail(email);
      if (!contact) {
        return res.status(404).json({ success: false, message: "Contact not found" });
      }
      
      console.log(`🔄 Manual Notion sync triggered for: ${email}`);
      
      // Sync to Notion
      const { pushContactToNotion } = await import('./lib/notionSync');
      await pushContactToNotion(contact);
      
      console.log(`✅ Notion sync successful: ${email}`);
      res.json({ success: true, message: `Contact synced to Notion: ${email}` });
    } catch (error: any) {
      console.error("Notion sync error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Admin endpoint to get contact activity timeline
  app.get("/api/admin/contacts/:email/activity", requireAdminAuth, async (req, res) => {
    try {
      const { email } = req.params;
      const decodedEmail = decodeURIComponent(email);
      
      // Get contact
      const contact = await storage.getContactByEmail(decodedEmail);
      if (!contact) {
        return res.status(404).json({ success: false, message: "Contact not found" });
      }
      
      // Build activity timeline from various sources
      const timeline: Array<{
        type: string;
        title: string;
        description?: string;
        timestamp: string;
      }> = [];
      
      // Add contact creation
      timeline.push({
        type: 'newsletter',
        title: 'Contact created',
        description: `Source: ${contact.source}`,
        timestamp: contact.createdAt?.toISOString() || new Date().toISOString()
      });
      
      // Add scan submission if present
      if (contact.scanSubmittedAt) {
        timeline.push({
          type: 'scan_submitted',
          title: 'Scan submitted via Typeform',
          description: 'Completed Satellite Scan questionnaire',
          timestamp: contact.scanSubmittedAt.toISOString()
        });
      }
      
      // Add Notion sync if present
      if (contact.notionSyncedAt) {
        timeline.push({
          type: 'notion_sync',
          title: 'Synced to Notion CRM',
          timestamp: contact.notionSyncedAt.toISOString()
        });
      }
      
      // Get quiz results for this contact
      const allQuizResults = await storage.getAllSignalsQuizResults();
      const contactQuizResults = allQuizResults.filter(q => q.contactId === contact.id);
      contactQuizResults.forEach(quiz => {
        timeline.push({
          type: 'quiz',
          title: 'Completed Signals Quiz',
          description: `Score: ${quiz.score}`,
          timestamp: quiz.createdAt?.toISOString() || new Date().toISOString()
        });
      });
      
      // Get waitlist entries
      const allWaitlist = await storage.getAllWaitlistEntries();
      const contactWaitlist = allWaitlist.filter(w => w.contactId === contact.id);
      contactWaitlist.forEach(entry => {
        timeline.push({
          type: 'waitlist',
          title: 'Joined waitlist',
          description: entry.retreatType ? `Retreat: ${entry.retreatType}` : entry.motivation,
          timestamp: entry.createdAt?.toISOString() || new Date().toISOString()
        });
      });
      
      // Get satellite scan purchases
      const allPurchases = await storage.getAllSatellitescanPurchases();
      const contactPurchases = allPurchases.filter(p => 
        p.customerEmail.toLowerCase() === decodedEmail.toLowerCase()
      );
      contactPurchases.forEach(purchase => {
        timeline.push({
          type: 'purchase',
          title: 'Satellite Scan purchase',
          description: `Amount: €${purchase.amount} | Status: ${purchase.status}`,
          timestamp: purchase.createdAt?.toISOString() || new Date().toISOString()
        });
        
        // Add Typeform completion if present
        if (purchase.typeformCompleted === 'true' || purchase.typeformCompleted === 'yes') {
          timeline.push({
            type: 'scan_submitted',
            title: 'Typeform questionnaire completed',
            timestamp: purchase.createdAt?.toISOString() || new Date().toISOString()
          });
        }
      });
      
      // Get onboarding email logs for each purchase
      for (const purchase of contactPurchases) {
        const emailLogs = await storage.getOnboardingEmailLogsByCustomer(purchase.id);
        for (const log of emailLogs) {
          const template = await storage.getOnboardingEmailTemplateById(log.templateId);
          timeline.push({
            type: 'email',
            title: `Email: ${template?.subject || 'Onboarding email'}`,
            description: `Status: ${log.status}${log.sentAt ? ' | Sent' : ''}`,
            timestamp: log.sentAt ? log.sentAt.toISOString() : new Date().toISOString()
          });
        }
      }
      
      // Sort timeline by timestamp (most recent first)
      timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      res.json({
        contact: {
          ...contact,
          createdAt: contact.createdAt?.toISOString(),
          scanSubmittedAt: contact.scanSubmittedAt?.toISOString(),
          notionSyncedAt: contact.notionSyncedAt?.toISOString()
        },
        timeline
      });
    } catch (error: any) {
      console.error("Contact activity error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Coupon validation endpoint
  app.post("/api/validate-coupon", async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ valid: false, message: "Coupon code required" });
      }
      
      const coupon = await storage.getCouponByCode(code);
      if (!coupon) {
        return res.status(400).json({ valid: false, message: "Coupon not found" });
      }
      
      if (coupon.isActive !== "true") {
        return res.status(400).json({ valid: false, message: "Coupon is inactive" });
      }
      
      if (coupon.maxUses && parseInt(coupon.usedCount) >= parseInt(coupon.maxUses)) {
        return res.status(400).json({ valid: false, message: "Coupon usage limit reached" });
      }
      
      res.json({ 
        valid: true, 
        discountAmount: parseFloat(coupon.discountAmount),
        category: coupon.category,
        message: `${coupon.category} discount applied!`
      });
    } catch (error: any) {
      console.error("Coupon validation error:", error);
      res.status(500).json({ valid: false, message: "Error validating coupon" });
    }
  });

  // Admin: Create coupon
  app.post("/api/admin/coupons", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { code, discountAmount, category, maxUses } = req.body;
      
      const coupon = await storage.createCoupon({
        code,
        discountAmount,
        category,
        isActive: "true",
        maxUses
      });
      
      res.status(201).json({ message: "Coupon created", coupon });
    } catch (error: any) {
      console.error("Create coupon error:", error);
      res.status(500).json({ message: "Error creating coupon", error: error.message });
    }
  });

  // Admin: Get all coupons
  app.get("/api/admin/coupons", requireAdminAuth, async (req, res) => {
    try {
      const coupons = await storage.getAllCoupons();
      res.json(coupons);
    } catch (error: any) {
      console.error("Get coupons error:", error);
      res.status(500).json({ message: "Error fetching coupons" });
    }
  });

  // Admin: Seed test coupons for payment testing
  app.post("/api/admin/coupons/seed-test", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const testCoupons = [
        { 
          code: "TESTSCAN100", 
          discountAmount: "99.95", 
          category: "startup", 
          maxUses: "5",
          isActive: "true"
        },
        { 
          code: "TESTINTERVIEW100", 
          discountAmount: "845", 
          category: "startup", 
          maxUses: "5",
          isActive: "true"
        },
        { 
          code: "TESTSINGLE100", 
          discountAmount: "295", 
          category: "startup", 
          maxUses: "5",
          isActive: "true"
        },
        { 
          code: "TESTJOURNEY100", 
          discountAmount: "2980", 
          category: "startup", 
          maxUses: "5",
          isActive: "true"
        },
        { 
          code: "TESTWORKSHOP100", 
          discountAmount: "1200", 
          category: "startup", 
          maxUses: "5",
          isActive: "true"
        }
      ];
      
      const createdCoupons = [];
      const skippedCoupons = [];
      
      for (const couponData of testCoupons) {
        const existing = await storage.getCouponByCode(couponData.code);
        if (existing) {
          skippedCoupons.push(couponData.code);
          continue;
        }
        
        const coupon = await storage.createCoupon(couponData as any);
        createdCoupons.push(coupon);
      }
      
      res.status(201).json({ 
        message: `Created ${createdCoupons.length} test coupons, skipped ${skippedCoupons.length} existing`,
        created: createdCoupons.map(c => c.code),
        skipped: skippedCoupons
      });
    } catch (error: any) {
      console.error("Seed test coupons error:", error);
      res.status(500).json({ message: "Error seeding test coupons", error: error.message });
    }
  });

  // Admin: Update coupon
  app.put("/api/admin/coupons/:code", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { code } = req.params;
      const updates = req.body;
      
      const coupon = await storage.getCouponByCode(code);
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      
      const updatedCoupon = await storage.updateCoupon(code, updates);
      res.json({ message: "Coupon updated", coupon: updatedCoupon });
    } catch (error: any) {
      console.error("Update coupon error:", error);
      res.status(500).json({ message: "Error updating coupon", error: error.message });
    }
  });

  // Admin: Delete coupon
  app.delete("/api/admin/coupons/:code", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { code } = req.params;
      
      const coupon = await storage.getCouponByCode(code);
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      
      await storage.deleteCoupon(code);
      res.json({ message: "Coupon deleted" });
    } catch (error: any) {
      console.error("Delete coupon error:", error);
      res.status(500).json({ message: "Error deleting coupon", error: error.message });
    }
  });

  // Admin: Get pricing mode
  app.get("/api/admin/pricing-mode", requireAdminAuth, async (_req, res) => {
    try {
      const mode = await storage.getAdminSetting("pricing_mode") || "single";
      res.json({ mode });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching pricing mode", error: error.message });
    }
  });

  // Admin: Set pricing mode
  app.put("/api/admin/pricing-mode", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { mode } = req.body;
      if (!["single", "subscription"].includes(mode)) {
        return res.status(400).json({ message: "Invalid mode. Must be 'single' or 'subscription'." });
      }
      await storage.setAdminSetting("pricing_mode", mode);
      res.json({ mode });
    } catch (error: any) {
      res.status(500).json({ message: "Error updating pricing mode", error: error.message });
    }
  });

  // Public: Get pricing mode (for shop/checkout pages)
  app.get("/api/pricing-mode", async (_req, res) => {
    try {
      const mode = await storage.getAdminSetting("pricing_mode") || "single";
      res.json({ mode });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching pricing mode" });
    }
  });

  // Dashboard API - Get lens data from Google Sheets
  app.get("/api/dashboard/lens-data", async (req, res) => {
    try {
      const spreadsheetId = req.query.spreadsheetId as string;
      const range = (req.query.range as string) || 'Sheet1!A1:Z100';
      
      if (!spreadsheetId) {
        return res.status(400).json({ message: "spreadsheetId is required" });
      }

      const data = await getSheetData(spreadsheetId, range);
      res.json({ data });
    } catch (error: any) {
      console.error("Dashboard lens data error:", error);
      res.status(500).json({ message: "Error fetching lens data", error: error.message });
    }
  });

  // Dashboard API - Generate UI with Thesys
  app.post("/api/dashboard/generate-ui", async (req, res) => {
    try {
      const { prompt, data } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "prompt is required" });
      }

      const uiContent = await generateDashboardUI(prompt, data);
      res.json({ content: uiContent });
    } catch (error: any) {
      console.error("Dashboard UI generation error:", error);
      res.status(500).json({ message: "Error generating dashboard UI", error: error.message });
    }
  });

  // ==========================================
  // Social Media Copy Generation (Admin)
  // ==========================================
  app.post("/api/admin/generate-social-copy", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { generateSocialCopy } = await import("./lib/thesysApi");
      const copy = await generateSocialCopy();
      res.json({ copy });
    } catch (error: any) {
      console.error("Social copy generation error:", error);
      res.status(500).json({ message: "Error generating social copy", error: error.message });
    }
  });

  // ==========================================
  // Content Flywheel Lab (Admin)
  // ==========================================

  app.post("/api/admin/generate-content", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { generatorType, customPrompt, voice, calibration, callToAction, enrichmentText } = req.body;
      const validTypes = ['headlines', 'ai-gap', 'workplace', 'case-study'];
      if (!generatorType || !validTypes.includes(generatorType)) {
        return res.status(400).json({ message: "generatorType must be one of: headlines, ai-gap, workplace, case-study" });
      }
      if (!customPrompt || typeof customPrompt !== 'string' || customPrompt.trim().length === 0) {
        return res.status(400).json({ message: "customPrompt is required and must be a non-empty string" });
      }

      const voiceMode = voice === 'I' ? 'I' : 'we';
      const calibrationLevel = ['low', 'medium', 'high'].includes(calibration) ? calibration : 'medium';

      const { getPipelineOSTasks } = await import("./lib/notionSync");
      const { generateFlywheelContent, generateSeoSuggestions, getCurrentLens } = await import("./lib/thesysApi");

      let pipelineContext = '';
      try {
        pipelineContext = await getPipelineOSTasks();
      } catch (e: any) {
        console.warn('Pipeline OS read failed (non-blocking):', e.message);
      }

      let enhancedPrompt = customPrompt;
      if (voiceMode === 'I') {
        enhancedPrompt += `\n\nIMPORTANT: Write in first person singular ("I") as if Esteve or Anu is speaking personally. Use personal anecdotes and direct voice.`;
      } else {
        enhancedPrompt += `\n\nIMPORTANT: Write in first person plural ("we") as the GreenElephant team voice. Use collective language.`;
      }
      if (calibrationLevel === 'high') {
        enhancedPrompt += `\n\nCALIBRATION: HIGH ACCURACY MODE — Include specific statistics with sources, exact quotes with attribution, and URLs to reliable sources (academic papers, reputable news outlets, or greenelephant.org internal pages). Favor shorter, precise snippets over long passages.`;
      } else if (calibrationLevel === 'low') {
        enhancedPrompt += `\n\nCALIBRATION: CREATIVE MODE — Prioritize storytelling and engagement over strict accuracy. Longer narrative passages are fine. URLs are optional.`;
      } else {
        enhancedPrompt += `\n\nCALIBRATION: BALANCED MODE — Include key statistics and references where available, but prioritize readability. Include URLs to greenelephant.org pages where relevant.`;
      }
      if (callToAction && typeof callToAction === 'string' && callToAction.trim()) {
        enhancedPrompt += `\n\nCALL TO ACTION: End the article and poll with this CTA: "${callToAction.trim()}"`;
      }
      if (enrichmentText && typeof enrichmentText === 'string' && enrichmentText.trim()) {
        enhancedPrompt += `\n\nADDITIONAL CONTEXT (from uploaded material):\n${enrichmentText.trim().substring(0, 3000)}`;
      }

      const content = await generateFlywheelContent(generatorType, enhancedPrompt, pipelineContext);
      const lens = getCurrentLens();

      let seo = { keywords: [] as string[], faqItems: [] as any[], internalLinks: [] as string[], targetPage: '/decode' };
      try {
        seo = await generateSeoSuggestions(generatorType, content.article.substring(0, 2000));
      } catch (e: any) {
        console.warn('SEO suggestions failed (non-blocking):', e.message);
      }

      res.json({
        ...content,
        seo,
        lens: { name: lens.name, hexColor: lens.hexColor, code: lens.code, description: lens.description },
        pipelineContext: pipelineContext ? 'loaded' : 'unavailable',
      });
    } catch (error: any) {
      console.error("Content flywheel generation error:", error);
      res.status(500).json({ message: "Error generating content", error: error.message });
    }
  });

  app.post("/api/admin/send-content-review", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { sendContentFlywheelEmail } = await import("./email-notifications");
      const { recipients, generatorType, lensName, lensColor, article, poll, artDirection, seoKeywords, seoFaqItems, seoInternalLinks } = req.body;

      if (!Array.isArray(recipients) || recipients.length === 0 || !article || typeof article !== 'string') {
        return res.status(400).json({ message: "recipients (array) and article (string) are required" });
      }

      const validTypes = ['headlines', 'ai-gap', 'workplace', 'case-study'];
      const safeType = validTypes.includes(generatorType) ? generatorType : 'headlines';

      const sent = await sendContentFlywheelEmail({
        recipients,
        generatorType: safeType,
        lensName: lensName || 'Unknown',
        lensColor: lensColor || '#009999',
        article,
        poll: poll || '',
        artDirection: artDirection || '',
        seoKeywords: Array.isArray(seoKeywords) ? seoKeywords : [],
        seoFaqItems: Array.isArray(seoFaqItems) ? seoFaqItems : [],
        seoInternalLinks: Array.isArray(seoInternalLinks) ? seoInternalLinks : [],
      });

      if (!sent) {
        return res.status(502).json({ message: "Email delivery failed — check Resend connector status", sent: false });
      }

      res.json({ sent: true });
    } catch (error: any) {
      console.error("Content review email error:", error);
      res.status(500).json({ message: "Error sending content review email", error: error.message });
    }
  });

  app.get("/api/admin/seo-suggestions", requireAdminAuth, async (_req, res) => {
    try {
      const { seoSuggestions } = await import("@shared/schema");
      const { desc } = await import("drizzle-orm");
      const suggestions = await db.select().from(seoSuggestions).orderBy(desc(seoSuggestions.createdAt)).limit(50);
      res.json(suggestions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/seo-suggestions", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { seoSuggestions } = await import("@shared/schema");
      const { generatorType, targetPage, suggestionType, content } = req.body;
      const [inserted] = await db.insert(seoSuggestions).values({
        generatorType,
        targetPage,
        suggestionType,
        content,
      }).returning();
      res.json(inserted);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/seo-suggestions/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { seoSuggestions } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      const { status } = req.body;
      const validStatuses = ['pending', 'applied', 'dismissed'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ message: "status must be one of: pending, applied, dismissed" });
      }
      const [updated] = await db.update(seoSuggestions).set({ status }).where(eq(seoSuggestions.id, req.params.id)).returning();
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/current-lens", requireAdminAuth, async (_req, res) => {
    try {
      const { getCurrentLens } = await import("./lib/thesysApi");
      const lens = getCurrentLens();
      res.json(lens);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/generate-element-prompt", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { generateElementPrompt } = await import("./lib/thesysApi");

      const validLenses = ['influence', 'attitude', 'chaordic', 'flow', 'alignment', 'needs', 'ego', 'dynamics'];
      const validRoles = ['EA', 'ACX', 'TealLeaders', 'all'];

      const elementCode = Number(req.body.elementCode);
      const elementName = String(req.body.elementName || '').trim();
      const elementLens = String(req.body.elementLens || '').trim();

      if (!elementCode || isNaN(elementCode) || !elementName || !elementLens) {
        return res.status(400).json({ message: "Valid elementCode (number), elementName, and elementLens are required" });
      }
      if (!validLenses.includes(elementLens)) {
        return res.status(400).json({ message: `elementLens must be one of: ${validLenses.join(', ')}` });
      }

      const roleCategory = validRoles.includes(req.body.roleCategory) ? req.body.roleCategory : 'all';
      const customInstructions = String(req.body.customInstructions || '').trim().slice(0, 2000);

      const result = await generateElementPrompt(
        elementCode,
        elementName,
        String(req.body.elementSymbol || '').trim(),
        elementLens,
        String(req.body.elementCategory || '').trim(),
        String(req.body.elementDescription || '').trim(),
        String(req.body.existingPrompt || '').trim(),
        roleCategory,
        customInstructions
      );

      res.json(result);
    } catch (error: any) {
      console.error("Element prompt generation error:", error);
      res.status(500).json({ message: "Error generating prompt", error: error.message });
    }
  });

  app.post("/api/admin/save-element-prompt", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const parsed = insertPromptSchema.safeParse({
        lensType: req.body.lensType,
        title: req.body.title,
        description: req.body.description,
        whatItDoes: Array.isArray(req.body.whatItDoes) ? req.body.whatItDoes.filter((s: any) => typeof s === 'string' && s.trim()) : [],
        perfectFor: req.body.perfectFor || '',
        promptContent: req.body.promptContent || '',
        roleCategory: req.body.roleCategory || 'all',
        isActive: 'true',
      });

      if (!parsed.success) {
        return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten().fieldErrors });
      }

      const prompt = await storage.createPrompt(parsed.data);
      res.json(prompt);
    } catch (error: any) {
      console.error("Save prompt error:", error);
      res.status(500).json({ message: "Error saving prompt", error: error.message });
    }
  });

  app.post("/api/admin/generate-poll", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { generateLinkedInPoll } = await import("./lib/thesysApi");
      const { topicContext } = req.body;
      if (!topicContext || typeof topicContext !== 'string' || topicContext.trim().length === 0) {
        return res.status(400).json({ message: "topicContext is required" });
      }
      const poll = await generateLinkedInPoll(topicContext.trim());
      res.json(poll);
    } catch (error: any) {
      console.error("Poll generation error:", error);
      res.status(500).json({ message: "Error generating poll", error: error.message });
    }
  });

  // ==========================================
  // Notion CRM Sync Routes (Admin)
  // ==========================================

  // Get Notion database schema (to verify connection)
  app.get("/api/admin/notion/schema", requireAdminAuth, async (_req, res) => {
    try {
      const schema = await getNotionDatabaseSchema();
      res.json({ 
        message: "Notion connection verified",
        databaseId: schema.id,
        title: (schema as any).title?.[0]?.plain_text || 'Untitled',
        properties: Object.keys((schema as any).properties || {})
      });
    } catch (error: any) {
      console.error("Notion schema error:", error);
      res.status(500).json({ 
        message: "Failed to connect to Notion", 
        error: error.message 
      });
    }
  });

  // Get unsynced contacts count
  app.get("/api/admin/notion/unsynced", requireAdminAuth, async (_req, res) => {
    try {
      const unsynced = await getUnsyncedContacts();
      res.json({ 
        count: unsynced.length,
        contacts: unsynced.map(c => ({ id: c.id, email: c.email, name: c.name }))
      });
    } catch (error: any) {
      console.error("Get unsynced error:", error);
      res.status(500).json({ message: "Error fetching unsynced contacts" });
    }
  });

  // Push all contacts to Notion
  app.post("/api/admin/notion/push", requireAdminAuth, requireWriteAccess, async (_req, res) => {
    try {
      console.log('Starting Notion push all...');
      const result = await pushAllContactsToNotion();
      res.json({ 
        message: `Pushed ${result.pushed} contacts to Notion`,
        ...result 
      });
    } catch (error: any) {
      console.error("Notion push error:", error);
      res.status(500).json({ message: "Error pushing to Notion", error: error.message });
    }
  });

  // Pull updates from Notion
  app.post("/api/admin/notion/pull", requireAdminAuth, requireWriteAccess, async (_req, res) => {
    try {
      console.log('Starting Notion pull...');
      const result = await pullContactsFromNotion();
      res.json({ 
        message: `Pulled updates: ${result.updated} updated, ${result.created} created`,
        ...result 
      });
    } catch (error: any) {
      console.error("Notion pull error:", error);
      res.status(500).json({ message: "Error pulling from Notion", error: error.message });
    }
  });

  // Full two-way sync
  app.post("/api/admin/notion/sync", requireAdminAuth, requireWriteAccess, async (_req, res) => {
    try {
      console.log('Starting full Notion sync...');
      const result = await notionFullSync();
      res.json({ 
        message: `Sync complete: ${result.pushed} pushed, ${result.pulled} pulled`,
        ...result 
      });
    } catch (error: any) {
      console.error("Notion sync error:", error);
      res.status(500).json({ message: "Error syncing with Notion", error: error.message });
    }
  });

  // ==========================================
  // Prompts Library Routes
  // ==========================================

  // Public: Get all active prompts
  app.get("/api/prompts", async (_req, res) => {
    try {
      const promptsList = await storage.getActivePrompts();
      res.json(promptsList);
    } catch (error: any) {
      console.error("Get prompts error:", error);
      res.status(500).json({ message: "Error fetching prompts" });
    }
  });

  // Public: Get prompts by lens
  app.get("/api/prompts/lens/:lensType", async (req, res) => {
    try {
      const { lensType } = req.params;
      const promptsList = await storage.getPromptsByLens(lensType);
      res.json(promptsList);
    } catch (error: any) {
      console.error("Get prompts by lens error:", error);
      res.status(500).json({ message: "Error fetching prompts" });
    }
  });

  // Public: Get prompts by role category
  app.get("/api/prompts/role/:roleCategory", async (req, res) => {
    try {
      const { roleCategory } = req.params;
      const promptsList = await storage.getPromptsByRole(roleCategory);
      res.json(promptsList);
    } catch (error: any) {
      console.error("Get prompts by role error:", error);
      res.status(500).json({ message: "Error fetching prompts" });
    }
  });

  // Public: Upvote a prompt
  app.post("/api/prompts/:id/upvote", async (req, res) => {
    try {
      const { id } = req.params;
      const prompt = await storage.upvotePrompt(id);
      if (!prompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      res.json(prompt);
    } catch (error: any) {
      console.error("Upvote prompt error:", error);
      res.status(500).json({ message: "Error upvoting prompt" });
    }
  });

  // Admin: Get all prompts (including inactive)
  app.get("/api/admin/prompts", requireAdminAuth, async (_req, res) => {
    try {
      const promptsList = await storage.getAllPrompts();
      res.json(promptsList);
    } catch (error: any) {
      console.error("Admin get prompts error:", error);
      res.status(500).json({ message: "Error fetching prompts" });
    }
  });

  // Admin: Create prompt
  app.post("/api/admin/prompts", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { lensType, title, description, whatItDoes, perfectFor, promptContent, roleCategory, isActive } = req.body;
      
      // Ensure whatItDoes is an array
      const whatItDoesArray = Array.isArray(whatItDoes) ? whatItDoes : [];
      
      // Validate with schema
      const validationResult = insertPromptSchema.safeParse({
        lensType,
        title,
        description,
        whatItDoes: whatItDoesArray,
        perfectFor,
        promptContent,
        roleCategory,
        isActive: isActive || "true"
      });
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: fromError(validationResult.error).toString()
        });
      }
      
      const prompt = await storage.createPrompt(validationResult.data);
      
      res.status(201).json({ message: "Prompt created", prompt });
    } catch (error: any) {
      console.error("Create prompt error:", error);
      res.status(500).json({ message: "Error creating prompt", error: error.message });
    }
  });

  // Admin: Update prompt (supports partial updates)
  app.put("/api/admin/prompts/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Get existing prompt first
      const existingPrompt = await storage.getPromptById(id);
      if (!existingPrompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      
      // Build partial update object with only provided fields
      const partialUpdate: Record<string, any> = {};
      
      if (updateData.lensType !== undefined) partialUpdate.lensType = updateData.lensType;
      if (updateData.title !== undefined) partialUpdate.title = updateData.title;
      if (updateData.description !== undefined) partialUpdate.description = updateData.description;
      if (updateData.whatItDoes !== undefined) {
        partialUpdate.whatItDoes = Array.isArray(updateData.whatItDoes) ? updateData.whatItDoes : [];
      }
      if (updateData.perfectFor !== undefined) partialUpdate.perfectFor = updateData.perfectFor;
      if (updateData.promptContent !== undefined) partialUpdate.promptContent = updateData.promptContent;
      if (updateData.roleCategory !== undefined) partialUpdate.roleCategory = updateData.roleCategory;
      if (updateData.isActive !== undefined) partialUpdate.isActive = updateData.isActive;
      
      const prompt = await storage.updatePrompt(id, partialUpdate);
      if (!prompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      
      res.json({ message: "Prompt updated", prompt });
    } catch (error: any) {
      console.error("Update prompt error:", error);
      res.status(500).json({ message: "Error updating prompt", error: error.message });
    }
  });

  // Admin: Delete prompt
  app.delete("/api/admin/prompts/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePrompt(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      
      res.json({ message: "Prompt deleted" });
    } catch (error: any) {
      console.error("Delete prompt error:", error);
      res.status(500).json({ message: "Error deleting prompt", error: error.message });
    }
  });

  // Admin: Seed initial prompts (one-time operation)
  app.post("/api/admin/prompts/seed", requireAdminAuth, requireWriteAccess, async (_req, res) => {
    try {
      // Check if prompts already exist
      const existingPrompts = await storage.getAllPrompts();
      if (existingPrompts.length > 0) {
        return res.status(400).json({ 
          message: `Database already has ${existingPrompts.length} prompts. Clear them first if you want to reseed.` 
        });
      }
      
      // Seed prompts for all 8 lenses + quick wins
      const seedPrompts = [
        {
          lensType: "influence",
          title: "Influence Lens — How You Persuade & Lead",
          description: "Analyse your natural influence style, persuasion strategies, and leadership patterns.",
          whatItDoes: [
            "How you naturally influence and persuade others",
            "Your preferred influence strategies (advising, supporting, ordering, etc.)",
            "Your use of timing, body language, and communication rhythm",
            "Patterns that work well and areas where you might create friction"
          ],
          perfectFor: "Understanding your leadership style, preparing for negotiations, or improving how you guide teams.",
          promptContent: `# 🔴 Influence Lens Analysis

## What you'll get
A personalised analysis of how you influence, persuade, and lead others based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **🔴 INFLUENCE LENS** only.

The Influence Lens includes these elements:
- **1101** Influence Strategies
- **1102** Quantum Conversations
- **1103** GreenBlueRed™ (timing, body language, rhythm)
- **1104** Periodic Table
- **1105** Head-Up Display
- **1106** Facilitating & Hosting
- **1201** Advising
- **1202** Red Question
- **1203** Suggesting
- **1204** Supporting
- **1205** Ordering
- **1206** Agreeing

## Your task

1. Read the person's scan data carefully
2. Identify their top 3-5 influence patterns using element codes and names
3. Write in "You..." voice (second person)
4. Include direct quotes or scores as evidence
5. Be specific and actionable

## Output format

### 🔴 Your Influence Pattern

**"[One clear sentence describing how this person influences others]"**

### What you do naturally

- **[Element name]** ([code]): [specific behaviour with evidence]

### Where you create impact

[2-3 sentences about when and where their influence works best]

### Watch out for

- [Potential friction point or overuse pattern]

### 3 micro-experiments to try

1. **[Specific action]**: [Why this matters]
2. **[Specific action]**: [Why this matters]
3. **[Specific action]**: [Why this matters]

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
          roleCategory: "all",
          isActive: "true",
          votes: "42"
        },
        {
          lensType: "attitude",
          title: "Attitude Lens — Your Approach to Change & Learning",
          description: "Explore how you respond to change, learning preferences, and growth patterns.",
          whatItDoes: [
            "How you respond to change and new challenges",
            "Your learning preferences and retention patterns",
            "Your capacity for self-reflection and growth",
            "Which attitudes serve you (and which might limit you)"
          ],
          perfectFor: "Understanding resistance patterns, designing learning plans, or building sustainable habits.",
          promptContent: `# 🟠 Attitude Lens Analysis

## What you'll get
A personalised analysis of how you approach change, learning, and growth based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **🟠 ATTITUDE LENS** only.

The Attitude Lens includes these elements:
- **2101** Attitude to Change
- **2102** Learning Retention
- **2103** Micro-Habits
- **2104** Self-Reflection
- **2401** Attitude 0 (resistance)
- **2402** Attitude I (cautious openness)
- **2403** Attitude II (active engagement)
- **2404** Attitude III (full integration)

## Your task

1. Read the person's scan data carefully
2. Identify their attitude level (0, I, II, or III) and learning patterns
3. Write in "You..." voice (second person)
4. Include direct quotes or scores as evidence
5. Be encouraging and realistic

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
          roleCategory: "all",
          isActive: "true",
          votes: "38"
        },
        {
          lensType: "chaordic",
          title: "Chaordic Lens — Structure vs. Freedom in Conversation",
          description: "Discover how you balance order and chaos in collaborative settings.",
          whatItDoes: [
            "How you balance structure (order) and flexibility (chaos) in conversations",
            "Which conversational formats you prefer (debate, dialogue, co-creation, etc.)",
            "Your natural role in group settings (Participant, Harvester, Host, Steward)",
            "When structure helps you and when it constrains you"
          ],
          perfectFor: "Designing meetings, facilitation work, or understanding team dynamics.",
          promptContent: `# 🟡 Chaordic Lens Analysis

## What you'll get
A personalised analysis of how you navigate structure and freedom in conversations based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **🟡 CHAORDIC LENS** only.

The Chaordic Lens includes these elements:
- **3101** Chaordic Balance
- **3102** Algorithm Canvas
- **3111** Chaordic Roles
- **3112** Participant
- **3113** Harvester
- **3114** Host
- **3115** Steward

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
          roleCategory: "all",
          isActive: "true",
          votes: "35"
        },
        {
          lensType: "flow",
          title: "Flow Lens — Challenge, Skill & Motivation Balance",
          description: "Understand your flow state triggers, blockers, and optimal performance conditions.",
          whatItDoes: [
            "How your skills match your challenges",
            "What motivates you (and what drains you)",
            "When you experience flow states",
            "How feedback loops support or disrupt your momentum"
          ],
          perfectFor: "Designing work that energises you, preventing burnout, or optimising productivity.",
          promptContent: `# 🟢 Flow Lens Analysis

## What you'll get
A personalised analysis of your flow patterns, skill-challenge balance, and motivation drivers based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **🟢 FLOW LENS** only.

The Flow Lens includes these elements:
- **4101** Measuring Flow
- **4102** Conscious Feedback
- **4103** Motivation
- **4104** Challenge
- **4105** Skill

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
          roleCategory: "all",
          isActive: "true",
          votes: "41"
        },
        {
          lensType: "alignment",
          title: "Alignment & Empathy Lens — Trust & Connection",
          description: "Explore how you build trust and create deep connection with others.",
          whatItDoes: [
            "How you build trust and connection with others",
            "Your use of empathic listening techniques (mirroring, summarising, labelling)",
            "Your strengths in kindness, respect, curiosity, and empathy",
            "How timing, silence, and body language support alignment"
          ],
          perfectFor: "Deepening relationships, coaching conversations, or building psychological safety.",
          promptContent: `# 🟢 Alignment & Empathy Lens Analysis

## What you'll get
A personalised analysis of how you create trust, connection, and empathy based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **🟢 ALIGNMENT & EMPATHY LENS** only.

The Alignment & Empathy Lens includes these elements:
- **5101** Alignment
- **5102** Congruence
- **5201** Positive Phrases
- **5202** Green Questions
- **5203** Mirroring
- **5204** Summarising
- **5401-5406** Kindness, Respect, Building Trust, Empathy, Curiosity, Agape

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
          roleCategory: "all",
          isActive: "true",
          votes: "47"
        },
        {
          lensType: "needs",
          title: "Needs Lens — Understanding What Drives You",
          description: "Discover which needs are met, unmet, and how you express them.",
          whatItDoes: [
            "Which needs are met and which are unmet in your work and relationships",
            "How you express (or don't express) your needs",
            "Your understanding of others' needs",
            "Patterns around psychological safety, respect, autonomy, and belonging"
          ],
          perfectFor: "Conflict resolution, team building, or understanding what's missing in your environment.",
          promptContent: `# 🟢 Needs Lens Analysis

## What you'll get
A personalised analysis of your needs, how well they're met, and how you express them, based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **🟢 NEEDS LENS** only.

The Needs Lens includes these elements:
- **6101** Chakra Needs
- **6102** Hierarchy of Needs
- **6103** Assumptions
- **6104** Functional Conflicts
- **6106** Stages of Team
- **6201** Conscious Request
- **6401** Psychological Safety

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
          roleCategory: "all",
          isActive: "true",
          votes: "39"
        },
        {
          lensType: "ego",
          title: "Ego Lens — Triggers, Hats & Self-Awareness",
          description: "Understand your ego triggers, protective patterns, and which 'hats' you wear.",
          whatItDoes: [
            "Your ego triggers (what activates defensiveness or reaction)",
            "Which 'ego hats' you wear (Judge, Hero, Narrator, etc.)",
            "How you protect yourself and where you might hide",
            "Patterns of learning, gratitude, and self-love"
          ],
          perfectFor: "Self-awareness work, understanding defensiveness, or recognising protective patterns.",
          promptContent: `# 🔵 Ego Lens Analysis

## What you'll get
A personalised analysis of your ego patterns, triggers, and protective strategies based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **🔵 EGO LENS** only.

The Ego Lens includes these elements:
- **7101** Ego Triggers
- **7102** Drama Triangle
- **7109** Ego Hats
- **7110-7117** Interpretor, Interrogator, Judge, Devil's Advocate, Hero, Narrator, Hermit, Artisan
- **7401-7406** Learning, Pragmatism, Philautia (self-love), Ego, Gratitude, Responsibilities

## IMPORTANT: Reversed scale interpretation

**Ego Distance scale interpretation:**
- **LOW scores (1-3/10)** = HIGH ego distance = POSITIVE
- **HIGH scores (8-10/10)** = LOW ego distance = CONCERNING

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
          roleCategory: "all",
          isActive: "true",
          votes: "44"
        },
        {
          lensType: "dynamics",
          title: "Dynamics Lens — Relationships & Boundaries",
          description: "Explore how you navigate relationships, power dynamics, and boundaries.",
          whatItDoes: [
            "How you navigate relationship dynamics and power",
            "Your ability to say no and set boundaries",
            "How you handle polarity (masculine/feminine, giving/receiving)",
            "Patterns around consent, forgiveness, and relational rituals"
          ],
          perfectFor: "Relationship work, boundary setting, or understanding team dynamics.",
          promptContent: `# 🟣 Dynamics Lens Analysis

## What you'll get
A personalised analysis of your relationship dynamics, boundaries, and polarity patterns based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **🟣 DYNAMICS LENS** only.

The Dynamics Lens includes these elements:
- **8101** Relationship Dynamics
- **8102** Conscious Consent
- **8103** Yin Yang Polarity
- **8201** Saying No
- **8401** Forgiveness

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
          roleCategory: "all",
          isActive: "true",
          votes: "36"
        },
        {
          lensType: "quickwins",
          title: "Quick Wins — Top 3 Strengths to Leverage Now",
          description: "Get your top 3 communication superpowers across all lenses with a one-week action plan.",
          whatItDoes: [
            "Your top 3 communication superpowers",
            "Exactly where and when to use each one",
            "A one-week action plan to leverage these strengths",
            "Quick, practical micro-experiments"
          ],
          perfectFor: "When you want immediate, actionable insights without reading 8 separate analyses.",
          promptContent: `# 🌈 Quick Wins — Your Top 3 Communication Strengths

## What you'll get
A fast, actionable summary of your top 3 communication superpowers and how to use them this week.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below across ALL 8 lenses, but focus on finding the **top 3 strengths** this person can leverage immediately.

## Your task

1. Read the person's scan data carefully
2. Identify the 3 strongest patterns across all lenses
3. For each strength, provide:
   - The element name and code
   - Why it's a superpower for them
   - Specific situations where they should use it
   - One micro-experiment for this week
4. Write in "You..." voice (second person)
5. Be encouraging and specific

## Output format

### 🌈 Your Top 3 Communication Superpowers

**Based on your Satellite Scan, here are your strongest assets:**

---

### Strength #1: [Element Name] ([code])

**Why this is your superpower:**
[2-3 sentences with evidence from their scan]

**When to use it:**
- [Specific situation 1]
- [Specific situation 2]

**This week's experiment:**
[One concrete action they can take in the next 7 days]

---

### Your One-Week Action Plan

**Monday-Tuesday:** [Use strength #1 in this way]
**Wednesday-Thursday:** [Use strength #2 in this way]
**Friday-Weekend:** [Use strength #3 in this way]

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
          roleCategory: "all",
          isActive: "true",
          votes: "58"
        }
      ];
      
      const createdPrompts = [];
      for (const promptData of seedPrompts) {
        const prompt = await storage.createPrompt(promptData as any);
        createdPrompts.push(prompt);
      }
      
      res.status(201).json({ 
        message: `Successfully seeded ${createdPrompts.length} prompts`,
        prompts: createdPrompts
      });
    } catch (error: any) {
      console.error("Seed prompts error:", error);
      res.status(500).json({ message: "Error seeding prompts", error: error.message });
    }
  });

  // ===== ONBOARDING EMAIL TEMPLATES ADMIN ROUTES =====
  
  // Get all onboarding email templates
  app.get("/api/admin/onboarding-emails", requireAdminAuth, async (_req, res) => {
    try {
      const templates = await storage.getAllOnboardingEmailTemplates();
      res.json(templates);
    } catch (error: any) {
      console.error("Get onboarding templates error:", error);
      res.status(500).json({ message: "Error fetching templates", error: error.message });
    }
  });

  // Get single template by ID
  app.get("/api/admin/onboarding-emails/:id", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.getOnboardingEmailTemplateById(id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error: any) {
      console.error("Get template error:", error);
      res.status(500).json({ message: "Error fetching template", error: error.message });
    }
  });

  // Create new template
  app.post("/api/admin/onboarding-emails", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { sequenceNumber, delayMinutes, triggerEvent, subject, body, isActive, title } = req.body;
      
      if (!sequenceNumber || !delayMinutes || !triggerEvent || !subject || !body) {
        return res.status(400).json({ message: "Missing required fields: sequenceNumber, delayMinutes, triggerEvent, subject, body" });
      }
      
      const template = await storage.createOnboardingEmailTemplate({
        sequenceNumber: String(sequenceNumber),
        delayMinutes: String(delayMinutes),
        triggerEvent,
        subject,
        body,
        isActive: isActive ?? 'true',
        title: title || `Email #${sequenceNumber}`,
      });
      
      res.status(201).json(template);
    } catch (error: any) {
      console.error("Create template error:", error);
      res.status(500).json({ message: "Error creating template", error: error.message });
    }
  });

  // Update template
  app.put("/api/admin/onboarding-emails/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { id } = req.params;
      const updates: Partial<InsertOnboardingEmailTemplate> = {};
      
      if (req.body.sequenceNumber !== undefined) updates.sequenceNumber = String(req.body.sequenceNumber);
      if (req.body.delayMinutes !== undefined) updates.delayMinutes = String(req.body.delayMinutes);
      if (req.body.triggerEvent !== undefined) updates.triggerEvent = req.body.triggerEvent;
      if (req.body.subject !== undefined) updates.subject = req.body.subject;
      if (req.body.body !== undefined) updates.body = req.body.body;
      if (req.body.isActive !== undefined) updates.isActive = String(req.body.isActive);
      if (req.body.title !== undefined) updates.title = req.body.title;
      
      const template = await storage.updateOnboardingEmailTemplate(id, updates);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json(template);
    } catch (error: any) {
      console.error("Update template error:", error);
      res.status(500).json({ message: "Error updating template", error: error.message });
    }
  });

  // Delete template
  app.delete("/api/admin/onboarding-emails/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteOnboardingEmailTemplate(id);
      if (!deleted) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json({ message: "Template deleted successfully" });
    } catch (error: any) {
      console.error("Delete template error:", error);
      res.status(500).json({ message: "Error deleting template", error: error.message });
    }
  });

  // Get email logs for a customer
  app.get("/api/admin/onboarding-emails/logs/:email", requireAdminAuth, async (req, res) => {
    try {
      const { email } = req.params;
      const logs = await storage.getOnboardingEmailLogsByCustomer(email);
      res.json(logs);
    } catch (error: any) {
      console.error("Get logs error:", error);
      res.status(500).json({ message: "Error fetching logs", error: error.message });
    }
  });

  // Manually trigger an onboarding email for a customer
  app.post("/api/admin/onboarding-emails/send", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { customerEmail, sequenceNumber } = req.body;
      
      if (!customerEmail || sequenceNumber === undefined) {
        return res.status(400).json({ message: "Missing required fields: customerEmail, sequenceNumber" });
      }
      
      const { triggerOnboardingEmail } = await import("./onboarding-scheduler");
      const result = await triggerOnboardingEmail(customerEmail, String(sequenceNumber));
      
      if (result.success) {
        res.json({ message: result.message });
      } else {
        res.status(400).json({ message: result.message });
      }
    } catch (error: any) {
      console.error("Send email error:", error);
      res.status(500).json({ message: "Error sending email", error: error.message });
    }
  });

  // Seed initial Fibonacci-timed onboarding email templates
  app.post("/api/admin/onboarding-emails/seed", requireAdminAuth, requireWriteAccess, async (_req, res) => {
    try {
      // Check if templates already exist
      const existingTemplates = await storage.getAllOnboardingEmailTemplates();
      if (existingTemplates.length > 0) {
        return res.status(400).json({ 
          message: `Templates already exist (${existingTemplates.length} found). Delete them first to re-seed.` 
        });
      }
      
      // Fibonacci timing: 0 (immediate), 1h, 1d, 2d, 3d, 5d, 8d, 13d, 21d, 34d
      const fibonacciTemplates = [
        {
          sequenceNumber: '0',
          delayMinutes: '0',
          triggerEvent: 'purchase' as const,
          subject: 'Welcome to Your Satellite Scan Journey, {{firstName}}!',
          title: 'Immediate welcome after purchase',
          body: `<p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">Welcome aboard! Your Satellite Scan purchase has been confirmed.</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;"><strong>What happens next:</strong></p>
<ol style="line-height: 1.8;">
<li>Complete your Satellite Scan (90-minute questionnaire)</li>
<li>Receive your raw data immediately after completion</li>
<li>Get your personalized dashboard within 48-72 hours</li>
</ol>
<div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
<p style="margin: 0; color: #15803d;"><strong>Ready to start?</strong></p>
<div style="text-align: center; margin-top: 15px;">
<a href="https://greenelephantorg.typeform.com/individualscan" style="display: inline-block; background-color: #16a34a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">Start Your Satellite Scan</a>
</div>
</div>
<p style="color: #374151; margin-top: 25px;">Warm regards,<br><strong>The GreenElephant Team</strong></p>`,
          isActive: 'true',
        },
        {
          sequenceNumber: '1',
          delayMinutes: '60',
          triggerEvent: 'scan_completed' as const,
          subject: 'Your Data is In, {{firstName}} — What\'s Next?',
          title: '1 hour after scan completion',
          body: `<p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">Congratulations on completing your Satellite Scan! Your raw data has been sent to your inbox.</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;"><strong>While you wait for your dashboard (48-72 hours):</strong></p>
<ul style="line-height: 1.8;">
<li>Explore our <a href="https://greenelephant.org/resources" style="color: #009999;">Resources & Prompts</a></li>
<li>Try the <a href="https://chatgpt.com/g/g-bUJ6dvAHK-conscious-communicator" style="color: #009999;">Conscious Communicator GPT</a></li>
<li>Paste your raw data into any prompt to start discovering patterns</li>
</ul>
<p style="color: #374151; margin-top: 25px;">Your journey of self-discovery begins now!<br><strong>The GreenElephant Team</strong></p>`,
          isActive: 'true',
        },
        {
          sequenceNumber: '2',
          delayMinutes: '1440',
          triggerEvent: 'scan_completed' as const,
          subject: 'Day 1: Start Mining Your Communication Patterns',
          title: '1 day after scan completion',
          body: `<p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">It's been a day since you completed your Satellite Scan. Have you had a chance to explore your data?</p>
<div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
<p style="margin: 0 0 10px 0; color: #1e40af;"><strong>Today's Suggestion:</strong></p>
<p style="margin: 0; color: #1e3a8a;">Try the "Quick Wins" prompt to discover your top 3 communication strengths. It takes just 5 minutes!</p>
</div>
<p style="color: #374151;">Curious about a specific area? Reply to this email with your question.<br><strong>The GreenElephant Team</strong></p>`,
          isActive: 'true',
        },
        {
          sequenceNumber: '3',
          delayMinutes: '2880',
          triggerEvent: 'scan_completed' as const,
          subject: 'Day 3: Your Dashboard Insights Await',
          title: '2 days after scan completion (cumulative 3 days)',
          body: `<p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">By now, your personalized dashboard should be ready or arriving shortly. If you haven't received it yet, it's on its way!</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;"><strong>What to look for in your dashboard:</strong></p>
<ul style="line-height: 1.8;">
<li>Your dominant communication lens</li>
<li>Hidden strengths you might not recognize</li>
<li>Areas where small shifts create big impact</li>
</ul>
<p style="color: #374151;">Questions about your dashboard? Just reply to this email.<br><strong>The GreenElephant Team</strong></p>`,
          isActive: 'true',
        },
        {
          sequenceNumber: '4',
          delayMinutes: '4320',
          triggerEvent: 'scan_completed' as const,
          subject: 'Day 6: Deep Dive into Your Influence Patterns',
          title: '3 days after previous (cumulative 6 days)',
          body: `<p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">This week, let's explore your Influence Lens—how you naturally persuade, inspire, and lead others.</p>
<div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
<p style="margin: 0 0 10px 0; color: #92400e;"><strong>Reflection Question:</strong></p>
<p style="margin: 0; color: #78350f;">Think of a recent conversation where you successfully influenced someone's perspective. What did you do naturally?</p>
</div>
<p style="color: #374151;">Use the Influence Lens prompt with your data to discover more.<br><strong>The GreenElephant Team</strong></p>`,
          isActive: 'true',
        },
        {
          sequenceNumber: '5',
          delayMinutes: '7200',
          triggerEvent: 'scan_completed' as const,
          subject: 'Day 11: Mastering the Chaordic Balance',
          title: '5 days after previous (cumulative 11 days)',
          body: `<p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">Have you ever noticed how some meetings feel too rigid while others spiral into chaos?</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">Your Chaordic Lens reveals how you naturally balance structure and freedom in conversations.</p>
<div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
<p style="margin: 0 0 10px 0; color: #166534;"><strong>This Week's Experiment:</strong></p>
<p style="margin: 0; color: #15803d;">In your next meeting, notice when the conversation needs more structure vs. more freedom. What role do you naturally take?</p>
</div>
<p style="color: #374151;">Curious about your facilitation style? Try the Chaordic Lens prompt!<br><strong>The GreenElephant Team</strong></p>`,
          isActive: 'true',
        },
        {
          sequenceNumber: '6',
          delayMinutes: '11520',
          triggerEvent: 'scan_completed' as const,
          subject: 'Day 19: Understanding Your Flow States',
          title: '8 days after previous (cumulative 19 days)',
          body: `<p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">When was the last time you were completely absorbed in a conversation? Time flew by, ideas flowed naturally, and you felt energized afterward?</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">That's your communication flow state.</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">Your Flow Lens data reveals:</p>
<ul style="line-height: 1.8;">
<li>What conditions trigger your best conversations</li>
<li>What drains your communication energy</li>
<li>How to design more flow into your daily interactions</li>
</ul>
<p style="color: #374151;">Explore the Flow Lens prompt with your data!<br><strong>The GreenElephant Team</strong></p>`,
          isActive: 'true',
        },
        {
          sequenceNumber: '7',
          delayMinutes: '18720',
          triggerEvent: 'scan_completed' as const,
          subject: 'Day 32: The Power of Alignment',
          title: '13 days after previous (cumulative 32 days)',
          body: `<p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">A month into your Satellite Scan journey—how have your conversations changed?</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">Today, let's explore Alignment—the art of ensuring your words match your intentions, and your intentions serve your deeper values.</p>
<div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
<p style="margin: 0 0 10px 0; color: #1e40af;"><strong>Alignment Check:</strong></p>
<p style="margin: 0; color: #1e3a8a;">Think of a conversation that felt "off" recently. Where might there have been a misalignment between what you said, what you meant, and what you truly wanted?</p>
</div>
<p style="color: #374151;">The Alignment Lens prompt can help you discover patterns!<br><strong>The GreenElephant Team</strong></p>`,
          isActive: 'true',
        },
        {
          sequenceNumber: '8',
          delayMinutes: '30240',
          triggerEvent: 'scan_completed' as const,
          subject: 'Day 53: Navigating Needs & Ego',
          title: '21 days after previous (cumulative 53 days)',
          body: `<p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">Nearly two months into your conscious communication journey. You've explored influence, flow, and alignment.</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">Now let's go deeper—into Needs and Ego.</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">These two lenses reveal:</p>
<ul style="line-height: 1.8;">
<li>The unspoken needs driving your conversations</li>
<li>How ego protection patterns might be limiting connection</li>
<li>Ways to transform conflict into understanding</li>
</ul>
<p style="color: #374151;">Ready for the deeper work? Try the Needs Lens and Ego Lens prompts.<br><strong>The GreenElephant Team</strong></p>`,
          isActive: 'true',
        },
        {
          sequenceNumber: '9',
          delayMinutes: '48960',
          triggerEvent: 'scan_completed' as const,
          subject: 'Day 87: Your Journey So Far & What\'s Next',
          title: '34 days after previous (cumulative 87 days)',
          body: `<p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">Three months ago, you took your first step toward conscious communication with your Satellite Scan.</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;"><strong>Take a moment to reflect:</strong></p>
<ul style="line-height: 1.8;">
<li>What communication patterns have you noticed?</li>
<li>Which insights surprised you most?</li>
<li>What small shifts have made the biggest difference?</li>
</ul>
<div style="background-color: #f3e8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #9333ea;">
<p style="margin: 0 0 10px 0; color: #6b21a8;"><strong>Ready for the Next Level?</strong></p>
<p style="margin: 0; color: #7c3aed;">If you'd like personalized coaching to accelerate your growth, check out our <a href="https://greenelephant.org/coaching" style="color: #9333ea;">Coaching Journey</a> or book a <a href="https://greenelephant.org/programs" style="color: #9333ea;">1:1 Session</a>.</p>
</div>
<p style="color: #374151;">Thank you for being part of the GreenElephant community!<br><strong>The GreenElephant Team</strong></p>`,
          isActive: 'true',
        },
      ];
      
      const createdTemplates = [];
      for (const templateData of fibonacciTemplates) {
        const template = await storage.createOnboardingEmailTemplate(templateData);
        createdTemplates.push(template);
      }
      
      res.status(201).json({ 
        message: `Successfully seeded ${createdTemplates.length} Fibonacci-timed onboarding email templates`,
        templates: createdTemplates
      });
    } catch (error: any) {
      console.error("Seed onboarding templates error:", error);
      res.status(500).json({ message: "Error seeding templates", error: error.message });
    }
  });

  // ===== BATCH EMAIL ADMIN ENDPOINTS =====

  // Preview contacts with filters (for batch email UI)
  app.post("/api/admin/batch-email/preview", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { includeChannels, excludeChannels } = req.body;
      
      const contacts = await storage.getContactsWithFilters(
        includeChannels || [],
        excludeChannels || []
      );
      
      res.json({
        count: contacts.length,
        contacts: contacts.map(c => ({
          id: c.id,
          email: c.email,
          name: c.name,
          channelsReached: c.channelsReached || [],
          source: c.source,
        }))
      });
    } catch (error: any) {
      console.error("Batch email preview error:", error);
      res.status(500).json({ message: "Error previewing recipients", error: error.message });
    }
  });

  // Send batch email to filtered contacts
  app.post("/api/admin/batch-email/send", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { subject, body, includeChannels, excludeChannels } = req.body;
      
      if (!subject || !body) {
        return res.status(400).json({ message: "Subject and body are required" });
      }

      // Get filtered contacts
      const contacts = await storage.getContactsWithFilters(
        includeChannels || [],
        excludeChannels || []
      );

      if (contacts.length === 0) {
        return res.status(400).json({ message: "No contacts match the filter criteria" });
      }

      // Create batch email send record
      const batchSend = await storage.createBatchEmailSend({
        subject,
        body,
        filterCriteria: { includeChannels, excludeChannels },
        recipientCount: contacts.length.toString(),
      });

      if (!(await isConnectorEnabled("resend"))) {
        return res.status(503).json({ message: "Email sending is currently disabled. Enable Resend in Connected Tools." });
      }
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      let successCount = 0;
      let failedCount = 0;
      const results: { email: string; status: string; error?: string }[] = [];

      // Send emails to all contacts
      for (const contact of contacts) {
        // Create recipient record
        const recipient = await storage.createBatchEmailRecipient({
          batchId: batchSend.id,
          contactId: contact.id,
          email: contact.email,
          status: 'pending',
        });

        try {
          // Replace variables in body
          let personalizedBody = body
            .replace(/\{\{firstName\}\}/g, contact.name?.split(' ')[0] || 'there')
            .replace(/\{\{name\}\}/g, contact.name || 'there')
            .replace(/\{\{email\}\}/g, contact.email);

          await resend.emails.send({
            from: 'GreenElephant <hello@greenelephant.org>',
            to: contact.email,
            subject: subject,
            html: `
              <div style="font-family: 'Lato', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
                ${personalizedBody}
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                <p style="font-size: 12px; color: #6b7280; text-align: center;">
                  You received this email because you signed up at GreenElephant.org<br/>
                  <a href="https://greenelephant.org" style="color: #0ea5e9;">Visit GreenElephant.org</a>
                </p>
              </div>
            `,
          });

          successCount++;
          await storage.updateBatchEmailRecipient(recipient.id, {
            status: 'sent',
            sentAt: new Date(),
          });
          results.push({ email: contact.email, status: 'sent' });
        } catch (emailError: any) {
          failedCount++;
          await storage.updateBatchEmailRecipient(recipient.id, {
            status: 'failed',
            errorMessage: emailError.message,
          });
          results.push({ email: contact.email, status: 'failed', error: emailError.message });
        }
      }

      // Update batch send record
      await storage.updateBatchEmailSend(batchSend.id, {
        successCount: successCount.toString(),
        failedCount: failedCount.toString(),
        status: 'completed',
        sentAt: new Date(),
      });

      console.log(`📧 Batch email completed: ${successCount} sent, ${failedCount} failed`);

      res.json({
        message: `Batch email completed`,
        batchId: batchSend.id,
        total: contacts.length,
        successCount,
        failedCount,
        results,
      });
    } catch (error: any) {
      console.error("Batch email send error:", error);
      res.status(500).json({ message: "Error sending batch email", error: error.message });
    }
  });

  // Get all batch email sends history
  app.get("/api/admin/batch-email/history", requireAdminAuth, async (_req, res) => {
    try {
      const history = await storage.getAllBatchEmailSends();
      res.json(history);
    } catch (error: any) {
      console.error("Batch email history error:", error);
      res.status(500).json({ message: "Error fetching batch email history" });
    }
  });

  // Get batch email send details with recipients
  app.get("/api/admin/batch-email/:id", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      
      const batchSend = await storage.getBatchEmailSendById(id);
      if (!batchSend) {
        return res.status(404).json({ message: "Batch email send not found" });
      }
      
      const recipients = await storage.getBatchEmailRecipientsByBatchId(id);
      
      res.json({
        ...batchSend,
        recipients,
      });
    } catch (error: any) {
      console.error("Batch email details error:", error);
      res.status(500).json({ message: "Error fetching batch email details" });
    }
  });

  // Get all contacts (admin endpoint for contacts list)
  app.get("/api/admin/contacts", requireAdminAuth, async (_req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts.map(c => ({
        id: c.id,
        email: c.email,
        name: c.name,
        channelsReached: c.channelsReached || [],
        source: c.source,
        createdAt: c.createdAt,
        notionSyncedAt: c.notionSyncedAt,
        scanSubmittedAt: c.scanSubmittedAt,
      })));
    } catch (error: any) {
      console.error("Admin contacts error:", error);
      res.status(500).json({ message: "Error fetching contacts" });
    }
  });

  // ==================== NEWSLETTER CAMPAIGNS ====================
  
  // Get all newsletter campaigns
  app.get("/api/admin/newsletter/campaigns", requireAdminAuth, async (_req, res) => {
    try {
      const campaigns = await storage.getAllNewsletterCampaigns();
      res.json(campaigns);
    } catch (error: any) {
      console.error("Newsletter campaigns list error:", error);
      res.status(500).json({ message: "Error fetching campaigns" });
    }
  });

  // Create new newsletter campaign
  app.post("/api/admin/newsletter/campaigns", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { name, subject, htmlContent } = req.body;
      if (!name || !subject || !htmlContent) {
        return res.status(400).json({ message: "Name, subject, and content are required" });
      }
      
      const campaign = await storage.createNewsletterCampaign({
        name,
        subject,
        htmlContent,
        status: "draft"
      });
      
      res.json(campaign);
    } catch (error: any) {
      console.error("Create campaign error:", error);
      res.status(500).json({ message: "Error creating campaign" });
    }
  });

  // Get single campaign with recipients
  app.get("/api/admin/newsletter/campaigns/:id", requireAdminAuth, async (req, res) => {
    try {
      const campaign = await storage.getNewsletterCampaignById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      const recipients = await storage.getNewsletterRecipientsByCampaign(req.params.id);
      res.json({ campaign, recipients });
    } catch (error: any) {
      console.error("Get campaign error:", error);
      res.status(500).json({ message: "Error fetching campaign" });
    }
  });

  // Update campaign content
  app.patch("/api/admin/newsletter/campaigns/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { name, subject, htmlContent, status } = req.body;
      const campaign = await storage.updateNewsletterCampaign(req.params.id, {
        ...(name && { name }),
        ...(subject && { subject }),
        ...(htmlContent && { htmlContent }),
        ...(status && { status })
      });
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      res.json(campaign);
    } catch (error: any) {
      console.error("Update campaign error:", error);
      res.status(500).json({ message: "Error updating campaign" });
    }
  });

  // Delete campaign
  app.delete("/api/admin/newsletter/campaigns/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      await storage.deleteNewsletterCampaign(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Delete campaign error:", error);
      res.status(500).json({ message: "Error deleting campaign" });
    }
  });

  // Populate recipients for a campaign (select who gets the email)
  app.post("/api/admin/newsletter/campaigns/:id/populate-recipients", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const campaign = await storage.getNewsletterCampaignById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      // Get all contacts
      const contacts = await storage.getAllContacts();
      
      // Check existing recipients to avoid duplicates
      const existingRecipients = await storage.getNewsletterRecipientsByCampaign(req.params.id);
      const existingContactIds = new Set(existingRecipients.map(r => r.contactId));
      
      let added = 0;
      for (const contact of contacts) {
        if (!existingContactIds.has(contact.id)) {
          await storage.createNewsletterRecipient({
            campaignId: req.params.id,
            contactId: contact.id,
            email: contact.email,
            excluded: "false",
            status: "pending"
          });
          added++;
        }
      }
      
      const allRecipients = await storage.getNewsletterRecipientsByCampaign(req.params.id);
      res.json({ 
        message: `Added ${added} new recipients`, 
        totalRecipients: allRecipients.length,
        recipients: allRecipients
      });
    } catch (error: any) {
      console.error("Populate recipients error:", error);
      res.status(500).json({ message: "Error populating recipients" });
    }
  });

  // Toggle recipient exclusion (opt out specific person)
  app.patch("/api/admin/newsletter/recipients/:id/toggle-exclude", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { excluded } = req.body;
      const recipient = await storage.updateNewsletterRecipient(req.params.id, {
        excluded: excluded ? "true" : "false"
      });
      
      if (!recipient) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      
      res.json(recipient);
    } catch (error: any) {
      console.error("Toggle exclude error:", error);
      res.status(500).json({ message: "Error toggling exclusion" });
    }
  });

  // Send newsletter campaign
  app.post("/api/admin/newsletter/campaigns/:id/send", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const campaign = await storage.getNewsletterCampaignById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      if (campaign.status === "sent") {
        return res.status(400).json({ message: "Campaign already sent" });
      }
      
      // Update status to sending
      await storage.updateNewsletterCampaign(req.params.id, { status: "sending" });
      
      // Get non-excluded recipients
      const recipients = await storage.getNewsletterRecipientsByCampaign(req.params.id);
      const toSend = recipients.filter(r => r.excluded === "false" && r.status === "pending");
      
      if (toSend.length === 0) {
        return res.status(400).json({ message: "No recipients to send to" });
      }
      
      if (!(await isConnectorEnabled("resend"))) {
        return res.status(503).json({ message: "Email sending is currently disabled. Enable Resend in Connected Tools." });
      }
      const { getUncachableResendClient } = await import("./resend-client");
      const { client: resend, fromEmail } = await getUncachableResendClient();
      
      const senderEmail = fromEmail || "hello@greenelephant.org";
      const formattedFrom = `Esteve from GreenElephant <${senderEmail}>`;
      console.log(`📧 Sending campaign "${campaign.name}" from: ${formattedFrom}`);
      
      let successCount = 0;
      let failedCount = 0;
      
      for (const recipient of toSend) {
        try {
          // Build email with open tracking pixel
          const trackingPixel = `<img src="https://greenelephant.org/api/newsletter/track/${campaign.id}/${recipient.contactId}/open.gif" width="1" height="1" style="display:none" alt="" />`;
          const htmlWithTracking = campaign.htmlContent + trackingPixel;
          
          await resend.emails.send({
            from: formattedFrom,
            to: recipient.email,
            subject: campaign.subject,
            html: htmlWithTracking,
          });
          
          await storage.updateNewsletterRecipient(recipient.id, {
            status: "sent",
            sentAt: new Date()
          });
          
          successCount++;
        } catch (emailError: any) {
          console.error(`Failed to send to ${recipient.email}:`, emailError.message);
          await storage.updateNewsletterRecipient(recipient.id, {
            status: "failed",
            errorMessage: emailError.message
          });
          failedCount++;
        }
      }
      
      // Update campaign status
      await storage.updateNewsletterCampaign(req.params.id, {
        status: "sent",
        sentAt: new Date()
      });
      
      // Trigger Notion sync for sent recipients
      await syncNewsletterToNotion(req.params.id);
      
      res.json({
        success: true,
        sent: successCount,
        failed: failedCount
      });
    } catch (error: any) {
      console.error("Send campaign error:", error);
      res.status(500).json({ message: "Error sending campaign" });
    }
  });

  // Reset campaign for resending (resets all recipient statuses to pending)
  app.post("/api/admin/newsletter/campaigns/:id/reset", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const campaign = await storage.getNewsletterCampaignById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      // Reset campaign status to draft
      await storage.updateNewsletterCampaign(req.params.id, {
        status: "draft",
        sentAt: null as any
      });
      
      // Reset all recipients to pending
      const recipients = await storage.getNewsletterRecipientsByCampaign(req.params.id);
      let resetCount = 0;
      for (const recipient of recipients) {
        await storage.updateNewsletterRecipient(recipient.id, {
          status: "pending",
          sentAt: null as any,
          errorMessage: null as any
        });
        resetCount++;
      }
      
      res.json({ success: true, resetCount });
    } catch (error: any) {
      console.error("Reset campaign error:", error);
      res.status(500).json({ message: "Error resetting campaign" });
    }
  });

  // Send test email to a single address
  app.post("/api/admin/newsletter/campaigns/:id/test", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { testEmail } = req.body;
      if (!testEmail) {
        return res.status(400).json({ message: "Test email address required" });
      }
      
      const campaign = await storage.getNewsletterCampaignById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      if (!(await isConnectorEnabled("resend"))) {
        return res.status(503).json({ message: "Email sending is currently disabled. Enable Resend in Connected Tools." });
      }
      const { getUncachableResendClient } = await import("./resend-client");
      const { client: resend, fromEmail } = await getUncachableResendClient();
      
      const senderEmail = fromEmail || "hello@greenelephant.org";
      const formattedFrom = `Esteve from GreenElephant <${senderEmail}>`;
      
      console.log(`📧 Sending TEST email to ${testEmail} from: ${formattedFrom}`);
      
      const testHtml = `<div style="background: #fef3c7; padding: 10px; margin-bottom: 20px; border-radius: 4px;"><strong>⚠️ TEST EMAIL</strong> - This is a test of campaign "${campaign.name}"</div>` + campaign.htmlContent;
      
      await resend.emails.send({
        from: formattedFrom,
        to: testEmail,
        subject: `[TEST] ${campaign.subject}`,
        html: testHtml,
      });
      
      console.log(`✅ Test email sent successfully to ${testEmail}`);
      res.json({ success: true, sentTo: testEmail });
    } catch (error: any) {
      console.error("Test email error:", error);
      res.status(500).json({ message: error.message || "Error sending test email" });
    }
  });

  // Open tracking endpoint (returns 1x1 transparent GIF)
  app.get("/api/newsletter/track/:campaignId/:contactId/open.gif", async (req, res) => {
    try {
      const { campaignId, contactId } = req.params;
      
      // Record the open
      await storage.recordNewsletterOpen(campaignId, contactId);
      
      // Trigger Notion sync for this recipient
      syncNewsletterToNotion(campaignId, contactId).catch(err => 
        console.error("Failed to sync open to Notion:", err)
      );
      
      // Return 1x1 transparent GIF
      const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
      res.setHeader('Content-Type', 'image/gif');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.send(gif);
    } catch (error: any) {
      console.error("Track open error:", error);
      // Still return the gif even on error
      const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
      res.setHeader('Content-Type', 'image/gif');
      res.send(gif);
    }
  });

  // Test endpoint for Satellite Scan purchase email (admin only)
  app.post("/api/admin/test/satellitescan-email", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { customerEmail, customerName } = req.body;
      if (!customerEmail) {
        return res.status(400).json({ message: "Customer email required" });
      }
      
      const { sendSatellitescanPurchaseEmail } = await import("./email-notifications");
      
      const testData = {
        customerEmail,
        customerName: customerName || "Test User",
        amount: "99.95",
        paymentIntentId: `test_pi_${Date.now()}`,
        purchaseId: `test_purchase_${Date.now()}`
      };
      
      console.log(`🧪 TEST: Sending Satellitescan purchase email to ${customerEmail}`);
      const result = await sendSatellitescanPurchaseEmail(testData);
      
      if (result) {
        res.json({ success: true, message: `Test emails sent to ${customerEmail} and admin` });
      } else {
        res.status(500).json({ success: false, message: "Email send returned false" });
      }
    } catch (error: any) {
      console.error("Test email error:", error);
      res.status(500).json({ message: error.message || "Error sending test email" });
    }
  });

  // Test endpoint for onboarding sequence emails (admin only)
  app.post("/api/admin/test/onboarding-email", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { customerEmail, sequenceNumber } = req.body;
      if (!customerEmail || !sequenceNumber) {
        return res.status(400).json({ message: "Customer email and sequence number required" });
      }
      
      const { triggerOnboardingEmail } = await import("./onboarding-scheduler");
      
      console.log(`🧪 TEST: Sending onboarding email #${sequenceNumber} to ${customerEmail}`);
      const result = await triggerOnboardingEmail(customerEmail, String(sequenceNumber));
      
      if (result.success) {
        res.json({ success: true, message: result.message });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    } catch (error: any) {
      console.error("Test onboarding email error:", error);
      res.status(500).json({ message: error.message || "Error sending test email" });
    }
  });

  // Webinar settings - public read (no auth needed for the webinar page)
  app.get("/api/webinar-settings", async (_req, res) => {
    try {
      const settings = await storage.getWebinarSettings();
      if (!settings) {
        return res.json({
          countdownDeadline: new Date("2026-02-28T23:59:59+02:00").toISOString(),
          hostNames: "Anu Timmerbacka",
          bonusDescription: "a free 1-on-1 session with a GreenElephant coach",
          sessionTitle: "Communication Clarity for EA's & VA's",
          sessionSubtitle: "Lead with calm influence and conscious impact",
          sessionDuration: "75 minutes",
          ctaButtonText: null,
          ctaButtonTextExpired: null,
        });
      }
      res.json(settings);
    } catch (error: any) {
      console.error("Error fetching webinar settings:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Webinar settings - admin write
  app.put("/api/admin/webinar-settings", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const result = await storage.upsertWebinarSettings(req.body);
      res.json(result);
    } catch (error: any) {
      console.error("Error updating webinar settings:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Webinar settings - admin read (same as public but behind auth)
  app.get("/api/admin/webinar-settings", requireAdminAuth, async (_req, res) => {
    try {
      const settings = await storage.getWebinarSettings();
      res.json(settings || null);
    } catch (error: any) {
      console.error("Error fetching webinar settings:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Calendar events - public read
  app.get("/api/calendar-events", async (_req, res) => {
    try {
      const events = await storage.getAllCalendarEvents();
      res.json(events);
    } catch (error: any) {
      console.error("Error fetching calendar events:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Calendar events - admin CRUD
  app.get("/api/admin/calendar-events", requireAdminAuth, async (_req, res) => {
    try {
      res.json(await storage.getAllCalendarEvents());
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/calendar-events", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { insertCalendarEventSchema } = await import("@shared/schema");
      const parsed = insertCalendarEventSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
      const event = await storage.createCalendarEvent(parsed.data);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/calendar-events/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const event = await storage.updateCalendarEvent(req.params.id, req.body);
      if (!event) return res.status(404).json({ message: "Event not found" });
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/admin/calendar-events/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const deleted = await storage.deleteCalendarEvent(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Event not found" });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Webinar sessions - public read
  app.get("/api/webinar-sessions", async (_req, res) => {
    try {
      const sessions = await storage.getAllWebinarSessions();
      res.json(sessions);
    } catch (error: any) {
      console.error("Error fetching webinar sessions:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Webinar sessions - admin CRUD
  app.get("/api/admin/webinar-sessions", requireAdminAuth, async (_req, res) => {
    try {
      const sessions = await storage.getAllWebinarSessions();
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/webinar-sessions", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { insertWebinarSessionSchema } = await import("@shared/schema");
      const parsed = insertWebinarSessionSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
      const session = await storage.createWebinarSession(parsed.data);
      res.status(201).json(session);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/webinar-sessions/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.updateWebinarSession(id, req.body);
      if (!session) return res.status(404).json({ message: "Session not found" });
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/admin/webinar-sessions/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteWebinarSession(id);
      if (!deleted) return res.status(404).json({ message: "Session not found" });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Manual trigger for daily pulse email (admin only)
  app.post("/api/admin/trigger-pulse", requireAdminAuth, requireWriteAccess, async (_req, res) => {
    try {
      const { runDailyPulse } = await import('./daily-pulse');
      const success = await runDailyPulse();
      if (success) {
        res.json({ success: true, message: 'Daily pulse email sent to esteve@greenelephant.org' });
      } else {
        res.status(500).json({ success: false, message: 'Pulse ran but email failed — check server logs' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Test-send a journey's first email to esteve@ (admin only)
  app.post("/api/admin/email-test", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { journeyId } = req.body as { journeyId: string };
      if (!journeyId) return res.status(400).json({ message: 'journeyId is required' });

      const { sendDailyPulseEmail } = await import('./email-notifications');

      const journeyMap: Record<string, string> = {
        'satellite-scan': 'Satellite Scan Purchase',
        'newsletter': 'Newsletter Subscription',
        'flow-check': 'Check-my-FLOW',
        'signals-quiz': 'Signals Quiz',
        'webinar-waitlist': 'Webinar Waitlist',
        'contact-form': 'Contact Form',
      };

      const journeyName = journeyMap[journeyId];
      if (!journeyName) return res.status(400).json({ message: `Unknown journeyId: ${journeyId}` });

      // Send a pulse-style test email describing the journey
      await sendDailyPulseEmail({
        date: `TEST — ${journeyName} journey`,
        scanPurchases: 0,
        revenue: 0,
        newsletterSubs: 0,
        webinarSignups: 0,
        flowChecks: 0,
        flowZones: {},
        quizCompletions: 0,
        contactMessages: 0,
      });

      res.json({ success: true, message: `Test email for "${journeyName}" sent to esteve@greenelephant.org` });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/connectors", requireAdminAuth, async (_req, res) => {
    try {
      const states = await storage.getAllConnectorStates();
      res.json(states);
    } catch (error: any) {
      console.error("Get connector states error:", error);
      res.status(500).json({ message: "Error fetching connector states" });
    }
  });

  app.get("/api/admin/connectors/log", requireAdminAuth, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const logs = await storage.getConnectorToggleLogs(limit);
      res.json(logs);
    } catch (error: any) {
      console.error("Get connector logs error:", error);
      res.status(500).json({ message: "Error fetching connector logs" });
    }
  });

  app.get("/api/admin/connectors/logs", requireAdminAuth, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const logs = await storage.getConnectorToggleLogs(limit);
      res.json(logs);
    } catch (error: any) {
      console.error("Get connector logs error:", error);
      res.status(500).json({ message: "Error fetching connector logs" });
    }
  });

  app.get("/api/admin/connectors/status", requireAdminAuth, async (_req, res) => {
    try {
      const connectorNames = [
        "stripe", "resend", "notion", "google-sheets", "google-analytics",
        "thesys", "typeform", "youtube", "calendly", "github", "linkedin", "gmail"
      ];
      const statuses: Record<string, { enabled: boolean; hasEnvKey: boolean }> = {};
      const envKeyMap: Record<string, string> = {
        stripe: "STRIPE_SECRET_KEY",
        resend: "RESEND_API_KEY",
        notion: "NOTION_API_KEY",
        "google-sheets": "GOOGLE_SHEETS_API_KEY",
        "google-analytics": "GA4_PROPERTY_ID",
        thesys: "THESYS_API_KEY",
        typeform: "TYPEFORM_WEBHOOK_SECRET",
        youtube: "YOUTUBE_API_KEY",
        calendly: "CALENDLY_URL",
        github: "GITHUB_TOKEN",
        linkedin: "LINKEDIN_CLIENT_ID",
        gmail: "GMAIL_OAUTH_TOKEN",
      };
      for (const name of connectorNames) {
        const enabled = await storage.isConnectorEnabled(name);
        const envKey = envKeyMap[name];
        const hasEnvKey = envKey ? !!process.env[envKey] : false;
        statuses[name] = { enabled, hasEnvKey };
      }
      res.json(statuses);
    } catch (error: any) {
      console.error("Get connector status error:", error);
      res.status(500).json({ message: "Error fetching connector status" });
    }
  });

  const VALID_CONNECTOR_NAMES = [
    "stripe", "resend", "notion", "google-sheets", "google-analytics",
    "thesys", "typeform", "youtube", "calendly", "github", "linkedin", "gmail"
  ];

  app.put("/api/admin/connectors/:name", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { name } = req.params;
      if (!VALID_CONNECTOR_NAMES.includes(name)) {
        return res.status(400).json({ message: `Unknown connector: ${name}` });
      }
      const { enabled } = req.body;
      if (typeof enabled !== "string" || !["true", "false"].includes(enabled)) {
        return res.status(400).json({ message: "enabled must be 'true' or 'false'" });
      }
      const previous = await storage.isConnectorEnabled(name);
      const state = await storage.upsertConnectorState(name, enabled);
      const action = enabled === "true" ? "enabled" : "disabled";
      await storage.createConnectorToggleLog({
        connectorName: name,
        action,
        previousEnabled: previous ? "true" : "false",
        newEnabled: enabled,
        triggeredBy: "individual",
        performedBy: "admin",
      });
      res.json(state);
    } catch (error: any) {
      console.error("Update connector state error:", error);
      res.status(500).json({ message: "Error updating connector state" });
    }
  });

  app.post("/api/admin/connectors/kill-switch", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { enabled } = req.body;
      if (typeof enabled !== "string" || !["true", "false"].includes(enabled)) {
        return res.status(400).json({ message: "enabled must be 'true' or 'false'" });
      }
      const action = enabled === "true" ? "enabled" : "disabled";
      const results: Record<string, any> = {};
      for (const name of VALID_CONNECTOR_NAMES) {
        const previous = await storage.isConnectorEnabled(name);
        const state = await storage.upsertConnectorState(name, enabled);
        await storage.createConnectorToggleLog({
          connectorName: name,
          action,
          previousEnabled: previous ? "true" : "false",
          newEnabled: enabled,
          triggeredBy: "kill-switch",
          performedBy: "admin",
        });
        results[name] = state;
      }
      res.json({ message: `All connectors ${action}`, results });
    } catch (error: any) {
      console.error("Kill switch error:", error);
      res.status(500).json({ message: "Error executing kill switch" });
    }
  });

  app.post("/api/admin/connectors/seed", requireAdminAuth, requireWriteAccess, async (_req, res) => {
    try {
      for (const name of VALID_CONNECTOR_NAMES) {
        const existing = await storage.getConnectorState(name);
        if (!existing) {
          await storage.upsertConnectorState(name, "true");
        }
      }
      res.json({ message: "Default connector states seeded" });
    } catch (error: any) {
      console.error("Seed connectors error:", error);
      res.status(500).json({ message: "Error seeding connectors" });
    }
  });

  (async () => {
    try {
      for (const name of VALID_CONNECTOR_NAMES) {
        const existing = await storage.getConnectorState(name);
        if (!existing) {
          await storage.upsertConnectorState(name, "true");
        }
      }
      console.log("✅ Connector states initialized");
    } catch (err) {
      console.error("⚠️ Failed to seed connector states:", err);
    }
  })();

  // ── Testimonials CRUD (admin) ──
  app.get("/api/admin/testimonials", requireAdminAuth, async (_req, res) => {
    try {
      const all = await storage.getAllTestimonials();
      res.json(all);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/admin/testimonials", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const parsed = insertTestimonialSchema.parse(req.body);
      const record = await storage.createTestimonial(parsed);
      res.json(record);
    } catch (err: any) {
      if (err?.issues) return res.status(400).json({ error: "Validation failed", details: err.issues });
      res.status(500).json({ error: "Failed to create testimonial" });
    }
  });

  app.patch("/api/admin/testimonials/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const parsed = insertTestimonialSchema.partial().parse(req.body);
      const record = await storage.updateTestimonial(req.params.id, parsed);
      if (!record) return res.status(404).json({ error: "Not found" });
      res.json(record);
    } catch (err: any) {
      if (err?.issues) return res.status(400).json({ error: "Validation failed", details: err.issues });
      res.status(500).json({ error: "Failed to update testimonial" });
    }
  });

  app.delete("/api/admin/testimonials/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const ok = await storage.deleteTestimonial(req.params.id);
      if (!ok) return res.status(404).json({ error: "Not found" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete testimonial" });
    }
  });

  // Public endpoint for visible testimonials
  app.get("/api/testimonials", async (_req, res) => {
    try {
      const visible = await storage.getVisibleTestimonials();
      res.json(visible);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/admin/coaching/send-raw-data-email", requireAdminAuth, async (req, res) => {
    try {
      const { coacheeEmail, coacheeName, rawData } = req.body;
      if (!coacheeEmail || !rawData || typeof rawData !== 'object') {
        return res.status(400).json({ error: "coacheeEmail and rawData are required" });
      }
      const sent = await sendCoachingRawDataEmail({ coacheeEmail, coacheeName: coacheeName || null, rawData });
      if (sent) {
        res.json({ success: true, message: `Raw data email sent to ${coacheeEmail}` });
      } else {
        res.status(500).json({ error: "Failed to send raw data email" });
      }
    } catch (err: any) {
      console.error("Error sending coaching raw data email:", err);
      res.status(500).json({ error: err.message || "Failed to send email" });
    }
  });

  app.post("/api/admin/coaching/send-doc-link-email", requireAdminAuth, async (req, res) => {
    try {
      const { coacheeEmail, coacheeName, docUrl, reportText } = req.body;
      if (!coacheeEmail || !docUrl) {
        return res.status(400).json({ error: "coacheeEmail and docUrl are required" });
      }
      const sent = await sendCoachingDocLinkEmail({ coacheeEmail, coacheeName: coacheeName || null, docUrl, reportText: reportText || '' });
      if (sent) {
        res.json({ success: true, message: `Doc link email sent to ${coacheeEmail}` });
      } else {
        res.status(500).json({ error: "Failed to send doc link email" });
      }
    } catch (err: any) {
      console.error("Error sending coaching doc link email:", err);
      res.status(500).json({ error: err.message || "Failed to send email" });
    }
  });

  app.post("/api/admin/coaching/send-coach-only-email", requireAdminAuth, async (req, res) => {
    try {
      const { coacheeName, rawData, notes } = req.body;
      if (!rawData || typeof rawData !== 'object') {
        return res.status(400).json({ error: "rawData is required" });
      }
      const sent = await sendCoachOnlyEmail({ coacheeName: coacheeName || null, rawData, notes });
      if (sent) {
        res.json({ success: true, message: "Coach-only email sent" });
      } else {
        res.status(500).json({ error: "Failed to send coach-only email" });
      }
    } catch (err: any) {
      console.error("Error sending coach-only email:", err);
      res.status(500).json({ error: err.message || "Failed to send email" });
    }
  });

  app.post("/api/admin/research/pmf-assumptions", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { targetingCategories, customContext } = req.body;
      if (!targetingCategories || typeof targetingCategories !== 'object') {
        return res.status(400).json({ message: "targetingCategories object is required" });
      }
      const { generatePMFAssumptions } = await import("./lib/thesysApi");
      const result = await generatePMFAssumptions(targetingCategories, customContext || '');
      res.json(result);
    } catch (error: any) {
      console.error("PMF assumptions generation error:", error);
      res.status(500).json({ message: "Error generating PMF assumptions", error: error.message });
    }
  });

  app.post("/api/admin/research/lead-list", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { calibration, filters } = req.body;
      if (!calibration || !calibration.why || !calibration.what) {
        return res.status(400).json({ message: "calibration (why, what, how) is required" });
      }
      const { generateLeadListSuggestions } = await import("./lib/thesysApi");
      const result = await generateLeadListSuggestions(calibration, filters || {});
      res.json(result);
    } catch (error: any) {
      console.error("Lead list generation error:", error);
      res.status(500).json({ message: "Error generating lead list", error: error.message });
    }
  });

  app.post("/api/admin/research/export-sheets", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { leads } = req.body;
      if (!Array.isArray(leads) || leads.length === 0) {
        return res.status(400).json({ message: "leads array is required" });
      }
      const { getUncachableGoogleSheetClient } = await import("./lib/googleSheets");
      const sheets = await getUncachableGoogleSheetClient();

      const spreadsheet = await sheets.spreadsheets.create({
        requestBody: {
          properties: { title: `GreenElephant Lead List — ${new Date().toISOString().split('T')[0]}` },
          sheets: [{ properties: { title: 'Leads' } }],
        },
      });

      const spreadsheetId = spreadsheet.data.spreadsheetId!;
      const headers = ['Name', 'Email', 'LinkedIn Profile', 'Company', 'Title', 'Source', 'Fit Score'];
      const rows = leads.map((l: any) => [l.name, l.email, l.linkedinProfile, l.company, l.title, l.source, l.fitScore]);

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Leads!A1',
        valueInputOption: 'RAW',
        requestBody: { values: [headers, ...rows] },
      });

      res.json({ message: `Lead list exported to Google Sheets`, spreadsheetId, url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}` });
    } catch (error: any) {
      console.error("Google Sheets export error:", error);
      res.status(500).json({ message: "Error exporting to Google Sheets", error: error.message });
    }
  });

  app.post("/api/admin/research/sync-notion", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { assumptions } = req.body;
      if (!Array.isArray(assumptions) || assumptions.length === 0) {
        return res.status(400).json({ message: "assumptions array is required" });
      }
      const { getNotionClient } = await import("./lib/notionClient");
      const notion = await getNotionClient();

      const searchRes = await notion.search({
        query: 'PMF Assumptions',
        filter: { property: 'object', value: 'database' },
      });

      if (searchRes.results.length === 0) {
        return res.status(400).json({
          message: "No 'PMF Assumptions' database found in Notion. Create a database named 'PMF Assumptions' with a 'Name' title property, then retry.",
        });
      }

      const dbId = searchRes.results[0].id;
      let syncCount = 0;

      for (const assumption of assumptions) {
        try {
          const filtersText = assumption.filters
            ? Object.entries(assumption.filters)
                .filter(([, v]) => v)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ')
            : 'None';

          await notion.pages.create({
            parent: { database_id: dbId },
            properties: {
              'Name': { title: [{ text: { content: `${assumption.id}: ${assumption.hypothesis}` } }] },
            },
            children: [
              {
                object: 'block' as const,
                type: 'heading_2' as const,
                heading_2: {
                  rich_text: [{ type: 'text' as const, text: { content: 'Assumption Details' } }],
                },
              },
              {
                object: 'block' as const,
                type: 'paragraph' as const,
                paragraph: {
                  rich_text: [{ type: 'text' as const, text: { content: `Confidence: ${assumption.confidence || 'N/A'}\nTest Method: ${assumption.testMethod || 'N/A'}\nTimestamp: ${assumption.timestamp || new Date().toISOString()}\nFilters: ${filtersText}` } }],
                },
              },
              {
                object: 'block' as const,
                type: 'heading_3' as const,
                heading_3: {
                  rich_text: [{ type: 'text' as const, text: { content: 'Hypothesis' } }],
                },
              },
              {
                object: 'block' as const,
                type: 'paragraph' as const,
                paragraph: {
                  rich_text: [{ type: 'text' as const, text: { content: assumption.hypothesis || '' } }],
                },
              },
            ],
          });
          syncCount++;
        } catch (e: any) {
          console.warn(`Notion sync for ${assumption.id} failed:`, e.message);
        }
      }

      res.json({ message: `${syncCount} assumptions synced to Notion`, synced: syncCount });
    } catch (error: any) {
      console.error("Notion sync error:", error);
      res.status(500).json({ message: "Error syncing to Notion", error: error.message });
    }
  });

  app.post("/api/admin/research/gmail-sync-notion", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { threads } = req.body;
      if (!Array.isArray(threads) || threads.length === 0) {
        return res.status(400).json({ message: "threads array is required" });
      }
      const { getNotionClient } = await import("./lib/notionClient");
      const notion = await getNotionClient();

      const searchRes = await notion.search({
        query: 'Email Chains',
        filter: { property: 'object', value: 'database' },
      });

      if (searchRes.results.length === 0) {
        return res.status(400).json({
          message: "No 'Email Chains' database found in Notion. Create a database named 'Email Chains' with a 'Name' title property, then retry.",
        });
      }

      const dbId = searchRes.results[0].id;
      let syncCount = 0;

      for (const thread of threads) {
        try {
          const participants = new Set<string>();
          if (thread.from) participants.add(thread.from);
          if (thread.to) participants.add(thread.to);
          (thread.messages || []).forEach((m: any) => {
            if (m.from) participants.add(m.from);
            if (m.to) participants.add(m.to);
          });

          const threadBody = (thread.messages || [])
            .map((m: any) => `[${m.date}] ${m.from} → ${m.to}\n${m.body || m.snippet || ''}`)
            .join('\n---\n');

          const contentBlocks = [
            {
              object: 'block' as const,
              type: 'heading_2' as const,
              heading_2: {
                rich_text: [{ type: 'text' as const, text: { content: 'Thread Details' } }],
              },
            },
            {
              object: 'block' as const,
              type: 'paragraph' as const,
              paragraph: {
                rich_text: [{ type: 'text' as const, text: { content: `From: ${thread.from || 'Unknown'}\nTo: ${thread.to || 'Unknown'}\nDate: ${thread.date || 'Unknown'}\nMessages: ${(thread.messages || []).length}\nParticipants: ${Array.from(participants).join(', ')}` } }],
              },
            },
            {
              object: 'block' as const,
              type: 'heading_3' as const,
              heading_3: {
                rich_text: [{ type: 'text' as const, text: { content: 'Email Chain' } }],
              },
            },
            {
              object: 'block' as const,
              type: 'paragraph' as const,
              paragraph: {
                rich_text: [{ type: 'text' as const, text: { content: threadBody.slice(0, 1900) } }],
              },
            },
          ];

          await notion.pages.create({
            parent: { database_id: dbId },
            properties: {
              'Name': { title: [{ text: { content: thread.subject || '(No subject)' } }] },
            },
            children: contentBlocks,
          });
          syncCount++;
        } catch (e: any) {
          console.warn(`Notion sync for thread ${thread.threadId} failed:`, e.message);
        }
      }

      res.json({ message: `${syncCount} email threads synced to Notion`, synced: syncCount });
    } catch (error: any) {
      console.error("Gmail Notion sync error:", error);
      res.status(500).json({ message: "Error syncing email threads to Notion", error: error.message });
    }
  });

  app.post("/api/admin/research/gmail-harvest", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { query, maxResults } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "query string is required" });
      }
      const { harvestEmailChains } = await import("./lib/gmailClient");
      const threads = await harvestEmailChains(query, maxResults || 15);
      res.json({ threads });
    } catch (error: any) {
      console.error("Gmail harvest error:", error);
      res.status(500).json({ message: "Error harvesting Gmail", error: error.message });
    }
  });

  app.post("/api/portal/timeline", async (req, res) => {
    if (!req.session || !req.session.clientUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const { z } = await import("zod");
      const schema = z.object({
        type: z.string().min(1).max(50),
        title: z.string().min(1).max(200),
        description: z.string().max(1000).optional(),
        details: z.string().max(5000).optional(),
        lens: z.string().max(50).optional(),
        toolId: z.string().max(50).optional(),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request", errors: parsed.error.flatten().fieldErrors });
      }
      const event = await storage.createPortalTimelineEvent({
        ...parsed.data,
        userId: req.session.clientUserId as string,
        date: new Date(),
      });
      res.json(event);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Timeline save error:", errMsg);
      res.status(500).json({ message: "Failed to save timeline event" });
    }
  });

  app.get("/api/portal/timeline", async (req, res) => {
    if (!req.session || !req.session.clientUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const events = await storage.getPortalTimelineEvents(req.session.clientUserId as string);
      res.json(events);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Timeline fetch error:", errMsg);
      res.status(500).json({ message: "Failed to fetch timeline events" });
    }
  });

  app.delete("/api/portal/timeline/:id", async (req, res) => {
    if (!req.session || !req.session.clientUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const deleted = await storage.deletePortalTimelineEvent(req.params.id, req.session.clientUserId as string);
      if (!deleted) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json({ success: true });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Timeline delete error:", errMsg);
      res.status(500).json({ message: "Failed to delete timeline event" });
    }
  });

  app.delete("/api/portal/timeline", async (req, res) => {
    if (!req.session || !req.session.clientUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const userId = req.session.clientUserId as string;
      const [timelineCount, contextCount] = await Promise.all([
        storage.deleteAllPortalTimelineEvents(userId),
        storage.deleteAllPortalUserContext(userId),
      ]);
      res.json({ success: true, deleted: timelineCount, contextDeleted: contextCount });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Data delete-all error:", errMsg);
      res.status(500).json({ message: "Failed to delete data" });
    }
  });

  app.get("/api/portal/data-export", async (req, res) => {
    if (!req.session || !req.session.clientUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const userId = req.session.clientUserId as string;
      const [timeline, context] = await Promise.all([
        storage.getPortalTimelineEvents(userId),
        storage.getPortalUserContext(userId),
      ]);
      const contextMap: Record<string, string> = {};
      context.forEach((c) => { contextMap[c.key] = c.value; });
      res.json({
        exportDate: new Date().toISOString(),
        userId,
        timeline,
        context: contextMap,
      });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Data export error:", errMsg);
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  app.post("/api/portal/data-export/email", async (req, res) => {
    if (!req.session || !req.session.clientUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const userId = req.session.clientUserId as string;
      const user = await storage.getClientUser(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const [timeline, context] = await Promise.all([
        storage.getPortalTimelineEvents(userId),
        storage.getPortalUserContext(userId),
      ]);
      const contextMap: Record<string, string> = {};
      context.forEach((c) => { contextMap[c.key] = c.value; });

      const sent = await sendPortalDataExportEmail(user.email, user.name, { timeline, context: contextMap });
      if (sent) {
        res.json({ message: "Export email sent" });
      } else {
        res.status(500).json({ message: "Failed to send export email. Email service may not be configured." });
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Email export error:", errMsg);
      res.status(500).json({ message: "Failed to send export email" });
    }
  });

  app.get("/api/portal/context", async (req, res) => {
    if (!req.session || !req.session.clientUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const ctx = await storage.getPortalUserContext(req.session.clientUserId as string);
      const result: Record<string, string> = {};
      ctx.forEach((c) => { result[c.key] = c.value; });
      res.json(result);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Portal context fetch error:", errMsg);
      res.status(500).json({ message: "Failed to fetch context" });
    }
  });

  app.post("/api/portal/context", async (req, res) => {
    if (!req.session || !req.session.clientUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const { z } = await import("zod");
      const schema = z.object({
        key: z.string().min(1).max(100),
        value: z.string().max(5000),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request" });
      }
      const result = await storage.setPortalUserContext(
        req.session.clientUserId as string,
        parsed.data.key,
        parsed.data.value
      );
      res.json(result);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Portal context save error:", errMsg);
      res.status(500).json({ message: "Failed to save context" });
    }
  });

  app.post("/api/portal/ai", async (req, res) => {
    if (!req.session || !req.session.clientUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const { z } = await import("zod");
      const schema = z.object({
        tool: z.enum(["debrief", "reflection", "microhabits", "prepare", "flowcheck"]),
        userMessage: z.string().min(1).max(5000),
        context: z.string().max(2000).optional(),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request", errors: parsed.error.flatten().fieldErrors });
      }
      const { tool, userMessage, context } = parsed.data;

      const enabledCtx = await storage.getPortalUserContextByKey(req.session.clientUserId as string, "enabled_tools");
      if (enabledCtx) {
        if (enabledCtx.value === "") {
          return res.status(403).json({ message: `All tools are disabled. Enable tools in Settings > Data Privacy.` });
        }
        const enabled = enabledCtx.value.split(",");
        if (!enabled.includes(tool)) {
          return res.status(403).json({ message: `Tool "${tool}" is disabled. Enable it in Settings > Data Privacy.` });
        }
      }

      const aiModelSetting = await storage.getAdminSetting("ai_active_model");
      const activeModel = aiModelSetting || "thesys";

      let aiChatFn: (systemPrompt: string, userMsg: string) => Promise<string>;

      if (activeModel === "thesys" || activeModel === "chatgpt" || activeModel === "gemini") {
        const { portalAiChat } = await import("./lib/thesysApi");
        aiChatFn = portalAiChat;
      } else {
        const { portalAiChat } = await import("./lib/thesysApi");
        aiChatFn = portalAiChat;
      }

      const userCtx = await storage.getPortalUserContext(req.session.clientUserId as string);
      const ctxMap: Record<string, string> = {};
      userCtx.forEach((c) => { ctxMap[c.key] = c.value; });

      const recentEvents = await storage.getPortalTimelineEvents(req.session.clientUserId as string);
      const timelineSummary = recentEvents.slice(0, 10).map((e) =>
        `[${new Date(e.date).toLocaleDateString("en-GB")}] ${e.title}${e.lens ? ` (${e.lens})` : ""}${e.description ? `: ${e.description}` : ""}`
      ).join("\n");

      const userContextBlock = Object.keys(ctxMap).length > 0
        ? `\n\nUser profile context:\n${Object.entries(ctxMap).map(([k, v]) => `- ${k}: ${v}`).join("\n")}`
        : "";

      const timelineBlock = timelineSummary
        ? `\n\nRecent timeline (most recent first):\n${timelineSummary}`
        : "";

      const PORTAL_SYSTEM_PROMPTS: Record<string, string> = {
        debrief: `You are a conscious communication coach for GreenElephant.org. The user wants to debrief a recent conversation or interaction.

Analyse their description through the GBR framework:
- GREEN = Other-focused (empathy, naming feelings/needs, trust-building)
- BLUE = Self-focused (informing, sharing knowledge/opinions/ideas)
- RED = Shared-focused (influencing, uniting, proposing agreements)

Also consider which of the 8 lenses are most relevant:
1. Influence 2. Attitude 3. Chaordic 4. Flow 5. Alignment 6. Needs 7. Ego 8. Dynamics

Respond with:
1. A brief summary of what happened (2-3 sentences)
2. GBR Breakdown: Which color dominated? What was missing?
3. Key Pattern: What communication pattern do you notice?
4. One Micro-Shift: A small, practical change they could try next time
5. Relevant Lens: Which lens(es) this touches and why

Keep your tone warm, grounded, and non-judgmental. Be specific, not generic.${userContextBlock}${timelineBlock}`,

        reflection: `You are a conscious communication coach for GreenElephant.org. The user wants a deeper reflection on their communication patterns through a specific lens.

The 8 lenses of the Periodic Table of Conscious Communication:
1. Influence (#cc3333) - How you exert influence with integrity
2. Attitude (#ff9933) - Your stance toward change and growth
3. Chaordic (#ffcc00) - Order in creative chaos
4. Flow (#cccc33) - Sensing flow in conversations
5. Alignment (#669966) - Building empathy and shared understanding
6. Needs (#009999) - Honoring your energy and core needs
7. Ego (#3399cc) - Recognizing and loosening ego patterns
8. Dynamics (#663399) - Understanding relationship dynamics

Provide a thoughtful reflection that includes:
1. What their description reveals about their patterns in this lens
2. A strength they're showing (be specific, not flattery)
3. A blind spot or growth edge worth exploring
4. 2-3 reflective questions they can sit with
5. A practical experiment to try this week

Be warm, specific, and grounded. Never preachy.${userContextBlock}${timelineBlock}`,

        microhabits: `You are a conscious communication coach for GreenElephant.org. Generate a practical micro-habit based on the user's chosen lens.

The 8 lenses: Influence, Attitude, Chaordic, Flow, Alignment, Needs, Ego, Dynamics.

Create ONE specific micro-habit that:
1. Takes 2-5 minutes per day
2. Can be done in any conversation
3. Is concrete and observable (not vague like "be more mindful")
4. Connects to the chosen lens
5. Has a clear trigger (when to do it) and action (what to do)
6. If the user shared a core value, connect the habit to that value

Format your response as:
HABIT: [Name of the habit - 3-5 words]
LENS: [Which lens]
VALUE: [Core value this serves, if provided]
TRIGGER: [When to do it - be specific]
ACTION: [What to do - step by step]
WHY IT WORKS: [1-2 sentences connecting it to the lens and value]
DURATION: [How long to practice - suggest 7 or 14 days]
TRACKING: [How to know if they did it - simple yes/no check]${userContextBlock}${timelineBlock}`,

        prepare: `You are a conscious communication coach for GreenElephant.org. The user wants to prepare for an upcoming conversation, meeting, or event.

Analyse their situation through all 8 lenses and the GBR framework:
- GREEN = Other-focused (empathy, naming feelings/needs, trust-building)
- BLUE = Self-focused (informing, sharing knowledge/opinions/ideas)  
- RED = Shared-focused (influencing, uniting, proposing agreements)

Provide preparation notes that include:
1. SITUATION READ: What dynamics are likely at play? (2-3 sentences)
2. YOUR COMMUNICATION GOAL: What would "success" look like communicatively?
3. GBR STRATEGY: Which color should lead? When to shift?
4. KEY PHRASES: 3-4 specific sentences/phrases they could use
5. WATCH OUT FOR: Ego triggers or patterns to be aware of
6. OPENING LINE: A strong, conscious way to begin the conversation
7. IF IT GOES SIDEWAYS: A recovery phrase or technique

Be practical, specific, and actionable. No generic advice.${userContextBlock}${timelineBlock}`,

        flowcheck: `You are a conscious communication coach for GreenElephant.org. The user completed a Flow Check with three slider scores (Motivation, Challenge, Competence each on a 1-10 scale) and landed in a specific zone.

Analyse their scores and provide:
1. ZONE INSIGHT: What this combination tells you about their current state (2-3 sentences)
2. PATTERN: If their recent timeline shows repeated checks, note any trends
3. RECOMMENDATION: One specific, actionable step to improve their flow state
4. LENS CONNECTION: Which of the 8 lenses is most relevant right now and why
5. QUESTION: One reflective question to sit with

Be warm, practical, and specific.${userContextBlock}${timelineBlock}`,
      };

      const systemPrompt = PORTAL_SYSTEM_PROMPTS[tool] || PORTAL_SYSTEM_PROMPTS.debrief;
      const fullMessage = context ? `${userMessage}\n\nAdditional context: ${context}` : userMessage;

      const result = await aiChatFn(systemPrompt, fullMessage);
      res.json({ result, model: activeModel });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Portal AI error:", errMsg);
      if (errMsg.includes('unavailable') || errMsg.includes('disabled')) {
        return res.status(503).json({ message: errMsg });
      }
      res.status(500).json({ message: "AI processing failed. Please try again." });
    }
  });

  app.post("/api/admin/journey-ai", requireAdminAuth, async (req, res) => {
    try {
      const { stage, question } = req.body;
      if (!stage || typeof stage !== "string" || !question || typeof question !== "string") {
        return res.status(400).json({ message: "Missing or invalid stage/question" });
      }
      if (question.length > 1000) {
        return res.status(400).json({ message: "Question too long (max 1000 characters)" });
      }

      const [
        contacts,
        scanPurchases,
        purchases,
        newsletterSubs,
        webinarSignups,
        flowChecks,
        quizResults,
        contactMessages,
        waitlist,
        emailLogs,
      ] = await Promise.all([
        storage.getAllContacts(),
        storage.getAllSatellitescanPurchases(),
        storage.getAllPurchases(),
        storage.getAllNewsletterSubscriptions(),
        storage.getAllWebinarWaitlistEntries(),
        storage.getAllFlowCheckResults(),
        storage.getAllSignalsQuizResults(),
        storage.getAllContactMessages(),
        storage.getAllWaitlistEntries(),
        storage.getAllOnboardingEmailLogs(),
      ]);

      const connectorStatus: Record<string, boolean> = {};
      for (const name of ["notion", "google-sheets", "stripe", "typeform"]) {
        connectorStatus[name] = await isConnectorEnabled(name);
      }

      let notionContactCount: number | null = null;
      let notionPipelineData: string | null = null;
      if (connectorStatus["notion"]) {
        const notionSyncedContacts = contacts.filter(c => c.notionSyncedAt);
        notionContactCount = notionSyncedContacts.length;
        try {
          const { getPipelineOSTasks } = await import("./lib/notionSync");
          notionPipelineData = await getPipelineOSTasks();
        } catch (err: any) {
          console.warn("Notion Pipeline OS fetch for AI context failed:", err.message);
        }
      }

      let googleSheetsData: string | null = null;
      if (connectorStatus["google-sheets"]) {
        try {
          const { getSheetData } = await import("./lib/googleSheets");
          const sheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
          if (sheetId) {
            const rows = await getSheetData(sheetId, "Sheet1!A1:Z10");
            googleSheetsData = `Google Sheets rows (first 10): ${JSON.stringify(rows).slice(0, 1000)}`;
          }
        } catch (err: any) {
          console.warn("Google Sheets fetch for AI context failed:", err.message);
        }
      }

      const totalStripeRevenue = scanPurchases.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0)
        + purchases.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
      let stripeRevenueNote: string | null = null;
      if (connectorStatus["stripe"] && stripe) {
        stripeRevenueNote = `Total recorded Stripe revenue: €${totalStripeRevenue.toFixed(2)} from ${scanPurchases.length + purchases.length} transactions`;
      }

      let typeformNote: string | null = null;
      if (connectorStatus["typeform"]) {
        const completed = scanPurchases.filter(p => p.typeformCompleted === "true").length;
        const rate = scanPurchases.length > 0 ? Math.round((completed / scanPurchases.length) * 100) : 0;
        typeformNote = `Typeform completion: ${completed}/${scanPurchases.length} (${rate}%).`;
        if (process.env.TYPEFORM_PERSONAL_ACCESS_TOKEN && process.env.TYPEFORM_FORM_ID) {
          try {
            const { getTypeformFormStats } = await import("./lib/typeformClient");
            const stats = await getTypeformFormStats(process.env.TYPEFORM_FORM_ID);
            typeformNote += ` API: ${stats.totalResponses} total responses, completion rate: ${stats.completionRate ?? "unknown"}%.`;
          } catch (err: any) {
            console.warn("Typeform API enrichment for AI context failed:", err.message);
          }
        } else {
          typeformNote += " Set TYPEFORM_PERSONAL_ACCESS_TOKEN and TYPEFORM_FORM_ID in Secrets to enable API-sourced analytics.";
        }
      }

      const stageContextMap: Record<string, object> = {
        AWARENESS: {
          totalContacts: contacts.length,
          recentContacts: contacts.filter(c => {
            const d = new Date(c.createdAt);
            return d >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          }).length,
          sources: contacts.reduce((acc: Record<string, number>, c) => {
            acc[c.source || "unknown"] = (acc[c.source || "unknown"] || 0) + 1;
            return acc;
          }, {}),
          notionSyncedContacts: notionContactCount,
        },
        INTEREST: {
          quizCompletions: quizResults.length,
          flowChecks: flowChecks.length,
          recentQuiz30d: quizResults.filter(q => new Date(q.createdAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
        },
        ENGAGEMENT: {
          newsletterSignups: newsletterSubs.length,
          webinarSignups: webinarSignups.length,
          contactMessages: contactMessages.length,
          waitlistEntries: waitlist.length,
        },
        PURCHASE: {
          scanPurchases: scanPurchases.length,
          otherPurchases: purchases.length,
          totalRevenue: scanPurchases.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0) + purchases.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0),
          recentPurchases30d: [...scanPurchases, ...purchases].filter(p => new Date(p.createdAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
          stripeNote: stripeRevenueNote,
        },
        ONBOARDING: {
          totalScanPurchases: scanPurchases.length,
          typeformCompleted: scanPurchases.filter(p => p.typeformCompleted === "true").length,
          typeformRate: scanPurchases.length > 0 ? Math.round((scanPurchases.filter(p => p.typeformCompleted === "true").length / scanPurchases.length) * 100) : 0,
          onboardingEmailsSent: emailLogs.filter(l => l.status === "sent").length,
          remindersTriggered: scanPurchases.filter(p => parseInt(p.remindersCount || "0") > 0).length,
          notionSynced: contacts.filter(c => c.notionSyncedAt).length,
          typeformNote,
        },
        USE: {
          flowChecks: flowChecks.length,
          uniqueFlowUsers: new Set(flowChecks.map(fc => fc.contactId || fc.id)).size,
          repeatFlowUsers: (() => {
            const map = new Map<string, number>();
            flowChecks.forEach(fc => { const k = fc.contactId || fc.id; if (k) map.set(k, (map.get(k) || 0) + 1); });
            return Array.from(map.values()).filter(c => c > 1).length;
          })(),
        },
        "USE MORE": {
          contactsWith3PlusChannels: contacts.filter(c => (c.channelsReached || []).length >= 3).length,
          totalContacts: contacts.length,
        },
        ADVOCACY: {
          referralMentions: contactMessages.filter(m => {
            const t = (m.message || "").toLowerCase();
            return t.includes("recommend") || t.includes("referred") || t.includes("colleague");
          }).length,
          referralWaitlist: waitlist.filter(w => {
            const t = (w.motivation || "").toLowerCase();
            return t.includes("referral") || t.includes("recommend") || t.includes("colleague");
          }).length,
        },
      };

      const stageData = stageContextMap[stage.toUpperCase()] || stageContextMap[stage] || {};

      const connectedSystems = Object.entries(connectorStatus)
        .filter(([, enabled]) => enabled)
        .map(([name]) => name);

      const enrichedStageData = {
        ...stageData,
        connectedSystems,
        dataSourceInfo: `Data aggregated from: internal database${connectedSystems.length > 0 ? `, ${connectedSystems.join(", ")}` : ""}`,
        ...(notionPipelineData && { notionPipelineContext: notionPipelineData }),
        ...(googleSheetsData && { googleSheetsContext: googleSheetsData }),
        ...(stripeRevenueNote && { stripeContext: stripeRevenueNote }),
        ...(typeformNote && { typeformContext: typeformNote }),
      };

      const { generateJourneyAIResponse } = await import("./lib/thesysApi");
      const answer = await generateJourneyAIResponse(stage, enrichedStageData, question);
      res.json({ answer });
    } catch (error: any) {
      console.error("Journey AI error:", error);
      if (error.message?.includes("disabled")) {
        return res.status(503).json({ message: "Thesys AI connector is disabled. Enable it in Admin > Connected Tools." });
      }
      res.status(500).json({ message: error.message || "AI query failed" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
