/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import * as Hooks from '@app/pages/hooks/index.ts'
import type * as Types from '@app/pages/Types.ts'

export function useBidOfferHistory(start: number, end: number) {
  const [data, setData] = useState<Types.HistoryBidOfferResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)

  const fetchHistory = useCallback(
    (signal?: AbortSignal) => {
      const myId = requestIdRef.current + 1
      requestIdRef.current = myId
      setLoading(true)
      setError(null)
      const params = { start, end }
      const opts = signal ? { signal } : undefined
      Hooks.fetchApi<Types.HistoryBidOfferResponse>('/api/history/bid-offer', params, opts)
        .then((result) => {
          if (requestIdRef.current === myId) {
            setData(result)
          }
        })
        .catch((fetchError: unknown) => {
          if (requestIdRef.current !== myId) {
            return
          }
          if (
            fetchError != null &&
            typeof fetchError === 'object' &&
            (fetchError as Error).name === 'AbortError'
          ) {
            return
          }
          setError(fetchError instanceof Error ? fetchError.message : String(fetchError))
        })
        .finally(() => {
          if (requestIdRef.current === myId) {
            setLoading(false)
          }
        })
    },
    [start, end]
  )

  useEffect(() => {
    const ctrl = new AbortController()
    fetchHistory(ctrl.signal)
    return () => ctrl.abort()
  }, [fetchHistory])

  const refetch = useCallback(() => fetchHistory(), [fetchHistory])
  return { data, loading, error, refetch }
}
