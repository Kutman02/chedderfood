import { useState, useEffect } from "react"

import { useAppSelector } from "@/app/hooks"

import { CIS_COUNTRIES } from "../constants/countries"

import { useCartSummary } from "./useCartSummary"
import { useCheckoutForm } from "./useCheckoutForm"
import { useCreateOrder } from "./useCreateOrder"
import { useGetRestaurantHoursStatusQuery } from "@/api"

interface UseCheckoutProps {
  onClose: () => void
}

const toLocalPhoneNumber = (
  rawPhone: string,
  dialCode: string,
  maxDigits: number
) => {
  const phoneDigits = rawPhone.replace(/\D/g, "")
  if (!phoneDigits) return ""

  const dialDigits = dialCode.replace(/\D/g, "")

  const localPart =
    dialDigits && phoneDigits.startsWith(dialDigits)
      ? phoneDigits.slice(dialDigits.length)
      : phoneDigits

  return localPart.slice(0, maxDigits)
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

  const resolvePickupAddress = () => {
    if (!restaurantHours) return ""

    const candidates = [
      restaurantHours.pickup?.address,
      restaurantHours.pickup_address,
      restaurantHours.restaurant_address,
      restaurantHours.address,
    ]

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim()
      }
    }

    return ""
  }

  const resolvePickupMapUrl = () => {
    if (!restaurantHours) return ""

    const candidates = [
      restaurantHours.pickup?.map_url,
      restaurantHours.pickup_map_url,
      restaurantHours.pickup_2gis_url,
      restaurantHours.map_2gis,
      restaurantHours.map2gis,
    ]

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim()
      }
    }

    return ""
  }

  const checkoutAllowed = restaurantHours?.checkout_allowed ?? true
  const pickupAddress = resolvePickupAddress()
  const pickupMapUrl = resolvePickupMapUrl()
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

  const [selectedCountry, setSelectedCountry] = useState(CIS_COUNTRIES[0])
  const [phoneNumber, setPhoneNumber] = useState(() =>
    toLocalPhoneNumber(
      formData.phone,
      CIS_COUNTRIES[0].code,
      CIS_COUNTRIES[0].digits
    )
  )
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

  useEffect(() => {
    if (formData.phone === fullPhone) return

    applyFormData({ phone: fullPhone })
  }, [applyFormData, formData.phone, fullPhone])

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
    handleAutoFill,
    setOrderType,

    handleSubmit,
    handleConfirmOrder,
    handleCancelConfirm,
  }
}