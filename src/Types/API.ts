export interface PaginatedMeta {
  limit: number
  offset: number
  total?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginatedMeta
}

export interface SingleResponse<T> {
  data: T
}

export interface ApiError {
  error: string
  status?: number
}

export interface PaginationParams {
  limit?: number
  offset?: number
  includeTotal?: boolean
}

export interface ApiRequestOptions {
  timeoutMs?: number
}
