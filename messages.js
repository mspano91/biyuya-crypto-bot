// messages.js
import { formatCurrency, calculatePercentageChange } from "./utils.js";
import { COIN_ICONS } from "./config.js";

// Helper to get a coin's icon or a default one
function getCoinIcon(coinId) {
  return COIN_ICONS[coinId.toLowerCase()] || "🪙";
}

// Helper to format dates
function formatDate(isoTimestamp) {
  if (!isoTimestamp) return "N/A";
  return new Date(isoTimestamp).toLocaleString("en-GB"); // Solo día, mes y año
}

// export const messages = {
//   // Welcome & Help
//   start:
//     "Hello! I am your crypto monitoring bot. Type /price to see current prices.",
//   fallback: `I didn't understand your message. Please use one of the following commands:\n\n• /price - Shows the prices of all monitored coins.\n• /price <coin_id> - Shows the price for a specific coin (e.g., /price bitcoin).`,

//   // Command Replies
//   fetchingPrices: "Fetching prices for all coins...",
//   fetchingSinglePrice: (coinId) =>
//     `Fetching price for ${coinId.toUpperCase()}...`,
//   priceServiceError: "Sorry, there was an error contacting the price service.",
//   unexpectedError:
//     "An unexpected error occurred while processing your request.",
//   priceNotFound: (coinId) =>
//     `I couldn\'t find the price for "${coinId}". Please check the coin ID (e.g., bitcoin, ethereum).`,

//   // Modified to include historical low
//   singlePrice: (coinId, price, vsCurrency, low, lowTimestamp) => {
//     let message = `*${getCoinIcon(
//       coinId
//     )} ${coinId.toUpperCase()}:* ${formatCurrency(price, vsCurrency)}`;
//     if (low && lowTimestamp) {
//       message += `\n*All-Time Low:* ${formatCurrency(
//         low,
//         vsCurrency
//       )} \n(on ${formatDate(lowTimestamp)})`;
//     }
//     return message;
//   },

//   // Price List
//   allPricesHeader: "\n📈 *Current Prices* 📉\n",
//   hourlyReportHeader: "\n📄 *Hourly Price Report* 📄\n", // For the periodic report
//   formatPriceLine: (
//     coin,
//     newPrice,
//     oldPrice,
//     vsCurrency,
//     low,
//     lowTimestamp
//   ) => {
//     let message = `*${getCoinIcon(
//       coin
//     )} ${coin.toUpperCase()}:* ${formatCurrency(newPrice, vsCurrency)}`;

//     if (oldPrice) {
//       const change = calculatePercentageChange(oldPrice, newPrice);
//       const sign = change >= 0 ? "+" : "";
//       const emoji = change >= 0 ? "🔼" : "🔽";
//       message += `  ---  ${sign}${change.toFixed(2)}% ${emoji}`;
//     }

//     if (low) {
//       const last = oldPrice;
//       message += `\n  *Last:* ${formatCurrency(last, vsCurrency)}`;
//       message += `\n  *Low:* ${formatCurrency(low, vsCurrency)}`;
//       if (lowTimestamp) {
//         message += `  ---  ${formatDate(lowTimestamp)}`;
//       }
//     }
//     message += "\n"; // Add a final newline for spacing between entries
//     return message;
//   },
//   formatPriceUnavailable: (coin) =>
//     `*${getCoinIcon(coin)} ${coin.toUpperCase()}:* Not available\n`,

//   // Monitoring Alerts
//   priceAlert: (
//     emoji,
//     coinId,
//     price,
//     vsCurrency,
//     change,
//     direction,
//     threshold
//   ) =>
//     `\n🚨 PRICE ALERT ${emoji} 🚨\n*Coin:* ${getCoinIcon(
//       coinId
//     )} ${coinId.toUpperCase()}\n*Current Price:* ${formatCurrency(
//       price,
//       vsCurrency
//     )}\n*Change:* ${change.toFixed(
//       2
//     )}% (${direction})\nExceeded the ${threshold}% threshold!\n`,
//   targetBuyAlert: (coinId, price, vsCurrency, targetPrice) =>
//     `\n🤑 Time to Buy ${getCoinIcon(
//       coinId
//     )} ${coinId.toUpperCase()}! 🚀\n------------------------------------\nIt reached the price you were waiting for!\n*Current Price:* ${formatCurrency(
//       price,
//       vsCurrency
//     )}\n*Your Target:* ${formatCurrency(
//       targetPrice,
//       vsCurrency
//     )}\nDon\'t miss this opportunity! 💰\n`,

