import { FaMapMarkerAlt, FaNotesMedical, FaPhone, FaUser } from "react-icons/fa"
import type { CheckoutFormData } from "@/types"

type ConfirmOrderDetailsProps = {
  formData: CheckoutFormData
  orderType: "delivery" | "pickup"
  addressLabel: string
  addressValue: string
  phoneValue: string
}

export const ConfirmOrderDetails = ({
  formData,
  orderType,
  addressLabel,
  addressValue,
  phoneValue,
}: ConfirmOrderDetailsProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-start gap-3">
        <FaUser className="text-slate-400 mt-1" size={14} />

        <div>
          <div className="text-sm text-slate-500">Имя</div>
          <div className="font-medium text-slate-800">{formData.first_name}</div>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <FaMapMarkerAlt className="text-slate-400 mt-1" size={14} />

        <div>
          <div className="text-sm text-slate-500">{addressLabel}</div>
          <div className="font-medium text-slate-800">{addressValue}</div>
        </div>
      </div>

      {orderType === "delivery" && formData.apartment_office && (
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt className="text-slate-400 mt-1" size={14} />

          <div>
            <div className="text-sm text-slate-500">Квартира/офис</div>
            <div className="font-medium text-slate-800">{formData.apartment_office}</div>
          </div>
        </div>
      )}

      {orderType === "delivery" && formData.floor && (
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt className="text-slate-400 mt-1" size={14} />

          <div>
            <div className="text-sm text-slate-500">Этаж</div>
            <div className="font-medium text-slate-800">{formData.floor}</div>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <FaPhone className="text-slate-400 mt-1" size={14} />

        <div>
          <div className="text-sm text-slate-500">Телефон</div>
          <div className="font-medium text-slate-800">{phoneValue}</div>
        </div>
      </div>

      {formData.customer_note && (
        <div className="flex items-start gap-3">
          <FaNotesMedical className="text-slate-400 mt-1" size={14} />

          <div>
            <div className="text-sm text-slate-500">Комментарий к заказу</div>
            <div className="font-medium text-slate-800">{formData.customer_note}</div>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <FaNotesMedical className="text-slate-400 mt-1" size={14} />

        <div>
          <div className="text-sm text-slate-500">Дополнительно</div>
          <div className="font-medium text-slate-800">
            Салфетки и приборы: {formData.needs_cutlery_and_napkins ? "Да" : "Нет"}
          </div>
        </div>
      </div>
    </div>
  )
}
