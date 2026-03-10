import React, { type JSX } from 'react'
import { Megaphone } from 'lucide-react'
import type * as Types from '@app/Types/index.ts'

export function IdxAnnouncementCard({
  items,
  onRecent
}: Types.IdxAnnouncementCardProps): JSX.Element {
  return (
    <div className='dashboard-card'>
      <div className='news-card-header'>
        <h3 className='news-card-title'>
          <Megaphone size={18} className='news-card-title-icon' aria-hidden />
          IDX Official
        </h3>
        <button type='button' className='news-card-link' onClick={onRecent}>
          Recent
        </button>
      </div>
      <div className='news-list'>
        {items.map((ann) => (
          <div key={ann.id} className='announcement-item'>
            <p className='announcement-type'>{ann.type}</p>
            <h5 className='announcement-title'>{ann.title}</h5>
            <p className='announcement-date'>{ann.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
