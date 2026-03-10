export interface SyncHistoryPoint {
  name: string
  value: number
}

export interface MiniChartPoint {
  v: number
}

export interface CompanyNewsItem {
  id: number
  code: string
  title: string
  time: string
  tag: string
}

export interface IdxAnnouncementItem {
  id: number
  title: string
  type: string
  date: string
}

export interface PipelineHealthRow {
  label: string
  val: string
  status: 'success' | 'warning'
}

export interface QuickInsightItem {
  label: string
  symbol: string
  icon: string
}
