
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAlertRule } from "@/hooks/useAlertRule";
import { toast } from "@/hooks/use-toast";
import { PROTECTED_KPI_TYPES } from "@/hooks/useKpis";

const KPI_LABELS: Record<string, string> = {
  revenue: "Revenue",
  customers: "Customers",
  conv_rate: "Conversion Rate",
  traffic: "Traffic",
  roi: "ROI",
};

export default function AlertsCard() {
  // Let the user select a KPI type
  const [selectedKpi, setSelectedKpi] = useState<string>("revenue");

  const {
    data: alertRule,
    isLoading,
    error,
    saveAlertRule,
    saving,
  } = useAlertRule(selectedKpi);

  const [threshold, setThreshold] = useState<number>(5000);
  const [enabled, setEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (alertRule) {
      setThreshold(alertRule.threshold ?? 5000);
      setEnabled(alertRule.enabled ?? true);
    } else {
      // Set sensible default per KPI
      setThreshold(selectedKpi === "conv_rate" ? 10 : 5000);
      setEnabled(true);
    }
  }, [alertRule, selectedKpi]);

  async function onSave() {
    try {
      await saveAlertRule({ threshold, enabled });
      toast({
        title: "Alert rule saved!",
        description: `Your ${KPI_LABELS[selectedKpi] || selectedKpi} alert rule has been saved.`,
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
      {/* KPI Type Selector */}
      <div className="mb-2">
        <label htmlFor="kpi-type" className="text-xs text-muted-foreground">Select KPI</label>
        <select
          id="kpi-type"
          value={selectedKpi}
          onChange={e => setSelectedKpi(e.target.value)}
          className="block w-full mt-1 rounded border px-2 py-1 text-sm"
        >
          {PROTECTED_KPI_TYPES.map(type => (
            <option key={type} value={type}>
              {KPI_LABELS[type] || type}
            </option>
          ))}
        </select>
      </div>
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
            <span className="text-sm">Notify if {KPI_LABELS[selectedKpi] || selectedKpi} drops below</span>
            <Input
              type="number"
              className="w-24"
              value={threshold}
              onChange={e => setThreshold(Number(e.target.value))}
              min={0}
            />
          </div>
          <Button variant="outline" onClick={onSave}>
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
