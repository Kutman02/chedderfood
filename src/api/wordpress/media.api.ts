import { baseApi } from "../base/baseApi"

export const mediaApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    uploadImage: builder.mutation({

      query: (formData: FormData) => {

        const nonce: string | null = localStorage.getItem("wp_nonce")

        if (!nonce) {

          console.warn("⚠️ No nonce found in localStorage")

        }

        return {

          url: "wp/v2/media",

          method: "POST",

          body: formData,

          credentials: "include"

        }

      },

      transformResponse: (response: {
        id?: number
        source_url?: string
        [key: string]: unknown
      }) => {

        if (!response.id) {

          console.error("Image upload response missing ID", response)

        }

        return response

      },

      transformErrorResponse: (
        response: { status: number; data?: unknown },
        meta
      ) => {

        console.error("=== Image Upload Error ===")

        console.error("Status:", response.status)

        console.error("Data:", response.data)

        if (meta && "request" in meta) {

          console.error(
            "Request URL:",
            (meta.request as { url?: string })?.url
          )

        }

        console.error("=== End Upload Error ===")

        return response

      }

    })

  }),

  overrideExisting: false

})

export const {
  useUploadImageMutation
} = mediaApi