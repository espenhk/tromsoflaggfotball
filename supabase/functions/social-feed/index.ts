import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const META_TOKEN = Deno.env.get("META_PAGE_ACCESS_TOKEN");
const IG_USER_ID = Deno.env.get("META_IG_USER_ID");
const FB_PAGE_ID = Deno.env.get("META_FB_PAGE_ID");

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 min

type Post = {
  id: string;
  source: "ig" | "fb";
  image: string | null;
  caption: string;
  permalink: string;
  timestamp: string;
  likes: number | null;
  comments: number | null;
};

async function fetchInstagram(): Promise<Post[]> {
  if (!META_TOKEN || !IG_USER_ID) return [];
  const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count";
  const url = `https://graph.facebook.com/v21.0/${IG_USER_ID}/media?fields=${fields}&limit=24&access_token=${META_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error("IG fetch failed", res.status, await res.text());
    return [];
  }
  const json = await res.json();
  return (json.data || []).map((m: any) => ({
    id: `ig_${m.id}`,
    source: "ig" as const,
    image: m.media_type === "VIDEO" ? (m.thumbnail_url ?? null) : (m.media_url ?? null),
    caption: m.caption ?? "",
    permalink: m.permalink,
    timestamp: m.timestamp,
    likes: m.like_count ?? null,
    comments: m.comments_count ?? null,
  }));
}

async function fetchFacebook(): Promise<Post[]> {
  if (!META_TOKEN || !FB_PAGE_ID) return [];
  const fields =
    "id,message,full_picture,permalink_url,created_time,reactions.summary(total_count),comments.summary(total_count)";
  const url = `https://graph.facebook.com/v21.0/${FB_PAGE_ID}/posts?fields=${fields}&limit=24&access_token=${META_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error("FB fetch failed", res.status, await res.text());
    return [];
  }
  const json = await res.json();
  return (json.data || [])
    .filter((p: any) => p.full_picture)
    .map((p: any) => ({
      id: `fb_${p.id}`,
      source: "fb" as const,
      image: p.full_picture ?? null,
      caption: p.message ?? "",
      permalink: p.permalink_url,
      timestamp: p.created_time,
      likes: p.reactions?.summary?.total_count ?? null,
      comments: p.comments?.summary?.total_count ?? null,
    }));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
  const url = new URL(req.url);
  const force = url.searchParams.get("refresh") === "1";

  try {
    // Check cache freshness
    const { data: latest } = await supabase
      .from("social_posts_cache")
      .select("fetched_at")
      .order("fetched_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const stale =
      !latest || Date.now() - new Date(latest.fetched_at).getTime() > CACHE_TTL_MS;

    if ((stale || force) && META_TOKEN) {
      const [ig, fb] = await Promise.all([fetchInstagram(), fetchFacebook()]);
      const all = [...ig, ...fb];
      if (all.length > 0) {
        const rows = all.map((p) => ({ ...p, fetched_at: new Date().toISOString() }));
        const { error: upsertErr } = await supabase
          .from("social_posts_cache")
          .upsert(rows, { onConflict: "id" });
        if (upsertErr) console.error("Upsert failed", upsertErr);
      }
    }

    const { data: posts, error } = await supabase
      .from("social_posts_cache")
      .select("id,source,image,caption,permalink,timestamp,likes,comments")
      .order("timestamp", { ascending: false })
      .limit(24);

    if (error) throw error;

    return new Response(
      JSON.stringify({
        posts: posts ?? [],
        configured: Boolean(META_TOKEN && (IG_USER_ID || FB_PAGE_ID)),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e), posts: [] }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});