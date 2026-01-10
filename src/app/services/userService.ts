// Сервис для работы с пользователем WordPress

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

export const userService = {
  // Debug utility to check authentication status
  debugAuthStatus(): void {
    const nonce = localStorage.getItem('wp_nonce');
    console.log('🔍 Debug Auth Status:');
    console.log('  - Nonce exists:', !!nonce);
    console.log('  - Nonce value:', nonce);
    console.log('  - Nonce length:', nonce ? nonce.length : 0);
    console.log('  - LocalStorage keys:', Object.keys(localStorage));
  },

  // Получение nonce из WordPress API
  async fetchNonce(): Promise<string | null> {
    try {
      console.log('🔍 Debug: Fetching fresh nonce from WordPress');
      const res = await fetch('https://cd444351-wordpress-zdtv5.tw1.ru/wp-json/custom/v1/nonce', {
        method: 'GET',
        credentials: 'include',
      });

      console.log('🔍 Debug: Nonce response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.log('🔍 Debug: Failed to fetch nonce, status:', res.status);
        console.log('🔍 Debug: Nonce error response:', errorText);
        return null;
      }

      const data = await res.json();
      console.log('🔍 Debug: Nonce response data:', data);
      
      if (data.nonce) {
        console.log('🔍 Debug: Fresh nonce received:', data.nonce);
        localStorage.setItem('wp_nonce', data.nonce);
        return data.nonce;
      }
      console.log('🔍 Debug: No nonce in response data');
      return null;
    } catch (error) {
      console.error('Error fetching nonce:', error);
      return null;
    }
  },

  // Получение текущего пользователя
  async getCurrentUser(): Promise<User | null> {
    try {
      let nonce = localStorage.getItem('wp_nonce');
      console.log('🔍 Debug: Getting current user');
      console.log('🔍 Debug: Nonce from localStorage:', nonce);
      console.log('🔍 Debug: Nonce length:', nonce ? nonce.length : 'null');
      
      // If no nonce, try to fetch one first
      if (!nonce) {
        console.log('🔍 Debug: No nonce found, fetching fresh nonce');
        nonce = await this.fetchNonce();
        if (!nonce) {
          console.log('🔍 Debug: Could not obtain nonce, user might not be logged in');
          return null;
        }
      }
      
      const requestHeaders = {
        'Content-Type': 'application/json',
        'X-WP-Nonce': nonce || '',
      };
      
      console.log('🔍 Debug: Request headers:', requestHeaders);
      console.log('🔍 Debug: Request URL:', 'https://cd444351-wordpress-zdtv5.tw1.ru/wp-json/wp/v2/users/me');
      
      const res = await fetch('https://cd444351-wordpress-zdtv5.tw1.ru/wp-json/wp/v2/users/me', {
        method: 'GET',
        credentials: 'include', // КЛЮЧЕВОЙ параметр для передачи cookies
        headers: requestHeaders,
      });

      console.log('🔍 Debug: Response status:', res.status);
      console.log('🔍 Debug: Response headers:', Object.fromEntries(res.headers.entries()));

      // If we get a 403 or 401 with invalid nonce/credentials, try to fetch a fresh nonce and retry once
      if (res.status === 403 || res.status === 401) {
        const errorText = await res.text();
        console.log('🔍 Debug: Error response body:', errorText);
        console.log('🔍 Debug: Error status:', res.status);
        
        if (errorText.includes('rest_cookie_invalid_nonce') || errorText.includes('rest_forbidden') || res.status === 401) {
          console.log('🔍 Debug: Invalid nonce/auth detected, fetching fresh nonce and retrying');
          
          // Clear existing nonce first
          localStorage.removeItem('wp_nonce');
          
          const freshNonce = await this.fetchNonce();
          
          if (freshNonce) {
            console.log('🔍 Debug: Retrying with fresh nonce');
            const retryRes = await fetch('https://cd444351-wordpress-zdtv5.tw1.ru/wp-json/wp/v2/users/me', {
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
              const retryErrorText = await retryRes.text();
              console.log('🔍 Debug: Retry error body:', retryErrorText);
            }
          }
        }
        
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.log('🔍 Debug: Error response body:', errorText);
        throw new Error(`HTTP error! status: ${res.status}`);
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

  // Выход (очистка сессии)
  async logout(): Promise<void> {
    try {
      console.log('🔍 Debug: Starting logout process');
      const nonce = localStorage.getItem('wp_nonce');
      
      if (nonce) {
        try {
          await fetch('https://cd444351-wordpress-zdtv5.tw1.ru/wp-json/custom/v1/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-WP-Nonce': nonce,
            },
          });
          console.log('🔍 Debug: Logout request sent successfully');
        } catch (logoutError) {
          console.log('🔍 Debug: Logout request failed, but continuing with cleanup:', logoutError);
        }
      }
      
      // Очищаем nonce при выходе
      localStorage.removeItem('wp_nonce');
      console.log('🔍 Debug: Nonce cleared from localStorage');
    } catch (error) {
      console.error('Logout error:', error);
      // Все равно очищаем nonce при ошибке
      localStorage.removeItem('wp_nonce');
      console.log('🔍 Debug: Nonce cleared due to error');
    }
  },

  // Утилита для очистки невалидного nonce
  clearInvalidNonce(): void {
    console.log('🔍 Debug: Clearing invalid nonce');
    localStorage.removeItem('wp_nonce');
  },
};
