import { useState, useEffect, useMemo, useRef } from "react"
import { useGetPublicProductCategoriesQuery } from "../../app/services/publicApi"
import { useSearchParams } from "react-router-dom"

import { useAppDispatch, useAppSelector } from "@/app/hooks"
import {
  openCart,
  openReceipts,
  closeCart,
  closeReceipts,
} from "@/app/slices/uiSlice"

import { useScrollLockStore } from "@/stores/scrollLockStore"

import { HeaderTop } from "./components/HeaderTop"
import { CategorySkeleton } from "../Skeleton/components"

export const PublicHeader = () => {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  const headerRef = useRef<HTMLElement | null>(null)

  const isReceiptsOpen = useAppSelector((s) => s.ui.isReceiptsOpen)
  const isCartOpen = useAppSelector((s) => s.ui.isCartOpen)
  const receipts = useAppSelector((s) => s.receipts.receipts)

  const { data: categories, isLoading } =
    useGetPublicProductCategoriesQuery({ per_page: 100 })

  const isScrollLocked = useScrollLockStore((s) => s.isLocked)

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

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

  useEffect(() => {
    if (isScrollLocked) return

    const handleScroll = () => {
      const sections = document.querySelectorAll('[id^="category-"]')

      let activeCategory: number | null = null

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()

        if (rect.top <= 120 && rect.bottom > 120) {
          const id = section.id.replace("category-", "")
          activeCategory = Number(id)
        }
      })

      if (activeCategory !== selectedCategory) {
        setSelectedCategory(activeCategory)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [selectedCategory, isScrollLocked])

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId)

    const section = document.getElementById(`category-${categoryId}`)
    if (!section) return

    const headerHeight =
      headerRef.current?.getBoundingClientRect().height ?? 0

    const y =
      section.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      8

    window.scrollTo({
      top: y,
      behavior: "smooth",
    })
  }

  const filteredCategories =
    categories?.filter((c) => c.name !== "Без категории") ?? []

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4">

        {/* Header Top */}
        <HeaderTop
          hasActiveOrders={hasActiveOrders}
          onReceiptsClick={handleOpenReceipts}
          onCartToggle={handleCartToggle}
        />

        {/* Categories */}
        <div className="border-t border-slate-200/50 py-2">

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">

            {isLoading ? (
              <CategorySkeleton count={8} />
            ) : (
              filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all shrink-0 ${
                    selectedCategory === category.id
                      ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                      : "bg-white/60 text-slate-700 hover:bg-white/80 backdrop-blur-sm border border-slate-200/50"
                  }`}
                >
                  {category.name}
                </button>
              ))
            )}

          </div>

        </div>

      </div>
    </header>
  )
}