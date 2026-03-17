import { baseApi } from "../base/baseApi"

export const profileApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    // Получить профиль текущего пользователя
getProfile: builder.query<any, void>({
        query: () => ({
        url: "wp/v2/users/me",
        credentials: "include"
      }),

      providesTags: ["Profile"],

      transformResponse: (user: any) => ({

        id: user.id,

        username: user.username,

        display_name: user.name,

        first_name: user.first_name || user.name || "",

        last_name: user.last_name || "",

        description: user.description || "",

        avatar_url:
          user.avatar_url ||
          user.avatar_urls?.["96"] ||
          ""

      })

    }),


    // Обновить профиль
    updateProfile: builder.mutation({

      query: (body) => ({

        url: "wp/v2/users/me",

        method: "POST",

        body,

        credentials: "include"

      }),

      invalidatesTags: ["Profile"]

    })

  }),

  overrideExisting: false

})


export const {

  useGetProfileQuery,
  useUpdateProfileMutation

} = profileApi