/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

export interface CandidateRow {
  code: string
  name: string | null
  sector: string | null
  valueScore: number
  qualityScore: number
  momentumScore: number
  compositeScore: number
  rank: number
  hasNotation: boolean
  hasCorpAction: boolean
  hasUma: boolean
  per: number | null
  roe: number | null
  der: number | null
  week26PC: number | null
  week52PC: number | null
  value: number | null
  volume: number | null
  changePct: number | null
  compositePercentile: number
}

export interface CandidateRowWithSectorRank extends CandidateRow {
  sectorRank: number
  sectorPercentile: number
}

export type CandidateTableRow = CandidateRow | CandidateRowWithSectorRank

export interface CandidatesParams {
  date?: string
  limit?: number
  offset?: number
  defaultFilter?: boolean
  excludeNotation?: boolean
  excludeCorpAction?: boolean
  excludeUma?: boolean
  minValue?: number
  minVolume?: number
  perMin?: number
  perMax?: number
  roeMin?: number
  derMax?: number
  momentumWeek?: 26 | 52
  momentumMin?: number
  withSectorRank?: boolean
}

export interface CandidatesResponse {
  date: number
  totalCount: number
  limit: number
  offset: number
  serverTimestamp: string
  data: CandidateRow[] | CandidateRowWithSectorRank[]
}

export interface CandidatesTableProps {
  data: CandidateTableRow[]
  limit: number
  offset: number
  totalCount: number
  totalCountLabel?: string
  onPage: (newOffset: number) => void
  onRowClick: (code: string) => void
  searchValue?: string
  onSearchChange?: (searchQuery: string) => void
}

export interface ClientOptions {
  signal?: AbortSignal
}

export interface DashboardHeaderProps {
  totalCount: number
  date: number
  onRefresh: () => void
  loading?: boolean
}

export type DetailTab = 'fundamental' | 'technical'

export interface FilterPanelProps {
  params: CandidatesParams
  sectors: string[]
  sectorFilter: string
  onSectorFilterChange: (sector: string) => void
  onParamsChange: (partialParams: Partial<CandidatesParams>) => void
  onApply: () => void
  onDefaultFilter: () => void
}

export interface ForeignFlowRow {
  date: number
  buy: number | null
  sell: number | null
  net: number | null
}

export type ForeignPeriodDays = 30 | 60 | 90 | 180 | 360

export interface ForeignResponse {
  code: string
  start: number
  end: number
  data: ForeignFlowRow[]
  summary: {
    totalBuy: number
    totalSell: number
    totalNet: number
    dayCount: number
  }
}

export interface GeneralResponse {
  stockList: { code: string; name: string }[]
  industries: string[]
  sectors: string[]
  subSectors: string[]
  subIndustries: string[]
}

export interface HistoryBidOfferByDateEntry {
  date: number
  sectors: Record<string, HistorySectorAggregate>
}

export interface HistoryBidOfferResponse {
  start: number
  end: number
  byDate: HistoryBidOfferByDateEntry[]
  bySector: HistoryBidOfferSectorItem[]
}

export interface HistoryBidOfferSectorItem {
  sector: string
  totalBid: number
  totalOffer: number
  dayCount: number
  avgBid: number
  avgOffer: number
  ratio: number | null
}

export interface HistorySectorAggregate {
  bidVolume: number
  offerVolume: number
  count: number
}

export type HomeTab = 'methodology' | 'score' | 'filter' | 'howTo'

export type MainAnalysisTab = 'fundamental' | 'technical'

export interface OhlcApiRow extends StockDetailOhlcRow {
  bidVolume: number | null
  offerVolume: number | null
}

export interface RsiResponse {
  code: string
  start: number
  end: number
  period: number
  data: RsiRow[]
  sector: string | null
  sectorData: RsiRow[]
}

export interface RsiRow {
  date: number
  rsi: number | null
}

export interface ScreenerBidOfferItem {
  sector: string
  bidVolume: number
  offerVolume: number
  count: number
}

export interface ScreenerBidOfferResponse {
  date: number
  data: ScreenerBidOfferItem[]
}

export interface ScreenerRsiItem {
  code: string
  name: string | null
  sector: string | null
  rsi: number | null
}

export interface ScreenerRsiResponse {
  date: number
  period: number
  data: { byCode: ScreenerRsiItem[]; bySector: Record<string, ScreenerRsiItem[]> }
}

export interface SectorStrengthProps {
  data: SectorStrengthRow[] | null
  loading: boolean
  week: 26 | 52
  onWeekChange: (week: 26 | 52) => void
}

export interface SectorStrengthRow {
  sector: string
  avgMomentum: number
  count: number
  rank: number
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

export interface StockDetailModalProps {
  detail: StockDetail | null
  loading: boolean
  error: string | null
  onClose: () => void
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
