import { FaReceipt } from "react-icons/fa"

interface Props {
  onClick: () => void
}

export const ReceiptsButton = ({ onClick }: Props) => {

  return (

    <button
      onClick={onClick}
      className="
        w-full
        flex items-center gap-4
        p-4
        bg-orange-50
        hover:bg-orange-100
        rounded-xl
        transition-colors
      "
    >

      {/* Icon */}
      <div className="
        flex items-center justify-center
        w-11 h-11
        rounded-full
        bg-orange-600
        text-white
      ">
        <FaReceipt size={18} />
      </div>

      {/* Text */}
      <div className="flex flex-col text-left">

        <h3 className="font-semibold text-slate-800">
          Мои заказы
        </h3>

        <p className="text-sm text-slate-500">
          История заказов
        </p>

      </div>

    </button>

  )

}