
import { supabase } from "@/integrations/supabase/client";

/**
 * Call the Supabase edge function to email the current user's metrics report.
 */
export async function emailMyMetrics() {
  // Always fetch latest session to get a valid access token
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) {
    throw new Error("You must be logged in to send email metrics.");
  }

  const res = await fetch(
    "https://kibehsulqgjfwbalhtgj.functions.supabase.co/email-metrics",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // no body needed for now
    }
  );

  if (!res.ok) {
    let data: any = {};
    try {
      data = await res.json();
    } catch {
      // ignore json parse error
    }
    throw new Error(data?.error || "Failed to send metrics email");
  }
  return await res.json();
}
