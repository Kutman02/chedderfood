import { useOutletContext } from "react-router-dom"
import { CustomersSection } from "../components/CustomersSection"

type OutletContext = {
  searchQuery: string
}

const CustomersPage = () => {

  const { searchQuery } = useOutletContext<OutletContext>()

  return (
    <CustomersSection
      searchQuery={searchQuery}
    />
  )
}

export default CustomersPage
