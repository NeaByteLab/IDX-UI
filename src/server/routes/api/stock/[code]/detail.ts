/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import type { Context } from '@neabyte/deserve'
import { and, asc, eq, gte, lte } from 'drizzle-orm'
import Database from '@app/server/Database.ts'
import Utils from '@app/server/Utils.ts'
import * as Schemas from '@app/server/schemas/index.ts'
import * as Services from '@app/server/services/index.ts'
import type * as Types from '@app/server/Types.ts'

export async function GET(ctx: Context) {
  const code = ctx.param('code')
  if (!code || code.trim() === '') {
    return ctx.send.json({ error: 'Missing or invalid code' }, { status: 400 })
  }
  const stockCode = code.trim().toUpperCase()
  const start = Utils.parseDate(Utils.queryString(ctx.query('start')))
  const end = Utils.parseDate(Utils.queryString(ctx.query('end')))
  if (start === null || end === null) {
    return ctx.send.json({ error: 'start and end required (yyyymmdd, 8 digits)' }, { status: 400 })
  }
  if (end < start) {
    return ctx.send.json({ error: 'end must be >= start' }, { status: 400 })
  }
  const dateParsed = Utils.parseDate(Utils.queryString(ctx.query('date')))
  const dateInt = dateParsed ?? Services.CronDate.todayDateInt()
  const screenerRows = await Database.select({
    code: Schemas.screener.code,
    name: Schemas.screener.name,
    sector: Schemas.screener.sector,
    industry: Schemas.screener.industry,
    subSector: Schemas.screener.subSector,
    per: Schemas.screener.per,
    pbv: Schemas.screener.pbv,
    roa: Schemas.screener.roa,
    roe: Schemas.screener.roe,
    der: Schemas.screener.der,
    npm: Schemas.screener.npm,
    marketCapital: Schemas.screener.marketCapital,
    week4PC: Schemas.screener.week4PC,
    week13PC: Schemas.screener.week13PC,
    week26PC: Schemas.screener.week26PC,
    week52PC: Schemas.screener.week52PC,
    notation: Schemas.screener.notation,
    corpAction: Schemas.screener.corpAction,
    umaDate: Schemas.screener.umaDate
  })
    .from(Schemas.screener)
    .where(eq(Schemas.screener.code, stockCode))
  const screenerRow = screenerRows[0]
  if (screenerRow == null) {
    return ctx.send.json({ error: 'Stock not found' }, { status: 404 })
  }
  const allScreenerRows = await Database.select({
    code: Schemas.screener.code,
    name: Schemas.screener.name,
    sector: Schemas.screener.sector,
    per: Schemas.screener.per,
    pbv: Schemas.screener.pbv,
    roa: Schemas.screener.roa,
    roe: Schemas.screener.roe,
    der: Schemas.screener.der,
    week26PC: Schemas.screener.week26PC,
    week52PC: Schemas.screener.week52PC
  }).from(Schemas.screener)
  const rowsForScore: Types.ScreenerRow[] = allScreenerRows.map((row) => ({
    code: row.code,
    name: row.name,
    sector: row.sector,
    per: row.per,
    pbv: row.pbv,
    roa: row.roa,
    roe: row.roe,
    der: row.der,
    week26PC: row.week26PC,
    week52PC: row.week52PC
  }))
  const rankedRows = Services.Composite.computeRanked(rowsForScore)
  const rankedRow = rankedRows.find((rankedItem) => rankedItem.code === stockCode)
  const valueSummaryRows = await Database.select({
    value: Schemas.summary.value,
    volume: Schemas.summary.volume
  })
    .from(Schemas.summary)
    .where(and(eq(Schemas.summary.stockCode, stockCode), eq(Schemas.summary.date, dateInt)))
  const summaryRow = valueSummaryRows[0]
  const ohlcRows = await Database.select({
    date: Schemas.summary.date,
    priceOpen: Schemas.summary.priceOpen,
    priceHigh: Schemas.summary.priceHigh,
    priceLow: Schemas.summary.priceLow,
    priceClose: Schemas.summary.priceClose,
    volume: Schemas.summary.volume,
    change: Schemas.summary.change
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
  const hasNotation = Utils.isNonEmptyString(screenerRow.notation)
  const hasCorpAction = Utils.isNonEmptyString(screenerRow.corpAction)
  const hasUma = Utils.isNonEmptyString(screenerRow.umaDate)
  const detail: Types.StockDetail = {
    code: screenerRow.code,
    name: screenerRow.name,
    sector: screenerRow.sector,
    industry: screenerRow.industry,
    subSector: screenerRow.subSector,
    per: screenerRow.per,
    pbv: screenerRow.pbv,
    roa: screenerRow.roa,
    roe: screenerRow.roe,
    der: screenerRow.der,
    npm: screenerRow.npm,
    marketCapital: screenerRow.marketCapital,
    week4PC: screenerRow.week4PC,
    week13PC: screenerRow.week13PC,
    week26PC: screenerRow.week26PC,
    week52PC: screenerRow.week52PC,
    hasNotation,
    hasCorpAction,
    hasUma,
    valueScore: rankedRow?.valueScore ?? 0,
    qualityScore: rankedRow?.qualityScore ?? 0,
    momentumScore: rankedRow?.momentumScore ?? 0,
    compositeScore: rankedRow?.compositeScore ?? 0,
    rank: rankedRow?.rank ?? 0,
    value: summaryRow?.value ?? null,
    volume: summaryRow?.volume ?? null,
    ohlc: ohlcRows.map((row) => ({
      date: row.date,
      open: row.priceOpen,
      high: row.priceHigh,
      low: row.priceLow,
      close: row.priceClose,
      volume: row.volume,
      change: row.change
    }))
  }
  return ctx.send.json(detail)
}
