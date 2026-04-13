import { baseApi } from "../base/baseApi"
import type { SiteFooterResponse, SiteFooterRequest } from "@/types"

export const publicFooterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSiteFooter: builder.query<SiteFooterResponse, void>({
      query: () => ({
        url: "/custom/v1/site-footer",
        method: "GET",
      }),
      providesTags: ["SiteFooter"],
    }),
    updateSiteFooter: builder.mutation<SiteFooterResponse, SiteFooterRequest>({
      query: (body) => ({
        url: "/custom/v1/site-footer",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["SiteFooter"],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetSiteFooterQuery,
  useLazyGetSiteFooterQuery,
  useUpdateSiteFooterMutation,
} = publicFooterApi
