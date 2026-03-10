import { useQuery } from "@tanstack/react-query";
import CountUp from "react-countup";
import MarketHeatmap from "@/components/MarketHeatmap";
import { useState, useEffect } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function Dashboard() {

  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    queryFn: async () => {
      const res = await fetch("/api/me");
      if (!res.ok) return { balance: 0 };
      return res.json();
    }
  });

  const { data: portfolio } = useQuery({
    queryKey: ["/api/portfolio"],
    queryFn: async () => {
      const res = await fetch("/api/portfolio");
      if (!res.ok) return [];
      return res.json();
    },
    refetchInterval: 5000
  });

  const holdings = Array.isArray(portfolio) ? portfolio : [];

  let invested = 0;
  let value = 0;

  holdings.forEach((h: any) => {

    const qty = Number(h.quantity || 0);
    const avg = Number(h.avgBuyPrice || 0);
    const cur = Number(h.currentValue || 0);

    invested += avg * qty;
    value += cur;

  });

  const pnl = value - invested;

  const allocation = holdings.map((h: any) => ({
    name: h.stock?.symbol || "Stock",
    value: Number(h.currentValue || 0)
  }));

  const COLORS = [
    "#10b981",
    "#3b82f6",
    "#6366f1",
    "#f59e0b",
    "#ef4444",
    "#14b8a6"
  ];

  const [history, setHistory] = useState<
    { time: string; value: number }[]
  >([]);

  useEffect(() => {

    if (!value) return;

    const time = new Date().toLocaleTimeString();

    setHistory(prev => {

      const updated = [...prev, { time, value }];

      if (updated.length > 20) {
        updated.shift();
      }

      return updated;

    });

  }, [value]);

  let insight = "Your portfolio is currently neutral.";

  if (pnl > 0) {
    insight =
      "Your portfolio is profitable. You may consider partial profit booking.";
  }

  if (pnl < 0) {
    insight =
      "Your portfolio is currently in loss. Long-term holding may help recovery.";
  }

  if (portfolio === undefined) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (

    <div className="p-6 space-y-8">

      <h1 className="text-2xl font-bold">
        Trading Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Wallet Balance</p>
          <p className="text-xl font-bold">
            ₹
            <CountUp
              end={Number(user?.balance || 0)}
              duration={1}
              decimals={2}
              separator=","
            />
          </p>
        </div>

        <div className="border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Invested</p>
          <p className="text-xl font-bold">
            ₹
            <CountUp
              end={invested}
              duration={1}
              decimals={2}
              separator=","
            />
          </p>
        </div>

        <div className="border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Portfolio Value</p>
          <p className="text-xl font-bold">
            ₹
            <CountUp
              end={value}
              duration={1}
              decimals={2}
              separator=","
            />
          </p>
        </div>

        <div className="border rounded-xl p-4 shadow-sm">

          <p className="text-sm text-gray-500">Profit / Loss</p>

          <p
            className={
              "text-xl font-bold " +
              (pnl > 0
                ? "text-green-600"
                : pnl < 0
                ? "text-red-600"
                : "text-gray-600")
            }
          >
            ₹
            <CountUp
              end={pnl}
              duration={1}
              decimals={2}
              separator=","
            />
          </p>

        </div>

      </div>

      <div className="border rounded-xl p-6 shadow-sm">

        <h2 className="text-lg font-semibold mb-4">
          Portfolio Growth
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <LineChart data={history}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="time" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      <div className="border rounded-xl p-6 shadow-sm">

        <h2 className="text-lg font-semibold mb-4">
          Portfolio Allocation
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <PieChart>

            <Pie
              data={allocation}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >

              {allocation.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

      <div className="border rounded-xl p-6 shadow-sm">

        <h2 className="text-lg font-semibold mb-2">
          Portfolio Insight
        </h2>

        <p className="text-gray-600">
          {insight}
        </p>

      </div>

      <div className="border rounded-xl p-6 shadow-sm">

        <h2 className="text-lg font-semibold mb-4">
          Your Holdings
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>

              <tr className="border-b text-left">

                <th className="py-2">Stock</th>
                <th>Qty</th>
                <th>Avg Price</th>
                <th>Value</th>
                <th>PnL</th>

              </tr>

            </thead>

            <tbody>

              {holdings.map((h: any) => {

                const pnl =
                  Number(h.currentValue) -
                  Number(h.avgBuyPrice) * Number(h.quantity);

                return (

                  <tr
                    key={h.stock.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="py-2 font-semibold">
                      {h.stock.symbol}
                    </td>

                    <td>{h.quantity}</td>

                    <td>₹{Number(h.avgBuyPrice).toFixed(2)}</td>

                    <td>₹{Number(h.currentValue).toFixed(2)}</td>

                    <td
                      className={
                        pnl >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      ₹{pnl.toFixed(2)}
                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

      </div>

      <div className="border rounded-xl p-6 shadow-sm">

        <h2 className="text-lg font-semibold mb-4">
          Market Heatmap
        </h2>

        <MarketHeatmap />

      </div>

    </div>

  );

}