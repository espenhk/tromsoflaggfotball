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

const BUILTIN_PAGES = new Set(["home", "presse", "quiz", "posisjoner"]);
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,59}$/;
/** Built-in page key, or "custom:<slug>" for an admin-created page. */
function isValidPage(p: string): boolean {
  if (BUILTIN_PAGES.has(p)) return true;
  return p.startsWith("custom:") && SLUG_RE.test(p.slice("custom:".length));
}

type BlockInput = {
  id?: string;
  page?: string;
  key?: string;
  kind?: "slot" | "section";
  title_no?: string | null;
  title_en?: string | null;
  body_md_no?: string;
  body_md_en?: string | null;
  sort_order?: number;
  visible?: boolean;
  variant?: string;
  data?: Record<string, unknown> | null;
};

function clampStr(v: unknown, max: number): string | null {
  if (v == null) return null;
  if (typeof v !== "string") return null;
  return v.slice(0, max);
}

function sanitize(input: BlockInput): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (input.page !== undefined) {
    if (!isValidPage(String(input.page))) throw new Error("invalid page");
    out.page = input.page;
  }
  if (input.key !== undefined) {
    const k = clampStr(input.key, 120);
    if (!k) throw new Error("invalid key");
    out.key = k;
  }
  if (input.kind !== undefined) {
    if (input.kind !== "slot" && input.kind !== "section") throw new Error("invalid kind");
    out.kind = input.kind;
  }
  if (input.title_no !== undefined) out.title_no = clampStr(input.title_no, 200);
  if (input.title_en !== undefined) out.title_en = clampStr(input.title_en, 200);
  if (input.body_md_no !== undefined) out.body_md_no = clampStr(input.body_md_no, 20000) ?? "";
  if (input.body_md_en !== undefined) out.body_md_en = clampStr(input.body_md_en, 20000);
  if (input.sort_order !== undefined) {
    const n = Number(input.sort_order);
    if (!Number.isFinite(n)) throw new Error("invalid sort_order");
    out.sort_order = Math.trunc(n);
  }
  if (input.visible !== undefined) out.visible = !!input.visible;
  if (input.variant !== undefined) {
    const v = clampStr(input.variant, 60);
    if (v) out.variant = v;
  }
  if (input.data !== undefined) {
    // Accept any JSON-serialisable object; drop non-objects for safety.
    if (input.data && typeof input.data === "object" && !Array.isArray(input.data)) {
      out.data = input.data;
    } else {
      out.data = {};
    }
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
      const page = typeof body.page === "string" ? body.page : null;
      let q = supabase.from("content_blocks").select("*")
        .order("page").order("kind").order("sort_order").order("key");
      if (page && isValidPage(page)) q = q.eq("page", page);
      const { data, error } = await q;
      if (error) throw error;
      return new Response(JSON.stringify({ blocks: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- Custom pages (served at /pages/<slug>) ----
    if (action === "pages") {
      const { data, error } = await supabase.from("cms_pages").select("*").order("title_no");
      if (error) throw error;
      return new Response(JSON.stringify({ pages: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "page-upsert") {
      const p = (body.page ?? {}) as {
        slug?: string; title_no?: string; title_en?: string | null; visible?: boolean;
      };
      const slug = String(p.slug ?? "").trim();
      const title = clampStr(p.title_no, 120)?.trim();
      if (!SLUG_RE.test(slug) || !title) {
        return new Response(JSON.stringify({ error: "invalid page" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const row = {
        slug,
        title_no: title,
        title_en: clampStr(p.title_en, 120),
        visible: p.visible === undefined ? true : !!p.visible,
      };
      const { data, error } = await supabase.from("cms_pages")
        .upsert(row, { onConflict: "slug" }).select().single();
      if (error) throw error;
      return new Response(JSON.stringify({ page: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "page-delete") {
      const slug = String(body.slug ?? "");
      if (!SLUG_RE.test(slug)) {
        return new Response(JSON.stringify({ error: "invalid slug" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error: be } = await supabase.from("content_blocks")
        .delete().eq("page", `custom:${slug}`);
      if (be) throw be;
      const { error } = await supabase.from("cms_pages").delete().eq("slug", slug);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "upsert") {
      const b = sanitize(body.block ?? {});
      if (!b.page || !b.key || !b.kind) {
        return new Response(JSON.stringify({ error: "missing fields" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (body.id) {
        const { data, error } = await supabase.from("content_blocks")
          .update(b).eq("id", body.id).select().single();
        if (error) throw error;
        return new Response(JSON.stringify({ block: data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Slot rows are unique per (page, key), but the uniqueness is enforced by
      // a *partial* index (kind = 'slot'), which ON CONFLICT can't target.
      // Do the upsert manually: look for an existing slot row first.
      if (b.kind === "slot") {
        const { data: existing, error: findError } = await supabase
          .from("content_blocks")
          .select("id")
          .eq("page", b.page)
          .eq("key", b.key)
          .eq("kind", "slot")
          .maybeSingle();
        if (findError) throw findError;
        const q = existing
          ? supabase.from("content_blocks").update(b as any).eq("id", (existing as { id: string }).id)
          : supabase.from("content_blocks").insert(b as any);
        const { data, error } = await q.select().single();
        if (error) throw error;
        return new Response(JSON.stringify({ block: data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data, error } = await supabase.from("content_blocks")
        .insert(b as any).select().single();
      if (error) throw error;
      return new Response(JSON.stringify({ block: data }), {
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
      const { error } = await supabase.from("content_blocks").delete().eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "reorder") {
      const items = Array.isArray(body.order) ? body.order : [];
      const updates = items
        .map((it: unknown) => {
          const rec = it as { id?: string; sort_order?: number };
          const n = Number(rec?.sort_order);
          return typeof rec?.id === "string" && Number.isFinite(n)
            ? { id: rec.id, sort_order: Math.trunc(n) }
            : null;
        })
        .filter(Boolean) as { id: string; sort_order: number }[];
      for (const u of updates) {
        const { error } = await supabase.from("content_blocks")
          .update({ sort_order: u.sort_order }).eq("id", u.id);
        if (error) throw error;
      }
      return new Response(JSON.stringify({ ok: true, updated: updates.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("content-admin error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message || "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});