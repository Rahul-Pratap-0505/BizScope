
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches the currently signed-in user's Supabase profile (username).
 */
export function useCurrentProfile() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      setLoading(true);
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) {
        setUsername(null);
        setLoading(false);
        return;
      }
      // Fetch from profiles table by user id
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", userId)
        .maybeSingle();
      if (isMounted) {
        setUsername(data?.username || null);
        setLoading(false);
      }
    }
    fetchProfile();
    // Listen to auth changes and refetch
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchProfile();
      else setUsername(null);
    });
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { username, loading };
}
