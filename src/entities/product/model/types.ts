export type ProductImage = {
  id: number
  src: string
  name: string
  alt: string
}

export type Category = {
  id: number
  name: string
}

export type Tag = {
  id: number
  name: string
  slug: string
}

export type Product = {
  id: number

  name: string

  // 💰 цены
  price: string
  regular_price: string
  sale_price: string

  // 📝 описание
  description: string

  // 📦 статус
  status: string
  stock_status: string

  // 🔢 сортировка
  menu_order: number

  // 🖼 медиа
  images: ProductImage[]

  // 🗂 категории / теги
  categories: Category[]
  tags: Tag[]
}

export type ProductStatus =
  | "publish"
  | "draft"
  | "pending"
  | "private"
  | "none"