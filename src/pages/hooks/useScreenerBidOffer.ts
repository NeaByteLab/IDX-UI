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

export function useScreenerBidOffer(date?: number) {
  const [data, setData] = useState<Types.ScreenerBidOfferResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBidOffer = useCallback(() => {
    setLoading(true)
    setError(null)
    const params = date != null ? { date } : undefined
    Hooks.useClient<Types.ScreenerBidOfferResponse>('/api/screener/bid-offer', params)
      .then(setData)
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [date])

  useEffect(() => {
    fetchBidOffer()
  }, [fetchBidOffer])

  return { data, loading, error, refetch: fetchBidOffer }
}
