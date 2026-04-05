import { baseApi } from "../base/baseApi"

/* =========================
   TYPES
========================= */

export type Profile = {
  id: number
  username: string
  display_name: string
  first_name: string
  last_name: string
  description: string
  avatar_url: string
}

/* 🔥 ответ WP media */
export type UploadImageResponse = {
  source_url?: string
  guid?: {
    rendered?: string
  }
}

/* =========================
   API
========================= */

export const profileApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    // =========================
    // GET PROFILE
    // =========================
    getProfile: builder.query<Profile, void>({

      query: () => ({
        url: "wp/v2/users/me",
        credentials: "include"
      }),

      providesTags: ["Profile"],

      transformResponse: (user: any): Profile => ({

        id: user.id,

        username: user.username,

        display_name: user.name,

        first_name:
          user.first_name ||
          user.name ||
          "",

        last_name:
          user.last_name ||
          "",

        description:
          user.description ||
          "",

        avatar_url:
          user.avatar_url ||
          user.avatar_urls?.["96"] ||
          user.avatar_urls?.["48"] ||
          ""

      })

    }),

    // =========================
    // UPDATE PROFILE
    // =========================
    updateProfile: builder.mutation<
      Profile,
      Partial<Profile>
    >({

      query: (body) => ({

        url: "wp/v2/users/me",
        method: "POST", // WP использует POST
        body,
        credentials: "include"

      }),

      invalidatesTags: ["Profile"]

    }),

    // =========================
    // UPLOAD AVATAR
    // =========================
    uploadImage: builder.mutation<
      UploadImageResponse,
      FormData
    >({

      query: (formData) => ({

        url: "wp/v2/media",
        method: "POST",
        body: formData,
        credentials: "include"

      }),

    })

  }),

  overrideExisting: false

})

/* =========================
   EXPORTS
========================= */

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadImageMutation
} = profileApi