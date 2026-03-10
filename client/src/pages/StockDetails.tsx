import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useState } from "react";
import StockChart from "@/components/StockChart";
import MarketDepth from "@/components/MarketDepth";
import OrderModal from "@/components/OrderModal";

export default function StockDetails() {

  const [, params] = useRoute("/stock/:symbol");
  const symbol = params?.symbol;

  const [qty, setQty] = useState<number>(1);
  const [orderType, setOrderType] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/stocks"],
    queryFn: async () => {

      const res = await fetch("/api/stocks");

      if (!res.ok) {
        throw new Error("Failed to load stocks");
      }

      return res.json();

    },
    refetchInterval: 5000
  });

  if (isLoading) {
    return <div className="p-6">Loading stock...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Failed to load stock</div>;
  }

  const stock = data?.find((s: any) => s.symbol === symbol);

  if (!stock) {
    return <div className="p-6">Stock not found</div>;
  }

  const price = Number(stock.price || 0);
  const orderValue = price * qty;

  return (

    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold">
        {stock.symbol} - {stock.name}
      </h1>

      <div className="grid grid-cols-3 gap-6">

        {/* LEFT SIDE */}

        <div className="col-span-2 space-y-6">

          {/* PRICE */}

          <div className="border rounded-xl p-4">

            <div className="text-xl font-bold">
              ₹{price.toFixed(2)}
            </div>

            <div
              className={`${
                Number(stock.changePercent) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {Number(stock.change || 0).toFixed(2)} (
              {Number(stock.changePercent || 0).toFixed(2)}%)
            </div>

          </div>

          {/* CHART */}

          <div className="border rounded-xl p-4">
            <StockChart symbol={symbol} />
          </div>

          {/* MARKET DEPTH */}

          <MarketDepth price={price} />

        </div>

        {/* TRADE PANEL */}

        <div className="border rounded-xl p-4 space-y-4">

          <h2 className="font-semibold text-lg">
            Trade
          </h2>

          <div>

            <p className="text-sm text-gray-500">
              Quantity
            </p>

            <input
              type="number"
              value={qty}
              min={1}
              onChange={(e) => setQty(Number(e.target.value))}
              className="border rounded w-full p-2 mt-1"
            />

          </div>

          <div className="text-sm">
            Price: <b>₹{price.toFixed(2)}</b>
          </div>

          <div className="text-sm">
            Order Value: <b>₹{orderValue.toFixed(2)}</b>
          </div>

          <div className="flex gap-2">

            <button
              onClick={() => setOrderType("BUY")}
              className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
            >
              Buy
            </button>

            <button
              onClick={() => setOrderType("SELL")}
              className="bg-red-600 text-white w-full py-2 rounded hover:bg-red-700"
            >
              Sell
            </button>

          </div>

        </div>

      </div>

      {/* ORDER MODAL */}

      {orderType && (
        <OrderModal
          stock={stock}
          type={orderType}
          quantity={qty}
          onClose={() => setOrderType(null)}
        />
      )}

    </div>

  );

}