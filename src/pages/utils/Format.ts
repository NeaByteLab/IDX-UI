/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

export default class Format {
  static formatDateInt(dateInt: number): string {
    if (!Number.isFinite(dateInt)) {
      return '-'
    }
    const dateStr = String(dateInt)
    if (dateStr.length !== 8) {
      return dateStr
    }
    return `${dateStr.slice(6, 8)}/${dateStr.slice(4, 6)}/${dateStr.slice(0, 4)}`
  }

  static formatPct(numericValue: number | null | undefined): string {
    if (numericValue == null || !Number.isFinite(numericValue)) {
      return '-'
    }
    return `${numericValue >= 0 ? '+' : ''}${numericValue.toFixed(2)}%`
  }

  static formatNum(numericValue: number | null | undefined, decimals = 2): string {
    if (numericValue == null || !Number.isFinite(numericValue)) {
      return '-'
    }
    return numericValue.toLocaleString('id-ID', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  }

  static formatTitleCase(s: string): string {
    if (!s || typeof s !== 'string') {
      return s
    }
    return s.replace(/\b\w/g, (c) => c.toUpperCase())
  }

  static formatRp(numericValue: number | null | undefined): string {
    if (numericValue == null || !Number.isFinite(numericValue)) {
      return '-'
    }
    if (numericValue >= 1e12) {
      return `${(numericValue / 1e12).toFixed(2)}T`
    }
    if (numericValue >= 1e9) {
      return `${(numericValue / 1e9).toFixed(2)}B`
    }
    if (numericValue >= 1e6) {
      return `${(numericValue / 1e6).toFixed(2)}M`
    }
    return numericValue.toLocaleString('id-ID')
  }

  static getTodayDateInt(): number {
    const now = new Date()
    return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()
  }

  static addDaysToDateInt(dateInt: number, deltaDays: number): number {
    const year = Math.floor(dateInt / 10000)
    const month = Math.floor((dateInt % 10000) / 100) - 1
    const day = dateInt % 100
    const date = new Date(year, month, day)
    date.setDate(date.getDate() + deltaDays)
    const yearStr = String(date.getFullYear())
    const monthStr = String(date.getMonth() + 1).padStart(2, '0')
    const dayStr = String(date.getDate()).padStart(2, '0')
    return parseInt(`${yearStr}${monthStr}${dayStr}`, 10)
  }
}
