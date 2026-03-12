/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import type { Context } from '@neabyte/deserve'
import { desc, eq } from 'drizzle-orm'
import Database from '@app/server/Database.ts'
import Utils from '@app/server/Utils.ts'
import * as Schemas from '@app/server/schemas/index.ts'
import * as Services from '@app/server/services/index.ts'
import type * as Types from '@app/server/Types.ts'

export async function GET(ctx: Context) {
  const dateParsed = Utils.parseDate(Utils.queryString(ctx.query('date')))
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
  const summaryRows = await Database.select({
    stockCode: Schemas.summary.stockCode,
    bidVolume: Schemas.summary.bidVolume,
    offerVolume: Schemas.summary.offerVolume
  })
    .from(Schemas.summary)
    .where(eq(Schemas.summary.date, dateRef))
  const screenerRows = await Database.select({
    code: Schemas.screener.code,
    sector: Schemas.screener.sector
  }).from(Schemas.screener)
  const codeToSector = new Map<string, string>()
  for (const row of screenerRows) {
    const sector = row.sector != null && row.sector.trim() !== ''
      ? row.sector.trim()
      : '(Tanpa sektor)'
    codeToSector.set(row.code, sector)
  }
  const bySector = new Map<string, Types.SectorBidOfferAggregate>()
  for (const row of summaryRows) {
    const sector = codeToSector.get(row.stockCode) ?? '(Tanpa sektor)'
    const bid = row.bidVolume != null && Number.isFinite(Number(row.bidVolume))
      ? Number(row.bidVolume)
      : 0
    const offer = row.offerVolume != null && Number.isFinite(Number(row.offerVolume))
      ? Number(row.offerVolume)
      : 0
    const cur = bySector.get(sector)
    if (cur) {
      cur.bidVolume += bid
      cur.offerVolume += offer
      cur.count += 1
    } else {
      bySector.set(sector, { bidVolume: bid, offerVolume: offer, count: 1 })
    }
  }
  const data: Types.ScreenerBidOfferItem[] = Array.from(bySector.entries())
    .map(([sector, agg]) => ({
      sector,
      bidVolume: agg.bidVolume,
      offerVolume: agg.offerVolume,
      count: agg.count
    }))
    .sort((a, b) => b.bidVolume + b.offerVolume - (a.bidVolume + a.offerVolume))
  const response: Types.ScreenerBidOfferResponse = { date: dateRef, data }
  return ctx.send.json(response)
}
