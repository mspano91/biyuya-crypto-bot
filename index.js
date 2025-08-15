// index.js
import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import {
  COINS_TO_MONITOR,
  VS_CURRENCY,
  PRICE_CHANGE_THRESHOLD,
  CHECK_INTERVAL_MINUTES,
  TARGET_BUY_PRICES,
} from "./config.js";
import {
    readStoredPrices,
    storePrices,
    fetchCurrentPrices,
    fetchSingleCoinPrice,
    sendTelegramMessage,
    calculatePercentageChange,
    formatCurrency
} from "./utils.js";
import { messages } from "./messages.js";

// --- EXPRESS SERVER FOR UPTIMEROBOT ---
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint raíz para que UptimeRobot haga ping
app.get("/", (req, res) => {
  res.send("Bot is alive! 🚀");
});

// Iniciar servidor Express
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Load environment variables
dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Validate environment variables
if (!TELEGRAM_BOT_TOKEN) {
  console.error("❌ Error: TELEGRAM_BOT_TOKEN is not set in .env file");
  process.exit(1);
}

// --- BOT INITIALIZATION ---
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

/**
 * Main monitoring function
 */
async function monitorPrices() {
  console.log(`
🚀
=== Starting Monitoring Cycle (${new Date().toLocaleString()}) ===
`);

  const storedPrices = await readStoredPrices();
  const currentPrices = await fetchCurrentPrices();

  if (!currentPrices) {
    console.log("⚠️ Could not fetch prices. Retrying in the next cycle.");
    return;
  }

  let newPricesToStore = {};
  let percentageAlerts = [];
  let targetBuyAlerts = [];
  let newLowAlerts = []; // Array for new all-time low alerts

  for (const coinId of COINS_TO_MONITOR) {
    const currentPriceData = currentPrices[coinId];
    const coinHistory = storedPrices[coinId] || {}; // Get historical data or empty object

    if (!currentPriceData || !currentPriceData[VS_CURRENCY]) {
      console.warn(`⚠️ Warning: Price for ${coinId} not found in ${VS_CURRENCY}`);
      continue;
    }

    const newPrice = currentPriceData[VS_CURRENCY];
    const oldPrice = coinHistory.last;
    const oldLow = coinHistory.low;

    // --- All-Time Low Logic ---
    let newLow = oldLow ?? newPrice;
    let newLowTimestamp = coinHistory.lowTimestamp ?? new Date().toISOString();

    if (newPrice < newLow) {
        newLow = newPrice;
        newLowTimestamp = new Date().toISOString();
        console.log(`🎉 New all-time low for ${coinId.toUpperCase()}: ${formatCurrency(newLow, VS_CURRENCY)}`);
        newLowAlerts.push(messages.newLowAlert(coinId, newLow, VS_CURRENCY));
    }

    // Update the object to be stored with the new structure
    newPricesToStore[coinId] = {
        last: newPrice,
        low: newLow,
        lowTimestamp: newLowTimestamp
    };

    // --- Percentage Change Logic ---
    if (oldPrice !== undefined) {
      const percentageChange = calculatePercentageChange(oldPrice, newPrice);
      console.log(
        `  - ${coinId.toUpperCase()}: Old: ${formatCurrency(
          oldPrice,
          VS_CURRENCY
        )}, New: ${formatCurrency(
          newPrice,
          VS_CURRENCY
        )}, Change: ${percentageChange.toFixed(2)}%`
      );

      if (Math.abs(percentageChange) >= PRICE_CHANGE_THRESHOLD) {
        const direction = percentageChange > 0 ? "increase" : "decrease";
        const emoji = percentageChange > 0 ? "📈" : "📉";
        percentageAlerts.push(
          messages.priceAlert(
            emoji,
            coinId,
            newPrice,
            VS_CURRENCY,
            percentageChange,
            direction,
            PRICE_CHANGE_THRESHOLD
          )
        );
      }
    } else {
      console.log(
        `  - ${coinId.toUpperCase()}: First price recorded: ${formatCurrency(
          newPrice,
          VS_CURRENCY
        )}`
      );
    }

    // --- Target Buy Price Logic ---
    const targetPrice = TARGET_BUY_PRICES[coinId];
    if (
      targetPrice !== undefined &&
      newPrice <= targetPrice &&
      (oldPrice === undefined || oldPrice > targetPrice)
    ) {
      targetBuyAlerts.push(
        messages.targetBuyAlert(coinId, newPrice, VS_CURRENCY, targetPrice)
      );
    }
  }

  // --- Send all conditional alerts ---
  if (percentageAlerts.length > 0) {
    const fullAlertMessage = percentageAlerts.join("\n---\n");
    await sendTelegramMessage(fullAlertMessage, TELEGRAM_BOT_TOKEN);
  } else {
    console.log("ℹ️ No percentage change alerts triggered.");
  }

  if (targetBuyAlerts.length > 0) {
    for (const alertMessage of targetBuyAlerts) {
      await sendTelegramMessage(alertMessage, TELEGRAM_BOT_TOKEN);
    }
  } else {
    console.log("ℹ️ No target buy alerts triggered.");
  }

  if (newLowAlerts.length > 0) {
    for (const alertMessage of newLowAlerts) {
        await sendTelegramMessage(alertMessage, TELEGRAM_BOT_TOKEN);
    }
  } else {
    console.log("ℹ️ No new all-time low alerts triggered.");
  }

  // --- Send Hourly Report ---
  console.log("ℹ️ Preparing hourly report...");
  let hourlyReportMessage = messages.hourlyReportHeader;
  for (const coinId of COINS_TO_MONITOR) {
      const priceData = currentPrices[coinId];
      const oldCoinHistory = storedPrices[coinId]; // Use the data from the START of the cycle for old prices

      if (priceData && priceData[VS_CURRENCY]) {
          const newPrice = priceData[VS_CURRENCY];
          const newCoinHistory = newPricesToStore[coinId]; // Use the new data for the most up-to-date low
          hourlyReportMessage += messages.formatPriceLine(
              coinId,
              newPrice,           // Current price from this cycle
              oldCoinHistory?.last, // Last price from PREVIOUS cycle
              VS_CURRENCY,
              newCoinHistory.low, // The new all-time low from THIS cycle
              newCoinHistory.lowTimestamp
          );
      } else {
          hourlyReportMessage += messages.formatPriceUnavailable(coinId);
      }
  }
  await sendTelegramMessage(hourlyReportMessage, TELEGRAM_BOT_TOKEN);


  // --- Final Step: Save prices for the next cycle ---
  await storePrices(newPricesToStore);
  console.log(`
=== Monitoring Cycle Complete (${new Date().toLocaleString()}) ===
🏁
`);
}

