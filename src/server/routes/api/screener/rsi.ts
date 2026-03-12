/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import type { Context } from '@neabyte/deserve'
import { and, asc, desc, gte, lte } from 'drizzle-orm'
import Database from '@app/server/Database.ts'
import Utils from '@app/server/Utils.ts'
import RSI from '@app/server/RSI.ts'
import * as Schemas from '@app/server/schemas/index.ts'
import * as Services from '@app/server/services/index.ts'
import type * as Types from '@app/server/Types.ts'

export async function GET(ctx: Context) {
  const dateParsed = Utils.parseDate(Utils.queryString(ctx.query('date')))
  const periodRaw = Utils.parseNumber(Utils.queryString(ctx.query('period')))
  const period = periodRaw != null && periodRaw >= 1 && periodRaw <= 100
    ? periodRaw
    : RSI.defaultPeriod
  let dateRef = dateParsed ?? Services.CronDate.todayDateInt()
  const latestRows = await Database.select({ date: Schemas.summary.date })
    .from(Schemas.summary)
    .orderBy(desc(Schemas.summary.date))
    .limit(1)
  const latestDate = latestRows[0]?.date
  if (latestDate != null && Number.isFinite(latestDate)) {
    const maxDate = Number(latestDate)
    if (dateRef > maxDate) {
      dateRef = maxDate
    }
  }
  const dateStart = Utils.addDaysToDateInt(dateRef, -60)
  const summaryRows = await Database.select({
    stockCode: Schemas.summary.stockCode,
    date: Schemas.summary.date,
    priceClose: Schemas.summary.priceClose
  })
    .from(Schemas.summary)
    .where(and(gte(Schemas.summary.date, dateStart), lte(Schemas.summary.date, dateRef)))
    .orderBy(asc(Schemas.summary.stockCode), desc(Schemas.summary.date))
  const closesByCode = new Map<string, Types.DateCloseRow[]>()
  for (const row of summaryRows) {
    const close = row.priceClose != null && Number.isFinite(Number(row.priceClose))
      ? Number(row.priceClose)
      : null
    if (close === null) {
      continue
    }
    const list = closesByCode.get(row.stockCode) ?? []
    list.push({ date: Number(row.date), close })
    closesByCode.set(row.stockCode, list)
  }
  const codeToLastRsi = new Map<string, number | null>()
  const take = period + 20
  for (const [stockCode, rows] of closesByCode.entries()) {
    const sorted = [...rows].sort((a, b) => b.date - a.date).slice(0, take)
    const closes = sorted.reverse().map((r) => r.close)
    if (closes.length < period + 1) {
      codeToLastRsi.set(stockCode, null)
      continue
    }
    const rsiValues = RSI.calculate(closes, period)
    const lastRsi = rsiValues[rsiValues.length - 1] ?? null
    codeToLastRsi.set(stockCode, lastRsi)
  }
  const screenerRows = await Database.select({
    code: Schemas.screener.code,
    name: Schemas.screener.name,
    sector: Schemas.screener.sector
  }).from(Schemas.screener)
  const items: Types.ScreenerRsiItem[] = screenerRows.map((row) => ({
    code: row.code,
    name: row.name ?? null,
    sector: row.sector ?? null,
    rsi: codeToLastRsi.get(row.code) ?? null
  }))
  const bySector: Record<string, Types.ScreenerRsiItem[]> = {}
  for (const row of items) {
    const key = row.sector != null && row.sector.trim() !== '' ? row.sector.trim() : ''
    if (!bySector[key]) {
      bySector[key] = []
    }
    bySector[key].push(row)
  }
  const response: Types.ScreenerRsiDataResponse = {
    date: dateRef,
    period,
    data: { byCode: items, bySector }
  }
  return ctx.send.json(response)
}
