import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState } from "react";

export default function Stocks() {

  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/stocks"],
    queryFn: async () => {

      const res = await fetch("/api/stocks");

      if (!res.ok) {
        throw new Error("Failed to fetch stocks");
      }

      return res.json();

    },

    refetchInterval: 5000

  });

  if (isLoading) {
    return (
      <div className="p-6 text-gray-500">
        Loading stocks...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load stocks
      </div>
    );
  }

  const stocks = Array.isArray(data) ? data : [];

  const filteredStocks = stocks.filter((stock: any) =>
    stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
    stock.name.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Market Stocks
      </h1>

      <input
        type="text"
        placeholder="Search stocks (e.g. RELIANCE)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-4 py-2 w-full max-w-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        <table className="w-full text-sm">

          <thead className="border-b bg-gray-50 text-gray-600">

            <tr>

              <th className="text-left py-3 px-4">
                Symbol
              </th>

              <th className="text-left">
                Name
              </th>

              <th className="text-right">
                Price
              </th>

              <th className="text-right pr-4">
                Change
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredStocks.length === 0 && (

              <tr>

                <td
                  colSpan={4}
                  className="py-6 text-center text-gray-500"
                >
                  No stocks found
                </td>

              </tr>

            )}

            {filteredStocks.map((stock: any) => (

              <tr
                key={stock.id}
                onClick={() => navigate(`/stock/${stock.symbol}`)}
                className="border-b hover:bg-gray-50 cursor-pointer"
              >

                <td className="py-3 px-4 font-semibold">
                  {stock.symbol}
                </td>

                <td className="text-gray-500">
                  {stock.name}
                </td>

                <td className="text-right font-medium tabular-nums">
                  ₹{Number(stock.price || 0).toFixed(2)}
                </td>

                <td
                  className={
                    "text-right pr-4 font-medium " +
                    (Number(stock.change) >= 0
                      ? "text-green-600"
                      : "text-red-600")
                  }
                >
                  {Number(stock.change || 0).toFixed(2)} (
                  {Number(stock.changePercent || 0).toFixed(2)}%)
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}