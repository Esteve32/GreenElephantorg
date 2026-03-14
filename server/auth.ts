import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashAdminPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function verifyHashedPassword(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(":");
  if (!salt || !key) return false;
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  const storedKey = Buffer.from(key, "hex");
  return timingSafeEqual(derivedKey, storedKey);
}

const lastActivityUpdate = new Map<string, number>();

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.isAdmin) {
    if (req.session.adminUserId) {
      const now = Date.now();
      const last = lastActivityUpdate.get(req.session.adminUserId) || 0;
      if (now - last > 5 * 60 * 1000) {
        lastActivityUpdate.set(req.session.adminUserId, now);
        storage.updateAdminUser(req.session.adminUserId, { lastLoginAt: new Date() }).catch(() => {});
      }
    }
    return next();
  }
  
  return res.status(401).json({ 
    message: "Unauthorized. Please log in to access admin dashboard." 
  });
}

export function requireAdminRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.isAdmin || !req.session?.adminRole) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.session.adminRole === "super_admin") {
      return next();
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

export async function verifyAdminPassword(password: string): Promise<boolean> {
  try {
    const dbHash = await storage.getAdminSetting("admin_password_hash");
    if (dbHash) {
      return verifyHashedPassword(password, dbHash);
    }
  } catch {}
  
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  
  if (!ADMIN_PASSWORD) {
    console.error("ADMIN_PASSWORD not set in environment variables");
    return false;
  }
  
  return password === ADMIN_PASSWORD;
}

export { hashAdminPassword };

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
    const originalEnd = res.end;
    const email = req.session.adminEmail;
    const ip = req.ip || req.socket.remoteAddress || "unknown";

    res.end = function (...args: any[]) {
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
      return originalEnd.apply(this, args);
    } as any;
  }
  next();
}
