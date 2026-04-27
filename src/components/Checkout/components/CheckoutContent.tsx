import { CartEmpty, CartItemCard } from "@/components/Cart/components"
import { CheckoutFooter } from "./CheckoutFooter"
import { CheckoutForm } from "./CheckoutForm"

import type { CartData } from "../checkout.types"
import type { useCheckout } from "../hooks/useCheckout"

type CheckoutContentProps = {
  cartData: CartData
  checkout: ReturnType<typeof useCheckout>
  onClose: () => void
}

export const CheckoutContent = ({
  cartData,
  checkout,
  onClose,
}: CheckoutContentProps) => {
  if (cartData.items.length === 0) {
    return <CartEmpty onClose={onClose} />
  }

  return (
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
  )
}
