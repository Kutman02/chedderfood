// базовый API
export { baseApi } from "./base/baseApi"
// ===== Auth =====
export {
  useGetMeQuery,
  useLazyGetMeQuery
} from "./auth/auth.api"


// ===== Orders =====
export {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation, // ✅ ДОБАВИТЬ
  useUpdateOrderStatusMutation,
  useUpdateOrderMutation
} from "./orders/orders.api"


// ===== Products =====
export {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductOrderMutation,
  useGetProductCategoriesQuery
} from "./products/products.api"


// ===== Customers =====
export {
  useGetCustomersQuery,
  useGetAllCustomersQuery,
  useGetCustomerQuery
} from "./customers/customers.api"


// ===== Analytics =====
export {
  useGetStatsQuery,
  useGetAnalyticsQuery,
  useGetAnalyticsOrdersQuery,
  useGetAnalyticsProductsQuery
} from "./analytics/analytics.api"


// ===== WordPress Media =====
export {
  useUploadImageMutation
} from "./wordpress/media.api"


// ===== Profile =====
export {
  useGetProfileQuery,
  useUpdateProfileMutation
} from "./profile/profile.api"