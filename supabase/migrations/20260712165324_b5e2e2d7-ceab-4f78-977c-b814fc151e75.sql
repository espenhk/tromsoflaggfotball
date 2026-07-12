
CREATE TABLE IF NOT EXISTS public.admin_notification_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS admin_notification_recipients_email_key
  ON public.admin_notification_recipients (lower(email));

GRANT ALL ON public.admin_notification_recipients TO service_role;

ALTER TABLE public.admin_notification_recipients ENABLE ROW LEVEL SECURITY;

-- No public policies. All access is via edge functions using the service role.

INSERT INTO public.admin_notification_recipients (email)
VALUES ('espenhkristensen@gmail.com')
ON CONFLICT DO NOTHING;
