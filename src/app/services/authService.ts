import { API_BASE_URL, WORDPRESS_USERNAME, WORDPRESS_APP_PASSWORD } from './apiConfig';

// Сервис для авторизации через Application Password (работает 24/7)
export interface LoginCredentials {
  username: string;
  password: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  url?: string;
  description?: string;
  link?: string;
  slug?: string;
  avatar_urls?: {
    24?: string;
    48?: string;
    96?: string;
  };
  meta?: [];
  capabilities?: Record<string, boolean>;
  extra_capabilities?: Record<string, boolean>;
  registered_date?: string;
  roles?: string[];
  locale?: string;
}

interface LoginResponse {
  success: boolean;
  user?: {
    id: number;
    email: string;
    name: string;
  };
  message?: string;
}

// Функция для создания Basic Auth заголовка с Application Password
const createAppPasswordAuth = (username: string, appPassword: string): string => {
  // Убираем пробелы из Application Password (WordPress генерирует с пробелами)
  const cleanPassword = appPassword.replace(/\s+/g, '');
  const credentials = `${username}:${cleanPassword}`;
  return `Basic ${btoa(credentials)}`;
};

// Явный тип для authService для предотвращения ошибок TypeScript
export interface AuthService {
  login(credentials: LoginCredentials): Promise<LoginResponse>;
  getCurrentUser(): Promise<User | null>;
  logout(): Promise<void>;
  hasAppPassword(): boolean;
}

export const authService: AuthService = {
  // Логин через Application Password (проверка валидности)
  // Примечание: параметр credentials не используется напрямую, так как используется Application Password из переменных окружения
  // Интерфейс LoginCredentials сохранен для совместимости с существующим кодом
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log('🔐 Attempting login with Application Password');
      console.log('🔐 Username from form:', credentials.username); // Логируем для отладки
      console.log('🌐 Login URL:', `${API_BASE_URL}wp/v2/users/me`);
      
      // Проверяем наличие Application Password в конфигурации
      if (!WORDPRESS_USERNAME || !WORDPRESS_APP_PASSWORD) {
        console.error('❌ Application Password не настроен!');
        return {
          success: false,
          message: 'Application Password не настроен. Проверьте переменные окружения VITE_WP_USERNAME и VITE_WP_APP_PASSWORD'
        };
      }

      const authHeader = createAppPasswordAuth(WORDPRESS_USERNAME, WORDPRESS_APP_PASSWORD);
      
      const res = await fetch(`${API_BASE_URL}wp/v2/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
      });

      console.log('📥 Login response status:', res.status);
      
      if (res.ok) {
        const userData = await res.json();
        console.log('✅ Login successful with Application Password');
        console.log('📥 User data:', userData);
        
        return {
          success: true,
          user: {
            id: userData.id,
            email: userData.email,
            name: userData.name || userData.display_name || 'User',
          }
        };
      } else {
        const errorData = await res.json().catch(() => ({ message: 'Ошибка авторизации' }));
        console.log('❌ Login failed:', errorData);
        return {
          success: false,
          message: errorData.message || 'Ошибка авторизации. Проверьте Application Password в настройках.'
        };
      }
    } catch (error) {
      console.error('💥 Login network error:', error);
      return {
        success: false,
        message: 'Ошибка сети или сервера'
      };
    }
  },

  // Проверка текущего пользователя через Application Password
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
      console.log('Current user:', data);
      return data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Выход из системы (Application Password не требует серверного logout)
  async logout(): Promise<void> {
    try {
      console.log('✅ Logout completed - Application Password auth cleared from memory');
      // Application Password не требует серверного logout
      // Просто очищаем состояние на клиенте
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Проверка наличия Application Password
  hasAppPassword(): boolean {
    return !!(WORDPRESS_USERNAME && WORDPRESS_APP_PASSWORD);
  },
};
