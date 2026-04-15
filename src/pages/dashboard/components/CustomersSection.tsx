import { Clients } from "@/components/dashboard/Clients/Clients"

type CustomersSectionProps = {
  searchQuery: string
  setSearchMeta: (
    section: "orders" | "products" | "customers" | "categories" | "tags",
    meta: { found: number; total: number; loading?: boolean }
  ) => void
}

export const CustomersSection = ({
  searchQuery,
  setSearchMeta,
}: CustomersSectionProps) => {

  return (
    <Clients
      searchQuery={searchQuery}
      setSearchMeta={setSearchMeta}
    />
  )

}