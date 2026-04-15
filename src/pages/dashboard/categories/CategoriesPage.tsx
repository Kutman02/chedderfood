import { CategoriesManager } from "@/components/dashboard/CategoriesManager"
import { useOutletContext } from "react-router-dom"

type OutletContextType = {
  searchQuery: string
  setSearchMeta: (
    section: "orders" | "products" | "customers" | "categories" | "tags",
    meta: { found: number; total: number; loading?: boolean }
  ) => void
}

const CategoriesPage = () => {
  const { searchQuery, setSearchMeta } = useOutletContext<OutletContextType>()

  return (
    <CategoriesManager
      searchQuery={searchQuery}
      setSearchMeta={setSearchMeta}
    />
  )
}

export default CategoriesPage
