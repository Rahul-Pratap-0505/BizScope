
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
    <aside className={cn("hidden md:flex flex-col bg-sidebar w-56 h-[calc(100vh-4rem)] border-r border-sidebar-border pt-6 pl-2 z-10", "dark:bg-sidebar dark:border-sidebar-border")}>
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-accent/80 hover:text-blue-600 font-medium transition group"
          >
            <item.icon size={20} className="opacity-90 group-hover:text-blue-600" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="flex-1" />
      <div className="p-4 text-xs text-muted-foreground">© {new Date().getFullYear()} BizScope</div>
    </aside>
  );
}
