
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useKpiChartData(type: string) {
  return useQuery({
    queryKey: ["kpi_chart_points", type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kpi_chart_points")
        .select("date,value")
        .eq("kpi_type", type)
        .order("date", { ascending: true });
      if (error) throw error;
      // Format for recharts: { name: 'Jan', Revenue: ... }
      return (
        data?.map((d) => ({
          name: new Date(d.date).toLocaleString("en-US", { month: "short" }),
          Revenue: d.value,
        })) || []
      );
    },
  });
}
