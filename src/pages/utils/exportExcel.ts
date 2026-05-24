/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import * as XLSX from 'xlsx'
import type * as Types from '@app/pages/Types.ts'

function toNum(v: number | null | undefined): number | string {
  if (v == null || !Number.isFinite(v)) {
    return '-'
  }
  return v
}

function round(v: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(v * factor) / factor
}

export function exportCandidatesToExcel(rows: Types.CandidateTableRow[], dateInt: number): void {
  const dateStr = String(dateInt).padStart(8, '0')
  const fileDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`

  const headers = [
    'No',
    'Kode',
    'Nama Emiten',
    'Sektor',
    'PER',
    'ROE (%)',
    'DER',
    'Return 26w (%)',
    'Return 52w (%)',
    'Value Score',
    'Quality Score',
    'Momentum Score',
    'Composite (%)',
    'Trading Value (Rp)',
    'Notasi',
    'Corp Action',
    'UMA'
  ]

  const dataRows = rows.map((row, idx) => [
    idx + 1,
    row.code,
    row.name ?? '',
    row.sector ?? '',
    toNum(row.per),
    toNum(row.roe),
    toNum(row.der),
    toNum(row.week26PC),
    toNum(row.week52PC),
    round(row.valueScore, 4),
    round(row.qualityScore, 4),
    round(row.momentumScore, 4),
    round(row.compositePercentile, 2),
    toNum(row.value),
    row.hasNotation ? 'Ya' : 'Tidak',
    row.hasCorpAction ? 'Ya' : 'Tidak',
    row.hasUma ? 'Ya' : 'Tidak'
  ])

  const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows])

  ws['!cols'] = [
    { wch: 5 },
    { wch: 8 },
    { wch: 32 },
    { wch: 22 },
    { wch: 8 },
    { wch: 10 },
    { wch: 8 },
    { wch: 16 },
    { wch: 16 },
    { wch: 13 },
    { wch: 15 },
    { wch: 17 },
    { wch: 14 },
    { wch: 22 },
    { wch: 8 },
    { wch: 12 },
    { wch: 8 }
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'IDX Screener')
  XLSX.writeFile(wb, `idx-screener-${fileDate}.xlsx`)
}
