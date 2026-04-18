import { baseApi } from "../base/baseApi"
import type { ContactsPageRequest, ContactsPageResponse } from "@/types"

export const publicContactsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContactsPage: builder.query<ContactsPageResponse, void>({
      query: () => ({
        url: "/custom/v1/contacts-page",
        method: "GET",
      }),
      providesTags: ["ContactsPage"],
    }),
    updateContactsPage: builder.mutation<ContactsPageResponse, ContactsPageRequest>({
      query: (body) => ({
        url: "/custom/v1/contacts-page",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["ContactsPage"],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetContactsPageQuery,
  useLazyGetContactsPageQuery,
  useUpdateContactsPageMutation,
} = publicContactsApi