import { LayoutDashboard, ChartBar, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentEmail } from "@/hooks/useCurrentEmail";

const items = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: ChartBar },
  { href: "/analytics-chat", label: "AI Chat", icon: ChartBar },
  { href: "#", label: "Account", icon: User },
  { href: "#", label: "Settings", icon: Settings },
  { href: "/data-management", label: "Data Management", icon: ChartBar },
];

export default function SidebarNav() {
  const { email, loading } = useCurrentEmail();

  return (
    <>
      {/* Sidebar for desktop */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-gradient-to-b from-[#f7fafc] via-white to-[#e7eafe] dark:from-[#151b28] dark:via-[#161c2d] dark:to-[#272f42] w-60 h-[calc(100vh-4rem)] border-r border-sidebar-border pt-8 pl-3 z-10 transition-all duration-200 shadow-xl/10"
        )}
      >
        <div className="mb-5 pl-2 flex flex-col">
          {!loading && email && (
            <span className="text-xs text-blue-800 dark:text-blue-200 font-semibold mb-2 break-all" title={email}>
              {email}
            </span>
          )}
        </div>
        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 my-0.5 rounded-xl text-gray-700 dark:text-white/80 hover:bg-blue-50 dark:hover:bg-blue-900/25 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition group shadow-none hover:shadow-lg hover-scale"
              )}
            >
              <span className="relative flex items-center justify-center bg-blue-100 dark:bg-blue-900/70 rounded-lg p-1.5 mr-2 shadow-sm">
                <item.icon size={22} className="opacity-90 group-hover:text-blue-500 transition" />
              </span>
              <span className="tracking-wide">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="flex-1" />
        <div className="p-5 text-xs text-muted-foreground">© {new Date().getFullYear()} BizScope</div>
      </aside>

      {/* Simple sticky bar for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white bg-opacity-90 dark:bg-sidebar/90 flex justify-around items-center h-14 border-t border-gray-200 dark:border-sidebar-border shadow-lg">
        <a
          href="/"
          className="flex flex-col items-center justify-center text-blue-600 hover:text-blue-700 font-semibold transition"
        >
          <LayoutDashboard size={24} />
          <span className="text-xs mt-1">Dashboard</span>
        </a>
        <a
          href="/analytics"
          className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-200 hover:text-blue-600 font-semibold transition"
        >
          <ChartBar size={22} />
          <span className="text-xs mt-1">Analytics</span>
        </a>
        <a
          href="/analytics-chat"
          className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-200 hover:text-blue-600 font-semibold transition"
        >
          <ChartBar size={22} />
          <span className="text-xs mt-1">AI Chat</span>
        </a>
        <a
          href="/data-management"
          className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-200 hover:text-blue-600 font-semibold transition"
        >
          <ChartBar size={22} />
          <span className="text-xs mt-1">Data</span>
        </a>
      </nav>
    </>
  );
}
