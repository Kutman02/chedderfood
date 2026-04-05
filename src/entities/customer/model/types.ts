export type CustomerAddress = {
  first_name: string
  last_name: string
  email: string
  phone: string
  address_1: string
  address_2: string
  city: string
  postcode: string
  country: string
  company: string
}

export type Customer = {
  id: number

  first_name: string
  last_name: string
  email: string

  // 🔥 ОСНОВНЫЕ ДАННЫЕ
  billing: CustomerAddress
  shipping: CustomerAddress

  // 🔥 СТАТИСТИКА (НЕ optional!)
  orders_count: number
  total_spent: string

  // 🔥 ДАТЫ
  date_created: string
  date_modified: string

  // 🔥 РОЛЬ (wc)
  role: string
}