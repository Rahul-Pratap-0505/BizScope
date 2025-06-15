
import KpiLineChart from "@/components/data/KpiLineChart";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Analytics() {
  const navigate = useNavigate();
  return (
    <div className="container max-w-2xl py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <Button variant="outline" onClick={() => navigate("/")}>
          ← Back to Dashboard
        </Button>
      </div>
      <KpiLineChart />
    </div>
  );
}
