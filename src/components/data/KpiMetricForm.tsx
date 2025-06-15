
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const KPI_TYPES = [
  { value: "revenue", label: "Revenue" },
  { value: "customers", label: "Customers" },
  { value: "traffic", label: "Traffic" },
  { value: "conv_rate", label: "Conv. Rate" },
  { value: "roi", label: "ROI" },
];

export default function KpiMetricForm() {
  const [form, setForm] = useState({
    type: "revenue",
    value: "",
    display_value: "",
    delta_display: "",
    delta_type: "increase",
    subtitle: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast({ title: "Submitting KPI metric..." });

    const { data: userSession } = await supabase.auth.getSession();
    const user_id = userSession.session?.user?.id;
    if (!user_id) {
      toast({ title: "Error", description: "No user ID found.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("kpi_metrics").insert([
      {
        user_id,
        type: form.type,
        value: Number(form.value),
        display_value: form.display_value || null,
        delta_display: form.delta_display || null,
        delta_type: form.delta_type || null,
        subtitle: form.subtitle || null,
      },
    ]);
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "KPI metric added!" });
      setForm({
        type: "revenue",
        value: "",
        display_value: "",
        delta_display: "",
        delta_type: "increase",
        subtitle: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-card p-4 rounded-lg shadow">
      <label>
        KPI Type
        <select name="type" value={form.type} onChange={handleChange} className="w-full px-2 py-1 rounded border">
          {KPI_TYPES.map((k) => (
            <option key={k.value} value={k.value}>{k.label}</option>
          ))}
        </select>
      </label>
      <label>
        Value
        <Input name="value" type="number" required value={form.value} onChange={handleChange} />
      </label>
      <label>
        Display Value (optional)
        <Input name="display_value" value={form.display_value} onChange={handleChange} />
      </label>
      <label>
        Delta Display (optional)
        <Input name="delta_display" value={form.delta_display} onChange={handleChange} placeholder="+7.2%" />
      </label>
      <label>
        Delta Type
        <select name="delta_type" value={form.delta_type} onChange={handleChange} className="w-full px-2 py-1 rounded border">
          <option value="increase">Increase</option>
          <option value="decrease">Decrease</option>
        </select>
      </label>
      <label>
        Subtitle (optional)
        <Input name="subtitle" value={form.subtitle} onChange={handleChange} />
      </label>
      <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Add KPI Metric"}</Button>
    </form>
  );
}
