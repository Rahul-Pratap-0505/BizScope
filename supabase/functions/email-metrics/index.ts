
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.5";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401,
        headers: corsHeaders,
      });
    }
    const jwt = authHeader.replace("Bearer ", "");
    // Get user session from JWT
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(jwt);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // Fetch this user's latest metrics (from kpi_metrics)
    const { data: metrics, error: metricsError } = await supabase
      .from("kpi_metrics")
      .select("type,display_value,value,subtitle,delta_display,delta_type")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    if (metricsError) {
      return new Response(JSON.stringify({ error: metricsError.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }
    if (!metrics || metrics.length === 0) {
      return new Response(
        JSON.stringify({ error: "No metrics found for user." }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Format metrics summary for email
    const rows = metrics
      .map(
        (m) =>
          `<tr>
            <td style="padding:8px 12px">${escape(m.type)}</td>
            <td style="padding:8px 12px">${escape(
              m.display_value || m.value
            )}</td>
            <td style="padding:8px 12px">${escape(m.subtitle ?? "")}</td>
            <td style="padding:8px 12px">${escape(m.delta_display ?? "")}  ${
            m.delta_type === "increase"
              ? "▲"
              : m.delta_type === "decrease"
              ? "▼"
              : ""
          }</td>
          </tr>`
      )
      .join("");
    const htmlTable = `
      <h2>Your BizScope KPI Metrics Report</h2>
      <table style="border-collapse: collapse; border: 1px solid #ccc;">
        <thead>
          <tr>
            <th style="padding:8px 12px; text-align:left; background:#f3f3f3; border-bottom:1px solid #ccc;">Metric</th>
            <th style="padding:8px 12px; text-align:left; background:#f3f3f3; border-bottom:1px solid #ccc;">Value</th>
            <th style="padding:8px 12px; text-align:left; background:#f3f3f3; border-bottom:1px solid #ccc;">Subtitle</th>
            <th style="padding:8px 12px; text-align:left; background:#f3f3f3; border-bottom:1px solid #ccc;">Delta</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <p>Sent via <a href="https://bizscope.lovable.app">BizScope</a></p>
    `;

    // Send the email using Resend
    const emailResponse = await resend.emails.send({
      from: "BizScope <onboarding@resend.dev>",
      to: [user.email],
      subject: "Your BizScope KPI Metrics Report",
      html: htmlTable,
    });

    return new Response(
      JSON.stringify({ status: "ok", emailResponse }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (e) {
    console.error("Error in email-metrics edge function:", e);
    return new Response(
      JSON.stringify({ error: e?.message || String(e) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});

function escape(str: any) {
  // Escape html
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
