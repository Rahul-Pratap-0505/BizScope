
import { Input } from "@/components/ui/input";

type FormState = {
  type: string;
  label: string;
  value: string;
  display_value: string;
  delta_display: string;
  delta_type: string;
  subtitle: string;
  color: string;
};
type KpiMetricFormFieldsProps = {
  form: FormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

export default function KpiMetricFormFields({ form, onChange }: KpiMetricFormFieldsProps) {
  return (
    <>
      <label>
        KPI Label
        <Input
          name="label"
          value={form.label}
          onChange={onChange}
          maxLength={20}
          placeholder="e.g. Return Customers"
          required
        />
      </label>
      <label>
        Type (short, unique ID)
        <Input
          name="type"
          value={form.type}
          onChange={onChange}
          maxLength={24}
          placeholder="e.g. return_customers"
        />
      </label>
      <label>
        Color
        <Input
          name="color"
          type="color"
          value={form.color}
          onChange={onChange}
        />
      </label>
      <label>
        Value
        <Input
          name="value"
          type="number"
          required
          value={form.value}
          onChange={onChange}
        />
      </label>
      <label>
        Delta Display (%)
        <Input
          name="delta_display"
          type="text"
          value={form.delta_display}
          placeholder="e.g. +8%"
          onChange={onChange}
          maxLength={8}
          required
        />
      </label>
      <label>
        Delta Type
        <select
          name="delta_type"
          value={form.delta_type}
          onChange={onChange}
          className="border rounded p-2"
          required
        >
          <option value="increase">Increase</option>
          <option value="decrease">Decrease</option>
        </select>
      </label>
    </>
  );
}
