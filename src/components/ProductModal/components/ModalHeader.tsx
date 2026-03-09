import { FaTimes } from "react-icons/fa"

interface ModalHeaderProps {
  title: string
  onClose: () => void
}

export const ModalHeader = ({ title, onClose }: ModalHeaderProps) => {
  return (
    <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
      
      <h2 className="text-xl font-black text-slate-800">
        {title}
      </h2>

      <button
        onClick={onClose}
        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        aria-label="Закрыть"
      >
        <FaTimes size={20} />
      </button>

    </div>
  )
}