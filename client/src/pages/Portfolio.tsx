import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Portfolio() {

  const { data, isLoading } = useQuery({
    queryKey: ["/api/portfolio"],
    queryFn: async () => {
      const res = await fetch("/api/portfolio");
      return res.json();
    },
    refetchInterval: 5000
  });

  if (isLoading) {
    return <div className="p-6">Loading portfolio...</div>;
  }

  const portfolio = Array.isArray(data) ? data : [];

  let totalInvested = 0;
  let totalValue = 0;

  portfolio.forEach((p: any) => {

    const invested =
      Number(p.avgBuyPrice) * Number(p.quantity);

    const current =
      Number(p.stock.price) * Number(p.quantity);

    totalInvested += invested;
    totalValue += current;

  });

  const pnl = totalValue - totalInvested;

  const chartData = portfolio.map((p: any) => ({
    name: p.stock.symbol,
    value: Number(p.stock.price) * Number(p.quantity)
  }));

  return (

    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Portfolio Dashboard
      </h1>

      {/* SUMMARY */}

      <div className="grid grid-cols-3 gap-4">

        <div className="border p-4 rounded-xl">
          <p className="text-sm text-gray-500">
            Invested
          </p>
          <p className="text-xl font-bold">
            ₹{totalInvested.toFixed(2)}
          </p>
        </div>

        <div className="border p-4 rounded-xl">
          <p className="text-sm text-gray-500">
            Current Value
          </p>
          <p className="text-xl font-bold">
            ₹{totalValue.toFixed(2)}
          </p>
        </div>

        <div className="border p-4 rounded-xl">
          <p className="text-sm text-gray-500">
            Profit / Loss
          </p>
          <p
            className={`text-xl font-bold ${
              pnl >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ₹{pnl.toFixed(2)}
          </p>
        </div>

      </div>

      {/* PORTFOLIO GRAPH */}

      <div className="border rounded-xl p-4">

        <h2 className="font-semibold mb-4">
          Portfolio Value
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={3}
            />

          </LineChart>
        </ResponsiveContainer>

      </div>

    </div>

  );

}