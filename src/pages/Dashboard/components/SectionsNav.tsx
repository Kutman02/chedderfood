import { NavLink } from "react-router-dom"
import { ShoppingBag, Package, Users } from "lucide-react"

const baseStyle =
  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition"

const activeStyle =
  "bg-orange-100 text-orange-600"

const inactiveStyle =
  "text-slate-600 hover:bg-slate-100"

const SectionsNav = () => {

  return (
    <nav className="flex gap-3 mb-6">

      <NavLink
        to="/dashboard/orders"
        className={({ isActive }) =>
          `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        <ShoppingBag size={18} />
        Заказы
      </NavLink>

      <NavLink
        to="/dashboard/products"
        className={({ isActive }) =>
          `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        <Package size={18} />
        Товары
      </NavLink>

      <NavLink
        to="/dashboard/customers"
        className={({ isActive }) =>
          `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        <Users size={18} />
        Клиенты
      </NavLink>

    </nav>
  )
}

export { SectionsNav }