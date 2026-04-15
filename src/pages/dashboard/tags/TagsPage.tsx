import { useOutletContext } from "react-router-dom"
import { TagsManager } from "@/components/dashboard/TagsManager"

type OutletContextType = {
  searchQuery: string
  setSearchMeta: (
    section: "orders" | "products" | "customers" | "categories" | "tags",
    meta: { found: number; total: number; loading?: boolean }
  ) => void
}

const TagsPage = () => {
  const { searchQuery, setSearchMeta } = useOutletContext<OutletContextType>()

  return (
    <TagsManager
      searchQuery={searchQuery}
      setSearchMeta={setSearchMeta}
    />
  )
}

export default TagsPage