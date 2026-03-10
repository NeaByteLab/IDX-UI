import type * as Types from '@app/Types/index.ts'

export interface YearMonthParams extends Types.PaginationParams {
  year: number
  month: number
}

export interface SecuritiesParams extends Types.PaginationParams {
  code?: string
  board?: string
}

export interface UseMarketIndexSummaryParams extends Types.PaginationParams {
  date: string
}

export interface UseMarketIndexChartParams extends Types.PaginationParams {
  period?: '1D' | '1W' | '1M' | '1Q' | '1Y'
}

export interface UseMarketCalendarParams extends Types.PaginationParams {
  date: string
}

export interface DelistingsParams extends Types.PaginationParams {
  year: number
  month: number
}

export interface NewListingsParams extends Types.PaginationParams {
  year: number
  month: number
}

export interface DividendsParams extends Types.PaginationParams {
  year: number
  month: number
}

export interface FinancialRatiosParams extends Types.PaginationParams {
  year: number
  month: number
}

export interface StockSplitsParams extends Types.PaginationParams {
  year: number
  month: number
}

export interface UseMarketDailyIndexParams extends Types.PaginationParams {
  year: number
  month: number
}

export interface UseMarketSectoralMovementParams extends Types.PaginationParams {
  year: number
  month: number
}

export interface UseTradingTopGainerParams extends Types.PaginationParams {
  year: number
  month: number
}

export interface UseTradingTopLoserParams extends Types.PaginationParams {
  year: number
  month: number
}

export interface UseTradingDomesticParams extends Types.PaginationParams {
  year: number
  month: number
}

export interface UseTradingForeignParams extends Types.PaginationParams {
  year: number
  month: number
}

export interface UseTradingActiveVolumeParams extends Types.PaginationParams {
  year: number
  month: number
}

export interface UseTradingActiveValueParams extends Types.PaginationParams {
  year: number
  month: number
}

export interface UseTradingActiveFrequencyParams extends Types.PaginationParams {
  year: number
  month: number
}

export interface UseTradingIndustryParams extends Types.PaginationParams {
  year: number
  month: number
}
