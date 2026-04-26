import { useMemo, useState } from "react"
import { CIS_COUNTRIES, type Country } from "../constants/countries"
import { toLocalPhoneNumber } from "./checkout.utils"

type UseCheckoutPhoneParams = {
  initialPhone: string
}

export const useCheckoutPhone = ({
  initialPhone,
}: UseCheckoutPhoneParams) => {
  const [selectedCountry, setSelectedCountry] = useState(CIS_COUNTRIES[0])

  const [phoneNumber, setPhoneNumber] = useState(() =>
    toLocalPhoneNumber(
      initialPhone,
      CIS_COUNTRIES[0].code,
      CIS_COUNTRIES[0].digits
    )
  )

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)

  const fullPhone = useMemo(
    () => (phoneNumber ? `${selectedCountry.code}${phoneNumber}` : ""),
    [phoneNumber, selectedCountry.code]
  )

  const handlePhoneNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "")
    const limited = value.slice(0, selectedCountry.digits)
    setPhoneNumber(limited)
  }

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    setIsCountryDropdownOpen(false)
  }

  const toggleCountryDropdown = () => {
    setIsCountryDropdownOpen((prev) => !prev)
  }

  return {
    selectedCountry,
    phoneNumber,
    fullPhone,
    isCountryDropdownOpen,
    setPhoneNumber,
    handlePhoneNumberChange,
    handleCountrySelect,
    toggleCountryDropdown,
  }
}
