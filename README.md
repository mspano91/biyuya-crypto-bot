# Crypto Price Alert Bot 🤖

A simple yet powerful Telegram bot that monitors cryptocurrency prices and sends alerts based on user-defined rules.

This bot is built with Node.js and uses the CoinGecko API for real-time price data.

## ✨ Features

- **Periodic Monitoring:** Checks prices at configurable time intervals (e.g., every 10 minutes).
- **Periodic Reports:** Sends a full market status summary to your Telegram chat every cycle.
- **Price Change Alerts:** Notifies if a coin's price increases or decreases by more than a defined percentage threshold (e.g., 5%).
- **Target Price Alerts:** Allows defining target buy prices and sends an alert when a coin reaches that price.
- **All-Time Low Tracking:** Saves the lowest price ever recorded for each coin and notifies when a new all-time low is reached.
- **Interactive Commands:** Responds to chat commands to get information instantly.
- **Custom Icons:** Displays a unique icon for each cryptocurrency, making reports more visual.
- **Highly Configurable:** Almost everything can be customized through a central configuration file.

## 🚀 Setup and Installation

Follow these steps to get your own bot up and running.

### 1. Clone the Repository

```bash
git clone <REPOSITORY_URL>
cd <DIRECTORY_NAME>
```

### 2. Install Dependencies

You need to have Node.js installed. Then, run:

```bash
npm install
```

### 3. Set Up Environment Variables

This project uses a `.env` file to handle secret keys.

1.  Create a copy of the example file:
    ```bash
    cp .env.example .env
    ```
2.  Open the new `.env` file and add your values:
    - `TELEGRAM_BOT_TOKEN`: Your bot token, obtained from talking to @BotFather on Telegram.
    - `TELEGRAM_CHAT_ID`: The ID of the chat where you want the bot to send messages. You can get this from bots like @userinfobot.

### 4. Customize Your Configuration

Open the `config.js` file to tweak the bot's behavior to your liking:

- `COINS_TO_MONITOR`: The list of coin IDs you want to track.
- `COIN_ICONS`: Assign an emoji to each coin for the reports.
- `TARGET_BUY_PRICES`: Define your target buy prices.
- `VS_CURRENCY`: The currency you want to see prices in (e.g., `usd`, `eur`).
- `PRICE_CHANGE_THRESHOLD`: The percentage change for price alerts.
- `CHECK_INTERVAL_MINUTES`: How often the bot will check for prices.

## ▶️ Running the Bot

Once everything is configured, simply run:

```bash
node index.js
```

You will see logs in your console indicating that the bot has started and is monitoring prices.

## 💬 Bot Commands

You can interact with the bot on Telegram using the following commands:

- `/start`: Displays a welcome message.
- `/price`: Gives you a list of all monitored coins with their real-time price and all-time low.
- `/price <coin_id>`: Shows the real-time price and all-time low for a specific coin (e.g., `/price bitcoin`).
