import React from "react"
import { FaTimes } from "react-icons/fa"

interface AddProductHeaderProps {
  onClose: () => void
}

export const AddProductHeader: React.FC<AddProductHeaderProps> = ({ onClose }) => {

  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-200">

      <h2 className="text-xl font-black text-slate-900">
        Создать новый товар
      </h2>

      <button
        onClick={onClose}
        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
      >
        <FaTimes />
      </button>

    </div>
  )

}