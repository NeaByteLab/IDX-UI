export type TabId = 'listed' | 'suspended' | 'new' | 'delisted' | 'relisted'

export type MarketTab =
  | 'chart'
  | 'indexList'
  | 'indexSummary'
  | 'sectoral'
  | 'gainers'
  | 'losers'
  | 'foreignFlow'

export type TradingTab =
  | 'summary'
  | 'stock'
  | 'broker'
  | 'activeVolume'
  | 'activeValue'
  | 'activeFreq'
  | 'industry'

export type ParticipantTab = 'brokers' | 'participants' | 'dealers'

export type DetailTab = 'overview' | 'announcements' | 'financials' | 'trading' | 'corporate'
