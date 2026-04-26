import { useState, useEffect, useMemo } from "react"

import { useAppSelector } from "@/app/hooks"

import { useCartSummary } from "./useCartSummary"
import { useCheckoutForm } from "./useCheckoutForm"
import { useCreateOrder } from "./useCreateOrder"
import { useGetRestaurantHoursStatusQuery } from "@/api"
import { useCheckoutPhone } from "./useCheckoutPhone"
import { useCheckoutShipping } from "./useCheckoutShipping"
import {
  getShippingCost,
  resolvePickupAddress,
  resolvePickupMapUrl,
  toLocalPhoneNumber,
} from "./checkout.utils"

interface UseCheckoutProps {
  onClose: () => void
}

export const useCheckout = ({ onClose }: UseCheckoutProps) => {

  /* ===============================
     DATA
  =============================== */

  const { cartItems, totalAmount } = useCartSummary()

  const {
    formData,
    errors,
    orderType,
    setOrderType,
    handleInputChange,
    applyFormData,
    validateForm,
  } = useCheckoutForm()

  const customerData = useAppSelector((s) => s.receipts.customerData)

  const { create, isLoading } = useCreateOrder()

  const {
    data: restaurantHoursResponse,
    isFetching: isRestaurantHoursLoading,
  } = useGetRestaurantHoursStatusQuery(undefined, {
    pollingInterval: 30000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  })

  const restaurantHours = restaurantHoursResponse?.data

  const checkoutAllowed = restaurantHours?.checkout_allowed ?? true
  const pickupAddress = useMemo(
    () => resolvePickupAddress(restaurantHours),
    [restaurantHours]
  )
  const pickupMapUrl = useMemo(
    () => resolvePickupMapUrl(restaurantHours),
    [restaurantHours]
  )
  const checkoutBlockMessage = checkoutAllowed
    ? ""
    : restaurantHours?.message || "Сейчас ресторан не принимает заказы"

  /* ===============================
     UI STATE
  =============================== */

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  /* ===============================
     PHONE STATE
  =============================== */

  const {
    selectedCountry,
    phoneNumber,
    fullPhone,
    isCountryDropdownOpen,
    setPhoneNumber,
    handlePhoneNumberChange,
    handleCountrySelect,
    toggleCountryDropdown,
  } = useCheckoutPhone({
    initialPhone: formData.phone,
  })

  const {
    shippingMethods,
    selectedShippingRate,
    selectedShippingRateId,
    shippingError,
    isShippingMethodsLoading,
    handleShippingMethodSelect,
  } = useCheckoutShipping({
    orderType,
    cartItems,
  })

  const shippingCost = getShippingCost(orderType, selectedShippingRate)

  const totalWithShipping = totalAmount + shippingCost

  /* ===============================
     SCROLL LOCK
  =============================== */

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  useEffect(() => {
    if (formData.phone === fullPhone) return

    applyFormData({ phone: fullPhone })
  }, [applyFormData, formData.phone, fullPhone])

  /* ===============================
     PHONE HANDLERS
  =============================== */

  const handleAutoFill = () => {
    if (!customerData) return

    applyFormData({
      first_name: customerData.first_name || formData.first_name,
      address:
        orderType === "delivery"
          ? customerData.address || formData.address
          : formData.address,
      apartment_office:
        customerData.apartment_office ?? formData.apartment_office,
      floor: customerData.floor ?? formData.floor,
    })

    if (customerData.phone?.trim()) {
      setPhoneNumber(
        toLocalPhoneNumber(
          customerData.phone,
          selectedCountry.code,
          selectedCountry.digits
        )
      )
    }
  }

  /* ===============================
     SUBMIT
  =============================== */

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!validateForm(phoneNumber)) return

    if (!checkoutAllowed) {
      setErrorMessage(checkoutBlockMessage)
      return
    }

    if (cartItems.length === 0) {
      setErrorMessage("Корзина пуста")
      return
    }

    if (orderType === "delivery") {
      if (isShippingMethodsLoading) {
        setErrorMessage("Подождите, загружаем способы доставки...")
        return
      }

      if (!shippingMethods.length) {
        setErrorMessage(
          shippingError ||
            "Нет доступных способов доставки для текущего заказа."
        )
        return
      }

      if (!selectedShippingRate) {
        setErrorMessage("Выберите способ доставки")
        return
      }
    }

    setShowConfirmModal(true)
  }

  /* ===============================
     CONFIRM ORDER
  =============================== */

  const handleConfirmOrder = async () => {

    if (isLoading) return // 🔥 защита от двойного клика

    setErrorMessage("")

    try {
      await create({
        formData: {
          ...formData,
          phone: fullPhone,
        },
        cartItems,
        orderType,
        shippingMethod: selectedShippingRate
          ? {
              rate_id: selectedShippingRate.rate_id,
            }
          : undefined,
        selectedShippingRate: selectedShippingRate || undefined,
        pickupAddress,
        pickupMapUrl,
        onClose,
      })

    } catch (err) {
      console.error(err)

      const rawError = err as {
        data?: {
          message?: string
          code?: string
        }
      }

      setErrorMessage(
        rawError?.data?.message ||
          (rawError?.data?.code === "restaurant_closed"
            ? checkoutBlockMessage
            : "Ошибка создания заказа")
      )
    }
  }

  /* ===============================
     CANCEL
  =============================== */

  const handleCancelConfirm = () => {
    setShowConfirmModal(false)
    setErrorMessage("")
  }

  /* ===============================
     RETURN
  =============================== */

  return {
    formData,
    errors,

    orderType,
    selectedCountry,
    phoneNumber,
    fullPhone,
    isCountryDropdownOpen,

    cartItems,
    totalAmount,
    totalWithShipping,
    shippingCost,
    shippingMethods,
    selectedShippingRate,
    selectedShippingRateId,
    shippingError,
    isShippingMethodsLoading,

    showConfirmModal,
    isSubmitting: isLoading, // 🔥 единый источник
    errorMessage,
    checkoutAllowed,
    checkoutBlockMessage,
    isRestaurantHoursLoading,
    pickupAddress,
    pickupMapUrl,

    handleInputChange,
    handlePhoneNumberChange,

    handleCountrySelect,
    toggleCountryDropdown,
    handleShippingMethodSelect,
    handleAutoFill,
    setOrderType,

    handleSubmit,
    handleConfirmOrder,
    handleCancelConfirm,
  }
}