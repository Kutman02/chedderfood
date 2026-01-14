import React, { useState } from 'react';
import { authService } from '../app/services/authService';
import { useAppDispatch } from '../app/hooks';
import { setCredentials } from '../app/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Application Password работает без username/password из формы
      // Проверяем валидность Application Password из переменных окружения
      const result = await authService.login({ username, password });
      
      if (result.success && result.user) {
        // Application Password работает без nonce и cookies
        // Просто сохраняем информацию о пользователе
        dispatch(setCredentials({ 
          token: 'app_password_authenticated', // Маркер для Application Password
          userName: result.user.name || 'User' 
        }));
        console.log('👤 Login successful with Application Password for:', result.user.name);
        navigate('/dashboard');
      } else {
        console.error('❌ Login failed:', result.message || 'Unknown error');
        setError(result.message || 'Ошибка входа. Проверьте настройки Application Password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ошибка сети. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-slate-900 uppercase">Burger Food</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Панель оператора</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Логин</label>
            <input 
              type="text" 
              className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите логин..."
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Пароль</label>
            <input 
              type="password" 
              className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-900 text-white p-3 rounded-xl font-bold uppercase hover:bg-orange-600 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;