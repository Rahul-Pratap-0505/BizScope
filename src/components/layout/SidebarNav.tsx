
import { LayoutDashboard, ChartBar, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: ChartBar },
  { href: "/analytics-chat", label: "AI Chat", icon: ChartBar }, // ADDED: AI Chat link
  { href: "#", label: "Account", icon: User },
  { href: "#", label: "Settings", icon: Settings },
  { href: "/data-management", label: "Data Management", icon: ChartBar },
];

export default function SidebarNav() {
  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-gradient-to-b from-[#f7fafc] via-white to-[#e7eafe] dark:from-[#151b28] dark:via-[#161c2d] dark:to-[#272f42] w-60 h-[calc(100vh-4rem)] border-r border-sidebar-border pt-8 pl-3 z-10 transition-all duration-200 shadow-xl/10"
      )}
    >
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
  );
}
