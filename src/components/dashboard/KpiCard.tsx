
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
    <div
      className={cn(
        "relative flex flex-col gap-3 p-6 min-w-[180px] rounded-2xl shadow-xl bg-white/70 dark:bg-white/5 border border-white/30 dark:border-white/10 backdrop-blur-[10px] ring-1 ring-black/5 hover:scale-[1.03] transition-all duration-300",
        "hover:shadow-2xl group"
      )}
      style={{
        boxShadow: "0 6px 32px 0 rgba(30,42,73,0.09)",
      }}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className="p-2 bg-blue-50 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-300 text-lg shadow-sm">
            {icon}
          </span>
        )}
        <span className="text-sm font-semibold text-muted-foreground">{title}</span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-4xl font-bold text-foreground tracking-tight">{value}</span>
        {delta && (
          <span className={cn(
            "text-[13px] font-medium flex items-center gap-1 rounded-lg px-2 py-0.5 bg-opacity-10",
            deltaType === "increase"
              ? "text-green-500 bg-green-400/30"
              : "text-red-500 bg-red-400/30"
          )}>
            {deltaType === "increase" ? (
              <span aria-label="increase" title="Increase">▲</span>
            ) : (
              <span aria-label="decrease" title="Decrease">▼</span>
            )}
            <span>{delta}</span>
          </span>
        )}
      </div>
      {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
    </div>
  );
}
