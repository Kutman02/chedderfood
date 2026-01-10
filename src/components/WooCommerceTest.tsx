import { useState } from 'react';
import { wooCommerceApi } from '../app/services/wooCommerceApi';

interface TestResult {
  data?: { success: boolean; count: number };
  error?: unknown;
  message: string;
}

const WooCommerceTest = () => {
  const [result, setResult] = useState<TestResult | null>(null);

  // Use the hook properly
  const { data: ordersData, error: ordersError, isLoading: ordersLoading } = wooCommerceApi.useGetWooOrdersQuery({ status: 'on-hold' });
  const { data: productsData, error: productsError, isLoading: productsLoading } = wooCommerceApi.useGetWooProductsQuery({});

  const testWooCommerceOrders = () => {
    if (ordersError) {
      setResult({ error: ordersError, message: 'WooCommerce Orders API failed' });
    } else if (ordersData) {
      setResult({ 
        data: { success: true, count: Array.isArray(ordersData) ? ordersData.length : 0 },
        message: `WooCommerce Orders working - found ${Array.isArray(ordersData) ? ordersData.length : 0} orders`
      });
    }
  };

  const testWooCommerceProducts = () => {
    if (productsError) {
      setResult({ error: productsError, message: 'WooCommerce Products API failed' });
    } else if (productsData) {
      setResult({ 
        data: { success: true, count: Array.isArray(productsData) ? productsData.length : 0 },
        message: `WooCommerce Products working - found ${Array.isArray(productsData) ? productsData.length : 0} products`
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">WooCommerce API Test</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Orders</h3>
            <button
              onClick={testWooCommerceOrders}
              disabled={ordersLoading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-3"
            >
              {ordersLoading ? 'Loading...' : 'Test Orders API'}
            </button>
            <div className="text-sm text-gray-600">
              Status: {ordersLoading ? 'Loading...' : ordersError ? 'Error' : ordersData ? 'Success' : 'Idle'}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <button
              onClick={testWooCommerceProducts}
              disabled={productsLoading}
              className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:opacity-50 mb-3"
            >
              {productsLoading ? 'Loading...' : 'Test Products API'}
            </button>
            <div className="text-sm text-gray-600">
              Status: {productsLoading ? 'Loading...' : productsError ? 'Error' : productsData ? 'Success' : 'Idle'}
            </div>
          </div>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Result:</h3>
            <pre className="text-sm overflow-auto bg-white p-3 rounded border">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {ordersError && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-red-800">Orders Error:</h3>
            <pre className="text-sm overflow-auto bg-white p-3 rounded border text-red-600">
              {JSON.stringify(ordersError, null, 2)}
            </pre>
          </div>
        )}

        {productsError && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-red-800">Products Error:</h3>
            <pre className="text-sm overflow-auto bg-white p-3 rounded border text-red-600">
              {JSON.stringify(productsError, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Debug Info:</h3>
          <ul className="text-sm space-y-1">
            <li>✅ Using separate WooCommerce API with only Basic Auth</li>
            <li>✅ No WordPress nonce conflicts</li>
            <li>🔍 Check browser console for detailed logs</li>
            <li>🔍 Check Network tab for HTTP requests</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WooCommerceTest;
