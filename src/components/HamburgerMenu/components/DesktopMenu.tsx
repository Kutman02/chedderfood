import { Link } from "react-router-dom"
import { FaReceipt, FaShoppingCart, FaInfoCircle, FaAddressBook } from "react-icons/fa"

interface Props {
  toggleReceipts: () => void
  onCartOpen?: () => void
}

export const DesktopMenu = ({
  toggleReceipts,
  onCartOpen
}: Props) => {

  return (

    <div className="flex items-center gap-2">

      <button
        onClick={toggleReceipts}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg"
      >
        <FaReceipt size={14}/>
        <span className="text-sm font-medium">Мои чеки</span>
      </button>

      <Link
        to="/about"
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg"
      >
        <FaInfoCircle size={14}/>
        <span className="text-sm font-medium">О нас</span>
      </Link>

      <Link
        to="/contacts"
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg"
      >
        <FaAddressBook size={14}/>
        <span className="text-sm font-medium">Контакты</span>
      </Link>

      <button
        onClick={onCartOpen}
        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg"
      >
        <FaShoppingCart size={14}/>
        <span className="text-sm font-medium">Корзина</span>
      </button>

    </div>

  )

}