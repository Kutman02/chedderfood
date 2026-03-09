import { FaSignOutAlt } from "react-icons/fa"

interface Props {
  userName: string | null
}

export const SettingsDropdown = ({ userName }: Props) => {

  const handleLogout = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (

    <div className="absolute right-4 top-16 bg-white shadow-2xl border rounded-xl p-4 z-50 w-48">

      <p className="font-bold text-sm">
        {userName}
      </p>

      <button
        onClick={handleLogout}
        className="mt-4 w-full flex items-center gap-2 text-red-600 font-bold text-sm"
      >

        <FaSignOutAlt />

        Выйти

      </button>

    </div>

  )

}