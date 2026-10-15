import "express-session";

declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
    adminUserId?: string;
    adminEmail?: string;
    adminRole?: string;
    adminGoogleSubject?: string;
    adminAuthenticatedAt?: number;
    adminMfaVerified?: boolean;
    adminGoogleAuthTime?: number;
    adminOAuthNonce?: string;
    adminOAuthStartedAt?: number;
    adminOAuthVerifier?: string;
    clientUserId?: string;
    clientEmail?: string;
    myfiveActorId?: string;
    linkedinOAuthState?: string;
    adminOAuthState?: string;
    notionOAuthState?: string;
    googleOAuthState?: string;
    fathomOAuthState?: string;
    spotifyOAuthState?: string;
    ouraOAuthState?: string;
  }
}
