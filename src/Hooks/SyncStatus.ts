import { useCallback, useState } from 'react'

const syncDurationMs = 2500

export type SyncStatus = 'idle' | 'syncing'

export function useSyncStatus(): [SyncStatus, () => void] {
  const [status, setStatus] = useState<SyncStatus>('idle')
  const triggerSync = useCallback(() => {
    setStatus('syncing')
    const t = setTimeout(() => setStatus('idle'), syncDurationMs)
    return () => clearTimeout(t)
  }, [])
  return [status, triggerSync]
}
