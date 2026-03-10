import {
  pgTable,
  text,
  serial,
  numeric,
  timestamp,
  integer
} from "drizzle-orm/pg-core";

import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/* =========================
   USERS
========================= */

export const users = pgTable("users", {

  id: serial("id").primaryKey(),

  email: text("email")
    .notNull()
    .unique(),

  password: text("password")
    .notNull(),

  balance: numeric("balance")
    .notNull()
    .default("100000"),

  createdAt: timestamp("created_at")
    .defaultNow()

});

export const insertUserSchema = createInsertSchema(users)
  .omit({
    id: true,
    createdAt: true,
    balance: true
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;


/* =========================
   STOCKS
========================= */

export const stocks = pgTable("stocks", {

  id: serial("id").primaryKey(),

  symbol: text("symbol")
    .notNull()
    .unique(),

  name: text("name")
    .notNull(),

  price: numeric("price")
    .notNull(),

  change: numeric("change")
    .notNull(),

  changePercent: numeric("change_percent")
    .notNull(),

  type: text("type")
    .notNull() // stock | etf | ipo | intraday

});

export const insertStockSchema = createInsertSchema(stocks)
  .omit({ id: true });

export type InsertStock = z.infer<typeof insertStockSchema>;
export type Stock = typeof stocks.$inferSelect;


/* =========================
   HOLDINGS
========================= */

export const holdings = pgTable("holdings", {

  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  stockId: integer("stock_id")
    .notNull()
    .references(() => stocks.id),

  quantity: numeric("quantity")
    .notNull(),

  averagePrice: numeric("average_price")
    .notNull()

});

export const insertHoldingSchema = createInsertSchema(holdings)
  .omit({ id: true });

export type InsertHolding = z.infer<typeof insertHoldingSchema>;
export type Holding = typeof holdings.$inferSelect;


/* =========================
   WATCHLIST
========================= */

export const watchlist = pgTable("watchlist", {

  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  stockId: integer("stock_id")
    .notNull()
    .references(() => stocks.id)

});

export const insertWatchlistSchema = createInsertSchema(watchlist)
  .omit({ id: true });

export type InsertWatchlist = z.infer<typeof insertWatchlistSchema>;
export type Watchlist = typeof watchlist.$inferSelect;


/* =========================
   MUTUAL FUNDS
========================= */

export const mutualFunds = pgTable("mutual_funds", {

  id: serial("id").primaryKey(),

  name: text("name")
    .notNull(),

  amc: text("amc")
    .notNull(),

  nav: numeric("nav")
    .notNull(),

  return3yr: numeric("return_3yr")
    .notNull(),

  risk: text("risk")
    .notNull()

});

export const insertMutualFundSchema = createInsertSchema(mutualFunds)
  .omit({ id: true });

export type InsertMutualFund = z.infer<typeof insertMutualFundSchema>;
export type MutualFund = typeof mutualFunds.$inferSelect;


/* =========================
   TRANSACTIONS
========================= */

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),

  userId: integer("user_id").notNull(),

  stockId: integer("stock_id").notNull(),

  type: text("type").notNull(),

  quantity: numeric("quantity").notNull(),

  price: numeric("price").notNull(),   // 🔴 THIS IS MISSING

  amount: numeric("amount"),

  createdAt: timestamp("created_at").defaultNow()
});

export const insertTransactionSchema = createInsertSchema(transactions)
  .omit({ id: true, createdAt: true });

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;