import type {
  IndexChartPoint,
  IndexData,
  IndexSummaryItem,
  InvestorFlowItem,
  SectoralSeries,
  TopStockItem
} from '@app/Types/Market.ts'

export const mockIndexList: IndexData[] = [
  { code: 'IHSG', close: '7,234.56', change: '+45.32', percent: '+0.63', current: '7,234.56' },
  { code: 'LQ45', close: '952.18', change: '+12.04', percent: '+1.28', current: '952.18' },
  { code: 'JII', close: '678.92', change: '-3.21', percent: '-0.47', current: '678.92' },
  { code: 'IDX30', close: '482.55', change: '+8.90', percent: '+1.88', current: '482.55' }
]

export const mockIndexChart: IndexChartPoint[] = [
  { date: '2025-03-04', value: 7180 },
  { date: '2025-03-05', value: 7210 },
  { date: '2025-03-06', value: 7195 },
  { date: '2025-03-07', value: 7220 },
  { date: '2025-03-10', value: 7234 }
]

export const mockIndexSummary: IndexSummaryItem[] = [
  {
    id: 1,
    code: 'IHSG',
    name: 'Composite Stock Price Index',
    date: '2025-03-10',
    price: {
      previous: 7189.24,
      high: 7245,
      low: 7180,
      close: 7234.56,
      change: 45.32,
      percent: 0.63
    },
    trading: { volume: 12_500_000_000, value: 9_800_000_000_000, frequency: 850_000 },
    marketCap: 12_500_000_000_000_000
  },
  {
    id: 2,
    code: 'LQ45',
    name: 'LQ45',
    date: '2025-03-10',
    price: { previous: 940.14, high: 955, low: 938, close: 952.18, change: 12.04, percent: 1.28 },
    trading: { volume: 5_200_000_000, value: 4_100_000_000_000, frequency: 320_000 },
    marketCap: 8_200_000_000_000_000
  }
]

export const mockSectoralMovement: SectoralSeries[] = [
  {
    name: 'Finance',
    points: [
      { date: '2025-03-04', change: 0.2 },
      { date: '2025-03-05', change: 0.5 },
      { date: '2025-03-06', change: -0.1 },
      { date: '2025-03-07', change: 0.8 },
      { date: '2025-03-10', change: 1.2 }
    ]
  },
  {
    name: 'Consumer',
    points: [
      { date: '2025-03-04', change: -0.3 },
      { date: '2025-03-05', change: 0.1 },
      { date: '2025-03-06', change: 0.4 },
      { date: '2025-03-07', change: 0.2 },
      { date: '2025-03-10', change: 0.5 }
    ]
  }
]

export const mockTopGainers: TopStockItem[] = [
  {
    code: 'GOTO',
    name: 'GoTo Gojek Tokopedia',
    previous: 52,
    close: 58,
    change: 6,
    percentage: 11.54
  },
  {
    code: 'BBRI',
    name: 'Bank Rakyat Indonesia',
    previous: 6200,
    close: 6550,
    change: 350,
    percentage: 5.65
  },
  {
    code: 'TLKM',
    name: 'Telkom Indonesia',
    previous: 3850,
    close: 4020,
    change: 170,
    percentage: 4.42
  }
]

export const mockTopLosers: TopStockItem[] = [
  {
    code: 'BBNI',
    name: 'Bank Negara Indonesia',
    previous: 5200,
    close: 4950,
    change: -250,
    percentage: -4.81
  },
  {
    code: 'BMRI',
    name: 'Bank Mandiri',
    previous: 6800,
    close: 6520,
    change: -280,
    percentage: -4.12
  }
]

export const mockForeignFlow: InvestorFlowItem[] = [
  {
    date: '2025-03-10',
    buyVolume: 450_000_000,
    buyValue: 3_200_000_000_000,
    sellVolume: 380_000_000,
    sellValue: 2_900_000_000_000
  }
]
