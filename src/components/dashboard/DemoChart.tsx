
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type DemoChartProps = {
  chartData?: any[];
  chartLoading?: boolean;
  chartError?: any;
};

export default function DemoChart({ chartData, chartLoading, chartError }: DemoChartProps) {
  return (
    <div className="bg-card rounded-lg shadow p-4 w-full max-w-[500px] h-[260px] flex flex-col items-start">
      <div className="font-semibold mb-2">Monthly Revenue</div>
      {chartLoading ? (
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
          Loading chart...
        </div>
      ) : chartError ? (
        <div className="text-destructive">Failed to load chart data.</div>
      ) : chartData && chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Bar dataKey="Revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-sm text-muted-foreground">No chart data.</div>
      )}
    </div>
  );
}
