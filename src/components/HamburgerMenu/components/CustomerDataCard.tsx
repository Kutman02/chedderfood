import { FaUser, FaPhone, FaMapMarkerAlt, FaTimes } from "react-icons/fa"

interface CustomerData {
  first_name: string
  phone: string
  address: string
}

interface CustomerDataCardProps {
  customerData: CustomerData | null
  onUse?: () => void
  onClear: () => void
}

export const CustomerDataCard = ({
  customerData,
  onUse,
  onClear
}: CustomerDataCardProps) => {

  if (!customerData) {

    return (

      <div className="bg-slate-50 rounded-2xl p-6 text-center shadow-sm">

        <p className="text-sm text-slate-600 mb-2">
          Сохраненные данные отсутствуют
        </p>

        <p className="text-xs text-slate-500">
          После первого заказа данные сохранятся автоматически
        </p>

      </div>

    )

  }

  return (

    <div className="bg-slate-50 rounded-2xl p-5 shadow-sm">

      <div className="space-y-3 text-sm mb-5">

        {/* Имя */}
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl">

          <FaUser size={14} className="text-slate-400" />

          <span className="text-slate-700 font-medium">
            {customerData.first_name}
          </span>

        </div>

        {/* Телефон */}
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl">

          <FaPhone size={14} className="text-slate-400" />

          <span className="text-slate-700 font-medium">
            {customerData.phone}
          </span>

        </div>

        {/* Адрес */}
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl">

          <FaMapMarkerAlt size={14} className="text-slate-400" />

          <span className="text-slate-700 font-medium truncate">
            {customerData.address}
          </span>

        </div>

      </div>

      {/* Кнопки */}
      <div className="flex gap-3">

        {onUse && (

          <button
            onClick={onUse}
            className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors active:scale-[0.98]"
          >
            Использовать
          </button>

        )}

        <button
          onClick={onClear}
          className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors active:scale-[0.98]"
          title="Очистить данные"
        >
          <FaTimes size={16} />
        </button>

      </div>

    </div>

  )

}