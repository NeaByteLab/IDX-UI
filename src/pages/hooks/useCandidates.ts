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

function buildQueryParams(
  params: Types.CandidatesParams
): Record<string, string | number | boolean> {
  const limit = params.limit != null ? params.limit : 10
  const queryParams: Record<string, string | number | boolean> = { limit }
  if (params.offset != null) {
    queryParams['offset'] = params.offset
  }
  if (params.date != null) {
    queryParams['date'] = params.date
  }
  if (params.defaultFilter === true) {
    queryParams['defaultFilter'] = true
  }
  if (params.excludeNotation === true) {
    queryParams['excludeNotation'] = true
  }
  if (params.excludeCorpAction === true) {
    queryParams['excludeCorpAction'] = true
  }
  if (params.excludeUma === true) {
    queryParams['excludeUma'] = true
  }
  if (params.minValue != null) {
    queryParams['minValue'] = params.minValue
  }
  if (params.minVolume != null) {
    queryParams['minVolume'] = params.minVolume
  }
  if (params.perMin != null) {
    queryParams['perMin'] = params.perMin
  }
  if (params.perMax != null) {
    queryParams['perMax'] = params.perMax
  }
  if (params.roeMin != null) {
    queryParams['roeMin'] = params.roeMin
  }
  if (params.derMax != null) {
    queryParams['derMax'] = params.derMax
  }
  if (params.momentumWeek != null) {
    queryParams['momentumWeek'] = params.momentumWeek
  }
  if (params.momentumMin != null) {
    queryParams['momentumMin'] = params.momentumMin
  }
  if (params.withSectorRank === true) {
    queryParams['withSectorRank'] = true
  }
  return queryParams
}

export function useCandidates(params: Types.CandidatesParams) {
  const [response, setResponse] = useState<Types.CandidatesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)
  const fetchCandidates = useCallback(
    (signal?: AbortSignal) => {
      const myId = requestIdRef.current + 1
      requestIdRef.current = myId
      setLoading(true)
      setError(null)
      const queryParams = buildQueryParams(params)
      const opts = signal ? { signal } : undefined
      Hooks.useClient<Types.CandidatesResponse>('/api/candidates', queryParams, opts)
        .then((data) => {
          if (requestIdRef.current === myId) {
            setResponse(data)
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
    [
      params.limit,
      params.offset,
      params.date,
      params.defaultFilter,
      params.excludeNotation,
      params.excludeCorpAction,
      params.excludeUma,
      params.minValue,
      params.minVolume,
      params.perMin,
      params.perMax,
      params.roeMin,
      params.derMax,
      params.momentumWeek,
      params.momentumMin,
      params.withSectorRank
    ]
  )

  useEffect(() => {
    const ctrl = new AbortController()
    fetchCandidates(ctrl.signal)
    return () => ctrl.abort()
  }, [fetchCandidates])

  const refetch = useCallback(() => fetchCandidates(), [fetchCandidates])
  return { response, loading, error, refetch }
}
