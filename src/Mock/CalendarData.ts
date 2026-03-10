import type { CalendarEvent } from '@app/Types/Calendar.ts'

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 1,
    code: 'IDX',
    type: 'Holiday',
    description: 'Market holiday',
    date: '2025-03-11',
    location: 'BEI',
    year: '2025'
  },
  {
    id: 2,
    code: 'IDX',
    type: 'Event',
    description: 'Market briefing Q1 2025',
    date: '2025-03-15',
    location: 'Jakarta',
    year: '2025'
  },
  {
    id: 3,
    code: 'BBCA',
    type: 'Corporate',
    description: 'Ex-dividend date',
    date: '2025-04-15',
    year: '2025'
  }
]
