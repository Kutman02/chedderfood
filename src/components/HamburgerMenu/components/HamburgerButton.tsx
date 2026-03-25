import { FaBars } from "react-icons/fa"

interface Props {
  onClick: () => void
}

export const HamburgerButton = ({ onClick }: Props) => (

  <button
  aria-label="Открыть меню"
    onClick={(e) => {
      e.stopPropagation()
      console.log("Нажата кнопка меню")
      onClick()
    }}
    className="
      flex items-center justify-center
      w-9 h-9
      text-slate-700
      rounded-lg
      hover:bg-slate-100
      hover:text-orange-600
      transition-colors
      active:scale-[0.96]
    "
  >
    <FaBars size={18} />
  </button>

)