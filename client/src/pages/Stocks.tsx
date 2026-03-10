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
    return <div className="p-6">Loading stocks...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Failed to load stocks</div>;
  }

  const stocks = Array.isArray(data) ? data : [];

  const filteredStocks = stocks.filter((stock: any) =>
    stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
    stock.name.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Stocks
      </h1>

      {/* SEARCH BAR */}

      <input
        type="text"
        placeholder="Search stocks (e.g. RELIANCE)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-4 py-2 w-full mb-4"
      />

      <div className="grid gap-3">

        {filteredStocks.map((stock: any) => (

          <div
            key={stock.id}
            onClick={() => navigate(`/stock/${stock.symbol}`)}
            className="border rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition"
          >

            <div className="flex justify-between items-center">

              <div>
                <p className="font-semibold">{stock.symbol}</p>
                <p className="text-sm text-gray-500">{stock.name}</p>
              </div>

              <div className="text-right">

                <p className="font-bold text-lg">
                  ₹{Number(stock.price || 0).toFixed(2)}
                </p>

                <p
                  className={`text-sm ${
                    Number(stock.change) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {Number(stock.change || 0).toFixed(2)} (
                  {Number(stock.changePercent || 0).toFixed(2)}%)
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}