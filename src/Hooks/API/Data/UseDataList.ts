import { useCallback, useEffect, useState } from 'react'
import * as API from '@app/API/index.ts'
import type * as Types from '@app/Types/index.ts'

function useDataList(path: string, params: Types.YearMonthParams | null): Types.UseDataListResult {
  const [data, setData] = useState<unknown[] | null>(null)
  const [meta, setMeta] = useState<Types.PaginatedMeta | null>(null)
  const [loading, setLoading] = useState(!!params)
  const [error, setError] = useState<Types.ApiError | null>(null)
  const [refetchKey, setRefetchKey] = useState(0)
  const refetch = useCallback(() => setRefetchKey((k) => k + 1), [])
  useEffect(() => {
    if (!params || params.month < 1 || params.month > 12) {
      setData(null)
      setMeta(null)
      setLoading(false)
      setError(null)
      return
    }
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    const query = { ...API.buildPaginationQuery(params), year: params.year, month: params.month }
    API.apiGet<Types.PaginatedResponse<unknown>>(path, query)
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
  }, [
    path,
    refetchKey,
    params?.year,
    params?.month,
    params?.limit,
    params?.offset,
    params?.includeTotal
  ])
  return { data, meta, loading, error, refetch }
}

export { useDataList }
