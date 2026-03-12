/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import React, { useState } from 'react'
import { Award, BookOpen, Calculator, Compass, DollarSign, Shield, TrendingUp } from 'lucide-react'
import * as HomeTabs from '@app/pages/components/home/index.ts'
import type * as Types from '@app/pages/Types.ts'

const tabs: { id: Types.HomeTab; label: string; icon: React.ReactNode }[] = [
  { id: 'metodologi', label: 'Metodologi', icon: <BookOpen size={16} aria-hidden /> },
  { id: 'skor', label: 'Cara Skor Dihitung', icon: <Calculator size={16} aria-hidden /> },
  { id: 'filter', label: 'Filter & Risiko', icon: <Shield size={16} aria-hidden /> },
  { id: 'cara', label: 'Cara Pakai', icon: <Compass size={16} aria-hidden /> }
]

export default function Home() {
  const [activeTab, setActiveTab] = useState<Types.HomeTab>('metodologi')

  return (
    <div className='idx-main'>
      <section className='idx-home-pillars'>
        <div className='idx-card idx-home-pillar-card'>
          <div className='idx-home-pillar-head'>
            <DollarSign size={20} aria-hidden className='idx-home-pillar-icon' />
            <span className='idx-home-pillar-label'>Valuasi</span>
          </div>
          <p className='idx-home-pillar-desc'>
            <strong>PER</strong> &amp; <strong>PBV</strong>{' '}
            rendah = harga relatif murah vs laba dan buku.
          </p>
        </div>
        <div className='idx-card idx-home-pillar-card'>
          <div className='idx-home-pillar-head'>
            <Award size={20} aria-hidden className='idx-home-pillar-icon' />
            <span className='idx-home-pillar-label'>Kualitas</span>
          </div>
          <p className='idx-home-pillar-desc'>
            <strong>ROE</strong>, <strong>ROA</strong>,{' '}
            <strong>DER</strong>: profitabilitas dan kesehatan utang.
          </p>
        </div>
        <div className='idx-card idx-home-pillar-card'>
          <div className='idx-home-pillar-head'>
            <TrendingUp size={20} aria-hidden className='idx-home-pillar-icon' />
            <span className='idx-home-pillar-label'>Momentum</span>
          </div>
          <p className='idx-home-pillar-desc'>
            Return <strong>26w</strong>/<strong>52w</strong>: tren harga jangka menengah.
          </p>
        </div>
      </section>

      <section className='idx-card idx-home-tabs-card'>
        <div className='idx-tabs idx-tabs-in-card'>
          {tabs.map((tabItem) => (
            <button
              key={tabItem.id}
              type='button'
              className={`idx-tab idx-tab-inline ${
                activeTab === tabItem.id ? 'idx-tab-active' : ''
              }`}
              onClick={() => setActiveTab(tabItem.id)}
            >
              {tabItem.icon}
              <span>{tabItem.label}</span>
            </button>
          ))}
        </div>
        {activeTab === 'metodologi' && <HomeTabs.TabMethodology />}
        {activeTab === 'skor' && <HomeTabs.TabScore />}
        {activeTab === 'filter' && <HomeTabs.TabFilter />}
        {activeTab === 'cara' && <HomeTabs.TabHowTo />}
      </section>
    </div>
  )
}
