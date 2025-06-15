
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch the latest (by date) chart point per KPI type for the current user.
 * Returns an array of { kpi_type, value, date }
 */
export function useLatestKpiChartPoints() {
  return useQuery({
    queryKey: ["kpi_chart_points", "latest_per_type"],
    queryFn: async () => {
      // Get all chart points, most recent date first
      const { data, error } = await supabase
        .from("kpi_chart_points")
        .select("kpi_type,date,value")
        .order("date", { ascending: false });
      if (error) throw error;
      // For each type, get *only* the latest entry
      const latestMap = new Map();
      (data || []).forEach((row) => {
        if (!latestMap.has(row.kpi_type)) {
          latestMap.set(row.kpi_type, row);
        }
      });
      return Array.from(latestMap.values());
    },
  });
}
