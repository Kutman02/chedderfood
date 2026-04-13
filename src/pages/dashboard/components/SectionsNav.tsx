import { NavLink } from "react-router-dom"
import { CgShoppingBag } from "react-icons/cg"
import { GoPackage } from "react-icons/go"
import { FaUsers } from "react-icons/fa6"
import { BiCategory } from "react-icons/bi"
import { FaTags } from "react-icons/fa"

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
    <nav className="mb-6 flex flex-wrap gap-3">

      <NavLink
        to="/dashboard/orders"
        className={({ isActive }) =>
          `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        <CgShoppingBag size={18} />
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
        <GoPackage size={18} />
        Товары
      </NavLink>

      <NavLink
        to="/dashboard/customers"
        className={({ isActive }) =>
          `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        <FaUsers size={18} />
        Клиенты
      </NavLink>

      <NavLink
        to="/dashboard/categories"
        className={({ isActive }) =>
          `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        <BiCategory size={18} />
        Категории
      </NavLink>

      <NavLink
        to="/dashboard/tags"
        className={({ isActive }) =>
          `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        <FaTags size={16} />
        Метки
      </NavLink>

    </nav>
  )
}

export { SectionsNav }