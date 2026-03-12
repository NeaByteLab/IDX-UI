/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import { useCallback, useEffect, useState } from 'react'
import * as Hooks from '@app/pages/hooks/index.ts'
import * as Utils from '@app/pages/utils/index.ts'
import type * as Types from '@app/pages/Types.ts'

export function useOHLC(stockCode: string | null, periodDays: Types.ForeignPeriodDays) {
  const [data, setData] = useState<Types.OhlcApiRow[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchOHLC = useCallback(() => {
    if (!stockCode?.trim()) {
      setData(null)
      return
    }
    setLoading(true)
    setError(null)
    const end = Utils.Format.getTodayDateInt()
    const start = Utils.Format.addDaysToDateInt(end, -periodDays)
    Hooks.useClient<Types.OhlcApiRow[]>(`/api/${stockCode.trim().toUpperCase()}/ohlc`, {
      start,
      end
    })
      .then(setData)
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [stockCode, periodDays])

  useEffect(() => {
    if (stockCode?.trim()) {
      fetchOHLC()
    } else {
      setData(null)
      setError(null)
    }
  }, [stockCode, periodDays, fetchOHLC])

  return { data, loading, error, refetch: fetchOHLC }
}
