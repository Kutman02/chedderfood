import { Link } from "react-router-dom"
import { FaHome, FaInfoCircle, FaAddressBook } from "react-icons/fa"

export const FooterLinks = () => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-5 text-white flex items-center gap-2">
        <span className="w-1 h-5 bg-orange-500 rounded-full"></span>
        Информация
      </h3>

      <ul className="space-y-3">

        <li>
          <Link
            to="/"
            className="flex items-center gap-3 text-slate-300 hover:text-orange-400 transition-colors text-sm group"
          >
            <FaHome
              className="text-orange-500/50 group-hover:text-orange-500 transition-colors"
              size={14}
            />
            <span>Главная</span>
          </Link>
        </li>

        <li>
          <Link
            to="/about"
            className="flex items-center gap-3 text-slate-300 hover:text-orange-400 transition-colors text-sm group"
          >
            <FaInfoCircle
              className="text-orange-500/50 group-hover:text-orange-500 transition-colors"
              size={14}
            />
            <span>О нас</span>
          </Link>
        </li>

        <li>
          <Link
            to="/contacts"
            className="flex items-center gap-3 text-slate-300 hover:text-orange-400 transition-colors text-sm group"
          >
            <FaAddressBook
              className="text-orange-500/50 group-hover:text-orange-500 transition-colors"
              size={14}
            />
            <span>Контакты</span>
          </Link>
        </li>

      </ul>
    </div>
  )
}