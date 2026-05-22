CREATE TABLE public.training_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  age_group TEXT,
  message TEXT,
  preferred_date TEXT,
  language TEXT NOT NULL DEFAULT 'no',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.training_signups ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors) can submit a sign-up
CREATE POLICY "Anyone can submit a sign-up"
ON public.training_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(name)) BETWEEN 1 AND 100
  AND length(trim(contact)) BETWEEN 3 AND 200
  AND (message IS NULL OR length(message) <= 1000)
  AND (age_group IS NULL OR length(age_group) <= 50)
  AND (preferred_date IS NULL OR length(preferred_date) <= 100)
);

-- No SELECT/UPDATE/DELETE policies → only service role (backend) can read