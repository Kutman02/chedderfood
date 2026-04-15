import { useOutletContext } from "react-router-dom"
import { CustomersSection } from "../components/CustomersSection"

type OutletContext = {
  searchQuery: string
  setSearchMeta: (
    section: "orders" | "products" | "customers" | "categories" | "tags",
    meta: { found: number; total: number; loading?: boolean }
  ) => void
}

const CustomersPage = () => {

  const { searchQuery, setSearchMeta } = useOutletContext<OutletContext>()

  return (
    <CustomersSection
      searchQuery={searchQuery}
      setSearchMeta={setSearchMeta}
    />
  )
}

export default CustomersPage
