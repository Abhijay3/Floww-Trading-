import { useState } from "react";
import { Link } from "wouter";
import {
  Search,
  LogOut,
  Settings,
  LayoutDashboard,
  ChevronDown,
  Wallet,
  LineChart,
  BarChart3,
  ArrowLeftRight
} from "lucide-react";

import { useUser, useLogout } from "./hooks/use-auth";
import { AuthModal } from "./components/auth/AuthModal";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "./components/ui/avatar";

import mfPreviewImage from "/images/generated_image_1.png";

export function Navbar() {

  const { data: user } = useUser();
  const logoutMutation = useLogout();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 cursor-pointer group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
              F
            </div>
            <span className="text-2xl font-extrabold tracking-tight">Floow</span>
          </Link>

          {/* CENTER NAV */}
          <div className="hidden md:flex items-center space-x-1 flex-1 px-8">

            <NavigationMenu>
              <NavigationMenuList className="gap-2">

                {/* EXPLORE */}
                <NavigationMenuItem>

                  <NavigationMenuTrigger className="text-base font-medium bg-transparent hover:bg-secondary/50">
                    Explore
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>

                    <div className="grid gap-3 p-6 w-[500px] lg:w-[600px] lg:grid-cols-[1fr_1fr]">

                      <div className="space-y-4">

                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                          Investments
                        </h4>

                        <Link href="/stocks" className="block p-3 hover:bg-secondary rounded-xl transition-colors">
                          <div className="font-semibold text-foreground">Stocks</div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Invest in top Indian companies
                          </p>
                        </Link>

                        <Link href="/mutual-funds" className="block p-3 hover:bg-secondary rounded-xl transition-colors">
                          <div className="font-semibold text-foreground">Mutual Funds</div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Expertly managed portfolios
                          </p>
                        </Link>

                      </div>

                      <div className="bg-secondary/30 p-4 rounded-xl">

                        <img
                          src={mfPreviewImage}
                          alt="Mutual Funds"
                          className="w-full rounded-lg shadow-sm mb-4"
                        />

                        <div className="font-medium">
                          Trending NFOs
                        </div>

                        <p className="text-xs text-muted-foreground mt-1">
                          Explore newly launched mutual funds.
                        </p>

                      </div>

                    </div>

                  </NavigationMenuContent>

                </NavigationMenuItem>

                {/* TOOLS */}
                <NavigationMenuItem>

                  <NavigationMenuTrigger className="text-base font-medium bg-transparent hover:bg-secondary/50">
                    Tools
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>

                    <ul className="grid w-[500px] gap-3 p-4 md:grid-cols-2">

                      <li>
                        <Link href="/portfolio" className="block p-4 rounded-xl hover:bg-secondary">
                          <div className="flex items-center gap-2 font-semibold">
                            <BarChart3 size={16} />
                            Portfolio
                          </div>
                          <p className="text-sm text-muted-foreground">
                            View your holdings and profits
                          </p>
                        </Link>
                      </li>

                      <li>
                        <Link href="/stocks" className="block p-4 rounded-xl hover:bg-secondary">
                          <div className="flex items-center gap-2 font-semibold">
                            <LineChart size={16} />
                            Stocks
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Explore available stocks
                          </p>
                        </Link>
                      </li>

                      <li>
                        <Link href="/wallet" className="block p-4 rounded-xl hover:bg-secondary">
                          <div className="flex items-center gap-2 font-semibold">
                            <Wallet size={16} />
                            Wallet
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Check balance and deposits
                          </p>
                        </Link>
                      </li>

                      <li>
                        <Link href="/transactions" className="block p-4 rounded-xl hover:bg-secondary">
                          <div className="flex items-center gap-2 font-semibold">
                            <ArrowLeftRight size={16} />
                            Transactions
                          </div>
                          <p className="text-sm text-muted-foreground">
                            View buy/sell history
                          </p>
                        </Link>
                      </li>

                      <li>
                        <Link href="/sip-calculator" className="block p-4 rounded-xl hover:bg-secondary">
                          <div className="font-semibold">SIP Calculator</div>
                          <p className="text-sm text-muted-foreground">
                            Calculate SIP returns
                          </p>
                        </Link>
                      </li>

                      <li>
                        <Link href="/brokerage-calculator" className="block p-4 rounded-xl hover:bg-secondary">
                          <div className="font-semibold">Brokerage Calculator</div>
                          <p className="text-sm text-muted-foreground">
                            Estimate brokerage charges
                          </p>
                        </Link>
                      </li>

                    </ul>

                  </NavigationMenuContent>

                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>

            {/* SEARCH */}

            <div className="relative flex-1 max-w-md ml-auto mr-4 hidden lg:block">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

              <Input
                placeholder="What are you looking for today?"
                className="w-full pl-10 pr-4 h-12 bg-secondary/50 border-0 rounded-xl"
              />

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="flex items-center gap-4">

            {user ? (

              <DropdownMenu>

                <DropdownMenuTrigger asChild>

                  <Button variant="ghost" className="h-12 gap-2 rounded-full pl-2 pr-4">

                    <Avatar className="h-8 w-8 border">

                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {user.email.substring(0, 2).toUpperCase()}
                      </AvatarFallback>

                    </Avatar>

                    <span className="text-sm font-medium hidden sm:block truncate max-w-[120px]">
                      {user.email}
                    </span>

                    <ChevronDown className="w-4 h-4 text-muted-foreground" />

                  </Button>

                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">

                  <DropdownMenuLabel>
                    {user.email}
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem>

                    <LayoutDashboard className="mr-2 h-4 w-4" />

                    Dashboard

                  </DropdownMenuItem>

                  <DropdownMenuItem>

                    <Settings className="mr-2 h-4 w-4" />

                    Settings

                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => logoutMutation.mutate()}
                    className="text-destructive"
                  >

                    <LogOut className="mr-2 h-4 w-4" />

                    Log out

                  </DropdownMenuItem>

                </DropdownMenuContent>

              </DropdownMenu>

            ) : (

              <Button
                onClick={() => setIsAuthModalOpen(true)}
                className="h-11 px-6 rounded-full font-bold"
              >
                Login / Register
              </Button>

            )}

          </div>

        </div>

      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </>
  );
}