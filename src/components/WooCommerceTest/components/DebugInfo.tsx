export const DebugInfo = () => {
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Отладочная информация:</h3>

      <ul className="text-sm space-y-1">
        <li>✅ исползуется отдельный WooCommerce API с только Basic Auth</li>
        <li>✅ Нет конфликтов nonce WordPress</li>
        <li>🔍 Отладка в консоли браузера</li>
        <li>🔍 Отладка вкладки Network для HTTP запросов</li>
      </ul>
    </div>
  )
}