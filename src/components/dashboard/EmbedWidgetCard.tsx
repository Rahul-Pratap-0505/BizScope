
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export default function EmbedWidgetCard() {
  const [embedPublic, setEmbedPublic] = useState(false);
  const embedCode = `<iframe src="https://bizscope.io/widget/revenue" width="400" height="200"></iframe>`;

  return (
    <div className="bg-card rounded-lg shadow p-4 flex flex-col gap-4 max-w-xs">
      <div className="font-medium mb-1">Embed Chart Widget</div>
      <div className="flex items-center gap-2">
        <Switch checked={embedPublic} onCheckedChange={setEmbedPublic} />
        <span className="text-sm">{embedPublic ? "Public" : "Private"}</span>
      </div>
      <div>
        <Input className="text-xs" readOnly value={embedCode} onFocus={e => e.target.select()} />
      </div>
      <div className="text-xs text-muted-foreground">
        Copy and paste into your website. Only visible if set to <b>Public</b>.
      </div>
    </div>
  );
}
