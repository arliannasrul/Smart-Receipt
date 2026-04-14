import { getOAuth2Client } from "@/lib/google-drive";
import { NextResponse } from "next/server";

export async function GET() {
  const oauth2Client = getOAuth2Client();
  const SCOPES = [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  return NextResponse.redirect(authUrl);
}
