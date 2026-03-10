import React from 'react'
import type { JSX } from 'react'
import { RefreshCw } from 'lucide-react'
import { PlaceholderPanel } from '@app/Components/Placeholder/Panel.tsx'

export function Sync(): JSX.Element {
  return (
    <PlaceholderPanel
      icon={RefreshCw}
      title='Sync Manager Interface'
      description='Halaman untuk konfigurasi otomasi pipeline dan trigger manual sync IDX API.'
      spin
    />
  )
}
