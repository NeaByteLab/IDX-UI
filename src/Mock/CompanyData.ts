import type {
  AnnouncementItem,
  CompanyProfileDetail,
  DelistingItem,
  DividendItem,
  FinancialRatioItem,
  FinancialReportItem,
  IssuedHistoryItem,
  NewListingItem,
  ProfileAnnouncementItem,
  RelistingItem,
  SecuritiesStockItem,
  StockSplitItem,
  SuspendItem,
  TradingHistoryRow
} from '@app/Types/Company.ts'

export const mockSecuritiesList: SecuritiesStockItem[] = [
  { code: 'BBCA', name: 'Bank Central Asia Tbk.', sector: 'Finance', board: 'Main' },
  { code: 'BBRI', name: 'Bank Rakyat Indonesia Tbk.', sector: 'Finance', board: 'Main' },
  { code: 'BMRI', name: 'Bank Mandiri Tbk.', sector: 'Finance', board: 'Main' },
  { code: 'TLKM', name: 'Telkom Indonesia Tbk.', sector: 'Infrastructure', board: 'Main' },
  { code: 'ASII', name: 'Astra International Tbk.', sector: 'Consumer', board: 'Main' },
  { code: 'GOTO', name: 'GoTo Gojek Tokopedia Tbk.', sector: 'Technology', board: 'Development' }
]

export const mockCompanyProfile: CompanyProfileDetail = {
  code: 'BBCA',
  name: 'Bank Central Asia Tbk.',
  sector: 'Finance',
  subSector: 'Banking',
  board: 'Main',
  website: 'https://www.bca.co.id',
  listingDate: '2000-05-18',
  totalShares: 123_456_789_012,
  description: 'Bank Central Asia is one of the largest banks in Indonesia.'
}

export const mockSuspendedList: SuspendItem[] = [
  {
    code: 'XXXX',
    name: 'Suspended Issuer Example',
    suspendDate: '2025-03-01',
    reason: 'Unusual market activity'
  }
]

export const mockNewListings: NewListingItem[] = [
  { code: 'NEW1', name: 'New Listing Corp.', listingDate: '2025-02-15', shares: 1_000_000_000 }
]

export const mockAnnouncements: AnnouncementItem[] = [
  { id: 1, code: 'BBCA', title: 'Financial Report Q4 2024', date: '2025-03-08', type: 'Financial' },
  { id: 2, code: 'BBCA', title: 'Annual GMS 2025', date: '2025-03-01', type: 'Corporate' }
]

export const mockFinancialRatios: FinancialRatioItem[] = [
  { code: 'BBCA', per: 12.5, pbv: 2.1, roe: 18.2, der: 1.8, period: '2024-12' },
  { code: 'BBCA', per: 11.8, pbv: 2.0, roe: 17.5, der: 1.7, period: '2024-09' }
]

export const mockDividends: DividendItem[] = [
  {
    code: 'BBCA',
    name: 'Bank Central Asia Tbk.',
    type: 'Interim',
    amount: 'Rp 85',
    exDate: '2025-04-15',
    paymentDate: '2025-05-10'
  }
]

export const mockDelistings: DelistingItem[] = [
  {
    code: 'OLD1',
    name: 'Delisting Example Corp.',
    delistingDate: '2024-12-01',
    reason: 'Acquisition'
  }
]

export const mockRelistings: RelistingItem[] = [
  { code: 'REL1', name: 'Relisting Example Corp.', relistingDate: '2025-01-15' }
]

export const mockProfileAnnouncements: ProfileAnnouncementItem[] = [
  { id: 1, code: 'BBCA', title: 'Board Change', date: '2025-02-20', type: 'Profile Update' }
]

export const mockFinancialReports: FinancialReportItem[] = [
  {
    id: 1,
    code: 'BBCA',
    title: 'Consolidated Financial Report Q4 2024',
    period: 'Q4',
    year: 2024,
    url: '#'
  },
  { id: 2, code: 'BBCA', title: 'Annual Report 2024', period: 'FY', year: 2024, url: '#' }
]

export const mockTradingHistory: TradingHistoryRow[] = [
  {
    date: '2025-03-07',
    open: 9820,
    high: 9900,
    low: 9800,
    close: 9860,
    volume: 42_000_000,
    value: 414_120_000_000
  },
  {
    date: '2025-03-10',
    open: 9850,
    high: 9920,
    low: 9820,
    close: 9880,
    volume: 45_000_000,
    value: 444_600_000_000
  }
]

export const mockDailySnapshot = {
  date: '2025-03-10',
  open: 9850,
  high: 9920,
  low: 9820,
  close: 9880,
  volume: 45_000_000,
  value: 444_600_000_000,
  frequency: 12500
} as const

export const mockIssuedHistory: IssuedHistoryItem[] = [
  {
    code: 'BBCA',
    date: '2020-06-15',
    type: 'Right Issue',
    shares: 2_000_000_000,
    description: 'HMETD'
  }
]

export const mockStockSplits: StockSplitItem[] = [
  {
    code: 'BBCA',
    name: 'Bank Central Asia Tbk.',
    date: '2019-05-20',
    ratio: '1:5',
    description: 'Stock split 1:5'
  }
]
