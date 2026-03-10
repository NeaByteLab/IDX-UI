import React, { useMemo, useState } from 'react'
import type { JSX } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  mockAnnouncements,
  mockCompanyProfile,
  mockDailySnapshot,
  mockDividends,
  mockFinancialRatios,
  mockFinancialReports,
  mockIssuedHistory,
  mockProfileAnnouncements,
  mockStockSplits,
  mockTradingHistory
} from '@app/Mock/index.ts'
import { paths } from '@app/Config/Routes.ts'

type DetailTab = 'overview' | 'announcements' | 'financials' | 'trading' | 'corporate'

const filterInputStyle = {
  marginLeft: '0.5rem',
  padding: '0.5rem 0.75rem',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-light)'
} as const

export function CompanyDetail(): JSX.Element {
  const { code } = useParams<{ code: string }>()
  const [tab, setTab] = useState<DetailTab>('overview')
  const [announcementDateFrom, setAnnouncementDateFrom] = useState('2025-01-01')
  const [announcementDateTo, setAnnouncementDateTo] = useState('2025-12-31')
  const [announcementSearch, setAnnouncementSearch] = useState('')
  const [financialPeriod, setFinancialPeriod] = useState('2024-12')
  const [tradingDateFrom, setTradingDateFrom] = useState('2025-01-01')
  const [tradingDateTo, setTradingDateTo] = useState('2025-12-31')
  const profile = code === mockCompanyProfile.code ? mockCompanyProfile : null
  const baseAnnouncements = useMemo(
    () => mockAnnouncements.filter((a) => a.code === (code ?? '')),
    [code]
  )
  const baseProfileUpdates = useMemo(
    () => mockProfileAnnouncements.filter((a) => a.code === (code ?? '')),
    [code]
  )
  const announcements = useMemo(() => {
    let list = baseAnnouncements.filter(
      (a) => a.date >= announcementDateFrom && a.date <= announcementDateTo
    )
    const q = announcementSearch.trim().toLowerCase()
    if (q) {
      list = list.filter((a) => a.title.toLowerCase().includes(q))
    }
    return list
  }, [baseAnnouncements, announcementDateFrom, announcementDateTo, announcementSearch])
  const profileUpdates = useMemo(() => {
    return baseProfileUpdates.filter(
      (a) => a.date >= announcementDateFrom && a.date <= announcementDateTo
    )
  }, [baseProfileUpdates, announcementDateFrom, announcementDateTo])
  const ratios = useMemo(() => {
    const byCode = mockFinancialRatios.filter((r) => r.code === (code ?? ''))
    return byCode.filter((r) => r.period === financialPeriod || !financialPeriod)
  }, [code, financialPeriod])
  const reports = useMemo(() => {
    const byCode = mockFinancialReports.filter((r) => r.code === (code ?? ''))
    const year = financialPeriod.slice(0, 4)
    if (!year) {
      return byCode
    }
    return byCode.filter((r) => String(r.year) === year)
  }, [code, financialPeriod])
  const tradingHistory = useMemo(() => {
    if (code !== mockCompanyProfile.code) {
      return []
    }
    return mockTradingHistory.filter(
      (row) => row.date >= tradingDateFrom && row.date <= tradingDateTo
    )
  }, [code, tradingDateFrom, tradingDateTo])
  const dailySnapshot = code === mockCompanyProfile.code ? mockDailySnapshot : null
  const dividends = mockDividends.filter((d) => d.code === (code ?? ''))
  const issued = mockIssuedHistory.filter((i) => i.code === (code ?? ''))
  const splits = mockStockSplits.filter((s) => s.code === (code ?? ''))

  if (!code) {
    return (
      <div className='dashboard-overview'>
        <p className='dashboard-page-subtitle'>No company code.</p>
        <Link to={paths.companies} className='news-card-link'>
          Back to Companies
        </Link>
      </div>
    )
  }

  const tabs: { id: DetailTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'financials', label: 'Financials' },
    { id: 'trading', label: 'Trading' },
    { id: 'corporate', label: 'Corporate actions' }
  ]

  return (
    <div className='dashboard-overview'>
      <p className='dashboard-page-subtitle'>
        Profile, announcements, financials, trading, corporate actions (mock)
      </p>
      <Link
        to={paths.companies}
        className='news-card-link'
        style={{ marginBottom: '1rem', display: 'inline-block' }}
      >
        ← Back to Companies
      </Link>
      {profile
        ? (
          <>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type='button'
                  className='dashboard-sync-btn'
                  style={{
                    background: tab === t.id ? 'var(--primary)' : 'var(--bg-subtle)',
                    color: tab === t.id ? 'white' : 'var(--text-main)'
                  }}
                  onClick={() => setTab(t.id)}
                >
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
                          <th style={{ width: '140px' }}>Code</th>
                          <td>{profile.code}</td>
                        </tr>
                        <tr>
                          <th>Name</th>
                          <td>{profile.name}</td>
                        </tr>
                        <tr>
                          <th>Sector</th>
                          <td>{profile.sector}</td>
                        </tr>
                        <tr>
                          <th>Sub sector</th>
                          <td>{profile.subSector}</td>
                        </tr>
                        <tr>
                          <th>Board</th>
                          <td>{profile.board}</td>
                        </tr>
                        <tr>
                          <th>Website</th>
                          <td>{profile.website ?? '—'}</td>
                        </tr>
                        <tr>
                          <th>Listing date</th>
                          <td>{profile.listingDate ?? '—'}</td>
                        </tr>
                        <tr>
                          <th>Total shares</th>
                          <td className='num'>{profile.totalShares?.toLocaleString() ?? '—'}</td>
                        </tr>
                        <tr>
                          <th>Description</th>
                          <td>{profile.description ?? '—'}</td>
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
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}
                >
                  <label style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                    Date from:
                    <input
                      type='date'
                      value={announcementDateFrom}
                      onChange={(e) => setAnnouncementDateFrom(e.target.value)}
                      style={filterInputStyle}
                    />
                  </label>
                  <label style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                    Date to:
                    <input
                      type='date'
                      value={announcementDateTo}
                      onChange={(e) => setAnnouncementDateTo(e.target.value)}
                      style={filterInputStyle}
                    />
                  </label>
                  <input
                    type='search'
                    placeholder='Search by title...'
                    value={announcementSearch}
                    onChange={(e) => setAnnouncementSearch(e.target.value)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-light)',
                      minWidth: '200px'
                    }}
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
                        {announcements.length
                          ? announcements.map((a) => (
                            <tr key={a.id}>
                              <td>{a.title}</td>
                              <td>{a.date}</td>
                              <td>{a.type ?? '—'}</td>
                            </tr>
                          ))
                          : (
                            <tr>
                              <td colSpan={3}>No announcements (mock)</td>
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
                          ? profileUpdates.map((a) => (
                            <tr key={a.id}>
                              <td>{a.title}</td>
                              <td>{a.date}</td>
                              <td>{a.type ?? '—'}</td>
                            </tr>
                          ))
                          : (
                            <tr>
                              <td colSpan={3}>No profile updates (mock)</td>
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
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}
                >
                  <label style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                    Period (year–month):
                    <input
                      type='month'
                      value={financialPeriod}
                      onChange={(e) => setFinancialPeriod(e.target.value)}
                      style={filterInputStyle}
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
                        {ratios.length
                          ? ratios.map((r, i) => (
                            <tr key={r.period + i}>
                              <td>{r.period}</td>
                              <td className='num'>{r.per ?? '—'}</td>
                              <td className='num'>{r.pbv ?? '—'}</td>
                              <td className='num'>{r.roe ?? '—'}</td>
                              <td className='num'>{r.der ?? '—'}</td>
                            </tr>
                          ))
                          : (
                            <tr>
                              <td colSpan={5}>No ratios (mock)</td>
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
                        {reports.length
                          ? reports.map((r) => (
                            <tr key={r.id}>
                              <td>{r.title}</td>
                              <td>{r.period}</td>
                              <td>{r.year}</td>
                              <td>
                                {r.url ? <a href={r.url} className='news-card-link'>Link</a> : '—'}
                              </td>
                            </tr>
                          ))
                          : (
                            <tr>
                              <td colSpan={4}>No reports (mock)</td>
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
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}
                >
                  <label style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                    Date from:
                    <input
                      type='date'
                      value={tradingDateFrom}
                      onChange={(e) => setTradingDateFrom(e.target.value)}
                      style={filterInputStyle}
                    />
                  </label>
                  <label style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                    Date to:
                    <input
                      type='date'
                      value={tradingDateTo}
                      onChange={(e) => setTradingDateTo(e.target.value)}
                      style={filterInputStyle}
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
                        {tradingHistory.length
                          ? tradingHistory.map((row) => (
                            <tr key={row.date}>
                              <td>{row.date}</td>
                              <td className='num'>{row.open.toLocaleString()}</td>
                              <td className='num'>{row.high.toLocaleString()}</td>
                              <td className='num'>{row.low.toLocaleString()}</td>
                              <td className='num'>{row.close.toLocaleString()}</td>
                              <td className='num'>{row.volume.toLocaleString()}</td>
                              <td className='num'>{row.value.toLocaleString()}</td>
                            </tr>
                          ))
                          : (
                            <tr>
                              <td colSpan={7}>No history (mock)</td>
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
                        {dividends.length
                          ? dividends.map((d) => (
                            <tr key={d.exDate + d.amount}>
                              <td>{d.type}</td>
                              <td>{d.amount}</td>
                              <td>{d.exDate}</td>
                              <td>{d.paymentDate}</td>
                            </tr>
                          ))
                          : (
                            <tr>
                              <td colSpan={4}>No dividends (mock)</td>
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
                        {issued.length
                          ? issued.map((i, idx) => (
                            <tr key={i.date + idx}>
                              <td>{i.date}</td>
                              <td>{i.type}</td>
                              <td className='num'>{i.shares.toLocaleString()}</td>
                              <td>{i.description ?? '—'}</td>
                            </tr>
                          ))
                          : (
                            <tr>
                              <td colSpan={4}>No issued history (mock)</td>
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
                        {splits.length
                          ? splits.map((s) => (
                            <tr key={s.date}>
                              <td>{s.date}</td>
                              <td>{s.ratio}</td>
                              <td>{s.description ?? '—'}</td>
                            </tr>
                          ))
                          : (
                            <tr>
                              <td colSpan={3}>No splits (mock)</td>
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
          <div className='dashboard-card page-section'>
            <p className='dashboard-page-subtitle'>
              Company &quot;{code}&quot; not in mock. Only BBCA has mock profile.
            </p>
            <Link to={paths.companies} className='news-card-link'>Back to Companies</Link>
          </div>
        )}
    </div>
  )
}
