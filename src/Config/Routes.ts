export const paths = {
  home: '/',
  market: '/market',
  companies: '/companies',
  companyDetail: (code: string) => `/companies/${code}` as const,
  trading: '/trading',
  participants: '/participants',
  calendar: '/calendar',
  sync: '/sync',
  database: '/database',
  logs: '/logs',
  page: '/page',
  badRequest: '/400',
  serverError: '/500'
} as const

export const dashboardRoutePaths: readonly string[] = [
  paths.home,
  paths.market,
  paths.companies,
  paths.trading,
  paths.participants,
  paths.calendar,
  paths.sync,
  paths.database,
  paths.logs
]