// --- BOT COMMANDS ---
bot.start((ctx) => ctx.reply(messages.start));

bot.command("price", async (ctx) => {
  const parts = ctx.message.text.split(" ");
  const coinId = parts.length > 1 ? parts[1].toLowerCase() : null;

  if (!coinId) {
    try {
      await ctx.reply(messages.fetchingPrices); // Using the live fetching message
      
      // Fetch both live prices and stored historical data in parallel for efficiency
      const [livePrices, storedPrices] = await Promise.all([
        fetchCurrentPrices(),
        readStoredPrices()
      ]);

      if (!livePrices) {
        return ctx.reply(messages.priceServiceError);
      }

      let message = messages.allPricesHeader;
      for (const coinId of COINS_TO_MONITOR) {
        const livePriceData = livePrices[coinId];
        const coinHistory = storedPrices[coinId];

        if (livePriceData && livePriceData[VS_CURRENCY]) {
          const price = livePriceData[VS_CURRENCY];
          message += messages.formatPriceLine(
            coinId,
            price,
            coinHistory?.last, // Pass the old price
            VS_CURRENCY,
            coinHistory?.low,
            coinHistory?.lowTimestamp
          );
        } else {
          message += messages.formatPriceUnavailable(coinId);
        }
      }
      return ctx.reply(message, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error("❌ Error in /price (live, all) command:", error);
      return ctx.reply(messages.unexpectedError);
    }
  }

  try {
    await ctx.reply(messages.fetchingSinglePrice(coinId));
    const [priceData, storedPrices] = await Promise.all([
        fetchSingleCoinPrice(coinId),
        readStoredPrices()
    ]);
    
    if (priceData && priceData[coinId] && priceData[coinId][VS_CURRENCY]) {
      const price = priceData[coinId][VS_CURRENCY];
      const coinHistory = storedPrices[coinId];
      const message = messages.singlePrice(
          coinId, 
          price, 
          VS_CURRENCY, 
          coinHistory?.low, 
          coinHistory?.lowTimestamp
      );
      return ctx.reply(message, { parse_mode: 'Markdown' });
    } else {
      return ctx.reply(messages.priceNotFound(coinId));
    }
  } catch (error) {
    console.error(`❌ Error in /price (${coinId}) command:`, error);
    return ctx.reply(messages.unexpectedError);
  }
});

// Fallback for unrecognized text messages
bot.on("text", (ctx) => ctx.reply(messages.fallback));

// --- APPLICATION START ---

monitorPrices();
setInterval(monitorPrices, CHECK_INTERVAL_MINUTES * 60 * 1000);

console.log(
  `
✅ Application started. Monitoring prices every ${CHECK_INTERVAL_MINUTES} minutes.`
);
console.log(`🔔 Alert threshold set to: ${PRICE_CHANGE_THRESHOLD}%.`);

bot.launch();
console.log("🤖 Bot started and listening for commands...");

// Graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));