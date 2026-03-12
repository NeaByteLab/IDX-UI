/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import Database from '@app/server/Database.ts'
import * as Schemas from '@app/server/schemas/index.ts'
import * as Services from '@app/server/services/index.ts'
import type * as Types from '@app/server/services/Types.ts'

export class Summary {
  private static readonly stockSummaryUrl =
    'https://www.idx.co.id/primary/TradingSummary/GetStockSummary'

  static async run(client: Types.Client, dateInt: number): Promise<void> {
    const url = `${Summary.stockSummaryUrl}?date=${dateInt}`
    const response = await client.get(url)
    if (!response.ok) {
      throw new Error(`Stock summary API ${response.status}`)
    }
    const apiResponse = (await response.json()) as Types.StockSummaryApiResponse
    const summaryItems = apiResponse.data ?? []
    if (summaryItems.length === 0) {
      return
    }
    for (const summaryItem of summaryItems) {
      const stockCode = summaryItem.StockCode ?? ''
      if (!stockCode) {
        continue
      }
      const dateStr = summaryItem.Date ?? ''
      const rowDateInt = dateStr ? Services.CronDate.stringToDateInt(dateStr) : dateInt
      const id = `${rowDateInt}-${stockCode}`
      const row: typeof Schemas.summary.$inferInsert = {
        id,
        date: rowDateInt,
        stockCode,
        stockName: summaryItem.StockName ?? null,
        remarks: summaryItem.Remarks ?? null,
        previous: summaryItem.Previous ?? null,
        firstTrade: summaryItem.FirstTrade ?? null,
        priceOpen: summaryItem.OpenPrice ?? null,
        priceHigh: summaryItem.High ?? null,
        priceLow: summaryItem.Low ?? null,
        priceClose: summaryItem.Close ?? null,
        change: summaryItem.Change ?? null,
        volume: summaryItem.Volume ?? null,
        value: summaryItem.Value ?? null,
        frequency: summaryItem.Frequency ?? null,
        individualIndex: summaryItem.IndexIndividual ?? null,
        weightForIndex: summaryItem.WeightForIndex ?? null,
        offerValue: summaryItem.Offer ?? null,
        offerVolume: summaryItem.OfferVolume ?? null,
        bidValue: summaryItem.Bid ?? null,
        bidVolume: summaryItem.BidVolume ?? null,
        listedShares: summaryItem.ListedShares ?? null,
        tradableShares: summaryItem.TradebleShares ?? null,
        foreignBuy: summaryItem.ForeignBuy ?? null,
        foreignSell: summaryItem.ForeignSell ?? null
      }
      await Database.insert(Schemas.summary)
        .values(row)
        .onConflictDoUpdate({
          target: Schemas.summary.id,
          set: {
            stockName: row.stockName,
            remarks: row.remarks,
            previous: row.previous,
            firstTrade: row.firstTrade,
            priceOpen: row.priceOpen,
            priceHigh: row.priceHigh,
            priceLow: row.priceLow,
            priceClose: row.priceClose,
            change: row.change,
            volume: row.volume,
            value: row.value,
            frequency: row.frequency,
            individualIndex: row.individualIndex,
            weightForIndex: row.weightForIndex,
            offerValue: row.offerValue,
            offerVolume: row.offerVolume,
            bidValue: row.bidValue,
            bidVolume: row.bidVolume,
            listedShares: row.listedShares,
            tradableShares: row.tradableShares,
            foreignBuy: row.foreignBuy,
            foreignSell: row.foreignSell
          }
        })
    }
  }
}
