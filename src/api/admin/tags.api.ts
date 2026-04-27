import { baseApi } from "../base/baseApi"
import {
  normalizeTagMutationResponse,
  normalizeTagsResponse,
} from "./tags.transformers"
import type {
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
  TagDeleteResponse,
} from "@/types"

export const adminTagsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query<Tag[], void>({
      query: () => ({
        url: "/custom/v1/tags",
        method: "GET",
      }),
      transformResponse: normalizeTagsResponse,
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
      transformResponse: normalizeTagMutationResponse,
      invalidatesTags: [{ type: "Tags" as const, id: "LIST" }],
    }),

    updateTag: builder.mutation<Tag, { id: number; data: UpdateTagRequest }>({
      query: ({ id, data }) => ({
        url: `/custom/v1/tags/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: normalizeTagMutationResponse,
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