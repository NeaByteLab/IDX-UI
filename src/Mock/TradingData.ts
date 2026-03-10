import type {
  ActiveStockItem,
  BrokerSummaryItem,
  IndustryTradingItem,
  StockSummaryItem,
  TradeSummaryItem
} from '@app/Types/Trading.ts'

export const mockStockSummary: StockSummaryItem[] = [
  {
    id: 1,
    code: 'BBCA',
    name: 'Bank Central Asia Tbk.',
    date: '2025-03-10',
    price: { open: 9850, high: 9920, low: 9820, close: 9880, change: 30 },
    trading: { volume: 45_000_000, value: 444_600_000_000, frequency: 12500 },
    foreign: { buy: 12_000_000, sell: 10_500_000, net: 1_500_000 }
  },
  {
    id: 2,
    code: 'BBRI',
    name: 'Bank Rakyat Indonesia Tbk.',
    date: '2025-03-10',
    price: { open: 6480, high: 6560, low: 6450, close: 6550, change: 70 },
    trading: { volume: 38_000_000, value: 248_900_000_000, frequency: 9800 },
    foreign: { buy: 8_000_000, sell: 9_200_000, net: -1_200_000 }
  }
]

export const mockMostActiveByVolume: ActiveStockItem[] = [
  {
    code: 'BBCA',
    name: 'Bank Central Asia Tbk.',
    volume: 45_000_000,
    value: 444_600_000_000,
    frequency: 12500
  },
  {
    code: 'BBRI',
    name: 'Bank Rakyat Indonesia Tbk.',
    volume: 38_000_000,
    value: 248_900_000_000,
    frequency: 9800
  },
  {
    code: 'GOTO',
    name: 'GoTo Gojek Tokopedia Tbk.',
    volume: 32_000_000,
    value: 185_600_000_000,
    frequency: 15200
  }
]

export const mockMostActiveByFrequency: ActiveStockItem[] = [
  {
    code: 'GOTO',
    name: 'GoTo Gojek Tokopedia Tbk.',
    volume: 32_000_000,
    value: 185_600_000_000,
    frequency: 15200
  },
  {
    code: 'BBCA',
    name: 'Bank Central Asia Tbk.',
    volume: 45_000_000,
    value: 444_600_000_000,
    frequency: 12500
  },
  {
    code: 'BBRI',
    name: 'Bank Rakyat Indonesia Tbk.',
    volume: 38_000_000,
    value: 248_900_000_000,
    frequency: 9800
  }
]

export const mockMostActiveByValue: ActiveStockItem[] = [
  {
    code: 'BBCA',
    name: 'Bank Central Asia Tbk.',
    volume: 45_000_000,
    value: 444_600_000_000,
    frequency: 12500
  },
  {
    code: 'BBRI',
    name: 'Bank Rakyat Indonesia Tbk.',
    volume: 38_000_000,
    value: 248_900_000_000,
    frequency: 9800
  },
  {
    code: 'BMRI',
    name: 'Bank Mandiri Tbk.',
    volume: 25_000_000,
    value: 170_000_000_000,
    frequency: 7200
  }
]

export const mockIndustryTrading: IndustryTradingItem[] = [
  {
    date: '2025-03-10',
    industry: 'Finance',
    volume: 120_000_000,
    value: 950_000_000_000,
    marketCap: 4_500_000_000_000_000,
    members: 45
  },
  {
    date: '2025-03-10',
    industry: 'Consumer',
    volume: 85_000_000,
    value: 420_000_000_000,
    marketCap: 2_100_000_000_000_000,
    members: 62
  }
]

export const mockBrokerSummary: BrokerSummaryItem[] = [
  {
    id: 1,
    brokerCode: '001',
    brokerName: 'Broker A',
    totalValue: 1_200_000_000_000,
    volume: 150_000_000,
    frequency: 45000,
    date: '2025-03-10'
  },
  {
    id: 2,
    brokerCode: '002',
    brokerName: 'Broker B',
    totalValue: 980_000_000_000,
    volume: 120_000_000,
    frequency: 38000,
    date: '2025-03-10'
  }
]

export const mockTradeSummary: TradeSummaryItem[] = [
  {
    id: '1',
    volume: 12_500_000_000,
    value: 9_800_000_000_000,
    frequency: 850_000,
    date: '2025-03-10'
  }
]
