import { CustomersSection } from "../components/CustomersSection"
import { useDashboardUI } from "../hooks/useDashboardUI"

const CustomersPage = () => {

  const { searchQuery } = useDashboardUI()

  return (
    <CustomersSection
      searchQuery={searchQuery}
    />
  )
}

export default CustomersPage