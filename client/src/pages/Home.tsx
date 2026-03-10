import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import HeroChart from "@/components/HeroCharts";
import MarketHeatmap from "@/components/MarketHeatmap";
import MarketMovers from "@/components/MarketMovers";
import Sparkline from "@/components/Sparkline";

export function Home() {

  const [, navigate] = useLocation();

  const { data } = useQuery({
    queryKey: ["/api/stocks"],
    queryFn: async () => {
      const res = await fetch("/api/stocks");
      return res.json();
    },
    refetchInterval: 5000
  });

  const stocks = Array.isArray(data) ? data.slice(0, 6) : [];

  return (

    <div className="space-y-24">

      {/* HERO SECTION */}

      <div className="relative overflow-hidden bg-gradient-to-r from-green-50 to-blue-50 py-28">

        <HeroChart />

        <div className="relative max-w-6xl mx-auto text-center px-6">

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold mb-6"
          >
            Trade Stocks Like a Pro
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 mb-8"
          >
            Real-time trading platform with live market data,
            portfolio analytics and smart investing tools.
          </motion.p>

          <div className="flex justify-center gap-4">

            <button
              onClick={() => navigate("/stocks")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Explore Markets
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="border px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Open Dashboard
            </button>

          </div>

        </div>

      </div>

      {/* LIVE MARKET */}

      <div className="px-8 max-w-6xl mx-auto">

        <h2 className="text-2xl font-bold mb-6">
          Live Market Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {stocks.map((s: any) => {

            const positive = Number(s.changePercent) >= 0;

            return (

              <motion.div
                key={s.id}
                whileHover={{ scale: 1.05 }}
                className="border rounded-xl p-6 cursor-pointer shadow-sm hover:shadow-md transition"
                onClick={() => navigate(`/stock/${s.symbol}`)}
              >

                <div className="flex justify-between mb-3">

                  <div>

                    <p className="font-semibold">
                      {s.symbol}
                    </p>

                    <p className="text-sm text-gray-500">
                      {s.name}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="font-bold">
                      ₹{Number(s.price).toFixed(2)}
                    </p>

                    <p
                      className={`text-sm ${
                        positive
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {Number(s.changePercent).toFixed(2)}%
                    </p>

                  </div>

                </div>

                {/* MINI CHART */}

                <Sparkline positive={positive} />

              </motion.div>

            );

          })}

        </div>

      </div>

      {/* HEATMAP */}

      <div className="px-8 max-w-6xl mx-auto">

        <h2 className="text-2xl font-bold mb-6">
          Market Heatmap
        </h2>

        <MarketHeatmap />

      </div>

      {/* GAINERS / LOSERS */}

      <div className="px-8 max-w-6xl mx-auto">

        <h2 className="text-2xl font-bold mb-6">
          Market Movers
        </h2>

        <MarketMovers />

      </div>

      {/* FEATURES */}

      <div className="max-w-6xl mx-auto px-8">

        <h2 className="text-2xl font-bold mb-8">
          Why Our Trading Platform
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="border rounded-xl p-6 hover:shadow-md transition">

            <h3 className="font-semibold mb-2">
              ⚡ Fast Order Execution
            </h3>

            <p className="text-gray-600">
              Execute trades instantly with our optimized trading engine.
            </p>

          </div>

          <div className="border rounded-xl p-6 hover:shadow-md transition">

            <h3 className="font-semibold mb-2">
              📊 Live Market Data
            </h3>

            <p className="text-gray-600">
              Get real-time stock prices and portfolio updates.
            </p>

          </div>

          <div className="border rounded-xl p-6 hover:shadow-md transition">

            <h3 className="font-semibold mb-2">
              🔒 Secure Wallet
            </h3>

            <p className="text-gray-600">
              Safely deposit and withdraw funds with transaction history.
            </p>

          </div>

        </div>

      </div>

      {/* CTA */}

      <div className="bg-green-600 text-white py-20 text-center">

        <h2 className="text-3xl font-bold mb-4">
          Start Trading Today
        </h2>

        <p className="mb-6">
          Join thousands of investors building wealth.
        </p>

        <button
          onClick={() => navigate("/stocks")}
          className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
        >
          View Markets
        </button>

      </div>

    </div>

  );

}