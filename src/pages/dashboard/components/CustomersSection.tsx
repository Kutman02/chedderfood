import { Clients } from "@/components/dashboard/Clients/Clients"

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