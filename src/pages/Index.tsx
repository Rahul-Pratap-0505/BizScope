
import AppHeader from "@/components/layout/AppHeader";
import SidebarNav from "@/components/layout/SidebarNav";
import KpiCard from "@/components/dashboard/KpiCard";
import KpiLineChart from "@/components/data/KpiLineChart";
import ConnectProviderCard from "@/components/dashboard/ConnectProviderCard";
import AlertsCard from "@/components/dashboard/AlertsCard";
import { kpiTypeToIcon, useKpis } from "@/hooks/useKpis";
import { useKpiChartData } from "@/hooks/useKpiChartData";
import { ChartBar, User, ArrowUp, ArrowDown, LayoutDashboard, Settings } from "lucide-react";
import { Loader } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

export default function Index() {
  const { data: kpiData, isLoading: kpiLoading, error: kpiError } = useKpis();
  const iconMap: any = {
    ChartBar: <ChartBar size={20} />,
    User: <User size={18} />,
    LayoutDashboard: <LayoutDashboard size={18} />,
    Settings: <Settings size={18} />,
  };
  const isMobile = useIsMobile();
  const [mobileNoticeDismissed, setMobileNoticeDismissed] = useState(false);

  return (
    <div className="bg-gradient-to-br from-[#f6f8fc] via-[#ecf0fa] to-[#e7eafe] dark:from-[#111827] dark:to-[#1c2331] min-h-screen w-full flex flex-col transition-all">
      <AppHeader />
      {isMobile && !mobileNoticeDismissed && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 text-sm flex justify-between items-center z-50">
          <span>
            For the best experience, please switch to <b>Desktop mode</b> in your browser or use a desktop device.
          </span>
          <button
            className="ml-4 text-yellow-700 hover:text-yellow-900 rounded px-2 py-1"
            onClick={() => setMobileNoticeDismissed(true)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}
      <div className="flex w-full flex-1">
        <SidebarNav />
        <main className="flex-1 p-8 flex flex-col gap-10 bg-transparent">
          {/* Top KPIs */}
          <section className="flex flex-wrap gap-6 justify-center pb-6">
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
          {/* Two columns (Charts & widgets) */}
          <section className="flex flex-wrap gap-8 mt-4">
            <div className="flex flex-col gap-6 min-w-0 flex-1">
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
