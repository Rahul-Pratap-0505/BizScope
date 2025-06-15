// KpiMetricForm restructured for readability and maintainability
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import KpiListTable from "./KpiListTable";
import KpiMetricFormFields from "./KpiMetricFormFields";
import { getDefaultColor } from "./kpiColorPalette";
import { format } from "date-fns";
import { Edit } from "lucide-react";

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
    date: "", // <-- add date state for custom KPI
  });
  const [loading, setLoading] = useState(false);
  const [editingType, setEditingType] = useState<string | null>(null); // Track which KPI is being edited
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

  // Helper: Upsert the latest chart point for a KPI type
  async function upsertChartPointForType(type: string, value: number, date?: string) {
    const { data: session } = await supabase.auth.getSession();
    const user_id = session.session?.user?.id;
    if (!user_id) return;

    // date: use provided date, else current month, first day
    let chartDate = date;
    if (!chartDate) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      chartDate = `${yyyy}-${mm}-01`;
    }

    // Check for existing chart point for {user_id, type, date}
    const { data: existing, error: selErr } = await supabase
      .from("kpi_chart_points")
      .select("id")
      .eq("user_id", user_id)
      .eq("kpi_type", type)
      .eq("date", chartDate)
      .maybeSingle();

    if (existing && existing.id) {
      // Update if exists
      await supabase
        .from("kpi_chart_points")
        .update({ value })
        .eq("id", existing.id);
    } else {
      // Insert new
      await supabase
        .from("kpi_chart_points")
        .insert([
          {
            user_id,
            kpi_type: type,
            date: chartDate,
            value,
          },
        ]);
    }
    // After change, ensure charts update
    queryClient.invalidateQueries({ queryKey: ["kpi_chart_points"] });
    queryClient.invalidateQueries({ queryKey: ["kpi_chart_points", "all"] });
  }

  // Helper: Delete all chart points for {user_id, kpi_type}
  async function deleteChartPointsForType(type: string) {
    const { data: session } = await supabase.auth.getSession();
    const user_id = session.session?.user?.id;
    if (!user_id) return;
    // Delete only points in current month for type
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const firstOfMonth = `${yyyy}-${mm}-01`;
    await supabase
      .from("kpi_chart_points")
      .delete()
      .eq("user_id", user_id)
      .eq("kpi_type", type)
      .eq("date", firstOfMonth);

    queryClient.invalidateQueries({ queryKey: ["kpi_chart_points"] });
    queryClient.invalidateQueries({ queryKey: ["kpi_chart_points", "all"] });
  }

  // Unique color for each KPI (based on type)
  const kpiWithColor = useMemo(() => {
    const baseColors: Record<string, string> = {};
    let colorIdx = 0;
    (kpis || []).forEach((k) => {
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
      if (!baseColors[k.type]) {
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

  // Add new KPI
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
      date: format(new Date(), "yyyy-MM-dd"), // default today's date
    });
  };

  // Find row by type for editing
  const findKpiByType = (type: string) => (kpis || []).find((k) => k.type === type);

  // Edit handler: populate form with KPI data
  const handleEdit = (kpiType: string) => {
    const kpi = findKpiByType(kpiType);
    if (!kpi) return;
    setCustomizing(true);
    setEditingType(kpiType);
    setForm({
      type: kpi.type || "",
      label: kpi.display_value || "",
      value: kpi.value !== undefined ? String(kpi.value) : "",
      display_value: kpi.display_value || "",
      delta_display: kpi.delta_display || "",
      delta_type: kpi.delta_type || "increase",
      subtitle: kpi.subtitle || "",
      color: getDefaultColor(kpiWithColor.map((k) => k.color)),
      date: "", // Editing does not allow changing chart date (keep empty for now)
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType && allKpiTypes.length >= 10) {
      toast({
        title: "KPI Limit Reached",
        description: "You can only track up to 10 active KPIs at the same time.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    const { data: session } = await supabase.auth.getSession();
    const user_id = session.session?.user?.id;
    if (!user_id) {
      toast({ title: "No user ID found.", variant: "destructive" });
      setLoading(false);
      return;
    }

    if (editingType) {
      // Update mode
      toast({ title: "Updating KPI metric..." });
      // Get all matching rows to update (by type)
      const { data } = await supabase
        .from("kpi_metrics")
        .select("id")
        .eq("type", editingType);
      const ids = (data || []).map((row) => row.id);
      if (ids.length === 0) {
        toast({ title: "KPI not found." });
        setLoading(false);
        return;
      }
      const updateData: any = {
        value: Number(form.value || 0),
        display_value: form.display_value || null,
        delta_display: form.delta_display || null,
        delta_type: form.delta_type || null,
        subtitle: form.subtitle || null,
      };
      // Color and date are client only

      const { error } = await supabase
        .from("kpi_metrics")
        .update(updateData)
        .in("id", ids);

      setLoading(false);
      setCustomizing(false);
      setEditingType(null);
      if (error) {
        toast({
          title: "Error updating KPI",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "KPI updated successfully!" });
        // Optionally update chart point value for current month
        await upsertChartPointForType(editingType, Number(form.value || 0));
        // Refresh queries
        queryClient.invalidateQueries({ queryKey: ["kpi_metrics"] });
        queryClient.invalidateQueries({ queryKey: ["kpi_metrics_admin"] });
        queryClient.invalidateQueries({ queryKey: ["kpi_chart_points"] });
        queryClient.invalidateQueries({ queryKey: ["kpi_chart_points", "all"] });
      }
    } else {
      // Add new
      // Insert a first row for definition
      const insertType =
        form.type.trim() ||
        form.label.trim().toLowerCase().replace(/[^a-z0-9_]/gi, "_");
      const metricValue = Number(form.value || 0);
      const { error } = await supabase.from("kpi_metrics").insert([
        {
          user_id,
          type: insertType,
          value: metricValue,
          display_value: form.display_value || null,
          delta_display: form.delta_display || null,
          delta_type: form.delta_type || null,
          subtitle: form.subtitle || null,
        },
      ]);
      setLoading(false);
      setCustomizing(false);
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Custom KPI metric added!" });
        // Update to include custom date for chart points
        await upsertChartPointForType(insertType, metricValue, form.date);
        // Ensure chart data queries refresh as well as KPI lists
        queryClient.invalidateQueries({ queryKey: ["kpi_metrics"] });
        queryClient.invalidateQueries({ queryKey: ["kpi_metrics_admin"] });
        queryClient.invalidateQueries({ queryKey: ["kpi_chart_points"] });
        queryClient.invalidateQueries({ queryKey: ["kpi_chart_points", "all"] });
      }
    }
  };

  // Delete any KPI
  const handleDelete = async (kpiType: string) => {
    const { data } = await supabase
      .from("kpi_metrics")
      .select("id")
      .eq("type", kpiType);
    const ids = (data || []).map((row) => row.id);
    if (ids.length === 0) {
      toast({ title: "KPI not found." });
      return;
    }
    // Remove all occurrences of this KPI type
    const { error } = await supabase
      .from("kpi_metrics")
      .delete()
      .in("id", ids);
    if (error) {
      toast({
        title: "Error deleting KPI",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "KPI deleted" });
      // Also delete chart point(s) for this type in current month
      await deleteChartPointsForType(kpiType);
      queryClient.invalidateQueries({ queryKey: ["kpi_metrics"] });
      queryClient.invalidateQueries({ queryKey: ["kpi_metrics_admin"] });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center mb-3 justify-between">
          <div className="font-semibold">Your KPIs (max 10)</div>
          <Button
            size="sm"
            onClick={() => {
              setEditingType(null);
              handleCustomKpi();
            }}
            disabled={allKpiTypes.length >= 10 || customizing}
          >
            + Add Custom KPI
          </Button>
        </div>
        <KpiListTable
          kpis={kpiWithColor}
          isLoading={isLoading}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      {customizing && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 bg-card p-4 rounded-lg shadow mb-6"
        >
          <KpiMetricFormFields form={form} onChange={handleChange} />
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? (editingType ? "Saving..." : "Saving...") : editingType ? "Update KPI" : "Add KPI Metric"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCustomizing(false);
                setEditingType(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
