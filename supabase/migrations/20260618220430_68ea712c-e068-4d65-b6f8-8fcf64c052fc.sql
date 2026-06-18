
CREATE TABLE public.social_posts_cache (
  id text PRIMARY KEY,
  source text NOT NULL CHECK (source IN ('ig','fb')),
  image text,
  caption text NOT NULL DEFAULT '',
  permalink text NOT NULL,
  timestamp timestamptz NOT NULL,
  likes integer,
  comments integer,
  raw jsonb,
  fetched_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.social_posts_cache TO anon, authenticated;
GRANT ALL ON public.social_posts_cache TO service_role;

ALTER TABLE public.social_posts_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read social posts"
  ON public.social_posts_cache
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX social_posts_cache_timestamp_idx
  ON public.social_posts_cache (timestamp DESC);
