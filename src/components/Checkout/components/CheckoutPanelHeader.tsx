import { FaShoppingBag, FaTimes, FaTrash } from "react-icons/fa"

type CheckoutPanelHeaderProps = {
  totalItems: number
  hasItems: boolean
  onClear: () => void
  onClose: () => void
}

export const CheckoutPanelHeader = ({
  totalItems,
  hasItems,
  onClear,
  onClose,
}: CheckoutPanelHeaderProps) => {
  return (
    <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 md:px-6 md:py-4">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <FaShoppingBag size={18} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-black text-slate-800 md:text-2xl">
              Корзина и оформление
            </h2>

            <p className="text-xs text-slate-500 md:text-sm">
              {totalItems > 0
                ? `${totalItems} товаров в заказе`
                : "Добавьте товары для оформления"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasItems && (
            <button
              onClick={onClear}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600 transition-colors hover:bg-red-100 active:scale-95"
              aria-label="Очистить корзину"
              title="Очистить корзину"
            >
              <FaTrash size={14} />
            </button>
          )}

          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-800 active:scale-95"
            aria-label="Закрыть"
            title="Закрыть"
          >
            <FaTimes size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
