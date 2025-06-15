import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Map of metric types to colors and labels
const KPI_TYPES = [
  { value: "revenue", label: "Revenue", color: "#2563eb" },
  { value: "customers", label: "Customers", color: "#16a34a" },
  { value: "traffic", label: "Traffic", color: "#f59e42" },
  { value: "conv_rate", label: "Conv. Rate", color: "#be185d" },
  { value: "roi", label: "ROI", color: "#f43f5e" },
];

// Helper: get label and color by type
const getKpiMeta = (type: string) =>
  KPI_TYPES.find((k) => k.value === type) || { label: type, color: "#555" };

type RawChartPoint = {
  date: string;
  kpi_type: string;
  value: number;
};

type ChartDataPoint = {
  name: string; // e.g., "Jun '24"
  [kpi_type: string]: string | number;
};

function parseChartData(rawPoints: RawChartPoint[]): ChartDataPoint[] {
  // Group by month, flatten all metrics into one object per month
  const grouped: Record<string, ChartDataPoint> = {};
  rawPoints.forEach((pt) => {
    const month = new Date(pt.date).toISOString().slice(0, 7); // "YYYY-MM"
    if (!grouped[month])
      grouped[month] = {
        name: new Date(pt.date).toLocaleString("en-US", { month: "short", year: "2-digit" }),
      };
    grouped[month][pt.kpi_type] = pt.value;
  });
  // Return sorted
  return Object.values(grouped).sort((a, b) =>
    (a.name > b.name ? 1 : -1)
  );
}

export default function KpiLineChart() {
  // Fetch all points (data is an array, not a Promise)
  const { data, isLoading, error } = useQuery({
    queryKey: ["kpi_chart_points", "all"],
    queryFn: async () => {
      const { data: points, error } = await supabase
        .from("kpi_chart_points")
        .select("date,kpi_type,value")
        .order("date", { ascending: true });
      if (error) throw error;
      return parseChartData((points || []) as RawChartPoint[]);
    },
  });

  if (isLoading)
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        Loading all chart data...
      </div>
    );
  if (error)
    return (
      <div className="text-destructive">Failed to load chart data.</div>
    );
  if (!data || data.length === 0)
    return (
      <div className="text-sm text-muted-foreground">
        No chart data for any metric.
      </div>
    );

  return (
    <div className="bg-card rounded-lg shadow p-4 w-full max-w-2xl mx-auto mb-8">
      <div className="font-semibold mb-2">Monthly Trends for All Metrics</div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#999" />
          <YAxis stroke="#999" />
          <Tooltip />
          <Legend />
          {KPI_TYPES.map(({ value, label, color }) => (
            <Line
              key={value}
              type="monotone"
              dataKey={value}
              stroke={color}
              name={label}
              connectNulls
              strokeWidth={2}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
