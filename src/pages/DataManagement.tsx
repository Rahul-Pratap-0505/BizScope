
import KpiMetricForm from "@/components/data/KpiMetricForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function DataManagement() {
  const navigate = useNavigate();
  return (
    <div className="container max-w-2xl py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Data Management</h1>
        <Button variant="outline" onClick={() => navigate("/")}>
          ← Back to Dashboard
        </Button>
      </div>
      <div className="mb-8">
        <h2 className="font-semibold mb-3">Add New KPI Metric</h2>
        <KpiMetricForm />
      </div>
      {/* The section for "Add a line chart to the dashboard showing monthly trends" and its related content has been fully removed as requested */}
    </div>
  );
}
