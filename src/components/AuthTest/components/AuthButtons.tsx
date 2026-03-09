interface Props {
  testGetCurrentUser: () => void
  testAppPassword: () => void
  testWooCommerceAPI: () => void
  testDebugAuth: () => void
}

export const AuthButtons = ({
  testGetCurrentUser,
  testAppPassword,
  testWooCommerceAPI,
  testDebugAuth
}: Props) => {

  return (

    <div className="space-y-3">

      <button
        onClick={testGetCurrentUser}
        className="w-full bg-green-600 text-white p-3 rounded-lg"
      >
        Получить текущего пользователя
      </button>

      <button
        onClick={testAppPassword}
        className="w-full bg-purple-600 text-white p-3 rounded-lg"
      >
        Проверить Application Password
      </button>

      <button
        onClick={testWooCommerceAPI}
        className="w-full bg-orange-600 text-white p-3 rounded-lg"
      >
        Тест WooCommerce API
      </button>

      <button
        onClick={testDebugAuth}
        className="w-full bg-yellow-600 text-white p-3 rounded-lg"
      >
        Отладить авторизацию
      </button>

    </div>

  )

}