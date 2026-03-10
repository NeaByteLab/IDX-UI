import { paths } from '@app/Config/index.ts'
import type * as Types from '@app/Types/index.ts'

export const navItems: Types.NavItem[] = [
  { id: 'overview', path: paths.home, label: 'Dashboard Overview', icon: 'LayoutDashboard' },
  { id: 'market', path: paths.market, label: 'Market Data', icon: 'TrendingUp' },
  { id: 'companies', path: paths.companies, label: 'Companies List', icon: 'Building2' },
  { id: 'trading', path: paths.trading, label: 'Trading & Activity', icon: 'BarChart3' },
  { id: 'participants', path: paths.participants, label: 'Participants', icon: 'Users' },
  { id: 'calendar', path: paths.calendar, label: 'Calendar Event', icon: 'Calendar' },
  { id: 'sync', path: paths.sync, label: 'Market Data Sync', icon: 'RefreshCw' },
  { id: 'database', path: paths.database, label: 'Database Explorer', icon: 'Database' },
  { id: 'logs', path: paths.logs, label: 'Logs', icon: 'Activity' }
]
