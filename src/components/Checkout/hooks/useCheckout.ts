import { useState, useEffect, useLayoutEffect } from "react";

import { useCreateOrderMutation, useGetProductsQuery } from "../../../app/services/api";
import { useCheckActiveOrdersCountQuery } from "../../../app/services/publicApi";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addReceipt, setCustomerData } from "../../../app/slices/receiptsSlice";

import { useScrollLockStore } from "../../../stores/scrollLockStore";

import { CIS_COUNTRIES } from "../constants/countries";

import type { Product, CheckoutFormData, PublicOrder } from "../../../types";

interface UseCheckoutProps {
  onClose: () => void;
  onSuccess: () => void;
  onShowReceipt?: (order: PublicOrder) => void;
}

export const useCheckout = ({
  onClose,
  onSuccess,
  onShowReceipt,
}: UseCheckoutProps) => {

  const dispatch = useAppDispatch();

  const cart = useAppSelector((s) => s.cart.items);
  const savedCustomerData = useAppSelector((s) => s.receipts.customerData);

  const lockScroll = useScrollLockStore((s) => s.lock);
  const unlockScroll = useScrollLockStore((s) => s.unlock);

  const [createOrder] = useCreateOrderMutation();

  const { data: products } = useGetProductsQuery({
    per_page: 100,
    status: "publish",
  });

  const { data: activeOrdersData } = useCheckActiveOrdersCountQuery(undefined, {
    pollingInterval: 0,
  });

  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [selectedCountry, setSelectedCountry] = useState(CIS_COUNTRIES[0]);

  const [phoneNumber, setPhoneNumber] = useState("");

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    first_name: "",
    address: "",
    phone: "",
    customer_note: "",
  });

  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

  useLayoutEffect(() => {
    lockScroll();
    return () => unlockScroll();
  }, [lockScroll, unlockScroll]);

  useEffect(() => {
    const fullPhone = phoneNumber
      ? `${selectedCountry.code}${phoneNumber}`
      : "";

    setFormData((prev) => ({
      ...prev,
      phone: fullPhone,
    }));
  }, [selectedCountry, phoneNumber]);

  const cartItems = products
    ? products
        .filter((product: Product) => cart[product.id] > 0)
        .map((product: Product) => ({
          product_id: product.id,
          quantity: cart[product.id],
        }))
    : [];

  const totalAmount = products
    ? products
        .filter((product: Product) => cart[product.id] > 0)
        .reduce((sum: number, product: Product) => {
          const price = parseFloat(product.sale_price || product.price || "0");
          return sum + price * cart[product.id];
        }, 0)
    : 0;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePhoneNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "");

    const limited = value.slice(0, selectedCountry.digits);

    setPhoneNumber(limited);

    if (errors.phone) {
      setErrors((prev) => ({
        ...prev,
        phone: "",
      }));
    }
  };

  const handleCountrySelect = (country: typeof CIS_COUNTRIES[0]) => {
    setSelectedCountry(country);
    setIsCountryDropdownOpen(false);
  };

  const toggleCountryDropdown = () => {
    setIsCountryDropdownOpen((prev) => !prev);
  };

  const handleOrderTypeChange = (type: "delivery" | "pickup") => {
    setOrderType(type);
  };

  const validateForm = () => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "Введите имя";
    }

    if (orderType === "delivery" && !formData.address.trim()) {
      newErrors.address = "Введите адрес";
    }

    if (!phoneNumber.trim()) {
      newErrors.phone = "Введите номер телефона";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAutoFill = () => {
    if (!savedCustomerData) return;

    setFormData({
      first_name: savedCustomerData.first_name,
      address: savedCustomerData.address,
      phone: savedCustomerData.phone,
      customer_note: "",
    });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) return;

    if (cartItems.length === 0) return;

    setShowConfirmModal(true);
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);

    try {
      if (activeOrdersData && activeOrdersData.length >= 3) {
        setErrorMessage(
          "У вас уже есть 3 активных заказа. Дождитесь их выполнения."
        );
        return;
      }

      const orderData = {
        status: "on-hold",
        customer_id: 0,
        billing: {
          first_name: formData.first_name,
          address_1: formData.address,
          phone: formData.phone,
        },
        line_items: cartItems,
        total: totalAmount.toString(),
        currency: "KGS",
      };

      const order = await createOrder(orderData).unwrap();

      dispatch(addReceipt(order));

      dispatch(
        setCustomerData({
          first_name: formData.first_name,
          address: formData.address,
          phone: formData.phone,
        })
      );

      if (onShowReceipt) {
        onShowReceipt(order);
      } else {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Ошибка создания заказа");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setErrorMessage("");
  };

  return {
    formData,
    errors,
    orderType,
    selectedCountry,
    phoneNumber,
    isCountryDropdownOpen,

    cartItems,
    totalAmount,

    showConfirmModal,
    isSubmitting,
    errorMessage,

    handleInputChange,
    handlePhoneNumberChange,
    handleCountrySelect,
    toggleCountryDropdown,
    handleOrderTypeChange,

    handleSubmit,
    handleConfirmOrder,
    handleCancelConfirm,
    handleAutoFill,
  };
};