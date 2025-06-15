
-- Table for storing high-level KPIs (current value shown in cards)
CREATE TABLE public.kpi_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL, -- e.g. 'revenue', 'customers', 'traffic', etc
  value numeric NOT NULL,
  display_value text, -- Optional: formatted string ('$18,300')
  delta_value numeric, -- e.g. +500 or -100
  delta_display text,  -- Optional: '+7.2%' etc
  delta_type text,     -- 'increase' or 'decrease'
  subtitle text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Table for chart time series (e.g. revenue per month)
CREATE TABLE public.kpi_chart_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kpi_type text NOT NULL,     -- e.g. 'revenue'
  date date NOT NULL,         -- e.g. 2025-06-01
  value numeric NOT NULL,     -- e.g. 18300
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS and secure tables to each user
ALTER TABLE public.kpi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_chart_points ENABLE ROW LEVEL SECURITY;

-- Policy: only allow users to see and edit their own rows
CREATE POLICY "User can access their own metrics" 
  ON public.kpi_metrics
  USING (user_id = auth.uid());

CREATE POLICY "User can insert/update their own metrics"
  ON public.kpi_metrics
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "User can access their own chart points" 
  ON public.kpi_chart_points
  USING (user_id = auth.uid());

CREATE POLICY "User can insert/update their own chart points"
  ON public.kpi_chart_points
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
