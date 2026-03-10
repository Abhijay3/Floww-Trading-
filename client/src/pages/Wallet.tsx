import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function Wallet() {

const [amount, setAmount] = useState("");
const queryClient = useQueryClient();

/* USER */

const { data: user } = useQuery({
queryKey: ["user"],
queryFn: async () => {
const res = await fetch("/api/auth/me", {
credentials: "include"
});
return res.json();
}
});

/* TRANSACTIONS */

const { data: transactions } = useQuery({
queryKey: ["transactions"],
queryFn: async () => {
const res = await fetch("/api/transactions", {
credentials: "include"
});
return res.json();
}
});

const deposit = async () => {


const value = Number(amount);
if (!value || value <= 0) return;

await fetch("/api/wallet/deposit", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ amount: value })
});

setAmount("");

queryClient.invalidateQueries({ queryKey: ["user"] });
queryClient.invalidateQueries({ queryKey: ["transactions"] });


};

const withdraw = async () => {


const value = Number(amount);
if (!value || value <= 0) return;

await fetch("/api/wallet/withdraw", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ amount: value })
});

setAmount("");

queryClient.invalidateQueries({ queryKey: ["user"] });
queryClient.invalidateQueries({ queryKey: ["transactions"] });


};

const tx = Array.isArray(transactions) ? transactions : [];

return (


<div className="p-6 space-y-6">

  <h1 className="text-2xl font-bold">Wallet</h1>

  {/* BALANCE */}

  <div className="border rounded-xl p-6">

    <p className="text-gray-500">
      Current Balance
    </p>

    <p className="text-3xl font-bold">
      ₹{Number(user?.balance || 0).toFixed(2)}
    </p>

  </div>

  {/* ADD / WITHDRAW */}

  <div className="border rounded-xl p-6 space-y-4">

    <h2 className="font-semibold text-lg">
      Add or Withdraw Funds
    </h2>

    <input
      type="number"
      value={amount}
      placeholder="Enter amount"
      onChange={(e) => setAmount(e.target.value)}
      className="border rounded p-2 w-full"
    />

    <div className="flex gap-2">

      <button
        onClick={deposit}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Deposit
      </button>

      <button
        onClick={withdraw}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Withdraw
      </button>

    </div>

  </div>

  {/* TRANSACTIONS */}

  <div className="border rounded-xl p-6">

    <h2 className="font-semibold text-lg mb-4">
      Transaction History
    </h2>

    {tx.length === 0 && (
      <p className="text-gray-500">
        No transactions yet
      </p>
    )}

    {tx.map((t: any) => (

      <div
        key={t.id}
        className="flex justify-between border-b py-2"
      >

        <p>{t.type}</p>

        <p className={t.type === "deposit" ? "text-green-600" : "text-red-600"}>
          ₹{Number(t.amount).toFixed(2)}
        </p>

      </div>

    ))}

  </div>

</div>

);
}
