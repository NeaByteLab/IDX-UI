import { useCallback, useState } from 'react'
import type * as Types from '@app/Types/index.ts'

const syncDurationMs = 2500

export function useSyncStatus(): [Types.SyncStatus, () => void] {
  const [status, setStatus] = useState<Types.SyncStatus>('idle')
  const triggerSync = useCallback(() => {
    setStatus('syncing')
    const t = setTimeout(() => setStatus('idle'), syncDurationMs)
    return () => clearTimeout(t)
  }, [])
  return [status, triggerSync]
}
