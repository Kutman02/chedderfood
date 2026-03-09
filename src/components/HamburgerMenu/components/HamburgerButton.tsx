import { FaBars } from "react-icons/fa"

interface Props {
  onClick: () => void
}

export const HamburgerButton = ({ onClick }: Props) => (

  <button
    onClick={onClick}
    className="p-2 text-slate-600 hover:text-orange-600 hover:bg-slate-100 rounded-lg transition-colors"
  >
    <FaBars size={20} />
  </button>

)