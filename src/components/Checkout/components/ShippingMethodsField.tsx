import type { ShippingRate } from "@/types"
import { formatShippingPrice } from "../hooks/checkout.utils"

type ShippingMethodsFieldProps = {
  shippingMethods: ShippingRate[]
  selectedShippingRateId: string
  shippingError: string
  isShippingMethodsLoading: boolean
  onShippingMethodSelect: (rateId: string) => void
}

export const ShippingMethodsField = ({
  shippingMethods,
  selectedShippingRateId,
  shippingError,
  isShippingMethodsLoading,
  onShippingMethodSelect,
}: ShippingMethodsFieldProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-bold text-slate-700 mb-3">
        Способ доставки *
      </p>

      {isShippingMethodsLoading ? (
        <p className="text-sm text-slate-500">
          Загружаем доступные способы доставки...
        </p>
      ) : shippingMethods.length > 0 ? (
        <div className="space-y-2">
          {shippingMethods.map((method) => (
            <label
              key={method.rate_id}
              className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
                selectedShippingRateId === method.rate_id
                  ? "border-orange-500 bg-orange-50"
                  : "border-slate-200 bg-white hover:border-orange-200"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="radio"
                  name="shipping_rate"
                  checked={selectedShippingRateId === method.rate_id}
                  onChange={() => onShippingMethodSelect(method.rate_id)}
                />

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {method.label}
                  </p>
                </div>
              </div>

              <span
                className={`shrink-0 text-sm font-bold ${
                  method.is_free || Number(method.total) <= 0
                    ? "text-emerald-600"
                    : "text-slate-900"
                }`}
              >
                {formatShippingPrice(method)}
              </span>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-sm text-red-600">
          {shippingError || "Нет доступных способов доставки."}
        </p>
      )}

      {!isShippingMethodsLoading && shippingError && shippingMethods.length > 0 && (
        <p className="mt-3 text-xs text-amber-700">
          {shippingError}
        </p>
      )}
    </div>
  )
}
