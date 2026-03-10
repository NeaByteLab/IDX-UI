import { useCallback, useEffect, useState } from 'react'
import * as API from '@app/API/index.ts'
import type * as Types from '@app/Types/index.ts'

export function useCompanyDetail(code: string | null): Types.UseCompanyDetailResult {
  const [data, setData] = useState<Types.CompanyDetailData | null>(null)
  const [loading, setLoading] = useState(!!code)
  const [error, setError] = useState<Types.ApiError | null>(null)
  const [refetchKey, setRefetchKey] = useState(0)
  const refetch = useCallback(() => setRefetchKey((k) => k + 1), [])
  useEffect(() => {
    if (!code || code.trim() === '') {
      setData(null)
      setLoading(false)
      setError(null)
      return
    }
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    API.apiGet<Types.SingleResponse<Types.CompanyDetailData>>(API.companyDetailPath(code))
      .then((res) => {
        if (!controller.signal.aborted && res?.data) {
          setData(res.data)
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
  }, [code, refetchKey])
  return { data, loading, error, refetch }
}
