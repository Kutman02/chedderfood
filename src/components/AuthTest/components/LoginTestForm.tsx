interface Props {
  username: string
  password: string
  setUsername: (v: string) => void
  setPassword: (v: string) => void
  testLogin: () => void
  loading: boolean
}

export const LoginTestForm = ({
  username,
  password,
  setUsername,
  setPassword,
  testLogin,
  loading
}: Props) => {

  return (

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
        className="w-full bg-blue-600 text-white p-3 rounded-lg"
      >
        {loading ? "Загрузка..." : "Тестировать логин"}
      </button>

    </div>

  )

}