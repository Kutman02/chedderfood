import { useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export const usePublicHeaderNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleOpenReceipts = useCallback(() => {
    if (location.pathname === "/mycheks") {
      navigate("/")
      return
    }

    navigate("/mycheks")
  }, [location.pathname, navigate])

  const handleCartToggle = useCallback(() => {
    if (location.pathname === "/cart") {
      navigate("/")
      return
    }

    navigate("/cart")
  }, [location.pathname, navigate])

  return {
    handleOpenReceipts,
    handleCartToggle,
  }
}
