// ===============================
// API CONFIG (SMART VERSION)
// ===============================

// 🔥 ENV
const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// 🔥 Логи
const LOG = {
  info: "🔍",
  success: "✅",
  error: "❌",
  warn: "⚠️",
};

// ===============================
// BASE URL (DEV vs PROD)
// ===============================

// 👉 в dev используем proxy
// 👉 в prod используем реальный URL
export const API_BASE_URL = import.meta.env.DEV
  ? "/wp-json/"
  : envApiBaseUrl || "";

// ===============================
// VALIDATION (только для prod)
// ===============================

if (!import.meta.env.DEV && !envApiBaseUrl) {
  const errorMsg =
    `${LOG.error} КРИТИЧЕСКАЯ ОШИБКА: VITE_API_BASE_URL не установлен!\n` +
    `Добавьте в .env:\n` +
    `VITE_API_BASE_URL=https://your-site.com/wp-json/`;

  console.error(errorMsg);
  throw new Error(errorMsg);
}

// ===============================
// DEBUG CHECK
// ===============================

export const checkApiUrlConfig = () => {
  console.log(`${LOG.info} Проверка API URL:`);

  console.log(
    "  - MODE:",
    import.meta.env.DEV ? "DEV" : "PROD"
  );

  console.log(
    "  - BASE URL:",
    `${LOG.success} ${API_BASE_URL}`
  );

  if (!import.meta.env.DEV && !envApiBaseUrl) {
    console.error(`${LOG.error} API не будет работать`);
    return false;
  }

  console.log(`${LOG.success} API готов к работе`);
  return true;
};

// ===============================
// ENDPOINTS (опционально)
// ===============================

export const ENDPOINTS = {
  products: `${API_BASE_URL}wc/store/products`,
  categories: `${API_BASE_URL}wc/store/products/categories`,
};

// ===============================
// AUTO CHECK (DEV ONLY)
// ===============================

if (import.meta.env.DEV) {
  checkApiUrlConfig();
}