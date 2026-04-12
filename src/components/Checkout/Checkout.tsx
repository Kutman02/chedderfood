import React from "react"
import { useSearchParams } from "react-router-dom"

import { CartStep } from "@/components/Checkout/steps/CartStep"
import { CheckoutStep } from "@/components/Checkout/steps/CheckoutStep"
import { ConfirmOrderModal } from "@/components/Checkout/components"

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

  const [searchParams, setSearchParams] = useSearchParams()

  /* ===============================
     STEP (safe)
  =============================== */

  const stepParam = searchParams.get("step")
  const step = stepParam === "checkout" ? "checkout" : "cart"

  /* ===============================
     NAVIGATION
  =============================== */

  const goToCheckout = () => {
    const params = new URLSearchParams(searchParams)
    params.set("modal", "cart")
    params.set("step", "checkout")
    setSearchParams(params)
  }

  const goToCart = () => {
    const params = new URLSearchParams(searchParams)
    params.set("modal", "cart")
    params.set("step", "cart")
    setSearchParams(params)
  }

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
        orderType={checkout.orderType}
        totalAmount={checkout.totalAmount}
        errorMessage={checkout.errorMessage}
        isSubmitting={checkout.isSubmitting}
        onConfirm={checkout.handleConfirmOrder}
        onCancel={checkout.handleCancelConfirm}
      />

      <div className="fixed inset-0 z-50 bg-white flex flex-col h-dvh">

        {/* ===============================
            CART STEP
        =============================== */}
        {step === "cart" && (
          <CartStep
            items={cartData.items}
            totalAmount={cartData.totalAmount}
            totalItems={cartData.totalItems}

            onAdd={cartData.onAdd}
            onRemove={cartData.onRemove}
            onClear={cartData.onClear}
            onClose={onClose}

            onNext={goToCheckout}

            siteUrl={cartData.siteUrl}
          />
        )}

        {/* ===============================
            CHECKOUT STEP
        =============================== */}
        {step === "checkout" && (
          <CheckoutStep
            onClose={onClose}
            onBack={goToCart}

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
            onAutoFill={() => {}}

            totalAmount={checkout.totalAmount}
            cartItemsCount={cartData.items.length}
            isSubmitting={checkout.isSubmitting}
            checkoutAllowed={checkout.checkoutAllowed}
            checkoutBlockMessage={checkout.checkoutBlockMessage}
            isRestaurantHoursLoading={checkout.isRestaurantHoursLoading}
            onSubmit={checkout.handleSubmit}
          />
        )}

      </div>
    </>
  )
}