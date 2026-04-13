export interface Tag {
  id: number
  name: string
  slug?: string
  description?: string
}

export interface TagsResponse {
  success: boolean
  data: Tag[]
  total?: number
}

export interface CreateTagRequest {
  name: string
  slug?: string
  description?: string
}

export interface UpdateTagRequest {
  name?: string
  slug?: string
  description?: string
}

export interface TagMutationResponse {
  success: boolean
  data: Tag
  message?: string
}

export interface TagDeleteResponse {
  success: boolean
  data: {
    message: string
    id: number
  }
}