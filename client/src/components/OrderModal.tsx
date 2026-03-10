import { useState } from "react";

export default function OrderModal({
  stock,
  type,
  onClose
}: any) {

  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const price = Number(stock.price || 0);
  const value = price * qty;

  const placeOrder = async () => {

    setLoading(true);

    const endpoint =
      type === "BUY"
        ? `/api/stocks/${stock.id}/buy`
        : `/api/stocks/${stock.id}/sell`;

    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quantity: qty
      })
    });

    setLoading(false);
    onClose();

  };

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-96 space-y-4">

        <h2 className="text-lg font-bold">
          {type} {stock.symbol}
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
          Price: ₹{price.toFixed(2)}
        </div>

        <div className="text-sm">
          Order Value: ₹{value.toFixed(2)}
        </div>

        <div className="flex gap-2">

          <button
            onClick={onClose}
            className="border w-full py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={placeOrder}
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              type === "BUY"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            Confirm
          </button>

        </div>

      </div>

    </div>

  );

}