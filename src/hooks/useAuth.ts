import { useState, useEffect } from 'react';
import { userService } from '../app/services/userService';
import { useAppSelector } from '../app/hooks';

interface User {
  id: number;
  name: string;
  email: string;
  roles?: string[];
}

// ===============================
// Лог-метки
// ===============================

const LOG = {
  info: '🔍',
  success: '✅',
  error: '❌',
  warn: '⚠️',
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useAppSelector((s) => s.auth.token);
  const userName = useAppSelector((s) => s.auth.userName);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        // ===============================
        // Если есть токен (локальная авторизация)
        // ===============================
        if (token) {
          console.log(`${LOG.info} Авторизация через токен`);

          setUser({
            id: 0,
            name: userName ?? 'Пользователь',
            email: '',
          });

          setError(null);
          setLoading(false);
          return;
        }

        // ===============================
        // Проверка через WordPress API
        // ===============================
        console.log(`${LOG.info} Проверка авторизации через API`);

        userService.debugAuthStatus();

        setLoading(true);
        setError(null);

        const userData = await userService.getCurrentUser();

        console.log(`${LOG.info} Ответ от API:`, userData);

        if (userData) {
          console.log(`${LOG.success} Пользователь авторизован`);
          setUser(userData);
        } else {
          console.log(`${LOG.warn} Пользователь не авторизован`);
          setUser(null);
        }

      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Ошибка проверки авторизации';

        console.error(`${LOG.error} Ошибка авторизации:`, errorMessage);

        // 401 — это нормальная ситуация (не залогинен)
        if (errorMessage.includes('401')) {
          console.log(`${LOG.info} Пользователь не залогинен (401 — это нормально)`);
          setError(null);
        } else {
          console.warn(`${LOG.warn} Неожиданная ошибка авторизации`);
          setError(errorMessage);
        }

        setUser(null);

      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
  }, [token, userName]);

  // ===============================
  // Logout
  // ===============================
  const logout = async () => {
    try {
      console.log(`${LOG.info} Выход из системы`);

      await userService.logout();

      setUser(null);

      console.log(`${LOG.success} Пользователь вышел`);
    } catch (err) {
      console.error(`${LOG.error} Ошибка при выходе:`, err);
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!token,
    logout,
  };
};