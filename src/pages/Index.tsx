
import AppHeader from "@/components/layout/AppHeader";
import SidebarNav from "@/components/layout/SidebarNav";
import KpiCard from "@/components/dashboard/KpiCard";
// Removed import DemoChart
import KpiLineChart from "@/components/data/KpiLineChart";
import ConnectProviderCard from "@/components/dashboard/ConnectProviderCard";
import AlertsCard from "@/components/dashboard/AlertsCard";
import { kpiTypeToIcon, useKpis } from "@/hooks/useKpis";
import { useKpiChartData } from "@/hooks/useKpiChartData";
import { ChartBar, User, ArrowUp, ArrowDown, LayoutDashboard, Settings } from "lucide-react";
import { Loader } from "lucide-react";

export default function Index() {
  const { data: kpiData, isLoading: kpiLoading, error: kpiError } = useKpis();

  const iconMap: any = {
    ChartBar: <ChartBar size={20} />,
    User: <User size={18} />,
    LayoutDashboard: <LayoutDashboard size={18} />,
    Settings: <Settings size={18} />,
  };

  return (
    <div className="bg-gradient-to-br from-[#f6f8fc] via-[#ecf0fa] to-[#e7eafe] dark:from-[#111827] dark:to-[#1c2331] min-h-screen w-full flex flex-col transition-all">
      <AppHeader />
      <div className="flex w-full flex-1">
        <SidebarNav />
        <main className="flex-1 p-4 md:p-8 flex flex-col gap-8 md:gap-10 bg-transparent">
          {/* Top KPIs */}
          <section className="flex gap-4 md:gap-6 overflow-x-auto pb-4 md:justify-center">
            {kpiLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader className="animate-spin" /> Loading KPIs...
              </div>
            ) : kpiError ? (
              <div className="text-destructive">Failed to load KPIs.</div>
            ) : kpiData && kpiData.length > 0 ? (
              kpiData.map((kpi) => (
                <div className="min-w-[220px] max-w-[320px] flex-1" key={kpi.id}>
                  <KpiCard
                    title={kpi.title}
                    value={kpi.value}
                    icon={kpi.icon ? iconMap[kpi.icon] : null}
                    delta={kpi.delta}
                    deltaType={kpi.deltaType}
                    subtitle={kpi.subtitle}
                  />
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No metric data available yet.</div>
            )}
          </section>

          {/* Two columns (Charts & widgets) */}
          <section className="flex flex-col lg:flex-row gap-6 md:gap-8 mt-2 md:mt-4">
            <div className="flex flex-col gap-6 flex-1 min-w-0">
              <div className="w-full">
                <KpiLineChart />
              </div>
            </div>
            <div className="flex flex-col gap-6 max-w-xs w-full mx-auto lg:mx-0">
              <AlertsCard />
            </div>
          </section>
        </main>
      </div>
      {/* Connect Stripe moved to page bottom */}
      <div className="flex justify-center mt-2 mb-8 px-2">
        <ConnectProviderCard />
      </div>
    </div>
  );
}
