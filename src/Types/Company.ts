export interface SecuritiesStockItem {
  code: string
  name: string
  sector?: string
  board?: string
}

export interface CompanyProfileDetail {
  code: string
  name: string
  sector: string
  subSector: string
  board: string
  website?: string
  listingDate?: string
  totalShares?: number
  description?: string
}

export interface SuspendItem {
  code: string
  name: string
  suspendDate: string
  reason?: string
}

export interface NewListingItem {
  code: string
  name: string
  listingDate: string
  shares: number
}

export interface AnnouncementItem {
  id: number
  code: string
  title: string
  date: string
  type?: string
}

export interface CompanyAnnouncementRow {
  id?: number
  title?: string
  date?: string
  type?: string
}

export interface FinancialRatioItem {
  code: string
  per?: number
  pbv?: number
  roe?: number
  der?: number
  period: string
}

export interface DividendItem {
  code: string
  name: string
  type: string
  amount: string
  exDate: string
  paymentDate: string
}

export interface ProfileAnnouncementItem {
  id: number
  code: string
  title: string
  date: string
  type?: string
}

export interface FinancialReportItem {
  id: number
  code: string
  title: string
  period: string
  year: number
  url?: string
}

export interface TradingHistoryRow {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  value: number
}

export interface IssuedHistoryItem {
  code: string
  date: string
  type: string
  shares: number
  description?: string
}

export interface StockSplitItem {
  code: string
  name: string
  date: string
  ratio: string
  description?: string
}

export interface DelistingItem {
  code: string
  name: string
  delistingDate: string
  reason?: string
}

export interface RelistingItem {
  code: string
  name: string
  relistingDate: string
}
