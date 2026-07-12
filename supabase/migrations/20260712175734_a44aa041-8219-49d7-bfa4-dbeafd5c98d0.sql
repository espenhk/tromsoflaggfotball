
CREATE TABLE public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kicks_off_at timestamptz NOT NULL,
  venue text,
  round_label text,
  notes text,
  home_name text NOT NULL,
  home_tag text,
  home_logo text,
  home_color text,
  home_score integer,
  away_name text NOT NULL,
  away_tag text,
  away_logo text,
  away_color text,
  away_score integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.matches TO anon, authenticated;
GRANT ALL ON public.matches TO service_role;

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read matches"
  ON public.matches FOR SELECT
  USING (true);

CREATE OR REPLACE FUNCTION public.matches_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.matches_set_updated_at();

ALTER TABLE public.ig_post_exports ADD COLUMN IF NOT EXISTS caption text;
