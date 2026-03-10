import { FaReceipt } from "react-icons/fa"

interface Props {
  onClick: () => void
}

export const ReceiptsButton = ({ onClick }: Props) => {

  return (

    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-5 bg-orange-50 hover:bg-orange-100 rounded-2xl"
    >

      <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">

        <FaReceipt
          className="text-white"
          size={18}
        />

      </div>

      <div className="flex-1">

        <h3 className="font-bold text-slate-800">
          Мои заказы
        </h3>

        <p className="text-sm text-slate-600">
          История заказов
        </p>

      </div>

    </button>

  )

}