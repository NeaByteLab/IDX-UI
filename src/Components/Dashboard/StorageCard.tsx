import React from 'react'
import type { JSX } from 'react'
import { Database, Server } from 'lucide-react'

export function StorageHealthCard({
  value,
  percent,
  description = 'Current database payload across 12 synchronized tables.'
}: {
  value: string
  percent: number
  description?: string
}): JSX.Element {
  return (
    <div className='storage-card'>
      <div className='storage-card-inner'>
        <div className='storage-card-header'>
          <div className='storage-card-icon-wrap'>
            <Database size={24} aria-hidden />
          </div>
          <div className='storage-card-meta'>
            <p className='storage-card-engine'>SQLite Engine</p>
            <p className='storage-card-orm'>Drizzle ORM</p>
          </div>
        </div>
        <h4 className='storage-card-value'>{value}</h4>
        <p className='storage-card-desc'>{description}</p>
        <div className='storage-card-bar-wrap'>
          <span>STORAGE CAPACITY</span>
          <span>{percent}%</span>
        </div>
        <div className='storage-card-bar'>
          <div
            className='storage-card-bar-fill'
            style={{ ['--storage-bar-width' as string]: `${percent}%` }}
          />
        </div>
      </div>
      <Server size={140} className='storage-card-bg-icon' aria-hidden />
    </div>
  )
}
