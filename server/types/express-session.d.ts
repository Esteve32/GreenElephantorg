import "express-session";

declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
    adminUserId?: string;
    adminEmail?: string;
    adminRole?: string;
    clientUserId?: string;
    clientEmail?: string;
    linkedinOAuthState?: string;
    adminOAuthState?: string;
    notionOAuthState?: string;
    googleOAuthState?: string;
    fathomOAuthState?: string;
    spotifyOAuthState?: string;
    ouraOAuthState?: string;
  }
}
