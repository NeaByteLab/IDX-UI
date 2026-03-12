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
  const dateInt = dateParsed ?? Services.CronDate.todayDateInt()
  const minValueRaw = ctx.query('minValue')
  const minVolumeRaw = ctx.query('minVolume')
  const excludeNotationRaw = ctx.query('excludeNotation')
  const excludeCorpActionRaw = ctx.query('excludeCorpAction')
  const excludeUmaRaw = ctx.query('excludeUma')
  const minValue = Utils.parseNumber(Utils.queryString(minValueRaw))
  const minVolume = Utils.parseNumber(Utils.queryString(minVolumeRaw))
  let excludeNotation = Utils.parseBoolean(Utils.queryString(excludeNotationRaw))
  let excludeCorpAction = Utils.parseBoolean(Utils.queryString(excludeCorpActionRaw))
  let excludeUma = Utils.parseBoolean(Utils.queryString(excludeUmaRaw))
  const perMinRaw = ctx.query('perMin')
  const perMaxRaw = ctx.query('perMax')
  const roeMinRaw = ctx.query('roeMin')
  const derMaxRaw = ctx.query('derMax')
  const momentumWeekRaw = ctx.query('momentumWeek')
  const momentumMinRaw = ctx.query('momentumMin')
  const perMin = Utils.parseNumber(Utils.queryString(perMinRaw))
  let perMax = Utils.parseNumber(Utils.queryString(perMaxRaw))
  let roeMin = Utils.parseNumber(Utils.queryString(roeMinRaw))
  let derMax = Utils.parseNumber(Utils.queryString(derMaxRaw))
  let momentumMin = Utils.parseNumber(Utils.queryString(momentumMinRaw))
  let momentumWeek = Utils.parseWeek(Utils.queryString(momentumWeekRaw))
  const defaultFilter = Utils.parseBoolean(Utils.queryString(ctx.query('defaultFilter')))
  if (defaultFilter) {
    if (!Utils.queryParamSent(excludeNotationRaw)) {
      excludeNotation = true
    }
    if (!Utils.queryParamSent(excludeCorpActionRaw)) {
      excludeCorpAction = true
    }
    if (!Utils.queryParamSent(excludeUmaRaw)) {
      excludeUma = true
    }
    if (!Utils.queryParamSent(perMaxRaw)) {
      perMax = 25
    }
    if (!Utils.queryParamSent(roeMinRaw)) {
      roeMin = 0
    }
    if (!Utils.queryParamSent(derMaxRaw)) {
      derMax = 2
    }
    if (!Utils.queryParamSent(momentumMinRaw)) {
      momentumMin = 0
    }
    if (!Utils.queryParamSent(momentumWeekRaw)) {
      momentumWeek = 26
    }
  }
  const { limit, offset } = Utils.parseLimitOffset(
    Utils.queryString(ctx.query('limit')),
    Utils.queryString(ctx.query('offset'))
  )
  const withSectorRank = Utils.parseBoolean(Utils.queryString(ctx.query('withSectorRank')))
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
  let summaryDate = dateInt
  let summaryRows = await Database.select({
    stockCode: Schemas.summary.stockCode,
    value: Schemas.summary.value,
    volume: Schemas.summary.volume,
    change: Schemas.summary.change,
    previous: Schemas.summary.previous
  })
    .from(Schemas.summary)
    .where(eq(Schemas.summary.date, dateInt))
  if (summaryRows.length === 0) {
    const latestRows = await Database.select({ date: Schemas.summary.date })
      .from(Schemas.summary)
      .orderBy(desc(Schemas.summary.date))
      .limit(1)
    const latestDate = latestRows[0]?.date
    if (latestDate != null && Number.isFinite(latestDate)) {
      summaryDate = Number(latestDate)
      summaryRows = await Database.select({
        stockCode: Schemas.summary.stockCode,
        value: Schemas.summary.value,
        volume: Schemas.summary.volume,
        change: Schemas.summary.change,
        previous: Schemas.summary.previous
      })
        .from(Schemas.summary)
        .where(eq(Schemas.summary.date, summaryDate))
    }
  }
  const codeToLiquidity = new Map<string, Types.LiquiditySnapshot>()
  const codeToChangePct = new Map<string, number | null>()
  for (const row of summaryRows) {
    codeToLiquidity.set(row.stockCode, {
      value: row.value,
      volume: row.volume
    })
    const changePct = Utils.changePctFromPrevious(row.change, row.previous)
    codeToChangePct.set(row.stockCode, changePct)
  }
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
  const fundamentalFilter = {
    ...(perMin != null && { perMin }),
    ...(perMax != null && { perMax }),
    ...(roeMin != null && { roeMin }),
    ...(derMax != null && { derMax }),
    ...(momentumMin != null && { momentumMin }),
    momentumWeek
  }
  const filteredScreenerRows = screenerRows.filter((row) =>
    Utils.screenerPassesFundamentalFilter(row, fundamentalFilter)
  )
  const rowsForScore: Types.ScreenerRow[] = filteredScreenerRows.map((row) => ({
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
  const codeToFlags = new Map<string, Types.CodeFlags>()
  for (const row of filteredScreenerRows) {
    codeToFlags.set(row.code, {
      notation: row.notation,
      corpAction: row.corpAction,
      umaDate: row.umaDate
    })
  }
  const codeToFundamentals = Utils.toFundamentalsMap(filteredScreenerRows)
  const withFlagsAndLiquidity: Types.CandidateRow[] = rankedRows.map((row) => {
    const flags = codeToFlags.get(row.code)
    const hasNotation = Utils.isNonEmptyString(flags?.notation)
    const hasCorpAction = Utils.isNonEmptyString(flags?.corpAction)
    const hasUma = Utils.isNonEmptyString(flags?.umaDate)
    const liquidity = codeToLiquidity.get(row.code)
    const transactionValue = liquidity?.value ?? null
    const volume = liquidity?.volume ?? null
    const fundamentals = codeToFundamentals.get(row.code)
    const changePct = codeToChangePct.get(row.code) ?? null
    return {
      ...row,
      hasNotation,
      hasCorpAction,
      hasUma,
      per: fundamentals?.per ?? null,
      roe: fundamentals?.roe ?? null,
      der: fundamentals?.der ?? null,
      week26PC: fundamentals?.week26PC ?? null,
      week52PC: fundamentals?.week52PC ?? null,
      value: transactionValue,
      volume,
      changePct,
      compositePercentile: 0
    }
  })
  let withSectorRankApplied: Types.CandidateRow[] | Types.CandidateRowWithSectorRank[] =
    withFlagsAndLiquidity
  if (withSectorRank) {
    const bySector = new Map<string, Types.CandidateRow[]>()
    for (const row of withFlagsAndLiquidity) {
      Utils.pushToMapList(bySector, row.sector ?? '', row)
    }
    const candidatesWithSectorRank: Types.CandidateRowWithSectorRank[] = []
    for (const sectorRows of bySector.values()) {
      sectorRows.sort((a, b) => b.compositeScore - a.compositeScore)
      const sectorCount = sectorRows.length
      sectorRows.forEach((candidateRow, index) => {
        const sectorRank = index + 1
        const sectorPercentile = Utils.sectorPercentile(sectorRank, sectorCount)
        candidatesWithSectorRank.push({
          ...candidateRow,
          sectorRank,
          sectorPercentile
        })
      })
    }
    candidatesWithSectorRank.sort((a, b) => b.compositeScore - a.compositeScore)
    withSectorRankApplied = candidatesWithSectorRank
  }
  let filteredCandidates = withSectorRankApplied
  if (excludeNotation) {
    filteredCandidates = filteredCandidates.filter((row) => !row.hasNotation)
  }
  if (excludeCorpAction) {
    filteredCandidates = filteredCandidates.filter((row) => !row.hasCorpAction)
  }
  if (excludeUma) {
    filteredCandidates = filteredCandidates.filter((row) => !row.hasUma)
  }
  if (minValue != null) {
    filteredCandidates = filteredCandidates.filter((row) => (row.value ?? 0) >= minValue)
  }
  if (minVolume != null) {
    filteredCandidates = filteredCandidates.filter((row) => (row.volume ?? 0) >= minVolume)
  }
  const totalCount = filteredCandidates.length
  const withPercentile = filteredCandidates.map((row, index) => ({
    ...row,
    compositePercentile: Utils.compositePercentile(index, totalCount)
  }))
  const { data } = Utils.applyPagination(withPercentile, offset, limit)
  const response: Types.CandidatesResponse = {
    date: summaryDate,
    totalCount,
    limit,
    offset,
    serverTimestamp: new Date().toISOString(),
    data
  }
  return ctx.send.json(response)
}
