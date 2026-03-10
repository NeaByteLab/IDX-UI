import React, { type JSX } from 'react'
import { RefreshCw } from 'lucide-react'
import * as Components from '@app/Components/index.ts'

export function Sync(): JSX.Element {
  return (
    <Components.PlaceholderPanel
      icon={RefreshCw}
      title='Sync Manager Interface'
      description='Halaman untuk konfigurasi otomasi pipeline dan trigger manual sync IDX API.'
      spin
    />
  )
}
