import { useNavigate } from "react-router-dom"

import { useGetPublicProductsQuery } from "@/api"
import { MyReceipts } from "@/components/MyReceipts/MyReceipts"

const MyCheks = () => {
  const navigate = useNavigate()

  const { data } = useGetPublicProductsQuery()

  const products = data?.data ?? []

  const handleClose = () => {
    navigate("/")
  }

  return (
    <MyReceipts
      products={products}
      onClose={handleClose}
    />
  )
}

export default MyCheks
