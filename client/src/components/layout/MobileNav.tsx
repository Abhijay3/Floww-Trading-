import { Link } from "wouter";
import { Home, TrendingUp, PieChart, Wallet } from "lucide-react";

export default function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden flex justify-around py-3 z-50">

      <Link href="/">
        <div className="flex flex-col items-center text-xs">
          <Home size={20} />
          Home
        </div>
      </Link>

      <Link href="/stocks">
        <div className="flex flex-col items-center text-xs">
          <TrendingUp size={20} />
          Stocks
        </div>
      </Link>

      <Link href="/portfolio">
        <div className="flex flex-col items-center text-xs">
          <PieChart size={20} />
          Portfolio
        </div>
      </Link>

      <Link href="/wallet">
        <div className="flex flex-col items-center text-xs">
          <Wallet size={20} />
          Wallet
        </div>
      </Link>

    </div>
  );
}