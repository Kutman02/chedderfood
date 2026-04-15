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

    <section className="rounded-2xl bg-white p-0 md:border md:border-slate-200 md:p-5 md:shadow-sm">

      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        Кто заказал
      </p>

      <h3 className="mt-1 mb-4 text-lg font-black text-slate-900">
        Данные клиента
      </h3>

      <div className="space-y-3">

        {/* Имя */}
        <div className="flex items-center gap-2 text-slate-900 font-semibold">

          <FaUser className="text-slate-400 shrink-0" />

          <span className="text-base font-semibold whitespace-pre-wrap">
            {name}
          </span>

        </div>

        {fullName && fullName !== name && (
          <div className="flex justify-between gap-3 text-sm text-slate-600">
            <span>Полное имя</span>
            <span className="max-w-[60%] text-right font-medium text-slate-900 whitespace-pre-wrap">
              {fullName}
            </span>
          </div>
        )}

        {/* Телефон */}
        {phone ? (

          <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5 md:border md:border-slate-200 md:bg-white">

            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-orange-600 font-bold break-all"
            >
              <FaPhone className="shrink-0" />
              {phone}
            </a>

            <button
              onClick={handleCopyPhone}
              className="flex shrink-0 items-center gap-1 rounded-lg bg-white px-2 py-1 text-xs font-semibold transition hover:bg-slate-100 md:bg-slate-200 md:hover:bg-slate-300"
            >
              <FaCopy />
              Копировать
            </button>

          </div>

        ) : (

          <div className="text-sm text-slate-400">
            Телефон не указан
          </div>

        )}

        {email && (
          <div className="flex justify-between gap-2 text-sm text-slate-600">
            <span>Email</span>
            <span className="text-right font-medium text-slate-900 max-w-[60%] break-all">
              {email}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${order.needs_cutlery ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
            Приборы: {order.needs_cutlery ? "нужны" : "не нужны"}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${order.needs_napkins ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
            Салфетки: {order.needs_napkins ? "нужны" : "не нужны"}
          </span>
        </div>

        {order.reason?.trim() && (
          <div className="rounded-xl bg-amber-50 px-3 py-3 text-sm text-slate-700 md:border md:border-amber-200">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-amber-700">Причина изменения статуса</p>
            <p className="font-medium text-slate-900 whitespace-pre-wrap">
              {order.reason}
            </p>
          </div>
        )}

      </div>

    </section>

  )
}