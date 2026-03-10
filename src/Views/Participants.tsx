import React, { type JSX, useMemo, useState } from 'react'
import { Building2, Store, Users } from 'lucide-react'
import * as Components from '@app/Components/index.ts'
import * as Hooks from '@app/Hooks/index.ts'
import * as Utils from '@app/Utils/index.ts'
import type * as Types from '@app/Types/index.ts'

const tabConfig: Record<Types.ParticipantTab, { label: string; Icon: typeof Building2 }> = {
  brokers: { label: 'Brokers', Icon: Building2 },
  participants: { label: 'Participants', Icon: Users },
  dealers: { label: 'Primary Dealers', Icon: Store }
}

function filterByQuery<T extends { code?: string; name?: string }>(list: T[], q: string): T[] {
  const s = q.trim().toLowerCase()
  if (!s) {
    return list
  }
  return list.filter(
    (row) =>
      String(row.code ?? '')
        .toLowerCase()
        .includes(s) ||
      String(row.name ?? '')
        .toLowerCase()
        .includes(s)
  )
}

const defaultPageSize = 20

export function Participants(): JSX.Element {
  const [tab, setTab] = useState<Types.ParticipantTab>('brokers')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(defaultPageSize)
  const brokersParams = useMemo(
    () => ({
      limit: pageSize,
      offset: Utils.pageToOffset(page, pageSize),
      includeTotal: true as const
    }),
    [page, pageSize]
  )
  const brokers = Hooks.useBrokers(brokersParams)
  const dealersParams = useMemo(
    () => ({
      limit: pageSize,
      offset: Utils.pageToOffset(page, pageSize),
      includeTotal: true as const
    }),
    [page, pageSize]
  )
  const dealers = Hooks.useDealers(dealersParams)
  const profilesParams = useMemo(
    () => ({
      limit: pageSize,
      offset: Utils.pageToOffset(page, pageSize),
      includeTotal: true as const
    }),
    [page, pageSize]
  )
  const profiles = Hooks.useParticipantProfiles(profilesParams)
  const brokersList = (brokers.data ?? []) as {
    code?: string
    name?: string
    license?: string
    address?: string
  }[]
  const dealersList = (dealers.data ?? []) as {
    code?: string
    name?: string
    [k: string]: unknown
  }[]
  const profilesList = (profiles.data ?? []) as {
    code?: string
    name?: string
    [k: string]: unknown
  }[]
  const filteredBrokers = useMemo(
    () => filterByQuery(brokersList, tab === 'brokers' ? search : ''),
    [tab, search, brokersList]
  )
  const filteredParticipants = useMemo(
    () => filterByQuery(profilesList, tab === 'participants' ? search : ''),
    [tab, search, profilesList]
  )
  const filteredDealers = useMemo(
    () => filterByQuery(dealersList, tab === 'dealers' ? search : ''),
    [tab, search, dealersList]
  )

  return (
    <div className='dashboard-overview'>
      <div className='dashboard-card page-section'>
        <div className='dashboard-tabs-row'>
          {(['brokers', 'participants', 'dealers'] as Types.ParticipantTab[]).map((t) => {
            const { label, Icon } = tabConfig[t]
            return (
              <button
                key={t}
                type='button'
                className={tab === t ? 'dashboard-sync-btn is-primary' : 'dashboard-sync-btn'}
                onClick={() => {
                  setTab(t)
                  setSearch('')
                  setPage(1)
                }}
              >
                <Icon size={18} aria-hidden />
                {label}
              </button>
            )
          })}
        </div>
        {tab === 'brokers' && (
          <>
            <input
              type='search'
              placeholder='Search by code or name...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='dashboard-search-input'
            />
            <h2 className='data-section-title'>Brokers</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>License</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {brokers.loading
                    ? (
                      <tr>
                        <td colSpan={4}>Loading…</td>
                      </tr>
                    )
                    : filteredBrokers.length
                    ? (
                      filteredBrokers.map((row) => (
                        <tr key={String(row.code)}>
                          <td>{row.code ?? '—'}</td>
                          <td>{row.name ?? '—'}</td>
                          <td>{(row as { license?: string }).license ?? '—'}</td>
                          <td>{(row as { address?: string }).address ?? '—'}</td>
                        </tr>
                      ))
                    )
                    : (
                      <tr>
                        <td colSpan={4}>No brokers</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            <Components.PaginationBar
              page={page}
              pageSize={pageSize}
              total={brokers.meta?.total}
              onPageChange={setPage}
              loading={brokers.loading}
              itemCount={filteredBrokers.length}
            />
          </>
        )}
        {tab === 'participants' && (
          <>
            <input
              type='search'
              placeholder='Search by code or name...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='dashboard-search-input'
            />
            <h2 className='data-section-title'>Participants</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>License</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.loading
                    ? (
                      <tr>
                        <td colSpan={4}>Loading…</td>
                      </tr>
                    )
                    : filteredParticipants.length
                    ? (
                      filteredParticipants.map((row) => (
                        <tr key={String(row.code)}>
                          <td>{row.code ?? '—'}</td>
                          <td>{row.name ?? '—'}</td>
                          <td>{String((row as { license?: string }).license ?? '—')}</td>
                          <td>{String((row as { type?: string }).type ?? '—')}</td>
                        </tr>
                      ))
                    )
                    : (
                      <tr>
                        <td colSpan={4}>No participants</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            <Components.PaginationBar
              page={page}
              pageSize={pageSize}
              total={profiles.meta?.total}
              onPageChange={setPage}
              loading={profiles.loading}
              itemCount={filteredParticipants.length}
            />
          </>
        )}
        {tab === 'dealers' && (
          <>
            <input
              type='search'
              placeholder='Search by code or name...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='dashboard-search-input'
            />
            <h2 className='data-section-title'>Primary Dealers</h2>
            <div className='data-table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>License</th>
                  </tr>
                </thead>
                <tbody>
                  {dealers.loading
                    ? (
                      <tr>
                        <td colSpan={3}>Loading…</td>
                      </tr>
                    )
                    : filteredDealers.length
                    ? (
                      filteredDealers.map((row) => (
                        <tr key={String(row.code)}>
                          <td>{row.code ?? '—'}</td>
                          <td>{row.name ?? '—'}</td>
                          <td>{String((row as { license?: string }).license ?? '—')}</td>
                        </tr>
                      ))
                    )
                    : (
                      <tr>
                        <td colSpan={3}>No dealers</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            <Components.PaginationBar
              page={page}
              pageSize={pageSize}
              total={dealers.meta?.total}
              onPageChange={setPage}
              loading={dealers.loading}
              itemCount={filteredDealers.length}
            />
          </>
        )}
      </div>
    </div>
  )
}
