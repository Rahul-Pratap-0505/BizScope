import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation, useNavigate } from "react-router-dom";
import AuthPage from "@/pages/Auth";
import DataManagement from "@/pages/DataManagement";

const queryClient = new QueryClient();

function ProtectedApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Custom route for Data Management */}
          <Route path="/data-management" element={<DataManagement />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

const App = () => {
  const [session, setSession] = useState<any | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen to Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (!s && !location.pathname.startsWith("/auth")) {
        navigate("/auth");
      }
      if (s && location.pathname.startsWith("/auth")) {
        navigate("/");
      }
    });

    // Check for an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session && !location.pathname.startsWith("/auth")) {
        navigate("/auth");
      }
    });

    return () => { subscription.unsubscribe(); };
    // eslint-disable-next-line
  }, []);

  // If we are on the /auth page, show the auth page
  if (location.pathname.startsWith("/auth")) {
    return <AuthPage />;
  }

  // If not logged in, block everything except /auth
  if (!session) {
    return null;
  }

  return <ProtectedApp />;
};

export default App;
