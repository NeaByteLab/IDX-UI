/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import { useCallback, useEffect, useState } from 'react'
import * as Hooks from '@app/pages/hooks/index.ts'
import type * as Types from '@app/pages/Types.ts'

export function useScreenerRsi() {
  const [data, setData] = useState<Types.ScreenerRsiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRsi = useCallback(() => {
    setLoading(true)
    setError(null)
    Hooks.fetchApi<Types.ScreenerRsiResponse>('/api/screener/rsi')
      .then(setData)
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchRsi()
  }, [fetchRsi])

  return { data, loading, error, refetch: fetchRsi }
}
