import type {
  Tag,
  TagMutationResponse,
  TagsResponse,
} from "@/types"

export const normalizeTagsResponse = (
  response: TagsResponse
): Tag[] => response.data ?? []

export const normalizeTagMutationResponse = (
  response: TagMutationResponse
): Tag => response.data
