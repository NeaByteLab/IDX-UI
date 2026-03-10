import type * as Types from '@app/Types/index.ts'

export interface UseDataListResult {
  data: unknown[] | null
  meta: Types.PaginatedMeta | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export interface UseSecuritiesResult {
  data: unknown[] | null
  meta: Types.PaginatedMeta | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export interface UseCompaniesResult {
  data: unknown[] | null
  meta: Types.PaginatedMeta | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export interface UseCompanyAnnouncementsResult {
  data: unknown[] | null
  meta: Types.PaginatedMeta | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export interface UseCompanyFinancialReportsResult {
  data: unknown[] | null
  meta: Types.PaginatedMeta | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export interface UseCompanyIssuedHistoryResult {
  data: unknown[] | null
  meta: Types.PaginatedMeta | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export interface UseRelistingsResult {
  data: unknown[] | null
  meta: Types.PaginatedMeta | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export interface UseSuspendResult {
  data: unknown[] | null
  meta: Types.PaginatedMeta | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export interface UseTradingCompanyDailyResult {
  data: unknown[] | null
  meta: Types.PaginatedMeta | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export interface UseTradingCompanySummaryResult {
  data: unknown[] | null
  meta: Types.PaginatedMeta | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export interface UseTradingBrokerSummaryResult {
  data: unknown[] | null
  meta: Types.PaginatedMeta | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export interface UseTradingStockSummaryResult {
  data: unknown[] | null
  meta: Types.PaginatedMeta | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export interface UseTradingSummaryResult {
  data: unknown[] | null
  meta: Types.PaginatedMeta | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export interface UseMarketIndicesResult {
  data: unknown[] | null
  meta: Types.PaginatedMeta | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export interface UseMarketIndexSummaryResult {
  data: unknown[] | null
  meta: Types.PaginatedMeta | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export interface UseMarketIndexChartResult {
  data: unknown[] | null
  meta: Types.PaginatedMeta | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export interface UseMarketCalendarResult {
  data: unknown[] | null
  meta: Types.PaginatedMeta | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export interface UseBrokersResult {
  data: unknown[] | null
  meta: Types.PaginatedMeta | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export interface UseDealersResult {
  data: unknown[] | null
  meta: Types.PaginatedMeta | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export interface UseParticipantProfilesResult {
  data: unknown[] | null
  meta: Types.PaginatedMeta | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export interface CompanyDetailData {
  profile: { code: string; name: string; listingDate?: number } & Record<string, unknown>
  detail: Record<string, unknown> | null
}

export interface UseCompanyDetailResult {
  data: CompanyDetailData | null
  loading: boolean
  error: Types.ApiError | null
  refetch: () => void
}

export type SyncStatus = 'idle' | 'syncing'
