import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Fan-out helper: given a signup payload, look up every active admin
// recipient in `admin_notification_recipients` and dispatch the existing
// `training-signup-notification` transactional-email template to each one.
// Called from the public sign-up form, so it must be unauthenticated on the
// edge but only *reads* the recipient list via the service role.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json().catch(() => ({}));
    const { signupId, name, contact, ageGroup, preferredDate, message, language } = payload ?? {};
    if (typeof name !== "string" || typeof contact !== "string") {
      return new Response(JSON.stringify({ error: "invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: recipients, error: recErr } = await supabase
      .from("admin_notification_recipients")
      .select("id, email")
      .eq("active", true);
    if (recErr) throw recErr;
    if (!recipients?.length) {
      return new Response(JSON.stringify({ ok: true, sent: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results = await Promise.allSettled(
      recipients.map((r) =>
        supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "training-signup-notification",
            recipientEmail: r.email,
            idempotencyKey: `training-signup-${signupId ?? Date.now()}-${r.id}`,
            templateData: {
              name,
              contact,
              ageGroup: ageGroup ?? null,
              preferredDate: preferredDate ?? null,
              message: message ?? null,
              language: language ?? "no",
            },
          },
        }),
      ),
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - sent;
    if (failed) console.warn(`notify-training-signup: ${failed} deliveries failed`);

    return new Response(JSON.stringify({ ok: true, sent, failed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("notify-training-signup error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});