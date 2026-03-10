import React from 'react'
import type { JSX } from 'react'
import {
  CompanyNewsCard,
  DataIngestionChart,
  IdxAnnouncementCard,
  MiniWidget,
  PipelineHealthCard,
  QuickInsightsCard,
  StorageHealthCard
} from '@app/Components/index.ts'
import type {
  CompanyNewsItem,
  IdxAnnouncementItem,
  PipelineHealthRow,
  QuickInsightItem,
  SyncHistoryPoint
} from '@app/Types/index.ts'

const syncHistoryData: SyncHistoryPoint[] = [
  { name: '08:00', value: 400 },
  { name: '10:00', value: 3000 },
  { name: '12:00', value: 2000 },
  { name: '14:00', value: 2780 },
  { name: '16:00', value: 1890 },
  { name: '18:00', value: 2390 },
  { name: '20:00', value: 3490 }
]

const companyNews: CompanyNewsItem[] = [
  {
    id: 1,
    code: 'BBCA',
    title: 'BBCA Net Profit Up 12% YoY in Q1',
    time: '10m ago',
    tag: 'Earnings'
  },
  {
    id: 2,
    code: 'ASII',
    title: 'Astra International Announces Final Dividend',
    time: '25m ago',
    tag: 'Corporate Action'
  },
  {
    id: 3,
    code: 'TLKM',
    title: 'Data Center Expansion, TLKM Plans Large Capex',
    time: '1h ago',
    tag: 'Investment'
  }
]

const idxAnnouncements: IdxAnnouncementItem[] = [
  {
    id: 1,
    title: 'GOTO Trading Suspension Lifted',
    type: 'Unusual Market Activity',
    date: 'Today'
  },
  {
    id: 2,
    title: 'Technology Sector Stock Price Band Change',
    type: 'Regulation',
    date: 'Yesterday'
  }
]

const pipelineItems: PipelineHealthRow[] = [
  { label: 'API Uptime', val: '99.98%', status: 'success' },
  { label: 'Auto Retries', val: '12', status: 'warning' },
  { label: 'Failed Jobs', val: '0', status: 'success' }
]

const quickInsights: QuickInsightItem[] = [
  { label: 'Top Gainer', symbol: 'GOTO', icon: 'ArrowUpRight' },
  { label: 'Hot Stock', symbol: 'BBRI', icon: 'Zap' }
]

export function Dashboard(): JSX.Element {
  return (
    <div className='dashboard-overview'>
      <div className='mini-widgets-grid'>
        <MiniWidget title='IHSG Composite' value='7,320.12' change='+0.45%' isUp />
        <MiniWidget title='LQ45 Index' value='982.45' change='-0.12%' isUp={false} />
        <MiniWidget title='Total Volume' value='18.2B' change='+1.2B' isUp />
        <MiniWidget title='Market Cap' value='Rp11.2T' change='+2.4%' isUp />
      </div>
      <div className='dashboard-main-grid'>
        <div className='dashboard-main-col'>
          <div className='dashboard-card'>
            <div className='ingestion-card-header'>
              <div>
                <h3 className='ingestion-card-title'>Data Ingestion Activity</h3>
                <p className='ingestion-card-subtitle'>Sinkronisasi per 2 Jam</p>
              </div>
              <div className='ingestion-live-badge'>
                <span className='ingestion-live-dot' aria-hidden />
                LIVE
              </div>
            </div>
            <DataIngestionChart data={syncHistoryData} />
          </div>
          <div className='news-grid'>
            <CompanyNewsCard items={companyNews} />
            <IdxAnnouncementCard items={idxAnnouncements} />
          </div>
        </div>
        <div className='dashboard-sidebar-col'>
          <StorageHealthCard value='1.28 GB' percent={82} />
          <PipelineHealthCard items={pipelineItems} />
          <QuickInsightsCard items={quickInsights} />
        </div>
      </div>
    </div>
  )
}
