import React from "react";
import { FaCheckCircle, FaUser, FaMapMarkerAlt, FaPhone, FaNotesMedical } from "react-icons/fa";

import type { CheckoutFormData } from "@/types";

interface ConfirmOrderModalProps {
  open: boolean;

  formData: CheckoutFormData;

  orderType: "delivery" | "pickup";

  totalAmount: number;

  errorMessage?: string;

  isSubmitting: boolean;

  onConfirm: () => void;

  onCancel: () => void;
}

export const ConfirmOrderModal: React.FC<ConfirmOrderModalProps> = ({
  open,
  formData,
  orderType,
  totalAmount,
  errorMessage,
  isSubmitting,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="border-b border-slate-200 p-4">
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
        <div className="p-6">

          {errorMessage && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              {errorMessage}
            </div>
          )}

          <p className="text-slate-600 mb-6">
            Пожалуйста проверьте данные заказа:
          </p>

          <div className="space-y-4 mb-6">

            {/* Name */}
            <div className="flex items-start gap-3">
              <FaUser className="text-slate-400 mt-1" size={14} />

              <div>
                <div className="text-sm text-slate-500">
                  Имя
                </div>

                <div className="font-medium text-slate-800">
                  {formData.first_name}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-slate-400 mt-1" size={14} />

              <div>
                <div className="text-sm text-slate-500">
                  Адрес ({orderType === "pickup" ? "Самовывоз" : "Доставка"})
                </div>

                <div className="font-medium text-slate-800">
                  {formData.address}
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <FaPhone className="text-slate-400 mt-1" size={14} />

              <div>
                <div className="text-sm text-slate-500">
                  Телефон
                </div>

                <div className="font-medium text-slate-800">
                  {formData.phone}
                </div>
              </div>
            </div>

            {/* Note */}
            {formData.customer_note && (
              <div className="flex items-start gap-3">
                <FaNotesMedical className="text-slate-400 mt-1" size={14} />

                <div>
                  <div className="text-sm text-slate-500">
                    Примечание
                  </div>

                  <div className="font-medium text-slate-800">
                    {formData.customer_note}
                  </div>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">

              <span className="text-lg font-bold text-slate-800">
                Итого:
              </span>

              <span className="text-2xl font-black text-orange-600">
                {totalAmount.toFixed(0)} сом
              </span>

            </div>

          </div>

          {/* Buttons */}
          <div className="flex gap-3">

            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-200 transition"
            >
              Отменить
            </button>

            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Создание...
                </>
              ) : (
                "Подтвердить"
              )}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};