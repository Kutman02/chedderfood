import { FaExclamationTriangle } from "react-icons/fa"

interface OrderConfirmationProps {
  action: string
  onConfirm: () => void
  onCancel: () => void
}

export const OrderConfirmation = ({
  action,
  onConfirm,
  onCancel
}: OrderConfirmationProps) => {

  const getMessage = () => {
    if (action === "принять") {
      return "Вы точно хотите принять этот заказ в работу?"
    }

    if (action === "завершить") {
      return "Вы точно хотите завершить этот заказ?"
    }

    if (action === "отменить") {
      return "Вы точно хотите отменить этот заказ?"
    }

    return "Вы точно хотите выполнить это действие?"
  }

  const getButtonColor = () => {
    if (action === "отменить") return "bg-red-600 hover:bg-red-700"
    if (action === "завершить") return "bg-green-600 hover:bg-green-700"
    return "bg-blue-600 hover:bg-blue-700"
  }

  return (

    <div className="mt-4 pt-4 border-t-2 border-slate-200 animate-in slide-in-from-top-2 duration-300">

      <div className="bg-amber-50 rounded-xl p-4 mb-4 border border-amber-200">

        <div className="flex items-center gap-3 mb-2">

          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <FaExclamationTriangle className="text-amber-600" />
          </div>

          <h4 className="text-base font-black text-slate-900">
            Подтверждение действия
          </h4>

        </div>

        <p className="text-slate-700 ml-13">
          {getMessage()}
        </p>

      </div>

      <div className="flex gap-2">

        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors active:scale-95"
        >
          Нет
        </button>

        <button
          onClick={onConfirm}
          className={`flex-1 px-4 py-3 ${getButtonColor()} text-white rounded-xl font-bold transition-colors active:scale-95`}
        >
          Да
        </button>

      </div>

    </div>

  )

}