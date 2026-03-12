/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import React from 'react'
import { BarChart3, RefreshCw } from 'lucide-react'
import * as Utils from '@app/pages/utils/index.ts'
import type * as Types from '@app/pages/Types.ts'

export default function DashboardHeader({
  totalCount,
  date,
  onRefresh,
  loading
}: Types.DashboardHeaderProps) {
  return (
    <div className='idx-dashboard-header'>
      <div>
        <h1 className='idx-dashboard-title'>
          <BarChart3 size={28} strokeWidth={2} aria-hidden />
          <span>Screener Saham</span>
        </h1>
        <p className='idx-dashboard-subtitle'>
          Filter Berdasarkan Skor Gabungan: <strong>Valuasi, Kualitas, dan Momentum</strong>
        </p>
      </div>
      <div className='idx-header-stats'>
        <div className='idx-header-stat'>
          <span className='idx-header-stat-label'>Data Kandidat</span>
          <span className='idx-header-stat-value'>{totalCount.toLocaleString('id-ID')}</span>
        </div>
        <div className='idx-header-stat-sep' aria-hidden='true' />
        <div className='idx-header-stat'>
          <span className='idx-header-stat-label'>Tanggal Data</span>
          <span className='idx-header-stat-value'>
            {date ? Utils.Format.formatDateInt(date) : '-'}
          </span>
        </div>
        <button
          type='button'
          className={`idx-btn idx-header-refresh ${loading ? 'is-loading' : ''}`}
          onClick={onRefresh}
          disabled={loading}
          title='Muat Ulang Data'
          aria-label='Muat Ulang Data'
        >
          <RefreshCw size={18} />
        </button>
      </div>
    </div>
  )
}
