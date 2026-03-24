import { NavLink } from "react-router-dom"
import { ShoppingBag, Package, Users } from "lucide-react"

interface SectionsNavProps {
  ordersCount?: number
}

const baseStyle =
  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition"

const activeStyle =
  "bg-orange-100 text-orange-600"

const inactiveStyle =
  "text-slate-600 hover:bg-slate-100"

const badgeStyle =
  "ml-1 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full"

const SectionsNav = ({ ordersCount = 0 }: SectionsNavProps) => {

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

        {ordersCount >  0 && (
          <span className={badgeStyle}>
            {ordersCount}
          </span>
        )}

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