import type { FC } from "react"
import type { PublicOrder } from "../../../types"

interface CustomerInfoProps {
  order: PublicOrder
}

export const CustomerInfo: FC<CustomerInfoProps> = ({ order }) => {
  const { billing } = order

  return (
    <div className="mb-6 bg-slate-50 rounded-lg p-4">
      <h3 className="font-bold text-slate-800 mb-3">
        Информация о клиенте
      </h3>

      <div className="space-y-2 text-sm">

        <p className="flex justify-between">
          <span className="text-slate-600">Имя:</span>
          <span className="font-medium">
            {billing?.first_name || "-"}
          </span>
        </p>

        <p className="flex justify-between">
          <span className="text-slate-600">Телефон:</span>
          <span className="font-medium">
            {billing?.phone || "-"}
          </span>
        </p>

        <p className="flex justify-between">
          <span className="text-slate-600">Адрес:</span>
          <span className="font-medium">
            {billing?.address_1 || "-"}
          </span>
        </p>

      </div>
    </div>
  )
}