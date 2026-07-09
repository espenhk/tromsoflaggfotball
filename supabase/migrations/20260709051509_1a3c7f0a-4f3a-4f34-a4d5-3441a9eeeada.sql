
CREATE OR REPLACE FUNCTION public.ig_post_extract_templates(p jsonb)
RETURNS text[]
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT COALESCE(array_agg(DISTINCT t), ARRAY[]::text[])
  FROM jsonb_array_elements(COALESCE(p->'slides', '[]'::jsonb)) s
  CROSS JOIN LATERAL (SELECT s->>'template' AS t) x
  WHERE t IS NOT NULL AND t <> '';
$$;

ALTER TABLE public.ig_post_exports
  ADD COLUMN IF NOT EXISTS templates text[]
  GENERATED ALWAYS AS (public.ig_post_extract_templates(payload)) STORED;
