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
import * as Schemas from '@app/server/schemas/index.ts'
import type * as Types from '@app/server/Types.ts'

export async function GET(ctx: Context) {
  const week = Utils.parseWeek(Utils.queryString(ctx.query('week')))
  const source = Utils.queryString(ctx.query('source'))
  const useOhlc = source === 'ohlc'
  if (useOhlc) {
    const maxDateRows = await Database.select({
      date: Schemas.summary.date
    })
      .from(Schemas.summary)
      .orderBy(desc(Schemas.summary.date))
      .limit(1)
    const endDate = maxDateRows[0]?.date
    if (endDate == null || !Number.isFinite(endDate)) {
      return ctx.send.json([])
    }
    const startDate = Utils.addDaysToDateInt(Number(endDate), -week * 7)
    const summaryRows = await Database.select({
      stockCode: Schemas.summary.stockCode,
      date: Schemas.summary.date,
      priceClose: Schemas.summary.priceClose
    })
      .from(Schemas.summary)
      .where(and(gte(Schemas.summary.date, startDate), lte(Schemas.summary.date, Number(endDate))))
      .orderBy(asc(Schemas.summary.stockCode), asc(Schemas.summary.date))
    const codeToRows = new Map<string, Types.DateCloseNullableRow[]>()
    for (const row of summaryRows) {
      Utils.pushToMapList(codeToRows, row.stockCode, {
        date: Number(row.date),
        close: row.priceClose != null ? Number(row.priceClose) : null
      })
    }
    const codeToReturnPc = new Map<string, number>()
    for (const [code, rows] of codeToRows.entries()) {
      const rowsByDate = [...rows].sort((a, b) => a.date - b.date)
      const firstClose = rowsByDate[0]?.close
      const lastClose = rowsByDate[rowsByDate.length - 1]?.close
      if (firstClose != null && lastClose != null) {
        const returnPct = Utils.returnPctFromPrices(firstClose, lastClose)
        if (returnPct != null) {
          codeToReturnPc.set(code, returnPct)
        }
      }
    }
    const screenerRowsForSector = await Database.select({
      code: Schemas.screener.code,
      sector: Schemas.screener.sector
    }).from(Schemas.screener)
    const codeToSector = new Map<string, string>()
    for (const row of screenerRowsForSector) {
      if (Utils.isNonEmptyString(row.sector)) {
        codeToSector.set(row.code, row.sector!.trim())
      }
    }
    const allSectorsOhlc = Utils.uniqueSorted(screenerRowsForSector.map((row) => row.sector))
    const bySector = new Map<string, number[]>()
    for (const [code, returnPc] of codeToReturnPc.entries()) {
      const sector = codeToSector.get(code)
      if (sector == null) {
        continue
      }
      Utils.pushToMapList(bySector, sector, returnPc)
    }
    const sectorStrengthRows: Types.SectorStrengthRow[] = []
    for (const sector of allSectorsOhlc) {
      const momentumValues = bySector.get(sector) ?? []
      const sum = momentumValues.reduce((acc, momentumPct) => acc + momentumPct, 0)
      const avgMomentum = momentumValues.length > 0 ? sum / momentumValues.length : 0
      sectorStrengthRows.push({
        sector,
        avgMomentum: Utils.round3(avgMomentum),
        count: momentumValues.length,
        rank: 0
      })
    }
    sectorStrengthRows.sort((a, b) => b.avgMomentum - a.avgMomentum)
    sectorStrengthRows.forEach((strengthRow, index) => {
      strengthRow.rank = index + 1
    })
    return ctx.send.json(sectorStrengthRows)
  }
  const screenerRows = await Database.select({
    sector: Schemas.screener.sector,
    week26PC: Schemas.screener.week26PC,
    week52PC: Schemas.screener.week52PC
  }).from(Schemas.screener)
  const allSectors = Utils.uniqueSorted(screenerRows.map((row) => row.sector))
  const bySector = new Map<string, number[]>()
  for (const row of screenerRows) {
    if (!Utils.isNonEmptyString(row.sector)) {
      continue
    }
    const momentumValue = week === 52 ? row.week52PC : row.week26PC
    if (momentumValue == null || !Number.isFinite(momentumValue)) {
      continue
    }
    const sector = row.sector.trim()
    Utils.pushToMapList(bySector, sector, momentumValue)
  }
  const sectorStrengthRows: Types.SectorStrengthRow[] = []
  for (const sector of allSectors) {
    const momentumValues = bySector.get(sector) ?? []
    const sum = momentumValues.reduce((acc, momentumPct) => acc + momentumPct, 0)
    const avgMomentum = momentumValues.length > 0 ? sum / momentumValues.length : 0
    sectorStrengthRows.push({
      sector,
      avgMomentum: Utils.round3(avgMomentum),
      count: momentumValues.length,
      rank: 0
    })
  }
  sectorStrengthRows.sort((a, b) => b.avgMomentum - a.avgMomentum)
  sectorStrengthRows.forEach((strengthRow, index) => {
    strengthRow.rank = index + 1
  })
  return ctx.send.json(sectorStrengthRows)
}
