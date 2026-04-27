import { useRef } from "react"
import { useScrollLockStore } from "@/stores/scrollLockStore"

import { HeaderTop } from "./components/HeaderTop"
import { CategorySkeleton } from "../Skeleton/components"
import { usePublicHeaderCategoryScroll } from "./hooks/usePublicHeaderCategoryScroll"
import { usePublicHeaderData } from "./hooks/usePublicHeaderData"
import { usePublicHeaderNavigation } from "./hooks/usePublicHeaderNavigation"

export const PublicHeader = () => {
  const headerRef = useRef<HTMLElement | null>(null)

  const isScrollLocked = useScrollLockStore((s) => s.isLocked)

  const {
    hasActiveOrders,
    filteredCategories,
    isLoading,
    isError,
  } = usePublicHeaderData()

  const {
    handleOpenReceipts,
    handleCartToggle,
  } = usePublicHeaderNavigation()

  const {
    selectedCategory,
    handleCategoryClick,
  } = usePublicHeaderCategoryScroll({
    headerRef,
    isScrollLocked,
  })

  /* ===============================
     RENDER
  =============================== */

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full bg-white/90 shadow-sm"
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
            ) : isError ? (
              <div className="text-sm text-red-500">
                Ошибка загрузки категорий
              </div>
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