import React, { useMemo, useState } from 'react'
import type { JSX } from 'react'
import { mockCalendarEvents } from '@app/Mock/index.ts'

export function Calendar(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState('2025-03-11')
  const [eventSearch, setEventSearch] = useState('')
  const eventsForDate = useMemo(() => {
    return mockCalendarEvents.filter((e) => e.date === selectedDate)
  }, [selectedDate])
  const allDates = useMemo(() => {
    const set = new Set(mockCalendarEvents.map((e) => e.date))
    return Array.from(set).sort()
  }, [])
  const filteredAllEvents = useMemo(() => {
    const q = eventSearch.trim().toLowerCase()
    if (!q) {
      return mockCalendarEvents
    }
    return mockCalendarEvents.filter(
      (e) =>
        e.code.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
    )
  }, [eventSearch])

  return (
    <div className='dashboard-overview'>
      <p className='dashboard-page-subtitle'>Market holidays &amp; events by date (mock)</p>
      <div className='dashboard-card page-section'>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <label style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
            Date:
            <input
              type='date'
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                marginLeft: '0.5rem',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)'
              }}
            />
          </label>
          {allDates.map((d) => (
            <button
              key={d}
              type='button'
              className='dashboard-sync-btn'
              style={{
                background: selectedDate === d ? 'var(--primary)' : 'var(--bg-subtle)',
                color: selectedDate === d ? 'white' : 'var(--text-main)'
              }}
              onClick={() => setSelectedDate(d)}
            >
              {d}
            </button>
          ))}
        </div>
        <h2 className='data-section-title'>Events on {selectedDate}</h2>
        <div className='data-table-wrap'>
          <table className='data-table'>
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Description</th>
                <th>Location</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              {eventsForDate.length
                ? (
                  eventsForDate.map((row) => (
                    <tr key={row.id}>
                      <td>{row.code}</td>
                      <td>{row.type}</td>
                      <td>{row.description}</td>
                      <td>{row.location ?? '—'}</td>
                      <td>{row.year ?? '—'}</td>
                    </tr>
                  ))
                )
                : (
                  <tr>
                    <td colSpan={5}>No events for this date (mock)</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
        <h2 className='data-section-title' style={{ marginTop: '1.5rem' }}>
          All events (mock)
        </h2>
        <input
          type='search'
          placeholder='Search by code, type, or description...'
          value={eventSearch}
          onChange={(e) => setEventSearch(e.target.value)}
          style={{
            marginBottom: '0.75rem',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            minWidth: '280px'
          }}
        />
        <div className='data-table-wrap'>
          <table className='data-table'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Code</th>
                <th>Type</th>
                <th>Description</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {filteredAllEvents.map((row) => (
                <tr key={row.id}>
                  <td>{row.date}</td>
                  <td>{row.code}</td>
                  <td>{row.type}</td>
                  <td>{row.description}</td>
                  <td>{row.location ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
