
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type KpiCardProps = {
  title: string;
  value: string | number;
  icon?: ReactNode;
  delta?: string;
  deltaType?: "increase" | "decrease";
  subtitle?: string;
};

export default function KpiCard({ title, value, icon, delta, deltaType, subtitle }: KpiCardProps) {
  return (
    <div className={cn("bg-card rounded-lg shadow flex flex-col gap-2 px-6 py-5 min-w-[180px]")}>
      <div className="flex items-center gap-3">
        {icon && <span className="text-blue-600">{icon}</span>}
        <span className="text-md font-semibold text-muted-foreground">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {delta && (
          <span className={cn(
            "text-sm font-medium",
            deltaType === "increase" ? "text-green-500" : "text-red-500"
          )}>
            {deltaType === "increase" ? "▲" : "▼"} {delta}
          </span>
        )}
      </div>
      {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
    </div>
  );
}
