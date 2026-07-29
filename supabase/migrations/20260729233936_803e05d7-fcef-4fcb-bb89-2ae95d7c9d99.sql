CREATE TABLE public.cms_pages (
  slug text PRIMARY KEY,
  title_no text NOT NULL,
  title_en text,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.cms_pages TO anon, authenticated;
GRANT ALL ON public.cms_pages TO service_role;

ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visible custom pages"
ON public.cms_pages FOR SELECT
TO anon, authenticated
USING (visible = true);

CREATE OR REPLACE FUNCTION public.cms_pages_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER cms_pages_updated_at
BEFORE UPDATE ON public.cms_pages
FOR EACH ROW EXECUTE FUNCTION public.cms_pages_set_updated_at();