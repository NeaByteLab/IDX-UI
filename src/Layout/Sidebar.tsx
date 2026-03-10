import React, { type JSX } from 'react'
import { Menu, X } from 'lucide-react'
import { SidebarNav } from '@app/Layout/SidebarNav.tsx'
import type * as Types from '@app/Types/index.ts'

export function Sidebar({ isOpen, isMobile, onToggle }: Types.SidebarProps): JSX.Element {
  const closedClass = isOpen ? '' : 'is-closed'
  const mobileClass = isMobile ? 'is-mobile' : ''
  return (
    <aside
      className={`dashboard-sidebar ${closedClass} ${mobileClass}`.trim()}
      aria-label='Dashboard sidebar'
    >
      <div className='dashboard-sidebar-header'>
        <div className='dashboard-sidebar-brand'>
          <div className='dashboard-sidebar-logo' aria-hidden>I</div>
          <span className='dashboard-sidebar-brand-text'>IDX PIPELINE</span>
        </div>
        <button
          type='button'
          className='dashboard-sidebar-toggle'
          onClick={onToggle}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      <SidebarNav />
      {isOpen && (
        <div className='dashboard-sidebar-footer'>
          <p className='dashboard-sidebar-footer-title'>Deno Runtime</p>
          <div className='dashboard-sidebar-footer-status'>
            <span className='dashboard-sidebar-footer-dot' />
            <span className='dashboard-sidebar-footer-status-text'>System Active</span>
          </div>
          <p className='dashboard-sidebar-footer-desc'>
            Data collection focused on network stability & retries.
          </p>
        </div>
      )}
    </aside>
  )
}
