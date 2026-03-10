import React, { useMemo, useState } from 'react'
import type { JSX } from 'react'
import { mockBrokers, mockParticipants, mockPrimaryDealers } from '@app/Mock/index.ts'

type ParticipantTab = 'brokers' | 'participants' | 'dealers'

function filterByQuery<T extends { code: string; name: string }>(list: T[], q: string): T[] {
  const s = q.trim().toLowerCase()
  if (!s) {
    return list
  }
  return list.filter(
    (row) => row.code.toLowerCase().includes(s) || row.name.toLowerCase().includes(s)
  )
}

const searchInputStyle = {
  marginBottom: '0.75rem',
  padding: '0.5rem 0.75rem',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-light)',
  minWidth: '220px'
} as const

export function Participants(): JSX.Element {
  const [tab, setTab] = useState<ParticipantTab>('brokers')
  const [search, setSearch] = useState('')
  const filteredBrokers = useMemo(
    () => filterByQuery(mockBrokers, tab === 'brokers' ? search : ''),
    [tab, search]
  )
  const filteredParticipants = useMemo(
    () => filterByQuery(mockParticipants, tab === 'participants' ? search : ''),
    [tab, search]
  )
  const filteredDealers = useMemo(
    () => filterByQuery(mockPrimaryDealers, tab === 'dealers' ? search : ''),
    [tab, search]
  )

  return (
    <div className='dashboard-overview'>
      <p className='dashboard-page-subtitle'>
        Brokers, participants, primary dealers — one tab per dataset (mock)
      </p>
      <div className='dashboard-card page-section'>
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          {(['brokers', 'participants', 'dealers'] as ParticipantTab[]).map((t) => (
            <button
              key={t}
              type='button'
              className='dashboard-sync-btn'
              style={{
                background: tab === t ? 'var(--primary)' : 'var(--bg-subtle)',
                color: tab === t ? 'white' : 'var(--text-main)'
              }}
              onClick={() => {
                setTab(t)
                setSearch('')
              }}
            >
              {t === 'brokers'
                ? 'Brokers'
                : t === 'participants'
                ? 'Participants'
                : 'Primary Dealers'}
            </button>
          ))}
        </div>
        {tab === 'brokers' && (
          <>
            <input
              type='search'
              placeholder='Search by code or name...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={searchInputStyle}
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
                  {filteredBrokers.map((row) => (
                    <tr key={row.code}>
                      <td>{row.code}</td>
                      <td>{row.name}</td>
                      <td>{row.license ?? '—'}</td>
                      <td>{row.address ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === 'participants' && (
          <>
            <input
              type='search'
              placeholder='Search by code or name...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={searchInputStyle}
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
                  {filteredParticipants.map((row) => (
                    <tr key={row.code}>
                      <td>{row.code}</td>
                      <td>{row.name}</td>
                      <td>{row.license ?? '—'}</td>
                      <td>{row.type ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === 'dealers' && (
          <>
            <input
              type='search'
              placeholder='Search by code or name...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={searchInputStyle}
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
                  {filteredDealers.map((row) => (
                    <tr key={row.code}>
                      <td>{row.code}</td>
                      <td>{row.name}</td>
                      <td>{row.license ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
