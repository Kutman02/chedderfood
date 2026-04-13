import { useOutletContext } from "react-router-dom"
import { TagsManager } from "@/components/dashboard/TagsManager"

type OutletContextType = {
  searchQuery: string
}

const TagsPage = () => {
  const { searchQuery } = useOutletContext<OutletContextType>()

  return <TagsManager searchQuery={searchQuery} />
}

export default TagsPage