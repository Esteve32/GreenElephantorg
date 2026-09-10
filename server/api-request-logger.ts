/opt/homebrew/Library/Homebrew/cmd/shellenv.sh: line 18: /bin/ps: Operation not permitted
import type { NextFunction, Request, RequestHandler, Response } from "express";

type LogWriter = (message: string) => void;

function safeMethod(method: string): string {
  const normalized = method.toUpperCase();
  return /^[A-Z]+$/.test(normalized) ? normalized : "OTHER";
}

function safeRoutePattern(req: Request): string {
  const routePath = typeof req.route?.path === "string" ? req.route.path : null;
  if (!routePath) return "/api/<unmatched>";

  const baseUrl = typeof req.baseUrl === "string" && req.baseUrl.startsWith("/api")
    ? req.baseUrl
    : "/api";
  const path = routePath.startsWith("/api") ? routePath : `${baseUrl}${routePath}`;
  return path.replace(/[\r\n]/g, "");
}

export function formatApiRequestLog(req: Request, res: Response, durationMs: number): string {
  return `${safeMethod(req.method)} ${safeRoutePattern(req)} ${res.statusCode} in ${Math.max(0, Math.round(durationMs))}ms`;
}

/**
 * Logs only code-defined route patterns and operational response metadata.
 * Request bodies, response bodies, query strings, headers, cookies and concrete
 * path parameters are deliberately never serialized.
 */
export function createApiRequestLogger(writeLog: LogWriter): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith("/api")) return next();

    const start = Date.now();
    res.on("finish", () => {
      writeLog(formatApiRequestLog(req, res, Date.now() - start));
    });
    next();
  };
}
