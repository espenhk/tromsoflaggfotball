import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let m = 0;
  for (let i = 0; i < a.length; i++) m |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return m === 0;
}

function b64url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(key: string, msg: string): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const ck = await crypto.subtle.importKey(
    "raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", ck, enc.encode(msg)));
}

async function verifyToken(token: unknown, secret: string): Promise<boolean> {
  if (typeof token !== "string") return false;
  const idx = token.indexOf(".");
  if (idx <= 0) return false;
  const payload = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const exp = Number(payload);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  const expected = b64url(await hmac(secret, payload));
  return expected.length === sig.length && safeEqual(expected, sig);
}

type MatchInput = {
  id?: string;
  kicks_off_at?: string;
  venue?: string | null;
  round_label?: string | null;
  notes?: string | null;
  home_name?: string;
  home_tag?: string | null;
  home_logo?: string | null;
  home_color?: string | null;
  home_score?: number | null;
  away_name?: string;
  away_tag?: string | null;
  away_logo?: string | null;
  away_color?: string | null;
  away_score?: number | null;
};

const MATCH_FIELDS = [
  "kicks_off_at", "venue", "round_label", "notes",
  "home_name", "home_tag", "home_logo", "home_color", "home_score",
  "away_name", "away_tag", "away_logo", "away_color", "away_score",
] as const;

function sanitizeMatch(m: MatchInput): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of MATCH_FIELDS) {
    if (m[f] === undefined) continue;
    const v = m[f];
    if (typeof v === "string") out[f] = v.slice(0, 500);
    else out[f] = v;
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const { token, action } = body ?? {};
    const expected = Deno.env.get("ADMIN_PASSWORD");
    if (!expected) {
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!(await verifyToken(token, expected))) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (action === "list" || !action) {
      const { data, error } = await supabase
        .from("matches").select("*")
        .order("kicks_off_at", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify({ matches: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "create") {
      const m = sanitizeMatch(body.match ?? {});
      if (!m.home_name || !m.away_name || !m.kicks_off_at) {
        return new Response(JSON.stringify({ error: "missing fields" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data, error } = await supabase.from("matches").insert(m).select().single();
      if (error) throw error;
      return new Response(JSON.stringify({ match: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update") {
      const id = body.id;
      if (typeof id !== "string") {
        return new Response(JSON.stringify({ error: "invalid id" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const m = sanitizeMatch(body.match ?? {});
      const { data, error } = await supabase
        .from("matches").update(m).eq("id", id).select().single();
      if (error) throw error;
      return new Response(JSON.stringify({ match: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete") {
      const id = body.id;
      if (typeof id !== "string") {
        return new Response(JSON.stringify({ error: "invalid id" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error } = await supabase.from("matches").delete().eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("matches-admin error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});