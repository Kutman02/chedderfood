import { FaEye, FaEyeSlash } from "react-icons/fa"

interface VisibilityToggleProps {
  value: boolean
  onChange: (value: boolean) => void
}

export const VisibilityToggle = ({
  value,
  onChange
}: VisibilityToggleProps) => {

  const isHidden = value

  return (

    <div>

      <label className="block text-sm font-black text-slate-700 mb-2">
        Видимость на витрине
      </label>

      <button
        type="button"
        onClick={() => onChange(!isHidden)}
        className={`w-full p-4 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-3
        ${
          isHidden
            ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
            : "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
        }`}
      >

        {isHidden ? (
          <>
            <FaEyeSlash size={16} />
            <span>Товар скрыт с витрины</span>
          </>
        ) : (
          <>
            <FaEye size={16} />
            <span>Товар виден на витрине</span>
          </>
        )}

      </button>

      <p className="text-xs text-slate-500 mt-2">

        {isHidden
          ? 'Товар будет сохранён как "Черновик" и не будет отображаться на сайте'
          : "Товар будет опубликован и виден всем посетителям сайта"
        }

      </p>

    </div>

  )

}