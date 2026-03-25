import React from "react";
import { FaUser, FaMapMarkerAlt, FaNotesMedical } from "react-icons/fa";
import { RESTAURANT } from "@/config/restaurant";
import { PhoneInput } from "./PhoneInput";
import { OrderTypeSelector } from "./OrderTypeSelector";

import type { Country } from "../constants/countries";
import type { CheckoutFormData } from "@/types";

interface CheckoutFormProps {
  formData: CheckoutFormData;
  errors: Partial<CheckoutFormData>;
  onAutoFill: () => void;

  orderType: "delivery" | "pickup";

  selectedCountry: Country;
  phoneNumber: string;
  isCountryDropdownOpen: boolean;

  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;

  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  onCountrySelect: (country: Country) => void;

  onToggleCountryDropdown: () => void;

  onOrderTypeChange: (type: "delivery" | "pickup") => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  formData,
  errors,
  onAutoFill, // ✅ FIX

  orderType,

  selectedCountry,
  phoneNumber,
  isCountryDropdownOpen,

  onInputChange,
  onPhoneChange,
  onCountrySelect,
  onToggleCountryDropdown,

  onOrderTypeChange,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 md:p-6 pb-32 md:pb-6">
      <div className="max-w-2xl mx-auto">
        <form className="space-y-6">
          {/* Тип заказа */}
          <OrderTypeSelector
            value={orderType}
            onChange={onOrderTypeChange}
          />

          {/* Имя */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <FaUser size={14} />
              Имя *
            </label>

            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={onInputChange}
              placeholder="Введите ваше имя"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.first_name ? "border-red-500" : "border-slate-300"
              }`}
            />

            {errors.first_name && (
              <p className="text-red-500 text-sm mt-2">
                {errors.first_name}
              </p>
            )}
          </div>

          {/* Адрес / Самовывоз */}
          {orderType === "delivery" ? (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <FaMapMarkerAlt size={14} />
                Адрес доставки *
              </label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={onInputChange}
                placeholder="Улица, дом, квартира"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.address ? "border-red-500" : "border-slate-300"
                }`}
              />

              {errors.address && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.address}
                </p>
              )}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="font-bold text-green-700 mb-1">
                Самовывоз
              </p>

              <p className="text-sm text-green-700">
                Заберите заказ по адресу:
              </p>

              <p className="font-bold text-lg text-green-800">
                {RESTAURANT.address}
              </p>

              <a
                href={RESTAURANT.map2gis}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm font-semibold text-green-700 underline hover:text-green-900"
              >
                Открыть в 2ГИС
              </a>
            </div>
          )}

          {/* Autofill button */}
          <button
            type="button" // ✅ FIX (очень важно)
            onClick={onAutoFill}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-orange-100 text-orange-700 rounded-lg font-medium hover:bg-orange-200 transition-colors text-xs md:text-sm active:scale-95"
          >
            Автозаполнение
          </button>

          {/* Телефон */}
          <PhoneInput
            selectedCountry={selectedCountry}
            phoneNumber={phoneNumber}
            error={errors.phone}
            isOpen={isCountryDropdownOpen}
            onToggle={onToggleCountryDropdown}
            onSelectCountry={onCountrySelect}
            onChange={onPhoneChange}
          />

          {/* Примечание */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <FaNotesMedical size={14} />
              Комментарий к заказу
            </label>

            <textarea
              name="customer_note"
              rows={3}
              value={formData.customer_note}
              onChange={onInputChange}
              placeholder="Комментарий к заказу"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>
        </form>
      </div>
    </div>
  );
};