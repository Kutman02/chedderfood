import { useState, useEffect, useMemo } from "react"
import { useGetPublicProductCategoriesQuery } from "../../app/services/publicApi"
import { useSearchParams } from "react-router-dom"

import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  openCart,
  openReceipts,
  closeCart,
  closeReceipts,
} from "../../app/slices/uiSlice"

import { useScrollLockStore } from "../../stores/scrollLockStore"

import { HeaderTop, CategoriesBar } from "./components"

export const PublicHeader = () => {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  const isReceiptsOpen = useAppSelector((s) => s.ui.isReceiptsOpen)
  const isCartOpen = useAppSelector((s) => s.ui.isCartOpen)
  const receipts = useAppSelector((s) => s.receipts.receipts)

  const { data: categories, isLoading } =
    useGetPublicProductCategoriesQuery({ per_page: 100 })

  const isScrollLocked = useScrollLockStore((s) => s.isLocked)

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  // есть ли активные заказы
  const hasActiveOrders = useMemo(() => {
    return receipts.some(
      (receipt) =>
        receipt.status !== "completed" && receipt.status !== "cancelled"
    )
  }, [receipts])

  const handleOpenReceipts = () => {
    if (isReceiptsOpen) {
      dispatch(closeReceipts())

      const newParams = new URLSearchParams(searchParams)
      newParams.delete("modal")
      setSearchParams(newParams)
    } else {
      dispatch(openReceipts())

      const newParams = new URLSearchParams(searchParams)
      newParams.set("modal", "mycheks")
      setSearchParams(newParams)
    }
  }

  const handleCartToggle = () => {
    if (isCartOpen) {
      dispatch(closeCart())

      const newParams = new URLSearchParams(searchParams)
      newParams.delete("modal")
      setSearchParams(newParams)
    } else {
      dispatch(openCart())

      const newParams = new URLSearchParams(searchParams)
      newParams.set("modal", "cart")
      setSearchParams(newParams)
    }
  }

  // подсветка категории при скролле
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[id^="category-"]')
      let activeCategory: number | null = null

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()

        if (rect.top <= 100 && rect.bottom > 100) {
          const id = section.id.replace("category-", "")
          activeCategory = Number(id)
        }
      })

      if (activeCategory !== selectedCategory) {
        setSelectedCategory(activeCategory)
      }
    }

    if (!isScrollLocked) {
      window.addEventListener("scroll", handleScroll)
    }

    return () => window.removeEventListener("scroll", handleScroll)
  }, [selectedCategory, isScrollLocked])

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId)

    setTimeout(() => {
      const section = document.getElementById(`category-${categoryId}`)

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }, 100)
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <HeaderTop
          hasActiveOrders={hasActiveOrders}
          onReceiptsClick={handleOpenReceipts}
          onCartToggle={handleCartToggle}
        />

        <CategoriesBar
          categories={categories}
          isLoading={isLoading}
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        />
      </div>
    </header>
  )
}