/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import React, { useMemo } from 'react'
import { LineChart, X } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import * as Utils from '@app/pages/utils/index.ts'
import type * as Types from '@app/pages/Types.ts'

export default function StockDetailModal({
  detail,
  loading,
  error,
  onClose
}: Types.StockDetailModalProps) {
  const chartData = detail?.ohlc?.map((ohlcRow: Types.StockDetailOhlcRow) => ({
    date: Utils.Format.formatDateInt(ohlcRow.date),
    close: ohlcRow.close ?? 0
  })) ?? []
  const yDomain = useMemo((): [number, number] | undefined => {
    if (chartData.length === 0) {
      return undefined
    }
    const closes = chartData
      .map((chartPoint: { date: string; close: number }) => chartPoint.close)
      .filter((closePrice: number) => closePrice > 0)
    if (closes.length === 0) {
      return undefined
    }
    const minClose = Math.min(...closes)
    const maxClose = Math.max(...closes)
    return [Math.max(minClose, 1), maxClose]
  }, [chartData])

  return (
    <div className='idx-modal-overlay' onClick={onClose} role='presentation'>
      <div
        className='idx-modal'
        onClick={(event) => event.stopPropagation()}
        role='dialog'
        aria-modal='true'
      >
        <div className='idx-modal-header'>
          <h2 className='idx-modal-title idx-modal-title-with-icon'>
            <LineChart size={22} aria-hidden />
            <span>{detail ? `${detail.code}: ${detail.name ?? ''}` : 'Detail Saham'}</span>
          </h2>
          <button
            type='button'
            className='idx-modal-close'
            onClick={onClose}
            aria-label='Tutup Modal'
          >
            <X size={20} />
          </button>
        </div>
        <div className='idx-modal-body'>
          {loading && <div className='idx-loading'>Memuat...</div>}
          {error && <div className='idx-error'>{error}</div>}
          {detail && !loading && (
            <>
              <div className='idx-detail-sections'>
                <section className='idx-detail-section'>
                  <h4 className='idx-detail-section-title'>Klasifikasi</h4>
                  <div className='idx-detail-grid'>
                    <div className='idx-detail-item idx-detail-item-full'>
                      <label>Sektor / Industri</label>
                      <span>{[detail.sector ?? '-', detail.industry ?? '-'].join(' / ')}</span>
                    </div>
                  </div>
                </section>
                <section className='idx-detail-section'>
                  <h4 className='idx-detail-section-title'>Valuasi</h4>
                  <div className='idx-detail-grid'>
                    <div className='idx-detail-item'>
                      <label>PER</label>
                      <span>{Utils.Format.formatNum(detail.per, 1)}</span>
                    </div>
                    <div className='idx-detail-item'>
                      <label>PBV</label>
                      <span>{Utils.Format.formatNum(detail.pbv, 1)}</span>
                    </div>
                  </div>
                </section>
                <section className='idx-detail-section'>
                  <h4 className='idx-detail-section-title'>Profitabilitas</h4>
                  <div className='idx-detail-grid'>
                    <div className='idx-detail-item'>
                      <label>ROE</label>
                      <span>{Utils.Format.formatNum(detail.roe, 1)}</span>
                    </div>
                    <div className='idx-detail-item'>
                      <label>ROA</label>
                      <span>{Utils.Format.formatNum(detail.roa, 1)}</span>
                    </div>
                  </div>
                </section>
                <section className='idx-detail-section'>
                  <h4 className='idx-detail-section-title'>Leverage</h4>
                  <div className='idx-detail-grid'>
                    <div className='idx-detail-item'>
                      <label>DER</label>
                      <span>{Utils.Format.formatNum(detail.der, 1)}</span>
                    </div>
                  </div>
                </section>
                <section className='idx-detail-section'>
                  <h4 className='idx-detail-section-title'>Likuiditas</h4>
                  <div className='idx-detail-grid'>
                    <div className='idx-detail-item'>
                      <label>Value</label>
                      <span>{Utils.Format.formatRp(detail.value)}</span>
                    </div>
                    <div className='idx-detail-item'>
                      <label>Volume</label>
                      <span>{Utils.Format.formatNum(detail.volume, 0)}</span>
                    </div>
                  </div>
                </section>
              </div>
              <div className='idx-detail-block'>
                <label className='idx-form-label'>Skor</label>
                <table className='idx-detail-table'>
                  <thead>
                    <tr>
                      <th>Value</th>
                      <th>Quality</th>
                      <th>Momentum</th>
                      <th>Composite</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{Utils.Format.formatNum(detail.valueScore, 3)}</td>
                      <td>{Utils.Format.formatNum(detail.qualityScore, 3)}</td>
                      <td>{Utils.Format.formatNum(detail.momentumScore, 3)}</td>
                      <td className='idx-detail-composite-cell'>
                        {Utils.Format.formatNum(detail.compositeScore, 3)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className='idx-detail-block'>
                <label className='idx-form-label'>Momentum</label>
                <table className='idx-detail-table'>
                  <thead>
                    <tr>
                      <th>4w</th>
                      <th>13w</th>
                      <th>26w</th>
                      <th>52w</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        className={detail.week4PC != null
                          ? detail.week4PC >= 0 ? 'idx-pct idx-pct-up' : 'idx-pct idx-pct-down'
                          : ''}
                      >
                        {Utils.Format.formatPct(detail.week4PC ?? null)}
                      </td>
                      <td
                        className={detail.week13PC != null
                          ? detail.week13PC >= 0 ? 'idx-pct idx-pct-up' : 'idx-pct idx-pct-down'
                          : ''}
                      >
                        {Utils.Format.formatPct(detail.week13PC ?? null)}
                      </td>
                      <td
                        className={detail.week26PC != null
                          ? detail.week26PC >= 0 ? 'idx-pct idx-pct-up' : 'idx-pct idx-pct-down'
                          : ''}
                      >
                        {Utils.Format.formatPct(detail.week26PC ?? null)}
                      </td>
                      <td
                        className={detail.week52PC != null
                          ? detail.week52PC >= 0 ? 'idx-pct idx-pct-up' : 'idx-pct idx-pct-down'
                          : ''}
                      >
                        {Utils.Format.formatPct(detail.week52PC ?? null)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {chartData.length > 0 && (
                <>
                  <label className='idx-form-label'>Pergerakan Harga (Close)</label>
                  <div className='idx-chart-container'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id='detailChartGrad' x1='0' y1='0' x2='0' y2='1'>
                            <stop offset='5%' stopColor='var(--idx-primary)' stopOpacity={0.2} />
                            <stop offset='95%' stopColor='var(--idx-primary)' stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey='date'
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'var(--idx-text-muted)', fontSize: 10 }}
                        />
                        <YAxis
                          orientation='right'
                          scale={yDomain ? 'log' : 'linear'}
                          {...(yDomain !== undefined && { domain: yDomain })}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'var(--idx-text-muted)', fontSize: 10 }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: 'var(--idx-deep)',
                            color: 'white',
                            borderRadius: 12,
                            fontSize: 12
                          }}
                        />
                        <Area
                          type='monotone'
                          dataKey='close'
                          stroke='var(--idx-primary)'
                          strokeWidth={2}
                          fill='url(#detailChartGrad)'
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
