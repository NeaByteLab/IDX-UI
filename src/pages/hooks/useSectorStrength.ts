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

export function useSectorStrength(week: 26 | 52 = 26) {
  const [data, setData] = useState<Types.SectorStrengthRow[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)

  const fetchSectorStrength = useCallback(
    (signal?: AbortSignal) => {
      const myId = requestIdRef.current + 1
      requestIdRef.current = myId
      setLoading(true)
      setError(null)
      const opts = signal ? { signal } : undefined
      Hooks.useClient<Types.SectorStrengthRow[]>('/api/sector/strength', { week }, opts)
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
    [week]
  )

  useEffect(() => {
    const ctrl = new AbortController()
    fetchSectorStrength(ctrl.signal)
    return () => ctrl.abort()
  }, [fetchSectorStrength])

  const refetch = useCallback(() => fetchSectorStrength(), [fetchSectorStrength])
  return { data, loading, error, refetch }
}
