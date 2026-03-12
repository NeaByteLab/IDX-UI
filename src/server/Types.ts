/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

export type * from '@app/server/services/Types.ts'

export interface DenoCron {
  cron(scheduleName: string, schedule: string, handler: () => Promise<void>): void
}

export interface FundamentalFilter {
  perMin?: number
  perMax?: number
  roeMin?: number
  derMax?: number
  momentumMin?: number
  momentumWeek: 26 | 52
}

export interface FundamentalsRowInput {
  code: string
  per: unknown
  roe: unknown
  der: unknown
  week26PC: unknown
  week52PC: unknown
}

export interface FundamentalsValues {
  per: number | null
  roe: number | null
  der: number | null
  week26PC: number | null
  week52PC: number | null
}

export interface LimitOffset {
  limit: number
  offset: number
}

export interface PaginationResult<T> {
  data: T[]
  totalCount: number
}
