import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let balance = 1000; // Initial balance
let portfolio = {}; // Stores stocks bought
let profitLoss = 0; // Total profit/loss
let tradeCounts = {}; // Tracks number of trades per stock within a time window
let stockPurchaseTimes = {}; // Tracks the time a stock was purchased

const TRADE_LIMIT = 3; // Limit trades per stock per minute
const HOLD_TIME_LIMIT = 2 * 60 * 1000; // 2 minutes hold time for forced sale

// Load mock data for different stocks
const loadStockData = (stockFile) => {
  const filePath = path.join(__dirname, "../data/", stockFile);
  // console.log(filePath)
  try {
    const rawData = readFileSync(filePath);
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error loading stock data from ${filePath}:`, error);
    return null;
  }
};

// Fetch a random stock price
const getRandomPrice = (prices) => {
  if (!Array.isArray(prices) || prices.length === 0) {
    console.error("Prices array is either not available or invalid.");
    return null;
  }

  const randomIndex = Math.floor(Math.random() * prices.length);
  return prices[randomIndex].price;
};

// Simulate a random trade failure (10% chance)
const shouldFailTrade = () => {
  return Math.random() < 0.1;
};

// Check if a stock has been held too long
const checkTimeBasedConstraints = (stock, currentTime) => {
  if (
    stockPurchaseTimes[stock.name] &&
    currentTime - stockPurchaseTimes[stock.name] > HOLD_TIME_LIMIT
  ) {
    return true;
  }
  return false;
};

// Check trade limits (3 trades per minute)
const canTrade = (stockName) => {
  if (!tradeCounts[stockName]) {
    tradeCounts[stockName] = { count: 0, lastReset: Date.now() };
  }

  const currentTime = Date.now();
  if (currentTime - tradeCounts[stockName].lastReset > 60 * 1000) {
    tradeCounts[stockName].count = 0;
    tradeCounts[stockName].lastReset = currentTime;
  }

  return tradeCounts[stockName].count < TRADE_LIMIT;
};

// Core trading logic (buy/sell/hold)
const checkTradingStrategy = () => {
  let currentTime = Date.now();

  const stocks = [
    { name: "AAPL", dataFile: "Apple_MOCK_DATA.json" },
    { name: "TSLA", dataFile: "Tesla_MOCK_DATA.json" },
    { name: "GOOGL", dataFile: "Google_MOCK_DATA.json" },
  ];

  stocks.forEach((stock) => {
    const stockData = loadStockData(stock.dataFile);

    if (!stockData || !stockData.prices) {
      console.error(`Price data for ${stock.name} is missing or corrupted`);
      return;
    }

    const currentPrice = getRandomPrice(stockData.prices);
    if (!currentPrice) {
      console.error(`Failed to retrieve a valid price for ${stock.name}`);
      return;
    }

    let stockHolding = portfolio[stock.name] || { quantity: 0, buyPrice: 0 };

    // Force a sell if held too long
    if (checkTimeBasedConstraints(stock, currentTime)) {
      balance += currentPrice * stockHolding.quantity;
      profitLoss +=
        (currentPrice - stockHolding.buyPrice) * stockHolding.quantity;
      console.log(
        `Forced sell ${stockHolding.quantity} shares of ${stock.name} at $${currentPrice}.`
      );
      stockHolding.quantity = 0;
      delete portfolio[stock.name];
      return;
    }

    // Buy if price drops 2%
    if (
      currentPrice < stockHolding.buyPrice * 0.98 &&
      balance >= currentPrice &&
      canTrade(stock.name)
    ) {
      if (!shouldFailTrade()) {
        stockHolding.quantity++;
        balance -= currentPrice;
        stockHolding.buyPrice = currentPrice;
        portfolio[stock.name] = stockHolding;
        stockPurchaseTimes[stock.name] = currentTime;
        tradeCounts[stock.name].count++;
        console.log(`Bought 1 share of ${stock.name} at $${currentPrice}`);
      } else {
        console.log(
          `Missed buying opportunity for ${stock.name} at $${currentPrice} due to trade failure.`
        );
      }
    }

    // Sell if price rises 3%
    if (
      currentPrice > stockHolding.buyPrice * 1.03 &&
      stockHolding.quantity > 0 &&
      canTrade(stock.name)
    ) {
      if (!shouldFailTrade()) {
        stockHolding.quantity--;
        balance += currentPrice;
        profitLoss += currentPrice - stockHolding.buyPrice;
        console.log(`Sold 1 share of ${stock.name} at $${currentPrice}`);
        tradeCounts[stock.name].count++;
      } else {
        console.log(
          `Missed selling opportunity for ${stock.name} at $${currentPrice} due to trade failure.`
        );
      }
    }
  });
};

// Fetch stock status
export const getStockStatus = (req, res) => {
  res.json({
    balance,
    portfolio,
    profitLoss,
  });
};

// Start trading logic on an interval
export const runTradingLogic = () => {
  setInterval(checkTradingStrategy, 5000);
};
