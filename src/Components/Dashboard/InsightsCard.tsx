import React, { type JSX } from 'react'
import { ArrowUpRight, Zap } from 'lucide-react'
import type * as Types from '@app/Types/index.ts'

const iconMap: Record<string, Types.IconComponent> = {
  ArrowUpRight,
  Zap
}

export function QuickInsightsCard({ items }: Types.QuickInsightsCardProps): JSX.Element {
  return (
    <div className='quick-insights-card'>
      <h4 className='quick-insights-title'>Quick Insights</h4>
      <div className='quick-insights-grid'>
        {items.map((item, i) => {
          const Icon = iconMap[item.icon]
          return (
            <div key={`${item.label}-${item.symbol}-${i}`} className='quick-insight-tile'>
              {Icon != null
                ? (
                  <span className='quick-insight-tile-icon-wrap'>
                    <Icon size={16} aria-hidden />
                  </span>
                )
                : null}
              <p className='quick-insight-tile-label'>{item.label}</p>
              <p className='quick-insight-tile-symbol'>{item.symbol}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
