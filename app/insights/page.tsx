import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import { getReceiptData } from "@/app/actions/receipts";
import InsightsClient from "@/components/InsightsClient";
import { redirect } from "next/navigation";

export default async function InsightsPage() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  
  if (!session.isLoggedIn) {
    redirect("/");
  }

  const receipts = await getReceiptData();

  return <InsightsClient receipts={receipts} user={session.user} />;
}
