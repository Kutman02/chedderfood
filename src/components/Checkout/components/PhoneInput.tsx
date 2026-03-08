import React from "react";
import { FaPhone, FaChevronDown } from "react-icons/fa";

import { CIS_COUNTRIES } from "../constants/countries";

interface PhoneInputProps {
  selectedCountry: {
    code: string;
    name: string;
    digits: number;
    flag: string;
  };

  phoneNumber: string;

  error?: string;

  isOpen: boolean;

  onToggle: () => void;

  onSelectCountry: (country: {
    code: string;
    name: string;
    digits: number;
    flag: string;
  }) => void;

  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  selectedCountry,
  phoneNumber,
  error,
  isOpen,
  onToggle,
  onSelectCountry,
  onChange,
}) => {
  return (
    <div>
      {/* label */}
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
        <FaPhone size={14} />
        Телефон *
      </label>

      <div className="flex gap-2">

        {/* Country selector */}
        <div className="relative">

          <button
            type="button"
            onClick={onToggle}
            className={`flex items-center gap-2 px-4 py-3 border rounded-lg bg-white ${
              error ? "border-red-500" : "border-slate-300"
            }`}
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="font-medium">{selectedCountry.code}</span>
            <FaChevronDown size={10} className="text-slate-400" />
          </button>

          {isOpen && (
            <>
              {/* overlay */}
              <div
                className="fixed inset-0 z-40"
                onClick={onToggle}
              />

              {/* dropdown */}
              <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto min-w-200px">

                {CIS_COUNTRIES.map((country) => (
                  <button
                    key={`${country.code}-${country.name}`}
                    type="button"
                    onClick={() => onSelectCountry(country)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 transition-colors ${
                      selectedCountry.code === country.code &&
                      selectedCountry.name === country.name
                        ? "bg-orange-100 font-semibold"
                        : ""
                    }`}
                  >
                    <span className="text-lg">{country.flag}</span>

                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-800">
                        {country.name}
                      </div>

                      <div className="text-xs text-slate-500">
                        {country.code}
                      </div>
                    </div>
                  </button>
                ))}

              </div>
            </>
          )}
        </div>

        {/* phone input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={onChange}
          placeholder={`${selectedCountry.digits} цифр`}
          maxLength={selectedCountry.digits}
          className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
            error ? "border-red-500" : "border-slate-300"
          }`}
        />

      </div>

      {/* error */}
      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}

      {/* preview */}
      {!error && phoneNumber && (
        <p className="text-slate-500 text-sm mt-2">
          {selectedCountry.code}
          {phoneNumber}
        </p>
      )}
    </div>
  );
};