export interface NavItem {
  id: string
  path: string
  label: string
  icon: string
}

export type PathId =
  | 'home'
  | 'market'
  | 'companies'
  | 'trading'
  | 'participants'
  | 'calendar'
  | 'sync'
  | 'database'
  | 'logs'
  | 'page'
  | 'badRequest'
  | 'serverError'
