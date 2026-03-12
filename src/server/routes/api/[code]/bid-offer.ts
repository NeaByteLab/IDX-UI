/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import type { Context } from '@neabyte/deserve'
import { and, asc, eq, gte, lte } from 'drizzle-orm'
import Database from '@app/server/Database.ts'
import Utils from '@app/server/Utils.ts'
import * as Schemas from '@app/server/schemas/index.ts'
import type * as Types from '@app/server/Types.ts'

export async function GET(ctx: Context) {
  const code = ctx.param('code')
  if (!code || code.trim() === '') {
    return ctx.send.json({ error: 'Missing or invalid code' }, { status: 400 })
  }
  const start = Utils.parseDate(Utils.queryString(ctx.query('start')))
  const end = Utils.parseDate(Utils.queryString(ctx.query('end')))
  if (start === null || end === null) {
    return ctx.send.json({ error: 'start and end required (yyyymmdd, 8 digits)' }, { status: 400 })
  }
  if (end < start) {
    return ctx.send.json({ error: 'end must be >= start' }, { status: 400 })
  }
  const summaryRows = await Database.select({
    date: Schemas.summary.date,
    bidVolume: Schemas.summary.bidVolume,
    offerVolume: Schemas.summary.offerVolume
  })
    .from(Schemas.summary)
    .where(
      and(
        eq(Schemas.summary.stockCode, code.trim().toUpperCase()),
        gte(Schemas.summary.date, start),
        lte(Schemas.summary.date, end)
      )
    )
    .orderBy(asc(Schemas.summary.date))
  const rows: Types.BidOfferRowApi[] = summaryRows.map((row) => ({
    date: row.date,
    bidVolume: row.bidVolume,
    offerVolume: row.offerVolume
  }))
  return ctx.send.json(rows)
}
