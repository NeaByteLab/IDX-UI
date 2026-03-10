import React, { type JSX } from 'react'
import { useLocation } from 'react-router-dom'
import { Activity, Bell } from 'lucide-react'
import * as Config from '@app/Config/index.ts'

export function Header(): JSX.Element {
  const location = useLocation()
  const current = Config.navItems.find((n) => n.path === location.pathname) ?? Config.navItems[0]
  const title = current?.label ?? 'Dashboard'
  return (
    <header className='dashboard-header'>
      <h2 className='dashboard-header-title'>{title}</h2>
      <div className='dashboard-header-actions'>
        <div className='dashboard-header-badge'>
          <Activity size={14} className='dashboard-header-badge-dot' aria-hidden />
          <span>SYNC STABLE</span>
        </div>
        <button type='button' className='dashboard-header-notify' aria-label='Notifications'>
          <Bell size={20} />
          <span className='dashboard-header-notify-dot' aria-hidden />
        </button>
        <div className='dashboard-header-divider' aria-hidden />
        <div className='dashboard-header-avatar' aria-hidden>
          A
        </div>
      </div>
    </header>
  )
}
