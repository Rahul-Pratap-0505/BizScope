import AppHeader from "@/components/layout/AppHeader";
import SidebarNav from "@/components/layout/SidebarNav";
import KpiCard from "@/components/dashboard/KpiCard";
import KpiLineChart from "@/components/data/KpiLineChart";
import ConnectProviderCard from "@/components/dashboard/ConnectProviderCard";
import AlertsCard from "@/components/dashboard/AlertsCard";
import { kpiTypeToIcon, useKpis } from "@/hooks/useKpis";
import { useKpiChartData } from "@/hooks/useKpiChartData";
import { useLatestKpiChartPoints } from "@/hooks/useLatestKpiChartPoints";
import { ChartBar, User, ArrowUp, ArrowDown, LayoutDashboard, Settings } from "lucide-react";
import { Loader } from "lucide-react";

export default function Index() {
  // We'll show the latest values from kpi_chart_points table instead:
  const { data: chartKpis, isLoading: kpiLoading, error: kpiError } = useLatestKpiChartPoints();

  const iconMap: any = {
    ChartBar: <ChartBar size={20} />,
    User: <User size={18} />,
    LayoutDashboard: <LayoutDashboard size={18} />,
    Settings: <Settings size={18} />,
  };

  return (
    <div className="bg-background min-h-screen w-full flex flex-col">
      <AppHeader />
      <div className="flex w-full flex-1">
        <SidebarNav />
        <main className="flex-1 p-8 flex flex-col gap-8 bg-background">
          {/* Top KPIs */}
          <section className="flex flex-wrap gap-4">
            {kpiLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader className="animate-spin" /> Loading KPIs...
              </div>
            ) : kpiError ? (
              <div className="text-destructive">Failed to load KPIs.</div>
            ) : chartKpis && chartKpis.length > 0 ? (
              chartKpis.map((kpi) => (
                <KpiCard
                  key={kpi.kpi_type}
                  title={kpi.kpi_type}
                  value={kpi.value}
                  icon={iconMap[kpiTypeToIcon[kpi.kpi_type]] || undefined}
                  delta={undefined}
                  deltaType={undefined}
                  subtitle={`as of ${new Date(kpi.date).toLocaleDateString()}`}
                />
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No metric data available yet.</div>
            )}
          </section>

          {/* Two columns (Charts & widgets) */}
          <section className="flex flex-wrap gap-8 mt-4">
            <div className="flex flex-col gap-6" style={{ minWidth: 0, flex: 1 }}>
              <KpiLineChart />
            </div>
            <div className="flex flex-col gap-6 max-w-xs">
              <AlertsCard />
            </div>
          </section>
        </main>
      </div>
      {/* Connect Stripe moved to page bottom */}
      <div className="flex justify-center mt-2 mb-8">
        <ConnectProviderCard />
      </div>
    </div>
  );
}
