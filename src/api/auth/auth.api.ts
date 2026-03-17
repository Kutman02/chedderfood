import { baseApi } from "../base/baseApi"

export const authApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    // =========================
    // CHECK AUTH (login)
    // =========================
    getMe: builder.query<any, void>({

      query: () => ({
        url: "wp/v2/users/me",
        method: "GET",
        credentials: "include"
      }),

      providesTags: ["Profile"]

    })

  }),

  overrideExisting: false

})

export const {
  useGetMeQuery,
  useLazyGetMeQuery
} = authApi