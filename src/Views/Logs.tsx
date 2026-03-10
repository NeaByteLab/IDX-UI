import React, { type JSX } from 'react'
import { Activity } from 'lucide-react'
import * as Components from '@app/Components/index.ts'

export function Logs(): JSX.Element {
  return (
    <Components.PlaceholderPanel
      icon={Activity}
      title='Advanced Log System'
      description='Monitoring retry mechanism secara real-time untuk memastikan data tidak bocor.'
    />
  )
}
