/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import { useCallback, useState } from 'react'
import * as Hooks from '@app/pages/hooks/index.ts'
import type * as Types from '@app/pages/Types.ts'

export function useStockDetail() {
  const [data, setData] = useState<Types.StockDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDetail = useCallback(
    (stockCode: string, start: number, end: number, date?: number) => {
      if (!stockCode.trim()) {
        return
      }
      setLoading(true)
      setError(null)
      setData(null)
      const queryParams: Record<string, number> = { start, end }
      if (date != null) {
        queryParams['date'] = date
      }
      Hooks.useClient<Types.StockDetail>(
        `/api/stock/${stockCode.trim().toUpperCase()}/detail`,
        queryParams
      )
        .then(setData)
        .catch((fetchError) => {
          setError(fetchError instanceof Error ? fetchError.message : String(fetchError))
        })
        .finally(() => {
          setLoading(false)
        })
    },
    []
  )

  const clearDetail = useCallback(() => {
    setData(null)
    setError(null)
  }, [])

  return { data, loading, error, fetchDetail, clearDetail }
}
