import { baseApi } from "../base/baseApi"
import {
  normalizeProductCategoriesResponse,
  normalizeProductMutationResponse,
} from "./products.transformers"
import type {
  Product,
  ProductsResponse,
  Category,
  ProductStatus,
  StockStatus,
} from "@/types"

/* =========================
   ADMIN PRODUCTS API
   Эндпоинты:
   - GET /custom/v1/products (получить товары)
   - POST /custom/v1/products (создать товар)
   - PUT /custom/v1/products/{id} (обновить товар)
   - PUT /custom/v1/products/{id}/visibility (изменить видимость)
   - POST /custom/v1/media (загрузить изображение)
   Требует аутентификацию (Bearer token)
========================= */

export interface GetProductsParams {
  page?: number
  per_page?: number
  search?: string
  category?: number
}

/* =========================
   CREATE PRODUCT
========================= */

export interface CreateProductRequest {
  name: string
  price: number
  regular_price?: number
  sale_price?: number | null
  description?: string
  visible?: boolean
  stock_status?: StockStatus
  menu_order?: number
  category_ids?: number[]
  tag_ids?: number[]
  image_ids?: number[]
}

/* =========================
   UPLOAD IMAGE
========================= */

export interface UploadImageRequest {
  file: File
}

export interface UploadImageResponse {
  id: number
  src: string
  name: string
}

/* =========================
   UPDATE PRODUCT
========================= */

export interface UpdateProductRequest {
  id: number
  data: {
    name?: string
    price?: number
    regular_price?: number
    sale_price?: number | null
    description?: string
    visible?: boolean
    stock_status?: StockStatus
    menu_order?: number
    category_ids?: number[]
    tag_ids?: number[]
    image_ids?: number[]
  }
}

/* =========================
   VISIBILITY
========================= */

export interface UpdateProductVisibilityRequest {
  id: number
  visible: boolean
}

export interface UpdateProductVisibilityResponse {
  success: boolean
  id: number
  status: ProductStatus
  message?: string
}

/* =========================
   API
========================= */

export const adminProductsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =========================
       GET PRODUCTS (ADMIN)
    ========================= */

    getProducts: builder.query<
      ProductsResponse,
      GetProductsParams | void
    >({
      query: (params) => ({
        url: "/custom/v1/products",
        method: "GET",
        params: params || {},
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.data.map((product: Product) => ({
                type: "Products" as const,
                id: product.id,
              })),
              { type: "Products" as const, id: "LIST" },
            ]
          : [{ type: "Products" as const, id: "LIST" }],
    }),

    /* =========================
       CREATE PRODUCT
    ========================= */

    createProduct: builder.mutation<
      Product,
      CreateProductRequest
    >({
      query: (data) => ({
        url: "/custom/v1/products",
        method: "POST",
        body: data,
      }),

      transformResponse: normalizeProductMutationResponse,

      invalidatesTags: [
        { type: "Products" as const, id: "LIST" },
      ],
    }),

    /* =========================
       UPDATE PRODUCT
    ========================= */

    updateProduct: builder.mutation<
      Product,
      UpdateProductRequest
    >({
      query: ({ id, data }) => ({
        url: `/custom/v1/products/${id}`,
        method: "PUT",
        body: data,
      }),

      transformResponse: normalizeProductMutationResponse,

      invalidatesTags: (_result, _error, { id }) => [
        { type: "Products" as const, id },
        { type: "Products" as const, id: "LIST" },
      ],
    }),

    /* =========================
       UPLOAD IMAGE
    ========================= */

    uploadImage: builder.mutation<
      UploadImageResponse,
      UploadImageRequest
    >({
      query: ({ file }) => {
        const formData = new FormData()
        formData.append("file", file)

        return {
          url: "/custom/v1/media",
          method: "POST",
          body: formData,
        }
      },
    }),

    /* =========================
       GET CATEGORIES
    ========================= */

    getProductCategories: builder.query<Category[], void>({
      query: () => ({
        url: "/custom/v1/categories",
        method: "GET",
      }),

      transformResponse: normalizeProductCategoriesResponse,

      providesTags: [
        { type: "Categories" as const, id: "LIST" },
      ],
    }),

    /* =========================
       TOGGLE VISIBILITY
    ========================= */

    updateProductVisibility: builder.mutation<
      UpdateProductVisibilityResponse,
      UpdateProductVisibilityRequest
    >({
      query: ({ id, visible }) => ({
        url: `/custom/v1/products/${id}/visibility`,
        method: "PUT",
        body: { visible },
      }),

      async onQueryStarted(
        { id, visible },
        { dispatch, queryFulfilled }
      ) {

        const patchResult = dispatch(
          adminProductsApi.util.updateQueryData(
            "getProducts",
            undefined,
            (draft: ProductsResponse) => {

              const product = draft.data.find(
                (p: Product) => p.id === id
              )

              if (product) {
                product.status = visible ? "publish" : "draft"
              }
            }
          )
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },

      invalidatesTags: (_result, _error, { id }) => [
        { type: "Products" as const, id },
        { type: "Products" as const, id: "LIST" },
      ],
    }),

  }),
})

/* =========================
   EXPORT HOOKS
========================= */

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadImageMutation,
  useGetProductCategoriesQuery,
  useUpdateProductVisibilityMutation,
} = adminProductsApi
