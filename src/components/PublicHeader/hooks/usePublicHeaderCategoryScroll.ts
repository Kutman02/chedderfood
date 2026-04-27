import { useCallback, useEffect, useState } from "react"
import type { RefObject } from "react"

type UsePublicHeaderCategoryScrollArgs = {
  headerRef: RefObject<HTMLElement | null>
  isScrollLocked: boolean
}

export const usePublicHeaderCategoryScroll = ({
  headerRef,
  isScrollLocked,
}: UsePublicHeaderCategoryScrollArgs) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

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

      setSelectedCategory((prev) =>
        prev === activeCategory ? prev : activeCategory
      )
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [isScrollLocked])

  const handleCategoryClick = useCallback((categoryId: number) => {
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
  }, [headerRef])

  return {
    selectedCategory,
    handleCategoryClick,
  }
}
