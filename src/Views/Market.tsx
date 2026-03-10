import React, { useMemo, useState } from 'react'
import type { JSX } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import {
  mockForeignFlow,
  mockIndexChart,
  mockIndexList,
  mockIndexSummary,
  mockSectoralMovement,
  mockTopGainers,
  mockTopLosers
} from '@app/Mock/index.ts'

type MarketTab =
  | 'chart'
  | 'indexList'
  | 'indexSummary'
  | 'sectoral'
  | 'gainers'
  | 'losers'
  | 'foreignFlow'

const filterInputStyle = {
  marginLeft: '0.5rem',
  padding: '0.5rem 0.75rem',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-light)'
} as const

const searchInputStyle = {
  marginBottom: '0.75rem',
  padding: '0.5rem 0.75rem',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-light)',
  minWidth: '200px'
} as const

const tabLabels: Record<MarketTab, string> = {
  chart: 'Index Chart',
  indexList: 'Index List',
  indexSummary: 'Index Summary',
  sectoral: 'Sectoral',
  gainers: 'Top Gainers',
  losers: 'Top Losers',
  foreignFlow: 'Foreign Flow'
}

export function Market(): JSX.Element {
  const [tab, setTab] = useState<MarketTab>('chart')
  const [selectedIndex, setSelectedIndex] = useState('IHSG')
  const [selectedDate, setSelectedDate] = useState('2025-03-10')
  const [periodYearMonth, setPeriodYearMonth] = useState('2025-03')
  const [indexSearch, setIndexSearch] = useState('')
  const chartData = useMemo(() => {
    const upTo = selectedDate
    return mockIndexChart
      .filter((p) => p.date <= upTo)
      .map((p) => ({ ...p, name: p.date }))
  }, [selectedDate])
  const sectoralTable = useMemo(
    () =>
      mockSectoralMovement.map((s) => ({
        name: s.name,
        lastChange: s.points[s.points.length - 1]?.change ?? 0
      })),
    []
  )
  const filteredIndexList = useMemo(() => {
    const q = indexSearch.trim().toLowerCase()
    if (!q) {
      return mockIndexList
    }
    return mockIndexList.filter((row) => row.code.toLowerCase().includes(q))
  }, [indexSearch])
  const filteredIndexSummary = useMemo(
    () => mockIndexSummary.filter((row) => row.date === selectedDate),
    [selectedDate]
  )
  const filteredForeignFlow = useMemo(
    () => mockForeignFlow.filter((row) => row.date === selectedDate),
    [selectedDate]
  )

  return (
    <div className='dashboard-overview'>
      <p className='dashboard-page-subtitle'>
        Indices, sectoral, gainers/losers, foreign flow — one tab per dataset (mock)
      </p>
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
          Index:
          <select
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(e.target.value)}
            style={filterInputStyle}
          >
            {mockIndexList.map((row) => <option key={row.code} value={row.code}>{row.code}
            </option>)}
          </select>
        </label>
        <label style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
          Date:
          <input
            type='date'
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={filterInputStyle}
          />
        </label>
        <label style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
          Period (year–month):
          <input
            type='month'
            value={periodYearMonth}
            onChange={(e) => setPeriodYearMonth(e.target.value)}
            style={filterInputStyle}
          />
        </label>
      </div>
      <div className='dashboard-card page-section'>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {(Object.keys(tabLabels) as MarketTab[]).map((t) => (
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
              {tabLabels[t]}
            </button>
          ))}
        </div>
        {tab === 'chart' && (
          <>
            <h2 className='data-section-title'>Index Chart — {selectedIndex}</h2>
            <div className='ingestion-chart-wrap'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    stroke='var(--border-light)'
                  />
                  <XAxis
                    dataKey='name'
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', fontSize: '11px' }}
                  />
                  <Line
                    type='monotone'
                    dataKey='value'
                    stroke='var(--primary)'
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
        {tab === 'indexList' && (
          <>
            <input
              type='search'
              placeholder='Search by index code...'
              value={indexSearch}
              onChange={(e) => setIndexSearch(e.target.value)}
              style={searchInputStyle}
            />
            <h2 className='data-section-title'>Index List</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th className='num'>Close</th>
                    <th className='num'>Change</th>
                    <th className='num'>%</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIndexList.map((row) => (
                    <tr key={row.code}>
                      <td>{row.code}</td>
                      <td className='num'>{row.close}</td>
                      <td
                        className={'num ' + (row.percent.startsWith('+') ? 'positive' : 'negative')}
                      >
                        {row.change}
                      </td>
                      <td
                        className={'num ' + (row.percent.startsWith('+') ? 'positive' : 'negative')}
                      >
                        {row.percent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === 'indexSummary' && (
          <>
            <h2 className='data-section-title'>Index Summary — date: {selectedDate}</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th className='num'>Close</th>
                    <th className='num'>Change %</th>
                    <th className='num'>Volume</th>
                    <th className='num'>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIndexSummary.length
                    ? filteredIndexSummary.map((row) => (
                      <tr key={row.id}>
                        <td>{row.code}</td>
                        <td>{row.name}</td>
                        <td>{row.date}</td>
                        <td className='num'>{row.price.close.toLocaleString()}</td>
                        <td className={'num ' + (row.price.percent >= 0 ? 'positive' : 'negative')}>
                          {row.price.percent}%
                        </td>
                        <td className='num'>{row.trading.volume.toLocaleString()}</td>
                        <td className='num'>{row.trading.value.toLocaleString()}</td>
                      </tr>
                    ))
                    : (
                      <tr>
                        <td colSpan={8}>No data for selected date (mock)</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === 'sectoral' && (
          <>
            <h2 className='data-section-title'>Sectoral Movement — period: {periodYearMonth}</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Sector</th>
                    <th className='num'>Change % (last)</th>
                  </tr>
                </thead>
                <tbody>
                  {sectoralTable.map((row) => (
                    <tr key={row.name}>
                      <td>{row.name}</td>
                      <td className={'num ' + (row.lastChange >= 0 ? 'positive' : 'negative')}>
                        {row.lastChange}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === 'gainers' && (
          <>
            <h2 className='data-section-title'>Top Gainers — {periodYearMonth}</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th className='num'>Previous</th>
                    <th className='num'>Close</th>
                    <th className='num'>%</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTopGainers.map((row) => (
                    <tr key={row.code}>
                      <td>{row.code}</td>
                      <td>{row.name}</td>
                      <td className='num'>{row.previous.toLocaleString()}</td>
                      <td className='num'>{row.close.toLocaleString()}</td>
                      <td className='num positive'>{row.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === 'losers' && (
          <>
            <h2 className='data-section-title'>Top Losers — {periodYearMonth}</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th className='num'>Previous</th>
                    <th className='num'>Close</th>
                    <th className='num'>%</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTopLosers.map((row) => (
                    <tr key={row.code}>
                      <td>{row.code}</td>
                      <td>{row.name}</td>
                      <td className='num'>{row.previous.toLocaleString()}</td>
                      <td className='num'>{row.close.toLocaleString()}</td>
                      <td className='num negative'>{row.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === 'foreignFlow' && (
          <>
            <h2 className='data-section-title'>Foreign / Domestic Flow — date: {selectedDate}</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th className='num'>Buy Vol</th>
                    <th className='num'>Buy Value</th>
                    <th className='num'>Sell Vol</th>
                    <th className='num'>Sell Value</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredForeignFlow.length
                    ? filteredForeignFlow.map((row) => (
                      <tr key={row.date}>
                        <td>{row.date}</td>
                        <td className='num'>{row.buyVolume.toLocaleString()}</td>
                        <td className='num'>{row.buyValue.toLocaleString()}</td>
                        <td className='num'>{row.sellVolume.toLocaleString()}</td>
                        <td className='num'>{row.sellValue.toLocaleString()}</td>
                      </tr>
                    ))
                    : (
                      <tr>
                        <td colSpan={5}>No data for selected date (mock)</td>
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
