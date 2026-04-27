import React from "react";
import { FaCheckCircle } from "react-icons/fa";

import type { CheckoutFormData } from "@/types";
import { useConfirmOrderModalView } from "../hooks/useConfirmOrderModalView";
import { ConfirmOrderDetails } from "./ConfirmOrderDetails";
import { ConfirmOrderTotals } from "./ConfirmOrderTotals";
import { ConfirmOrderActions } from "./ConfirmOrderActions";

interface ConfirmOrderModalProps {
  open: boolean;

  formData: CheckoutFormData;
  phone: string;

  orderType: "delivery" | "pickup";
  pickupAddress: string;

  shippingLabel: string;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;

  errorMessage?: string;

  isSubmitting: boolean;

  onConfirm: () => void;

  onCancel: () => void;
}

export const ConfirmOrderModal: React.FC<ConfirmOrderModalProps> = ({
  open,
  formData,
  phone,
  orderType,
  pickupAddress,
  shippingLabel,
  subtotal,
  shippingCost,
  totalAmount,
  errorMessage,
  isSubmitting,
  onConfirm,
  onCancel,
}) => {
  const {
    addressLabel,
    addressValue,
    phoneValue,
    shippingRowLabel,
    subtotalLabel,
    shippingLabelValue,
    shippingIsFree,
    totalLabel,
  } = useConfirmOrderModalView({
    formData,
    phone,
    orderType,
    pickupAddress,
    shippingLabel,
    subtotal,
    shippingCost,
    totalAmount,
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[calc(100dvh-2rem)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="border-b border-slate-200 p-4 shrink-0">
          <div className="flex items-center gap-3">

            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-orange-600" size={20} />
            </div>

            <h3 className="text-xl font-bold text-slate-800">
              Подтверждение заказа
            </h3>

          </div>
        </div>

        {/* Body */}
        <div className="p-6 min-h-0 flex-1 overflow-y-auto">

          {errorMessage && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              {errorMessage}
            </div>
          )}

          <p className="text-slate-600 mb-6">
            Пожалуйста проверьте данные заказа:
          </p>

          <ConfirmOrderDetails
            formData={formData}
            orderType={orderType}
            addressLabel={addressLabel}
            addressValue={addressValue}
            phoneValue={phoneValue}
          />

          <ConfirmOrderTotals
            shippingRowLabel={shippingRowLabel}
            subtotalLabel={subtotalLabel}
            shippingLabelValue={shippingLabelValue}
            shippingIsFree={shippingIsFree}
            totalLabel={totalLabel}
          />

        </div>

        <ConfirmOrderActions
          isSubmitting={isSubmitting}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />

      </div>

    </div>
  );
};