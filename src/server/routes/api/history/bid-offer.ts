/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import type { Context } from '@neabyte/deserve'
import { and, asc, gte, lte } from 'drizzle-orm'
import Database from '@app/server/Database.ts'
import Utils from '@app/server/Utils.ts'
import * as Schemas from '@app/server/schemas/index.ts'
import type * as Types from '@app/server/Types.ts'

export async function GET(ctx: Context) {
  const startParsed = Utils.parseDate(Utils.queryString(ctx.query('start')))
  const endParsed = Utils.parseDate(Utils.queryString(ctx.query('end')))
  if (startParsed === null || endParsed === null) {
    return ctx.send.json({ error: 'start and end required (yyyymmdd, 8 digits)' }, { status: 400 })
  }
  if (endParsed < startParsed) {
    return ctx.send.json({ error: 'end must be >= start' }, { status: 400 })
  }
  const maxDaysRaw = Utils.queryString(ctx.query('limit'))
  const maxDaysParsed = Utils.parseNumber(maxDaysRaw)
  const maxDays = maxDaysParsed != null && maxDaysParsed > 0 ? maxDaysParsed : 365
  let start = startParsed
  const end = endParsed
  const spanDays = Math.floor(
    (Date.UTC(Math.floor(end / 10000), Math.floor((end % 10000) / 100) - 1, end % 100) -
      Date.UTC(Math.floor(start / 10000), Math.floor((start % 10000) / 100) - 1, start % 100)) /
      (1000 * 60 * 60 * 24)
  )
  if (spanDays > maxDays) {
    start = Utils.addDaysToDateInt(end, -maxDays)
  }
  const summaryRows = await Database.select({
    date: Schemas.summary.date,
    stockCode: Schemas.summary.stockCode,
    bidVolume: Schemas.summary.bidVolume,
    offerVolume: Schemas.summary.offerVolume
  })
    .from(Schemas.summary)
    .where(and(gte(Schemas.summary.date, start), lte(Schemas.summary.date, end)))
    .orderBy(asc(Schemas.summary.date))
  if (summaryRows.length === 0) {
    const emptyResponse: Types.HistoryBidOfferResponse = {
      start,
      end,
      byDate: [],
      bySector: []
    }
    return ctx.send.json(emptyResponse)
  }
  const screenerRows = await Database.select({
    code: Schemas.screener.code,
    sector: Schemas.screener.sector
  }).from(Schemas.screener)
  const codeToSector = new Map<string, string>()
  for (const row of screenerRows) {
    const sector = row.sector != null && row.sector.trim() !== ''
      ? row.sector.trim()
      : '(No sector)'
    codeToSector.set(row.code, sector)
  }
  const byDate = new Map<number, Map<string, Types.HistorySectorAggregate>>()
  const bySector = new Map<string, { totalBid: number; totalOffer: number; dateSet: Set<number> }>()
  for (const row of summaryRows) {
    const sector = codeToSector.get(row.stockCode) ?? '(No sector)'
    const bid = row.bidVolume != null && Number.isFinite(Number(row.bidVolume))
      ? Number(row.bidVolume)
      : 0
    const offer = row.offerVolume != null && Number.isFinite(Number(row.offerVolume))
      ? Number(row.offerVolume)
      : 0
    if (!byDate.has(row.date)) {
      byDate.set(row.date, new Map())
    }
    const sectorMap = byDate.get(row.date)!
    const currentAgg = sectorMap.get(sector) ?? { bidVolume: 0, offerVolume: 0, count: 0 }
    currentAgg.bidVolume += bid
    currentAgg.offerVolume += offer
    currentAgg.count += 1
    sectorMap.set(sector, currentAgg)
    const sectorAgg = bySector.get(sector)
    if (sectorAgg) {
      sectorAgg.totalBid += bid
      sectorAgg.totalOffer += offer
      sectorAgg.dateSet.add(row.date)
    } else {
      bySector.set(sector, {
        totalBid: bid,
        totalOffer: offer,
        dateSet: new Set([row.date])
      })
    }
  }
  const byDateEntries: Types.HistoryBidOfferByDateEntry[] = Array.from(byDate.entries())
    .sort(([firstDate], [secondDate]) => firstDate - secondDate)
    .map(([date, sectorMap]) => {
      const sectors: Record<string, Types.HistorySectorAggregate> = {}
      for (const [sector, aggregate] of sectorMap.entries()) {
        sectors[sector] = aggregate
      }
      return { date, sectors }
    })
  const bySectorEntries: Types.HistoryBidOfferSectorItem[] = []
  for (const [sector, agg] of bySector.entries()) {
    const dayCount = agg.dateSet.size
    const avgBid = dayCount > 0 ? agg.totalBid / dayCount : 0
    const avgOffer = dayCount > 0 ? agg.totalOffer / dayCount : 0
    const ratio = agg.totalOffer > 0 ? agg.totalBid / agg.totalOffer : null
    bySectorEntries.push({
      sector,
      totalBid: agg.totalBid,
      totalOffer: agg.totalOffer,
      dayCount,
      avgBid,
      avgOffer,
      ratio
    })
  }
  bySectorEntries.sort((first, second) => {
    const firstScore = first.totalBid + first.totalOffer
    const secondScore = second.totalBid + second.totalOffer
    return secondScore - firstScore
  })
  const response: Types.HistoryBidOfferResponse = {
    start,
    end,
    byDate: byDateEntries,
    bySector: bySectorEntries
  }
  return ctx.send.json(response)
}
