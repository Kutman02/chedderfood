import React from "react";
import { FaUser, FaMapMarkerAlt, FaNotesMedical } from "react-icons/fa";
import { PhoneInput } from "./PhoneInput";
import { OrderTypeSelector } from "./OrderTypeSelector";

import type { Country } from "../constants/countries";
import type { CheckoutFormData, ShippingRate } from "@/types";

interface CheckoutFormProps {
  formData: CheckoutFormData;
  errors: Partial<CheckoutFormData>;
  onAutoFill: () => void;
  embedded?: boolean;

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
  pickupAddress: string;
  pickupMapUrl: string;
  shippingMethods: ShippingRate[];
  selectedShippingRateId: string;
  shippingError: string;
  isShippingMethodsLoading: boolean;
  onShippingMethodSelect: (rateId: string) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  formData,
  errors,
  onAutoFill, // ✅ FIX
  embedded = false,

  orderType,

  selectedCountry,
  phoneNumber,
  isCountryDropdownOpen,

  onInputChange,
  onPhoneChange,
  onCountrySelect,
  onToggleCountryDropdown,

  onOrderTypeChange,
  pickupAddress,
  pickupMapUrl,
  shippingMethods,
  selectedShippingRateId,
  shippingError,
  isShippingMethodsLoading,
  onShippingMethodSelect,
}) => {
  const formatShippingPrice = (method: ShippingRate) => {
    const amount = Number(method.total ?? method.cost ?? 0);

    if (!Number.isFinite(amount) || amount <= 0 || method.is_free) {
      return "Бесплатно";
    }

    return `${amount.toFixed(0)} сом`;
  };

  return (
    <div
      className={
        embedded
          ? ""
          : "flex-1 overflow-y-auto px-4 py-4 md:p-6 pb-32 md:pb-6"
      }
    >
      <div className="max-w-2xl mx-auto">
        <form className="space-y-6">
          {/* Тип заказа */}
          <OrderTypeSelector
            value={orderType}
            onChange={onOrderTypeChange}
          />

          {/* Fill previous customer data */}
          <button
            type="button" // ✅ FIX (очень важно)
            onClick={onAutoFill}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-orange-100 text-orange-700 rounded-lg font-medium hover:bg-orange-200 transition-colors text-xs md:text-sm active:scale-95"
          >
            Заполнить предыдущие данные
          </button>

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
                Адрес доставки, улица, дом, квартира *
              </label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={onInputChange}
                placeholder="Например: ул. Ленина, д. 10, кв. 5"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.address ? "border-red-500" : "border-slate-300"
                }`}
              />

              {errors.address && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.address}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Подъезд, квартира или офис
                  </label>

                  <input
                    type="text"
                    name="apartment_office"
                    value={formData.apartment_office}
                    onChange={onInputChange}
                    placeholder="Например: Подъезд 2, кв. 5 или Офис 301"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Этаж
                  </label>

                  <input
                    type="text"
                    name="floor"
                    value={formData.floor}
                    onChange={onInputChange}
                    placeholder="Например: 3 этаж"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="font-bold text-green-700 mb-1">
                Самовывоз
              </p>

              <p className="text-sm text-green-700">
                Адрес ресторана (самовывоз):
              </p>

              <p className="font-bold text-lg text-green-800">
                {pickupAddress || "—"}
              </p>

              {pickupMapUrl && (
                <a
                  href={pickupMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm font-semibold text-green-700 underline hover:text-green-900"
                >
                  Открыть в 2ГИС
                </a>
              )}
            </div>
          )}

          {orderType === "delivery" && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-700 mb-3">
                Способ доставки *
              </p>

              {isShippingMethodsLoading ? (
                <p className="text-sm text-slate-500">
                  Загружаем доступные способы доставки...
                </p>
              ) : shippingMethods.length > 0 ? (
                <div className="space-y-2">
                  {shippingMethods.map((method) => (
                    <label
                      key={method.rate_id}
                      className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
                        selectedShippingRateId === method.rate_id
                          ? "border-orange-500 bg-orange-50"
                          : "border-slate-200 bg-white hover:border-orange-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="radio"
                          name="shipping_rate"
                          checked={selectedShippingRateId === method.rate_id}
                          onChange={() => onShippingMethodSelect(method.rate_id)}
                        />

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {method.label}
                          </p>

                          <p className="text-xs text-slate-500 truncate">
                            {method.method_id}:{method.instance_id}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 text-sm font-bold ${
                          method.is_free || Number(method.total) <= 0
                            ? "text-emerald-600"
                            : "text-slate-900"
                        }`}
                      >
                        {formatShippingPrice(method)}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-red-600">
                  {shippingError || "Нет доступных способов доставки."}
                </p>
              )}

              {!isShippingMethodsLoading && shippingError && shippingMethods.length > 0 && (
                <p className="mt-3 text-xs text-amber-700">
                  {shippingError}
                </p>
              )}
            </div>
          )}

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
              placeholder="Например: Пожалуйста, позвоните за 10 минут до доставки"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <input
                type="checkbox"
                name="needs_cutlery_and_napkins"
                checked={formData.needs_cutlery_and_napkins}
                onChange={onInputChange}
              />
              Салфетки и приборы
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};