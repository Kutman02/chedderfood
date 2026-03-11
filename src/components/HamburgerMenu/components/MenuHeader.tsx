import { FaTimes } from "react-icons/fa"

interface Props {
  onClose: () => void
}

export const MenuHeader = ({ onClose }: Props) => (

  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">

    <h2 className="text-lg font-semibold text-slate-800">
      Меню
    </h2>

    <button
      onClick={onClose}
      className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
    >
      <FaTimes size={18} />
    </button>

  </div>

)