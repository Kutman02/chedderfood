// Утилиты для работы с куки
// Помогают решить проблемы с конфликтующими куки в обычном браузере

/**
 * Удаляет куки по имени для текущего домена
 * @param name - имя куки
 * @param path - путь куки (по умолчанию '/')
 * @param domain - домен куки (опционально)
 */
export function deleteCookie(name: string, path: string = '/', domain?: string): void {
  // Удаляем куки для текущего домена
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
  
  // Если указан домен, пытаемся удалить и для него
  if (domain) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`;
    // Также пробуем без точки в начале домена
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=.${domain};`;
  }
  
  // Удаляем для родительского домена (если есть)
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  if (parts.length > 1) {
    const parentDomain = '.' + parts.slice(-2).join('.');
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${parentDomain};`;
  }
}

/**
 * Очищает все WordPress-связанные куки перед логином
 * Это помогает избежать конфликтов со старыми сессиями
 */
export function clearWordPressCookies(): void {
  console.log('🍪 Clearing WordPress cookies before login...');
  
  // Список типичных WordPress куки
  const wpCookies = [
    'wordpress_logged_in',
    'wordpress_',
    'wp-settings',
    'wp-settings-time',
    'wordpress_test_cookie',
    'PHPSESSID',
  ];
  
  // Очищаем каждую куку
  wpCookies.forEach(cookieName => {
    deleteCookie(cookieName);
    // Также пробуем с префиксом для поддоменов
    deleteCookie(cookieName, '/', window.location.hostname);
  });
  
  // Очищаем все куки, которые начинаются с 'wordpress'
  const allCookies = document.cookie.split(';');
  allCookies.forEach(cookie => {
    const cookieName = cookie.split('=')[0].trim();
    if (cookieName.startsWith('wordpress') || cookieName.startsWith('wp-')) {
      deleteCookie(cookieName);
    }
  });
  
  console.log('🍪 WordPress cookies cleared');
}

/**
 * Очищает все куки текущего домена (используйте с осторожностью!)
 */
export function clearAllCookies(): void {
  console.log('🍪 Clearing all cookies...');
  const allCookies = document.cookie.split(';');
  allCookies.forEach(cookie => {
    const cookieName = cookie.split('=')[0].trim();
    deleteCookie(cookieName);
  });
  console.log('🍪 All cookies cleared');
}

/**
 * Получает значение куки по имени
 */
export function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') cookie = cookie.substring(1, cookie.length);
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}

/**
 * Устанавливает куки
 */
export function setCookie(name: string, value: string, days: number = 7, path: string = '/'): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=${path}; SameSite=Lax`;
}

/**
 * Проверяет наличие WordPress куки
 * Возвращает true, если найдены WordPress куки
 */
export function hasWordPressCookies(): boolean {
  const allCookies = document.cookie.split(';');
  return allCookies.some(cookie => {
    const cookieName = cookie.split('=')[0].trim();
    return cookieName.startsWith('wordpress') || cookieName.startsWith('wp-');
  });
}

/**
 * Логирует все текущие куки (для отладки)
 */
export function logAllCookies(): void {
  console.log('🍪 Current cookies:');
  const allCookies = document.cookie.split(';');
  if (allCookies.length === 0 || (allCookies.length === 1 && !allCookies[0])) {
    console.log('  No cookies found');
    return;
  }
  allCookies.forEach(cookie => {
    const [name, value] = cookie.split('=').map(s => s.trim());
    console.log(`  ${name}: ${value ? value.substring(0, 50) + (value.length > 50 ? '...' : '') : '(empty)'}`);
  });
}

// Экспортируем функции для глобального доступа через window (для отладки в консоли)
if (typeof window !== 'undefined') {
  const cookieUtils = {
    clearWordPressCookies,
    clearAllCookies,
    getCookie,
    setCookie,
    deleteCookie,
    hasWordPressCookies,
    logAllCookies,
  };
  (window as unknown as Window & { cookieUtils: typeof cookieUtils }).cookieUtils = cookieUtils;
  console.log('🍪 Cookie utilities available in console: window.cookieUtils');
}

