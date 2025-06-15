
import KpiMetricForm from "@/components/data/KpiMetricForm";
import KpiChartPointForm from "@/components/data/KpiChartPointForm";

export default function DataManagement() {
  return (
    <div className="container max-w-2xl py-10">
      <h1 className="text-2xl font-bold mb-8">Data Management</h1>
      <div className="mb-8">
        <h2 className="font-semibold mb-3">Add New KPI Metric</h2>
        <KpiMetricForm />
      </div>
      <div>
        <h2 className="font-semibold mb-3">Add a line chart to the dashboard showing monthly trends</h2>
        <KpiChartPointForm />
      </div>
    </div>
  );
}

