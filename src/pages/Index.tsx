
import AppHeader from "@/components/layout/AppHeader";
import SidebarNav from "@/components/layout/SidebarNav";
import KpiCard from "@/components/dashboard/KpiCard";
import DemoChart from "@/components/dashboard/DemoChart";
import ConnectProviderCard from "@/components/dashboard/ConnectProviderCard";
import EmbedWidgetCard from "@/components/dashboard/EmbedWidgetCard";
import AlertsCard from "@/components/dashboard/AlertsCard";
import { UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { ChartBar, User, ArrowUp, ArrowDown, LayoutDashboard, Settings } from "lucide-react";

const demoKpis = [
  { title: "This Month's Revenue", value: "$18,300", icon: <ChartBar size={20} />, delta: "+7.2%", deltaType: "increase", subtitle: "Stripe" },
  { title: "Customers", value: "813", icon: <User size={18} />, delta: "-1.1%", deltaType: "decrease", subtitle: "Churn - last 30d" },
  { title: "Traffic", value: "22,480", icon: <LayoutDashboard size={18} />, delta: "+3.8%", deltaType: "increase", subtitle: "Visitors (GA4)" },
  { title: "Conv. Rate", value: "4.6%", icon: <ChartBar size={18} />, delta: "+0.9%", deltaType: "increase", subtitle: "Shopify" },
  { title: "ROI", value: "2.9x", icon: <Settings size={18} />, delta: "-0.2x", deltaType: "decrease", subtitle: "Marketing Efficiency" },
];

export default function Index() {
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
            {demoKpis.map((kpi) => (
              <KpiCard key={kpi.title} {...kpi} />
            ))}
          </section>

          {/* Two columns (Chart & widgets) */}
          <section className="flex flex-wrap gap-8 mt-4">
            <DemoChart />
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
