import { useCallback, useEffect, useState } from 'react'
import * as API from '@app/API/index.ts'
import type * as Types from '@app/Types/index.ts'

export function useCompanies(params?: Types.PaginationParams): Types.UseCompaniesResult {
  const [data, setData] = useState<unknown[] | null>(null)
  const [meta, setMeta] = useState<Types.PaginatedMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Types.ApiError | null>(null)
  const [refetchKey, setRefetchKey] = useState(0)
  const refetch = useCallback(() => setRefetchKey((k) => k + 1), [])
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    const query = API.buildPaginationQuery(params)
    API.apiGet<Types.PaginatedResponse<unknown>>(API.companiesPath(), query)
      .then((res) => {
        if (!controller.signal.aborted) {
          setData(res?.data ?? [])
          setMeta(res?.meta ?? null)
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted && err && typeof err === 'object' && 'error' in err) {
          setError(err as Types.ApiError)
        } else if (!controller.signal.aborted) {
          setError({ error: err instanceof Error ? err.message : String(err) })
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })
    return () => controller.abort()
  }, [refetchKey, params?.limit, params?.offset, params?.includeTotal])
  return { data, meta, loading, error, refetch }
}
