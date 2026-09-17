import type { RequestHandler } from "express";

export const PRIVATE_CHECK_IN_SERVER_DISABLED_MESSAGE =
  "Private check-ins are stored only in this browser unless you export them.";

/**
 * Alpha privacy boundary: private check-ins must never be accepted by the server.
 */
export const rejectServerPrivateCheckIn: RequestHandler = (_req, res) => {
  res.status(410).json({
    error: "server_private_check_in_disabled",
    message: PRIVATE_CHECK_IN_SERVER_DISABLED_MESSAGE,
  });
};
