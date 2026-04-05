import type { Customer } from "./types"

export const normalizeCustomer = (c: any): Customer => {

  const billing = c.billing || {}

  return {
    id: c.id,

    first_name:
      c.first_name ||
      billing.first_name ||
      "Клиент",

    last_name:
      c.last_name ||
      billing.last_name ||
      "",

    email:
      c.email ||
      billing.email ||
      "",

    billing: {
      first_name: billing.first_name || "",
      last_name: billing.last_name || "",
      email: billing.email || "",
      phone: billing.phone || "",
      address_1: billing.address_1 || "",
      address_2: billing.address_2 || "",
      city: billing.city || "",
      postcode: billing.postcode || "",
      country: billing.country || "",
      company: billing.company || "",
    },

    shipping: {
      first_name: c.shipping?.first_name || "",
      last_name: c.shipping?.last_name || "",
      email: "",
      phone: "",
      address_1: c.shipping?.address_1 || "",
      address_2: "",
      city: "",
      postcode: "",
      country: "",
      company: "",
    },

    orders_count: c.orders_count || 0,

    total_spent: c.total_spent || "0",

    date_created: c.date_created || "",
    date_modified: c.date_modified || "",

    role: c.role || "customer",
  }
}