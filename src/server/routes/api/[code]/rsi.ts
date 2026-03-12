/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import type { Context } from '@neabyte/deserve'
import { and, asc, eq, gte, inArray, lte } from 'drizzle-orm'
import Database from '@app/server/Database.ts'
import Utils from '@app/server/Utils.ts'
import RSI from '@app/server/RSI.ts'
import * as Schemas from '@app/server/schemas/index.ts'
import type * as Types from '@app/server/Types.ts'

function buildRsiSeries(rowsWithClose: Types.DateCloseRow[], period: number): Types.RsiSeriesRow[] {
  const closes = rowsWithClose.map((r) => r.close)
  if (closes.length < period + 1) {
    return []
  }
  const rsiValues = RSI.calculate(closes, period)
  const out: Types.RsiSeriesRow[] = []
  for (let i = period; i < rowsWithClose.length; i++) {
    const row = rowsWithClose[i]
    const rsi = rsiValues[i]
    if (row == null) {
      continue
    }
    out.push({
      date: row.date,
      rsi: rsi != null && Number.isFinite(rsi) ? rsi : null
    })
  }
  return out
}

export async function GET(ctx: Context) {
  const code = ctx.param('code')
  if (!code || code.trim() === '') {
    return ctx.send.json({ error: 'Missing or invalid code' }, { status: 400 })
  }
  const start = Utils.parseDate(Utils.queryString(ctx.query('start')))
  const end = Utils.parseDate(Utils.queryString(ctx.query('end')))
  if (start === null || end === null) {
    return ctx.send.json({ error: 'start and end required (yyyymmdd, 8 digits)' }, { status: 400 })
  }
  if (end < start) {
    return ctx.send.json({ error: 'end must be >= start' }, { status: 400 })
  }
  const period = RSI.defaultPeriod
  const stockCode = code.trim().toUpperCase()
  const stockSummaryRows = await Database.select({
    date: Schemas.summary.date,
    priceClose: Schemas.summary.priceClose
  })
    .from(Schemas.summary)
    .where(
      and(
        eq(Schemas.summary.stockCode, stockCode),
        gte(Schemas.summary.date, start),
        lte(Schemas.summary.date, end)
      )
    )
    .orderBy(asc(Schemas.summary.date))
  const rowsWithClose: Types.DateCloseRow[] = []
  for (const row of stockSummaryRows) {
    const c = row.priceClose != null && Number.isFinite(Number(row.priceClose))
      ? Number(row.priceClose)
      : null
    if (c !== null) {
      rowsWithClose.push({ date: Number(row.date), close: c })
    }
  }
  const data = buildRsiSeries(rowsWithClose, period)
  let sector: string | null = null
  let sectorData: Types.RsiSeriesRow[] = []
  const screenerRow = await Database.select({ sector: Schemas.screener.sector })
    .from(Schemas.screener)
    .where(eq(Schemas.screener.code, stockCode))
    .limit(1)
  const sectorName = screenerRow[0]?.sector ?? null
  if (sectorName != null && String(sectorName).trim() !== '') {
    sector = String(sectorName).trim()
    const sectorCodesRows = await Database.select({ code: Schemas.screener.code })
      .from(Schemas.screener)
      .where(eq(Schemas.screener.sector, sector))
    const sectorCodes = sectorCodesRows.map((r) => String(r.code).trim().toUpperCase())
    if (sectorCodes.length > 0) {
      const sectorSummaryRows = await Database.select({
        date: Schemas.summary.date,
        stockCode: Schemas.summary.stockCode,
        priceClose: Schemas.summary.priceClose
      })
        .from(Schemas.summary)
        .where(
          and(
            inArray(Schemas.summary.stockCode, sectorCodes),
            gte(Schemas.summary.date, start),
            lte(Schemas.summary.date, end)
          )
        )
        .orderBy(asc(Schemas.summary.stockCode), asc(Schemas.summary.date))
      const byCode = new Map<string, Types.DateCloseRow[]>()
      for (const row of sectorSummaryRows) {
        const c = row.priceClose != null && Number.isFinite(Number(row.priceClose))
          ? Number(row.priceClose)
          : null
        if (c === null) {
          continue
        }
        const sc = String(row.stockCode).trim().toUpperCase()
        const list = byCode.get(sc) ?? []
        list.push({ date: Number(row.date), close: c })
        byCode.set(sc, list)
      }
      const rsiByDate = new Map<number, number[]>()
      for (const [, series] of byCode.entries()) {
        const sorted = [...series].sort((a, b) => a.date - b.date)
        const rsiSeries = buildRsiSeries(sorted, period)
        for (const point of rsiSeries) {
          if (point.rsi != null && Number.isFinite(point.rsi)) {
            const arr = rsiByDate.get(point.date) ?? []
            arr.push(point.rsi)
            rsiByDate.set(point.date, arr)
          }
        }
      }
      const dates = Array.from(rsiByDate.keys()).sort((a, b) => a - b)
      sectorData = dates.map((date) => {
        const values = rsiByDate.get(date) ?? []
        const sum = values.reduce((a, b) => a + b, 0)
        const avg = values.length > 0 ? sum / values.length : null
        return { date, rsi: avg }
      })
    }
  }
  const response: Types.RsiApiResponse = {
    code: stockCode,
    start,
    end,
    period,
    data,
    sector,
    sectorData
  }
  return ctx.send.json(response)
}
