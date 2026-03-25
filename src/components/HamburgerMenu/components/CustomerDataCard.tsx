import { FaUser, FaPhone,  FaTimes } from "react-icons/fa"
import { GrMap } from "react-icons/gr";


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
  onClear
}: CustomerDataCardProps) => {

  if (!customerData) {
    return (
      <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-700 mb-1">
          Сохраненные данные отсутствуют
        </p>

        <p className="text-xs text-slate-500">
          После первого заказа данные сохранятся автоматически
        </p>
      </div>
    )
  }

  return (

    <div className="bg-slate-50 rounded-xl p-4 space-y-4">

      {/* Data */}
      <div className="space-y-3 text-sm">

        {/* Name */}
        <div className="flex items-center gap-3">

          <FaUser className="text-slate-400" size={14} />

          <span className="text-slate-700 font-medium">
            {customerData.first_name}
          </span>

        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">

          <FaPhone className="text-slate-400" size={14} />

          <span className="text-slate-700">
            {customerData.phone}
          </span>

        </div>

        {/* Address */}
        <div className="flex items-center gap-3">

          <GrMap className="text-slate-400" size={14} />

          <span className="text-slate-700 truncate">
            {customerData.address}
          </span>

        </div>

      </div>

      {/* Actions */}
      <div className="flex gap-2">
        

        <button
          onClick={onClear}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
          title="Очистить данные"
        >
          <FaTimes size={16} />
        </button>

      </div>

    </div>

  )

}