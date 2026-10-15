import { createCurrentAdminGuard, createNamedOwnerGuard } from './admin-current-access';
import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

export const requireAdminAuth = createCurrentAdminGuard({
  findAdmin: id => storage.getAdminUserById(id),
  owner: () => process.env.ADMIN_OWNER_EMAIL,
});

const requireNamedOwner = createNamedOwnerGuard(() => process.env.ADMIN_OWNER_EMAIL);

export function requireAdminRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.isAdmin || !req.session?.adminRole) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.session.adminRole === "super_admin") {
      return requireNamedOwner(req, res, next);
    }
    if (!allowedRoles.includes(req.session.adminRole)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    return next();
  };
}

export function requireWriteAccess(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.isAdmin || !req.session?.adminRole) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.session.adminRole === "viewer") {
    return res.status(403).json({ message: "Viewers have read-only access" });
  }
  return next();
}

export async function logAuditEvent(
  userEmail: string,
  actionType: string,
  resource?: string,
  details?: object,
  ipAddress?: string
): Promise<void> {
  try {
    await storage.createAuditLog({
      userEmail,
      actionType,
      resource: resource || null,
      details: details || null,
      ipAddress: ipAddress || null,
    });
  } catch (err) {
    console.error("Audit log write failed:", err);
  }
}

const SENSITIVE_FIELDS = ["password", "currentPassword", "newPassword", "passwordHash", "secret", "token"];

function redactBody(body: any): any {
  if (!body || typeof body !== "object") return body;
  const redacted: any = {};
  for (const [key, value] of Object.entries(body)) {
    if (SENSITIVE_FIELDS.includes(key)) {
      redacted[key] = "[REDACTED]";
    } else {
      redacted[key] = value;
    }
  }
  return redacted;
}

export function auditMiddleware(req: Request, res: Response, next: NextFunction) {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && req.session?.adminEmail) {
    const email = req.session.adminEmail;
    const ip = req.ip || req.socket.remoteAddress || "unknown";

    res.once("finish", () => {
      const statusCode = res.statusCode;
      if (statusCode < 400) {
        logAuditEvent(
          email,
          `${req.method} ${req.path}`,
          req.path,
          { body: redactBody(req.body), statusCode },
          ip
        );
      }
    });
  }
  next();
}
