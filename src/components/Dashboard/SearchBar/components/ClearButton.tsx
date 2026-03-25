import { FaTimes } from "react-icons/fa"

interface Props {
  onClear: () => void
}

export const ClearButton = ({ onClear }: Props) => {

  return (

    <button
      aria-label="Очистить поиск"
      onClick={onClear}
      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
    >

      <FaTimes size={12} />

    </button>

  )

}