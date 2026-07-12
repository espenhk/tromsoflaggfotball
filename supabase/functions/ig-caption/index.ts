// Generates a natural-sounding Norwegian Instagram caption body from the
// currently-loaded slides in the IG editor. Called from the caption preview
// popup — see public/make-ig-post/editor.html. The client falls back to its
// local caption builder if this returns non-2xx, so failure here just means
// "no AI polish this time", never a broken export flow.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { rawBody } = await req.json().catch(() => ({}));
    const draft = typeof rawBody === "string" ? rawBody.slice(0, 6000).trim() : "";
    if (!draft) {
      return new Response(JSON.stringify({ error: "empty draft" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const system = [
      "Du skriver Instagram-bildetekster på norsk (bokmål) for Tromsø Flaggfotball, en lokal flaggfotball-klubb.",
      "Tonen skal være positiv og profesjonell — varm og entusiastisk, men ikke overdreven, uten klisjéer, ropemerker eller emoji-spam.",
      "Skriv ÉN kort bildetekst — maks ett avsnitt på inntil 4 korte setninger. Ikke bruk linjeskift inne i avsnittet.",
      "Hold deg strengt til fakta i utkastet. Ikke finn på noe, ikke gjett, ikke fyll på med generiske fraser som «det blir alltid spennende når disse to møtes», «en kamp du ikke vil gå glipp av», «forventer en jevn kamp», forhåndsomtaler av stemning, historikk, rivalisering, form, vær eller resultat. Hvis noe ikke står i utkastet, la det være.",
      "Behold navn, tall, datoer, klokkeslett og steder nøyaktig som de er.",
      "Ikke lag hashtags eller tagger — de legges til separat etterpå.",
      "Ikke skriv «Slide 1:», «Slide 2:» osv. Bind slidene sammen til én naturlig tekst.",
      "Ikke inkluder foto-credit-linjer (📸 …) — de legges til separat.",
      "Returner kun bildeteksten, uten forklaring før eller etter.",
    ].join("\n");

    const resp = await fetch(LOVABLE_AI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: system },
          { role: "user", content: `Utkast fra slidene:\n\n${draft}` },
        ],
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error(`ig-caption gateway ${resp.status}: ${text}`);
      return new Response(JSON.stringify({ error: "AI request failed", status: resp.status }), {
        status: resp.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const json = await resp.json();
    const body = (json?.choices?.[0]?.message?.content ?? "").trim();
    if (!body) {
      return new Response(JSON.stringify({ error: "empty response" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ body }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ig-caption error:", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});