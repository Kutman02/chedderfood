// =========================
// BASE
// =========================
export { baseApi } from "./base/baseApi"


// =========================
// PRODUCTS
// =========================
export {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductCategoriesQuery,
  useUpdateProductOrderMutation,
} from "./products/products.api"


// =========================
// ORDERS
// =========================
export {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
} from "./orders/orders.api"


// =========================
// AUTH
// =========================
export {
  useGetMeQuery,
  useLazyGetMeQuery,
} from "./auth/auth.api"


// =========================
// CUSTOMERS
// =========================
export {
  useGetCustomersQuery,
  useGetAllCustomersQuery,
  useGetCustomerQuery,
} from "./customers/customers.api"


// =========================
// ANALYTICS
// =========================
export {
  useGetAnalyticsOrdersQuery,
  useGetAnalyticsProductsQuery
} from "./analytics/analytics.api"


// =========================
// PROFILE
// =========================
export {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadImageMutation
} from "./profile/profile.api"