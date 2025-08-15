
import axios from "axios";
import fs from "fs/promises";
import {
  COINS_TO_MONITOR,
  VS_CURRENCY,
  PRICES_FILE_PATH,
  COINGECKO_API_URL,
  TELEGRAM_API_URL,
} from "./config.js";
/**
 * Reads stored prices from JSON file
 */
export async function readStoredPrices() {
  try {
    const data = await fs.readFile(PRICES_FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("ℹ️ Price file not found, creating a new one.");
      return {};
    } else {
      console.error("❌ Error reading price file:", error.message);
      return {};
    }
  }
}

/**
 * Stores prices in a JSON file
 */
export async function storePrices(prices) {
  try {
    await fs.writeFile(
      PRICES_FILE_PATH,
      JSON.stringify(prices, null, 2),
      "utf8"
    );
    console.log("✅ Prices updated and saved.");
  } catch (error) {
    console.error("❌ Error saving prices:", error.message);
  }
}

/**
 * Fetches current prices for ALL monitored coins from CoinGecko
 */
export async function fetchCurrentPrices() {
  try {
    const ids = COINS_TO_MONITOR.join(",");
    const url = `${COINGECKO_API_URL}/simple/price?ids=${ids}&vs_currencies=${VS_CURRENCY}`;
    console.log(`🔍 Fetching prices from: ${url}`);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching prices from CoinGecko:", error.message);
    if (error.response) {
      console.error(
        "   └── CoinGecko Error Response:",
        error.response.status,
        error.response.data
      );
    }
    return null;
  }
}

/**
 * Fetches the price for a SINGLE coin from CoinGecko
 */
export async function fetchSingleCoinPrice(coinId) {
  try {
    const url = `${COINGECKO_API_URL}/simple/price?ids=${coinId}&vs_currencies=${VS_CURRENCY}`;
    console.log(`🔍 Fetching single price for ${coinId} from: ${url}`);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching price for ${coinId}:`, error.message);
    return null;
  }
}

/**
 * Sends a message to Telegram (used by the alert monitor)
 */
export async function sendTelegramMessage(message, botToken) {
  try {
    const url = `${TELEGRAM_API_URL}${botToken}/sendMessage`;
    await axios.post(url, {
      chat_id: process.env.TELEGRAM_CHAT_ID, // Reading from process.env directly here
      text: message,
      parse_mode: "Markdown",
    });
    console.log("✅ Telegram notification sent.");
  } catch (error) {
    console.error("❌ Error sending message to Telegram:", error.message);
    if (error.response) {
      console.error(
        "   └── Telegram Error Response:",
        error.response.status,
        error.response.data
      );
    }
  }
}

/**
 * Calculates percentage change
 */
export function calculatePercentageChange(oldPrice, newPrice) {
  if (!oldPrice || oldPrice === 0) return 0;
  return ((newPrice - oldPrice) / oldPrice) * 100;
}

/**
 * Formats currency
 */
export function formatCurrency(amount, currencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
    minimumFractionDigits: 4,
    maximumFractionDigits: 8, // Show more decimals for precision
  }).format(amount);
}