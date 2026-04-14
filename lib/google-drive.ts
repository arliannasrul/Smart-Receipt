import { google } from "googleapis";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "./session";

export const getOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
};

export const getDriveClient = async () => {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  
  if (!session.tokens) {
    throw new Error("Unauthorized: No tokens found");
  }

  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials(session.tokens);

  return google.drive({ version: "v3", auth: oauth2Client });
};
