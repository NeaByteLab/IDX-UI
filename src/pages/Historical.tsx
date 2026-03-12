/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import React, { useMemo, useState } from 'react'
import { History } from 'lucide-react'
import * as Hooks from '@app/pages/hooks/index.ts'
import * as Utils from '@app/pages/utils/index.ts'
import type * as Types from '@app/pages/Types.ts'

export default function Historical() {
  const presets: { days: number; label: string }[] = [
    { days: 7, label: '1W' },
    { days: 14, label: '2W' },
    { days: 30, label: '1M' },
    { days: 90, label: '3M' },
    { days: 180, label: '6M' },
    { days: 365, label: '12M' }
  ]
  const [periodDays, setPeriodDays] = useState<number>(30)
  const todayInt = useMemo(() => Utils.Format.getTodayDateInt(), [])
  const end = todayInt
  const start = Utils.Format.addDaysToDateInt(end, -periodDays + 1)
  const { data, loading, error } = Hooks.useBidOfferHistory(start, end)
  const sectorRows: Types.HistoryBidOfferSectorItem[] = useMemo(() => {
    if (!data?.bySector?.length) {
      return []
    }
    return data.bySector
  }, [data])

  return (
    <div className='idx-main'>
      <section className='idx-card idx-px-24 idx-py-16 idx-historical-card'>
        <div className='idx-dashboard-header idx-mb-0'>
          <div>
            <h2 className='idx-dashboard-title'>
              <History size={28} strokeWidth={2} aria-hidden />
              <span>Historical Bid vs Offer</span>
            </h2>
            <p className='idx-dashboard-subtitle'>
              Period: {Utils.Format.formatDateInt(start)} &ndash; {Utils.Format.formatDateInt(end)}
            </p>
          </div>
          <div className='idx-tabs'>
            {presets.map((preset) => (
              <button
                key={preset.days}
                type='button'
                className={`idx-tab idx-tab-inline ${
                  periodDays === preset.days ? 'idx-tab-active' : ''
                }`}
                onClick={() => setPeriodDays(preset.days)}
              >
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
        {loading && <div className='idx-loading'>Loading historical bid/offer...</div>}
        {!loading && error && <div className='idx-error'>{error}</div>}
        {!loading && !error && sectorRows.length === 0 && (
          <div className='idx-card-center'>
            <p className='idx-p-muted'>No historical bid/offer data for this period.</p>
          </div>
        )}
        {!loading && !error && sectorRows.length > 0 && (
          <div className='idx-table-wrap idx-historical-table-wrap'>
            <table className='idx-detail-table idx-historical-table'>
              <thead>
                <tr>
                  <th>Sektor</th>
                  <th>Total Bid</th>
                  <th>Total Offer</th>
                  <th>Hari</th>
                  <th>Avg Bid/Hari</th>
                  <th>Avg Offer/Hari</th>
                  <th>Bid/Offer</th>
                </tr>
              </thead>
              <tbody>
                {sectorRows.map((sectorItem) => (
                  <tr key={sectorItem.sector}>
                    <td>{sectorItem.sector}</td>
                    <td>{Utils.Format.formatNum(sectorItem.totalBid, 0)}</td>
                    <td>{Utils.Format.formatNum(sectorItem.totalOffer, 0)}</td>
                    <td>{sectorItem.dayCount}</td>
                    <td>{Utils.Format.formatNum(sectorItem.avgBid, 0)}</td>
                    <td>{Utils.Format.formatNum(sectorItem.avgOffer, 0)}</td>
                    <td className='idx-ratio-cell'>
                      {sectorItem.totalBid + sectorItem.totalOffer > 0
                        ? (
                          <span
                            className='idx-ratio-inline'
                            title={`Bid ${Utils.Format.formatNum(sectorItem.ratio, 2)}× Offer`}
                          >
                            <span className='idx-ratio-bar' aria-hidden>
                              <span
                                className='idx-ratio-bar-offer'
                                style={{
                                  width: `${
                                    (sectorItem.totalOffer /
                                      (sectorItem.totalBid + sectorItem.totalOffer)) * 100
                                  }%`
                                }}
                              />
                              <span
                                className='idx-ratio-bar-bid'
                                style={{
                                  width: `${
                                    (sectorItem.totalBid /
                                      (sectorItem.totalBid + sectorItem.totalOffer)) * 100
                                  }%`
                                }}
                              />
                            </span>
                            <span className='idx-ratio-value'>
                              {sectorItem.ratio != null
                                ? Utils.Format.formatNum(sectorItem.ratio, 2)
                                : '-'}
                            </span>
                          </span>
                        )
                        : (
                          '-'
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
