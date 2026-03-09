export const AuthInfo = () => {

  return (

    <div className="mt-6 p-4 bg-yellow-50 rounded-lg">

      <h3 className="text-lg font-semibold mb-2">
        Важные моменты:
      </h3>

      <ul className="text-sm space-y-1">

        <li>
          ✅ credentials: 'include' — передает cookies
        </li>

        <li>
          ✅ Content-Type: application/json — для тела запроса
        </li>

        <li>
          ❌ НЕ добавлять Access-Control-Allow-Origin на клиенте
        </li>

        <li>
          🔍 Проверьте Network вкладку в DevTools
        </li>

      </ul>

    </div>

  )

}