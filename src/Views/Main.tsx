import React, { lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import * as Errors from '@app/Errors/index.ts'
import * as Layout from '@app/Layout/index.ts'
import * as Views from '@app/Views/Dashboard.tsx'
import '@app/Assets/style.css'

const Sync = lazy(() => import('@app/Views/Sync.tsx').then((m) => ({ default: m.Sync })))
const Companies = lazy(() =>
  import('@app/Views/Companies.tsx').then((m) => ({ default: m.Companies }))
)
const CompanyDetail = lazy(() =>
  import('@app/Views/CompanyDetail.tsx').then((m) => ({ default: m.CompanyDetail }))
)
const Market = lazy(() => import('@app/Views/Market.tsx').then((m) => ({ default: m.Market })))
const Trading = lazy(() => import('@app/Views/Trading.tsx').then((m) => ({ default: m.Trading })))
const Participants = lazy(() =>
  import('@app/Views/Participants.tsx').then((m) => ({ default: m.Participants }))
)
const Calendar = lazy(() =>
  import('@app/Views/Calendar.tsx').then((m) => ({ default: m.Calendar }))
)
const Logs = lazy(() => import('@app/Views/Logs.tsx').then((m) => ({ default: m.Logs })))
const Database = lazy(() =>
  import('@app/Views/Database.tsx').then((m) => ({ default: m.Database }))
)

function App(): React.ReactNode {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/400' element={<Errors.BadRequest />} />
        <Route path='/500' element={<Errors.ServerError />} />
        <Route path='/page' element={<Navigate to='/' replace />} />
        <Route element={<Layout.DashboardLayout />}>
          <Route path='/' element={<Views.Dashboard />} />
          <Route path='/market' element={<Market />} />
          <Route path='/companies' element={<Companies />} />
          <Route path='/companies/:code' element={<CompanyDetail />} />
          <Route path='/trading' element={<Trading />} />
          <Route path='/participants' element={<Participants />} />
          <Route path='/calendar' element={<Calendar />} />
          <Route path='/sync' element={<Sync />} />
          <Route path='/logs' element={<Logs />} />
          <Route path='/database' element={<Database />} />
        </Route>
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('#root not found')
}
createRoot(rootElement).render(React.createElement(App))
