
import { cn } from "@/lib/utils";
import { LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { cleanupAuthState } from "@/utils/authCleanup";
import SupportDialog from "./SupportDialog";
import DocsDialog from "./DocsDialog";
import { useRef } from "react";

const AppHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { username, loading: usernameLoading } = useCurrentProfile();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    return () => { subscription.unsubscribe(); };
  }, []);

  const handleSignOut = async () => {
    try {
      // Clean up state first
      cleanupAuthState();

      // Attempt global sign out; ignore errors
      try {
        await supabase.auth.signOut({ scope: "global" });
      } catch (_err) {
        // ignore errors from signOut
      }

      // Full reload to ensure clean state
      window.location.href = "/auth";
    } catch (_error) {
      // fallback redirect as a catch-all
      window.location.href = "/auth";
    }
  };

  return (
    <header className={cn(
      "flex items-center justify-between h-16 px-4 md:px-8 py-3 bg-white border-b border-gray-200 shadow-sm z-20",
      "dark:bg-sidebar dark:border-sidebar-border dark:text-white",
      "sticky top-0 left-0 w-full"
    )}>
      <div className="flex items-center gap-3 md:gap-4">
        <LayoutDashboard className="text-blue-600" size={28} />
        <span className="text-base md:text-lg font-bold tracking-wide">BizScope</span>
      </div>
      <nav className="flex items-center gap-3 md:gap-6">
        <a href="/" className="hidden sm:inline text-gray-700 hover:text-blue-600 font-medium transition">Dashboard</a>
        <DocsDialog>
          <button
            type="button"
            className="text-gray-700 hover:text-blue-600 transition font-medium"
            style={{ outline: "none", background: "none" }}
          >
            Docs
          </button>
        </DocsDialog>
        <SupportDialog>
          <button
            type="button"
            className="text-gray-700 hover:text-blue-600 transition font-medium"
            style={{ outline: "none", background: "none" }}
          >
            Support
          </button>
        </SupportDialog>
      </nav>
      <div className="flex items-center gap-2 md:gap-4">
        {isLoggedIn && !usernameLoading && username && (
          <span className="text-xs md:text-sm text-gray-600">Welcome, <span className="font-semibold">{username}</span>!</span>
        )}
        {isLoggedIn ? (
          <button
            onClick={handleSignOut}
            className="bg-gray-200 px-2 md:px-3 py-1.5 rounded text-xs md:text-sm hover:bg-gray-300 transition"
          >
            Sign out
          </button>
        ) : (
          <a href="/auth" className="text-gray-500 text-xs md:text-sm">Sign in</a>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
