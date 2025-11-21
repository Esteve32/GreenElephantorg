import type { Request, Response, NextFunction } from "express";

// Admin authentication middleware
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  
  return res.status(401).json({ 
    message: "Unauthorized. Please log in to access admin dashboard." 
  });
}

// Check if admin password matches
export function verifyAdminPassword(password: string): boolean {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  
  if (!ADMIN_PASSWORD) {
    console.error("ADMIN_PASSWORD not set in environment variables");
    return false;
  }
  
  return password === ADMIN_PASSWORD;
}
