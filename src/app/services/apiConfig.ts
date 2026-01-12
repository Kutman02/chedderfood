// Конфигурация базового URL API
// ВСЕ URL должны браться из переменной окружения VITE_API_BASE_URL
// Для dev и prod должен быть полный URL (например: https://your-site.com/wp-json/)
// ОБЯЗАТЕЛЬНО: Добавьте VITE_API_BASE_URL в .env файл
// Хардкод URL удален - все URL берутся только из переменных окружения

const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!envApiBaseUrl) {
  const errorMsg = '❌ КРИТИЧЕСКАЯ ОШИБКА: VITE_API_BASE_URL не установлен в .env файле!\n' +
    'Добавьте в .env файл:\n' +
    'VITE_API_BASE_URL=https://your-wordpress-site.com/wp-json/';
  console.error(errorMsg);
  if (import.meta.env.DEV) {
    // В dev режиме выбрасываем ошибку, чтобы разработчик сразу заметил проблему
    throw new Error(errorMsg);
  }
  // В продакшне используем пустую строку, но это приведет к ошибкам запросов
  console.error('⚠️ ВНИМАНИЕ: Приложение не будет работать без VITE_API_BASE_URL!');
}

export const API_BASE_URL = envApiBaseUrl || '';

// Application Password для WordPress REST API медиа загрузки
// Получите его в WordPress: Users > Your Profile > Application Passwords
// Формат: username:application_password
// Пароль может быть с пробелами (например: "bKqU J9VH rE0n NhkD NKuZ iwkJ")
// Пробелы будут автоматически удалены при использовании
// Если не указан, будет использоваться nonce + cookie auth
export const WORDPRESS_APP_PASSWORD = import.meta.env.VITE_WP_APP_PASSWORD || null;
export const WORDPRESS_USERNAME = import.meta.env.VITE_WP_USERNAME || null;

// WooCommerce API ключи
// Получите их в WordPress: WooCommerce > Settings > Advanced > REST API
// Создайте новый ключ с правами Read/Write
// ОБЯЗАТЕЛЬНО: Добавьте в .env файл для продакшна!
export const WOOCOMMERCE_CONSUMER_KEY = import.meta.env.VITE_WC_CONSUMER_KEY || null;
export const WOOCOMMERCE_CONSUMER_SECRET = import.meta.env.VITE_WC_CONSUMER_SECRET || null;

// Утилита для диагностики конфигурации Application Password
export const checkAppPasswordConfig = () => {
  const hasUsername = !!WORDPRESS_USERNAME;
  const hasPassword = !!WORDPRESS_APP_PASSWORD;
  const isConfigured = hasUsername && hasPassword;
  
  console.log('🔍 Application Password Configuration Check:');
  console.log('  - VITE_WP_USERNAME:', hasUsername ? `✅ SET (${WORDPRESS_USERNAME})` : '❌ NOT SET');
  console.log('  - VITE_WP_APP_PASSWORD:', hasPassword ? '✅ SET (***hidden***)' : '❌ NOT SET');
  console.log('  - Status:', isConfigured ? '✅ FULLY CONFIGURED' : '⚠️ NOT CONFIGURED');
  
  if (!isConfigured) {
    console.warn('⚠️ Application Password is not configured!');
    console.warn('⚠️ Media uploads will use nonce + cookies, which may fail if session expires.');
    console.warn('💡 To configure:');
    console.warn('   1. Go to WordPress: Users > Your Profile > Application Passwords');
    console.warn('   2. Create a new Application Password');
    console.warn('   3. Add to .env file:');
    console.warn('      VITE_WP_USERNAME=your_username');
    console.warn('      VITE_WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx');
    console.warn('   4. Restart dev server');
  }
  
  return isConfigured;
};

// Утилита для диагностики конфигурации API URL
export const checkApiUrlConfig = () => {
  const hasEnvUrl = !!import.meta.env.VITE_API_BASE_URL;
  const currentUrl = API_BASE_URL;
  
  console.log('🔍 API Base URL Configuration Check:');
  console.log('  - VITE_API_BASE_URL:', hasEnvUrl ? `✅ SET (${import.meta.env.VITE_API_BASE_URL})` : '❌ NOT SET');
  console.log('  - Current API_BASE_URL:', currentUrl || '(empty - will cause errors!)');
  
  if (!hasEnvUrl) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА: VITE_API_BASE_URL не установлен в .env файле!');
    console.error('❌ Все API запросы будут падать с ошибками!');
    console.error('💡 Добавьте в .env файл:');
    console.error('   VITE_API_BASE_URL=https://your-wordpress-site.com/wp-json/');
  } else {
    console.log('✅ Все URL берутся из переменных окружения - хардкод удален');
  }
  
  return hasEnvUrl;
};

// Утилита для диагностики конфигурации WooCommerce API ключей
export const checkWooCommerceConfig = () => {
  const hasKey = !!WOOCOMMERCE_CONSUMER_KEY;
  const hasSecret = !!WOOCOMMERCE_CONSUMER_SECRET;
  const isConfigured = hasKey && hasSecret;
  
  if (import.meta.env.DEV) {
    console.log('🔍 WooCommerce API Configuration Check:');
    console.log('  - VITE_WC_CONSUMER_KEY:', hasKey ? '✅ SET (***hidden***)' : '❌ NOT SET');
    console.log('  - VITE_WC_CONSUMER_SECRET:', hasSecret ? '✅ SET (***hidden***)' : '❌ NOT SET');
    console.log('  - Status:', isConfigured ? '✅ FULLY CONFIGURED' : '❌ NOT CONFIGURED');
    
    if (!isConfigured) {
      console.error('❌ КРИТИЧЕСКАЯ ОШИБКА: WooCommerce API ключи не установлены!');
      console.error('❌ WooCommerce API запросы не будут работать!');
      console.error('💡 Добавьте в .env файл:');
      console.error('   VITE_WC_CONSUMER_KEY=ck_your_consumer_key_here');
      console.error('   VITE_WC_CONSUMER_SECRET=cs_your_consumer_secret_here');
    }
  }
  
  return isConfigured;
};

// Автоматически проверяем конфигурацию при импорте модуля (только в dev)
if (import.meta.env.DEV) {
  checkApiUrlConfig();
  checkAppPasswordConfig();
  checkWooCommerceConfig();
}

