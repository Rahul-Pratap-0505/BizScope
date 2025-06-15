
import AppHeader from "@/components/layout/AppHeader";
import SidebarNav from "@/components/layout/SidebarNav";
import KpiCard from "@/components/dashboard/KpiCard";
import DemoChart from "@/components/dashboard/DemoChart";
import ConnectProviderCard from "@/components/dashboard/ConnectProviderCard";
import EmbedWidgetCard from "@/components/dashboard/EmbedWidgetCard";
import AlertsCard from "@/components/dashboard/AlertsCard";
import { kpiTypeToIcon, useKpis } from "@/hooks/useKpis";
import { useKpiChartData } from "@/hooks/useKpiChartData";
import { ChartBar, User, ArrowUp, ArrowDown, LayoutDashboard, Settings } from "lucide-react";
import { Loader } from "lucide-react";

export default function Index() {
  const { data: kpiData, isLoading: kpiLoading, error: kpiError } = useKpis();
  const { data: chartData, isLoading: chartLoading, error: chartError } = useKpiChartData("revenue");

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
          {/* Connect Provider Callout */}
          <div className="mb-2">
            <ConnectProviderCard />
          </div>

          {/* Top KPIs */}
          <section className="flex flex-wrap gap-4">
            {kpiLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader className="animate-spin" /> Loading KPIs...
              </div>
            ) : kpiError ? (
              <div className="text-destructive">Failed to load KPIs.</div>
            ) : kpiData && kpiData.length > 0 ? (
              kpiData.map((kpi) => (
                <KpiCard
                  key={kpi.id}
                  title={kpi.title}
                  value={kpi.value}
                  icon={kpi.icon ? iconMap[kpi.icon] : null}
                  delta={kpi.delta}
                  deltaType={kpi.deltaType}
                  subtitle={kpi.subtitle}
                />
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No metric data available yet.</div>
            )}
          </section>

          {/* Two columns (Chart & widgets) */}
          <section className="flex flex-wrap gap-8 mt-4">
            <DemoChart chartData={chartData} chartLoading={chartLoading} chartError={chartError} />
            <div className="flex flex-col gap-6 max-w-xs">
              <EmbedWidgetCard />
              <AlertsCard />
            </div>
          </section>

          {/* Footer/Dev Section */}
          <footer className="flex mt-12 justify-end px-2 text-xs text-muted-foreground">
            BizScope • All major platforms, one dashboard. Demo version — no real data is fetched yet.
          </footer>
        </main>
      </div>
    </div>
  );
}

