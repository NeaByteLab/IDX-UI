import type { ComponentType } from 'react'
import type * as Types from '@app/Types/index.ts'

export interface PaginationBarProps {
  page: number
  pageSize: number
  total: number | undefined
  onPageChange: (page: number) => void
  loading?: boolean
  itemCount?: number
}

export type IconSizeProps = { size?: number }

export type IconComponent = ComponentType<IconSizeProps>

export interface PlaceholderPanelProps {
  icon: IconComponent
  title: string
  description: string
  spin?: boolean
  className?: string
}

export interface CompanyNewsCardProps {
  items: Types.CompanyNewsItem[]
  onViewAll?: () => void
}

export interface MiniWidgetProps {
  title: string
  value: string
  change: string
  isUp: boolean
  chartData?: Types.MiniChartPoint[]
}

export interface PipelineHealthCardProps {
  items: Types.PipelineHealthRow[]
  onConfig?: () => void
}

export interface DataIngestionChartProps {
  data: Types.SyncHistoryPoint[]
}

export interface IdxAnnouncementCardProps {
  items: Types.IdxAnnouncementItem[]
  onRecent?: () => void
}

export interface QuickInsightsCardProps {
  items: Types.QuickInsightItem[]
}

export interface StorageHealthCardProps {
  value: string
  percent: number
  description?: string
}
