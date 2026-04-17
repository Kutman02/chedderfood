import { Link } from "react-router-dom"
import { PiAddressBookFill } from "react-icons/pi";
import { HiMiniShoppingCart } from "react-icons/hi2";
import { GiSecretBook } from "react-icons/gi";
import { PiInfoBold } from "react-icons/pi";
import { useAppSelector } from "@/app/hooks";




interface Props {
  toggleReceipts: () => void
  onCartOpen?: () => void
}

export const DesktopMenu = ({
  toggleReceipts,
  onCartOpen
}: Props) => {

  const cartCount = useAppSelector((s) =>
    Object.values(s.cart.items).reduce((sum, item) => sum + item.quantity, 0)
  )
  const displayCount = cartCount > 99 ? "99+" : String(cartCount)

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
        <GiSecretBook size={14}/>
        <span>Мои заказы</span>
      </button>

      <Link
        to="/about"
        className={`${baseBtn} ${secondary}`}
      >
        <PiInfoBold size={14}/>
        <span>О нас</span>
      </Link>

      <Link
        to="/contacts"
        className={`${baseBtn} ${secondary}`}
      >
        <PiAddressBookFill size={14}/>
        <span>Контакты</span>
      </Link>

      <button
        onClick={onCartOpen}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-lg active:scale-95"
        aria-label={`Открыть корзину, товаров: ${cartCount}`}
        title="Корзина"
      >
        <HiMiniShoppingCart size={18} />

        {cartCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-black leading-none text-orange-700 ring-2 ring-orange-200">
            {displayCount}
          </span>
        )}
      </button>

    </div>

  )

}