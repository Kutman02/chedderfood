import { baseApi } from "../base/baseApi"
import type { AboutPageRequest, AboutPageResponse } from "@/types"

export const publicAboutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAboutPage: builder.query<AboutPageResponse, void>({
      query: () => ({
        url: "/custom/v1/about-page",
        method: "GET",
      }),
      providesTags: ["AboutPage"],
    }),
    updateAboutPage: builder.mutation<AboutPageResponse, AboutPageRequest>({
      query: (body) => ({
        url: "/custom/v1/about-page",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AboutPage"],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAboutPageQuery,
  useLazyGetAboutPageQuery,
  useUpdateAboutPageMutation,
} = publicAboutApi