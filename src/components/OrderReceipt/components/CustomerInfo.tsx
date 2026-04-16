import type { FC } from "react"
import type { Order } from "@/types"

interface CustomerInfoProps {
  order: Order
}

export const CustomerInfo: FC<CustomerInfoProps> = ({ order }) => {

  /* ===============================
     SAFE VALUES
  =============================== */

  const name =
    order.customer_name?.trim() || "Клиент"

  const phone =
    order.phone?.trim() || "Не указан"

  const address =
    order.address?.trim() || "Не указан"

  const apartmentOffice = (order.apartment_office || order.apartment)?.trim()
  const floor = order.floor?.trim()
  const email = order.email?.trim()

  return (
    <div className="mb-6 bg-slate-50 rounded-lg p-4">

      <h3 className="font-bold text-slate-800 mb-3">
        Информация о клиенте
      </h3>

      <div className="space-y-2 text-sm">

        <p className="flex justify-between">
          <span className="text-slate-600">Имя:</span>
          <span className="font-medium text-right max-w-[60%] whitespace-pre-wrap">
            {name}
          </span>
        </p>

        <p className="flex justify-between">
          <span className="text-slate-600">Телефон:</span>
          <span className="font-medium text-right">
            {phone}
          </span>
        </p>

        <p className="flex justify-between">
          <span className="text-slate-600">Адрес:</span>
          <span className="font-medium text-right max-w-[60%] whitespace-pre-wrap">
            {address}
          </span>
        </p>

        {apartmentOffice && (
          <p className="flex justify-between">
            <span className="text-slate-600">Квартира/офис:</span>
            <span className="font-medium text-right max-w-[60%] whitespace-pre-wrap">
              {apartmentOffice}
            </span>
          </p>
        )}

        {floor && (
          <p className="flex justify-between">
            <span className="text-slate-600">Этаж:</span>
            <span className="font-medium text-right max-w-[60%] whitespace-pre-wrap">
              {floor}
            </span>
          </p>
        )}

        {email && (
          <p className="flex justify-between">
            <span className="text-slate-600">Email:</span>
            <span className="font-medium text-right max-w-[60%] break-all">
              {email}
            </span>
          </p>
        )}

        <p className="flex justify-between">
          <span className="text-slate-600">Салфетки и приборы:</span>
          <span className="font-medium text-right">
            {(order.needs_cutlery_and_napkins ?? order.needs_cutlery ?? order.needs_napkins) ? "Да" : "Нет"}
          </span>
        </p>

      </div>

    </div>
  )
}