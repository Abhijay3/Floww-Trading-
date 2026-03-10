import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

export default function PortfolioChart({ value }: { value: number }) {

  const data = [
    { day: "Mon", value: value * 0.9 },
    { day: "Tue", value: value * 0.92 },
    { day: "Wed", value: value * 0.95 },
    { day: "Thu", value: value * 0.97 },
    { day: "Fri", value: value }
  ];

  return (

    <div className="border rounded-xl p-6 card-shadow">

      <h2 className="text-lg font-semibold mb-4">
        Portfolio Performance
      </h2>

      <ResponsiveContainer width="100%" height={250}>

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#16a34a"
            strokeWidth={3}
            dot={false}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

}