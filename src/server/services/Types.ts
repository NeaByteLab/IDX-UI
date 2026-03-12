/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

export type { Client } from '@app/server/services/Client.ts'

export type BrowserHeaders = Record<string, string>

export interface IdxClient {
  get(url: string): Promise<Response>
  ensureSession(): Promise<void>
}

export interface ScreenerResult {
  stockCode?: string
  companyName?: string
  industry?: string
  sector?: string
  subSector?: string
  subIndustry?: string
  subIndustryCode?: string
  indexCode?: string
  marketCapital?: number
  tRevenue?: number
  npm?: number
  per?: number
  pbv?: number
  roa?: number
  roe?: number
  der?: number
  week4PC?: number
  week13PC?: number
  week26PC?: number
  week52PC?: number
  ytdpc?: number
  mtdpc?: number
  umaDate?: string
  notation?: string
  status?: string
  corpAction?: string
  corpActionDate?: string
}

export interface ScreenerApiResponse {
  results?: ScreenerResult[]
}

export interface StockSummaryItem {
  Date?: string
  StockCode?: string
  StockName?: string
  Remarks?: string
  Previous?: number
  OpenPrice?: number
  FirstTrade?: number
  High?: number
  Low?: number
  Close?: number
  Change?: number
  Volume?: number
  Value?: number
  Frequency?: number
  IndexIndividual?: number
  Offer?: number
  OfferVolume?: number
  Bid?: number
  BidVolume?: number
  ListedShares?: number
  TradebleShares?: number
  WeightForIndex?: number
  ForeignBuy?: number
  ForeignSell?: number
}

export interface StockSummaryApiResponse {
  draw?: number
  recordsTotal?: number
  recordsFiltered?: number
  data: StockSummaryItem[]
}

export interface ScreenerRow {
  code: string
  name: string | null
  sector: string | null
  per: number | null
  pbv: number | null
  roa: number | null
  roe: number | null
  der: number | null
  week26PC: number | null
  week52PC: number | null
}

export interface RankedRow {
  code: string
  name: string | null
  sector: string | null
  valueScore: number
  qualityScore: number
  momentumScore: number
  compositeScore: number
  rank: number
}

export interface CompositeWeights {
  valueWeight?: number
  qualityWeight?: number
  momentumWeight?: number
}

export interface CompositeResolvedWeights {
  valueWeight: number
  qualityWeight: number
  momentumWeight: number
}

export interface RankedRowWithFlags extends RankedRow {
  hasNotation: boolean
  hasCorpAction: boolean
  hasUma: boolean
  per: number | null
  roe: number | null
  der: number | null
  week26PC: number | null
  week52PC: number | null
}

export interface RankedRowWithSectorRank extends RankedRowWithFlags {
  sectorRank: number
  sectorPercentile: number
}

export interface SectorStrengthRow {
  sector: string
  avgMomentum: number
  count: number
  rank: number
}

export interface CandidateRow extends RankedRowWithFlags {
  value: number | null
  volume: number | null
  changePct: number | null
  compositePercentile: number
}

export interface CandidateRowWithSectorRank extends CandidateRow {
  sectorRank: number
  sectorPercentile: number
}

export interface CandidatesResponse {
  date: number
  totalCount: number
  limit: number
  offset: number
  serverTimestamp: string
  data: CandidateRow[] | CandidateRowWithSectorRank[]
}

export interface CandidatesResponseMeta {
  date: number
  totalCount: number
  limit: number
  offset: number
  serverTimestamp: string
}

export interface StockDetailOhlcRow {
  date: number
  open: number | null
  high: number | null
  low: number | null
  close: number | null
  volume: number | null
  change: number | null
}

export interface StockDetail {
  code: string
  name: string | null
  sector: string | null
  industry: string | null
  subSector: string | null
  per: number | null
  pbv: number | null
  roa: number | null
  roe: number | null
  der: number | null
  npm: number | null
  marketCapital: number | null
  week4PC: number | null
  week13PC: number | null
  week26PC: number | null
  week52PC: number | null
  hasNotation: boolean
  hasCorpAction: boolean
  hasUma: boolean
  valueScore: number
  qualityScore: number
  momentumScore: number
  compositeScore: number
  rank: number
  value: number | null
  volume: number | null
  ohlc: StockDetailOhlcRow[]
}
