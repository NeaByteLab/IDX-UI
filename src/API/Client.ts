import { getApiBaseUrl } from '@app/Config/index.ts'
import type { ApiError, ApiRequestOptions, PaginationParams } from '@app/Types/index.ts'

const defaultTimeoutMs = 15_000
const defaultLimit = 50
const maxLimit = 500
const maxOffset = 100_000

export function buildPaginationQuery(params?: PaginationParams): Record<string, number | string> {
  if (!params) {
    return { limit: defaultLimit, offset: 0 }
  }
  const limit = Math.min(maxLimit, Math.max(1, params.limit ?? defaultLimit))
  const offset = Math.min(maxOffset, Math.max(0, params.offset ?? 0))
  const out: Record<string, number | string> = { limit, offset }
  if (params.includeTotal === true) {
    out['total'] = '1'
  }
  return out
}

export function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const entries = Object.entries(params).filter(
    (entry): entry is [string, string | number | boolean] =>
      entry[1] !== undefined && entry[1] !== null && entry[1] !== ''
  )
  if (entries.length === 0) {
    return ''
  }
  const search = new URLSearchParams()
  for (const [key, value] of entries) {
    if (typeof value === 'boolean') {
      search.set(key, value ? '1' : '0')
    } else {
      search.set(key, String(value))
    }
  }
  const q = search.toString()
  return q ? `?${q}` : ''
}

export async function apiGet<T>(
  path: string,
  query?: Record<string, string | number | boolean | undefined>,
  options?: ApiRequestOptions
): Promise<T> {
  const base = getApiBaseUrl()
  const pathNormalized = path.startsWith('/') ? path : `/${path}`
  const queryString = query ? buildQuery(query) : ''
  const url = `${base}${pathNormalized}${queryString}`
  const timeoutMs = options?.timeoutMs ?? defaultTimeoutMs
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { method: 'GET', signal: controller.signal })
    clearTimeout(timeoutId)
    const text = await res.text()
    if (!res.ok) {
      let message = `Request failed: ${res.status}`
      try {
        const body = JSON.parse(text) as ApiError
        if (typeof body?.error === 'string') {
          message = body.error
        }
      } catch {
        if (text.trim() !== '') {
          message = text.slice(0, 200)
        }
      }
      const err: ApiError = { error: message, status: res.status }
      throw err
    }
    if (text.trim() === '') {
      return undefined as T
    }
    return JSON.parse(text) as T
  } catch (err) {
    clearTimeout(timeoutId)
    if (
      err && typeof err === 'object' && 'error' in err &&
      typeof (err as ApiError).error === 'string'
    ) {
      throw err
    }
    const message = err instanceof Error ? err.message : String(err)
    throw { error: message, status: undefined } as unknown as ApiError
  }
}
