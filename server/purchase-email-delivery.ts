/** Provider acceptance only. Delivery needs a provider event or inbox evidence. */
export interface EmailAcceptanceResponse {
  data?: { id?: string } | null;
  error?: { name?: string } | null;
}

type Role = "admin" | "customer";
export type PurchaseEmailAttempt =
  | { role: Role; accepted: true; messageId: string }
  | { role: Role; accepted: false; errorType: "provider_rejected" | "provider_exception" | "invalid_response" };

export async function attemptPurchaseEmails(
  send: Record<Role, () => Promise<EmailAcceptanceResponse>>,
): Promise<PurchaseEmailAttempt[]> {
  return Promise.all((["admin", "customer"] as const).map(async (role): Promise<PurchaseEmailAttempt> => {
    try {
      const response = await send[role]();
      if (response?.error) return { role, accepted: false, errorType: "provider_rejected" };
      const messageId = response?.data?.id;
      if (typeof messageId !== "string" || !/^[A-Za-z0-9_-]{1,100}$/.test(messageId)) {
        return { role, accepted: false, errorType: "invalid_response" };
      }
      return { role, accepted: true, messageId };
    } catch {
      return { role, accepted: false, errorType: "provider_exception" };
    }
  }));
}
