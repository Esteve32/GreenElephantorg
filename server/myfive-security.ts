import type { ErrorRequestHandler, RequestHandler } from "express";

export const MYFIVE_OPERATIONAL_FAILURE_EVENTS = [
  "account_verification_unavailable",
  "administrator_verification_unavailable",
  "slot_read_failed",
  "slot_creation_failed",
  "invitation_creation_failed",
  "provisional_connection_deletion_failed",
  "invitation_acceptance_failed",
  "consent_persistence_failed",
  "consent_withdrawal_failed",
  "agreement_read_failed",
  "agreement_persistence_failed",
  "frozen_agreement_deletion_failed",
  "connection_profile_read_failed",
  "connection_profile_persistence_failed",
  "data_export_failed",
  "current_session_cleanup_failed",
  "account_deletion_orchestration_failed",
  "eap_voucher_creation_failed",
  "eap_voucher_redemption_failed",
  "stripe_checkout_creation_failed",
  "stripe_checkout_confirmation_failed",
  "subscription_read_failed",
  "provisional_cleanup_failed",
  "deletion_worker_unavailable",
  "unhandled_request_failed",
] as const;

export type MyFiveOperationalFailureEvent = (typeof MYFIVE_OPERATIONAL_FAILURE_EVENTS)[number];
type LogWriter = (message: string) => void;

export function writeMyFiveOperationalFailure(
  event: MyFiveOperationalFailureEvent,
  writeLog: LogWriter = console.error,
): void {
  writeLog(JSON.stringify({ service: "myfive", severity: "error", event }));
}

function isMyFivePath(path: string): boolean {
  return path === "/myfive"
    || path.startsWith("/myfive/")
    || path === "/api/myfive"
    || path.startsWith("/api/myfive/");
}

export function myFiveContentSecurityPolicy(isDevelopment: boolean): string {
  const scriptSource = isDevelopment ? "script-src 'self' 'unsafe-inline'" : "script-src 'self'";
  const connectSource = isDevelopment ? "connect-src 'self' ws: wss:" : "connect-src 'self'";
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    scriptSource,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    connectSource,
    "form-action 'self'",
    "worker-src 'self' blob:",
    "media-src 'self'",
    "manifest-src 'self'",
  ].join("; ");
}

export function createMyFiveSecurityHeaders(isDevelopment: boolean): RequestHandler {
  const contentSecurityPolicy = myFiveContentSecurityPolicy(isDevelopment);
  return (req, res, next) => {
    if (!isMyFivePath(req.path)) return next();
    res.set({
      "Cache-Control": "private, no-store, max-age=0",
      "Content-Security-Policy": contentSecurityPolicy,
      "Cross-Origin-Resource-Policy": "same-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
    });
    next();
  };
}

export function createMyFiveErrorHandler(writeLog: LogWriter = console.error): ErrorRequestHandler {
  return (error, req, res, next) => {
    if (!isMyFivePath(req.path)) return next(error);
    writeMyFiveOperationalFailure("unhandled_request_failed", writeLog);
    if (res.headersSent) {
      res.end();
      return;
    }
    const malformedJson = error instanceof SyntaxError
      && typeof error === "object"
      && error !== null
      && "status" in error
      && error.status === 400;
    res.status(malformedJson ? 400 : 500).json({
      error: malformedJson ? "invalid_json" : "internal_error",
    });
  };
}
