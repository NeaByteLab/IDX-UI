export function companiesPath(): string {
  return '/companies'
}

export function companyDetailPath(code: string): string {
  return `/companies/${encodeURIComponent(code)}`
}

export function companyAnnouncementsPath(code: string): string {
  return `/companies/${encodeURIComponent(code)}/announcements`
}

export function companyFinancialReportsPath(code: string): string {
  return `/companies/${encodeURIComponent(code)}/financial-reports`
}

export function companyIssuedHistoryPath(code: string): string {
  return `/companies/${encodeURIComponent(code)}/issued-history`
}

export function securitiesPath(): string {
  return '/securities'
}

export function announcementsPath(): string {
  return '/announcements'
}

export function marketIndicesPath(): string {
  return '/market/indices'
}

export function marketIndexChartPath(code: string): string {
  return `/market/indices/${encodeURIComponent(code)}/chart`
}

export function marketCalendarPath(): string {
  return '/market/calendar'
}

export function marketDailyIndexPath(): string {
  return '/market/daily-index'
}

export function marketSectoralMovementPath(): string {
  return '/market/sectoral-movement'
}

export function marketIndexSummaryPath(): string {
  return '/market/index-summary'
}

export function tradingSummaryPath(): string {
  return '/trading/summary'
}

export function tradingStockSummaryPath(): string {
  return '/trading/stock-summary'
}

export function tradingBrokerSummaryPath(): string {
  return '/trading/broker-summary'
}

export function tradingTopGainerPath(): string {
  return '/trading/top-gainer'
}

export function tradingTopLoserPath(): string {
  return '/trading/top-loser'
}

export function tradingDomesticPath(): string {
  return '/trading/domestic'
}

export function tradingForeignPath(): string {
  return '/trading/foreign'
}

export function tradingActiveVolumePath(): string {
  return '/trading/active-volume'
}

export function tradingActiveValuePath(): string {
  return '/trading/active-value'
}

export function tradingActiveFrequencyPath(): string {
  return '/trading/active-frequency'
}

export function tradingIndustryPath(): string {
  return '/trading/industry'
}

export function tradingCompanyDailyPath(code: string): string {
  return `/trading/company/${encodeURIComponent(code)}/daily`
}

export function tradingCompanySummaryPath(code: string): string {
  return `/trading/company/${encodeURIComponent(code)}/summary`
}

export function dataAdditionalListingPath(): string {
  return '/data/additional-listing'
}

export function dataDelistingPath(): string {
  return '/data/delisting'
}

export function dataDividendPath(): string {
  return '/data/dividend'
}

export function dataFinancialRatioPath(): string {
  return '/data/financial-ratio'
}

export function dataNewListingPath(): string {
  return '/data/new-listing'
}

export function dataRightOfferingPath(): string {
  return '/data/right-offering'
}

export function dataStockSplitPath(): string {
  return '/data/stock-split'
}

export function participantsBrokersPath(): string {
  return '/participants/brokers'
}

export function participantsDealersPath(): string {
  return '/participants/dealers'
}

export function participantsProfilesPath(): string {
  return '/participants/profiles'
}

export function suspendPath(): string {
  return '/suspend'
}

export function relistingPath(): string {
  return '/relisting'
}
