
import { Button } from "@/components/ui/button";

type KpiWithColor = {
  type: string;
  display_value?: string;
  color: string;
};

export interface KpiListTableProps {
  kpis: KpiWithColor[];
  isLoading: boolean;
  onDelete: (type: string) => void;
}

export default function KpiListTable({ kpis, isLoading, onDelete }: KpiListTableProps) {
  if (isLoading) return <div>Loading KPIs...</div>;

  return (
    <table className="w-full text-sm border mb-3">
      <thead>
        <tr className="bg-muted">
          <th className="px-2">KPI</th>
          <th className="px-2">Type</th>
          <th className="px-2">Color</th>
          <th className="px-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {kpis.map((kpi) => (
          <tr key={kpi.type}>
            <td className="px-2 py-1">{kpi.display_value || kpi.type}</td>
            <td className="px-2 py-1">{kpi.type}</td>
            <td className="px-2 py-1">
              <div className="w-4 h-4 rounded-full inline-block" style={{ background: kpi.color }}></div>
            </td>
            <td className="px-2 py-1">
              <Button size="sm" variant="destructive" onClick={() => onDelete(kpi.type)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
