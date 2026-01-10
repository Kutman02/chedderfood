import { useState } from 'react';
import { authService } from '../app/services/authService';
import { userService } from '../app/services/userService';

interface AuthResult {
  success?: boolean;
  user?: {
    id: number;
    email: string;
    name: string;
  };
  nonce?: string;       // WordPress nonce
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

  const testFetchNonce = async () => {
    try {
      const nonce = await authService.fetchNonce();
      setResult({ nonce: nonce || undefined, message: nonce ? 'Nonce fetched successfully' : 'Failed to fetch nonce' });
    } catch (error) {
      setResult({ error: (error as Error).message });
    }
  };

  const testClearNonce = () => {
    userService.clearInvalidNonce();
    setResult({ message: 'Nonce cleared from localStorage' });
  };

  const testWooCommerceAPI = async () => {
    try {
      console.log('🔍 Testing WooCommerce API...');
      // Direct fetch test for WooCommerce API
      const consumerKey = 'ck_0cae419a8938564cd19a80fd72c31fc15b30c6d6';
      const consumerSecret = 'cs_82f076acfa6a7009482cfe16bd9c3f10b6e39846';
      const credentials = btoa(`${consumerKey}:${consumerSecret}`);
      
      const response = await fetch('https://cd444351-wordpress-zdtv5.tw1.ru/wp-json/wc/v3/orders?status=on-hold&per_page=10', {
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
            <h3 className="text-lg font-semibold mb-4">Тест текущего пользователя</h3>
            <button
              onClick={testFetchNonce}
              className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 mb-3"
            >
              Получить свежий nonce
            </button>
            <button
              onClick={testClearNonce}
              className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 mb-3"
            >
              Очистить nonce
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
            <button
              onClick={() => {
                const nonce = authService.getNonce();
                alert(`Nonce: ${nonce || 'Не найден'}`);
              }}
              className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700"
            >
              Проверить сохраненный nonce
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
