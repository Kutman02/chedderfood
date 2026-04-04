// ===============================
// BASE
// ===============================
export { baseApi } from "./base/baseApi"

// ===============================
// AUTH
// ===============================
export {
  useGetMeQuery,
  useLazyGetMeQuery
} from "./auth/auth.api"

// ===============================
// ORDERS
// ===============================
export {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
} from "./orders/orders.api"

// ===============================
// PRODUCTS (🔥 ПОЛНЫЙ ФИКС)
// ===============================
export {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateProductOrderMutation,
  useGetProductCategoriesQuery
} from "./products/products.api"

// ===============================
// CUSTOMERS
// ===============================
export {
  useGetCustomersQuery,
  useGetAllCustomersQuery,
  useGetCustomerQuery
} from "./customers/customers.api"

// ===============================
// ANALYTICS
// ===============================
export {
  useGetStatsQuery,
  useGetAnalyticsQuery,
  useGetAnalyticsOrdersQuery,
  useGetAnalyticsProductsQuery
} from "./analytics/analytics.api"

// ===============================
// MEDIA
// ===============================
export {
  useUploadImageMutation
} from "./wordpress/media.api"

// ===============================
// PROFILE
// ===============================
export {
  useGetProfileQuery,
  useUpdateProfileMutation
} from "./profile/profile.api"