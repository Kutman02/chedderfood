// Утилиты для работы с куки

// ===============================
// Лог-метки
// ===============================

const LOG = {
  info: '🔍',
  success: '✅',
  error: '❌',
  warn: '⚠️',
  cookie: '🍪',
};

/**
 * Удаляет куки по имени
 */
export function deleteCookie(
  name: string,
  path: string = '/',
  domain?: string
): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;

  if (domain) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=.${domain};`;
  }

  const hostname = window.location.hostname;
  const parts = hostname.split('.');

  if (parts.length > 1) {
    const parentDomain = '.' + parts.slice(-2).join('.');
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${parentDomain};`;
  }
}

/**
 * Очистка WordPress куки
 */
export function clearWordPressCookies(): void {
  console.log(`${LOG.cookie} Очистка WordPress куки перед логином`);

  const wpCookies = [
    'wordpress_logged_in',
    'wordpress_',
    'wp-settings',
    'wp-settings-time',
    'wordpress_test_cookie',
    'PHPSESSID',
  ];

  wpCookies.forEach((cookieName) => {
    deleteCookie(cookieName);
    deleteCookie(cookieName, '/', window.location.hostname);
  });

  const allCookies = document.cookie.split(';');

  allCookies.forEach((cookie) => {
    const cookieName = cookie.split('=')[0].trim();

    if (
      cookieName.startsWith('wordpress') ||
      cookieName.startsWith('wp-')
    ) {
      deleteCookie(cookieName);
    }
  });

  console.log(`${LOG.success} WordPress куки очищены`);
}

/**
 * Очистка всех куки (осторожно!)
 */
export function clearAllCookies(): void {
  console.log(`${LOG.cookie} Очистка ВСЕХ куки`);

  const allCookies = document.cookie.split(';');

  allCookies.forEach((cookie) => {
    const cookieName = cookie.split('=')[0].trim();
    deleteCookie(cookieName);
  });

  console.log(`${LOG.warn} Все куки удалены`);
}

/**
 * Получение куки
 */
export function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];

    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }

    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }

  return null;
}

/**
 * Установка куки
 */
export function setCookie(
  name: string,
  value: string,
  days: number = 7,
  path: string = '/'
): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie =
    `${name}=${value}; ` +
    `expires=${expires.toUTCString()}; ` +
    `path=${path}; ` +
    `SameSite=Lax`;
}

/**
 * Есть ли WordPress куки
 */
export function hasWordPressCookies(): boolean {
  const allCookies = document.cookie.split(';');

  return allCookies.some((cookie) => {
    const cookieName = cookie.split('=')[0].trim();

    return (
      cookieName.startsWith('wordpress') ||
      cookieName.startsWith('wp-')
    );
  });
}

/**
 * Лог всех куки (debug)
 */
export function logAllCookies(): void {
  console.log(`${LOG.cookie} Текущие куки:`);

  const allCookies = document.cookie.split(';');

  if (
    allCookies.length === 0 ||
    (allCookies.length === 1 && !allCookies[0])
  ) {
    console.log('  Нет куки');
    return;
  }

  allCookies.forEach((cookie) => {
    const [name, value] = cookie.split('=').map((s) => s.trim());

    console.log(
      `  ${name}: ${
        value
          ? value.substring(0, 50) + (value.length > 50 ? '...' : '')
          : '(пусто)'
      }`
    );
  });
}

// ===============================
// Доступ через window (debug)
// ===============================

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

  (window as unknown as Window & { cookieUtils: typeof cookieUtils }).cookieUtils =
    cookieUtils;

  console.log(
    `${LOG.cookie} Утилиты доступны в консоли: window.cookieUtils`
  );
}