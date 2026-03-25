// Конфигурация базового URL API
// ВСЕ URL должны браться из переменной окружения VITE_API_BASE_URL
// Для dev и prod должен быть полный URL (например: https://your-site.com/wp-json/)
// ОБЯЗАТЕЛЬНО: Добавьте VITE_API_BASE_URL в .env файл

const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Унифицированные метки логов
const LOG = {
  info: '🔍',
  success: '✅',
  error: '❌',
  warn: '⚠️',
  set: 'Установлен',
  notSet: 'Не установлен',
};

// Проверка API URL при инициализации
if (!envApiBaseUrl) {
  const errorMsg =
    `${LOG.error} КРИТИЧЕСКАЯ ОШИБКА: VITE_API_BASE_URL не установлен!\n` +
    `Добавьте в .env:\n` +
    `VITE_API_BASE_URL=https://your-wordpress-site.com/wp-json/`;

  console.error(errorMsg);

  if (import.meta.env.DEV) {
    throw new Error(errorMsg);
  }

  console.error(`${LOG.warn} Приложение не будет работать без API URL`);
}

export const API_BASE_URL = envApiBaseUrl || '';

// ===============================
// WordPress Application Password
// ===============================

export const WORDPRESS_APP_PASSWORD =
  import.meta.env.VITE_WP_APP_PASSWORD || null;

export const WORDPRESS_USERNAME =
  import.meta.env.VITE_WP_USERNAME || null;

// ===============================
// WooCommerce API
// ===============================

export const WOOCOMMERCE_CONSUMER_KEY =
  import.meta.env.VITE_WC_CONSUMER_KEY || null;

export const WOOCOMMERCE_CONSUMER_SECRET =
  import.meta.env.VITE_WC_CONSUMER_SECRET || null;

// ===============================
// Проверка Application Password
// ===============================

export const checkAppPasswordConfig = () => {
  const hasUsername = !!WORDPRESS_USERNAME;
  const hasPassword = !!WORDPRESS_APP_PASSWORD;
  const isConfigured = hasUsername && hasPassword;

  console.log(`${LOG.info} Проверка Application Password:`);

  console.log(
    '  - VITE_WP_USERNAME:',
    hasUsername
      ? `${LOG.success} ${LOG.set} (${WORDPRESS_USERNAME})`
      : `${LOG.error} ${LOG.notSet}`
  );

  console.log(
    '  - VITE_WP_APP_PASSWORD:',
    hasPassword
      ? `${LOG.success} ${LOG.set} (скрыт)`
      : `${LOG.error} ${LOG.notSet}`
  );

  console.log(
    '  - Статус:',
    isConfigured
      ? `${LOG.success} Полностью настроено`
      : `${LOG.warn} Не настроено`
  );

  if (!isConfigured) {
    console.warn(`${LOG.warn} Application Password не настроен`);
    console.warn(
      `${LOG.warn} Загрузка медиа будет через cookies (может отвалиться)`
    );

    console.warn('💡 Как настроить:');
    console.warn('   1. WordPress → Users → Profile → Application Passwords');
    console.warn('   2. Создать новый пароль');
    console.warn('   3. Добавить в .env:');
    console.warn('      VITE_WP_USERNAME=your_username');
    console.warn('      VITE_WP_APP_PASSWORD=xxxx xxxx xxxx xxxx');
    console.warn('   4. Перезапустить dev сервер');
  }

  return isConfigured;
};

// ===============================
// Проверка API URL
// ===============================

export const checkApiUrlConfig = () => {
  const hasEnvUrl = !!import.meta.env.VITE_API_BASE_URL;
  const currentUrl = API_BASE_URL;

  console.log(`${LOG.info} Проверка API URL:`);

  console.log(
    '  - VITE_API_BASE_URL:',
    hasEnvUrl
      ? `${LOG.success} ${LOG.set} (${import.meta.env.VITE_API_BASE_URL})`
      : `${LOG.error} ${LOG.notSet}`
  );

  console.log(
    '  - Текущий API_BASE_URL:',
    currentUrl || `${LOG.error} Пусто (будут ошибки!)`
  );

  if (!hasEnvUrl) {
    console.error(
      `${LOG.error} КРИТИЧЕСКАЯ ОШИБКА: API URL не установлен`
    );

    console.error('💡 Добавьте в .env:');
    console.error(
      '   VITE_API_BASE_URL=https://your-wordpress-site.com/wp-json/'
    );
  } else {
    console.log(`${LOG.success} Конфигурация API корректна`);
  }

  return hasEnvUrl;
};

// ===============================
// Проверка WooCommerce
// ===============================

export const checkWooCommerceConfig = () => {
  const hasKey = !!WOOCOMMERCE_CONSUMER_KEY;
  const hasSecret = !!WOOCOMMERCE_CONSUMER_SECRET;
  const isConfigured = hasKey && hasSecret;

  if (import.meta.env.DEV) {
    console.log(`${LOG.info} Проверка WooCommerce API:`);

    console.log(
      '  - VITE_WC_CONSUMER_KEY:',
      hasKey
        ? `${LOG.success} ${LOG.set} (скрыт)`
        : `${LOG.error} ${LOG.notSet}`
    );

    console.log(
      '  - VITE_WC_CONSUMER_SECRET:',
      hasSecret
        ? `${LOG.success} ${LOG.set} (скрыт)`
        : `${LOG.error} ${LOG.notSet}`
    );

    console.log(
      '  - Статус:',
      isConfigured
        ? `${LOG.success} Полностью настроено`
        : `${LOG.error} Не настроено`
    );

    if (!isConfigured) {
      console.error(
        `${LOG.error} WooCommerce API ключи не установлены`
      );

      console.error('💡 Добавьте в .env:');
      console.error(
        '   VITE_WC_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxx'
      );
      console.error(
        '   VITE_WC_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxx'
      );
    }
  }

  return isConfigured;
};

// ===============================
// Автопроверка (только dev)
// ===============================

if (import.meta.env.DEV) {
  checkApiUrlConfig();
  checkAppPasswordConfig();
  checkWooCommerceConfig();
}