import { FaTimes } from "react-icons/fa"

interface EditProductHeaderProps {
  onClose: () => void
}

export const EditProductHeader = ({
  onClose
}: EditProductHeaderProps) => {

  return (

    <div className="flex items-center justify-between p-4 border-b border-slate-200">

      <h2 className="text-xl font-black text-slate-900">
        Редактировать товар
      </h2>

      <button
        onClick={onClose}
        aria-label="Закрыть"
        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
      >
        <FaTimes />
      </button>

    </div>

  )

}