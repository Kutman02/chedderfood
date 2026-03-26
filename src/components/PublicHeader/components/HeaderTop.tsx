import { Link } from "react-router-dom"
import { HamburgerMenu } from "../../HamburgerMenu/HamburgerMenu"
import { DeliveryIndicator } from "./DeliveryIndicator"

interface HeaderTopProps {
  hasActiveOrders: boolean
  onReceiptsClick: () => void
  onCartToggle: () => void
}

export const HeaderTop = ({
  hasActiveOrders,
  onReceiptsClick,
  onCartToggle,
}: HeaderTopProps) => {

  return (
    <div className="flex items-center justify-between py-2.5">

      <Link to="/" className="flex items-center gap-2">
        <div className="text-xl font-black text-orange-600">
          KutMenu
        </div>
      </Link>

      <div className="flex items-center gap-3">

        {/* Индикатор доставки */}
        <DeliveryIndicator
          isActive={hasActiveOrders}
          onClick={onReceiptsClick}
        />

        <HamburgerMenu
          onCartOpen={onCartToggle}
          toggleReceipts={onReceiptsClick}
        />

      </div>

    </div>
  )
}