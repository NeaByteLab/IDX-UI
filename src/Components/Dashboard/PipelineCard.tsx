import React, { type JSX } from 'react'
import type * as Types from '@app/Types/index.ts'

export function PipelineHealthCard({
  items,
  onConfig
}: Types.PipelineHealthCardProps): JSX.Element {
  return (
    <div className='dashboard-card'>
      <h3 className='pipeline-card-title'>Pipeline Health</h3>
      <div className='pipeline-list'>
        {items.map((item, i) => (
          <div key={i} className='pipeline-item'>
            <span className='pipeline-item-label'>{item.label}</span>
            <div className='pipeline-item-right'>
              <span className='pipeline-item-value'>{item.val}</span>
              <span
                className={`pipeline-item-dot ${item.status === 'success' ? 'success' : 'warning'}`}
                aria-hidden
              />
            </div>
          </div>
        ))}
      </div>
      <button type='button' className='pipeline-config-btn' onClick={onConfig}>
        System Configuration
      </button>
    </div>
  )
}
