import { FaReceipt } from "react-icons/fa"

interface EmptyReceiptsProps {
  onClose: () => void
}

export const EmptyReceipts = ({ onClose }: EmptyReceiptsProps) => {
  return (
    <div className="text-center py-20">
      
      <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
        <FaReceipt className="text-slate-400" size={48} />
      </div>

      <h3 className="text-2xl font-bold text-slate-800 mb-3">
        У вас пока нет чеков
      </h3>

      <p className="text-slate-600 mb-8 text-lg">
        После оформления заказы будут отображаться здесь
      </p>

      <button
        onClick={onClose}
        className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition-all duration-300 ease-out text-lg active:scale-95 shadow-lg hover:shadow-xl"
      >
        Перейти к покупкам
      </button>

    </div>
  )
}