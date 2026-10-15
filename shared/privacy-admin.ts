/** Minimal read model: no addresses, contact keys, Scan answers or message bodies. */
export interface PrivacyWithdrawalPage {
  events: { id: string; recordedAt: string; contactLinked: boolean }[];
  nextCursor: string | null;
  accessExpiresAt: string;
}
