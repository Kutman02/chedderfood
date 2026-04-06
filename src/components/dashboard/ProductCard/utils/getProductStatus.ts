import { FaFire, FaStar, FaGift } from "react-icons/fa"
import type { Product } from "@/types"

export type ProductStatusConfig = {
  label: string
  icon: React.ComponentType<{ size?: number }>
  color: string
}

export const getProductStatus = (
  product: Product
): ProductStatusConfig | null => {

  const tags = product.tags || []

  if (
    tags.some(
      t =>
        t.slug === "hit" ||
        t.name.toLowerCase().includes("хит")
    )
  ) {
    return {
      label: "Хит продаж",
      icon: FaFire,
      color: "from-red-500 to-red-600"
    }
  }

  if (
    tags.some(
      t =>
        t.slug === "new" ||
        t.name.toLowerCase().includes("новинка")
    )
  ) {
    return {
      label: "Новинка",
      icon: FaStar,
      color: "from-blue-500 to-blue-600"
    }
  }

  if (
    tags.some(
      t =>
        t.slug === "sale" ||
        t.name.toLowerCase().includes("скидка")
    )
  ) {
    return {
      label: "Скидка",
      icon: FaGift,
      color: "from-green-500 to-green-600"
    }
  }

  return null

}