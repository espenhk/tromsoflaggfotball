
CREATE TABLE public.ig_post_exports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'export',
  slide_count INTEGER NOT NULL DEFAULT 0,
  payload JSONB NOT NULL,
  photos_dropped BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.ig_post_exports TO service_role;

ALTER TABLE public.ig_post_exports ENABLE ROW LEVEL SECURITY;

-- No policies for anon/authenticated: this table is only accessed via the
-- admin-authenticated `ig-exports` edge function using the service role key.

CREATE INDEX ig_post_exports_created_at_idx ON public.ig_post_exports (created_at DESC);

CREATE OR REPLACE FUNCTION public.ig_post_exports_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER ig_post_exports_updated_at
  BEFORE UPDATE ON public.ig_post_exports
  FOR EACH ROW EXECUTE FUNCTION public.ig_post_exports_set_updated_at();
