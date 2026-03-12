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
import type * as Types from '@app/server/Types.ts'

export async function GET(ctx: Context) {
  const screenerRows = await Database.select({
    code: Schemas.screener.code,
    name: Schemas.screener.name,
    industry: Schemas.screener.industry,
    sector: Schemas.screener.sector,
    subSector: Schemas.screener.subSector,
    subIndustry: Schemas.screener.subIndustry
  }).from(Schemas.screener)
  const stockList = screenerRows.map((row) => ({
    code: row.code,
    name: row.name ?? ''
  }))
  const industries = Utils.uniqueSorted(screenerRows.map((row) => row.industry))
  const sectors = Utils.uniqueSorted(screenerRows.map((row) => row.sector))
  const subSectors = Utils.uniqueSorted(screenerRows.map((row) => row.subSector))
  const subIndustries = Utils.uniqueSorted(screenerRows.map((row) => row.subIndustry))
  const response: Types.GeneralApiResponse = {
    stockList,
    industries,
    sectors,
    subSectors,
    subIndustries
  }
  return ctx.send.json(response)
}
