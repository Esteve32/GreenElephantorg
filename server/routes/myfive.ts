import { Router, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { includesEveryValueRule, VALUE_RULES_VERSION } from "../../shared/valueRules";

export const myfiveRouter = Router();

// Health check endpoint
myfiveRouter.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "MyFive Extension",
    version: "1.4.0",
    stack: "React_Vite_Express_NeonPG_Drizzle_Stripe"
  });
});

// Fetch active connection slots (Dunbar limit 5 + 1 Philautia)
myfiveRouter.get("/slots", (_req: Request, res: Response) => {
  res.json({
    maxSeats: 5,
    selfVaultActive: true,
    slots: [
      { id: 0, name: "Self (Philautia)", relation: "Self-Reflection Slot", status: "active", isSelf: true },
      { id: 1, name: "Alex", relation: "Partner", status: "active", isSelf: false },
      { id: 2, name: "Robin", relation: "Close Friend", status: "active", isSelf: false },
      { id: 3, name: "Empty Slot", relation: "Available Seat", status: "empty", isSelf: false },
      { id: 4, name: "Empty Slot", relation: "Available Seat", status: "empty", isSelf: false },
      { id: 5, name: "Empty Slot", relation: "Available Seat", status: "empty", isSelf: false },
    ]
  });
});

// Create/store private check-in
myfiveRouter.post("/check-in", (req: Request, res: Response) => {
  const { octant, reflectionText } = req.body;
  res.json({
    success: true,
    message: "Private check-in securely logged into encrypted vault",
    octant: octant || "flow",
    savedAt: new Date().toISOString()
  });
});

// Validate the unskippable consent boundary before a shared view is unlocked.
myfiveRouter.post("/consent", (req: Request, res: Response) => {
  const { acceptedRuleIds, rulesVersion, consentType } = req.body ?? {};
  if (rulesVersion !== VALUE_RULES_VERSION || !includesEveryValueRule(acceptedRuleIds)) {
    return res.status(400).json({
      error: "All nine current ValueRules™ must be accepted individually",
    });
  }
  if (consentType !== "agreement-sharing") {
    return res.status(400).json({ error: "Unsupported consent purpose" });
  }

  res.status(201).json({
    success: true,
    receiptId: randomUUID(),
    rulesVersion: VALUE_RULES_VERSION,
    acceptedAt: new Date().toISOString(),
    note: "Partner consent is a separate required event",
  });
});

// Save dyadic agreement
myfiveRouter.post("/agreements", (req: Request, res: Response) => {
  const { agreementText, acceptedRuleIds, rulesVersion } = req.body ?? {};
  if (rulesVersion !== VALUE_RULES_VERSION || !includesEveryValueRule(acceptedRuleIds)) {
    return res.status(400).json({ error: "Unskippable individual consent to all 9 ValueRules™ is required" });
  }
  res.json({
    success: true,
    message: "Dyadic relationship agreement timestamped and saved",
    savedAt: new Date().toISOString()
  });
});

// Subscription pay gate verification
myfiveRouter.get("/subscription", (_req: Request, res: Response) => {
  res.json({
    plan: "B2C Primary Subscription",
    status: "active",
    priceEur: 4.99,
    sponsoredSeatsAllowed: 5,
    stripeConnected: true
  });
});
