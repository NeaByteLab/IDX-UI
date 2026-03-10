export interface StockSummaryItem {
  id: number
  code: string
  name: string
  date: string
  price: { open: number; high: number; low: number; close: number; change: number }
  trading: { volume: number; value: number; frequency: number }
  foreign?: { buy: number; sell: number; net: number }
}

export interface ActiveStockItem {
  code: string
  name: string
  volume: number
  value: number
  frequency: number
  volumePercent?: number
  valuePercent?: number
  freqPercent?: number
}

export interface ActiveStockResponse {
  totalValue: number
  totalVolume: number
  totalFreq: number
  data: ActiveStockItem[]
}

export interface IndustryTradingItem {
  date: string
  industry: string
  volume: number
  value: number
  marketCap: number
  members: number
}

export interface BrokerSummaryItem {
  id: number
  brokerCode: string
  brokerName: string
  totalValue: number
  volume: number
  frequency: number
  date: string
}

export interface TradeSummaryItem {
  id: string
  volume: number
  value: number
  frequency: number
  date: string
}
