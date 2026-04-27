import React from "react"

import {
  CheckoutContent,
  CheckoutPanelHeader,
  ConfirmOrderModal,
} from "@/components/Checkout/components"

import type { CheckoutProps } from "@/components/Checkout/checkout.types"
import { useCheckoutModalProps } from "@/components/Checkout/hooks/useCheckoutModalProps"
import { useCheckout } from "@/components/Checkout/hooks/useCheckout"

export const Checkout: React.FC<CheckoutProps> = ({
  onClose,
  cartData,
}) => {
  /* ===============================
     HOOK
  =============================== */

  const checkout = useCheckout({ onClose })
    const confirmModalProps = useCheckoutModalProps(checkout)

  /* ===============================
     RENDER
  =============================== */

  return (
    <>
      <ConfirmOrderModal {...confirmModalProps} />

      <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] sm:p-4">
        <div className="mx-auto flex h-dvh w-full max-w-6xl flex-col overflow-hidden bg-white sm:h-[92vh] sm:rounded-2xl sm:shadow-2xl">

          <CheckoutPanelHeader
            totalItems={cartData.totalItems}
            hasItems={cartData.items.length > 0}
            onClear={cartData.onClear}
            onClose={onClose}
          />

          <CheckoutContent
            cartData={cartData}
            checkout={checkout}
            onClose={onClose}
          />
        </div>
      </div>
    </>
  )
}