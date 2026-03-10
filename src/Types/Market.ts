export interface IndexData {
  code: string
  close: string
  change: string
  percent: string
  current: string
}

export interface IndexChartPoint {
  date: string
  value: number
}

export interface IndexSummaryItem {
  id: number
  code: string
  name: string
  date: string
  price: {
    previous: number
    high: number
    low: number
    close: number
    change: number
    percent: number
  }
  trading: { volume: number; value: number; frequency: number }
  marketCap: number
}

export interface SectoralSeriesPoint {
  date: string
  change: number
}

export interface SectoralSeries {
  name: string
  points: SectoralSeriesPoint[]
}

export interface TopStockItem {
  code: string
  name: string
  previous: number
  close: number
  change: number
  percentage: number
}

export interface InvestorFlowItem {
  date: string
  buyVolume: number
  buyValue: number
  sellVolume: number
  sellValue: number
}
