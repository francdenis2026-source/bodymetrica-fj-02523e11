-- Only service_role and admins can see webhook logs
CREATE POLICY "Admins can view webhook events"
ON public.webhook_events
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can do anything with webhook events"
ON public.webhook_events
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);