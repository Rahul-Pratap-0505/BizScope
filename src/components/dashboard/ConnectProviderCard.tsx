
import { Button } from "@/components/ui/button";
import { ChartBar } from "lucide-react";
import { useState } from "react";

// Placeholder for provider connect logic
export default function ConnectProviderCard() {
  const [connected, setConnected] = useState(false);

  return (
    <div className="bg-card rounded-lg shadow p-4 flex flex-col gap-3 max-w-xs">
      <div className="flex items-center gap-2 mb-1">
        <ChartBar className="text-blue-500" size={20} />
        <span className="font-medium">Connect Stripe</span>
      </div>
      <div className="text-sm text-muted-foreground mb-2">
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
    </div>
  );
}
