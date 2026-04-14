import { SessionOptions } from "iron-session";

export interface SessionData {
  tokens?: {
    access_token?: string;
    refresh_token?: string;
    scope?: string;
    token_type?: string;
    expiry_date?: number;
  };
  user?: {
    name?: string;
    picture?: string;
    email?: string;
  };
  isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long",
  cookieName: "smart_receipt_session",
  cookieOptions: {
    secure: process.env.NODE_VERSION === "production",
  },
};
