
import { cn } from "@/lib/utils";
import { LayoutDashboard } from "lucide-react";

const AppHeader = () => (
  <header className={cn("flex items-center justify-between h-16 px-8 py-3 bg-white border-b border-gray-200 shadow-sm z-20", "dark:bg-sidebar dark:border-sidebar-border dark:text-white")}>
    <div className="flex items-center gap-4">
      <LayoutDashboard className="text-blue-600" size={32} />
      <span className="text-lg font-bold tracking-wide">BizScope</span>
    </div>
    <nav className="flex items-center gap-6">
      <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">Dashboard</a>
      <a href="#" className="text-gray-700 hover:text-blue-600 transition">Docs</a>
      <a href="#" className="text-gray-700 hover:text-blue-600 transition">Support</a>
    </nav>
    <div>
      {/* TODO: Replace this with Supabase Auth buttons */}
      <span className="text-gray-500 text-sm">Account</span>
    </div>
  </header>
);

export default AppHeader;
