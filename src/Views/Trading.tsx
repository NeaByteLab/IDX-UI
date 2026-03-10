import React, { useMemo, useState } from 'react'
import type { JSX } from 'react'
import {
  mockBrokerSummary,
  mockIndustryTrading,
  mockMostActiveByFrequency,
  mockMostActiveByValue,
  mockMostActiveByVolume,
  mockStockSummary,
  mockTradeSummary
} from '@app/Mock/index.ts'

type TradingTab =
  | 'summary'
  | 'stock'
  | 'activeVolume'
  | 'activeValue'
  | 'activeFreq'
  | 'industry'
  | 'broker'

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
  minWidth: '220px'
} as const

const tabLabels: Record<TradingTab, string> = {
  summary: 'Trade Summary',
  stock: 'Stock Summary',
  activeVolume: 'Most Active (Vol)',
  activeValue: 'Most Active (Value)',
  activeFreq: 'Most Active (Freq)',
  industry: 'Industry',
  broker: 'Broker Summary'
}

export function Trading(): JSX.Element {
  const [tab, setTab] = useState<TradingTab>('summary')
  const [periodYearMonth, setPeriodYearMonth] = useState('2025-03')
  const [stockSearch, setStockSearch] = useState('')
  const filteredTradeSummary = useMemo(
    () => mockTradeSummary.filter((row) => row.date.slice(0, 7) === periodYearMonth),
    [periodYearMonth]
  )
  const filteredStockSummary = useMemo(() => {
    let list = mockStockSummary.filter((row) => row.date.slice(0, 7) === periodYearMonth)
    const q = stockSearch.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (row) => row.code.toLowerCase().includes(q) || row.name.toLowerCase().includes(q)
      )
    }
    return list
  }, [periodYearMonth, stockSearch])
  const filteredBrokerSummary = useMemo(
    () => mockBrokerSummary.filter((row) => row.date.slice(0, 7) === periodYearMonth),
    [periodYearMonth]
  )
  const filteredIndustry = useMemo(
    () => mockIndustryTrading.filter((row) => row.date.slice(0, 7) === periodYearMonth),
    [periodYearMonth]
  )

  return (
    <div className='dashboard-overview'>
      <p className='dashboard-page-subtitle'>
        Stock summary, most active, industry, broker — one tab per dataset (mock)
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
          Period (month &amp; year):
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
          {(Object.keys(tabLabels) as TradingTab[]).map((t) => (
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
        {tab === 'summary' && (
          <>
            <h2 className='data-section-title'>Trade Summary — {periodYearMonth}</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th className='num'>Volume</th>
                    <th className='num'>Value</th>
                    <th className='num'>Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTradeSummary.length
                    ? (
                      filteredTradeSummary.map((row) => (
                        <tr key={row.id}>
                          <td>{row.date}</td>
                          <td className='num'>{row.volume.toLocaleString()}</td>
                          <td className='num'>{row.value.toLocaleString()}</td>
                          <td className='num'>{row.frequency.toLocaleString()}</td>
                        </tr>
                      ))
                    )
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
        {tab === 'stock' && (
          <>
            <input
              type='search'
              placeholder='Search by code or name...'
              value={stockSearch}
              onChange={(e) => setStockSearch(e.target.value)}
              style={searchInputStyle}
            />
            <h2 className='data-section-title'>Stock Summary (OHLC) — {periodYearMonth}</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th className='num'>Open</th>
                    <th className='num'>High</th>
                    <th className='num'>Low</th>
                    <th className='num'>Close</th>
                    <th className='num'>Vol</th>
                    <th className='num'>Value</th>
                    <th className='num'>Foreign Net</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStockSummary.length
                    ? filteredStockSummary.map((row) => (
                      <tr key={row.id}>
                        <td>{row.code}</td>
                        <td>{row.name}</td>
                        <td>{row.date}</td>
                        <td className='num'>{row.price.open.toLocaleString()}</td>
                        <td className='num'>{row.price.high.toLocaleString()}</td>
                        <td className='num'>{row.price.low.toLocaleString()}</td>
                        <td className='num'>{row.price.close.toLocaleString()}</td>
                        <td className='num'>{row.trading.volume.toLocaleString()}</td>
                        <td className='num'>{row.trading.value.toLocaleString()}</td>
                        <td className='num'>
                          {row.foreign ? row.foreign.net.toLocaleString() : '—'}
                        </td>
                      </tr>
                    ))
                    : (
                      <tr>
                        <td colSpan={10}>No data for period or no match (mock)</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === 'activeVolume' && (
          <>
            <h2 className='data-section-title'>Most Active (Volume) — {periodYearMonth}</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th className='num'>Volume</th>
                    <th className='num'>Value</th>
                    <th className='num'>Freq</th>
                  </tr>
                </thead>
                <tbody>
                  {mockMostActiveByVolume.map((row) => (
                    <tr key={row.code}>
                      <td>{row.code}</td>
                      <td>{row.name}</td>
                      <td className='num'>{row.volume.toLocaleString()}</td>
                      <td className='num'>{row.value.toLocaleString()}</td>
                      <td className='num'>{row.frequency.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === 'activeValue' && (
          <>
            <h2 className='data-section-title'>Most Active (Value) — {periodYearMonth}</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th className='num'>Volume</th>
                    <th className='num'>Value</th>
                    <th className='num'>Freq</th>
                  </tr>
                </thead>
                <tbody>
                  {mockMostActiveByValue.map((row) => (
                    <tr key={row.code}>
                      <td>{row.code}</td>
                      <td>{row.name}</td>
                      <td className='num'>{row.volume.toLocaleString()}</td>
                      <td className='num'>{row.value.toLocaleString()}</td>
                      <td className='num'>{row.frequency.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === 'activeFreq' && (
          <>
            <h2 className='data-section-title'>Most Active (Frequency) — {periodYearMonth}</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th className='num'>Volume</th>
                    <th className='num'>Value</th>
                    <th className='num'>Freq</th>
                  </tr>
                </thead>
                <tbody>
                  {mockMostActiveByFrequency.map((row) => (
                    <tr key={row.code}>
                      <td>{row.code}</td>
                      <td>{row.name}</td>
                      <td className='num'>{row.volume.toLocaleString()}</td>
                      <td className='num'>{row.value.toLocaleString()}</td>
                      <td className='num'>{row.frequency.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === 'industry' && (
          <>
            <h2 className='data-section-title'>Industry Trading — {periodYearMonth}</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Industry</th>
                    <th className='num'>Volume</th>
                    <th className='num'>Value</th>
                    <th className='num'>Market Cap</th>
                    <th className='num'>Members</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIndustry.length
                    ? filteredIndustry.map((row, i) => (
                      <tr key={row.industry + row.date + i}>
                        <td>{row.date}</td>
                        <td>{row.industry}</td>
                        <td className='num'>{row.volume.toLocaleString()}</td>
                        <td className='num'>{row.value.toLocaleString()}</td>
                        <td className='num'>{row.marketCap.toLocaleString()}</td>
                        <td className='num'>{row.members}</td>
                      </tr>
                    ))
                    : (
                      <tr>
                        <td colSpan={6}>No data for period (mock)</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === 'broker' && (
          <>
            <h2 className='data-section-title'>Broker Summary — {periodYearMonth}</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Broker Code</th>
                    <th>Broker Name</th>
                    <th className='num'>Total Value</th>
                    <th className='num'>Volume</th>
                    <th className='num'>Frequency</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBrokerSummary.length
                    ? filteredBrokerSummary.map((row) => (
                      <tr key={row.id}>
                        <td>{row.brokerCode}</td>
                        <td>{row.brokerName}</td>
                        <td className='num'>{row.totalValue.toLocaleString()}</td>
                        <td className='num'>{row.volume.toLocaleString()}</td>
                        <td className='num'>{row.frequency.toLocaleString()}</td>
                        <td>{row.date}</td>
                      </tr>
                    ))
                    : (
                      <tr>
                        <td colSpan={6}>No data for period (mock)</td>
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
