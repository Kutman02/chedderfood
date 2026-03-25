import React from "react";

import {
  CheckoutHeader,
  CheckoutForm,
  CheckoutFooter,
} from "@/components/Checkout/components";

interface CheckoutStepProps {
  onClose: () => void;
  onBack: () => void;

  // form
  formData: any;
  errors: any;
  orderType: "delivery" | "pickup";

  // phone
  selectedCountry: any;
  phoneNumber: string;
  isCountryDropdownOpen: boolean;

  // handlers
  onInputChange: any;
  onPhoneChange: any;
  onCountrySelect: any;
  onToggleCountryDropdown: () => void;
  onOrderTypeChange: (type: "delivery" | "pickup") => void;

  // submit
  totalAmount: number;
  cartItemsCount: number;
  isSubmitting: boolean;
  onSubmit: () => void;

  onAutoFill: () => void;
}

export const CheckoutStep: React.FC<CheckoutStepProps> = ({
  onClose,
  onBack,

  formData,
  errors,
  orderType,

  selectedCountry,
  phoneNumber,
  isCountryDropdownOpen,

  onInputChange,
  onPhoneChange,
  onCountrySelect,
  onToggleCountryDropdown,
  onOrderTypeChange,

  totalAmount,
  cartItemsCount,
  isSubmitting,
  onSubmit,

  onAutoFill,
}) => {
  return (
    <>
      <CheckoutHeader
        onClose={onClose}
        onBack={onBack}
        onAutoFill={onAutoFill}
      />

      <CheckoutForm
        formData={formData}
        errors={errors}
        orderType={orderType}
        selectedCountry={selectedCountry}
        phoneNumber={phoneNumber}
        isCountryDropdownOpen={isCountryDropdownOpen}
        onInputChange={onInputChange}
        onPhoneChange={onPhoneChange}
        onCountrySelect={onCountrySelect}
        onToggleCountryDropdown={onToggleCountryDropdown}
        onOrderTypeChange={onOrderTypeChange}
      />

      <CheckoutFooter
        totalAmount={totalAmount}
        cartItemsCount={cartItemsCount}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
      />
    </>
  );
};