import { baseApi } from "../base/baseApi"

export const authApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    getMe: builder.query<any, void>({
      query: () => ({
        url: "custom/v1/me",
      }),
    }),

  }),

})

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi