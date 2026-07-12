
CREATE POLICY "no public read" ON public.admin_notification_recipients
  FOR SELECT TO anon, authenticated USING (false);
CREATE POLICY "no public write" ON public.admin_notification_recipients
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
