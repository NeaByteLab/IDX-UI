/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import { real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const screener = sqliteTable('stock_screener', {
  code: text('code').primaryKey(),
  name: text('name'),
  industry: text('industry'),
  sector: text('sector'),
  subSector: text('sub_sector'),
  subIndustry: text('sub_industry'),
  subIndustryCode: text('sub_industry_code'),
  indexCode: text('index_code'),
  marketCapital: real('market_capital'),
  totalRevenue: real('total_revenue'),
  npm: real('npm'),
  per: real('per'),
  pbv: real('pbv'),
  roa: real('roa'),
  roe: real('roe'),
  der: real('der'),
  week4PC: real('week4_pc'),
  week13PC: real('week13_pc'),
  week26PC: real('week26_pc'),
  week52PC: real('week52_pc'),
  ytdpc: real('ytdpc'),
  mtdpc: real('mtdpc'),
  umaDate: text('uma_date'),
  notation: text('notation'),
  status: text('status'),
  corpAction: text('corp_action'),
  corpActionDate: text('corp_action_date')
})
