import React from "react"
import { FaShoppingBag, FaTimes, FaTrash } from "react-icons/fa"

import { CartEmpty, CartItemCard } from "@/components/Cart/components"
import {
  CheckoutForm,
  CheckoutFooter,
  ConfirmOrderModal,
} from "@/components/Checkout/components"

import { useCheckout } from "@/components/Checkout/hooks/useCheckout"

import type { CartItem } from "@/types/ui/cart.types"

/* ===============================
   TYPES
=============================== */

interface CartData {
  items: CartItem[]
  totalAmount: number
  totalItems: number

  onAdd: (product: any) => void
  onRemove: (id: number) => void
  onClear: () => void

  siteUrl: string
}

interface CheckoutProps {
  onClose: () => void
  cartData: CartData
}

export const Checkout: React.FC<CheckoutProps> = ({
  onClose,
  cartData,
}) => {
  /* ===============================
     HOOK
  =============================== */

  const checkout = useCheckout({ onClose })

  /* ===============================
     RENDER
  =============================== */

  return (
    <>
      <ConfirmOrderModal
        open={checkout.showConfirmModal}
        formData={checkout.formData}
        phone={checkout.fullPhone}
        orderType={checkout.orderType}
        pickupAddress={checkout.pickupAddress}
        shippingLabel={
          checkout.orderType === "pickup"
            ? "Самовывоз"
            : checkout.selectedShippingRate?.label || "Способ доставки не выбран"
        }
        subtotal={checkout.totalAmount}
        shippingCost={checkout.shippingCost}
        totalAmount={checkout.totalWithShipping}
        errorMessage={checkout.errorMessage}
        isSubmitting={checkout.isSubmitting}
        onConfirm={checkout.handleConfirmOrder}
        onCancel={checkout.handleCancelConfirm}
      />

      <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] sm:p-4">
        <div className="mx-auto flex h-dvh w-full max-w-6xl flex-col overflow-hidden bg-white sm:h-[92vh] sm:rounded-2xl sm:shadow-2xl">

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
                    {cartData.totalItems > 0
                      ? `${cartData.totalItems} товаров в заказе`
                      : "Добавьте товары для оформления"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cartData.items.length > 0 && (
                  <button
                    onClick={cartData.onClear}
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

          {cartData.items.length === 0 ? (
            <CartEmpty onClose={onClose} />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-4 pb-28 md:px-6 md:py-6 md:pb-32">
                  <section>
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-slate-500 md:mb-4">
                      Выбранные товары
                    </h3>

                    <div className="space-y-3 md:space-y-4">
                      {cartData.items.map((item) => (
                        <CartItemCard
                          key={item.id}
                          item={item}
                          onAdd={() => cartData.onAdd(item)}
                          onRemove={() => cartData.onRemove(item.id)}
                          siteUrl={cartData.siteUrl}
                        />
                      ))}
                    </div>
                  </section>

                  <section className="border-t border-slate-200 pt-6 md:pt-8">
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-slate-500 md:mb-4">
                      Данные для оформления
                    </h3>

                    <CheckoutForm
                      formData={checkout.formData}
                      errors={checkout.errors}
                      orderType={checkout.orderType}
                      selectedCountry={checkout.selectedCountry}
                      phoneNumber={checkout.phoneNumber}
                      isCountryDropdownOpen={checkout.isCountryDropdownOpen}
                      onInputChange={checkout.handleInputChange}
                      onPhoneChange={checkout.handlePhoneNumberChange}
                      onCountrySelect={checkout.handleCountrySelect}
                      onToggleCountryDropdown={checkout.toggleCountryDropdown}
                      onOrderTypeChange={checkout.setOrderType}
                      pickupAddress={checkout.pickupAddress}
                      pickupMapUrl={checkout.pickupMapUrl}
                      shippingMethods={checkout.shippingMethods}
                      selectedShippingRateId={checkout.selectedShippingRateId}
                      shippingError={checkout.shippingError}
                      isShippingMethodsLoading={checkout.isShippingMethodsLoading}
                      onShippingMethodSelect={checkout.handleShippingMethodSelect}
                      onAutoFill={checkout.handleAutoFill}
                      embedded
                    />
                  </section>
                </div>
              </div>

              <CheckoutFooter
                orderType={checkout.orderType}
                subtotal={checkout.totalAmount}
                shippingCost={checkout.shippingCost}
                totalAmount={checkout.totalWithShipping}
                cartItemsCount={cartData.items.length}
                isSubmitting={checkout.isSubmitting}
                checkoutAllowed={checkout.checkoutAllowed}
                checkoutBlockMessage={checkout.checkoutBlockMessage}
                isRestaurantHoursLoading={checkout.isRestaurantHoursLoading}
                onSubmit={checkout.handleSubmit}
              />
            </>
          )}
        </div>
      </div>
    </>
  )
}