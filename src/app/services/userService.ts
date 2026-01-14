import { API_BASE_URL, WORDPRESS_USERNAME, WORDPRESS_APP_PASSWORD } from './apiConfig';

// Сервис для работы с пользователем WordPress через Application Password

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

// Функция для создания Basic Auth заголовка с Application Password
const createAppPasswordAuth = (username: string, appPassword: string): string => {
  const cleanPassword = appPassword.replace(/\s+/g, '');
  const credentials = `${username}:${cleanPassword}`;
  return `Basic ${btoa(credentials)}`;
};

export const userService = {
  // Debug utility to check authentication status
  debugAuthStatus(): void {
    console.log('🔍 Debug Auth Status:');
    console.log('  - Application Password configured:', !!(WORDPRESS_USERNAME && WORDPRESS_APP_PASSWORD));
    console.log('  - Username:', WORDPRESS_USERNAME || 'NOT SET');
    console.log('  - App Password:', WORDPRESS_APP_PASSWORD ? 'SET (***hidden***)' : 'NOT SET');
    console.log('  - LocalStorage keys:', Object.keys(localStorage));
  },

  // Получение текущего пользователя через Application Password
  async getCurrentUser(): Promise<User | null> {
    try {
      if (!WORDPRESS_USERNAME || !WORDPRESS_APP_PASSWORD) {
        console.error('❌ Application Password не настроен!');
        return null;
      }

      const authHeader = createAppPasswordAuth(WORDPRESS_USERNAME, WORDPRESS_APP_PASSWORD);
      
      console.log('🔍 Debug: Getting current user with Application Password');
      console.log('🔍 Debug: Request URL:', `${API_BASE_URL}wp/v2/users/me`);
      
      const res = await fetch(`${API_BASE_URL}wp/v2/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
      });

      console.log('🔍 Debug: Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.log('🔍 Debug: Error response body:', errorText);
        return null;
      }

      const data = await res.json();
      console.log('Current user data:', data);
      return data;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Проверка авторизации
  async checkAuth(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user !== null && !!user.id;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  },

  // Выход (Application Password не требует серверного logout)
  async logout(): Promise<void> {
    try {
      console.log('🔍 Debug: Logout - Application Password auth cleared');
      // Application Password не требует серверного logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
};
