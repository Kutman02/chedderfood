import { Clients } from "@/components/Dashboard/Clients/Clients"

type CustomersSectionProps = {
  searchQuery: string
}

export const CustomersSection = ({
  searchQuery
}: CustomersSectionProps) => {

  return (
    <Clients searchQuery={searchQuery} />
  )

}