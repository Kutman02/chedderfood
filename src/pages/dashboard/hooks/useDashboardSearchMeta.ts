import { useCallback, useMemo, useState } from "react"

type DashboardSearchSection =
  | "orders"
  | "products"
  | "customers"
  | "categories"
  | "tags"

type SearchMeta = {
  found: number
  total: number
  loading: boolean
}

type SearchMetaBySection = Record<DashboardSearchSection, SearchMeta>

type SearchMetaInput = {
  found: number
  total: number
  loading?: boolean
}

type UseDashboardSearchMetaArgs = {
  pathname: string
  searchQueries: Record<DashboardSearchSection, string>
  setSearchQuery: (section: DashboardSearchSection, value: string) => void
  getPlaceholder: (section: DashboardSearchSection) => string
}

const emptySearchMeta = (): SearchMetaBySection => ({
  orders: { found: 0, total: 0, loading: false },
  products: { found: 0, total: 0, loading: false },
  customers: { found: 0, total: 0, loading: false },
  categories: { found: 0, total: 0, loading: false },
  tags: { found: 0, total: 0, loading: false },
})

const resolveSectionFromPathname = (pathname: string): DashboardSearchSection | null => {
  if (pathname.includes("/products")) return "products"
  if (pathname.includes("/tags")) return "tags"
  if (pathname.includes("/categories")) return "categories"
  if (pathname.includes("/customers")) return "customers"
  if (pathname.includes("/orders")) return "orders"
  return null
}

export const useDashboardSearchMeta = ({
  pathname,
  searchQueries,
  setSearchQuery,
  getPlaceholder,
}: UseDashboardSearchMetaArgs) => {
  const [searchMetaBySection, setSearchMetaBySection] = useState<SearchMetaBySection>(
    emptySearchMeta
  )

  const section = useMemo(() => resolveSectionFromPathname(pathname), [pathname])

  const searchValue = section ? searchQueries[section] : ""

  const searchMeta = useMemo(() => {
    if (!section) {
      return { found: 0, total: 0, loading: false }
    }

    return searchMetaBySection[section]
  }, [searchMetaBySection, section])

  const searchPlaceholder = section
    ? getPlaceholder(section)
    : "Поиск недоступен в этом разделе"

  const setSearchMeta = useCallback(
    (targetSection: DashboardSearchSection, nextMeta: SearchMetaInput) => {
      setSearchMetaBySection((prev) => {
        const normalizedMeta = {
          found: nextMeta.found,
          total: nextMeta.total,
          loading: nextMeta.loading ?? false,
        }

        const currentMeta = prev[targetSection]

        if (
          currentMeta.found === normalizedMeta.found &&
          currentMeta.total === normalizedMeta.total &&
          currentMeta.loading === normalizedMeta.loading
        ) {
          return prev
        }

        return {
          ...prev,
          [targetSection]: normalizedMeta,
        }
      })
    },
    []
  )

  const handleSearchChange = useCallback((value: string) => {
    if (!section) return
    setSearchQuery(section, value)
  }, [section, setSearchQuery])

  return {
    section,
    searchValue,
    searchMeta,
    searchPlaceholder,
    setSearchMeta,
    handleSearchChange,
  }
}
