import React from 'react'
import type { JSX } from 'react'
import { Activity, Bell } from 'lucide-react'
import { navItems } from '@app/Config/index.ts'
import { useLocation } from 'react-router-dom'

export function Header(): JSX.Element {
  const location = useLocation()
  const current = navItems.find((n) => n.path === location.pathname) ?? navItems[0]
  const title = current?.label ?? 'Dashboard'
  return (
    <header className='dashboard-header'>
      <h2 className='dashboard-header-title'>{title}</h2>
      <div className='dashboard-header-actions'>
        <div className='dashboard-header-badge'>
          <Activity size={14} className='dashboard-header-badge-dot' aria-hidden />
          <span>SYNC STABLE</span>
        </div>
        <button
          type='button'
          className='dashboard-header-notify'
          aria-label='Notifications'
        >
          <Bell size={20} />
          <span className='dashboard-header-notify-dot' aria-hidden />
        </button>
        <div className='dashboard-header-divider' aria-hidden />
        <div className='dashboard-header-avatar' aria-hidden>A</div>
      </div>
    </header>
  )
}
