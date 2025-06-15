
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function AlertsCard() {
  const [revenueThreshold, setRevenueThreshold] = useState(5000);
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="bg-card rounded-lg shadow p-4 flex flex-col gap-3 max-w-xs">
      <div className="font-medium mb-1">Alert Rules</div>
      <div className="flex items-center gap-2">
        <Switch checked={enabled} onCheckedChange={setEnabled} /> 
        <span className="text-sm">Notify if revenue drops below</span>
        <Input type="number" className="w-24" value={revenueThreshold} onChange={e => setRevenueThreshold(Number(e.target.value))} min={0} />
      </div>
      <Button variant="outline" disabled>
        Save (coming soon)
      </Button>
      <div className="text-xs text-muted-foreground">You’ll receive email and console alerts.</div>
    </div>
  );
}
