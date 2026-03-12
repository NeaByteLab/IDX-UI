/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import { real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const summary = sqliteTable('stock_summary', {
  id: text('id').primaryKey(),
  date: real('date').notNull(),
  stockCode: text('stock_code').notNull(),
  stockName: text('stock_name'),
  remarks: text('remarks'),
  previous: real('previous'),
  firstTrade: real('first_trade'),
  priceOpen: real('price_open'),
  priceHigh: real('price_high'),
  priceLow: real('price_low'),
  priceClose: real('price_close'),
  change: real('change'),
  volume: real('volume'),
  value: real('value'),
  frequency: real('frequency'),
  individualIndex: real('individual_index'),
  weightForIndex: real('weight_for_index'),
  offerValue: real('offer_value'),
  offerVolume: real('offer_volume'),
  bidValue: real('bid_value'),
  bidVolume: real('bid_volume'),
  listedShares: real('listed_shares'),
  tradableShares: real('tradable_shares'),
  foreignBuy: real('foreign_buy'),
  foreignSell: real('foreign_sell')
})
