CREATE OR REPLACE FUNCTION public.ig_post_extract_templates(p jsonb)
RETURNS text[]
LANGUAGE sql
IMMUTABLE
SET search_path TO 'public', 'pg_temp'
AS $$
  SELECT COALESCE(array_agg(DISTINCT t), ARRAY[]::text[])
  FROM jsonb_array_elements(COALESCE(p->'slides', '[]'::jsonb)) s
  CROSS JOIN LATERAL (
    SELECT COALESCE(s->>'template', s->>'tpl', s->>'type') AS t
  ) x
  WHERE t IS NOT NULL AND t <> '';
$$;

-- Force regeneration of the stored generated column values by touching updated_at.
UPDATE public.ig_post_exports SET updated_at = updated_at;