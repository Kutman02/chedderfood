import { FaTimes } from "react-icons/fa"
import type { Product } from "@/types"

interface ModalHeaderProps {
  product: Product
  onClose: () => void
}

export const ModalHeader = ({ product, onClose }: ModalHeaderProps) => {
  return (
    <div className="shrink-0 flex items-center justify-between p-4 border-b border-slate-200 md:hidden">
      <h2 className="text-lg font-black text-slate-800 flex-1 pr-2">
        {product.name}
      </h2>

      <button
        onClick={onClose}
        aria-label="Закрыть"
        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors rounded-lg shrink-0"
      >
        <FaTimes size={20} />
      </button>
    </div>
  )
}