/* CUSTOMER */

export interface CustomerBilling {
  first_name?: string
  last_name?: string
  phone?: string
  address_1?: string
  address_2?: string
  city?: string
  state?: string
  postcode?: string
  country?: string
}

export interface Customer {
  id: number
  username: string
  first_name?: string
  last_name?: string
  email?: string
  date_created: string
  date_modified?: string
  billing?: CustomerBilling
  orders_count?: number
  total_spent?: string
  avatar_url?: string
}

export interface CustomersResponse {
  data: Customer[]
  total?: number
  totalPages?: number
}
