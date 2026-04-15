import { FaTimes } from "react-icons/fa"

interface ModalHeaderProps {
  onClose: () => void
}

export const ModalHeader = ({ onClose }: ModalHeaderProps) => {
  return (
    <div className="absolute top-3 right-3 z-20 md:hidden pointer-events-none">

      <button
        onClick={onClose}
        aria-label="Закрыть"
        className="p-2 text-slate-700 hover:text-black transition-colors rounded-full shrink-0 pointer-events-auto"
      >
        <FaTimes size={20} />
      </button>
    </div>
  )
}