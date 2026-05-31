DROP POLICY IF EXISTS "Anyone can submit a sign-up" ON public.training_signups;

CREATE POLICY "Anyone can submit a sign-up"
ON public.training_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (
  coach_notes IS NULL
  AND length(trim(name)) BETWEEN 1 AND 100
  AND length(trim(contact)) BETWEEN 3 AND 200
  AND (message IS NULL OR length(message) <= 1000)
  AND (age_group IS NULL OR length(age_group) <= 50)
  AND (preferred_date IS NULL OR length(preferred_date) <= 100)
);