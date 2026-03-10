import { useQuery } from "@tanstack/react-query";

export default function MarketTicker() {

  const { data } = useQuery({
    queryKey: ["/api/stocks"],
    queryFn: async () => {
      const res = await fetch("/api/stocks");
      return res.json();
    },
    refetchInterval: 5000
  });

  const stocks = Array.isArray(data) ? data.slice(0, 10) : [];

  return (

    <div className="bg-black text-white overflow-hidden whitespace-nowrap py-2">

      <div className="animate-marquee inline-block">

        {stocks.map((s: any) => (

          <span key={s.id} className="mx-6">

            {s.symbol} ₹{Number(s.price).toFixed(2)}

            <span
              className={
                Number(s.changePercent) >= 0
                  ? "text-green-400 ml-1"
                  : "text-red-400 ml-1"
              }
            >
              {Number(s.changePercent) >= 0 ? "▲" : "▼"}
            </span>

          </span>

        ))}

      </div>

    </div>

  );

}