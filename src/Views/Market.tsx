import React, { type JSX, useMemo, useState } from 'react'
import {
  BarChart2,
  Globe,
  LineChart as ChartIcon,
  List,
  PieChart,
  TrendingDown,
  TrendingUp
} from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import * as Components from '@app/Components/index.ts'
import * as Hooks from '@app/Hooks/index.ts'
import * as Utils from '@app/Utils/index.ts'
import type * as Types from '@app/Types/index.ts'

const tabLabels: Record<Types.MarketTab, string> = {
  chart: 'Index Chart',
  indexList: 'Index List',
  indexSummary: 'Index Summary',
  sectoral: 'Sectoral',
  gainers: 'Top Gainers',
  losers: 'Top Losers',
  foreignFlow: 'Foreign Flow'
}

const marketTabIcons: Record<Types.MarketTab, typeof ChartIcon> = {
  chart: ChartIcon,
  indexList: List,
  indexSummary: BarChart2,
  sectoral: PieChart,
  gainers: TrendingUp,
  losers: TrendingDown,
  foreignFlow: Globe
}

function parseYearMonth(ym: string): { year: number; month: number } | null {
  if (!ym || ym.length < 7) {
    return null
  }
  const y = parseInt(ym.slice(0, 4), 10)
  const m = parseInt(ym.slice(5, 7), 10)
  if (Number.isNaN(y) || Number.isNaN(m) || m < 1 || m > 12) {
    return null
  }
  return { year: y, month: m }
}

const defaultPageSize = 20

