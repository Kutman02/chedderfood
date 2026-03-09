import { Link } from "react-router-dom"
import { HamburgerMenu } from "../../HamburgerMenu/HamburgerMenu"
import { ReceiptsButton } from "./ReceiptsButton"

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
          BurgerFood
        </div>
      </Link>

      <div className="flex items-center gap-2">
        <ReceiptsButton
          hasActiveOrders={hasActiveOrders}
          onClick={onReceiptsClick}
        />

        <HamburgerMenu onCartOpen={onCartToggle} />
      </div>
    </div>
  )
}