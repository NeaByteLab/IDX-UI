/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import Database from '@app/server/Database.ts'
import * as Schemas from '@app/server/schemas/index.ts'
import type * as Types from '@app/server/services/Types.ts'
import Utils from '@app/server/Utils.ts'

export class Screener {
  private static readonly screenerUrl =
    'https://www.idx.co.id/support/stock-screener/api/v1/stock-screener/get'

  static async run(client: Types.Client): Promise<void> {
    const response = await client.get(Screener.screenerUrl)
    if (!response.ok) {
      throw new Error(`Screener API ${response.status}`)
    }
    const apiResponse = (await response.json()) as Types.ScreenerApiResponse
    const results = apiResponse.results ?? []
    if (results.length === 0) {
      return
    }
    for (const screenerItem of results) {
      const code = screenerItem.stockCode ?? ''
      if (!code) {
        continue
      }
      const row = {
        code,
        name: screenerItem.companyName != null ? String(screenerItem.companyName) : null,
        industry: Utils.toTitleCase(
          screenerItem.industry != null ? String(screenerItem.industry) : null
        ),
        sector: Utils.toTitleCase(screenerItem.sector != null ? String(screenerItem.sector) : null),
        subSector: Utils.toTitleCase(
          screenerItem.subSector != null ? String(screenerItem.subSector) : null
        ),
        subIndustry: Utils.toTitleCase(
          screenerItem.subIndustry != null ? String(screenerItem.subIndustry) : null
        ),
        subIndustryCode: screenerItem.subIndustryCode != null
          ? String(screenerItem.subIndustryCode)
          : null,
        indexCode: screenerItem.indexCode != null ? String(screenerItem.indexCode) : null,
        marketCapital: screenerItem.marketCapital ?? null,
        totalRevenue: screenerItem.tRevenue ?? null,
        npm: screenerItem.npm ?? null,
        per: screenerItem.per ?? null,
        pbv: screenerItem.pbv ?? null,
        roa: screenerItem.roa ?? null,
        roe: screenerItem.roe ?? null,
        der: screenerItem.der ?? null,
        week4PC: screenerItem.week4PC ?? null,
        week13PC: screenerItem.week13PC ?? null,
        week26PC: screenerItem.week26PC ?? null,
        week52PC: screenerItem.week52PC ?? null,
        ytdpc: screenerItem.ytdpc ?? null,
        mtdpc: screenerItem.mtdpc ?? null,
        umaDate: screenerItem.umaDate ?? null,
        notation: screenerItem.notation ?? null,
        status: screenerItem.status ?? null,
        corpAction: screenerItem.corpAction ?? null,
        corpActionDate: screenerItem.corpActionDate ?? null
      }
      await Database.insert(Schemas.screener)
        .values(row)
        .onConflictDoUpdate({
          target: Schemas.screener.code,
          set: {
            name: row.name,
            industry: row.industry,
            sector: row.sector,
            subSector: row.subSector,
            subIndustry: row.subIndustry,
            subIndustryCode: row.subIndustryCode,
            indexCode: row.indexCode,
            marketCapital: row.marketCapital,
            totalRevenue: row.totalRevenue,
            npm: row.npm,
            per: row.per,
            pbv: row.pbv,
            roa: row.roa,
            roe: row.roe,
            der: row.der,
            week4PC: row.week4PC,
            week13PC: row.week13PC,
            week26PC: row.week26PC,
            week52PC: row.week52PC,
            ytdpc: row.ytdpc,
            mtdpc: row.mtdpc,
            umaDate: row.umaDate,
            notation: row.notation,
            status: row.status,
            corpAction: row.corpAction,
            corpActionDate: row.corpActionDate
          }
        })
    }
  }
}
