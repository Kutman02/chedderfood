import { useEffect } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"

export const useModalRedirect = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const modal = searchParams.get("modal")

    if (modal && location.pathname !== "/") {
      const productId = searchParams.get("productId")

      const params = new URLSearchParams()
      params.set("modal", modal)

      if (productId) {
        params.set("productId", productId)
      }

      navigate(`/?${params.toString()}`, { replace: true })
    }
  }, [location.pathname, searchParams, navigate])
}