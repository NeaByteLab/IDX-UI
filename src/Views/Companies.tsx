import React, { useMemo, useState } from 'react'
import type { JSX } from 'react'
import { Link } from 'react-router-dom'
import {
  mockDelistings,
  mockNewListings,
  mockRelistings,
  mockSecuritiesList,
  mockSuspendedList
} from '@app/Mock/index.ts'
import { paths } from '@app/Config/Routes.ts'

type TabId = 'listed' | 'suspended' | 'new' | 'delisted' | 'relisted'

const sectors = ['', 'Finance', 'Consumer', 'Infrastructure', 'Technology']
const boards = ['', 'Main', 'Development']

export function Companies(): JSX.Element {
  const [tab, setTab] = useState<TabId>('listed')
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('')
  const [board, setBoard] = useState('')
  const [periodYearMonth, setPeriodYearMonth] = useState('2025-02')
  const filteredList = useMemo(() => {
    if (tab !== 'listed') {
      return []
    }
    let list = mockSecuritiesList
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (s) => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
      )
    }
    if (sector) {
      list = list.filter((s) => s.sector === sector)
    }
    if (board) {
      list = list.filter((s) => s.board === board)
    }
    return list
  }, [tab, search, sector, board])
  const filteredNewListings = useMemo(
    () => mockNewListings.filter((row) => row.listingDate.slice(0, 7) === periodYearMonth),
    [periodYearMonth]
  )
  const filteredDelistings = useMemo(
    () => mockDelistings.filter((row) => row.delistingDate.slice(0, 7) === periodYearMonth),
    [periodYearMonth]
  )
  const filteredRelistings = useMemo(
    () => mockRelistings.filter((row) => row.relistingDate.slice(0, 7) === periodYearMonth),
    [periodYearMonth]
  )

  return (
    <div className='dashboard-overview'>
      <p className='dashboard-page-subtitle'>
        Company directory, suspended, new/delisted/relisted (mock)
      </p>
      <div className='dashboard-card page-section'>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          {(['listed', 'suspended', 'new', 'delisted', 'relisted'] as TabId[]).map((t) => (
            <button
              key={t}
              type='button'
              className='dashboard-sync-btn'
              style={{
                background: tab === t ? 'var(--primary)' : 'var(--bg-subtle)',
                color: tab === t ? 'white' : 'var(--text-main)'
              }}
              onClick={() => setTab(t)}
            >
              {t === 'listed'
                ? 'Listed'
                : t === 'suspended'
                ? 'Suspended'
                : t === 'new'
                ? 'New'
                : t === 'delisted'
                ? 'Delisted'
                : 'Relisted'}
            </button>
          ))}
          {(tab === 'new' || tab === 'delisted' || tab === 'relisted') && (
            <label style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
              Period:
              <input
                type='month'
                value={periodYearMonth}
                onChange={(e) =>
                  setPeriodYearMonth(e.target.value)}
                style={{
                  marginLeft: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)'
                }}
              />
            </label>
          )}
          {tab === 'listed' && (
            <>
              <input
                type='search'
                placeholder='Search code or name...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  minWidth: '200px'
                }}
              />
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)'
                }}
              >
                {sectors.map((s) => <option key={s || '_'} value={s}>{s || 'All sectors'}</option>)}
              </select>
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)'
                }}
              >
                {boards.map((b) => <option key={b || '_'} value={b}>{b || 'All boards'}</option>)}
              </select>
            </>
          )}
        </div>
        {tab === 'listed' && (
          <>
            <h2 className='data-section-title'>Securities</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Sector</th>
                    <th>Board</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((row) => (
                    <tr key={row.code}>
                      <td>{row.code}</td>
                      <td>{row.name}</td>
                      <td>{row.sector ?? '—'}</td>
                      <td>{row.board ?? '—'}</td>
                      <td>
                        <Link to={paths.companyDetail(row.code)} className='news-card-link'>
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === 'suspended' && (
          <>
            <h2 className='data-section-title'>Suspended</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Suspend Date</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {mockSuspendedList.map((row) => (
                    <tr key={row.code}>
                      <td>{row.code}</td>
                      <td>{row.name}</td>
                      <td>{row.suspendDate}</td>
                      <td>{row.reason ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === 'new' && (
          <>
            <h2 className='data-section-title'>New Listings — {periodYearMonth}</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Listing Date</th>
                    <th className='num'>Shares</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNewListings.map((row) => (
                    <tr key={row.code}>
                      <td>{row.code}</td>
                      <td>{row.name}</td>
                      <td>{row.listingDate}</td>
                      <td className='num'>{row.shares.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === 'delisted' && (
          <>
            <h2 className='data-section-title'>Delistings — {periodYearMonth}</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Delisting Date</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDelistings.length
                    ? filteredDelistings.map((row) => (
                      <tr key={row.code}>
                        <td>{row.code}</td>
                        <td>{row.name}</td>
                        <td>{row.delistingDate}</td>
                        <td>{row.reason ?? '—'}</td>
                      </tr>
                    ))
                    : (
                      <tr>
                        <td colSpan={4}>No data for period (mock)</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === 'relisted' && (
          <>
            <h2 className='data-section-title'>Relistings — {periodYearMonth}</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Relisting Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRelistings.length
                    ? filteredRelistings.map((row) => (
                      <tr key={row.code}>
                        <td>{row.code}</td>
                        <td>{row.name}</td>
                        <td>{row.relistingDate}</td>
                      </tr>
                    ))
                    : (
                      <tr>
                        <td colSpan={3}>No data for period (mock)</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
