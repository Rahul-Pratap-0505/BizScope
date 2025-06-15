
import React from "react";
import { useKpiChartData } from "@/hooks/useKpiChartData";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface KpiIndividualBarChartProps {
  kpiType: string;
  label: string;
  color: string;
}

export default function KpiIndividualBarChart({ kpiType, label, color }: KpiIndividualBarChartProps) {
  const { data, isLoading, error } = useKpiChartData(kpiType);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        Loading {label} chart...
      </div>
    );
  }
  if (error) {
    return <div className="text-destructive">Failed to load chart data for {label}.</div>;
  }
  if (!data || data.length === 0) {
    return <div className="text-sm text-muted-foreground">No chart data for {label} yet.</div>;
  }

  // Adjust bar size and width to fit months
  const chartMinWidth = Math.max(400, data.length * 80);

  return (
    <div className="bg-card rounded-lg shadow p-4 w-full max-w-2xl mx-auto mb-8">
      <div className="font-semibold mb-2">Monthly Trends for {label}</div>
      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: chartMinWidth }}>
          <ResponsiveContainer width="100%" height={250}>
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
              <Bar
                dataKey="Revenue"
                name={label}
                fill={color}
                isAnimationActive={false}
                barSize={32}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
