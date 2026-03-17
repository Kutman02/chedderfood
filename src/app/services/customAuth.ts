import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'
import {
  API_BASE_URL,
  WORDPRESS_USERNAME,
  WORDPRESS_APP_PASSWORD
} from './apiConfig'

// ✅ утилита
const createAppPasswordAuth = (
  username: string,
  appPassword: string
): string => {
  const cleanPassword = appPassword.replace(/\s+/g, '')
  return `Basic ${btoa(`${username}:${cleanPassword}`)}`
}

// ✅ ТОЛЬКО AUTH
export const customAuthApi = createApi({
  reducerPath: 'customAuthApi',

  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,

    prepareHeaders: (headers, { getState }) => {

      const token = (getState() as RootState).auth.token

      // 🔑 Application Password (основной)
      if (WORDPRESS_USERNAME && WORDPRESS_APP_PASSWORD) {
        headers.set(
          'Authorization',
          createAppPasswordAuth(
            WORDPRESS_USERNAME,
            WORDPRESS_APP_PASSWORD
          )
        )
      }

      // 🪪 fallback (если используешь JWT)
      if (token && token !== 'app_password_authenticated') {
        headers.set('authorization', `Bearer ${token}`)
      }

      return headers
    },

    credentials: 'include'
  }),

  tagTypes: ['Profile'],

  endpoints: (builder) => ({

    // =========================
    // LOGIN (проверка доступа)
    // =========================
    login: builder.mutation({

      query: () => ({
        url: 'wp/v2/users/me',
        method: 'GET'
      }),

      transformResponse: (response: unknown) => {
        return response
      },

      transformErrorResponse: (error: unknown) => {
        return error
      }

    })

  })

})

// ✅ экспорт
export const {
  useLoginMutation
} = customAuthApi