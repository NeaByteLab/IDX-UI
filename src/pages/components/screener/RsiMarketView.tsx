/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import React, { useMemo } from 'react'
import { Activity } from 'lucide-react'
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { sectorPalette } from '@app/pages/components/screener/SectorStrength.tsx'
import * as Utils from '@app/pages/utils/index.ts'
import type * as Types from '@app/pages/Types.ts'

function sectorAvgRsi(items: Types.ScreenerRsiItem[]): number | null {
  const valid = items.filter((x) => x.rsi != null && Number.isFinite(x.rsi)) as { rsi: number }[]
  if (valid.length === 0) {
    return null
  }
  const sum = valid.reduce((a, x) => a + x.rsi, 0)
  return sum / valid.length
}

export default function RsiMarketView({
  data,
  loading,
  error,
  onRefetch
}: Types.RsiMarketViewProps) {
  const chartData = useMemo(() => {
    if (!data?.data?.bySector) {
      return []
    }
    const entries = Object.entries(data.data.bySector)
      .filter(([, items]) => items.length > 0)
      .map(([sector, items]) => {
        const avg = sectorAvgRsi(items)
        const withRsi = items.filter((x) => x.rsi != null).length
        return {
          sector: sector || '(Tanpa sektor)',
          count: items.length,
          withRsi,
          avg: avg ?? 0,
          avgLabel: avg != null ? Utils.Format.formatNum(avg, 1) : '-'
        }
      })
    return entries.sort((a, b) => b.avg - a.avg)
  }, [data])

  if (loading) {
    return (
      <div className='idx-card idx-card-center'>
        <p className='idx-p-muted'>Memuat RSI market...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className='idx-error idx-mt-16'>
        {error}
        <button type='button' className='idx-btn idx-mt-8' onClick={onRefetch}>
          Coba lagi
        </button>
      </div>
    )
  }
  if (!data) {
    return null
  }

  return (
    <div className='idx-card idx-px-24 idx-py-16'>
      <div className='idx-card-header'>
        <h3 className='idx-card-title idx-card-title-with-icon'>
          <Activity size={20} aria-hidden />
          <span>Relative Strength (Per Sektor)</span>
        </h3>
      </div>
      {chartData.length === 0
        ? <p className='idx-p-muted'>Tidak ada data RSI.</p>
        : (
          <div className='idx-rsi-chart-wrap'>
            <ResponsiveContainer width='100%' height={Math.max(360, chartData.length * 36)}>
              <BarChart
                data={chartData}
                layout='vertical'
                margin={{ top: 12, right: 16, bottom: 24, left: 4 }}
                barCategoryGap={8}
                barGap={2}
              >
                <XAxis
                  type='number'
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--idx-text-muted)', fontSize: 12 }}
                  ticks={[0, 25, 50, 75, 100]}
                />
                <YAxis
                  type='category'
                  dataKey='sector'
                  width={180}
                  tick={{ fill: 'var(--idx-text-muted)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => (val.length > 18 ? `${val.slice(0, 16)}…` : val)}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) {
                      return null
                    }
                    const p = payload[0]?.payload
                    if (!p) {
                      return null
                    }
                    return (
                      <div className='idx-foreign-tooltip'>
                        <div className='idx-foreign-tooltip-label'>
                          {Utils.Format.formatTitleCase(p.sector)}
                        </div>
                        <div>
                          {Utils.Format.formatTitleCase('RSI (rata)')}: {p.avgLabel}
                        </div>
                        <div>
                          {Utils.Format.formatTitleCase('Emiten')}: {p.withRsi}/{p.count}
                        </div>
                      </div>
                    )
                  }}
                />
                <Bar dataKey='avg' fill='var(--idx-text-muted)' isAnimationActive={false}>
                  {chartData.map((row, index) => (
                    <Cell
                      key={row.sector}
                      fill={sectorPalette[index % sectorPalette.length] ?? '#999'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
    </div>
  )
}
