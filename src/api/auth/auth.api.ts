import { baseApi } from "../base/baseApi"
import type {
  User,
  AuthResponse,
  LoginRequest,
} from "@/types"

/* =========================
   API
========================= */

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =========================
       LOGIN
    ========================= */

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/custom/v1/login",
        method: "POST",
        body,
      }),

      async onQueryStarted(
        _arg,
        { queryFulfilled }
      ) {
        try {
          const { data } = await queryFulfilled

          localStorage.setItem("token", data.token)

        } catch (error) {
          console.error("Login error:", error)
        }
      },
    }),

    /* =========================
       GET CURRENT USER
    ========================= */

    getMe: builder.query<User, void>({
      query: () => ({
        url: "/custom/v1/me",
        method: "GET",
      }),

      providesTags: ["Profile"],
    }),

    /* =========================
       GET PROFILE (alias for getMe)
    ========================= */

    getProfile: builder.query<User, void>({
      query: () => ({
        url: "/custom/v1/me",
        method: "GET",
      }),

      providesTags: ["Profile"],
    }),

    /* =========================
       LOGOUT
    ========================= */

    logout: builder.mutation<void, void>({
      queryFn: async () => {
        localStorage.removeItem("token")
        return { data: undefined }
      },

      invalidatesTags: ["Profile"],
    }),

    /* =========================
       UPDATE PROFILE
    ========================= */

    updateProfile: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: "/custom/v1/me",
        method: "PUT",
        body: data,
      }),

      invalidatesTags: ["Profile"],
    }),

  }),
})

/* =========================
   EXPORT HOOKS
========================= */

export const {
  useLoginMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useGetProfileQuery,
  useLogoutMutation,
  useUpdateProfileMutation,
} = authApi