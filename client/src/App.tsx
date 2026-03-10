import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { Home } from "@/pages/Home";
import { SipCalculator } from "@/pages/SipCalculator";
import { BrokerageCalculator } from "@/pages/BrokerageCalculator";

import Portfolio from "@/pages/Portfolio";
import Stocks from "@/pages/Stocks";
import Wallet from "@/pages/Wallet";
import Transactions from "@/pages/Transactions";
import Dashboard from "@/pages/Dashboard";
import StockDetails from "@/pages/StockDetails";

import ProtectedRoute from "@/components/ProtectedRoute";
import MarketTicker from "@/components/MarketTicker";
import Watchlist from "@/components/Watchlist";

function Router() {

  return (

    <div className="flex flex-col min-h-screen">

      {/* MARKET TICKER */}
      <MarketTicker />

      <Navbar />

      <div className="flex flex-grow">

        {/* WATCHLIST SIDEBAR */}
        <Watchlist />

        {/* PAGE CONTENT */}

        <main className="flex-grow p-6">

          <Switch>

            <Route path="/" component={Home} />

            <Route path="/sip-calculator" component={SipCalculator} />
            <Route path="/brokerage-calculator" component={BrokerageCalculator} />

            <Route path="/dashboard" component={Dashboard} />

            <Route path="/stock/:symbol" component={StockDetails} />

            <Route path="/stocks">
              <ProtectedRoute>
                <Stocks />
              </ProtectedRoute>
            </Route>

            <Route path="/portfolio">
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            </Route>

            <Route path="/wallet">
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            </Route>

            <Route path="/transactions">
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            </Route>

            <Route component={NotFound} />

          </Switch>

        </main>

      </div>

      <Footer />

    </div>

  );

}

function App() {

  return (

    <QueryClientProvider client={queryClient}>

      <TooltipProvider>

        <Toaster />

        <Router />

      </TooltipProvider>

    </QueryClientProvider>

  );

}

export default App;