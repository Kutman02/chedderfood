import { useEffect, useState } from "react"
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom"
import type { Product } from "@/types"
import { useAppDispatch } from "@/app/hooks"
import {
  closeCart,
  closeReceipts,
} from "@/app/slices/uiSlice"

type UseHomeModalSyncArgs = {
  products: Product[]
}

export const useHomeModalSync = ({
  products,
}: UseHomeModalSyncArgs) => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { productId: productRouteId } = useParams<{ productId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const modal = searchParams.get("modal")
    const legacyProductId = searchParams.get("productId")

    if (modal === "cart") {
      const step = searchParams.get("step")
      const params = new URLSearchParams()

      if (step) {
        params.set("step", step)
      }

      navigate(`/cart${params.toString() ? `?${params.toString()}` : ""}`, {
        replace: true,
      })
      dispatch(closeCart())
      dispatch(closeReceipts())
      return
    }

    if (modal === "receipts" || modal === "mycheks") {
      navigate(`/mycheks`, {
        replace: true,
      })
      dispatch(closeCart())
      dispatch(closeReceipts())
      return
    }

    if (modal === "product" && legacyProductId) {
      navigate(`/product/${legacyProductId}`, {
        replace: true,
      })
      return
    }

    if (productRouteId) {
      if (!products.length) {
        return
      }

      const product = products.find((item) => item.id === Number(productRouteId))

      if (product) {
        setSelectedProduct(product)
        setIsModalOpen(true)
      } else {
        setIsModalOpen(false)
        setSelectedProduct(null)
        navigate("/", { replace: true })
      }

      return
    }

    dispatch(closeCart())
    dispatch(closeReceipts())
    setIsModalOpen(false)
    setSelectedProduct(null)
  }, [searchParams, dispatch, productRouteId, products, navigate])

  const openProductModal = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)

    navigate(`/product/${product.id}`)
  }

  const closeProductModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)

    if (location.pathname.startsWith("/product/")) {
      navigate("/")
      return
    }

    const params = new URLSearchParams(searchParams)

    params.delete("modal")
    params.delete("productId")

    setSearchParams(params)
  }

  return {
    selectedProduct,
    isModalOpen,
    openProductModal,
    closeProductModal,
  }
}
