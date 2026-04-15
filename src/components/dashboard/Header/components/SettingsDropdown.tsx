import {
  FaUser,
  FaShoppingBag,
  FaBox,
  FaUsers,
  FaThList,
  FaTags,
  FaChartBar
} from "react-icons/fa"
import { createPortal } from "react-dom"
import { NavLink } from "react-router-dom"

interface Props {
  userName: string | null
  onClose: () => void
}

const menuItems = [
  { label: "Заказы", path: "/dashboard/orders", icon: FaShoppingBag },
  { label: "Товары", path: "/dashboard/products", icon: FaBox },
  { label: "Клиенты", path: "/dashboard/customers", icon: FaUsers },
  { label: "Категории", path: "/dashboard/categories", icon: FaThList },
  { label: "Метки", path: "/dashboard/tags", icon: FaTags },
  { label: "Статистика", path: "/dashboard/stats", icon: FaChartBar },
  { label: "Профиль", path: "/dashboard/profile", icon: FaUser },
]

export const SettingsDropdown = ({ userName, onClose }: Props) => {

  const handleLogout = () => {
    localStorage.clear()
    onClose()
    window.location.reload()
  }

  const firstLetter = userName?.charAt(0).toUpperCase()

  const mobileDrawer = (
    <div
      data-admin-settings-dropdown="true"
      className="md:hidden fixed inset-0 z-1000"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-2xl p-4 flex flex-col overflow-y-auto">
        <div className="flex items-center gap-3 pb-4 border-b">

          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-bold">
            {firstLetter || "?"}
          </div>

          <p className="font-semibold text-sm">
            {userName || "Пользователь"}
          </p>

        </div>

        <div className="flex flex-col mt-4 text-sm gap-1">

          {menuItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `w-full flex items-center gap-2 p-2 rounded-lg text-left transition ${
                  isActive
                    ? "bg-orange-100 text-orange-600"
                    : "hover:bg-gray-100 text-slate-700"
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}

        </div>

        <div className="border-t mt-auto pt-3">

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-red-600 font-semibold p-2 rounded-lg hover:bg-red-50"
          >
            Выйти
          </button>

        </div>
      </aside>
    </div>
  )

  return (
    <>
      {typeof document !== "undefined" && createPortal(mobileDrawer, document.body)}

      <div
        data-admin-settings-dropdown="true"
        className="hidden md:block absolute right-0 top-14 bg-white shadow-2xl border rounded-xl p-4 z-50 w-64"
      >
        <div className="flex items-center gap-3 pb-3 border-b">

          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-bold">
            {firstLetter || "?"}
          </div>

          <p className="font-semibold text-sm">
            {userName || "Пользователь"}
          </p>

        </div>

        <div className="flex flex-col mt-3 text-sm gap-1">

          {menuItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `w-full flex items-center gap-2 p-2 rounded-lg text-left transition ${
                  isActive
                    ? "bg-orange-100 text-orange-600"
                    : "hover:bg-gray-100 text-slate-700"
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}

        </div>

        <div className="border-t mt-3 pt-3">

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-red-600 font-semibold p-2 rounded-lg hover:bg-red-50"
          >
            Выйти
          </button>

        </div>

      </div>

    </>
  )
}
