import { baseApi } from "../base/baseApi"
import type { RestaurantHoursResponse } from "@/types"

export const publicRestaurantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRestaurantHoursStatus: builder.query<RestaurantHoursResponse, void>({
      query: () => ({
        url: "/custom/v1/restaurant-hours",
        method: "GET",
      }),
    }),
  }),
})

export const {
  useGetRestaurantHoursStatusQuery,
} = publicRestaurantApi
