import React from 'react'
import type { JSX } from 'react'
import { Activity } from 'lucide-react'
import { PlaceholderPanel } from '@app/Components/Placeholder/Panel.tsx'

export function Logs(): JSX.Element {
  return (
    <PlaceholderPanel
      icon={Activity}
      title='Advanced Log System'
      description='Monitoring retry mechanism secara real-time untuk memastikan data tidak bocor.'
    />
  )
}
