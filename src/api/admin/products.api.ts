import { baseApi } from "../base/baseApi"
import type {
  Product,
  ProductsResponse,
  ProductImage,
} from "@/types"

/* =========================
   PARAMS
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
  description?: string
  regular_price: string
  sale_price?: string
  categories?: Array<{ id: number }>
  images?: ProductImage[]
}

export interface CreateProductResponse extends Product {}

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
  data: Partial<Product>
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
  status: "publish" | "draft"
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
      CreateProductResponse,
      CreateProductRequest
    >({
      query: (data) => ({
        url: "/custom/v1/products",
        method: "POST",
        body: data,
      }),

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

    getProductCategories: builder.query({
      query: () => ({
        url: "/custom/v1/categories",
        method: "GET",
      }),

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