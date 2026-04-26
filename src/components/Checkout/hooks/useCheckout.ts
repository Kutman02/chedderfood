import { useState, useEffect, useMemo } from "react"

import { useAppSelector } from "@/app/hooks"

import { CIS_COUNTRIES } from "../constants/countries"

import { useCartSummary } from "./useCartSummary"
import { useCheckoutForm } from "./useCheckoutForm"
import { useCreateOrder } from "./useCreateOrder"
import {
  useGetRestaurantHoursStatusQuery,
  useGetShippingMethodsMutation,
} from "@/api"
import type { ShippingRate } from "@/types"

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
  const [getShippingMethods, { isLoading: isShippingMethodsLoading }] =
    useGetShippingMethodsMutation()

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
  const [shippingMethods, setShippingMethods] = useState<ShippingRate[]>([])
  const [selectedShippingRateId, setSelectedShippingRateId] = useState("")
  const [shippingError, setShippingError] = useState("")

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

  const selectedShippingRate = useMemo(
    () =>
      shippingMethods.find((method) => method.rate_id === selectedShippingRateId) || null,
    [shippingMethods, selectedShippingRateId]
  )

  const shippingCost = orderType === "delivery"
    ? Math.max(
        Number(
          selectedShippingRate?.total ??
            selectedShippingRate?.cost ??
            0
        ) || 0,
        0
      )
    : 0

  const totalWithShipping = totalAmount + shippingCost

  const extractApiErrorMessage = (
    error: unknown,
    fallbackMessage: string
  ): string => {
    if (error && typeof error === "object" && "data" in error) {
      const data = (error as { data?: unknown }).data

      if (typeof data === "string" && data.trim()) {
        return data
      }

      if (data && typeof data === "object" && "message" in data) {
        const message = (data as { message?: unknown }).message
        if (typeof message === "string" && message.trim()) {
          return message
        }
      }
    }

    if (error && typeof error === "object" && "message" in error) {
      const message = (error as { message?: unknown }).message
      if (typeof message === "string" && message.trim()) {
        return message
      }
    }

    return fallbackMessage
  }

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

  useEffect(() => {
    let isCancelled = false

    const loadShippingMethods = async () => {
      if (orderType === "pickup") {
        setShippingMethods([])
        setSelectedShippingRateId("")
        setShippingError("")
        return
      }

      if (!cartItems.length) {
        setShippingMethods([])
        setSelectedShippingRateId("")
        setShippingError("")
        return
      }

      setShippingError("")

      try {
        const response = await getShippingMethods({
          order_type: "delivery",
          line_items: cartItems,
        }).unwrap()

        if (isCancelled) return

        const requiresShipping = response.data?.requires_shipping !== false
        const methods = Array.isArray(response.data?.methods)
          ? response.data.methods
          : []

        const availableMethods = requiresShipping ? methods : []
        setShippingMethods(availableMethods)

        if (!requiresShipping) {
          setSelectedShippingRateId("")
          return
        }

        const ids = new Set(availableMethods.map((method) => method.rate_id))
        const defaultRateId =
          (response.data.default_rate_id && ids.has(response.data.default_rate_id)
            ? response.data.default_rate_id
            : availableMethods[0]?.rate_id) || ""

        setSelectedShippingRateId((prev) =>
          ids.has(prev) ? prev : defaultRateId
        )

        if (!availableMethods.length) {
          setShippingError(
            "Для текущей корзины нет доступных способов доставки."
          )
        }
      } catch (error) {
        if (isCancelled) return

        setShippingMethods([])
        setSelectedShippingRateId("")
        setShippingError(
          extractApiErrorMessage(
            error,
            "Не удалось получить способы доставки. Попробуйте снова."
          )
        )
      }
    }

    loadShippingMethods()

    return () => {
      isCancelled = true
    }
  }, [
    orderType,
    cartItems,
    getShippingMethods,
  ])

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

  const handleShippingMethodSelect = (rateId: string) => {
    setSelectedShippingRateId(rateId)
    setShippingError("")
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