/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import type { Context } from '@neabyte/deserve'
import Database from '@app/server/Database.ts'
import Utils from '@app/server/Utils.ts'
import * as Schemas from '@app/server/schemas/index.ts'
import * as Services from '@app/server/services/index.ts'
import type * as Types from '@app/server/Types.ts'

export async function GET(ctx: Context) {
  const { limit, offset } = Utils.parseLimitOffset(
    Utils.queryString(ctx.query('limit')),
    Utils.queryString(ctx.query('offset'))
  )
  const valueWeightRaw = ctx.query('vw')
  const qualityWeightRaw = ctx.query('qw')
  const momentumWeightRaw = ctx.query('mw')
  const valueWeight = Utils.parseWeight(Utils.queryString(valueWeightRaw))
  const qualityWeight = Utils.parseWeight(Utils.queryString(qualityWeightRaw))
  const momentumWeight = Utils.parseWeight(Utils.queryString(momentumWeightRaw))
  const compositeWeights = Utils.buildCompositeWeights(
    valueWeight,
    qualityWeight,
    momentumWeight
  ) as Types.CompositeWeights | undefined
  const screenerRows = await Database.select({
    code: Schemas.screener.code,
    name: Schemas.screener.name,
    sector: Schemas.screener.sector,
    per: Schemas.screener.per,
    pbv: Schemas.screener.pbv,
    roa: Schemas.screener.roa,
    roe: Schemas.screener.roe,
    der: Schemas.screener.der,
    week26PC: Schemas.screener.week26PC,
    week52PC: Schemas.screener.week52PC,
    notation: Schemas.screener.notation,
    corpAction: Schemas.screener.corpAction,
    umaDate: Schemas.screener.umaDate
  }).from(Schemas.screener)
  const rowsForScore: Types.ScreenerRow[] = screenerRows.map((row) => ({
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
  const rankedRows = Services.Composite.computeRanked(rowsForScore, compositeWeights)
  const codeToFlags = new Map<
    string,
    { notation: string | null; corpAction: string | null; umaDate: string | null }
  >()
  for (const row of screenerRows) {
    codeToFlags.set(row.code, {
      notation: row.notation,
      corpAction: row.corpAction,
      umaDate: row.umaDate
    })
  }
  const codeToFundamentals = Utils.toFundamentalsMap(screenerRows)
  const withFlags: Types.RankedRowWithFlags[] = rankedRows.map((row) => {
    const flags = codeToFlags.get(row.code)
    const hasNotation = Utils.isNonEmptyString(flags?.notation)
    const hasCorpAction = Utils.isNonEmptyString(flags?.corpAction)
    const hasUma = Utils.isNonEmptyString(flags?.umaDate)
    const fundamentals = codeToFundamentals.get(row.code)
    return {
      ...row,
      hasNotation,
      hasCorpAction,
      hasUma,
      per: fundamentals?.per ?? null,
      roe: fundamentals?.roe ?? null,
      der: fundamentals?.der ?? null,
      week26PC: fundamentals?.week26PC ?? null,
      week52PC: fundamentals?.week52PC ?? null
    }
  })
  const withSectorRank = Utils.parseBoolean(Utils.queryString(ctx.query('withSectorRank')))
  if (!withSectorRank) {
    const { data } = Utils.applyPagination(withFlags, offset, limit)
    return ctx.send.json(data)
  }
  const bySector = new Map<string, Types.RankedRowWithFlags[]>()
  for (const row of withFlags) {
    Utils.pushToMapList(bySector, row.sector ?? '', row)
  }
  const rowsWithSectorRank: Types.RankedRowWithSectorRank[] = []
  for (const sectorRows of bySector.values()) {
    sectorRows.sort((a, b) => b.compositeScore - a.compositeScore)
    const sectorCount = sectorRows.length
    sectorRows.forEach((row, index) => {
      const sectorRank = index + 1
      const sectorPercentile = Utils.sectorPercentile(sectorRank, sectorCount)
      rowsWithSectorRank.push({
        ...row,
        sectorRank,
        sectorPercentile
      })
    })
  }
  rowsWithSectorRank.sort((a, b) => b.compositeScore - a.compositeScore)
  const { data } = Utils.applyPagination(rowsWithSectorRank, offset, limit)
  return ctx.send.json(data)
}
