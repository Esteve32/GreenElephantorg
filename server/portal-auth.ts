import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { sendPasswordResetEmail } from "./email-notifications";

export function getBaseUrl(req: Request): string {
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }
  const proto = req.get('x-forwarded-proto') || req.protocol || 'https';
  const host = req.get('x-forwarded-host') || req.get('host') || 'greenelephant.org';
  return `${proto}://${host}`;
}

async function isAdminUser(email: string): Promise<boolean> {
  const adminUser = await storage.getAdminUserByEmail(email.toLowerCase());
  return !!adminUser && adminUser.isActive === "true";
}

async function ensurePortalUserForAdmin(email: string, name?: string | null, avatarUrl?: string | null): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await storage.getClientUserByEmail(normalizedEmail);
  if (!existing) {
    await storage.createClientUser({
      email: normalizedEmail,
      name: name || normalizedEmail.split("@")[0],
      googleId: null,
      avatarUrl: avatarUrl || null,
    });
  }
}

async function autoConnectScansToUser(userId: string, email: string): Promise<void> {
  try {
    const scans = await storage.getSatellitescanPurchasesByEmail(email);
    if (scans.length === 0) return;

    const existingEvents = await storage.getPortalTimelineEvents(userId);
    const existingScanIds = new Set(
      existingEvents
        .filter((e) => e.type === "scan" && e.toolId)
        .map((e) => e.toolId)
    );

    for (const scan of scans) {
      if (scan.status !== "succeeded") continue;
      if (existingScanIds.has(scan.id)) continue;

      const completedLabel = scan.typeformCompleted === "true" ? " (completed)" : " (pending)";
      await storage.createPortalTimelineEvent({
        userId,
        type: "scan",
        title: `Satellite Scan${completedLabel}`,
        description: `Satellite Scan purchased on ${new Date(scan.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`,
        details: scan.role ? `Role: ${scan.role}` : null,
        lens: "Needs",
        toolId: scan.id,
        date: scan.typeformCompletedAt || scan.createdAt,
      });
    }

    const linked = scans.filter((s) => s.status === "succeeded" && !existingScanIds.has(s.id)).length;
    if (linked > 0) {
      console.log(`🔗 Auto-connected ${linked} scan(s) to portal user ${email}`);
    }
  } catch (error: unknown) {
    console.error("Auto-connect scans error:", error instanceof Error ? error.message : "Unknown error");
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [hashedPassword, salt] = hash.split(".");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return timingSafeEqual(Buffer.from(hashedPassword, "hex"), buf);
}

export function requirePortalAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.clientUserId) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
}

async function isPortalLoginEnabled(): Promise<boolean> {
  const setting = await storage.getAdminSetting("portal_login_enabled");
  return setting !== "false";
}