export function Market(): JSX.Element {
  const [tab, setTab] = useState<Types.MarketTab>('chart')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(defaultPageSize)
  const [selectedIndex, setSelectedIndex] = useState('IHSG')
  const [selectedDate, setSelectedDate] = useState('2025-03-10')
  const [periodYearMonth, setPeriodYearMonth] = useState('2025-03')
  const [indexSearch, setIndexSearch] = useState('')
  const period = useMemo(() => parseYearMonth(periodYearMonth), [periodYearMonth])
  const indicesParams = useMemo(
    () => ({
      limit: pageSize,
      offset: Utils.pageToOffset(page, pageSize),
      includeTotal: true as const
    }),
    [page, pageSize]
  )
  const indices = Hooks.useMarketIndices(indicesParams)
  const indexChart = Hooks.useMarketIndexChart(selectedIndex, { period: '1M', limit: 100 })
  const indexSummaryParams = useMemo(
    () => ({
      date: selectedDate,
      limit: pageSize,
      offset: Utils.pageToOffset(page, pageSize),
      includeTotal: true as const
    }),
    [selectedDate, page, pageSize]
  )
  const indexSummary = Hooks.useMarketIndexSummary(indexSummaryParams)
  const sectoralParams = useMemo(
    () =>
      period
        ? {
          year: period.year,
          month: period.month,
          limit: pageSize,
          offset: Utils.pageToOffset(page, pageSize),
          includeTotal: true as const
        }
        : null,
    [period, page, pageSize]
  )
  const sectoral = Hooks.useMarketSectoralMovement(sectoralParams)
  const topGainersParams = useMemo(
    () =>
      period
        ? {
          year: period.year,
          month: period.month,
          limit: pageSize,
          offset: Utils.pageToOffset(page, pageSize),
          includeTotal: true as const
        }
        : null,
    [period, page, pageSize]
  )
  const topGainers = Hooks.useTradingTopGainer(topGainersParams)
  const topLosersParams = useMemo(
    () =>
      period
        ? {
          year: period.year,
          month: period.month,
          limit: pageSize,
          offset: Utils.pageToOffset(page, pageSize),
          includeTotal: true as const
        }
        : null,
    [period, page, pageSize]
  )
  const topLosers = Hooks.useTradingTopLoser(topLosersParams)
  const foreignFlowParams = useMemo(
    () =>
      period
        ? {
          year: period.year,
          month: period.month,
          limit: pageSize,
          offset: Utils.pageToOffset(page, pageSize),
          includeTotal: true as const
        }
        : null,
    [period, page, pageSize]
  )
  const foreignFlow = Hooks.useTradingForeign(foreignFlowParams)
  const indexListRaw = (indices.data ?? []) as {
    code?: string
    name?: string
    close?: number
    change?: number
    [k: string]: unknown
  }[]
  const chartData = useMemo(() => {
    const list = (indexChart.data ?? []) as { date?: string; value?: number; close?: number }[]
    return list.map((p) => ({
      ...p,
      name: p.date ?? '',
      value: Number(p.value ?? p.close ?? 0)
    }))
  }, [indexChart.data])
  const sectoralTable = useMemo(() => {
    const list = (sectoral.data ?? []) as { name?: string; change?: number; [k: string]: unknown }[]
    return list.map((s) => ({
      name: String(s?.name ?? '—'),
      lastChange: Number(s?.change ?? 0)
    }))
  }, [sectoral.data])
  const filteredIndexList = useMemo(() => {
    const q = indexSearch.trim().toLowerCase()
    if (!q) {
      return indexListRaw
    }
    return indexListRaw.filter((row) =>
      String(row?.code ?? '')
        .toLowerCase()
        .includes(q)
    )
  }, [indexSearch, indexListRaw])
  const filteredIndexSummary = (indexSummary.data ?? []) as {
    code?: string
    name?: string
    date?: string
    [k: string]: unknown
  }[]
  const foreignList = (foreignFlow.data ?? []) as {
    date?: string
    buyVolume?: number
    buyValue?: number
    sellVolume?: number
    sellValue?: number
    [k: string]: unknown
  }[]

  return (
    <div className='dashboard-overview'>
      <div className='dashboard-filter-row'>
        <label className='dashboard-filter-label'>
          Index:
          <select
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(e.target.value)}
            className='dashboard-filter-input'
          >
            {indexListRaw.length
              ? (
                indexListRaw.map((row) => (
                  <option key={String(row.code)} value={String(row.code ?? '')}>
                    {String(row.code ?? row.name ?? '')}
                  </option>
                ))
              )
              : <option value={selectedIndex}>{selectedIndex}</option>}
          </select>
        </label>
        <label className='dashboard-filter-label'>
          Date:
          <input
            type='date'
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className='dashboard-filter-input'
          />
        </label>
        <label className='dashboard-filter-label'>
          Period (year–month):
          <input
            type='month'
            value={periodYearMonth}
            onChange={(e) => setPeriodYearMonth(e.target.value)}
            className='dashboard-filter-input'
          />
        </label>
      </div>
      <div className='dashboard-card page-section'>
        <div className='dashboard-tabs-row'>
          {(Object.keys(tabLabels) as Types.MarketTab[]).map((t) => {
            const Icon = marketTabIcons[t]
            return (
              <button
                key={t}
                type='button'
                className={tab === t ? 'dashboard-sync-btn is-primary' : 'dashboard-sync-btn'}
                onClick={() => {
                  setTab(t)
                  setPage(1)
                }}
              >
                <Icon size={18} aria-hidden />
                {tabLabels[t]}
              </button>
            )
          })}
        </div>
        {tab === 'chart' && (
          <>
            <h2 className='data-section-title'>Index Chart — {selectedIndex}</h2>
            {indexChart.loading && <p>Loading chart…</p>}
            {indexChart.error && !indexChart.loading && (
              <p className='dashboard-error-text'>
                {(indexChart.error as { error?: string }).error ?? 'Error'}
              </p>
            )}
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
              className='dashboard-search-input'
            />
            <h2 className='data-section-title'>Index List</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th className='num'>Close</th>
                    <th className='num'>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {indices.loading
                    ? (
                      <tr>
                        <td colSpan={4}>Loading…</td>
                      </tr>
                    )
                    : filteredIndexList.length
                    ? (
                      filteredIndexList.map((row) => (
                        <tr key={String(row.code)}>
                          <td>{String(row.code ?? '—')}</td>
                          <td>{String(row.name ?? '—')}</td>
                          <td className='num'>{row.close != null ? String(row.close) : '—'}</td>
                          <td className='num'>{row.change != null ? String(row.change) : '—'}</td>
                        </tr>
                      ))
                    )
                    : (
                      <tr>
                        <td colSpan={4}>No indices</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            <Components.PaginationBar
              page={page}
              pageSize={pageSize}
              total={indices.meta?.total ?? 0}
              onPageChange={setPage}
              loading={indices.loading}
              itemCount={filteredIndexList.length}
            />
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
                  {indexSummary.loading
                    ? (
                      <tr>
                        <td colSpan={8}>Loading…</td>
                      </tr>
                    )
                    : filteredIndexSummary.length
                    ? (
                      filteredIndexSummary.map((row, i) => {
                        const price = row['price'] as
                          | { close?: number; percent?: number }
                          | undefined
                        const trading = row['trading'] as
                          | { volume?: number; value?: number }
                          | undefined
                        return (
                          <tr key={(row as { id?: number }).id ?? i}>
                            <td>{String(row.code ?? '—')}</td>
                            <td>{String(row.name ?? '—')}</td>
                            <td>{String(row.date ?? '—')}</td>
                            <td className='num'>
                              {price?.close != null ? price.close.toLocaleString() : '—'}
                            </td>
                            <td
                              className={'num ' +
                                (Number(price?.percent ?? 0) >= 0 ? 'positive' : 'negative')}
                            >
                              {price?.percent != null ? `${price.percent}%` : '—'}
                            </td>
                            <td className='num'>
                              {trading?.volume != null ? trading.volume.toLocaleString() : '—'}
                            </td>
                            <td className='num'>
                              {trading?.value != null ? trading.value.toLocaleString() : '—'}
                            </td>
                          </tr>
                        )
                      })
                    )
                    : (
                      <tr>
                        <td colSpan={8}>No data for selected date</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            <Components.PaginationBar
              page={page}
              pageSize={pageSize}
              total={indexSummary.meta?.total ?? 0}
              onPageChange={setPage}
              loading={indexSummary.loading}
              itemCount={filteredIndexSummary.length}
            />
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
                  {sectoral.loading
                    ? (
                      <tr>
                        <td colSpan={2}>Loading…</td>
                      </tr>
                    )
                    : sectoralTable.length
                    ? (
                      sectoralTable.map((row, i) => (
                        <tr key={`${row.name}-${i}`}>
                          <td>{row.name}</td>
                          <td className={'num ' + (row.lastChange >= 0 ? 'positive' : 'negative')}>
                            {row.lastChange}%
                          </td>
                        </tr>
                      ))
                    )
                    : (
                      <tr>
                        <td colSpan={2}>No sectoral data</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            <Components.PaginationBar
              page={page}
              pageSize={pageSize}
              total={sectoral.meta?.total ?? 0}
              onPageChange={setPage}
              loading={sectoral.loading}
              itemCount={sectoralTable.length}
            />
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
                  {topGainers.loading
                    ? (
                      <tr>
                        <td colSpan={5}>Loading…</td>
                      </tr>
                    )
                    : (topGainers.data ?? []).length
                    ? (
                      (
                        (topGainers.data ?? []) as {
                          code?: string
                          name?: string
                          previous?: number
                          close?: number
                          percentage?: number
                        }[]
                      ).map((row, i) => (
                        <tr key={row.code ?? i}>
                          <td>{String(row.code ?? '—')}</td>
                          <td>{String(row.name ?? '—')}</td>
                          <td className='num'>{(Number(row.previous) || 0).toLocaleString()}</td>
                          <td className='num'>{(Number(row.close) || 0).toLocaleString()}</td>
                          <td className='num positive'>
                            {row.percentage != null ? `${row.percentage}%` : '—'}
                          </td>
                        </tr>
                      ))
                    )
                    : (
                      <tr>
                        <td colSpan={5}>No data</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            <Components.PaginationBar
              page={page}
              pageSize={pageSize}
              total={topGainers.meta?.total ?? 0}
              onPageChange={setPage}
              loading={topGainers.loading}
              itemCount={(topGainers.data ?? []).length}
            />
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
                  {topLosers.loading
                    ? (
                      <tr>
                        <td colSpan={5}>Loading…</td>
                      </tr>
                    )
                    : (topLosers.data ?? []).length
                    ? (
                      (
                        (topLosers.data ?? []) as {
                          code?: string
                          name?: string
                          previous?: number
                          close?: number
                          percentage?: number
                        }[]
                      ).map((row, i) => (
                        <tr key={row.code ?? i}>
                          <td>{String(row.code ?? '—')}</td>
                          <td>{String(row.name ?? '—')}</td>
                          <td className='num'>{(Number(row.previous) || 0).toLocaleString()}</td>
                          <td className='num'>{(Number(row.close) || 0).toLocaleString()}</td>
                          <td className='num negative'>
                            {row.percentage != null ? `${row.percentage}%` : '—'}
                          </td>
                        </tr>
                      ))
                    )
                    : (
                      <tr>
                        <td colSpan={5}>No data</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            <Components.PaginationBar
              page={page}
              pageSize={pageSize}
              total={topLosers.meta?.total ?? 0}
              onPageChange={setPage}
              loading={topLosers.loading}
              itemCount={(topLosers.data ?? []).length}
            />
          </>
        )}
        {tab === 'foreignFlow' && (
          <>
            <h2 className='data-section-title'>
              Foreign / Domestic Flow — period: {periodYearMonth}
            </h2>
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
                  {foreignFlow.loading
                    ? (
                      <tr>
                        <td colSpan={5}>Loading…</td>
                      </tr>
                    )
                    : foreignList.length
                    ? (
                      foreignList.map((row, i) => (
                        <tr key={String(row.date ?? i)}>
                          <td>{String(row.date ?? '—')}</td>
                          <td className='num'>
                            {(Number(row.buyVolume ?? row['buyVolume']) || 0).toLocaleString()}
                          </td>
                          <td className='num'>
                            {(Number(row.buyValue ?? row['buyValue']) || 0).toLocaleString()}
                          </td>
                          <td className='num'>
                            {(Number(row.sellVolume ?? row['sellVolume']) || 0).toLocaleString()}
                          </td>
                          <td className='num'>
                            {(Number(row.sellValue ?? row['sellValue']) || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )
                    : (
                      <tr>
                        <td colSpan={5}>No data for period</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            <Components.PaginationBar
              page={page}
              pageSize={pageSize}
              total={foreignFlow.meta?.total ?? 0}
              onPageChange={setPage}
              loading={foreignFlow.loading}
              itemCount={foreignList.length}
            />
          </>
        )}
      </div>
    </div>
  )
}
