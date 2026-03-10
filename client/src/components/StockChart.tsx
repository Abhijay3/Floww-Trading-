import { useEffect, useRef, useState } from "react";

export default function StockChart({ symbol }: { symbol: string }) {

  const [interval, setIntervalValue] = useState("D");
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    if (!chartRef.current) return;

    chartRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {

      new (window as any).TradingView.widget({
        container_id: "tv_chart",
        width: "100%",
        height: 500,
        symbol: `NSE:${symbol}`,
        interval: interval,
        timezone: "Asia/Kolkata",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#1e1e1e",
        allow_symbol_change: false
      });

    };

    document.body.appendChild(script);

  }, [symbol, interval]);

  return (

    <div>

      {/* TIMEFRAME BUTTONS */}

      <div className="flex gap-2 mb-4">

        <button
          onClick={() => setIntervalValue("5")}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          1D
        </button>

        <button
          onClick={() => setIntervalValue("60")}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          1W
        </button>

        <button
          onClick={() => setIntervalValue("D")}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          1M
        </button>

        <button
          onClick={() => setIntervalValue("W")}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          1Y
        </button>

      </div>

      {/* CHART */}

      <div
        id="tv_chart"
        ref={chartRef}
        className="w-full"
      />

    </div>

  );

}