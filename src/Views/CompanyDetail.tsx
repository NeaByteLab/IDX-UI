import React, { type JSX, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BarChart3, Building2, FileText, LayoutDashboard, Megaphone } from 'lucide-react'
import * as Config from '@app/Config/index.ts'
import * as Hooks from '@app/Hooks/index.ts'
import type * as Types from '@app/Types/index.ts'

function formatDateFromApi(value: number | string | undefined): string {
  if (value === undefined || value === null) {
    return '—'
  }
  if (typeof value === 'string') {
    return value
  }
  const d = new Date(typeof value === 'number' && value < 1e10 ? value * 1000 : value)
  return Number.isNaN(d.getTime()) ? '—' : d.toISOString().slice(0, 10)
}

export function CompanyDetail(): JSX.Element {
  const { code } = useParams<{ code: string }>()
  const [tab, setTab] = useState<Types.DetailTab>('overview')
  const [announcementDateFrom, setAnnouncementDateFrom] = useState('2025-01-01')
  const [announcementDateTo, setAnnouncementDateTo] = useState('2025-12-31')
  const [announcementSearch, setAnnouncementSearch] = useState('')
  const [financialPeriod, setFinancialPeriod] = useState('2024-12')
  const [tradingDateFrom, setTradingDateFrom] = useState('2025-01-01')
  const [tradingDateTo, setTradingDateTo] = useState('2025-12-31')
  const companyDetail = Hooks.useCompanyDetail(code ?? null)
  const companyAnnouncements = Hooks.useCompanyAnnouncements(code ?? null, { limit: 100 })
  const financialPeriodParts = useMemo(() => {
    const p = financialPeriod
    if (!p || p.length < 7) {
      return { year: null as number | null, month: null as number | null }
    }
    const y = parseInt(p.slice(0, 4), 10)
    const m = parseInt(p.slice(5, 7), 10)
    if (Number.isNaN(y) || Number.isNaN(m) || m < 1 || m > 12) {
      return { year: null, month: null }
    }
    return { year: y, month: m }
  }, [financialPeriod])
  const companyReports = Hooks.useCompanyFinancialReports(code ?? null, { limit: 50 })
  const companyIssued = Hooks.useCompanyIssuedHistory(code ?? null, { limit: 50 })
  const tradingDaily = Hooks.useTradingCompanyDaily(code ?? null, { limit: 500 })
  const ratiosApi = Hooks.useFinancialRatios(
    financialPeriodParts.year != null && financialPeriodParts.month != null
      ? {
        ...financialPeriodParts,
        year: financialPeriodParts.year,
        month: financialPeriodParts.month
      }
      : null
  )
  const dividendsApi = Hooks.useDividends(
    financialPeriodParts.year != null && financialPeriodParts.month != null
      ? {
        ...financialPeriodParts,
        year: financialPeriodParts.year,
        month: financialPeriodParts.month
      }
      : null
  )
  const splitsApi = Hooks.useStockSplits(
    financialPeriodParts.year != null && financialPeriodParts.month != null
      ? {
        ...financialPeriodParts,
        year: financialPeriodParts.year,
        month: financialPeriodParts.month
      }
      : null
  )
  const profileFromApi = companyDetail.data
  const detailRecord = profileFromApi?.detail as Record<string, unknown> | null | undefined
  const profileRecord = profileFromApi?.profile as Record<string, unknown> | undefined
  const profile = profileFromApi
    ? {
      code: (profileFromApi.profile?.code ?? code ?? '') as string,
      name: (profileFromApi.profile?.name ?? '—') as string,
      sector: String(detailRecord?.['sector'] ?? profileRecord?.['sector'] ?? '—'),
      subSector: String(detailRecord?.['subSector'] ?? '—'),
      board: String(detailRecord?.['board'] ?? '—'),
      website: String(detailRecord?.['website'] ?? '—'),
      listingDate: formatDateFromApi(profileFromApi.profile?.listingDate as number | undefined),
      totalShares: undefined as number | undefined,
      description: String(detailRecord?.['businessActivity'] ?? '—')
    }
    : null
  const baseAnnouncements = (companyAnnouncements.data ?? []) as Types.CompanyAnnouncementRow[]
  const announcements = useMemo(() => {
    let list = baseAnnouncements.filter((a) => {
      const dateStr = typeof a.date === 'number' ? formatDateFromApi(a.date) : (a.date ?? '')
      return dateStr >= announcementDateFrom && dateStr <= announcementDateTo
    })
    const q = announcementSearch.trim().toLowerCase()
    if (q) {
      list = list.filter((a) => (a.title ?? '').toLowerCase().includes(q))
    }
    return list
  }, [baseAnnouncements, announcementDateFrom, announcementDateTo, announcementSearch])
  const profileUpdates = useMemo((): Types.CompanyAnnouncementRow[] => [], [])
  const ratios = useMemo(() => {
    const raw = (ratiosApi.data ?? []) as {
      code?: string
      period?: string
      per?: unknown
      pbv?: unknown
      roe?: unknown
      der?: unknown
    }[]
    return raw.filter((r) => String(r?.code ?? '') === (code ?? ''))
  }, [code, ratiosApi.data])
  const reports = useMemo(() => {
    return (companyReports.data ?? []) as {
      id?: number
      title?: string
      period?: string
      year?: number
      url?: string
    }[]
  }, [companyReports.data])
  const tradingHistoryRaw = useMemo(() => {
    const list = (tradingDaily.data ?? []) as {
      date?: string
      open?: number
      high?: number
      low?: number
      close?: number
      volume?: number
      value?: number
    }[]
    return list.filter(
      (row) => (row.date ?? '') >= tradingDateFrom && (row.date ?? '') <= tradingDateTo
    )
  }, [tradingDaily.data, tradingDateFrom, tradingDateTo])
  const dailySnapshot = useMemo(() => {
    const list = (tradingDaily.data ?? []) as {
      date?: string
      open?: number
      high?: number
      low?: number
      close?: number
      volume?: number
      value?: number
      frequency?: number
    }[]
    const first = list[0]
    if (!first) {
      return null
    }
    return {
      date: first.date ?? '—',
      open: Number(first.open) || 0,
      high: Number(first.high) || 0,
      low: Number(first.low) || 0,
      close: Number(first.close) || 0,
      volume: Number(first.volume) || 0,
      value: Number(first.value) || 0,
      frequency: Number(first.frequency) || 0
    }
  }, [tradingDaily.data])
  const dividends = useMemo(() => {
    const raw = (dividendsApi.data ?? []) as { code?: string; [k: string]: unknown }[]
    return raw.filter((d) => String(d?.code ?? '') === (code ?? ''))
  }, [code, dividendsApi.data])
  const issued = useMemo(() => {
    return (companyIssued.data ?? []) as { [k: string]: unknown }[]
  }, [companyIssued.data])
  const splits = useMemo(() => {
    const raw = (splitsApi.data ?? []) as { code?: string; [k: string]: unknown }[]
    return raw.filter((s) => String(s?.code ?? '') === (code ?? ''))
  }, [code, splitsApi.data])

  if (!code) {
    return (
      <div className='dashboard-overview'>
        <p className='dashboard-page-subtitle'>No company code.</p>
        <Link to={Config.paths.companies} className='news-card-link'>
          Back to Companies
        </Link>
      </div>
    )
  }

  const tabs: { id: Types.DetailTab; label: string; Icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
    { id: 'announcements', label: 'Announcements', Icon: Megaphone },
    { id: 'financials', label: 'Financials', Icon: FileText },
    { id: 'trading', label: 'Trading', Icon: BarChart3 },
    { id: 'corporate', label: 'Corporate actions', Icon: Building2 }
  ]

  return (
    <div className='dashboard-overview'>
      <Link to={Config.paths.companies} className='news-card-link dashboard-back-link-block'>
        ← Back to Companies
      </Link>
      {companyDetail.loading && <p>Loading…</p>}
      {companyDetail.error && !companyDetail.loading && (
        <p className='dashboard-error-text'>
          {(companyDetail.error as { error?: string }).error ?? 'Request failed'}
        </p>
      )}
      {profile
        ? (
          <>
            <div className='dashboard-tabs-row'>
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type='button'
                  className={tab === t.id ? 'dashboard-sync-btn is-primary' : 'dashboard-sync-btn'}
                  onClick={() => setTab(t.id)}
                >
                  <t.Icon size={18} aria-hidden />
                  {t.label}
                </button>
              ))}
            </div>
            {tab === 'overview' && (
              <>
                <div className='dashboard-card page-section'>
                  <h2 className='data-section-title'>Profile</h2>
                  <div className='data-table-wrap'>
                    <table className='data-table'>
                      <tbody>
                        <tr>
                          <th className='col-width-140'>Code</th>
                          <td>{profile.code}</td>
                        </tr>
                        <tr>
                          <th>Name</th>
                          <td>{profile.name}</td>
                        </tr>
                        <tr>
                          <th>Sector</th>
                          <td>{String(profile.sector)}</td>
                        </tr>
                        <tr>
                          <th>Sub sector</th>
                          <td>{String(profile.subSector)}</td>
                        </tr>
                        <tr>
                          <th>Board</th>
                          <td>{String(profile.board)}</td>
                        </tr>
                        <tr>
                          <th>Website</th>
                          <td>{String(profile.website ?? '—')}</td>
                        </tr>
                        <tr>
                          <th>Listing date</th>
                          <td>{profile.listingDate ?? '—'}</td>
                        </tr>
                        <tr>
                          <th>Total shares</th>
                          <td className='num'>
                            {profile.totalShares != null
                              ? profile.totalShares.toLocaleString()
                              : '—'}
                          </td>
                        </tr>
                        <tr>
                          <th>Description</th>
                          <td>{String(profile.description ?? '—')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {dailySnapshot && (
                  <div className='dashboard-card page-section'>
                    <h2 className='data-section-title'>Daily Snapshot (latest)</h2>
                    <div className='data-table-wrap'>
                      <table className='data-table'>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th className='num'>Open</th>
                            <th className='num'>High</th>
                            <th className='num'>Low</th>
                            <th className='num'>Close</th>
                            <th className='num'>Volume</th>
                            <th className='num'>Value</th>
                            <th className='num'>Frequency</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{dailySnapshot.date}</td>
                            <td className='num'>{dailySnapshot.open.toLocaleString()}</td>
                            <td className='num'>{dailySnapshot.high.toLocaleString()}</td>
                            <td className='num'>{dailySnapshot.low.toLocaleString()}</td>
                            <td className='num'>{dailySnapshot.close.toLocaleString()}</td>
                            <td className='num'>{dailySnapshot.volume.toLocaleString()}</td>
                            <td className='num'>{dailySnapshot.value.toLocaleString()}</td>
                            <td className='num'>{dailySnapshot.frequency.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
            {tab === 'announcements' && (
              <>
                <div className='dashboard-filter-row'>
                  <label className='dashboard-filter-label'>
                    Date from:
                    <input
                      type='date'
                      value={announcementDateFrom}
                      onChange={(e) => setAnnouncementDateFrom(e.target.value)}
                      className='dashboard-filter-input'
                    />
                  </label>
                  <label className='dashboard-filter-label'>
                    Date to:
                    <input
                      type='date'
                      value={announcementDateTo}
                      onChange={(e) => setAnnouncementDateTo(e.target.value)}
                      className='dashboard-filter-input'
                    />
                  </label>
                  <input
                    type='search'
                    placeholder='Search by title...'
                    value={announcementSearch}
                    onChange={(e) => setAnnouncementSearch(e.target.value)}
                    className='dashboard-input dashboard-input-min-200'
                  />
                </div>
                <div className='dashboard-card page-section'>
                  <h2 className='data-section-title'>Announcements</h2>
                  <div className='data-table-wrap'>
                    <table className='data-table'>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Date</th>
                          <th>Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {companyAnnouncements.loading
                          ? (
                            <tr>
                              <td colSpan={3}>Loading…</td>
                            </tr>
                          )
                          : announcements.length
                          ? (
                            announcements.map((a, i) => (
                              <tr key={a.id ?? i}>
                                <td>{a.title ?? '—'}</td>
                                <td>
                                  {typeof a.date === 'number'
                                    ? formatDateFromApi(a.date)
                                    : (a.date ?? '—')}
                                </td>
                                <td>{a.type ?? '—'}</td>
                              </tr>
                            ))
                          )
                          : (
                            <tr>
                              <td colSpan={3}>No announcements</td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className='dashboard-card page-section'>
                  <h2 className='data-section-title'>Profile updates</h2>
                  <div className='data-table-wrap'>
                    <table className='data-table'>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Date</th>
                          <th>Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profileUpdates.length
                          ? (
                            profileUpdates.map((a) => (
                              <tr key={a.id}>
                                <td>{a.title}</td>
                                <td>{a.date}</td>
                                <td>{a.type ?? '—'}</td>
                              </tr>
                            ))
                          )
                          : (
                            <tr>
                              <td colSpan={3}>No profile updates</td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
            {tab === 'financials' && (
              <>
                <div className='dashboard-filter-row'>
                  <label className='dashboard-filter-label'>
                    Period (year–month):
                    <input
                      type='month'
                      value={financialPeriod}
                      onChange={(e) => setFinancialPeriod(e.target.value)}
                      className='dashboard-filter-input'
                    />
                  </label>
                </div>
                <div className='dashboard-card page-section'>
                  <h2 className='data-section-title'>Financial Ratios — {financialPeriod}</h2>
                  <div className='data-table-wrap'>
                    <table className='data-table'>
                      <thead>
                        <tr>
                          <th>Period</th>
                          <th className='num'>PER</th>
                          <th className='num'>PBV</th>
                          <th className='num'>ROE</th>
                          <th className='num'>DER</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ratiosApi.loading
                          ? (
                            <tr>
                              <td colSpan={5}>Loading…</td>
                            </tr>
                          )
                          : ratios.length
                          ? (
                            ratios.map((r, i) => (
                              <tr key={String(r.period ?? i)}>
                                <td>{String(r.period ?? '—')}</td>
                                <td className='num'>{r.per != null ? String(r.per) : '—'}</td>
                                <td className='num'>{r.pbv != null ? String(r.pbv) : '—'}</td>
                                <td className='num'>{r.roe != null ? String(r.roe) : '—'}</td>
                                <td className='num'>{r.der != null ? String(r.der) : '—'}</td>
                              </tr>
                            ))
                          )
                          : (
                            <tr>
                              <td colSpan={5}>No ratios</td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className='dashboard-card page-section'>
                  <h2 className='data-section-title'>
                    Financial Reports — year {financialPeriod.slice(0, 4)}
                  </h2>
                  <div className='data-table-wrap'>
                    <table className='data-table'>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Period</th>
                          <th>Year</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {companyReports.loading
                          ? (
                            <tr>
                              <td colSpan={4}>Loading…</td>
                            </tr>
                          )
                          : reports.length
                          ? (
                            reports.map((r, i) => (
                              <tr key={r.id ?? i}>
                                <td>{r.title ?? '—'}</td>
                                <td>{r.period ?? '—'}</td>
                                <td>{r.year ?? '—'}</td>
                                <td>
                                  {r.url
                                    ? (
                                      <a href={r.url} className='news-card-link'>
                                        Link
                                      </a>
                                    )
                                    : (
                                      '—'
                                    )}
                                </td>
                              </tr>
                            ))
                          )
                          : (
                            <tr>
                              <td colSpan={4}>No reports</td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
            {tab === 'trading' && (
              <>
                <div className='dashboard-filter-row'>
                  <label className='dashboard-filter-label'>
                    Date from:
                    <input
                      type='date'
                      value={tradingDateFrom}
                      onChange={(e) => setTradingDateFrom(e.target.value)}
                      className='dashboard-filter-input'
                    />
                  </label>
                  <label className='dashboard-filter-label'>
                    Date to:
                    <input
                      type='date'
                      value={tradingDateTo}
                      onChange={(e) => setTradingDateTo(e.target.value)}
                      className='dashboard-filter-input'
                    />
                  </label>
                </div>
                <div className='dashboard-card page-section'>
                  <h2 className='data-section-title'>
                    Trading history (OHLC) — {tradingDateFrom} to {tradingDateTo}
                  </h2>
                  <div className='data-table-wrap'>
                    <table className='data-table'>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th className='num'>Open</th>
                          <th className='num'>High</th>
                          <th className='num'>Low</th>
                          <th className='num'>Close</th>
                          <th className='num'>Volume</th>
                          <th className='num'>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tradingDaily.loading
                          ? (
                            <tr>
                              <td colSpan={7}>Loading…</td>
                            </tr>
                          )
                          : tradingHistoryRaw.length
                          ? (
                            tradingHistoryRaw.map((row) => (
                              <tr key={row.date ?? ''}>
                                <td>{row.date ?? '—'}</td>
                                <td className='num'>{(Number(row.open) || 0).toLocaleString()}</td>
                                <td className='num'>{(Number(row.high) || 0).toLocaleString()}</td>
                                <td className='num'>{(Number(row.low) || 0).toLocaleString()}</td>
                                <td className='num'>{(Number(row.close) || 0).toLocaleString()}</td>
                                <td className='num'>
                                  {(Number(row.volume) || 0).toLocaleString()}
                                </td>
                                <td className='num'>{(Number(row.value) || 0).toLocaleString()}</td>
                              </tr>
                            ))
                          )
                          : (
                            <tr>
                              <td colSpan={7}>No history</td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {dailySnapshot && (
                  <div className='dashboard-card page-section'>
                    <h2 className='data-section-title'>Daily snapshot (latest)</h2>
                    <div className='data-table-wrap'>
                      <table className='data-table'>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th className='num'>Open</th>
                            <th className='num'>High</th>
                            <th className='num'>Low</th>
                            <th className='num'>Close</th>
                            <th className='num'>Volume</th>
                            <th className='num'>Value</th>
                            <th className='num'>Freq</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{dailySnapshot.date}</td>
                            <td className='num'>{dailySnapshot.open.toLocaleString()}</td>
                            <td className='num'>{dailySnapshot.high.toLocaleString()}</td>
                            <td className='num'>{dailySnapshot.low.toLocaleString()}</td>
                            <td className='num'>{dailySnapshot.close.toLocaleString()}</td>
                            <td className='num'>{dailySnapshot.volume.toLocaleString()}</td>
                            <td className='num'>{dailySnapshot.value.toLocaleString()}</td>
                            <td className='num'>{dailySnapshot.frequency.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
            {tab === 'corporate' && (
              <>
                <div className='dashboard-card page-section'>
                  <h2 className='data-section-title'>Dividends</h2>
                  <div className='data-table-wrap'>
                    <table className='data-table'>
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Ex date</th>
                          <th>Payment date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dividendsApi.loading
                          ? (
                            <tr>
                              <td colSpan={4}>Loading…</td>
                            </tr>
                          )
                          : dividends.length
                          ? (
                            dividends.map((d, i) => (
                              <tr key={i}>
                                <td>{String((d as Record<string, unknown>)['type'] ?? '—')}</td>
                                <td>{String((d as Record<string, unknown>)['amount'] ?? '—')}</td>
                                <td>
                                  {String(
                                    (d as Record<string, unknown>)['exDate'] ??
                                      (d as Record<string, unknown>)['ex_date'] ??
                                      '—'
                                  )}
                                </td>
                                <td>
                                  {String(
                                    (d as Record<string, unknown>)['paymentDate'] ??
                                      (d as Record<string, unknown>)['payment_date'] ??
                                      '—'
                                  )}
                                </td>
                              </tr>
                            ))
                          )
                          : (
                            <tr>
                              <td colSpan={4}>No dividends</td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className='dashboard-card page-section'>
                  <h2 className='data-section-title'>Issued history</h2>
                  <div className='data-table-wrap'>
                    <table className='data-table'>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Type</th>
                          <th className='num'>Shares</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {companyIssued.loading
                          ? (
                            <tr>
                              <td colSpan={4}>Loading…</td>
                            </tr>
                          )
                          : issued.length
                          ? (
                            issued.map((item, idx) => {
                              const r = item as Record<string, unknown>
                              const shares = r['shares'] ?? r['totalShares']
                              return (
                                <tr key={idx}>
                                  <td>{String(r['date'] ?? '—')}</td>
                                  <td>{String(r['type'] ?? '—')}</td>
                                  <td className='num'>
                                    {typeof shares === 'number'
                                      ? shares.toLocaleString()
                                      : String(shares ?? '—')}
                                  </td>
                                  <td>{String(r['description'] ?? '—')}</td>
                                </tr>
                              )
                            })
                          )
                          : (
                            <tr>
                              <td colSpan={4}>No issued history</td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className='dashboard-card page-section'>
                  <h2 className='data-section-title'>Stock splits</h2>
                  <div className='data-table-wrap'>
                    <table className='data-table'>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Ratio</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {splitsApi.loading
                          ? (
                            <tr>
                              <td colSpan={3}>Loading…</td>
                            </tr>
                          )
                          : splits.length
                          ? (
                            splits.map((s, i) => {
                              const r = s as Record<string, unknown>
                              return (
                                <tr key={i}>
                                  <td>{String(r['date'] ?? '—')}</td>
                                  <td>{String(r['ratio'] ?? '—')}</td>
                                  <td>{String(r['description'] ?? '—')}</td>
                                </tr>
                              )
                            })
                          )
                          : (
                            <tr>
                              <td colSpan={3}>No splits</td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </>
        )
        : (
          !companyDetail.loading && (
            <div className='dashboard-card page-section'>
              <p className='dashboard-page-subtitle'>Company &quot;{code}&quot; not found.</p>
              <Link to={Config.paths.companies} className='news-card-link'>
                Back to Companies
              </Link>
            </div>
          )
        )}
    </div>
  )
}
