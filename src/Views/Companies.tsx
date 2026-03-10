import React, { type JSX, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, PauseCircle, PlusCircle, RefreshCw, XCircle } from 'lucide-react'
import * as Components from '@app/Components/index.ts'
import * as Config from '@app/Config/index.ts'
import * as Hooks from '@app/Hooks/index.ts'
import * as Utils from '@app/Utils/index.ts'
import type * as Types from '@app/Types/index.ts'

const boards = ['', 'Main', 'Development', 'Utama', 'Pemantauan Khusus']
const defaultPageSize = 20

const companiesTabConfig: Record<Types.TabId, { label: string; Icon: typeof CheckCircle }> = {
  listed: { label: 'Listed', Icon: CheckCircle },
  suspended: { label: 'Suspended', Icon: PauseCircle },
  new: { label: 'New', Icon: PlusCircle },
  delisted: { label: 'Delisted', Icon: XCircle },
  relisted: { label: 'Relisted', Icon: RefreshCw }
}

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

export function Companies(): JSX.Element {
  const [tab, setTab] = useState<Types.TabId>('listed')
  const [search, setSearch] = useState('')
  const [board, setBoard] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(defaultPageSize)
  const [periodYearMonth, setPeriodYearMonth] = useState('2025-02')
  const period = useMemo(() => {
    const parts = periodYearMonth.split('-').map(Number)
    const y = parts[0]
    const m = parts[1]
    if (
      y === undefined ||
      m === undefined ||
      Number.isNaN(y) ||
      Number.isNaN(m) ||
      m < 1 ||
      m > 12
    ) {
      return null
    }
    return { year: y, month: m }
  }, [periodYearMonth])
  const securitiesParams = useMemo(
    () => ({
      limit: pageSize,
      offset: Utils.pageToOffset(page, pageSize),
      includeTotal: true as const,
      ...(board ? { board } : {})
    }),
    [board, page, pageSize]
  )
  const securities = Hooks.useSecurities(securitiesParams)
  const suspendParams = useMemo(
    () => ({
      limit: pageSize,
      offset: Utils.pageToOffset(page, pageSize),
      includeTotal: true as const
    }),
    [page, pageSize]
  )
  const suspend = Hooks.useSuspend(suspendParams)
  const newListings = Hooks.useNewListings(
    period?.year !== undefined && period?.month !== undefined ? period : null
  )
  const delistings = Hooks.useDelistings(
    period?.year !== undefined && period?.month !== undefined ? period : null
  )
  const relistingsParams = useMemo(
    () => ({
      limit: pageSize,
      offset: Utils.pageToOffset(page, pageSize),
      includeTotal: true as const
    }),
    [page, pageSize]
  )
  const relistings = Hooks.useRelistings(relistingsParams)
  const securitiesList = securities.data ?? []
  const filteredList = useMemo(() => {
    if (tab !== 'listed') {
      return []
    }
    let list = securitiesList as {
      code?: string
      name?: string
      sector?: string
      board?: string
      listingBoard?: string
    }[]
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (s) => s.code?.toLowerCase().includes(q) || s.name?.toLowerCase().includes(q)
      )
    }
    if (board) {
      list = list.filter((s) => (s.board ?? s.listingBoard) === board)
    }
    return [...list].sort((a, b) => (a.code ?? '').localeCompare(b.code ?? '', 'en'))
  }, [tab, search, board, securitiesList])
  const newList = (newListings.data ?? []) as {
    code: string
    name: string
    listingDate?: number
    listedShares?: number
    offeringShares?: number
  }[]
  const delistList = (delistings.data ?? []) as {
    code: string
    name: string
    delistingDate?: number
    lastDate?: number
  }[]
  const relistList = (relistings.data ?? []) as {
    code: string
    name: string
    listingDate?: number
  }[]

  const loading = tab === 'listed'
    ? securities.loading
    : tab === 'suspended'
    ? suspend.loading
    : tab === 'new'
    ? newListings.loading
    : tab === 'delisted'
    ? delistings.loading
    : relistings.loading
  const error = tab === 'listed'
    ? securities.error
    : tab === 'suspended'
    ? suspend.error
    : tab === 'new'
    ? newListings.error
    : tab === 'delisted'
    ? delistings.error
    : relistings.error

  return (
    <div className='dashboard-overview'>
      <div className='dashboard-card page-section'>
        <div className='dashboard-filter-row dashboard-tabs-row'>
          {(['listed', 'suspended', 'new', 'delisted', 'relisted'] as Types.TabId[]).map((t) => {
            const { label, Icon } = companiesTabConfig[t]
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
                {label}
              </button>
            )
          })}
          {(tab === 'new' || tab === 'delisted' || tab === 'relisted') && (
            <label className='dashboard-filter-label'>
              Period:
              <input
                type='month'
                value={periodYearMonth}
                onChange={(e) => setPeriodYearMonth(e.target.value)}
                className='dashboard-filter-input'
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
                className='dashboard-input dashboard-input-min-200'
              />
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className='dashboard-input'
              >
                {boards.map((b) => (
                  <option key={b || '_'} value={b}>
                    {b || 'All boards'}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
        {error && (
          <p className='dashboard-error-text dashboard-loading-text'>
            {(error as { error?: string }).error ?? 'Request failed'}
          </p>
        )}
        {loading && <p className='dashboard-loading-text'>Loading…</p>}
        {tab === 'listed' && !loading && (
          <>
            <h2 className='data-section-title'>Securities</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th className='col-width-56'></th>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Board</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((row) => (
                    <tr key={row.code ?? row.name ?? Math.random()}>
                      <td className='align-middle'>
                        {row.code && (
                          <img
                            src={`${Config.getApiBaseUrl()}/public/img/${
                              encodeURIComponent(
                                row.code
                              )
                            }.svg`}
                            alt=''
                            width={32}
                            height={32}
                            loading='lazy'
                            decoding='async'
                            className='dashboard-logo-img'
                            onError={(e) => {
                              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        )}
                      </td>
                      <td>{row.code ?? '—'}</td>
                      <td>{row.name ?? '—'}</td>
                      <td>{row.board ?? row.listingBoard ?? '—'}</td>
                      <td>
                        <Link
                          to={Config.paths.companyDetail(row.code ?? '')}
                          className='news-card-link'
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Components.PaginationBar
              page={page}
              pageSize={pageSize}
              total={securities.meta?.total}
              onPageChange={setPage}
              loading={securities.loading}
              itemCount={filteredList.length}
            />
          </>
        )}
        {tab === 'suspended' && !loading && (
          <>
            <h2 className='data-section-title'>Suspended</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    (suspend.data ?? []) as {
                      code?: string
                      title?: string
                      date?: number
                      type?: string
                    }[]
                  ).map((row) => (
                    <tr key={(row as { id?: string }).id ?? row.code ?? Math.random()}>
                      <td>{row.code ?? '—'}</td>
                      <td>{row.title ?? '—'}</td>
                      <td>{formatDateFromApi(row.date)}</td>
                      <td>{row.type ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Components.PaginationBar
              page={page}
              pageSize={pageSize}
              total={suspend.meta?.total}
              onPageChange={setPage}
              loading={suspend.loading}
              itemCount={(suspend.data ?? []).length}
            />
          </>
        )}
        {tab === 'new' && !loading && (
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
                  {newList.length
                    ? (
                      newList.map((row) => (
                        <tr key={row.code}>
                          <td>{row.code}</td>
                          <td>{row.name}</td>
                          <td>{formatDateFromApi(row.listingDate)}</td>
                          <td className='num'>
                            {(row.listedShares ?? row.offeringShares ?? 0).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )
                    : (
                      <tr>
                        <td colSpan={4}>No data for period</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === 'delisted' && !loading && (
          <>
            <h2 className='data-section-title'>Delistings — {periodYearMonth}</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Delisting Date</th>
                    <th>Last Date</th>
                  </tr>
                </thead>
                <tbody>
                  {delistList.length
                    ? (
                      delistList.map((row) => (
                        <tr key={row.code}>
                          <td>{row.code}</td>
                          <td>{row.name}</td>
                          <td>{formatDateFromApi(row.delistingDate ?? row.lastDate)}</td>
                          <td>{formatDateFromApi(row.lastDate)}</td>
                        </tr>
                      ))
                    )
                    : (
                      <tr>
                        <td colSpan={4}>No data for period</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === 'relisted' && !loading && (
          <>
            <h2 className='data-section-title'>Relistings</h2>
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
                  {relistList.length
                    ? (
                      relistList.map((row) => (
                        <tr key={row.code}>
                          <td>{row.code}</td>
                          <td>{row.name}</td>
                          <td>{formatDateFromApi(row.listingDate)}</td>
                        </tr>
                      ))
                    )
                    : (
                      <tr>
                        <td colSpan={3}>No data</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            <Components.PaginationBar
              page={page}
              pageSize={pageSize}
              total={relistings.meta?.total}
              onPageChange={setPage}
              loading={relistings.loading}
              itemCount={relistList.length}
            />
          </>
        )}
      </div>
    </div>
  )
}
