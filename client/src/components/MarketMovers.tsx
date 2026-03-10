import { useQuery } from "@tanstack/react-query";

export default function MarketMovers() {

  const { data } = useQuery({
    queryKey: ["/api/stocks"],
    queryFn: async () => {
      const res = await fetch("/api/stocks");
      return res.json();
    },
    refetchInterval: 5000
  });

  const stocks = Array.isArray(data) ? data : [];

  const gainers = [...stocks]
    .sort((a: any, b: any) => Number(b.changePercent) - Number(a.changePercent))
    .slice(0, 5);

  const losers = [...stocks]
    .sort((a: any, b: any) => Number(a.changePercent) - Number(b.changePercent))
    .slice(0, 5);

  return (

    <div className="grid md:grid-cols-2 gap-8">

      {/* TOP GAINERS */}

      <div>

        <h3 className="text-lg font-semibold mb-4 text-green-600">
          Top Gainers
        </h3>

        <div className="space-y-3">

          {gainers.map((s: any) => (

            <div
              key={s.id}
              className="flex justify-between border rounded-lg p-3"
            >

              <div>
                <p className="font-semibold">{s.symbol}</p>
                <p className="text-xs text-gray-500">{s.name}</p>
              </div>

              <div className="text-right text-green-600 font-semibold">
                {Number(s.changePercent).toFixed(2)}%
              </div>

            </div>

          ))}

        </div>

      </div>

      {/* TOP LOSERS */}

      <div>

        <h3 className="text-lg font-semibold mb-4 text-red-600">
          Top Losers
        </h3>

        <div className="space-y-3">

          {losers.map((s: any) => (

            <div
              key={s.id}
              className="flex justify-between border rounded-lg p-3"
            >

              <div>
                <p className="font-semibold">{s.symbol}</p>
                <p className="text-xs text-gray-500">{s.name}</p>
              </div>

              <div className="text-right text-red-600 font-semibold">
                {Number(s.changePercent).toFixed(2)}%
              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}