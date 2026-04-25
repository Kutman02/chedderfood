/* BASE API */
export { baseApi } from "./base/baseApi"

/* AUTH */
export {
  useLoginMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useGetProfileQuery,
  useLogoutMutation,
  useUpdateProfileMutation,
} from "./auth/auth.api"

/* ADMIN - PRODUCTS */
export {
  useGetProductsQuery,
  useGetProductsQuery as useGetAdminProductsQuery,
  useGetProductsQuery as useGetAnalyticsProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadImageMutation,
  useGetProductCategoriesQuery,
  useUpdateProductVisibilityMutation,
} from "./admin/products.api"

/* ADMIN - ORDERS */
export {
  useGetOrdersQuery,
  useGetOrdersQuery as useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} from "./admin/orders.api"

/* ADMIN - ANALYTICS */
export {
  useGetDashboardAnalyticsQuery,
} from "./admin/analytics.api"

/* ADMIN - CUSTOMERS */
export {
  useGetCustomersQuery,
  useGetCustomerDetailsQuery,
} from "./admin/customers.api"

/* ADMIN - CATEGORIES */
export {
  useGetCategoriesQuery,
  useGetCategoriesQuery as useGetAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "./admin/categories.api"

/* ADMIN - TAGS */
export {
  useGetTagsQuery,
  useGetTagsQuery as useGetAdminTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} from "./admin/tags.api"

/* PUBLIC - PRODUCTS */
export {
  useGetPublicProductsQuery,
} from "./public/products.api"

/* PUBLIC - ORDERS */
export {
  useGetShippingMethodsMutation,
  useLazyGetPublicOrderStatusQuery,
  useCreateOrderMutation,
} from "./public/orders.api"

/* PUBLIC - CATEGORIES */
export {
  useGetPublicCategoriesQuery,
} from "./public/categories.api"

/* PUBLIC - RESTAURANT */
export {
  useGetRestaurantHoursStatusQuery,
} from "./public/restaurant.api"

/* PUBLIC - SITE */
export {
  useGetSiteFooterQuery,
  useLazyGetSiteFooterQuery,
  useUpdateSiteFooterMutation,
} from "./public/footer.api"

export {
  useGetAboutPageQuery,
  useLazyGetAboutPageQuery,
  useUpdateAboutPageMutation,
} from "./public/about.api"

export {
  useGetContactsPageQuery,
  useLazyGetContactsPageQuery,
  useUpdateContactsPageMutation,
} from "./public/contacts.api"
