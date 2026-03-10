import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

export default function Watchlist() {

  const [, navigate] = useLocation();

  const { data } = useQuery({
    queryKey: ["/api/watchlist"],
    queryFn: async () => {
      const res = await fetch("/api/watchlist");
      return res.json();
    },
    refetchInterval: 5000
  });

  const stocks = Array.isArray(data) ? data : [];

  return (

    <div className="w-64 border-r h-screen p-4 bg-white">

      <h2 className="font-semibold mb-4">
        Watchlist
      </h2>

      <div className="space-y-3">

        {stocks.map((s: any) => (

          <div
            key={s.stock.id}
            onClick={() => navigate(`/stock/${s.stock.symbol}`)}
            className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
          >

            <div>

              <p className="font-semibold text-sm">
                {s.stock.symbol}
              </p>

              <p className="text-xs text-gray-500">
                {s.stock.name}
              </p>

            </div>

            <div className="text-right">

              <p className="text-sm font-semibold">
                ₹{Number(s.stock.price).toFixed(2)}
              </p>

              <p
                className={`text-xs ${
                  Number(s.stock.changePercent) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {Number(s.stock.changePercent).toFixed(2)}%
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}