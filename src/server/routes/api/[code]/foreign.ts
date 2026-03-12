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
import type * as Types from '@app/server/Types.ts'

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
  const stockCode = code.trim().toUpperCase()
  const summaryRows = await Database.select({
    date: Schemas.summary.date,
    foreignBuy: Schemas.summary.foreignBuy,
    foreignSell: Schemas.summary.foreignSell
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
  const numOrZero = (v: number | null | undefined): number =>
    v != null && Number.isFinite(v) ? Number(v) : 0
  const data: Types.ForeignFlowRow[] = summaryRows.map((row) => {
    const buy = row.foreignBuy != null && Number.isFinite(Number(row.foreignBuy))
      ? Number(row.foreignBuy)
      : null
    const sell = row.foreignSell != null && Number.isFinite(Number(row.foreignSell))
      ? Number(row.foreignSell)
      : null
    const net = buy != null && sell != null ? buy - sell : null
    return {
      date: Number(row.date),
      buy,
      sell,
      net
    }
  })
  let totalBuy = 0
  let totalSell = 0
  for (const row of data) {
    totalBuy += numOrZero(row.buy)
    totalSell += numOrZero(row.sell)
  }
  const summary: Types.ForeignSummary = {
    totalBuy,
    totalSell,
    totalNet: totalBuy - totalSell,
    dayCount: data.length
  }
  const response: Types.ForeignApiResponse = {
    code: stockCode,
    start,
    end,
    data,
    summary
  }
  return ctx.send.json(response)
}
