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

  const baseBtn =
    "flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium transition-colors"

  const secondary =
    "bg-slate-100 text-slate-700 hover:bg-slate-200"

  return (

    <div className="flex items-center gap-2">

      <button
        onClick={toggleReceipts}
        className={`${baseBtn} ${secondary}`}
      >
        <FaReceipt size={14}/>
        <span>Мои заказы</span>
      </button>

      <Link
        to="/about"
        className={`${baseBtn} ${secondary}`}
      >
        <FaInfoCircle size={14}/>
        <span>О нас</span>
      </Link>

      <Link
        to="/contacts"
        className={`${baseBtn} ${secondary}`}
      >
        <FaAddressBook size={14}/>
        <span>Контакты</span>
      </Link>

      <button
        onClick={onCartOpen}
        className={`${baseBtn} bg-orange-600 text-white hover:bg-orange-700`}
      >
        <FaShoppingCart size={14}/>
        <span>Корзина</span>
      </button>

    </div>

  )

}