import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useKpis } from "@/hooks/useKpis";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getDefaultColor, PALETTE } from "./kpiColorPalette";
import { ScrollArea } from "@/components/ui/scroll-area";

// Helper: get label and color by type
function getKpiMeta(type, kpisWithColor) {
  const found = kpisWithColor.find((k) => k.type === type);
  if (found) {
    return { label: found.title || found.type, color: found.color };
  }
  return { label: type, color: getDefaultColor([]) };
}

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
  // Return sorted by date ascending
  return Object.values(grouped).sort((a, b) =>
    (a.name > b.name ? 1 : -1)
  );
}

export default function KpiLineChart() {
  // Fetch all metric definitions
  const { data: kpiList } = useKpis();

  // Build list of {type, label, color}
  const kpisWithColor = useMemo(() => {
    if (!kpiList || kpiList.length === 0) return [];
    // Use assigned color if available, otherwise fall back to palette
    const baseColors: Record<string, string> = {};
    let colorIdx = 0;
    return kpiList.map((k) => {
      let color = (k as any).color;
      if (!color) {
        // Assign from palette deterministically by index
        if (!baseColors[k.type]) {
          baseColors[k.type] = PALETTE[colorIdx % PALETTE.length];
          colorIdx++;
        }
        color = baseColors[k.type] || getDefaultColor([]);
      }
      return {
        type: k.type,
        title: k.title,
        color,
      };
    });
  }, [kpiList]);

  // Chart data
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

  // If there are many months, let the chart be scrollable horizontally.
  // The min width ensures each month is at least 80px wide, and max is full.
  const chartMinWidth = Math.max(400, (data.length || 1) * 80);

  return (
    <div className="bg-card rounded-lg shadow p-4 w-full max-w-2xl mx-auto mb-8">
      <div className="font-semibold mb-2">Monthly Trends for All Metrics</div>
      {/* Remove: orientation="horizontal" */}
      <ScrollArea className="w-full">
        <div style={{ width: chartMinWidth }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              barCategoryGap="16%"
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip
                labelStyle={{ color: "#334155" }}
                contentStyle={{ backgroundColor: "#fff", borderRadius: 8, fontSize: 14 }}
              />
              <Legend />
              {kpisWithColor.map(({ type, title, color }) => (
                <Bar
                  key={type}
                  dataKey={type}
                  name={title}
                  fill={color}
                  isAnimationActive={false}
                  barSize={32}
                  radius={[6, 6, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ScrollArea>
    </div>
  );
}
