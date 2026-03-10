import { useQuery } from "@tanstack/react-query";

export default function MarketHeatmap() {

  const { data } = useQuery({
    queryKey: ["/api/stocks"],
    queryFn: async () => {
      const res = await fetch("/api/stocks");
      return res.json();
    },
    refetchInterval: 5000
  });

  const stocks = Array.isArray(data) ? data.slice(0, 20) : [];

  return (

    <div className="grid grid-cols-5 gap-2">

      {stocks.map((s: any) => {

        const positive = Number(s.changePercent) >= 0;

        return (

          <div
            key={s.id}
            className={`p-4 rounded-lg text-white text-sm font-semibold
            ${positive ? "bg-green-500" : "bg-red-500"}`}
          >

            <div>{s.symbol}</div>

            <div className="text-xs opacity-80">
              {Number(s.changePercent).toFixed(2)}%
            </div>

          </div>

        );

      })}

    </div>

  );

}