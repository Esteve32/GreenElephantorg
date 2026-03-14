import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { registerRoutes } from "./routes";
import { registerPortalRoutes } from "./portal-auth";
import { setupVite, serveStatic, log } from "./vite";
import { startOnboardingScheduler } from "./onboarding-scheduler";
import { startDailyPulseScheduler } from "./daily-pulse";

const app = express();

// Trust proxy for secure cookies behind Replit's proxy
app.set('trust proxy', 1);

// Require SESSION_SECRET for security
if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is required for secure sessions');
}

// PostgreSQL session store for production-safe session management
const PgSession = connectPgSimple(session);
app.use(session({
  store: new PgSession({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    sameSite: 'lax',
  }
}));

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

// Dedicated raw body parser for Typeform webhook with higher limit
// This must come BEFORE the global JSON parser to intercept large payloads
app.use('/api/typeform-webhook', express.raw({ 
  type: 'application/json', 
  limit: '50mb' 
}));

// Global JSON parser for all other routes
app.use(express.json({
  limit: '10mb',
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  registerPortalRoutes(app);
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    
    // Set up automatic daily reminder scheduler
    // Runs every 24 hours to check for overdue Satellitescan purchases
    setupDailyReminderScheduler();
    
    // Set up onboarding email scheduler
    // Runs every 5 minutes to check for pending Fibonacci sequence emails
    startOnboardingScheduler();

    // Set up daily pulse digest scheduler (runs at 8:00 AM UTC daily)
    startDailyPulseScheduler();
  });
})();

// Automatic daily reminder scheduler for Satellitescan purchases
async function setupDailyReminderScheduler() {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  console.log('🔔 Daily reminder scheduler initialized');
  console.log('⏰ Will check for overdue Satellitescan purchases every 24 hours');
  
  // Run immediately on startup (optional - comment out if you don't want this)
  // await checkAndSendReminders();
  
  // Then run every 24 hours
  setInterval(async () => {
    await checkAndSendReminders();
  }, TWENTY_FOUR_HOURS);
}

async function checkAndSendReminders() {
  try {
    console.log('\n📧 Running scheduled reminder check...');
    
    // Import storage and email functions
    const { storage } = await import('./storage');
    const { sendSatellitescanReminderEmail } = await import('./email-notifications');
    
    // Find purchases older than 72 hours with no typeform completion and no reminders sent
    const hoursThreshold = 72;
    const overduePurchases = await storage.getOverdueSatellitescanPurchases(hoursThreshold);
    
    console.log(`Found ${overduePurchases.length} overdue purchases needing reminders`);
    
    if (overduePurchases.length === 0) {
      console.log('✅ No overdue purchases - all customers are up to date!');
      return;
    }
    
    let sent = 0;
    let failed = 0;
    
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
          sent++;
          console.log(`✅ Reminder sent to: ${purchase.customerEmail}`);
        } else {
          failed++;
          console.log(`⚠️ Email failed for ${purchase.customerEmail} (count incremented to prevent retry)`);
        }
      } catch (error: any) {
        failed++;
        console.error(`❌ Error processing ${purchase.customerEmail}:`, error.message);
      }
    }
    
    console.log(`📊 Reminder summary: ${sent} sent, ${failed} failed\n`);
  } catch (error: any) {
    console.error('❌ Scheduled reminder check failed:', error);
  }
}
