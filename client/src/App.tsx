import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";

import NotFound from "./pages/not-found";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

import { Home } from "./pages/Home";
import { SipCalculator } from "./pages/SipCalculator";
import { BrokerageCalculator } from "./pages/BrokerageCalculator";

import Portfolio from "./pages/Portfolio";
import Stocks from "./pages/Stocks";
import Wallet from "./pages/Wallet";
import Transactions from "./pages/Transactions";
import Dashboard from "./pages/Dashboard";
import StockDetails from "./pages/StockDetails";

import ProtectedRoute from "./components/ProtectedRoute";
import MarketTicker from "./components/MarketTicker";
import Watchlist from "./components/Watchlist";

function Router() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <MarketTicker />
      <Navbar />

      <div className="flex flex-grow">

        {/* Watchlist Sidebar */}
        <div className="w-80 border-r bg-white hidden lg:block">
          <Watchlist />
        </div>

        {/* Page Content */}
        <main className="flex-grow p-8 max-w-7xl mx-auto w-full">

          <Switch>

            <Route path="/">
              <Home />
            </Route>

            <Route path="/sip-calculator">
              <SipCalculator />
            </Route>

            <Route path="/brokerage-calculator">
              <BrokerageCalculator />
            </Route>

            <Route path="/dashboard">
              <Dashboard />
            </Route>

            <Route path="/stock/:symbol">
              {(params) => <StockDetails symbol={params.symbol} />}
            </Route>

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

            <Route>
              <NotFound />
            </Route>

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