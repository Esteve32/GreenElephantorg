import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { requireAdminAuth, verifyAdminPassword } from "./auth";
import Stripe from "stripe";
import { COACHING_PACKAGES, type PackageId } from "@shared/packages";
import { 
  insertRecommendationSubmissionSchema, 
  insertContactSchema,
  insertWaitlistEntrySchema,
  insertNewsletterSubscriptionSchema,
  insertSignalsQuizResultSchema,
  insertPurchaseSchema,
  insertContactMessageSchema,
  insertSatellitescanPurchaseSchema
} from "@shared/schema";
import { fromError } from "zod-validation-error";
import { sendPurchaseNotification, sendSatellitescanPurchaseEmail, sendSatellitescanReminderEmail } from "./email-notifications";

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
  // Stripe payment route for coaching packages (one-time payments)
  // Server-side price validation to prevent client tampering
  app.post("/api/create-payment-intent", async (req, res) => {
    // Check if Stripe is configured
    if (!stripe) {
      return res.status(503).json({ 
        message: "Payment processing is currently unavailable. Please contact support." 
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
        
        // Extract metadata
        const { packageId, packageName, customerEmail, customerName } = paymentIntent.metadata;
        const amount = (paymentIntent.amount / 100).toString(); // Convert cents to EUR

        // Validate required metadata
        if (!customerEmail || !packageName) {
          console.error('❌ Missing required metadata in payment intent:', paymentIntent.id);
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
            amount,
            paymentIntentId: paymentIntent.id,
            purchaseId: purchase.id,
          });

          if (!emailSent) {
            console.log('⚠️ Email notification failed - manual follow-up required');
            console.log('👉 ACTION REQUIRED: Email customer at:', customerEmail);
            console.log('👉 Include Calendly link: https://calendly.com/greenelephant/satellite-scan-session');
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
      if (!contact) {
        contact = await storage.createContact(contactValidation.data);
      }

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
      if (!contact) {
        contact = await storage.createContact(contactValidation.data);
      }

      const subscription = await storage.createNewsletterSubscription({
        contactId: contact.id
      });

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
          if (!contact) {
            contact = await storage.createContact(contactValidation.data);
          }
          contactId = contact.id;
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

  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ message: "Password required" });
      }
      
      if (verifyAdminPassword(password)) {
        // Set admin session flag
        req.session.isAdmin = true;
        
        // Save session and respond
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return res.status(500).json({ message: "Login failed" });
          }
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

  // Admin logout endpoint
  app.post("/api/admin/logout", async (req, res) => {
    if (req.session) {
      req.session.isAdmin = false;
    }
    res.json({ message: "Logged out successfully" });
  });

  // Check admin authentication status
  app.get("/api/admin/check", async (req, res) => {
    const isAuthenticated = req.session && req.session.isAdmin === true;
    res.json({ isAuthenticated });
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

  app.get("/api/admin/contacts", requireAdminAuth, async (_req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error: any) {
      console.error("Admin contacts fetch error:", error);
      res.status(500).json({ message: "Could not fetch contacts" });
    }
  });

  // Satellitescan payment route (beta product €29.99)
  app.post("/api/satellitescan/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ 
        message: "Payment processing is currently unavailable. Please contact support." 
      });
    }

    try {
      const { customerEmail, customerName } = req.body;
      
      // Beta pricing: €29.99 (server-side validation)
      const BETA_PRICE = 29.99;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(BETA_PRICE * 100), // Convert to cents
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
        
        const { product, customerEmail, customerName } = paymentIntent.metadata;
        const amount = (paymentIntent.amount / 100).toString();

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
          } else {
            console.log('ℹ️ Duplicate webhook event received for satellitescan payment:', paymentIntent.id);
          }
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Satellitescan webhook error:", error);
      res.status(400).json({ message: error.message });
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

  // Admin endpoint to send reminder emails for overdue satellitescan completions
  // Should be triggered by external cron service (cron-job.org, GitHub Actions, etc.)
  // Example: Daily at 10:00 AM UTC
  // Idempotency: Only processes purchases with remindersCount=0, increment happens BEFORE send
  // Rate limiting: Recommend max 1 call per 24h to prevent accidental duplicate processing
  app.post("/api/admin/satellitescan/send-reminders", requireAdminAuth, async (_req, res) => {
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

  const httpServer = createServer(app);

  return httpServer;
}
