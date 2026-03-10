import React, { type JSX } from 'react'
import type * as Types from '@app/Types/index.ts'
import * as Utils from '@app/Utils/index.ts'

export function PaginationBar({
  page,
  pageSize,
  total,
  onPageChange,
  loading = false,
  itemCount = 0
}: Types.PaginationBarProps): JSX.Element {
  const totalCount = total ?? 0
  const pages = Utils.totalPages(totalCount, pageSize)
  const offset = Utils.pageToOffset(page, pageSize)
  const from = totalCount > 0 ? offset + 1 : itemCount > 0 ? offset + 1 : 0
  const to = totalCount > 0 ? Math.min(offset + pageSize, totalCount) : offset + itemCount
  const canPrev = page > 1 && !loading
  const hasMoreWhenUnknown = itemCount >= pageSize
  const canNext = !loading && (totalCount > 0 ? offset + pageSize < totalCount : hasMoreWhenUnknown)
  const label = totalCount > 0
    ? `Showing ${from}–${to} of ${totalCount.toLocaleString()}`
    : itemCount > 0
    ? `Showing ${from}–${to}`
    : 'Showing 0'
  return (
    <div className='pagination-bar'>
      <span className='pagination-bar-label'>{label}</span>
      <div className='pagination-bar-controls'>
        <button
          type='button'
          className='dashboard-sync-btn'
          disabled={!canPrev}
          aria-label='Previous page'
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </button>
        <span className='pagination-bar-page'>
          Page {page}
          {pages > 0 ? ` of ${pages}` : ''}
        </span>
        <button
          type='button'
          className='dashboard-sync-btn'
          disabled={!canNext}
          aria-label='Next page'
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
