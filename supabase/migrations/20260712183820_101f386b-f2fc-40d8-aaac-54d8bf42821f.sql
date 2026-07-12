CREATE TABLE public.content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  key text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('slot','section')),
  title_no text,
  title_en text,
  body_md_no text NOT NULL DEFAULT '',
  body_md_en text,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX content_blocks_slot_unique
  ON public.content_blocks (page, key)
  WHERE kind = 'slot';

CREATE INDEX content_blocks_page_kind_idx
  ON public.content_blocks (page, kind, sort_order);

GRANT SELECT ON public.content_blocks TO anon, authenticated;
GRANT ALL ON public.content_blocks TO service_role;

ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visible content blocks"
  ON public.content_blocks
  FOR SELECT
  TO anon, authenticated
  USING (visible = true);

-- Writes are performed by the content-admin edge function using the service role;
-- no client-side write policies.

CREATE OR REPLACE FUNCTION public.content_blocks_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER content_blocks_set_updated_at
  BEFORE UPDATE ON public.content_blocks
  FOR EACH ROW
  EXECUTE FUNCTION public.content_blocks_set_updated_at();
