import { Request } from 'express';

export interface JWT {
  user: string;
  iat: number;
  exp: number;
}

export interface ValidatedRequest extends Request {
  userId: string;
}

export interface DiscordRefresh {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}
