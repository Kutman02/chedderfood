import { API_BASE_URL, WORDPRESS_USERNAME, WORDPRESS_APP_PASSWORD } from './apiConfig';

// ===============================
// Тип пользователя WordPress
// ===============================

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  avatar_urls?: {
    [key: string]: string;
  };
  roles?: string[];
  capabilities?: {
    [key: string]: boolean;
  };
}

// ===============================
// Лог-метки (единый стиль)
// ===============================

const LOG = {
  info: '🔍',
  success: '✅',
  error: '❌',
  warn: '⚠️',
  set: 'Установлен',
  notSet: 'Не установлен',
};

// ===============================
// Basic Auth (Application Password)
// ===============================

const createAppPasswordAuth = (username: string, appPassword: string): string => {
  const cleanPassword = appPassword.replace(/\s+/g, '');
  const credentials = `${username}:${cleanPassword}`;
  return `Basic ${btoa(credentials)}`;
};

// ===============================
// Интерфейс сервиса
// ===============================

export interface UserService {
  debugAuthStatus(): void;
  getCurrentUser(): Promise<User | null>;
  checkAuth(): Promise<boolean>;
  logout(): Promise<void>;
}

// ===============================
// Реализация сервиса
// ===============================

export const userService: UserService = {
  // Проверка состояния авторизации (debug)
  debugAuthStatus(): void {
    const isConfigured = !!(WORDPRESS_USERNAME && WORDPRESS_APP_PASSWORD);

    console.log(`${LOG.info} Проверка авторизации:`);

    console.log(
      '  - Application Password:',
      isConfigured
        ? `${LOG.success} Настроен`
        : `${LOG.error} Не настроен`
    );

    console.log(
      '  - Username:',
      WORDPRESS_USERNAME
        ? `${LOG.success} ${WORDPRESS_USERNAME}`
        : `${LOG.error} ${LOG.notSet}`
    );

    console.log(
      '  - App Password:',
      WORDPRESS_APP_PASSWORD
        ? `${LOG.success} ${LOG.set} (скрыт)`
        : `${LOG.error} ${LOG.notSet}`
    );

    console.log(
      '  - LocalStorage ключи:',
      Object.keys(localStorage)
    );
  },

  // ===============================
  // Получение текущего пользователя
  // ===============================

  async getCurrentUser(): Promise<User | null> {
    try {
      if (!WORDPRESS_USERNAME || !WORDPRESS_APP_PASSWORD) {
        console.error(`${LOG.error} Application Password не настроен`);
        return null;
      }

      const authHeader = createAppPasswordAuth(
        WORDPRESS_USERNAME,
        WORDPRESS_APP_PASSWORD
      );

      console.log(`${LOG.info} Получение текущего пользователя`);
      console.log('  - URL:', `${API_BASE_URL}wp/v2/users/me`);

      const res = await fetch(`${API_BASE_URL}wp/v2/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
      });

      console.log('  - Статус ответа:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`${LOG.error} Ошибка ответа от сервера:`);
        console.error(errorText);
        return null;
      }

      const data = await res.json();

      console.log(`${LOG.success} Пользователь получен:`, data);

      return data;
    } catch (error) {
      console.error(`${LOG.error} Ошибка при получении пользователя:`, error);
      return null;
    }
  },

  // ===============================
  // Проверка авторизации
  // ===============================

  async checkAuth(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();

      const isAuth = user !== null && !!user.id;

      console.log(
        '  - Авторизация:',
        isAuth
          ? `${LOG.success} Пользователь авторизован`
          : `${LOG.warn} Пользователь не авторизован`
      );

      return isAuth;
    } catch (error) {
      console.error(`${LOG.error} Ошибка проверки авторизации:`, error);
      return false;
    }
  },

  // ===============================
  // Logout
  // ===============================

  async logout(): Promise<void> {
    try {
      console.log(`${LOG.info} Выход из системы`);
      console.log('  - Application Password не требует серверного logout');
    } catch (error) {
      console.error(`${LOG.error} Ошибка при выходе:`, error);
    }
  },
};