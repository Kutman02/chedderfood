import { useState } from 'react';
import { authService } from '../app/services/authService';
import { userService } from '../app/services/userService';
import { API_BASE_URL, WOOCOMMERCE_CONSUMER_KEY, WOOCOMMERCE_CONSUMER_SECRET } from '../app/services/apiConfig';

interface AuthResult {
  success?: boolean;
  user?: {
    id: number;
    email: string;
    name: string;
  };
  message?: string;
  error?: string;
  data?: Record<string, unknown>;           // For user data from getCurrentUser
}

const AuthTest = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<AuthResult | null>(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      // Используем authService.login()
      const data = await authService.login({ username, password });
      console.log('Test login response:', data);
      setResult(data);
    } catch (error) {
      console.error('Test login error:', error);
      setResult({ error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const testGetCurrentUser = async () => {
    try {
      const user = await userService.getCurrentUser();
      if (user) {
        setResult({ 
          data: { ...user } as Record<string, unknown>, 
          message: 'Current user fetched successfully',
          success: true 
        });
      } else {
        setResult({ message: 'Failed to get current user - check Application Password configuration' });
      }
    } catch (error) {
      setResult({ error: (error as Error).message });
    }
  };

  const testAppPassword = () => {
    const hasAppPassword = authService.hasAppPassword();
    setResult({ 
      message: hasAppPassword 
        ? 'Application Password is configured ✅' 
        : 'Application Password is NOT configured ❌',
      success: hasAppPassword
    });
  };

  const testWooCommerceAPI = async () => {
    try {
      console.log('🔍 Testing WooCommerce API...');
      // Direct fetch test for WooCommerce API
      if (!WOOCOMMERCE_CONSUMER_KEY || !WOOCOMMERCE_CONSUMER_SECRET) {
        setResult({ 
          error: 'WooCommerce API ключи не настроены. Установите VITE_WC_CONSUMER_KEY и VITE_WC_CONSUMER_SECRET в .env файле',
          message: 'WooCommerce API keys not configured'
        });
        return;
      }
      const credentials = btoa(`${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}`);
      
      const response = await fetch(`${API_BASE_URL}wc/v3/orders?status=on-hold&per_page=10`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('WooCommerce API Response:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('WooCommerce API Data:', data);
        setResult({ 
          data: { success: true, count: Array.isArray(data) ? data.length : 0 },
          message: `WooCommerce API working - found ${Array.isArray(data) ? data.length : 0} orders`
        });
      } else {
        const errorText = await response.text();
        console.error('WooCommerce API Error:', errorText);
        setResult({ 
          error: `HTTP ${response.status}: ${errorText}`,
          message: 'WooCommerce API failed'
        });
      }
    } catch (error) {
      console.error('WooCommerce API Error:', error);
      setResult({ error: (error as Error).message });
    }
  };

  const testDebugAuth = () => {
    userService.debugAuthStatus();
    setResult({ message: 'Debug info logged to console' });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Тест авторизации</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Тест логина</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
              <button
                onClick={testLogin}
                disabled={loading}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Загрузка...' : 'Тестировать логин'}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Тест Application Password</h3>
            <button
              onClick={testGetCurrentUser}
              className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 mb-3"
            >
              Получить текущего пользователя
            </button>
            <button
              onClick={testAppPassword}
              className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 mb-3"
            >
              Проверить Application Password
            </button>
            <button
              onClick={testWooCommerceAPI}
              className="w-full bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700 mb-3"
            >
              Тест WooCommerce API
            </button>
            <button
              onClick={testDebugAuth}
              className="w-full bg-yellow-600 text-white p-3 rounded-lg hover:bg-yellow-700 mb-3"
            >
              Отладить авторизацию
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Результат:</h3>
            <pre className="text-sm overflow-auto bg-white p-3 rounded border">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Важные моменты:</h3>
          <ul className="text-sm space-y-1">
            <li>✅ credentials: 'include' - передает cookies</li>
            <li>✅ Content-Type: application/json - для тела запроса</li>
            <li>❌ НЕ добавлять Access-Control-Allow-Origin на клиенте</li>
            <li>🔍 Проверьте Network вкладку в DevTools</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;
