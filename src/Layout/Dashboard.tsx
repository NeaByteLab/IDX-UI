import React, { type JSX, Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import * as Hooks from '@app/Hooks/index.ts'
import { Header } from '@app/Layout/Header.tsx'
import { Sidebar } from '@app/Layout/Sidebar.tsx'
import * as Config from '@app/Config/index.ts'

export function DashboardLayout(): JSX.Element {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen, isMobile] = Hooks.useSidebarState()
  const [syncStatus, triggerSync] = Hooks.useSyncStatus()
  const isOverview = location.pathname === '/'
  const current = Config.navItems.find((n) => n.path === location.pathname) ??
    (location.pathname.startsWith('/companies/')
      ? Config.navItems.find((n) => n.path === '/companies')
      : null) ??
    Config.navItems[0]
  const pageTitle = isOverview
    ? 'Market Data Intelligence'
    : location.pathname.startsWith('/companies/')
    ? 'Company Detail'
    : (current?.label ?? 'Dashboard')
  const pageSubtitleByPath: Record<string, string> = {
    '/market': 'Indices, sectoral, gainers/losers, foreign flow — one tab per dataset',
    '/trading':
      'Stock summary, most active, industry, broker — one tab per dataset. Stock/Broker use date = first day of period.',
    '/companies': 'Company directory, suspended, new/delisted/relisted',
    '/participants': 'Brokers, participants, primary dealers — one tab per dataset',
    '/calendar': 'Market holidays & events by date'
  }
  const companyDetailSubtitle = 'Profile, announcements, financials, trading, corporate actions'
  const pageSubtitle = pageSubtitleByPath[location.pathname] ??
    (location.pathname.startsWith('/companies/') ? companyDetailSubtitle : '')
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
                {pageSubtitle ? <p className='dashboard-page-description'>{pageSubtitle}</p> : null}
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
