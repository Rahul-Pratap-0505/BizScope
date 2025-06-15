
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Protect these core KPIs
export const PROTECTED_KPI_TYPES = [
  "revenue",
  "customers",
  "conv_rate",
];

export const kpiTypeToIcon = {
  revenue: "ChartBar",
  customers: "User",
  traffic: "LayoutDashboard",
  conv_rate: "ChartBar",
  roi: "Settings",
};

// Helper to prettify label
function prettyLabel(type: string) {
  if (type === "conv_rate") return "Conv. Rate";
  return type ? type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ") : "";
}

export type KpiMetric = {
  id: string;
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  delta?: string | null;
  deltaType?: "increase" | "decrease" | null;
  subtitle?: string | null;
  type?: string;
};

export function useKpis() {
  return useQuery({
    queryKey: ["kpi_metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kpi_metrics")
        .select("id,type,value,display_value,delta_display,delta_type,subtitle")
        .order("created_at", { ascending: true });
      if (error) throw error;
      // Ensure we only get one metric per type (latest per type)
      const typeMap = new Map();
      (data || []).forEach((k) => {
        if (!typeMap.has(k.type)) typeMap.set(k.type, k);
      });
      return Array.from(typeMap.values()).map((k) => ({
        id: k.id,
        title: prettyLabel(k.type),
        value: k.display_value ?? k.value,
        icon: kpiTypeToIcon[k.type] ?? undefined,
        delta: k.delta_display,
        deltaType: k.delta_type as "increase" | "decrease" | null,
        subtitle: k.subtitle,
        type: k.type,
      }));
    }
  });
}
