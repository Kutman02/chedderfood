import { baseApi } from "../base/baseApi"
import type {
  User,
  AuthResponse,
  LoginRequest,
  ProfileResponse,
  ProfileUpdateRequest,
} from "@/types"
import { authStorage } from "@/shared/lib/storage"

/* =========================
   AUTH API
   Эндпоинты: /custom/v1/login, /custom/v1/me
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
          await queryFulfilled

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

      transformResponse: (response: ProfileResponse) => response.user,

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

      transformResponse: (response: ProfileResponse) => response.user,

      providesTags: ["Profile"],
    }),

    /* =========================
       LOGOUT
    ========================= */

    logout: builder.mutation<void, void>({
      queryFn: async () => {
        authStorage.clearSession()
        return { data: undefined }
      },

      invalidatesTags: ["Profile"],
    }),

    /* =========================
       UPDATE PROFILE
    ========================= */

    updateProfile: builder.mutation<User, ProfileUpdateRequest>({
      query: (data) => ({
        url: "/custom/v1/me",
        method: "PUT",
        body: data,
      }),

      transformResponse: (response: ProfileResponse) => response.user,

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
