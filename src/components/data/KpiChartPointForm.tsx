import { useState, useEffect } from "react";
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

type ChartPoint = {
  id: string;
  date: string;
  value: number;
};

export default function KpiChartPointForm() {
  const [form, setForm] = useState({
    kpi_type: "revenue",
    date: "",
    value: "",
  });
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // For customers list
  const [customerPoints, setCustomerPoints] = useState<ChartPoint[]>([]);
  const [fetchingPoints, setFetchingPoints] = useState(false);

  // For editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ date: string; value: string }>({
    date: "",
    value: ""
  });
  const [editLoading, setEditLoading] = useState(false);

  const queryClient = useQueryClient();

  // Get user_id on mount for subsequent queries
  useEffect(() => {
    supabase.auth.getSession().then(({ data: userSession }) => {
      setUserId(userSession.session?.user?.id ?? null);
    });
  }, []);

  // Fetch all customers chart points for current user
  const fetchCustomerPoints = async (uid = userId) => {
    if (!uid) return;
    setFetchingPoints(true);
    const { data, error } = await supabase
      .from("kpi_chart_points")
      .select("id,date,value")
      .eq("user_id", uid)
      .eq("kpi_type", "customers")
      .order("date", { ascending: true });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setCustomerPoints(data || []);
    }
    setFetchingPoints(false);
  };

  useEffect(() => {
    if (userId) fetchCustomerPoints(userId);
    // eslint-disable-next-line
  }, [userId]);

  const refreshData = () => {
    if (userId) fetchCustomerPoints(userId);
    queryClient.invalidateQueries({ queryKey: ["kpi_chart_points"] });
    queryClient.invalidateQueries({ queryKey: ["kpi_chart_points", "all"] });
  };

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
      refreshData();
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    setEditLoading(true);
    const { error } = await supabase
      .from("kpi_chart_points")
      .delete()
      .eq("id", id);
    setEditLoading(false);
    if (error) {
      toast({ title: "Error deleting point", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Chart data point deleted!" });
      refreshData();
    }
  };

  // Start editing a row
  const handleEdit = (point: ChartPoint) => {
    setEditingId(point.id);
    setEditForm({ date: point.date, value: String(point.value) });
  };

  // Save edit
  const handleEditSave = async () => {
    if (!editingId) return;
    setEditLoading(true);
    const { error } = await supabase
      .from("kpi_chart_points")
      .update({
        date: editForm.date,
        value: Number(editForm.value),
      })
      .eq("id", editingId);
    setEditLoading(false);
    if (error) {
      toast({ title: "Error updating point", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Chart data point updated!" });
      setEditingId(null);
      refreshData();
    }
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({ date: "", value: "" });
  };

  return (
    <div>
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

      {/* Customers data point management */}
      <div className="mt-8">
        <div className="font-semibold mb-2">Your "Customers" Data Points</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border">
            <thead>
              <tr className="bg-muted">
                <th className="py-1 px-2 border">Date</th>
                <th className="py-1 px-2 border">Value</th>
                <th className="py-1 px-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fetchingPoints ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">Loading...</td>
                </tr>
              ) : customerPoints.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-muted-foreground text-center py-4">No data points yet.</td>
                </tr>
              ) : (
                customerPoints.map(point => (
                  <tr key={point.id}>
                    {/* If editing this row, show form */}
                    {editingId === point.id ? (
                      <>
                        <td className="px-2 border">
                          <Input
                            type="date"
                            value={editForm.date}
                            onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))}
                          />
                        </td>
                        <td className="px-2 border">
                          <Input
                            type="number"
                            value={editForm.value}
                            onChange={e => setEditForm(f => ({ ...f, value: e.target.value }))}
                          />
                        </td>
                        <td className="px-2 border flex gap-2">
                          <Button
                            size="sm"
                            type="button"
                            disabled={editLoading}
                            onClick={handleEditSave}
                          >Save</Button>
                          <Button
                            size="sm"
                            type="button"
                            variant="outline"
                            disabled={editLoading}
                            onClick={handleEditCancel}
                          >Cancel</Button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-2 border">{point.date}</td>
                        <td className="px-2 border">{point.value}</td>
                        <td className="px-2 border flex gap-2">
                          <Button size="sm" type="button" disabled={editLoading} onClick={() => handleEdit(point)}>Edit</Button>
                          <Button size="sm" type="button" variant="destructive" disabled={editLoading} onClick={() => handleDelete(point.id)}>Delete</Button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
