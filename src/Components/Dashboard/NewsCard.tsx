import React, { type JSX } from 'react'
import { Clock, Newspaper } from 'lucide-react'
import type * as Types from '@app/Types/index.ts'

export function CompanyNewsCard({ items, onViewAll }: Types.CompanyNewsCardProps): JSX.Element {
  return (
    <div className='dashboard-card'>
      <div className='news-card-header'>
        <h3 className='news-card-title'>
          <Newspaper size={18} className='news-card-title-icon' aria-hidden />
          Company News
        </h3>
        <button type='button' className='news-card-link' onClick={onViewAll}>
          View All
        </button>
      </div>
      <div className='news-list'>
        {items.map((news) => (
          <article key={news.id} className='news-item'>
            <div className='news-item-meta'>
              <span className='news-item-code'>{news.code}</span>
              <span className='news-item-time'>
                <Clock size={10} aria-hidden />
                {news.time}
              </span>
            </div>
            <h5 className='news-item-headline'>{news.title}</h5>
          </article>
        ))}
      </div>
    </div>
  )
}
