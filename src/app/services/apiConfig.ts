// Конфигурация базового URL API
export const API_BASE_URL = import.meta.env.PROD
  ? 'https://cd444351-wordpress-zdtv5.tw1.ru/wp-json/'
  : '/wp-json/';

// Application Password для WordPress REST API медиа загрузки
// Получите его в WordPress: Users > Your Profile > Application Passwords
// Формат: username:application_password
// Если не указан, будет использоваться nonce + cookie auth
export const WORDPRESS_APP_PASSWORD = import.meta.env.VITE_WP_APP_PASSWORD || null;
export const WORDPRESS_USERNAME = import.meta.env.VITE_WP_USERNAME || null;

