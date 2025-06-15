
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type KpiMetric = {
  id: string;
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  delta?: string | null;
  deltaType?: "increase" | "decrease" | null;
  subtitle?: string | null;
};

export const kpiTypeToIcon = {
  revenue: "ChartBar",
  customers: "User",
  traffic: "LayoutDashboard",
  "conv_rate": "ChartBar",
  roi: "Settings",
};

export function useKpis() {
  return useQuery({
    queryKey: ["kpi_metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kpi_metrics")
        .select(
          "id,type,value,display_value,delta_display,delta_type,subtitle"
        )
        .order("created_at", { ascending: true });
      if (error) throw error;
      // Map "type" to Card props with fallback
      return (
        data?.map((k) => ({
          id: k.id,
          title: k.type === "conv_rate" ? "Conv. Rate" : (k.type?.charAt(0).toUpperCase() + k.type?.slice(1).replace("_", " ")),
          value: k.display_value ?? k.value,
          icon: kpiTypeToIcon[k.type] ?? undefined,
          delta: k.delta_display,
          deltaType: k.delta_type as "increase" | "decrease" | null,
          subtitle: k.subtitle,
        })) || []
      );
    },
  });
}
