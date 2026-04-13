import { baseApi } from "../base/baseApi"
import type {
  Tag,
  TagsResponse,
  CreateTagRequest,
  UpdateTagRequest,
  TagMutationResponse,
  TagDeleteResponse,
} from "@/types"

export const adminTagsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query<Tag[], void>({
      query: () => ({
        url: "/custom/v1/tags",
        method: "GET",
      }),
      transformResponse: (response: TagsResponse) => response.data ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((tag) => ({ type: "Tags" as const, id: tag.id })),
              { type: "Tags" as const, id: "LIST" },
            ]
          : [{ type: "Tags" as const, id: "LIST" }],
    }),

    createTag: builder.mutation<Tag, CreateTagRequest>({
      query: (data) => ({
        url: "/custom/v1/tags",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: TagMutationResponse) => response.data,
      invalidatesTags: [{ type: "Tags" as const, id: "LIST" }],
    }),

    updateTag: builder.mutation<Tag, { id: number; data: UpdateTagRequest }>({
      query: ({ id, data }) => ({
        url: `/custom/v1/tags/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: TagMutationResponse) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Tags" as const, id },
        { type: "Tags" as const, id: "LIST" },
      ],
    }),

    deleteTag: builder.mutation<TagDeleteResponse, number>({
      query: (id) => ({
        url: `/custom/v1/tags/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Tags" as const, id },
        { type: "Tags" as const, id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} = adminTagsApi