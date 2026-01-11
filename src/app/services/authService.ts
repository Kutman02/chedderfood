import { API_BASE_URL } from './apiConfig';

// Сервис для прямой авторизации через fetch
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
    id: number;        // id из PHP
    email: string;      // email из PHP  
    name: string;        // name из PHP (display_name)
  };
  nonce?: string;       // WordPress nonce
  message?: string;
}

export const authService = {
  // Прямой логин через fetch с cookies
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log('🔐 Attempting login with:', credentials.username);
      console.log('🌐 Login URL:', `${API_BASE_URL}custom/v1/login`);
      
      const res = await fetch(`${API_BASE_URL}custom/v1/login`, {
        method: 'POST',
        credentials: 'include', // обязательно для cross-domain!
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      console.log('📥 Login response status:', res.status);
      console.log('📥 Login response data:', data);
      
      if (data.success && data.nonce) {
        console.log('✅ Login successful, nonce received:', data.nonce);
        localStorage.setItem('wp_nonce', data.nonce);
      } else {
        console.log('❌ Login failed:', data.message);
        // Even if login fails, try to fetch a nonce if user is actually logged in
        const freshNonce = await this.fetchNonce();
        if (freshNonce) {
          console.log('🔄 Fetched fresh nonce after failed login response');
          data.nonce = freshNonce;
          data.success = true;
        }
      }
      
      return data;
    } catch (error) {
      console.error('💥 Login network error:', error);
      return {
        success: false,
        message: 'Ошибка сети или сервера'
      };
    }
  },

  // Получение nonce из WordPress API
  async fetchNonce(): Promise<string | null> {
    try {
      console.log('🔍 Debug: Fetching fresh nonce from WordPress');
      const res = await fetch(`${API_BASE_URL}custom/v1/nonce`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        console.log('🔍 Debug: Failed to fetch nonce, status:', res.status);
        return null;
      }

      const data = await res.json();
      if (data.nonce) {
        console.log('🔍 Debug: Fresh nonce received:', data.nonce);
        localStorage.setItem('wp_nonce', data.nonce);
        return data.nonce;
      }
      return null;
    } catch (error) {
      console.error('Error fetching nonce:', error);
      return null;
    }
  },

  // Проверка текущего пользователя
  async getCurrentUser(): Promise<User | null> {
    try {
      let nonce = localStorage.getItem('wp_nonce');
      console.log('🔍 Debug: Getting current user');
      console.log('🔍 Debug: Nonce from localStorage:', nonce);
      
      // If no nonce, try to fetch one first
      if (!nonce) {
        console.log('🔍 Debug: No nonce found, fetching fresh nonce');
        nonce = await this.fetchNonce();
        if (!nonce) {
          console.log('🔍 Debug: Could not obtain nonce, user might not be logged in');
          return null;
        }
      }
      
      const res = await fetch(`${API_BASE_URL}wp/v2/users/me`, {
        method: 'GET',
        credentials: 'include', // обязательно!
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': nonce || '', // Добавляем nonce
        },
      });

      // If we get a 403 with invalid nonce, try to fetch a fresh nonce and retry once
      if (res.status === 403) {
        const errorText = await res.text();
        console.log('🔍 Debug: Error response body:', errorText);
        
        if (errorText.includes('rest_cookie_invalid_nonce')) {
          console.log('🔍 Debug: Invalid nonce detected, fetching fresh nonce and retrying');
          const freshNonce = await this.fetchNonce();
          
          if (freshNonce) {
            console.log('🔍 Debug: Retrying with fresh nonce');
            const retryRes = await fetch(`${API_BASE_URL}wp/v2/users/me`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': freshNonce,
              },
            });

            if (retryRes.ok) {
              const data = await retryRes.json();
              console.log('Current user data (after retry):', data);
              return data;
            } else {
              console.log('🔍 Debug: Retry also failed, status:', retryRes.status);
            }
          }
        }
        
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Current user:', data);
      return data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Выход из системы
  async logout(): Promise<void> {
    try {
      const nonce = localStorage.getItem('wp_nonce');
      await fetch(`${API_BASE_URL}custom/v1/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': nonce || '', // Добавляем nonce
        },
      });
      
      // Очищаем nonce при выходе
      localStorage.removeItem('wp_nonce');
    } catch (error) {
      console.error('Logout error:', error);
      // Все равно очищаем nonce при ошибке
      localStorage.removeItem('wp_nonce');
    }
  },

  // Утилиты для работы с nonce
  getNonce(): string | null {
    return localStorage.getItem('wp_nonce');
  },

  setNonce(nonce: string): void {
    localStorage.setItem('wp_nonce', nonce);
  },

  clearNonce(): void {
    localStorage.removeItem('wp_nonce');
  },

  // Проверка наличия nonce
  hasNonce(): boolean {
    return !!localStorage.getItem('wp_nonce');
  },
};
