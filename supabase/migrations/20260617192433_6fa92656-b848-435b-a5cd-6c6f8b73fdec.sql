CREATE TABLE public.site_settings (
  id text PRIMARY KEY,
  theme text NOT NULL DEFAULT 'default',
  reveal_mode boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO public.site_settings (id, theme, reveal_mode)
VALUES ('global', 'default', false)
ON CONFLICT (id) DO NOTHING;

ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
ALTER TABLE public.site_settings REPLICA IDENTITY FULL;