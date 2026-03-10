import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BadRequest, ServerError } from '@app/Errors/index.ts'
import { Page } from '@app/Views/Page.tsx'
import '@app/Assets/style.module.css'

function App(): React.ReactNode {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Page />} />
        <Route path='400' element={<BadRequest />} />
        <Route path='500' element={<ServerError />} />
      </Routes>
    </BrowserRouter>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('#root not found')
}
createRoot(rootElement).render(React.createElement(App))
