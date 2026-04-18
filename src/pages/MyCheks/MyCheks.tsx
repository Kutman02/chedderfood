import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { useGetPublicProductsQuery } from "@/api"
import { MyReceipts } from "@/components/MyReceipts/MyReceipts"

const MyCheks = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { data } = useGetPublicProductsQuery()

  const products = data?.data ?? []

  useEffect(() => {
    if (!searchParams.has("order")) {
      return
    }

    navigate("/mycheks", { replace: true })
  }, [navigate, searchParams])

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
