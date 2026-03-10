import React, { type JSX } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import * as Lucide from 'lucide-react'
import * as Config from '@app/Config/index.ts'
import type * as Types from '@app/Types/index.ts'

const iconMap: Record<string, Types.IconComponent> = {
  LayoutDashboard: Lucide.LayoutDashboard,
  TrendingUp: Lucide.TrendingUp,
  Building2: Lucide.Building2,
  BarChart3: Lucide.BarChart3,
  Users: Lucide.Users,
  Calendar: Lucide.Calendar,
  RefreshCw: Lucide.RefreshCw,
  Database: Lucide.Database,
  Activity: Lucide.Activity
}

export function SidebarNav(): JSX.Element {
  const location = useLocation()
  return (
    <nav className='dashboard-sidebar-nav' aria-label='Main navigation'>
      <ul className='dashboard-sidebar-nav-list'>
        {Config.navItems.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = item.path === '/'
            ? location.pathname === '/'
            : item.path === '/companies'
            ? location.pathname === '/companies' || location.pathname.startsWith('/companies/')
            : location.pathname === item.path
          return (
            <li key={item.id}>
              <NavLink
                to={item.path}
                className={`sidebar-nav-link ${isActive ? 'is-active' : ''}`}
                end={item.path === '/'}
              >
                {Icon != null ? <Icon size={18} /> : null}
                <span>{item.label}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
