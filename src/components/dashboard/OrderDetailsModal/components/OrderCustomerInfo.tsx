import { FaUser, FaPhone, FaCopy } from "react-icons/fa"
import type { Order } from "@/types"

interface Props {
  order: Order
}

export const OrderCustomerInfo = ({ order }: Props) => {

  /* ===============================
     SAFE DATA
  =============================== */

  const name =
    order.customer_name?.trim() || "Без имени"

  const phone =
    order.phone?.trim() || ""

  const email =
    order.email?.trim() || ""

  const fullName =
    [order.first_name, order.last_name]
      .filter(Boolean)
      .join(" ")
      .trim()

  /* ===============================
     ACTIONS
  =============================== */

  const handleCopyPhone = async () => {
    if (!phone) return

    try {
      await navigator.clipboard.writeText(phone)
    } catch (err) {
      console.error("Copy failed:", err)
    }
  }

  /* ===============================
     RENDER
  =============================== */

  return (

    <div className="bg-white rounded-xl border border-slate-200 p-4">

      <h3 className="text-sm font-bold text-slate-500 mb-3">
        Клиент
      </h3>

      <div className="space-y-3">

        {/* Имя */}
        <div className="flex items-center gap-2 text-slate-900 font-semibold">

          <FaUser className="text-slate-400 shrink-0" />

          <span className="text-base font-medium text-right max-w-[60%] whitespace-pre-wrap">
            {name}
          </span>

        </div>

        {fullName && fullName !== name && (
          <div className="text-sm text-slate-600 flex justify-between gap-2">
            <span>Полное имя</span>
            <span className="text-right font-medium text-slate-900 max-w-[60%] whitespace-pre-wrap">
              {fullName}
            </span>
          </div>
        )}

        {/* Телефон */}
        {phone ? (

          <div className="flex items-center justify-between gap-2 bg-slate-50 border rounded-lg px-3 py-2">

            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-orange-600 font-bold break-all"
            >
              <FaPhone className="shrink-0" />
              {phone}
            </a>

            <button
              onClick={handleCopyPhone}
              className="flex items-center gap-1 text-xs bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded shrink-0"
            >
              <FaCopy />
              копировать
            </button>

          </div>

        ) : (

          <div className="text-sm text-slate-400">
            Телефон не указан
          </div>

        )}

        {email && (
          <div className="text-sm text-slate-600 flex justify-between gap-2">
            <span>Email</span>
            <span className="text-right font-medium text-slate-900 max-w-[60%] break-all">
              {email}
            </span>
          </div>
        )}

        <div className="text-sm text-slate-600 flex justify-between gap-2">
          <span>Приборы</span>
          <span className="text-right font-medium text-slate-900">
            {order.needs_cutlery ? "Да" : "Нет"}
          </span>
        </div>

        <div className="text-sm text-slate-600 flex justify-between gap-2">
          <span>Салфетки</span>
          <span className="text-right font-medium text-slate-900">
            {order.needs_napkins ? "Да" : "Нет"}
          </span>
        </div>

        {order.reason?.trim() && (
          <div className="text-sm text-slate-600">
            <p className="mb-1">Причина последнего изменения статуса</p>
            <p className="font-medium text-slate-900 whitespace-pre-wrap">
              {order.reason}
            </p>
          </div>
        )}

      </div>

    </div>

  )
}