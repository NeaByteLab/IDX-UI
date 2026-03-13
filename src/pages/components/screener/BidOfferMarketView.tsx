/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import React, { useMemo } from 'react'
import { BarChart2 } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import * as Utils from '@app/pages/utils/index.ts'
import type * as Types from '@app/pages/Types.ts'

export default function BidOfferMarketView({
  data,
  loading,
  error,
  onRefetch
}: Types.BidOfferMarketViewProps) {
  const chartData = useMemo(() => {
    if (!data?.data?.length) {
      return []
    }
    return [...data.data].sort(
      (a, b) => b.bidVolume + b.offerVolume - (a.bidVolume + a.offerVolume)
    )
  }, [data])

  if (loading) {
    return (
      <div className='idx-card idx-card-center'>
        <p className='idx-p-muted'>Memuat bid/offer market...</p>
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
          <BarChart2 size={20} aria-hidden />
          <span>Bid vs Offer (Per Sektor)</span>
        </h3>
      </div>
      {chartData.length === 0
        ? <p className='idx-p-muted'>Tidak ada data bid/offer.</p>
        : (
          <div className='idx-rsi-chart-wrap'>
            <ResponsiveContainer width='100%' height={Math.max(360, chartData.length * 36)}>
              <BarChart
                data={chartData}
                layout='vertical'
                margin={{ top: 12, right: 16, bottom: 24, left: 4 }}
                barCategoryGap={8}
                barGap={4}
              >
                <XAxis
                  type='number'
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--idx-text-muted)', fontSize: 12 }}
                  tickFormatter={(v) => Utils.Format.formatNum(v, 0)}
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
                    const p = payload[0]?.payload as Types.ScreenerBidOfferItem | undefined
                    if (!p) {
                      return null
                    }
                    return (
                      <div className='idx-foreign-tooltip'>
                        <div className='idx-foreign-tooltip-label'>
                          {Utils.Format.formatTitleCase(p.sector)}
                        </div>
                        <div>
                          {Utils.Format.formatTitleCase('Bid')}:{' '}
                          {Utils.Format.formatNum(p.bidVolume, 0)}
                        </div>
                        <div>
                          {Utils.Format.formatTitleCase('Offer')}:{' '}
                          {Utils.Format.formatNum(p.offerVolume, 0)}
                        </div>
                        <div>
                          {Utils.Format.formatTitleCase('Emiten')}: {p.count}
                        </div>
                      </div>
                    )
                  }}
                />
                <Bar dataKey='bidVolume' name='Bid' fill='#047857' isAnimationActive={false} />
                <Bar
                  dataKey='offerVolume'
                  name='Offer'
                  fill='var(--idx-down)'
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
    </div>
  )
}
