import { useState, useEffect } from 'react';
import { userService } from '../app/services/userService';
import { useAppSelector } from '../app/hooks';

interface User {
  id: number;
  name: string;
  email: string;
  roles?: string[];
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAppSelector((s) => s.auth.token);
  const userName = useAppSelector((s) => s.auth.userName);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        if (token) {
          setUser({ id: 0, name: userName ?? 'User', email: '' });
          setError(null);
          setLoading(false);
          return;
        }

        console.log('🔍 Auth Hook: Starting authentication check');
        userService.debugAuthStatus(); // Debug current auth status
        setLoading(true);
        setError(null);
        
        const userData = await userService.getCurrentUser();
        
        console.log('🔍 Auth Hook: User data received:', userData);
        
        if (userData) {
          console.log('🔍 Auth Hook: User is authenticated');
          setUser(userData);
        } else {
          console.log('🔍 Auth Hook: User is not authenticated');
          setUser(null);
        }
      } catch (err) {
        console.log('🔍 Auth Hook: Authentication error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to check authentication';
        
        // Не считаем 401 ошибкой критической - это просто означает что пользователь не залогинен
        if (errorMessage.includes('HTTP error! status: 401')) {
          console.log('🔍 Auth Hook: User not logged in (401), this is expected');
          setError(null); // Не устанавливаем ошибку для 401
        } else {
          console.log('🔍 Auth Hook: Unexpected authentication error');
          setError(errorMessage);
        }
        
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
  }, [token, userName]);

  const logout = async () => {
    try {
      await userService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
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
