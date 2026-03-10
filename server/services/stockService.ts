import fetch from "node-fetch";

export async function getLiveStockPrices(symbols: string[]) {

  const prices: Record<string, any> = {};

  try {

    const res = await fetch(
      "https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json"
        }
      }
    );

    const data = await res.json();

    const stocks = data.data;

    for (const stock of stocks) {

      const symbol = stock.symbol;

      prices[symbol] = {
        price: stock.lastPrice,
        change: stock.change,
        change_percent: stock.pChange
      };

    }

  } catch (err) {

    console.log("NSE fetch error");

  }

  return prices;
}