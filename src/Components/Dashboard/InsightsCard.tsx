import React from 'react'
import type { JSX } from 'react'
import { ArrowUpRight, Zap } from 'lucide-react'
import type { QuickInsightItem } from '@app/Types/index.ts'

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  ArrowUpRight,
  Zap
}

export function QuickInsightsCard({ items }: { items: QuickInsightItem[] }): JSX.Element {
  return (
    <div className='quick-insights-card'>
      <h4 className='quick-insights-title'>Quick Insights</h4>
      <div className='quick-insights-grid'>
        {items.map((item) => {
          const Icon = iconMap[item.icon]
          return (
            <div key={item.label} className='quick-insight-tile'>
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
