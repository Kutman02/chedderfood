import type {
  ProfileResponse,
  User,
} from "@/types"

export const normalizeProfileResponse = (
  response: ProfileResponse
): User => response.user
