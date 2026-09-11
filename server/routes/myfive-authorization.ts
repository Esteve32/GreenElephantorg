import type { NextFunction, Request, RequestHandler, Response } from "express";

export interface MyFiveAccountAuthorizationRecord {
  id: string;
  email: string;
  isActive: string;
}

export interface MyFiveAdminAuthorizationRecord extends MyFiveAccountAuthorizationRecord {
  email: string;
  role: string;
}

export interface MyFiveSlotAuthorizationRecord {
  userId: string;
  partnerUserId: string | null;
  status: string;
  isSelfVault: string;
}

type MyFiveAccountLookup = (userId: string) => Promise<MyFiveAccountAuthorizationRecord | null>;
type MyFiveAdminLookup = (adminUserId: string) => Promise<MyFiveAdminAuthorizationRecord | null>;

export function createRequireMyFiveAccount(findAccount: MyFiveAccountLookup): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session?.clientUserId;
    if (!userId) {
      return res.status(401).json({ error: "authentication_required" });
    }

    try {
      const account = await findAccount(userId);
      if (
        !account
        || account.id !== userId
        || !req.session.clientEmail
        || account.email.toLowerCase() !== req.session.clientEmail.toLowerCase()
      ) {
        return res.status(401).json({ error: "account_session_invalid" });
      }
      if (account.isActive !== "true") {
        return res.status(403).json({ error: "account_inactive" });
      }
      return next();
    } catch {
      console.error("MyFive account verification unavailable");
      return res.status(503).json({ error: "account_verification_unavailable" });
    }
  };
}

export function createRequireMyFiveAdminWriter(findAdmin: MyFiveAdminLookup): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = req.session;
    if (!session?.isAdmin || !session.adminUserId || !session.adminEmail || !session.adminRole) {
      return res.status(401).json({ error: "admin_authentication_required" });
    }

    try {
      const admin = await findAdmin(session.adminUserId);
      if (
        !admin
        || admin.id !== session.adminUserId
        || admin.email.toLowerCase() !== session.adminEmail.toLowerCase()
        || admin.role !== session.adminRole
      ) {
        return res.status(401).json({ error: "admin_session_invalid" });
      }
      if (admin.isActive !== "true") {
        return res.status(403).json({ error: "admin_account_inactive" });
      }
      if (!new Set(["admin", "super_admin"]).has(admin.role)) {
        return res.status(403).json({ error: "admin_write_access_required" });
      }
      return next();
    } catch {
      console.error("MyFive administrator verification unavailable");
      return res.status(503).json({ error: "admin_verification_unavailable" });
    }
  };
}

export function getVerifiedMyFiveUserId(req: Request): string {
  const userId = req.session?.clientUserId;
  if (!userId) throw new Error("MyFive account middleware invariant violated");
  return userId;
}

export function hasMyFiveSlotAccess(
  actorUserId: string,
  slot: MyFiveSlotAuthorizationRecord,
  mode: "owner" | "participant",
  allowSelf = true,
): boolean {
  if (slot.status !== "active" || (!allowSelf && slot.isSelfVault === "true")) return false;
  if (mode === "owner") return slot.userId === actorUserId;
  return slot.userId === actorUserId || slot.partnerUserId === actorUserId;
}

interface EapVoucherAuditInput {
  voucherId: string;
  organizationLabel: string;
  maxRedemptions: number;
  expiresAt: Date | null;
}

export function buildEapVoucherAuditDetails(input: EapVoucherAuditInput) {
  return {
    voucherId: input.voucherId,
    organizationLabel: input.organizationLabel,
    maxRedemptions: input.maxRedemptions,
    expiresAt: input.expiresAt?.toISOString() ?? null,
  };
}
