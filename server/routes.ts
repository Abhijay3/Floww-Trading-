import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import bcrypt from "bcrypt";
import { getLiveStockPrices } from "./services/stockService";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {

  /* ---------------- AUTH HELPER ---------------- */

  async function getCurrentUser(req: any, res: any) {

    if (!req.session.userId) {
      res.status(401).json({ message: "Not authenticated" });
      return null;
    }

    return await storage.getUser(req.session.userId);

  }

  /* ---------------- REGISTER ---------------- */

  app.post(api.auth.register.path, async (req, res) => {

    try {

      const input = api.auth.register.input.parse(req.body);

      const existingUser = await storage.getUserByEmail(input.email);

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const user = await storage.createUser({
        email: input.email,
        password: hashedPassword
      });

      const { password, ...safeUser } = user;

      res.status(201).json(safeUser);

    } catch (err) {

      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }

      res.status(500).json({ message: "Server error" });

    }

  });

  /* ---------------- LOGIN ---------------- */

  app.post(api.auth.login.path, async (req, res) => {

    const input = api.auth.login.input.parse(req.body);

    const user = await storage.getUserByEmail(input.email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(input.password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.userId = user.id;

    const { password, ...safeUser } = user;

    res.json(safeUser);

  });

  /* ---------------- CURRENT USER ---------------- */

  app.get(api.auth.me.path, async (req, res) => {

    const user = await getCurrentUser(req, res);
    if (!user) return;

    const { password, ...safeUser } = user;

    res.json(safeUser);

  });

  /* ---------------- WALLET DEPOSIT ---------------- */

  app.post("/api/wallet/deposit", async (req, res) => {

    const user = await getCurrentUser(req, res);
    if (!user) return;

    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const newBalance = Number(user.balance || 0) + amount;

    await storage.updateUserBalance(
      user.id,
      String(newBalance)
    );

    await storage.createWalletTransaction(
      user.id,
      "deposit",
      String(amount)
    );

    res.json({
      success: true,
      balance: newBalance
    });

  });

  /* ---------------- WALLET TRANSACTIONS ---------------- */

  app.get("/api/transactions", async (req, res) => {

    const user = await getCurrentUser(req, res);
    if (!user) return;

    const tx = await storage.getWalletTransactions(user.id);

    res.json(tx);

  });

  /* ---------------- STOCK LIST ---------------- */

  app.get(api.stocks.list.path, async (_req, res) => {

    const stocks = await storage.getStocks();

    const symbols = stocks.map(s => s.symbol);

    const livePrices = await getLiveStockPrices(symbols);

    const updatedStocks = stocks.map(stock => {

      const live = livePrices[stock.symbol];

      if (!live) return stock;

      return {
        ...stock,
        price: Number(live.price),
        change: Number(live.change),
        changePercent: Number(live.change_percent)
      };

    });

    res.json(updatedStocks);

  });

  /* ---------------- BUY STOCK ---------------- */

  app.post("/api/buy", async (req, res) => {

    const user = await getCurrentUser(req, res);
    if (!user) return;

    const { symbol, quantity } = req.body;

    const stock = await storage.getStockBySymbol(symbol);

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const cost = Number(stock.price) * Number(quantity);

    if (Number(user.balance) < cost) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const newBalance = Number(user.balance) - cost;

    await storage.updateUserBalance(
      user.id,
      String(newBalance)
    );

    await storage.addHolding(
      user.id,
      stock.id,
      quantity,
      stock.price
    );

    await storage.createTransaction({
      userId: user.id,
      stockId: stock.id,
      type: "BUY",
      quantity,
      price: stock.price
    });

    res.json({ success: true });

  });

  /* ---------------- SELL STOCK ---------------- */

  app.post("/api/sell", async (req, res) => {

    const user = await getCurrentUser(req, res);
    if (!user) return;

    const { symbol, quantity } = req.body;

    const stock = await storage.getStockBySymbol(symbol);

    const holding = await storage.getHolding(user.id, stock.id);

    if (!holding || Number(holding.quantity) < Number(quantity)) {
      return res.status(400).json({ message: "Not enough shares" });
    }

    const value = Number(stock.price) * Number(quantity);

    const newBalance = Number(user.balance) + value;

    await storage.updateUserBalance(
      user.id,
      String(newBalance)
    );

    await storage.updateHoldingQuantity(
      user.id,
      stock.id,
      Number(holding.quantity) - Number(quantity)
    );

    await storage.createTransaction({
      userId: user.id,
      stockId: stock.id,
      type: "SELL",
      quantity,
      price: stock.price
    });

    res.json({ success: true });

  });

  /* ---------------- WATCHLIST ---------------- */

  app.post("/api/watchlist", async (req, res) => {

    const user = await getCurrentUser(req, res);
    if (!user) return;

    const { symbol } = req.body;

    const stock = await storage.getStockBySymbol(symbol);

    await storage.addWatchlist(
      user.id,
      stock.id
    );

    res.json({ success: true });

  });

  /* ---------------- PORTFOLIO ---------------- */

  app.get("/api/portfolio", async (req, res) => {

    const user = await getCurrentUser(req, res);
    if (!user) return;

    const stocks = await storage.getStocks();
    const symbols = stocks.map(s => s.symbol);

    const livePrices = await getLiveStockPrices(symbols);

    const portfolio: any[] = [];

    for (const stock of stocks) {

      const holding = await storage.getHolding(user.id, stock.id);
      if (!holding) continue;

      const live = livePrices[stock.symbol];

      const quantity = Number(holding.quantity);
      const avgPrice = Number(holding.averagePrice);
      const livePrice = Number(live?.price ?? stock.price);

      const invested = avgPrice * quantity;
      const value = livePrice * quantity;
      const pnl = value - invested;

      portfolio.push({
        stock,
        quantity,
        avgBuyPrice: avgPrice,
        currentValue: value,
        pnl
      });

    }

    res.json(portfolio);

  });

  return httpServer;

}