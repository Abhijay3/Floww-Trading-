import { db } from "./db";
import {
  users,
  stocks,
  holdings,
  transactions,
  type User,
  type InsertUser,
  type Stock,
  type Holding
} from "@shared/schema";

import { eq, and, desc } from "drizzle-orm";

export class DatabaseStorage {

  /* ================= USERS ================= */

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserBalance(id: number, balance: string) {
    await db.update(users).set({ balance }).where(eq(users.id, id));
  }

  /* ================= STOCKS ================= */

  async getStocks(): Promise<Stock[]> {
    return await db.select().from(stocks);
  }

  async getStock(id: number): Promise<Stock | undefined> {
    const [stock] = await db.select().from(stocks).where(eq(stocks.id, id));
    return stock;
  }

  /* ================= HOLDINGS ================= */

  async getHolding(userId: number, stockId: number): Promise<Holding | undefined> {

    const [holding] = await db
      .select()
      .from(holdings)
      .where(
        and(
          eq(holdings.userId, userId),
          eq(holdings.stockId, stockId)
        )
      );

    return holding;
  }

  async createHolding(userId: number, stockId: number, quantity: string, avgPrice: string) {

    await db.insert(holdings).values({
      userId,
      stockId,
      quantity,
      averagePrice: avgPrice
    });

  }

  async updateHolding(userId: number, stockId: number, quantity: string, avgPrice: string) {

    await db.update(holdings)
      .set({
        quantity,
        averagePrice: avgPrice
      })
      .where(
        and(
          eq(holdings.userId, userId),
          eq(holdings.stockId, stockId)
        )
      );

  }

  async deleteHolding(userId: number, stockId: number) {

    await db.delete(holdings)
      .where(
        and(
          eq(holdings.userId, userId),
          eq(holdings.stockId, stockId)
        )
      );

  }

  /* ================= STOCK TRANSACTIONS ================= */

  async createTransaction(data: any) {

    await db.insert(transactions).values(data);

  }

  async getTransactions(userId: number) {

    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.id));

  }

  /* ================= WALLET TRANSACTIONS ================= */
async createWalletTransaction(userId: number, type: string, amount: string) {

  const value = Number(amount);

  await db.insert(transactions).values({
    userId: userId,
    stockId: 0,
    type: type,
    quantity: "0",
    price: value,     // REQUIRED because price is NOT NULL
    amount: value
  });

}

  async getWalletTransactions(userId: number) {

    return await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.stockId, 0)
        )
      )
      .orderBy(desc(transactions.id));

  }

}

export const storage = new DatabaseStorage();