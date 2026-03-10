import { useQuery } from "@tanstack/react-query";

export default function Transactions() {
  const { data } = useQuery({
    queryKey: ["/api/transactions"]
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Transactions</h1>

      {data?.map((tx: any) => (
        <div key={tx.id} className="border p-3 mb-2 rounded">
          <p>{tx.type}</p>
          <p>Quantity: {tx.quantity}</p>
          <p>Total: ${tx.totalAmount}</p>
        </div>
      ))}
    </div>
  );
}