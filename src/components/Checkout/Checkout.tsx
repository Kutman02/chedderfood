import React from "react";
import { useSearchParams } from "react-router-dom";

import { CartStep } from "@/components/Checkout/steps/CartStep";
import { CheckoutStep } from "@/components/Checkout/steps/CheckoutStep";

import { ConfirmOrderModal } from "@/components/Checkout/components";

import type { PublicOrder, Product, CartItem } from "@/types";
import { useCheckout } from "@/components/Checkout/hooks/useCheckout";

/* ===============================
   cartData тип
=============================== */

interface CartData {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;

  onAdd: (product: Product) => void;
  onRemove: (id: number) => void;
  onClear: () => void;

  siteUrl: string;
}

/* ===============================
   PROPS
=============================== */

interface CheckoutProps {
  onClose: () => void;
  onShowReceipt?: (orderData: PublicOrder) => void;

  cartData: CartData;
}

export const Checkout: React.FC<CheckoutProps> = ({
  onClose,
  cartData,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const step = searchParams.get("step") || "cart";

  /* ===============================
     NAVIGATION
  =============================== */

  const goToCheckout = () => {
    const params = new URLSearchParams(searchParams);
    params.set("modal", "cart");
    params.set("step", "checkout");
    setSearchParams(params);
  };

  const goToCart = () => {
    const params = new URLSearchParams(searchParams);
    params.set("modal", "cart");
    params.set("step", "cart");
    setSearchParams(params);
  };

  /* ===============================
     CHECKOUT HOOK
  =============================== */

  const checkout = useCheckout({
    onClose,
  });

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

      <div className="fixed inset-0 z-50 bg-white flex flex-col h-100dvh">

        {/* ===============================
            STEP: CART
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
            STEP: CHECKOUT
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

            totalAmount={checkout.totalAmount}
            cartItemsCount={cartData.items.length}
            isSubmitting={checkout.isSubmitting}
            onSubmit={checkout.handleSubmit}

            onAutoFill={checkout.handleAutoFill}
          />
        )}

      </div>
    </>
  );
};