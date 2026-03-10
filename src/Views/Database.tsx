import React, { type JSX } from 'react'
import { Database as DatabaseIcon } from 'lucide-react'
import * as Components from '@app/Components/index.ts'

export function Database(): JSX.Element {
  return (
    <Components.PlaceholderPanel
      icon={DatabaseIcon}
      title='Database Explorer'
      description='Jelajahi tabel dan data yang tersinkronisasi dari IDX API.'
    />
  )
}