//   // New alert for historical low
//   newLowAlert: (coinId, price, vsCurrency) =>
//     `\n📉 NEW ALL-TIME LOW! 📉\n*Coin:* ${getCoinIcon(
//       coinId
//     )} ${coinId.toUpperCase()}\n*New Low Price:* ${formatCurrency(
//       price,
//       vsCurrency
//     )}\n`,
// };

export const messages = {
  // Welcome & Help
  start:
    "👋 Hello! I'm your crypto monitoring bot.\nType /price to see current prices.",
  fallback: `❓ I didn't understand your message. Please use one of the commands below:\n\n• /price - Shows the prices of all monitored coins.\n• /price <coin_id> - Shows the price of a specific coin (e.g., /price bitcoin).`,

  // Command Replies
  fetchingPrices: "⏳ Fetching prices for all coins...",
  fetchingSinglePrice: (coinId) =>
    `⏳ Fetching price for ${coinId.toUpperCase()}...`,
  priceServiceError: "⚠️ There was an error contacting the price service.",
  unexpectedError:
    "❌ An unexpected error occurred while processing your request.",
  priceNotFound: (coinId) =>
    `🚫 I couldn't find the price for "${coinId}". Please check the coin ID (e.g., bitcoin, ethereum).`,

  // Single price with historical low
  singlePrice: (coinId, price, vsCurrency, low, lowTimestamp) => {
    let message = `*${getCoinIcon(
      coinId
    )} ${coinId.toUpperCase()}*: ${formatCurrency(price, vsCurrency)}`;
    if (low && lowTimestamp) {
      message += `\n *All-Time Low:* ${formatCurrency(
        low,
        vsCurrency
      )}\n🗓 ${formatDate(lowTimestamp)}`;
    }
    return message;
  },

  // Price List
  allPricesHeader: "\n📈 *Current Prices* 📉\n\n",
  hourlyReportHeader: "\n📄 *Hourly Price Report* 📄\n\n",

  formatPriceLine: (
    coin,
    newPrice,
    oldPrice,
    vsCurrency,
    low,
    lowTimestamp
  ) => {
    let message = `*${getCoinIcon(
      coin
    )} ${coin.toUpperCase()}*: ${formatCurrency(newPrice, vsCurrency)}`;

    if (oldPrice) {
      const change = calculatePercentageChange(oldPrice, newPrice);
      const sign = change >= 0 ? "+" : "";
      const emoji = change >= 0 ? "🔼" : "🔽";
      message += `  | ${sign}${change.toFixed(2)}% ${emoji}`;
    }

    if (low) {
      const last = oldPrice;
      message += `\n *Last:* ${formatCurrency(last, vsCurrency)}`;
      message += `\n *Low:* ${formatCurrency(low, vsCurrency)}`;
      if (lowTimestamp) {
        message += `  🗓 ${formatDate(lowTimestamp)}`;
      }
    }

    message += "\n\n"; // space between entries
    return message;
  },

  formatPriceUnavailable: (coin) =>
    `*${getCoinIcon(coin)} ${coin.toUpperCase()}*: ❌ Not available\n`,

  // Monitoring Alerts
  priceAlert: (
    emoji,
    coinId,
    price,
    vsCurrency,
    change,
    direction,
    threshold
  ) =>
    `\n🚨 *PRICE ALERT* ${emoji} 🚨\n*Coin:* ${getCoinIcon(
      coinId
    )} ${coinId.toUpperCase()}\n*Current Price:* ${formatCurrency(
      price,
      vsCurrency
    )}\n*Change:* ${change.toFixed(
      2
    )}% (${direction})\nExceeded the ${threshold}% threshold! 🔔\n`,

  targetBuyAlert: (coinId, price, vsCurrency, targetPrice) =>
    `\n🤑 *Time to Buy!* ${getCoinIcon(
      coinId
    )} ${coinId.toUpperCase()} 🚀\n------------------------------------\nIt reached the price you were waiting for!\n💰 *Current Price:* ${formatCurrency(
      price,
      vsCurrency
    )}\n🎯 *Your Target:* ${formatCurrency(
      targetPrice,
      vsCurrency
    )}\nDon't miss this opportunity! ✨\n`,

  // New alert for historical low
  newLowAlert: (coinId, price, vsCurrency) =>
    `\n📉 *NEW ALL-TIME LOW!* 📉\n\n*Coin:* ${getCoinIcon(
      coinId
    )} ${coinId.toUpperCase()}\n*New Low Price:* ${formatCurrency(
      price,
      vsCurrency
    )} 🪙\n`,
};
