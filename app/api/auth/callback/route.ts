import { getOAuth2Client } from "@/lib/google-drive";
import { sessionOptions, SessionData } from "@/lib/session";
import { google } from "googleapis";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch user profile info
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    session.tokens = {
      access_token: tokens.access_token || undefined,
      refresh_token: tokens.refresh_token || undefined,
      scope: tokens.scope || undefined,
      token_type: tokens.token_type || undefined,
      expiry_date: tokens.expiry_date || undefined,
    };
    session.user = {
      name: userInfo.data.name || undefined,
      picture: userInfo.data.picture || undefined,
      email: userInfo.data.email || undefined,
    };
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.redirect(new URL("/", req.url));
  } catch (error) {
    console.error("Error retrieving tokens or user info:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
