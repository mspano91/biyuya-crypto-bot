// config.js

// Lista de criptomonedas a monitorear (IDs de CoinGecko)
// Puedes encontrar los IDs en la URL de CoinGecko para cada moneda, por ejemplo:
// Bitcoin: https://www.coingecko.com/es/monedas/bitcoin -> ID: bitcoin
export const COINS_TO_MONITOR = [
  "bitcoin",
  "ethereum",
  "solana",
  "binancecoin", // Binance Coin
  "cardano",
  "polkadot",
  "chainlink",
  "litecoin",
];

// Iconos para cada criptomoneda (se usará 🪙 como default si no se encuentra)
export const COIN_ICONS = {
  bitcoin: "🟠",
  ethereum: "⬜",
  solana: "🟣",
  binancecoin: "🟡",
  cardano: "🧿",
  polkadot: "🔥",
  chainlink: "🔷",
  litecoin: "⚪️",
};

// Precios objetivo para recibir una alerta de compra (el valor es en VS_CURRENCY)
// Si una moneda no está aquí, no tendrá alerta de precio objetivo.
export const TARGET_BUY_PRICES = {
  bitcoin: 70000,
  ethereum: 1900,
  solana: 120,
  cardano: 0.38,
  binancecoin: 570,
  polkadot: 3,
  chainlink: 10.18,
  litecoin: 68,
};

// Moneda de referencia para los precios
export const VS_CURRENCY = "usd"; // Puedes cambiar a 'eur', 'ars', etc.

// Umbral de cambio porcentual para disparar una alerta (ej: 5 para 5%)
// export const PRICE_CHANGE_THRESHOLD = 5;
export const PRICE_CHANGE_THRESHOLD = 20;

// Intervalo de verificación de precios en minutos
export const CHECK_INTERVAL_MINUTES = 60; // Cada 60 minutos

// Ruta al archivo donde se guardarán los precios anteriores
export const PRICES_FILE_PATH = "./data/prices.json";

// URL base de la API de CoinGecko
export const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

// URL base de la API de Telegram Bot
export const TELEGRAM_API_URL = "https://api.telegram.org/bot";
