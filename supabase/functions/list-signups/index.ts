import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

// Constant-time string equality (length leak is acceptable here).
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

const TOKEN_TTL_SECONDS = 60 * 60; // 1 hour

function b64url(bytes: Uint8Array): string {
  let s = btoa(String.fromCharCode(...bytes));
  return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmacSha256(key: string, msg: string): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(msg));
  return new Uint8Array(sig);
}

async function issueToken(secret: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
  const payload = String(exp);
  const sig = b64url(await hmacSha256(secret, payload));
  return `${payload}.${sig}`;
}

async function verifyToken(token: unknown, secret: string): Promise<boolean> {
  if (typeof token !== "string") return false;
  const idx = token.indexOf(".");
  if (idx <= 0) return false;
  const payload = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const exp = Number(payload);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  const expected = b64url(await hmacSha256(secret, payload));
  if (expected.length !== sig.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return mismatch === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { password, token, action, id, coach_notes } = body ?? {};
    const expected = Deno.env.get("ADMIN_PASSWORD");
    if (!expected) {
      console.error("list-signups: ADMIN_PASSWORD not configured");
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const passwordOk =
      typeof password === "string" && password.length > 0 && safeEqual(password, expected);
    const tokenOk = !passwordOk && (await verifyToken(token, expected));
    if (!passwordOk && !tokenOk) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (action === "verify") {
      const newToken = await issueToken(expected);
      return new Response(JSON.stringify({ ok: true, token: newToken }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete") {
      if (typeof id !== "string") {
        return new Response(JSON.stringify({ error: "invalid id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error } = await supabase.from("training_signups").delete().eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update_notes") {
      if (typeof id !== "string") {
        return new Response(JSON.stringify({ error: "invalid id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const notes =
        typeof coach_notes === "string" ? coach_notes.slice(0, 4000) : null;
      const { error } = await supabase
        .from("training_signups")
        .update({ coach_notes: notes })
        .eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabase
      .from("training_signups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify({ signups: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("list-signups error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});