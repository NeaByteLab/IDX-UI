import React, { Suspense } from 'react'
import type { JSX } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { RefreshCw, Server } from 'lucide-react'
import { useSidebarState } from '@app/Hooks/index.ts'
import { Sidebar } from '@app/Layout/Sidebar.tsx'
import { Header } from '@app/Layout/Header.tsx'
import { useSyncStatus } from '@app/Hooks/index.ts'
import { navItems } from '@app/Config/index.ts'

export function DashboardLayout(): JSX.Element {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen, isMobile] = useSidebarState()
  const [syncStatus, triggerSync] = useSyncStatus()
  const isOverview = location.pathname === '/'
  const current = navItems.find((n) => n.path === location.pathname) ??
    (location.pathname.startsWith('/companies/')
      ? navItems.find((n) => n.path === '/companies')
      : null) ??
    navItems[0]
  const pageTitle = isOverview
    ? 'Market Data Intelligence'
    : location.pathname.startsWith('/companies/')
    ? 'Company Detail'
    : (current?.label ?? 'Dashboard')
  return (
    <div className='dashboard-layout-root'>
      {isMobile && isSidebarOpen && (
        <button
          type='button'
          className='dashboard-sidebar-backdrop'
          aria-label='Close sidebar'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <Sidebar
        isOpen={isSidebarOpen}
        isMobile={isMobile}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <main className='dashboard-layout-main'>
        <Header />
        <div className='dashboard-layout-content'>
          <div className='dashboard-layout-inner'>
            <div className='dashboard-content-header'>
              <div>
                <h1 className='dashboard-page-title'>{pageTitle}</h1>
                <p className='dashboard-page-subtitle'>
                  <Server size={12} className='dashboard-page-subtitle-icon' aria-hidden />
                  Live Data Pipeline v1.0.4 • Deno & Drizzle ORM
                </p>
              </div>
              <button
                type='button'
                className={`dashboard-sync-btn ${syncStatus === 'syncing' ? '' : 'is-primary'}`}
                onClick={triggerSync}
                disabled={syncStatus === 'syncing'}
                aria-label={syncStatus === 'syncing'
                  ? 'Syncing in progress'
                  : 'Trigger manual sync'}
                aria-busy={syncStatus === 'syncing'}
              >
                <RefreshCw
                  size={16}
                  className={syncStatus === 'syncing' ? 'spinner' : ''}
                  aria-hidden
                />
                {syncStatus === 'syncing' ? 'SYNCING...' : 'MANUAL RE-SYNC'}
              </button>
            </div>
            <Suspense
              fallback={
                <div className='dashboard-route-fallback' aria-live='polite'>
                  Loading…
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
