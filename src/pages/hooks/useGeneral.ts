/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import { useEffect, useState } from 'react'
import * as Hooks from '@app/pages/hooks/index.ts'
import type * as Types from '@app/pages/Types.ts'

export function useGeneral() {
  const [data, setData] = useState<Types.GeneralResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false
    setLoading(true)
    setError(null)
    Hooks.useClient<Types.GeneralResponse>('/api/general')
      .then((responseData) => {
        if (!isCancelled) {
          setData(responseData)
        }
      })
      .catch((fetchError) => {
        if (!isCancelled) {
          setError(fetchError instanceof Error ? fetchError.message : String(fetchError))
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false)
        }
      })
    return () => {
      isCancelled = true
    }
  }, [])

  return { data, loading, error }
}
