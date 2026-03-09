export const DebugInfo = () => {
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Debug Info:</h3>

      <ul className="text-sm space-y-1">
        <li>✅ Using separate WooCommerce API with only Basic Auth</li>
        <li>✅ No WordPress nonce conflicts</li>
        <li>🔍 Check browser console for detailed logs</li>
        <li>🔍 Check Network tab for HTTP requests</li>
      </ul>
    </div>
  )
}