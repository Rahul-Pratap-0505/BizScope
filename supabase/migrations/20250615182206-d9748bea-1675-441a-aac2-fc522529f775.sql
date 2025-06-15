
-- Create the alert_rules table
CREATE TABLE public.alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL, -- (e.g. 'revenue', can extend for other KPIs)
  threshold NUMERIC NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.alert_rules ENABLE ROW LEVEL SECURITY;

-- Only allow users to access their own alert rules
CREATE POLICY "Allow users to view their own alert rules"
ON public.alert_rules FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Allow users to insert their own alert rules"
ON public.alert_rules FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow users to update their own alert rules"
ON public.alert_rules FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Allow users to delete their own alert rules"
ON public.alert_rules FOR DELETE
  USING (user_id = auth.uid());
