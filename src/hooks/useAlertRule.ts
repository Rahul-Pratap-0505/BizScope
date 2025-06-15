
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Hook to get the user's alert rule for a given type (e.g. 'revenue')
export function useAlertRule(type: string = "revenue") {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["alert_rule", type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alert_rules")
        .select("*")
        .eq("type", type)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (rule: { threshold: number; enabled: boolean }) => {
      // Upsert (insert or update) the alert rule for this user & type
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) throw new Error("Not authenticated");
      const user_id = user.user.id;
      const upsertRes = await supabase
        .from("alert_rules")
        .upsert(
          [
            {
              user_id,
              type,
              threshold: rule.threshold,
              enabled: rule.enabled,
              updated_at: new Date().toISOString(),
            },
          ],
          { onConflict: "user_id,type" }
        )
        .select("*")
        .maybeSingle();
      if (upsertRes.error) throw upsertRes.error;
      return upsertRes.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alert_rule", type] });
    },
  });

  return {
    data,
    isLoading,
    error,
    saveAlertRule: mutation.mutateAsync,
    saving: mutation.isPending,
  };
}
