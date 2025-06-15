
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import tinycolor from "tinycolor2";

const PROTECTED_KPIS = [
  { value: "revenue", label: "Revenue", color: "#2563eb" },
  { value: "customers", label: "Customers", color: "#16a34a" },
  { value: "conv_rate", label: "Conv. Rate", color: "#be185d" },
];

function getDefaultColor(existingColors: string[]) {
  // Choose a random color that isn't in use
  const palette = [
    "#f59e42", // orange
    "#f43f5e", // pink
    "#10b981", // teal
    "#eab308", // yellow
    "#6366f1", // indigo
    "#4b5563", // zinc
    "#164e63", // cyan9
    "#FB7185", // blush
    "#7c3aed", // purple
    "#059669", // emerald
  ];
  for (const color of palette) {
    if (!existingColors.includes(color)) return color;
  }
  // fallback: slightly random color
  return tinycolor.random().toHexString();
}

export default function KpiMetricForm() {
  const [customizing, setCustomizing] = useState(false);
  const [form, setForm] = useState({
    type: "",
    label: "",
    value: "",
    display_value: "",
    delta_display: "",
    delta_type: "increase",
    subtitle: "",
    color: "",
  });
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all KPIs for display, limiting to 10 KPIs
  const { data: kpis, isLoading } = useQuery({
    queryKey: ["kpi_metrics_admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kpi_metrics")
        .select("id,type,display_value,delta_display,delta_type,subtitle,value")
        .order("created_at", { ascending: true });
      if (error) throw error;
      // Only show distinct KPI types
      const map = new Map();
      (data || []).forEach((row) => {
        if (!map.has(row.type)) map.set(row.type, { ...row });
      });
      return Array.from(map.values());
    },
  });

  // Unique color for each KPI (based on type)
  const kpiWithColor = useMemo(() => {
    const baseColors: Record<string, string> = {};
    PROTECTED_KPIS.forEach((core) => (baseColors[core.value] = core.color));
    let colorIdx = 0;
    (kpis || []).forEach((k) => {
      if (!baseColors[k.type]) {
        // assign from palette
        const palette = [
          "#f59e42",
          "#f43f5e",
          "#10b981",
          "#eab308",
          "#6366f1",
          "#4b5563",
          "#FB7185",
          "#7c3aed",
          "#059669",
        ];
        baseColors[k.type] = palette[colorIdx % palette.length];
        colorIdx++;
      }
    });
    return (kpis || []).map((k) => ({
      ...k,
      color: baseColors[k.type] || getDefaultColor([]),
    }));
  }, [kpis]);

  const allKpiTypes = kpiWithColor.map((k) => k.type);
  const protectedTypes = PROTECTED_KPIS.map((k) => k.value);

  // Add new (custom) KPI
  const handleCustomKpi = () => {
    setCustomizing(true);
    setForm({
      type: "",
      label: "",
      value: "",
      display_value: "",
      delta_display: "",
      delta_type: "increase",
      subtitle: "",
      color: getDefaultColor(kpiWithColor.map((k) => k.color)),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new KPI "type" (custom or core)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (protectedTypes.includes(form.type)) {
      toast({ title: "This KPI already exists and cannot be added." });
      return;
    }
    if (allKpiTypes.length >= 10) {
      toast({
        title: "KPI Limit Reached",
        description: "You can only track up to 10 active KPIs at the same time.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    toast({ title: "Adding new KPI metric..." });
    const { data: session } = await supabase.auth.getSession();
    const user_id = session.session?.user?.id;
    if (!user_id) {
      toast({ title: "No user ID found.", variant: "destructive" });
      setLoading(false);
      return;
    }
    // Insert a first row for definition
    const insertType = form.type.trim() || form.label.trim().toLowerCase().replace(/[^a-z0-9_]/gi, "_");
    const { error } = await supabase.from("kpi_metrics").insert([
      {
        user_id,
        type: insertType,
        value: Number(form.value || 0),
        display_value: form.display_value || null,
        delta_display: form.delta_display || null,
        delta_type: form.delta_type || null,
        subtitle: form.subtitle || null,
      },
    ]);
    setLoading(false);
    setCustomizing(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Custom KPI metric added!" });
      queryClient.invalidateQueries({ queryKey: ["kpi_metrics"] });
      queryClient.invalidateQueries({ queryKey: ["kpi_metrics_admin"] });
    }
  };

  // Delete non-protected KPI
  const handleDelete = async (kpiType: string) => {
    if (protectedTypes.includes(kpiType)) {
      toast({ title: "Protected KPI", description: "This KPI cannot be deleted.", variant: "destructive" });
      return;
    }
    const { data } = await supabase.from("kpi_metrics").select("id").eq("type", kpiType);
    const ids = (data || []).map((row) => row.id);
    if (ids.length === 0) {
      toast({ title: "KPI not found." });
      return;
    }
    // Remove all occurrences of this KPI type
    const { error } = await supabase.from("kpi_metrics").delete().in("id", ids);
    if (error) {
      toast({ title: "Error deleting KPI", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "KPI deleted" });
      queryClient.invalidateQueries({ queryKey: ["kpi_metrics"] });
      queryClient.invalidateQueries({ queryKey: ["kpi_metrics_admin"] });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center mb-3 justify-between">
          <div className="font-semibold">Your KPIs (max 10)</div>
          <Button size="sm" onClick={handleCustomKpi} disabled={allKpiTypes.length >= 10 || customizing}>
            + Add Custom KPI
          </Button>
        </div>
        {isLoading ? (
          <div>Loading KPIs...</div>
        ) : (
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
              {kpiWithColor.map((kpi) => (
                <tr key={kpi.type}>
                  <td className="px-2 py-1">{PROTECTED_KPIS.find(p => p.value === kpi.type)?.label || kpi.display_value || kpi.type}</td>
                  <td className="px-2 py-1">{kpi.type}</td>
                  <td className="px-2 py-1">
                    <div className="w-4 h-4 rounded-full inline-block" style={{ background: kpi.color }}></div>
                  </td>
                  <td className="px-2 py-1">
                    {protectedTypes.includes(kpi.type) ? (
                      <span className="text-xs text-muted-foreground">Protected</span>
                    ) : (
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(kpi.type)}>Delete</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {customizing && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-card p-4 rounded-lg shadow mb-6">
          <label>
            KPI Label
            <Input name="label" value={form.label} onChange={handleChange} maxLength={20} placeholder="e.g. Return Customers" required />
          </label>
          <label>
            Type (short, unique ID)
            <Input name="type" value={form.type} onChange={handleChange} maxLength={24} placeholder="e.g. return_customers" />
          </label>
          <label>
            Color
            <Input name="color" type="color" value={form.color} onChange={handleChange} />
          </label>
          <label>
            Value
            <Input name="value" type="number" required value={form.value} onChange={handleChange} />
          </label>
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Add KPI Metric"}</Button>
          <Button type="button" variant="outline" onClick={() => setCustomizing(false)}>Cancel</Button>
        </form>
      )}
    </div>
  );
}
