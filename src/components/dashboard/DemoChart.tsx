
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", Revenue: 12000 },
  { name: "Feb", Revenue: 10000 },
  { name: "Mar", Revenue: 16700 },
  { name: "Apr", Revenue: 15000 },
  { name: "May", Revenue: 18300 },
  { name: "Jun", Revenue: 14500 },
];

export default function DemoChart() {
  return (
    <div className="bg-card rounded-lg shadow p-4 w-full max-w-[500px] h-[260px] flex flex-col items-start">
      <div className="font-semibold mb-2">Monthly Revenue</div>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#999" />
          <YAxis stroke="#999" />
          <Tooltip />
          <Bar dataKey="Revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
