const defaultBaseUrl = 'http://localhost:52060'

export function getApiBaseUrl(): string {
  const meta = import.meta as { env?: { VITE_IDX_API_BASE?: string } }
  const base = meta.env?.VITE_IDX_API_BASE
  if (typeof base === 'string' && base.trim() !== '') {
    return base.replace(/\/$/, '')
  }
  return defaultBaseUrl
}