export function registerPortalRoutes(app: Express) {
  app.post("/api/portal/register", async (req, res) => {
    try {
      if (!(await isPortalLoginEnabled())) {
        return res.status(403).json({ message: "Portal registration is currently disabled" });
      }

      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const existing = await storage.getClientUserByEmail(normalizedEmail);
      if (existing) {
        return res.status(409).json({ message: "An account with this email already exists" });
      }

      const passwordHash = await hashPassword(password);
      const user = await storage.createClientUser({
        email: normalizedEmail,
        name: name || null,
        passwordHash,
      });

      req.session.clientUserId = user.id;
      req.session.clientEmail = user.email;

      autoConnectScansToUser(user.id, user.email);

      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Registration failed" });
        }
        res.json({
          message: "Account created",
          user: { id: user.id, email: user.email, name: user.name },
        });
      });
    } catch (error: unknown) {
      console.error("Portal registration error:", error instanceof Error ? error.message : "Unknown");
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/portal/login", async (req, res) => {
    try {
      const portalEnabled = await isPortalLoginEnabled();
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const isAdmin = await isAdminUser(normalizedEmail);

      if (!portalEnabled && !isAdmin) {
        return res.status(403).json({ message: "Portal login is currently disabled" });
      }

      const user = await storage.getClientUserByEmail(normalizedEmail);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (user.isActive !== "true") {
        return res.status(403).json({ message: "Account is disabled" });
      }

      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      await storage.updateClientUser(user.id, { lastLoginAt: new Date() });

      req.session.clientUserId = user.id;
      req.session.clientEmail = user.email;

      autoConnectScansToUser(user.id, user.email);

      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Login failed" });
        }
        res.json({
          message: "Login successful",
          user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl },
        });
      });
    } catch (error: unknown) {
      console.error("Portal login error:", error instanceof Error ? error.message : "Unknown");
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/portal/logout", async (req, res) => {
    if (req.session) {
      req.session.clientUserId = undefined;
      req.session.clientEmail = undefined;
    }
    res.json({ message: "Logged out" });
  });

  app.post("/api/portal/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const user = await storage.getClientUserByEmail(normalizedEmail);

      if (!user || !user.passwordHash) {
        return res.json({ message: "If an account exists with that email, a reset link has been sent." });
      }

      const token = randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 60 * 60 * 1000);
      await storage.updateClientUser(user.id, {
        resetToken: token,
        resetTokenExpiry: expiry,
      });

      const baseUrl = getBaseUrl(req);
      const resetUrl = `${baseUrl}/portal/reset-password?token=${token}`;
      await sendPasswordResetEmail(normalizedEmail, resetUrl);

      res.json({ message: "If an account exists with that email, a reset link has been sent." });
    } catch (error: unknown) {
      console.error("Forgot password error:", error instanceof Error ? error.message : "Unknown");
      res.json({ message: "If an account exists with that email, a reset link has been sent." });
    }
  });

  app.post("/api/portal/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      const allUsers = await storage.getAllClientUsers();
      const user = allUsers.find(u => u.resetToken === token);

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset link" });
      }

      if (!user.resetTokenExpiry || new Date(user.resetTokenExpiry) < new Date()) {
        return res.status(400).json({ message: "Reset link has expired. Please request a new one." });
      }

      const passwordHash = await hashPassword(password);
      await storage.updateClientUser(user.id, {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      });

      res.json({ message: "Password has been reset. You can now log in with your new password." });
    } catch (error: unknown) {
      console.error("Reset password error:", error instanceof Error ? error.message : "Unknown");
      res.status(500).json({ message: "Password reset failed" });
    }
  });

  app.get("/api/portal/me", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.json({ authenticated: false });
    }

    try {
      const user = await storage.getClientUserById(req.session.clientUserId);
      if (!user) {
        return res.json({ authenticated: false });
      }

      const subscription = await storage.getClientSubscriptionByUserId(user.id);

      res.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          twoFactorEnabled: user.twoFactorEnabled === "true",
          hasLinkedIn: !!user.linkedinSub,
          hasGoogle: !!user.googleId,
        },
        subscription: subscription
          ? {
              plan: subscription.plan,
              status: subscription.status,
              currentPeriodEnd: subscription.currentPeriodEnd,
            }
          : null,
      });
    } catch (error: any) {
      console.error("Portal me error:", error);
      res.json({ authenticated: false });
    }
  });

  app.post("/api/portal/change-password", requirePortalAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new password are required" });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters" });
      }

      const user = await storage.getClientUserById(req.session.clientUserId!);
      if (!user || !user.passwordHash) {
        return res.status(400).json({ message: "No password set on this account. Use Google or LinkedIn login." });
      }

      const valid = await verifyPassword(currentPassword, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      const hash = await hashPassword(newPassword);
      await storage.updateClientUser(user.id, { passwordHash: hash });

      res.json({ message: "Password updated successfully" });
    } catch (error: unknown) {
      console.error("Change password error:", error instanceof Error ? error.message : "Unknown");
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  app.post("/api/portal/profile/avatar", requirePortalAuth, async (req, res) => {
    try {
      const { avatar } = req.body;
      if (!avatar || typeof avatar !== "string") {
        return res.status(400).json({ message: "Avatar image data is required" });
      }
      if (!avatar.match(/^data:image\/(jpeg|png|webp);base64,/)) {
        return res.status(400).json({ message: "Invalid image format. Only JPEG, PNG, and WebP are allowed." });
      }
      if (avatar.length > 3 * 1024 * 1024) {
        return res.status(400).json({ message: "Image too large (max 2MB)" });
      }
      await storage.updateClientUser(req.session.clientUserId!, { avatarUrl: avatar });
      res.json({ message: "Avatar updated" });
    } catch (error: unknown) {
      console.error("Avatar upload error:", error instanceof Error ? error.message : "Unknown");
      res.status(500).json({ message: "Failed to update avatar" });
    }
  });

  app.delete("/api/portal/profile/avatar", requirePortalAuth, async (req, res) => {
    try {
      await storage.updateClientUser(req.session.clientUserId!, { avatarUrl: null });
      res.json({ message: "Avatar removed" });
    } catch (error: unknown) {
      console.error("Avatar remove error:", error instanceof Error ? error.message : "Unknown");
      res.status(500).json({ message: "Failed to remove avatar" });
    }
  });

  app.get("/api/portal/auth/google", async (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({ message: "Google login is not configured yet" });
    }

    const baseUrl = getBaseUrl(req);
    if (baseUrl.includes(".replit.dev")) {
      console.log("Portal Google OAuth: dev domain detected, redirecting to login with dev_google error");
      return res.redirect("/portal/login?error=dev_google");
    }

    const oauthNonce = randomBytes(24).toString("hex");
    req.session.googleOAuthState = oauthNonce;

    const redirectUri = `${baseUrl}/api/portal/auth/google/callback`;
    const scope = encodeURIComponent("openid email profile");
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=select_account&state=${oauthNonce}`;

    console.log("Portal Google OAuth: redirecting to Google. Redirect URI:", redirectUri);

    req.session.save(() => {
      res.redirect(authUrl);
    });
  });

  app.get("/api/portal/auth/google/callback", async (req, res) => {
    try {
      const { code, state, error: googleError } = req.query;

      if (googleError) {
        console.error("Google OAuth returned error:", googleError, req.query);
        return res.redirect(`/portal/login?error=google_${googleError}`);
      }

      if (!code) {
        console.warn("Portal Google OAuth callback: no code received. Query:", req.query);
        return res.redirect("/portal/login?error=no_code");
      }

      if (!req.session?.googleOAuthState || req.session.googleOAuthState !== state) {
        console.warn("Portal Google OAuth state mismatch. Session state:", req.session?.googleOAuthState ? "present" : "missing", "Query state:", state ? "present" : "missing");
        return res.redirect("/portal/login?error=invalid_state");
      }
      delete req.session.googleOAuthState;

      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        return res.redirect("/portal/login?error=not_configured");
      }

      const redirectUri = `${getBaseUrl(req)}/api/portal/auth/google/callback`;

      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: code as string,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        return res.redirect("/portal/login?error=token_failed");
      }

      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const googleUser = await userInfoRes.json();

      if (!googleUser.email) {
        return res.redirect("/portal/login?error=no_email");
      }

      const portalEnabled = await isPortalLoginEnabled();
      const adminUser = await isAdminUser(googleUser.email);
      if (!portalEnabled && !adminUser) {
        return res.redirect("/portal/login?error=portal_disabled");
      }

      let user = await storage.getClientUserByGoogleId(googleUser.id);

      if (!user) {
        user = await storage.getClientUserByEmail(googleUser.email.toLowerCase());
        if (user) {
          user = await storage.updateClientUser(user.id, {
            googleId: googleUser.id,
            avatarUrl: googleUser.picture || user.avatarUrl,
            name: user.name || googleUser.name,
          }) || user;
        } else {
          user = await storage.createClientUser({
            email: googleUser.email.toLowerCase(),
            name: googleUser.name,
            googleId: googleUser.id,
            avatarUrl: googleUser.picture,
          });
        }
      } else {
        await storage.updateClientUser(user.id, { lastLoginAt: new Date() });
      }

      req.session.clientUserId = user.id;
      req.session.clientEmail = user.email;

      autoConnectScansToUser(user.id, user.email);

      req.session.save((err) => {
        if (err) {
          console.error("Session save error after Google auth:", err);
          return res.redirect("/portal/login?error=session_failed");
        }
        res.redirect("/portal");
      });
    } catch (error: unknown) {
      console.error("Google OAuth callback error:", error instanceof Error ? error.message : "Unknown");
      res.redirect("/portal/login?error=callback_failed");
    }
  });

  app.get("/api/admin/portal-users", async (req, res) => {
    if (!req.session?.isAdmin) {
      return res.status(401).json({ message: "Admin required" });
    }
    try {
      const users = await storage.getAllClientUsers();
      const usersWithSubs = await Promise.all(
        users.map(async (u) => {
          const sub = await storage.getClientSubscriptionByUserId(u.id);
          return {
            id: u.id,
            email: u.email,
            name: u.name,
            avatarUrl: u.avatarUrl,
            isActive: u.isActive,
            createdAt: u.createdAt,
            lastLoginAt: u.lastLoginAt,
            hasGoogleAuth: !!u.googleId,
            hasLinkedInAuth: !!u.linkedinSub,
            subscription: sub ? { plan: sub.plan, status: sub.status, currentPeriodEnd: sub.currentPeriodEnd } : null,
          };
        })
      );
      res.json(usersWithSubs);
    } catch (error: any) {
      console.error("Admin portal users error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/settings", async (req, res) => {
    if (!req.session?.isAdmin) {
      return res.status(401).json({ message: "Admin required" });
    }
    try {
      const settings = await storage.getAllAdminSettings();
      const result: Record<string, string> = {};
      settings.forEach((s) => { result[s.key] = s.value; });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  const PROTECTED_SETTINGS_KEYS = ["admin_password_hash"];
  const SETTINGS_ALLOWLIST = [
    "portal_login_enabled",
    "portal_registration_enabled",
    "portal_tagline",
    "portal_login_subtitle",
    "portal_google_login_enabled",
    "portal_email_login_enabled",
    "linkedin_access_token",
    "linkedin_org_id",
    "linkedin_oauth_enabled",
    "admin_password_hash",
  ];

  app.post("/api/admin/settings", async (req, res) => {
    if (!req.session?.isAdmin) {
      return res.status(401).json({ message: "Admin required" });
    }
    if (req.session?.adminRole === "viewer") {
      return res.status(403).json({ message: "Viewers have read-only access" });
    }
    try {
      const { key, value } = req.body;
      if (!key || value === undefined) {
        return res.status(400).json({ message: "Key and value required" });
      }
      if (!SETTINGS_ALLOWLIST.includes(key)) {
        return res.status(400).json({ message: `Setting key '${key}' is not allowed` });
      }
      if (PROTECTED_SETTINGS_KEYS.includes(key) && req.session?.adminRole !== "super_admin") {
        return res.status(403).json({ message: "Only super admins can modify this setting" });
      }
      const setting = await storage.setAdminSetting(key, String(value));
      res.json(setting);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to save setting" });
    }
  });

  app.get("/api/portal/notion/connect", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }

    const clientId = process.env.NOTION_OAUTH_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({ message: "Notion integration is not configured yet" });
    }

    const baseUrl = process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : "https://greenelephant.org";
    const redirectUri = `${baseUrl}/api/portal/notion/callback`;
    const oauthNonce = randomBytes(24).toString("hex");
    req.session.notionOAuthState = oauthNonce;

    const authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(redirectUri)}&state=${oauthNonce}`;
    res.redirect(authUrl);
  });

  app.get("/api/portal/notion/callback", async (req, res) => {
    try {
      const { code, state } = req.query;
      if (!code || !state) {
        return res.redirect("/portal/settings?notion=error&reason=no_code");
      }

      if (!req.session?.clientUserId || !req.session.notionOAuthState || req.session.notionOAuthState !== state) {
        return res.redirect("/portal/settings?notion=error&reason=invalid_state");
      }
      delete req.session.notionOAuthState;

      const clientId = process.env.NOTION_OAUTH_CLIENT_ID;
      const clientSecret = process.env.NOTION_OAUTH_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        return res.redirect("/portal/settings?notion=error&reason=not_configured");
      }

      const baseUrl = process.env.REPLIT_DEV_DOMAIN
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : "https://greenelephant.org";
      const redirectUri = `${baseUrl}/api/portal/notion/callback`;

      const tokenRes = await fetch("https://api.notion.com/v1/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          code: code as string,
          redirect_uri: redirectUri,
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        console.error("Notion OAuth token error:", tokenData);
        return res.redirect("/portal/settings?notion=error&reason=token_failed");
      }

      const userId = req.session.clientUserId;
      await storage.updateClientUser(userId, {
        notionAccessToken: tokenData.access_token,
        notionWorkspaceName: tokenData.workspace_name || "Connected Workspace",
        notionWorkspaceId: tokenData.workspace_id || null,
        notionBotId: tokenData.bot_id || null,
      });

      res.redirect("/portal/settings?notion=connected");
    } catch (error: any) {
      console.error("Notion OAuth callback error:", error);
      res.redirect("/portal/settings?notion=error&reason=callback_failed");
    }
  });

  app.post("/api/portal/notion/disconnect", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      await storage.updateClientUser(req.session.clientUserId, {
        notionAccessToken: null,
        notionWorkspaceName: null,
        notionWorkspaceId: null,
        notionBotId: null,
      });
      res.json({ message: "Notion disconnected" });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to disconnect" });
    }
  });

  app.get("/api/portal/notion/status", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      const user = await storage.getClientUserById(req.session.clientUserId);
      if (!user) return res.json({ connected: false });

      res.json({
        connected: !!user.notionAccessToken,
        workspaceName: user.notionWorkspaceName || null,
      });
    } catch {
      res.json({ connected: false });
    }
  });

  app.post("/api/portal/notion/push-scan", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      const user = await storage.getClientUserById(req.session.clientUserId);
      if (!user?.notionAccessToken) {
        return res.status(400).json({ message: "Notion not connected" });
      }

      const { title, content, lensData } = req.body;

      const notionRes = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${user.notionAccessToken}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          parent: { type: "workspace", workspace: true },
          properties: {
            title: {
              title: [{ text: { content: title || "Satellite Scan Results" } }],
            },
          },
          children: [
            {
              object: "block",
              type: "heading_2",
              heading_2: { rich_text: [{ text: { content: "Satellite Scan Results" } }] },
            },
            {
              object: "block",
              type: "paragraph",
              paragraph: {
                rich_text: [{ text: { content: content || "Your communication scan data from GreenElephant.org" } }],
              },
            },
            ...(lensData ? [{
              object: "block" as const,
              type: "heading_3" as const,
              heading_3: { rich_text: [{ text: { content: "Lens Analysis" } }] },
            }, {
              object: "block" as const,
              type: "paragraph" as const,
              paragraph: {
                rich_text: [{ text: { content: JSON.stringify(lensData, null, 2) } }],
              },
            }] : []),
          ],
        }),
      });

      const result = await notionRes.json();
      if (result.id) {
        res.json({ message: "Scan data pushed to Notion", pageId: result.id, url: result.url });
      } else {
        console.error("Notion push error:", result);
        res.status(400).json({ message: "Failed to push to Notion. Make sure you've granted page access." });
      }
    } catch (error: any) {
      console.error("Notion push error:", error);
      res.status(500).json({ message: "Failed to push scan data" });
    }
  });

  app.get("/api/portal/auth/linkedin", async (req, res) => {
    if (!(await isPortalLoginEnabled())) {
      return res.status(403).json({ message: "Portal login is currently disabled" });
    }

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return res.status(503).json({ message: "LinkedIn login is not configured yet" });
    }

    const linkedinEnabled = await storage.getAdminSetting("linkedin_oauth_enabled");
    if (linkedinEnabled === "false") {
      return res.status(503).json({ message: "LinkedIn login is currently disabled" });
    }

    const baseUrl = process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : "https://greenelephant.org";
    if (baseUrl.includes(".replit.dev")) {
      return res.redirect("/portal/login?error=dev_linkedin");
    }
    const redirectUri = `${baseUrl}/api/portal/auth/linkedin/callback`;
    const state = randomBytes(16).toString("hex");
    req.session.linkedinOAuthState = state;

    const scope = encodeURIComponent("openid profile email");
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${scope}`;

    req.session.save(() => {
      res.redirect(authUrl);
    });
  });

  app.get("/api/portal/auth/linkedin/callback", async (req, res) => {
    try {
      const { code, state } = req.query;
      if (!code || !state) {
        return res.redirect("/portal/login?error=no_code");
      }

      if (state !== req.session.linkedinOAuthState) {
        return res.redirect("/portal/login?error=state_mismatch");
      }
      delete req.session.linkedinOAuthState;

      const clientId = process.env.LINKEDIN_CLIENT_ID;
      const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        return res.redirect("/portal/login?error=not_configured");
      }

      const baseUrl = process.env.REPLIT_DEV_DOMAIN
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : "https://greenelephant.org";
      const redirectUri = `${baseUrl}/api/portal/auth/linkedin/callback`;

      const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code as string,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        console.error("LinkedIn token error:", tokenData);
        return res.redirect("/portal/login?error=token_failed");
      }

      const userInfoRes = await fetch("https://api.linkedin.com/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const linkedinUser = await userInfoRes.json();

      if (!linkedinUser.email) {
        return res.redirect("/portal/login?error=no_email");
      }

      const tokenExpiry = tokenData.expires_in
        ? new Date(Date.now() + tokenData.expires_in * 1000)
        : null;

      let user = await storage.getClientUserByLinkedinSub(linkedinUser.sub);

      if (!user) {
        user = await storage.getClientUserByEmail(linkedinUser.email.toLowerCase());
        if (user) {
          user = await storage.updateClientUser(user.id, {
            linkedinSub: linkedinUser.sub,
            linkedinAccessToken: tokenData.access_token,
            linkedinTokenExpiry: tokenExpiry,
            name: user.name || linkedinUser.name,
            avatarUrl: user.avatarUrl || linkedinUser.picture || null,
          }) || user;
        } else {
          user = await storage.createClientUser({
            email: linkedinUser.email.toLowerCase(),
            name: linkedinUser.name || linkedinUser.given_name,
            linkedinSub: linkedinUser.sub,
            avatarUrl: linkedinUser.picture || null,
          });
          await storage.updateClientUser(user.id, {
            linkedinAccessToken: tokenData.access_token,
            linkedinTokenExpiry: tokenExpiry,
          });
        }
      } else {
        await storage.updateClientUser(user.id, {
          lastLoginAt: new Date(),
          linkedinAccessToken: tokenData.access_token,
          linkedinTokenExpiry: tokenExpiry,
        });
      }

      if (user.isActive !== "true") {
        return res.redirect("/portal/login?error=account_disabled");
      }

      req.session.clientUserId = user.id;
      req.session.clientEmail = user.email;

      autoConnectScansToUser(user.id, user.email);

      req.session.save((err) => {
        if (err) {
          console.error("Session save error after LinkedIn auth:", err);
          return res.redirect("/portal/login?error=session_failed");
        }
        res.redirect("/portal");
      });
    } catch (error: unknown) {
      console.error("LinkedIn OAuth callback error:", error instanceof Error ? error.message : "Unknown");
      res.redirect("/portal/login?error=callback_failed");
    }
  });

  app.get("/api/admin/linkedin/test", async (req, res) => {
    if (!req.session?.isAdmin) {
      return res.status(401).json({ message: "Admin required" });
    }

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const baseUrl = process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : "https://greenelephant.org";
    const redirectUri = `${baseUrl}/api/portal/auth/linkedin/callback`;

    res.json({
      configured: !!(clientId && clientSecret),
      clientIdPresent: !!clientId,
      clientSecretPresent: !!clientSecret,
      redirectUri,
      scopes: "openid profile email",
      authEndpoint: "https://www.linkedin.com/oauth/v2/authorization",
      tokenEndpoint: "https://www.linkedin.com/oauth/v2/accessToken",
      userinfoEndpoint: "https://api.linkedin.com/v2/userinfo",
    });
  });

  app.post("/api/portal/linkedin/disconnect", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      await storage.updateClientUser(req.session.clientUserId, {
        linkedinSub: null,
        linkedinAccessToken: null,
        linkedinTokenExpiry: null,
      });
      res.json({ message: "LinkedIn disconnected" });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to disconnect" });
    }
  });

  app.get("/api/portal/spotify/connect", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({ message: "Spotify integration is not configured yet" });
    }

    const baseUrl = process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : "https://greenelephant.org";
    if (baseUrl.includes(".replit.dev")) {
      return res.status(400).json({ message: "Spotify connection only works on the published site (greenelephant.org). Please try again after publishing." });
    }
    const redirectUri = `${baseUrl}/api/portal/spotify/callback`;
    const oauthNonce = randomBytes(24).toString("hex");
    req.session.spotifyOAuthState = oauthNonce;

    const scopes = "user-read-recently-played user-read-email user-top-read";
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=${oauthNonce}`;
    res.redirect(authUrl);
  });

  app.get("/api/portal/spotify/callback", async (req, res) => {
    try {
      const { code, state } = req.query;
      if (!code || !state) {
        return res.redirect("/portal/settings?spotify=error&reason=no_code");
      }

      if (!req.session?.clientUserId || !req.session.spotifyOAuthState || req.session.spotifyOAuthState !== state) {
        return res.redirect("/portal/settings?spotify=error&reason=invalid_state");
      }
      delete req.session.spotifyOAuthState;

      const clientId = process.env.SPOTIFY_CLIENT_ID;
      const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        return res.redirect("/portal/settings?spotify=error&reason=not_configured");
      }

      const baseUrl = process.env.REPLIT_DEV_DOMAIN
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : "https://greenelephant.org";
      const redirectUri = `${baseUrl}/api/portal/spotify/callback`;

      const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code as string,
          redirect_uri: redirectUri,
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        console.error("Spotify OAuth token error:", tokenData);
        return res.redirect("/portal/settings?spotify=error&reason=token_failed");
      }

      const profileRes = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      if (!profileRes.ok) {
        console.error("Spotify profile fetch failed:", profileRes.status);
        return res.redirect("/portal/settings?spotify=error&reason=profile_failed");
      }
      const profile = await profileRes.json();
      if (!profile.id) {
        console.error("Spotify profile missing id:", profile);
        return res.redirect("/portal/settings?spotify=error&reason=no_profile_id");
      }

      const userId = req.session.clientUserId;
      await storage.updateClientUser(userId, {
        spotifyId: profile.id,
        spotifyAccessToken: tokenData.access_token,
        spotifyRefreshToken: tokenData.refresh_token || null,
        spotifyTokenExpiry: tokenData.expires_in
          ? new Date(Date.now() + tokenData.expires_in * 1000)
          : null,
      });

      res.redirect("/portal/settings?spotify=connected");
    } catch (error: any) {
      console.error("Spotify OAuth callback error:", error);
      res.redirect("/portal/settings?spotify=error&reason=callback_failed");
    }
  });

  app.post("/api/portal/spotify/disconnect", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      await storage.updateClientUser(req.session.clientUserId, {
        spotifyId: null,
        spotifyAccessToken: null,
        spotifyRefreshToken: null,
        spotifyTokenExpiry: null,
      });
      res.json({ message: "Spotify disconnected" });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to disconnect" });
    }
  });

  app.get("/api/portal/spotify/status", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      const user = await storage.getClientUserById(req.session.clientUserId);
      if (!user) return res.json({ connected: false });
      res.json({
        connected: !!user.spotifyAccessToken,
        spotifyId: user.spotifyId || null,
      });
    } catch {
      res.json({ connected: false });
    }
  });

  app.get("/api/portal/spotify/recent-tracks", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      const user = await storage.getClientUserById(req.session.clientUserId);
      if (!user?.spotifyAccessToken) {
        return res.status(400).json({ message: "Spotify not connected" });
      }

      const refreshSpotifyToken = async (): Promise<string | null> => {
        if (!user.spotifyRefreshToken) return null;
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        if (!clientId || !clientSecret) return null;
        const refreshRes = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: user.spotifyRefreshToken,
          }),
        });
        const refreshData = await refreshRes.json();
        if (!refreshData.access_token) return null;
        const updateFields: any = {
          spotifyAccessToken: refreshData.access_token,
          spotifyTokenExpiry: refreshData.expires_in
            ? new Date(Date.now() + refreshData.expires_in * 1000)
            : null,
        };
        if (refreshData.refresh_token) {
          updateFields.spotifyRefreshToken = refreshData.refresh_token;
        }
        await storage.updateClientUser(req.session.clientUserId, updateFields);
        return refreshData.access_token;
      };

      let accessToken = user.spotifyAccessToken;
      if (user.spotifyTokenExpiry && new Date(user.spotifyTokenExpiry) < new Date()) {
        const newToken = await refreshSpotifyToken();
        if (!newToken) {
          return res.status(401).json({ message: "Spotify token expired. Please reconnect.", reconnectRequired: true });
        }
        accessToken = newToken;
      }

      const limit = Math.min(Number(req.query.limit) || 20, 50);
      let recentRes = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (recentRes.status === 401) {
        const newToken = await refreshSpotifyToken();
        if (!newToken) {
          return res.status(401).json({ message: "Spotify session expired. Please reconnect.", reconnectRequired: true });
        }
        accessToken = newToken;
        recentRes = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }

      if (!recentRes.ok) {
        return res.status(502).json({ message: "Spotify API error. Try again later." });
      }

      const recentData = await recentRes.json();

      if (!recentData.items || !Array.isArray(recentData.items)) {
        return res.json({ tracks: [] });
      }

      const trackIds = recentData.items
        .map((item: any) => item.track?.id)
        .filter(Boolean)
        .filter((id: string, i: number, arr: string[]) => arr.indexOf(id) === i);

      let audioFeatures: Record<string, any> = {};
      if (trackIds.length > 0) {
        const featuresRes = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds.join(",")}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const featuresData = await featuresRes.json();
        if (featuresData.audio_features) {
          for (const f of featuresData.audio_features) {
            if (f) audioFeatures[f.id] = f;
          }
        }
      }

      const tracks = recentData.items.map((item: any) => {
        const track = item.track;
        const features = audioFeatures[track.id] || {};
        return {
          id: track.id,
          name: track.name,
          artist: track.artists?.map((a: any) => a.name).join(", ") || "Unknown",
          album: track.album?.name || "",
          albumArt: track.album?.images?.[0]?.url || null,
          playedAt: item.played_at,
          previewUrl: track.preview_url,
          spotifyUrl: track.external_urls?.spotify || null,
          valence: features.valence ?? null,
          energy: features.energy ?? null,
          danceability: features.danceability ?? null,
          tempo: features.tempo ?? null,
          mode: features.mode ?? null,
          key: features.key ?? null,
        };
      });

      const valences = tracks.filter((t: any) => t.valence !== null).map((t: any) => t.valence);
      const energies = tracks.filter((t: any) => t.energy !== null).map((t: any) => t.energy);
      const avgValence = valences.length > 0 ? valences.reduce((s: number, v: number) => s + v, 0) / valences.length : null;
      const avgEnergy = energies.length > 0 ? energies.reduce((s: number, v: number) => s + v, 0) / energies.length : null;

      const moodLabel = avgValence !== null
        ? avgValence > 0.7 ? "Upbeat & Positive"
          : avgValence > 0.5 ? "Balanced & Reflective"
          : avgValence > 0.3 ? "Introspective & Calm"
          : "Deep & Contemplative"
        : null;

      res.json({
        tracks,
        emotionalLandscape: {
          avgValence: avgValence !== null ? Math.round(avgValence * 100) / 100 : null,
          avgEnergy: avgEnergy !== null ? Math.round(avgEnergy * 100) / 100 : null,
          moodLabel,
          trackCount: tracks.length,
        },
      });
    } catch (error: any) {
      console.error("Spotify recent tracks error:", error);
      res.status(500).json({ message: "Failed to fetch Spotify data" });
    }
  });

  // ─── Oura Ring Integration ───────────────────────────────────────────────

  app.get("/api/portal/oura/connect", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }

    const clientId = process.env.OURA_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({ message: "Oura integration is not configured yet" });
    }

    const baseUrl = process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : "https://greenelephant.org";
    const redirectUri = `${baseUrl}/api/portal/auth/oura/callback`;
    const oauthNonce = randomBytes(24).toString("hex");
    req.session.ouraOAuthState = oauthNonce;

    const scopes = "email personal daily tag workout session spo2 ring_configuration stress heart_health heartrate";
    const authUrl = `https://cloud.ouraring.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=${oauthNonce}`;
    res.redirect(authUrl);
  });

  app.get("/api/portal/auth/oura/callback", async (req, res) => {
    try {
      const { code, state } = req.query;
      if (!code || !state) {
        return res.redirect("/portal/settings?oura=error&reason=no_code");
      }

      if (!req.session?.clientUserId || !req.session.ouraOAuthState || req.session.ouraOAuthState !== state) {
        return res.redirect("/portal/settings?oura=error&reason=invalid_state");
      }
      delete req.session.ouraOAuthState;

      const clientId = process.env.OURA_CLIENT_ID;
      const clientSecret = process.env.OURA_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        return res.redirect("/portal/settings?oura=error&reason=not_configured");
      }

      const baseUrl = process.env.REPLIT_DEV_DOMAIN
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : "https://greenelephant.org";
      const redirectUri = `${baseUrl}/api/portal/auth/oura/callback`;

      const tokenRes = await fetch("https://api.ouraring.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code as string,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        console.error("Oura OAuth token error:", tokenData);
        return res.redirect("/portal/settings?oura=error&reason=token_failed");
      }

      const profileRes = await fetch("https://api.ouraring.com/v2/usercollection/personal_info", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const profile = profileRes.ok ? await profileRes.json() : {};

      const userId = req.session.clientUserId;
      await storage.updateClientUser(userId, {
        ouraId: profile.id || `oura_${userId}`,
        ouraAccessToken: tokenData.access_token,
        ouraRefreshToken: tokenData.refresh_token || null,
        ouraTokenExpiry: tokenData.expires_in
          ? new Date(Date.now() + tokenData.expires_in * 1000)
          : null,
        ouraConsentGrantedAt: new Date(),
      });

      res.redirect("/portal/settings?oura=connected");
    } catch (error: any) {
      console.error("Oura OAuth callback error:", error);
      res.redirect("/portal/settings?oura=error&reason=callback_failed");
    }
  });

  app.post("/api/portal/oura/disconnect", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      await storage.updateClientUser(req.session.clientUserId, {
        ouraId: null,
        ouraAccessToken: null,
        ouraRefreshToken: null,
        ouraTokenExpiry: null,
        ouraConsentGrantedAt: null,
      });
      res.json({ message: "Oura disconnected" });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to disconnect" });
    }
  });

  app.get("/api/portal/oura/status", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      const user = await storage.getClientUserById(req.session.clientUserId);
      if (!user) return res.json({ connected: false });
      res.json({
        connected: !!user.ouraAccessToken,
        ouraId: user.ouraId || null,
        consentGrantedAt: user.ouraConsentGrantedAt || null,
      });
    } catch {
      res.json({ connected: false });
    }
  });

  app.get("/api/portal/oura/daily", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      const user = await storage.getClientUserById(req.session.clientUserId);
      if (!user?.ouraAccessToken) {
        return res.status(400).json({ message: "Oura not connected" });
      }

      const refreshOuraToken = async (): Promise<string | null> => {
        if (!user.ouraRefreshToken) return null;
        const clientId = process.env.OURA_CLIENT_ID;
        const clientSecret = process.env.OURA_CLIENT_SECRET;
        if (!clientId || !clientSecret) return null;
        const refreshRes = await fetch("https://api.ouraring.com/oauth/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: user.ouraRefreshToken,
            client_id: clientId,
            client_secret: clientSecret,
          }),
        });
        const refreshData = await refreshRes.json();
        if (!refreshData.access_token) return null;
        const updateFields: any = {
          ouraAccessToken: refreshData.access_token,
          ouraTokenExpiry: refreshData.expires_in
            ? new Date(Date.now() + refreshData.expires_in * 1000)
            : null,
        };
        if (refreshData.refresh_token) {
          updateFields.ouraRefreshToken = refreshData.refresh_token;
        }
        await storage.updateClientUser(req.session.clientUserId, updateFields);
        return refreshData.access_token;
      };

      let accessToken = user.ouraAccessToken;
      if (user.ouraTokenExpiry && new Date(user.ouraTokenExpiry) < new Date()) {
        const newToken = await refreshOuraToken();
        if (!newToken) {
          return res.status(401).json({ message: "Oura token expired. Please reconnect.", reconnectRequired: true });
        }
        accessToken = newToken;
      }

      const days = Math.min(Number(req.query.days) || 7, 30);
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];

      const fetchOura = async (endpoint: string) => {
        let response = await fetch(
          `https://api.ouraring.com/v2/usercollection/${endpoint}?start_date=${startDate}&end_date=${endDate}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (response.status === 401) {
          const newToken = await refreshOuraToken();
          if (!newToken) return null;
          accessToken = newToken;
          response = await fetch(
            `https://api.ouraring.com/v2/usercollection/${endpoint}?start_date=${startDate}&end_date=${endDate}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
        }
        if (!response.ok) return null;
        return response.json();
      };

      const [readinessData, sleepData, activityData] = await Promise.all([
        fetchOura("daily_readiness"),
        fetchOura("daily_sleep"),
        fetchOura("daily_activity"),
      ]);

      const readiness = (readinessData?.data || []).map((d: any) => ({
        day: d.day,
        score: d.score,
        temperatureDeviation: d.temperature_deviation,
        contributors: d.contributors || {},
      }));

      const sleep = (sleepData?.data || []).map((d: any) => ({
        day: d.day,
        score: d.score,
        totalSleepDuration: d.contributors?.total_sleep,
        deepSleepDuration: d.contributors?.deep_sleep,
        remSleepDuration: d.contributors?.rem_sleep,
        efficiency: d.contributors?.efficiency,
        restfulness: d.contributors?.restfulness,
      }));

      const activity = (activityData?.data || []).map((d: any) => ({
        day: d.day,
        score: d.score,
        activeCalories: d.active_calories,
        steps: d.steps,
        totalCalories: d.total_calories,
        contributors: d.contributors || {},
      }));

      const avgReadiness = readiness.length > 0
        ? Math.round(readiness.reduce((s: number, r: any) => s + (r.score || 0), 0) / readiness.length)
        : null;
      const avgSleep = sleep.length > 0
        ? Math.round(sleep.reduce((s: number, r: any) => s + (r.score || 0), 0) / sleep.length)
        : null;
      const avgActivity = activity.length > 0
        ? Math.round(activity.reduce((s: number, r: any) => s + (r.score || 0), 0) / activity.length)
        : null;

      res.json({
        readiness,
        sleep,
        activity,
        summary: {
          avgReadiness,
          avgSleep,
          avgActivity,
          days,
          startDate,
          endDate,
        },
      });
    } catch (error: any) {
      console.error("Oura daily data error:", error);
      res.status(502).json({ message: "Failed to fetch Oura data. Try again later." });
    }
  });

  // ─── End Oura ──────────────────────────────────────────────────────────

  app.get("/api/portal/settings/public", async (_req, res) => {
    try {
      const lifetimeCutoff = await storage.getAdminSetting("lifetime_cutoff_date");
      const subscriptionEnabled = await storage.getAdminSetting("subscription_enabled");
      const subscriptionPrice = await storage.getAdminSetting("subscription_price_monthly");
      const linkedinEnabled = await storage.getAdminSetting("linkedin_oauth_enabled");
      const portalLoginEnabled = await storage.getAdminSetting("portal_login_enabled");
      const saasEnabled = await storage.getAdminSetting("saas_enabled");
      const subFeatures = await storage.getAdminSetting("saas_subscription_features");
      const scanFeatures = await storage.getAdminSetting("saas_scan_features");
      const journeyFeatures = await storage.getAdminSetting("saas_journey_features");

      res.json({
        lifetimeCutoffDate: lifetimeCutoff || "2026-08-31",
        subscriptionEnabled: subscriptionEnabled === "true",
        subscriptionPriceMonthly: subscriptionPrice || "9.95",
        linkedinLoginEnabled: linkedinEnabled !== "false" && !!process.env.LINKEDIN_CLIENT_ID && !!process.env.LINKEDIN_CLIENT_SECRET,
        googleLoginEnabled: !!process.env.GOOGLE_CLIENT_ID,
        portalLoginEnabled: portalLoginEnabled !== "false",
        saasEnabled: saasEnabled === "true",
        subscriptionFeatures: subFeatures ? JSON.parse(subFeatures) : null,
        oneTimeScanFeatures: scanFeatures ? JSON.parse(scanFeatures) : null,
        coachingJourneyFeatures: journeyFeatures ? JSON.parse(journeyFeatures) : null,
      });
    } catch {
      res.json({
        lifetimeCutoffDate: "2026-08-31",
        subscriptionEnabled: true,
        subscriptionPriceMonthly: "9.95",
        linkedinLoginEnabled: !!process.env.LINKEDIN_CLIENT_ID && !!process.env.LINKEDIN_CLIENT_SECRET,
        googleLoginEnabled: !!process.env.GOOGLE_CLIENT_ID,
        portalLoginEnabled: true,
        saasEnabled: false,
        subscriptionFeatures: null,
        oneTimeScanFeatures: null,
        coachingJourneyFeatures: null,
      });
    }
  });
}
