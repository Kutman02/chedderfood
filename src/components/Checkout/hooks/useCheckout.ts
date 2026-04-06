import { useState, useEffect } from "react"

import { CIS_COUNTRIES } from "../constants/countries"

import { useCartSummary } from "./useCartSummary"
import { useCheckoutForm } from "./useCheckoutForm"
import { useCreateOrder } from "./useCreateOrder"

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
    validateForm,
  } = useCheckoutForm()

  const { create, isLoading } = useCreateOrder()

  /* ===============================
     UI STATE
  =============================== */

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  /* ===============================
     PHONE STATE
  =============================== */

  const [selectedCountry, setSelectedCountry] = useState(CIS_COUNTRIES[0])
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)

  const fullPhone = phoneNumber
    ? `${selectedCountry.code}${phoneNumber}`
    : ""

  /* ===============================
     SCROLL LOCK
  =============================== */

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  /* ===============================
     PHONE HANDLERS
  =============================== */

  const handlePhoneNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "")
    const limited = value.slice(0, selectedCountry.digits)
    setPhoneNumber(limited)
  }

  const handleCountrySelect = (country: typeof CIS_COUNTRIES[0]) => {
    setSelectedCountry(country)
    setIsCountryDropdownOpen(false)
  }

  const toggleCountryDropdown = () => {
    setIsCountryDropdownOpen((prev) => !prev)
  }

  /* ===============================
     SUBMIT
  =============================== */

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!validateForm(phoneNumber)) return

    if (cartItems.length === 0) {
      setErrorMessage("Корзина пуста")
      return
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
        onClose,
      })

    } catch (err) {
      console.error(err)
      setErrorMessage("Ошибка создания заказа")
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
    isCountryDropdownOpen,

    cartItems,
    totalAmount,

    showConfirmModal,
    isSubmitting: isLoading, // 🔥 единый источник
    errorMessage,

    handleInputChange,
    handlePhoneNumberChange,

    handleCountrySelect,
    toggleCountryDropdown,
    setOrderType,

    handleSubmit,
    handleConfirmOrder,
    handleCancelConfirm,
  }
}