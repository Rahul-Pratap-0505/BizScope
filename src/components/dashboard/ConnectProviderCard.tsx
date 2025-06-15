
import { Button } from "@/components/ui/button";
import { ChartBar } from "lucide-react";
import { useState } from "react";

// Placeholder for provider connect logic
export default function ConnectProviderCard() {
  const [connected, setConnected] = useState(false);

  return (
    <div className="bg-card rounded-lg shadow p-4 flex flex-col gap-3 w-72 items-center">
      <div className="flex items-center gap-2 mb-1">
        <ChartBar className="text-blue-500" size={20} />
        <span className="font-medium">Connect Stripe</span>
      </div>
      <div className="text-sm text-muted-foreground mb-2 text-center">
        Syncs your Stripe data for instant revenue and customer analytics.
      </div>
      {connected ? (
        <Button variant="outline" disabled>
          Connected
        </Button>
      ) : (
        <Button variant="default" onClick={() => setConnected(true)}>
          Connect
        </Button>
      )}
      <div className="text-xs text-muted-foreground">
        <b>Tip:</b> We'll never access your money or make changes.
      </div>
      {/* Coming soon message */}
      <div className="mt-1">
        <span className="text-[11px] text-muted-foreground italic">Coming soon</span>
      </div>
    </div>
  );
}
