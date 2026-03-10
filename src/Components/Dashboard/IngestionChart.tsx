import React, { type JSX } from 'react'
import type * as Types from '@app/Types/index.ts'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

export function DataIngestionChart({ data }: Types.DataIngestionChartProps): JSX.Element {
  return (
    <div className='ingestion-chart-wrap'>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart data={data}>
          <defs>
            <linearGradient id='colorValue' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#DC2626' stopOpacity={0.1} />
              <stop offset='95%' stopColor='#DC2626' stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f0f0f0' />
          <XAxis
            dataKey='name'
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 10 }}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
          <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', fontSize: '11px' }} />
          <Area
            type='monotone'
            dataKey='value'
            stroke='#DC2626'
            strokeWidth={3}
            fillOpacity={1}
            fill='url(#colorValue)'
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
