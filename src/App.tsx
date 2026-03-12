/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import React from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { BarChart3, History, Home as HomeIcon, Info, LineChart } from 'lucide-react'
import Home from '@app/pages/Home.tsx'
import About from '@app/pages/About.tsx'
import Screener from '@app/pages/Screener.tsx'
import Historical from '@app/pages/Historical.tsx'

export default function App() {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <div className='idx-page'>
      <header className='idx-header'>
        <div className='idx-header-inner'>
          <Link to='/' className='idx-logo' style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className='idx-logo-icon'>
              <LineChart size={22} strokeWidth={2.2} />
            </div>
            <span className='idx-logo-text'>
              IDX <span>Screener</span>
            </span>
          </Link>
          <nav className='idx-nav'>
            <Link to='/' className={`idx-nav-item ${isActive('/') ? 'idx-nav-item-active' : ''}`}>
              <HomeIcon size={16} aria-hidden />
              <span className='idx-nav-item-text'>Beranda</span>
            </Link>
            <Link
              to='/screener'
              className={`idx-nav-item ${isActive('/screener') ? 'idx-nav-item-active' : ''}`}
            >
              <BarChart3 size={16} aria-hidden />
              <span className='idx-nav-item-text'>Screener</span>
            </Link>
            <Link
              to='/historical'
              className={`idx-nav-item ${isActive('/historical') ? 'idx-nav-item-active' : ''}`}
            >
              <History size={16} aria-hidden />
              <span className='idx-nav-item-text'>Historical</span>
            </Link>
            <Link
              to='/about'
              className={`idx-nav-item ${isActive('/about') ? 'idx-nav-item-active' : ''}`}
            >
              <Info size={16} aria-hidden />
              <span className='idx-nav-item-text'>Tentang</span>
            </Link>
          </nav>
        </div>
      </header>
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/historical' element={<Historical />} />
          <Route path='/screener' element={<Screener />} />
        </Routes>
      </main>
    </div>
  )
}
