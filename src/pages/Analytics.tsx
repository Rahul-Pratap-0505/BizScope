
import KpiLineChart from "@/components/data/KpiLineChart";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { emailMyMetrics } from "@/utils/emailMyMetrics";

export default function Analytics() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);

  const handleEmail = async () => {
    setSending(true);
    try {
      await emailMyMetrics();
      toast({
        title: "Metrics Sent!",
        description: "Check your inbox for your BizScope KPI Metrics report.",
      });
    } catch (e: any) {
      toast({
        title: "Failed to Send Email",
        description: e.message ?? "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container max-w-2xl py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <Button variant="outline" onClick={() => navigate("/")}>
          ← Back to Dashboard
        </Button>
      </div>
      <div className="mb-5 flex items-center justify-end">
        <Button
          size="sm"
          disabled={sending}
          onClick={handleEmail}
          className="gap-2"
        >
          <Mail className="w-4 h-4" />
          {sending ? "Sending..." : "Email My Metrics"}
        </Button>
      </div>
      <KpiLineChart />
    </div>
  );
}
