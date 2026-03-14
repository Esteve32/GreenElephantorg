export interface PortalUser {
  name: string;
  email: string;
  avatarUrl?: string;
  hasLinkedIn?: boolean;
  hasGoogle?: boolean;
}

export interface PortalSubscription {
  plan: string;
  status: string;
}

export interface PortalMeResponse {
  authenticated: boolean;
  user?: PortalUser;
  subscription?: PortalSubscription;
}

export interface NotionStatusResponse {
  connected: boolean;
  workspaceName?: string;
  workspaceId?: string;
}
