import { useState, useMemo, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import type { Product, Category } from "@/types"

import {
  useGetPublicProductsQuery,
  useGetPublicCategoriesQuery,
} from "@/api"

import { useAppDispatch, useAppSelector } from "@/app/hooks"

import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
} from "@/app/slices/cartSlice"

import {
  closeCart,
  closeReceipts,
} from "@/app/slices/uiSlice"

export const useHomeLogic = () => {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const cart = useAppSelector((s) => s.cart.items)

  const [searchParams, setSearchParams] = useSearchParams()

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  /* =========================
     API
  ========================= */

  const {
    data,
    isLoading: productsLoading,
    isError: productsError,
  } = useGetPublicProductsQuery()

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetPublicCategoriesQuery()

  const productsData = data?.data ?? []
  const categories: Category[] = Array.isArray(categoriesData) ? categoriesData : []

  // Filter out invalid categories
  const validCategories = categories.filter(cat => cat.id !== undefined && cat.id !== null && cat.name !== "Без категории")

  /* =========================
     NORMALIZATION
  ========================= */

  const normalizedProducts: Product[] = useMemo(() => {
    return productsData
  }, [productsData])

  /* =========================
     GROUPING
  ========================= */

  const productsByCategory = useMemo(() => {

    const grouped: Record<number, Product[]> = {}

    // Initialize groups for all valid categories
    validCategories.forEach((cat) => {
      if (cat.id) {
        grouped[cat.id] = []
      }
    })

    // Add products to their categories
    normalizedProducts.forEach((product) => {

      if (!product.categories?.length) return

      product.categories.forEach((cat) => {

        if (cat.id && !grouped[cat.id]) {
          grouped[cat.id] = []
        }

        if (cat.id) {
          grouped[cat.id].push(product)
        }

      })
    })

    // Sort products within each category
    Object.keys(grouped).forEach((id) => {
      const numId = Number(id)
      if (grouped[numId] && Array.isArray(grouped[numId])) {
        grouped[numId].sort((a, b) =>
          (a.menu_order || 0) - (b.menu_order || 0)
        )
      }
    })

    return grouped

  }, [normalizedProducts, validCategories])

  /* =========================
     CART
  ========================= */

  const addToCart = (product: Product) => {
    dispatch(addToCartAction(product))
  }

  const removeFromCart = (productId: number) => {
    dispatch(removeFromCartAction(productId))
  }

  const cartCount = useMemo(() => {
    return Object.values(cart).reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    )
  }, [cart])

  const cartTotalAmount = useMemo(() => {
    return Object.values(cart).reduce((sum: number, item: any) => {
      const price = parseFloat(item.sale_price || item.price || "0")
      return sum + price * item.quantity
    }, 0)
  }, [cart])

  /* =========================
     URL SYNC
  ========================= */

  useEffect(() => {

    const modal = searchParams.get("modal")
    const productId = searchParams.get("productId")

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

    } else if (modal === "receipts" || modal === "mycheks") {
      const orderId = searchParams.get("order")
      const params = new URLSearchParams()

      if (orderId) {
        params.set("order", orderId)
      }

      navigate(`/mycheks${params.toString() ? `?${params.toString()}` : ""}`, {
        replace: true,
      })
      dispatch(closeCart())
      dispatch(closeReceipts())
      return

    } else if (modal === "product" && productId && normalizedProducts.length) {

      const product = normalizedProducts.find(
        (p) => p.id === Number(productId)
      )

      if (product) {
        setSelectedProduct(product)
        setIsModalOpen(true)
      }

    } else {
      dispatch(closeCart())
      dispatch(closeReceipts())
      setIsModalOpen(false)
      setSelectedProduct(null)
    }

  }, [searchParams, dispatch, normalizedProducts, navigate])

  /* =========================
     MODAL
  ========================= */

  const openProductModal = (product: Product) => {

    setSelectedProduct(product)
    setIsModalOpen(true)

    const params = new URLSearchParams(searchParams)

    params.set("modal", "product")
    params.set("productId", String(product.id))

    setSearchParams(params)
  }

  const closeProductModal = () => {

    setIsModalOpen(false)
    setSelectedProduct(null)

    const params = new URLSearchParams(searchParams)

    params.delete("modal")
    params.delete("productId")

    setSearchParams(params)
  }

  return {
    categories: validCategories,

    products: normalizedProducts,

    productsLoading,
    productsError,
    categoriesLoading,
    categoriesError,

    productsByCategory,

    addToCart,
    removeFromCart,

    cartCount,
    cartTotalAmount,

    selectedProduct,
    isModalOpen,

    openProductModal,
    closeProductModal,
  }
}
