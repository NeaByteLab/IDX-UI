/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import React from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import * as Utils from '@app/pages/utils/index.ts'
import type * as Types from '@app/pages/Types.ts'

const columnCount = 9

export default function CandidatesTable({
  data,
  limit,
  offset,
  totalCount,
  totalCountLabel,
  onPage,
  onRowClick,
  searchValue = '',
  onSearchChange,
  loading = false,
  error = null,
  emptyMessage
}: Types.CandidatesTableProps) {
  const fromRow = totalCount === 0 ? 0 : offset + 1
  const toRow = Math.min(offset + data.length, offset + totalCount)
  const hasPrevPage = offset > 0
  const hasNextPage = !totalCountLabel && offset + limit < totalCount
  const showEmptyRow = data.length === 0 && !loading && !error
  const showLoadingRow = data.length === 0 && loading
  const showErrorRow = error != null && error !== ''

  const handleRowKeyDown = (code: string, event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onRowClick(code)
    }
  }

  return (
    <div className='idx-card'>
      {onSearchChange && (
        <div className='idx-table-search'>
          <Search size={18} className='idx-table-search-icon' aria-hidden />
          <input
            type='search'
            className='idx-table-search-input'
            placeholder='Cari Kode, Nama Emiten, Atau Sektor...'
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label='Cari Kode, Nama Emiten, Atau Sektor'
          />
        </div>
      )}
      <div className='idx-table-wrap'>
        <table className='idx-table'>
          <thead>
            <tr>
              <th className='idx-table-col-kode'>Kode</th>
              <th className='idx-table-col-nama'>Nama Emiten</th>
              <th className='idx-table-col-sector'>Sektor</th>
              <th className='idx-table-th-right'>PER</th>
              <th className='idx-table-th-right'>ROE</th>
              <th className='idx-table-th-right'>DER</th>
              <th className='idx-table-th-right'>26w (%)</th>
              <th className='idx-table-th-right'>52w (%)</th>
              <th className='idx-table-th-right'>Comp (%)</th>
            </tr>
          </thead>
          <tbody>
            {showErrorRow && (
              <tr className='idx-table-message-row'>
                <td colSpan={columnCount} className='idx-table-empty-cell idx-table-error-cell'>
                  {error}
                </td>
              </tr>
            )}
            {showLoadingRow && (
              <tr className='idx-table-message-row'>
                <td colSpan={columnCount} className='idx-table-empty-cell'>
                  Memuat kandidat...
                </td>
              </tr>
            )}
            {showEmptyRow && emptyMessage != null && (
              <tr className='idx-table-message-row'>
                <td colSpan={columnCount} className='idx-table-empty-cell'>
                  {emptyMessage}
                </td>
              </tr>
            )}
            {!showErrorRow &&
              !showLoadingRow &&
              !showEmptyRow &&
              data.map((candidateRow) => (
                <tr
                  key={candidateRow.code}
                  tabIndex={0}
                  role='button'
                  onClick={() => onRowClick(candidateRow.code)}
                  onKeyDown={(event) => handleRowKeyDown(candidateRow.code, event)}
                  aria-label={`Buka detail ${candidateRow.code} ${candidateRow.name ?? ''}`}
                >
                  <td className='idx-table-col-kode'>
                    <span className='idx-table-code-bold'>{candidateRow.code}</span>
                  </td>
                  <td className='idx-table-col-nama'>{candidateRow.name ?? '-'}</td>
                  <td className='idx-table-col-sector'>{candidateRow.sector ?? '-'}</td>
                  <td className='idx-table-td-right'>
                    {Utils.Format.formatNum(candidateRow.per, 1)}
                  </td>
                  <td className='idx-table-td-right'>
                    {Utils.Format.formatNum(candidateRow.roe, 1)}
                  </td>
                  <td className='idx-table-td-right'>
                    {Utils.Format.formatNum(candidateRow.der, 1)}
                  </td>
                  <td className='idx-table-td-right'>
                    <span
                      className={candidateRow.week26PC != null
                        ? candidateRow.week26PC >= 0 ? 'idx-pct idx-pct-up' : 'idx-pct idx-pct-down'
                        : ''}
                    >
                      {Utils.Format.formatPct(candidateRow.week26PC ?? null)}
                    </span>
                  </td>
                  <td className='idx-table-td-right'>
                    <span
                      className={candidateRow.week52PC != null
                        ? candidateRow.week52PC >= 0 ? 'idx-pct idx-pct-up' : 'idx-pct idx-pct-down'
                        : ''}
                    >
                      {Utils.Format.formatPct(candidateRow.week52PC ?? null)}
                    </span>
                  </td>
                  <td className='idx-table-td-right'>
                    {Utils.Format.formatNum(candidateRow.compositePercentile, 0)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className='idx-pagination'>
        <span className='idx-pagination-info'>
          {totalCount === 0
            ? 'Tidak Ada Data'
            : `Baris ${fromRow}-${toRow} Dari ${totalCount.toLocaleString('id-ID')}`}
          {totalCountLabel != null && ` (${totalCountLabel})`}
        </span>
        <div className='idx-pagination-actions'>
          <button
            type='button'
            className='idx-btn'
            onClick={() => onPage(Math.max(0, offset - limit))}
            disabled={!hasPrevPage}
            aria-label='Halaman Sebelumnya'
          >
            <ChevronLeft size={16} aria-hidden />
            <span>Sebelumnya</span>
          </button>
          <button
            type='button'
            className='idx-btn'
            onClick={() => onPage(offset + limit)}
            disabled={!hasNextPage}
            aria-label='Halaman Berikutnya'
          >
            <span>Selanjutnya</span>
            <ChevronRight size={16} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}
