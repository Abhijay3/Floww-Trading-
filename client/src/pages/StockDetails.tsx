import { useRoute } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";

export default function StockDetails() {

  const [, params] = useRoute("/stock/:symbol");
  const symbol = params?.symbol;

  const chartRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const { data: stocks } = useQuery({
    queryKey: ["/api/stocks"],
    queryFn: async () => {
      const res = await fetch("/api/stocks");
      return res.json();
    },
    refetchInterval: 5000
  });

  const stock = Array.isArray(stocks)
    ? stocks.find((s: any) => s.symbol === symbol)
    : null;

  useEffect(() => {

    if (!chartRef.current || !symbol) return;

    chartRef.current.innerHTML = "";

    const script = document.createElement("script");

    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `NSE:${symbol}`,
      interval: "D",
      timezone: "Asia/Kolkata",
      theme: "light",
      style: "1",
      locale: "en",
      hide_top_toolbar: false,
      allow_symbol_change: false
    });

    chartRef.current.appendChild(script);

  }, [symbol]);

  if (!stock) {
    return <div className="p-6">Stock not found</div>;
  }

  async function buyStock() {

    setLoading(true);

    await fetch("/api/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol: stock.symbol,
        quantity
      })
    });

    await queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });

    setLoading(false);

    alert("Stock purchased");

  }

  async function sellStock() {

    setLoading(true);

    await fetch("/api/sell", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol: stock.symbol,
        quantity
      })
    });

    await queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });

    setLoading(false);

    alert("Stock sold");

  }

  const total = Number(stock.price) * quantity;

  return (

    <div className="p-6 space-y-8">

      <div>
        <h1 className="text-3xl font-bold">{stock.symbol}</h1>
        <p className="text-gray-500">{stock.name}</p>
      </div>

      {/* TRADINGVIEW CHART */}

      <div className="border rounded-xl h-[500px]">

        <div
          ref={chartRef}
          className="h-full w-full"
        />

      </div>

      {/* ORDER PANEL */}

      <div className="border rounded-xl p-6 space-y-4">

        <div className="flex justify-between">
          <p>Current Price</p>
          <p className="font-bold">
            ₹{Number(stock.price).toFixed(2)}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <p>Quantity</p>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded px-3 py-1 w-24"
          />

        </div>

        <div className="flex justify-between">
          <p>Order Value</p>
          <p className="font-bold">
            ₹{total.toFixed(2)}
          </p>
        </div>

        <div className="flex gap-4">

          <button
            onClick={buyStock}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Buy
          </button>

          <button
            onClick={sellStock}
            disabled={loading}
            className="bg-red-600 text-white px-6 py-2 rounded-lg"
          >
            Sell
          </button>

        </div>

      </div>

    </div>

  );

}