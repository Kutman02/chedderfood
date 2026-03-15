import { FaUser, FaCog } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

interface Props {
  userName: string | null
}

export const SettingsDropdown = ({ userName }: Props) => {

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    window.location.reload()
  }

  const firstLetter = userName?.charAt(0).toUpperCase()

  return (
    <div className="absolute right-4 top-16 bg-white shadow-2xl border rounded-xl p-4 z-50 w-56">

      {/* USER INFO */}
      <div className="flex items-center gap-3 pb-3 border-b">

        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-bold">
          {firstLetter}
        </div>

        <p className="font-semibold text-sm">
          {userName}
        </p>

      </div>

      {/* MENU */}
      <div className="flex flex-col mt-3 text-sm">

        <button
          onClick={() => navigate("/dashboard/profile")}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <FaUser />
          Профиль
        </button>

        <button
          onClick={() => navigate("/dashboard/settings")}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <FaCog />
          Настройки
        </button>

      </div>

      {/* LOGOUT */}
      <div className="border-t mt-3 pt-3">

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-red-600 font-semibold p-2 rounded-lg hover:bg-red-50"
        >
          Выйти
        </button>

      </div>

    </div>
  )
}
