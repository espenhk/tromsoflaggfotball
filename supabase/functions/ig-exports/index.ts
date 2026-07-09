import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

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

function b64url(bytes: Uint8Array): string {
  let s = btoa(String.fromCharCode(...bytes));
  return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
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

const MAX_PAYLOAD_BYTES = 8 * 1024 * 1024; // 8 MB cap per entry

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const { token, action } = body ?? {};
    const expected = Deno.env.get("ADMIN_PASSWORD");
    if (!expected) {
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!(await verifyToken(token, expected))) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (action === "list") {
      // List without the payload (could be huge); fetch payload on demand.
      const { data, error } = await supabase
        .from("ig_post_exports")
        .select("id, name, kind, slide_count, photos_dropped, created_at, updated_at, templates, payload->aspect")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return new Response(JSON.stringify({ entries: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "get") {
      const { id } = body;
      if (typeof id !== "string") {
        return new Response(JSON.stringify({ error: "invalid id" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data, error } = await supabase
        .from("ig_post_exports")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        return new Response(JSON.stringify({ error: "not_found" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ entry: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "save") {
      const { name, kind, slide_count, payload, photos_dropped } = body;
      if (typeof name !== "string" || !name.trim() || !payload || typeof payload !== "object") {
        return new Response(JSON.stringify({ error: "invalid input" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const size = new TextEncoder().encode(JSON.stringify(payload)).length;
      if (size > MAX_PAYLOAD_BYTES) {
        return new Response(JSON.stringify({ error: "payload_too_large", size, max: MAX_PAYLOAD_BYTES }), {
          status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data, error } = await supabase
        .from("ig_post_exports")
        .insert({
          name: name.trim().slice(0, 200),
          kind: (typeof kind === "string" ? kind : "export").slice(0, 40),
          slide_count: Number.isFinite(slide_count) ? Number(slide_count) : 0,
          payload,
          photos_dropped: !!photos_dropped,
        })
        .select("id")
        .single();
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true, id: data.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "rename") {
      const { id, name } = body;
      if (typeof id !== "string" || typeof name !== "string" || !name.trim()) {
        return new Response(JSON.stringify({ error: "invalid input" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error } = await supabase
        .from("ig_post_exports")
        .update({ name: name.trim().slice(0, 200) })
        .eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete") {
      const { id } = body;
      if (typeof id !== "string") {
        return new Response(JSON.stringify({ error: "invalid id" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error } = await supabase.from("ig_post_exports").delete().eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "clear") {
      const { error } = await supabase
        .from("ig_post_exports")
        .delete()
        .gte("created_at", "1970-01-01");
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ig-exports error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});