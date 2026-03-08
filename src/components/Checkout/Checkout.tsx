import React from "react";

import { CheckoutHeader } from "./components/CheckoutHeader";
import { CheckoutForm } from "./components/CheckoutForm";
import { CheckoutFooter } from "./components/CheckoutFooter";
import { ConfirmOrderModal } from "./components/ConfirmOrderModal";
import type { PublicOrder } from "../../types";

import { useCheckout } from "./hooks/useCheckout";

interface CheckoutProps {
  onClose: () => void;
  onBack: () => void;
  onSuccess: () => void;
  onShowReceipt?: (orderData: PublicOrder) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({
  onClose,
  onBack,
  onSuccess,
  onShowReceipt,
}) => {
  const checkout = useCheckout({
    onClose,
    onSuccess,
    onShowReceipt,
  });

  return (
    <>
      {/* Модалка подтверждения */}
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

        {/* HEADER */}
        <CheckoutHeader
          onClose={onClose}
          onBack={onBack}
          onAutoFill={checkout.handleAutoFill}
        />

        {/* FORM */}
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
          onOrderTypeChange={checkout.handleOrderTypeChange}
        />

        {/* FOOTER */}
        <CheckoutFooter
          totalAmount={checkout.totalAmount}
          cartItemsCount={checkout.cartItems.length}
          isSubmitting={checkout.isSubmitting}
          onSubmit={checkout.handleSubmit}
        />

      </div>
    </>
  );
};