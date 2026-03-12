/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import type * as Types from '@app/pages/Types.ts'

export async function useClient<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
  options?: Types.ClientOptions
): Promise<T> {
  const url = new URL(path, globalThis.location?.origin ?? '')
  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      if (paramValue !== undefined && paramValue !== '') {
        url.searchParams.set(paramKey, String(paramValue))
      }
    }
  }
  const init: RequestInit = options?.signal != null ? { signal: options.signal } : {}
  const response = await fetch(url.toString(), init)
  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(
      response.status === 400
        ? errorBody || 'Bad request'
        : `API ${response.status}: ${errorBody || response.statusText}`
    )
  }
  return response.json() as Promise<T>
}
