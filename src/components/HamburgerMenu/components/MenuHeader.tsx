import { FaTimes } from "react-icons/fa"

interface Props {
  onClose: () => void
}

export const MenuHeader = ({ onClose }: Props) => (

  <div className="shrink-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">

    <h2 className="text-lg font-black text-slate-800">
      Меню
    </h2>

    <button
      onClick={onClose}
      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
    >
      <FaTimes size={20} />
    </button>

  </div>

)