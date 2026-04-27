type ConfirmOrderTotalsProps = {
  shippingRowLabel: string
  subtotalLabel: string
  shippingLabelValue: string
  shippingIsFree: boolean
  totalLabel: string
}

export const ConfirmOrderTotals = ({
  shippingRowLabel,
  subtotalLabel,
  shippingLabelValue,
  shippingIsFree,
  totalLabel,
}: ConfirmOrderTotalsProps) => {
  return (
    <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-600">Товары:</span>

          <span className="text-sm font-bold text-slate-900">{subtotalLabel}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-600">{shippingRowLabel}:</span>

          <span className={shippingIsFree ? "text-sm font-bold text-emerald-600" : "text-sm font-bold text-slate-900"}>
            {shippingLabelValue}
          </span>
        </div>

        <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
          <span className="text-lg font-bold text-slate-800">Итого:</span>

          <span className="text-2xl font-black text-orange-600">{totalLabel}</span>
        </div>
      </div>
    </div>
  )
}
