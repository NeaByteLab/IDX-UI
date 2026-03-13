/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import { useCallback, useMemo, useState } from 'react'
import type * as Types from '@app/pages/Types.ts'

const storageKey = 'idx-watchlist'

function loadRows(): Types.CandidateTableRow[] {
  if (typeof globalThis.localStorage === 'undefined') {
    return []
  }
  try {
    const raw = globalThis.localStorage.getItem(storageKey)
    if (raw == null || raw === '') {
      return []
    }
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }
    const rows = parsed.filter(
      (x): x is Types.CandidateTableRow =>
        x != null && typeof x === 'object' && typeof (x as { code?: unknown }).code === 'string'
    )
    return rows
  } catch {
    return []
  }
}

function saveRows(rows: Types.CandidateTableRow[]) {
  if (typeof globalThis.localStorage === 'undefined') {
    return
  }
  globalThis.localStorage.setItem(storageKey, JSON.stringify(rows))
}

export function useWatchlist() {
  const [watchlistRows, setWatchlistRows] = useState<Types.CandidateTableRow[]>(loadRows)
  const watchlistCodes = useMemo(() => watchlistRows.map((r) => r.code), [watchlistRows])
  const toggleWatchlist = useCallback((code: string, row?: Types.CandidateTableRow) => {
    setWatchlistRows((prev) => {
      const inList = prev.some((r) => r.code === code)
      if (inList) {
        const next = prev.filter((r) => r.code !== code)
        saveRows(next)
        return next
      }
      if (row == null) {
        return prev
      }
      const next = [...prev, row].sort((a, b) => b.compositeScore - a.compositeScore)
      saveRows(next)
      return next
    })
  }, [])
  const isInWatchlist = useCallback(
    (code: string) => watchlistCodes.includes(code),
    [watchlistCodes]
  )
  return { watchlistRows, watchlistCodes, toggleWatchlist, isInWatchlist }
}
