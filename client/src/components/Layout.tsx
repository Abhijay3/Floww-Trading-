import { Link } from "react-router-dom";

export default function Layout({ children }: any) {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Floww</h1>

        <nav className="flex flex-col gap-4 text-sm">

          <Link
            to="/"
            className="hover:bg-gray-800 px-3 py-2 rounded"
          >
            Dashboard
          </Link>

          <Link
            to="/stocks"
            className="hover:bg-gray-800 px-3 py-2 rounded"
          >
            Stocks
          </Link>

          <Link
            to="/portfolio"
            className="hover:bg-gray-800 px-3 py-2 rounded"
          >
            Portfolio
          </Link>

          <Link
            to="/wallet"
            className="hover:bg-gray-800 px-3 py-2 rounded"
          >
            Wallet
          </Link>

          <Link
            to="/transactions"
            className="hover:bg-gray-800 px-3 py-2 rounded"
          >
            Transactions
          </Link>

        </nav>
      </aside>

      {/* Page Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>

    </div>
  );
}