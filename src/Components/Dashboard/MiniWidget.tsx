import React, { type JSX } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import type * as Types from '@app/Types/index.ts'
import { Line, LineChart, ResponsiveContainer } from 'recharts'

const defaultChartData = [
  { v: 10 },
  { v: 15 },
  { v: 8 },
  { v: 12 },
  { v: 20 },
  { v: 18 },
  {
    v: 25
  }
]

export function MiniWidget({
  title,
  value,
  change,
  isUp,
  chartData = defaultChartData
}: Types.MiniWidgetProps): JSX.Element {
  const strokeColor = isUp ? '#22c55e' : '#ef4444'
  return (
    <div className='mini-widget'>
      <div>
        <p className='mini-widget-label'>{title}</p>
        <h4 className='mini-widget-value'>{value}</h4>
        <div className={`mini-widget-change ${isUp ? 'is-up' : 'is-down'}`}>
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </div>
      </div>
      <div className='mini-widget-chart'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={chartData}>
            <Line type='monotone' dataKey='v' stroke={strokeColor} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
