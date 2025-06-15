
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAlertRule } from "@/hooks/useAlertRule";
import { toast } from "@/hooks/use-toast";

export default function AlertsCard() {
  // Only revenue supported for now
  const {
    data: alertRule,
    isLoading,
    error,
    saveAlertRule,
    saving,
  } = useAlertRule("revenue");

  const [revenueThreshold, setRevenueThreshold] = useState(5000);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (alertRule) {
      setRevenueThreshold(alertRule.threshold ?? 5000);
      setEnabled(alertRule.enabled ?? true);
    }
  }, [alertRule]);

  async function onSave() {
    try {
      await saveAlertRule({ threshold: revenueThreshold, enabled });
      toast({
        title: "Alert rule saved!",
        description: "Your revenue alert rule has been saved.",
      });
    } catch (e: any) {
      toast({
        title: "Failed to save alert rule",
        description: e.message ?? "An error occurred.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="bg-card rounded-lg shadow p-4 flex flex-col gap-3 max-w-xs">
      <div className="font-medium mb-1">Alert Rules</div>
      {isLoading ? (
        <div className="text-muted-foreground text-sm">Loading...</div>
      ) : error ? (
        <div className="text-destructive text-xs">
          Failed to load rule: {error.message}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Switch checked={enabled} onCheckedChange={setEnabled} /> 
            <span className="text-sm">Notify if revenue drops below</span>
            <Input
              type="number"
              className="w-24"
              value={revenueThreshold}
              onChange={e => setRevenueThreshold(Number(e.target.value))}
              min={0}
            />
          </div>
          <Button variant="outline" loading={saving} onClick={onSave}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <div className="text-xs text-muted-foreground">
            You’ll receive email and console alerts (coming soon).
          </div>
        </>
      )}
    </div>
  );
}
