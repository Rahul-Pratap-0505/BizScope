import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const KPI_TYPES = [
  { value: "revenue", label: "Revenue" },
  { value: "customers", label: "Customers" },
  { value: "traffic", label: "Traffic" },
  { value: "conv_rate", label: "Conv. Rate" },
  { value: "roi", label: "ROI" },
];

export default function KpiChartPointForm() {
  const [form, setForm] = useState({
    kpi_type: "revenue",
    date: "",
    value: "",
  });
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast({ title: "Submitting chart data point..." });

    const { data: userSession } = await supabase.auth.getSession();
    const user_id = userSession.session?.user?.id;
    if (!user_id) {
      toast({ title: "Error", description: "No user ID found.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("kpi_chart_points").insert([
      {
        user_id,
        kpi_type: form.kpi_type,
        date: form.date,
        value: Number(form.value),
      },
    ]);
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Chart data point added!" });
      setForm({
        kpi_type: "revenue",
        date: "",
        value: "",
      });
      // Invalidate to refetch dashboard chart
      queryClient.invalidateQueries({ queryKey: ["kpi_chart_points"] });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-card p-4 rounded-lg shadow">
      <label>
        KPI Type
        <select name="kpi_type" value={form.kpi_type} onChange={handleChange} className="w-full px-2 py-1 rounded border">
          {KPI_TYPES.map((k) => (
            <option key={k.value} value={k.value}>{k.label}</option>
          ))}
        </select>
      </label>
      <label>
        Date
        <Input name="date" type="date" required value={form.date} onChange={handleChange} />
      </label>
      <label>
        Value
        <Input name="value" type="number" required value={form.value} onChange={handleChange} />
      </label>
      <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Add Chart Point"}</Button>
    </form>
  );
}
