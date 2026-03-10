import React from 'react'
import type { JSX } from 'react'
import { Database as DatabaseIcon } from 'lucide-react'
import { PlaceholderPanel } from '@app/Components/Placeholder/Panel.tsx'

export function Database(): JSX.Element {
  return (
    <PlaceholderPanel
      icon={DatabaseIcon}
      title='Database Explorer'
      description='Jelajahi tabel dan data yang tersinkronisasi dari IDX API.'
    />
  )
}
