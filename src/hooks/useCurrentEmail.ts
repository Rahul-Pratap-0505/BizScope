
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches the currently signed-in user's email from Supabase auth session.
 */
export function useCurrentEmail() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchEmail() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email || null;
      if (isMounted) {
        setEmail(userEmail);
        setLoading(false);
      }
    }
    fetchEmail();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setEmail(session.user.email || null);
      } else {
        setEmail(null);
      }
    });
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { email, loading };
}
