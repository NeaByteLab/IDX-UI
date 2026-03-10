import React, { type JSX, useMemo, useState } from 'react'
import {
  BarChart2,
  Building2,
  ClipboardList,
  DollarSign,
  Factory,
  Radio,
  TrendingUp
} from 'lucide-react'
import * as Components from '@app/Components/index.ts'
import * as Hooks from '@app/Hooks/index.ts'
import * as Utils from '@app/Utils/index.ts'
import type * as Types from '@app/Types/index.ts'

const tabLabels: Record<Types.TradingTab, string> = {
  summary: 'Trade Summary',
  stock: 'Stock Summary',
  activeVolume: 'Most Active (Vol)',
  activeValue: 'Most Active (Value)',
  activeFreq: 'Most Active (Freq)',
  industry: 'Industry',
  broker: 'Broker Summary'
}

const tradingTabIcons: Record<Types.TradingTab, typeof ClipboardList> = {
  summary: ClipboardList,
  stock: BarChart2,
  activeVolume: TrendingUp,
  activeValue: DollarSign,
  activeFreq: Radio,
  industry: Factory,
  broker: Building2
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

export function Trading(): JSX.Element {
  const [tab, setTab] = useState<Types.TradingTab>('summary')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(defaultPageSize)
  const [periodYearMonth, setPeriodYearMonth] = useState('2025-03')
  const [stockSearch, setStockSearch] = useState('')
  const summaryDate = useMemo(() => `${periodYearMonth}-01`, [periodYearMonth])
  const period = useMemo(() => parseYearMonth(periodYearMonth), [periodYearMonth])
  const tradeSummaryParams = useMemo(
    () => ({
      limit: pageSize,
      offset: Utils.pageToOffset(page, pageSize),
      includeTotal: true as const
    }),
    [page, pageSize]
  )
  const tradeSummary = Hooks.useTradingSummary(tradeSummaryParams)
  const stockSummaryParams = useMemo(
    () => ({
      limit: pageSize,
      offset: Utils.pageToOffset(page, pageSize),
      includeTotal: true as const
    }),
    [page, pageSize]
  )
  const stockSummary = Hooks.useTradingStockSummary(summaryDate, stockSummaryParams)
  const brokerSummaryParams = useMemo(
    () => ({
      limit: pageSize,
      offset: Utils.pageToOffset(page, pageSize),
      includeTotal: true as const
    }),
    [page, pageSize]
  )
  const brokerSummary = Hooks.useTradingBrokerSummary(summaryDate, brokerSummaryParams)
  const activeVolumeParams = useMemo(
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
  const activeVolume = Hooks.useTradingActiveVolume(activeVolumeParams)
  const activeValueParams = useMemo(
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
  const activeValue = Hooks.useTradingActiveValue(activeValueParams)
  const activeFreqParams = useMemo(
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
  const activeFreq = Hooks.useTradingActiveFrequency(activeFreqParams)
  const industryParams = useMemo(
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
  const industry = Hooks.useTradingIndustry(industryParams)
  const filteredStockSummary = useMemo(() => {
    const list = (stockSummary.data ?? []) as {
      code?: string
      name?: string
      date?: string
      [k: string]: unknown
    }[]
    const q = stockSearch.trim().toLowerCase()
    if (!q) {
      return list
    }
    return list.filter(
      row =>
        String(row.code ?? '')
          .toLowerCase()
          .includes(q) ||
        String(row.name ?? '')
          .toLowerCase()
          .includes(q)
    )
  }, [stockSummary.data, stockSearch])

  return (
    <div className="dashboard-overview">
      <div className="dashboard-filter-row">
        <label className="dashboard-filter-label">
          Period (month &amp; year):
          <input
            type="month"
            value={periodYearMonth}
            onChange={e => setPeriodYearMonth(e.target.value)}
            className="dashboard-filter-input"
          />
        </label>
      </div>
      <div className="dashboard-card page-section">
        <div className="dashboard-tabs-row">
          {(Object.keys(tabLabels) as Types.TradingTab[]).map(t => {
            const Icon = tradingTabIcons[t]
            return (
              <button
                key={t}
                type="button"
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
        {tab === 'summary' && (
          <>
            <h2 className="data-section-title">Trade Summary — {periodYearMonth}</h2>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th className="num">Volume</th>
                    <th className="num">Value</th>
                    <th className="num">Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {tradeSummary.loading ? (
                    <tr>
                      <td colSpan={4}>Loading…</td>
                    </tr>
                  ) : (tradeSummary.data ?? []).length ? (
                    (
                      (tradeSummary.data ?? []) as {
                        id?: number
                        date?: string
                        volume?: number
                        value?: number
                        frequency?: number
                      }[]
                    ).map((row, i) => (
                      <tr key={row.id ?? i}>
                        <td>{String(row.date ?? '—')}</td>
                        <td className="num">{(Number(row.volume) || 0).toLocaleString()}</td>
                        <td className="num">{(Number(row.value) || 0).toLocaleString()}</td>
                        <td className="num">{(Number(row.frequency) || 0).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>No data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Components.PaginationBar
              page={page}
              pageSize={pageSize}
              total={tradeSummary.meta?.total}
              onPageChange={setPage}
              loading={tradeSummary.loading}
              itemCount={(tradeSummary.data ?? []).length}
            />
          </>
        )}
        {tab === 'stock' && (
          <>
            <input
              type="search"
              placeholder="Search by code or name..."
              value={stockSearch}
              onChange={e => setStockSearch(e.target.value)}
              className="dashboard-search-input"
            />
            <h2 className="data-section-title">Stock Summary (OHLC) — {periodYearMonth}</h2>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th className="num">Open</th>
                    <th className="num">High</th>
                    <th className="num">Low</th>
                    <th className="num">Close</th>
                    <th className="num">Vol</th>
                    <th className="num">Value</th>
                    <th className="num">Foreign Net</th>
                  </tr>
                </thead>
                <tbody>
                  {stockSummary.loading ? (
                    <tr>
                      <td colSpan={10}>Loading…</td>
                    </tr>
                  ) : filteredStockSummary.length ? (
                    filteredStockSummary.map((row, i) => {
                      const price = row['price'] as
                        | {
                            open?: number
                            high?: number
                            low?: number
                            close?: number
                          }
                        | undefined
                      const trading = row['trading'] as
                        | { volume?: number; value?: number }
                        | undefined
                      const foreign = row['foreign'] as { net?: number } | undefined
                      return (
                        <tr key={(row as { id?: number }).id ?? i}>
                          <td>{String(row.code ?? '—')}</td>
                          <td>{String(row.name ?? '—')}</td>
                          <td>{String(row.date ?? '—')}</td>
                          <td className="num">{(Number(price?.open) || 0).toLocaleString()}</td>
                          <td className="num">{(Number(price?.high) || 0).toLocaleString()}</td>
                          <td className="num">{(Number(price?.low) || 0).toLocaleString()}</td>
                          <td className="num">{(Number(price?.close) || 0).toLocaleString()}</td>
                          <td className="num">{(Number(trading?.volume) || 0).toLocaleString()}</td>
                          <td className="num">{(Number(trading?.value) || 0).toLocaleString()}</td>
                          <td className="num">
                            {foreign?.net != null ? Number(foreign.net).toLocaleString() : '—'}
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={10}>No data for date or no match</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Components.PaginationBar
              page={page}
              pageSize={pageSize}
              total={stockSummary.meta?.total}
              onPageChange={setPage}
              loading={stockSummary.loading}
              itemCount={filteredStockSummary.length}
            />
          </>
        )}
        {tab === 'activeVolume' && (
          <>
            <h2 className="data-section-title">Most Active (Volume) — {periodYearMonth}</h2>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th className="num">Volume</th>
                    <th className="num">Value</th>
                    <th className="num">Freq</th>
                  </tr>
                </thead>
                <tbody>
                  {activeVolume.loading ? (
                    <tr>
                      <td colSpan={5}>Loading…</td>
                    </tr>
                  ) : (activeVolume.data ?? []).length ? (
                    (
                      (activeVolume.data ?? []) as {
                        code?: string
                        name?: string
                        volume?: number
                        value?: number
                        frequency?: number
                      }[]
                    ).map((row, i) => (
                      <tr key={row.code ?? i}>
                        <td>{String(row.code ?? '—')}</td>
                        <td>{String(row.name ?? '—')}</td>
                        <td className="num">{(Number(row.volume) || 0).toLocaleString()}</td>
                        <td className="num">{(Number(row.value) || 0).toLocaleString()}</td>
                        <td className="num">{(Number(row.frequency) || 0).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
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
              total={activeVolume.meta?.total}
              onPageChange={setPage}
              loading={activeVolume.loading}
              itemCount={(activeVolume.data ?? []).length}
            />
          </>
        )}
        {tab === 'activeValue' && (
          <>
            <h2 className="data-section-title">Most Active (Value) — {periodYearMonth}</h2>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th className="num">Volume</th>
                    <th className="num">Value</th>
                    <th className="num">Freq</th>
                  </tr>
                </thead>
                <tbody>
                  {activeValue.loading ? (
                    <tr>
                      <td colSpan={5}>Loading…</td>
                    </tr>
                  ) : (activeValue.data ?? []).length ? (
                    (
                      (activeValue.data ?? []) as {
                        code?: string
                        name?: string
                        volume?: number
                        value?: number
                        frequency?: number
                      }[]
                    ).map((row, i) => (
                      <tr key={row.code ?? i}>
                        <td>{String(row.code ?? '—')}</td>
                        <td>{String(row.name ?? '—')}</td>
                        <td className="num">{(Number(row.volume) || 0).toLocaleString()}</td>
                        <td className="num">{(Number(row.value) || 0).toLocaleString()}</td>
                        <td className="num">{(Number(row.frequency) || 0).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
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
              total={activeValue.meta?.total}
              onPageChange={setPage}
              loading={activeValue.loading}
              itemCount={(activeValue.data ?? []).length}
            />
          </>
        )}
        {tab === 'activeFreq' && (
          <>
            <h2 className="data-section-title">Most Active (Frequency) — {periodYearMonth}</h2>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th className="num">Volume</th>
                    <th className="num">Value</th>
                    <th className="num">Freq</th>
                  </tr>
                </thead>
                <tbody>
                  {activeFreq.loading ? (
                    <tr>
                      <td colSpan={5}>Loading…</td>
                    </tr>
                  ) : (activeFreq.data ?? []).length ? (
                    (
                      (activeFreq.data ?? []) as {
                        code?: string
                        name?: string
                        volume?: number
                        value?: number
                        frequency?: number
                      }[]
                    ).map((row, i) => (
                      <tr key={row.code ?? i}>
                        <td>{String(row.code ?? '—')}</td>
                        <td>{String(row.name ?? '—')}</td>
                        <td className="num">{(Number(row.volume) || 0).toLocaleString()}</td>
                        <td className="num">{(Number(row.value) || 0).toLocaleString()}</td>
                        <td className="num">{(Number(row.frequency) || 0).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
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
              total={activeFreq.meta?.total}
              onPageChange={setPage}
              loading={activeFreq.loading}
              itemCount={(activeFreq.data ?? []).length}
            />
          </>
        )}
        {tab === 'industry' && (
          <>
            <h2 className="data-section-title">Industry Trading — {periodYearMonth}</h2>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Industry</th>
                    <th className="num">Volume</th>
                    <th className="num">Value</th>
                    <th className="num">Market Cap</th>
                    <th className="num">Members</th>
                  </tr>
                </thead>
                <tbody>
                  {industry.loading ? (
                    <tr>
                      <td colSpan={6}>Loading…</td>
                    </tr>
                  ) : (industry.data ?? []).length ? (
                    (
                      (industry.data ?? []) as {
                        date?: string
                        industry?: string
                        volume?: number
                        value?: number
                        marketCap?: number
                        members?: number
                      }[]
                    ).map((row, i) => (
                      <tr key={i}>
                        <td>{String(row.date ?? '—')}</td>
                        <td>{String(row.industry ?? '—')}</td>
                        <td className="num">{(Number(row.volume) || 0).toLocaleString()}</td>
                        <td className="num">{(Number(row.value) || 0).toLocaleString()}</td>
                        <td className="num">{(Number(row.marketCap) || 0).toLocaleString()}</td>
                        <td className="num">{row.members != null ? String(row.members) : '—'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>No data for period</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Components.PaginationBar
              page={page}
              pageSize={pageSize}
              total={industry.meta?.total}
              onPageChange={setPage}
              loading={industry.loading}
              itemCount={(industry.data ?? []).length}
            />
          </>
        )}
        {tab === 'broker' && (
          <>
            <h2 className="data-section-title">Broker Summary — {periodYearMonth}</h2>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Broker Code</th>
                    <th>Broker Name</th>
                    <th className="num">Total Value</th>
                    <th className="num">Volume</th>
                    <th className="num">Frequency</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {brokerSummary.loading ? (
                    <tr>
                      <td colSpan={6}>Loading…</td>
                    </tr>
                  ) : (brokerSummary.data ?? []).length ? (
                    (
                      (brokerSummary.data ?? []) as {
                        id?: number
                        brokerCode?: string
                        brokerName?: string
                        totalValue?: number
                        volume?: number
                        frequency?: number
                        date?: string
                      }[]
                    ).map((row, i) => (
                      <tr key={row.id ?? i}>
                        <td>{String(row.brokerCode ?? '—')}</td>
                        <td>{String(row.brokerName ?? '—')}</td>
                        <td className="num">{(Number(row.totalValue) || 0).toLocaleString()}</td>
                        <td className="num">{(Number(row.volume) || 0).toLocaleString()}</td>
                        <td className="num">{(Number(row.frequency) || 0).toLocaleString()}</td>
                        <td>{String(row.date ?? '—')}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>No data for date</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Components.PaginationBar
              page={page}
              pageSize={pageSize}
              total={brokerSummary.meta?.total}
              onPageChange={setPage}
              loading={brokerSummary.loading}
              itemCount={(brokerSummary.data ?? []).length}
            />
          </>
        )}
      </div>
    </div>
  )
}
