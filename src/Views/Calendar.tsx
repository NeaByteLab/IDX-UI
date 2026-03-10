import React, { type JSX, useMemo, useState } from 'react'
import * as Hooks from '@app/Hooks/index.ts'

export function Calendar(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState('2025-03-11')
  const [eventSearch, setEventSearch] = useState('')
  const calendar = Hooks.useMarketCalendar({ date: selectedDate, limit: 100 })
  const eventsForDate = (calendar.data ?? []) as {
    id?: number
    date?: string
    code?: string
    type?: string
    description?: string
    location?: string
    year?: number
  }[]
  const filteredAllEvents = useMemo(() => {
    const q = eventSearch.trim().toLowerCase()
    if (!q) {
      return eventsForDate
    }
    return eventsForDate.filter(
      (e) =>
        String(e.code ?? '')
          .toLowerCase()
          .includes(q) ||
        String(e.type ?? '')
          .toLowerCase()
          .includes(q) ||
        String(e.description ?? '')
          .toLowerCase()
          .includes(q)
    )
  }, [eventSearch, eventsForDate])

  return (
    <div className='dashboard-overview'>
      <div className='dashboard-card page-section'>
        <div className='dashboard-filter-row'>
          <label className='dashboard-filter-label'>
            Date:
            <input
              type='date'
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className='dashboard-filter-input'
            />
          </label>
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
              {calendar.loading
                ? (
                  <tr>
                    <td colSpan={5}>Loading…</td>
                  </tr>
                )
                : eventsForDate.length
                ? (
                  eventsForDate.map((row, i) => (
                    <tr key={row.id ?? i}>
                      <td>{row.code ?? '—'}</td>
                      <td>{row.type ?? '—'}</td>
                      <td>{row.description ?? '—'}</td>
                      <td>{row.location ?? '—'}</td>
                      <td>{row.year ?? '—'}</td>
                    </tr>
                  ))
                )
                : (
                  <tr>
                    <td colSpan={5}>No events for this date</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
        <h2 className='data-section-title mt-lg'>Events on this date (filtered)</h2>
        <input
          type='search'
          placeholder='Search by code, type, or description...'
          value={eventSearch}
          onChange={(e) => setEventSearch(e.target.value)}
          className='dashboard-search-input'
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
              {filteredAllEvents.length
                ? (
                  filteredAllEvents.map((row, i) => (
                    <tr key={row.id ?? i}>
                      <td>{row.date ?? '—'}</td>
                      <td>{row.code ?? '—'}</td>
                      <td>{row.type ?? '—'}</td>
                      <td>{row.description ?? '—'}</td>
                      <td>{row.location ?? '—'}</td>
                    </tr>
                  ))
                )
                : (
                  <tr>
                    <td colSpan={5}>No events</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
