import { useMemo } from "react";

export default function MarketDepth({ price }: { price: number }) {

  const depth = useMemo(() => {

    const buys = [];
    const sells = [];

    for (let i = 1; i <= 5; i++) {

      buys.push({
        price: price - i * 2,
        qty: Math.floor(Math.random() * 50 + 1)
      });

      sells.push({
        price: price + i * 2,
        qty: Math.floor(Math.random() * 50 + 1)
      });

    }

    return { buys, sells };

  }, [price]);

  return (

    <div className="border rounded-xl p-4">

      <h3 className="font-semibold mb-3">
        Market Depth
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm">

        {/* BUY SIDE */}

        <div>

          <p className="font-semibold text-green-600 mb-2">
            Buy Orders
          </p>

          {depth.buys.map((b, i) => (

            <div key={i} className="flex justify-between">

              <span>₹{b.price.toFixed(2)}</span>
              <span>{b.qty}</span>

            </div>

          ))}

        </div>

        {/* SELL SIDE */}

        <div>

          <p className="font-semibold text-red-600 mb-2">
            Sell Orders
          </p>

          {depth.sells.map((s, i) => (

            <div key={i} className="flex justify-between">

              <span>₹{s.price.toFixed(2)}</span>
              <span>{s.qty}</span>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}