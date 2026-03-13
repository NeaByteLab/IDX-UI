/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import React, { useState } from 'react'
import {
  Ban,
  Check,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Droplets,
  Layers,
  PieChart,
  RotateCcw,
  SlidersHorizontal,
  TrendingUp
} from 'lucide-react'
import type * as Types from '@app/pages/Types.ts'

export default function FilterPanel({
  params,
  sectors,
  sectorFilter,
  onSectorFilterChange,
  onParamsChange,
  onApply,
  onDefaultFilter
}: Types.FilterPanelProps) {
  const updateFilterParam = (key: keyof Types.CandidatesParams, paramValue: unknown) => {
    onParamsChange({ [key]: paramValue })
  }
  const [isCollapsed, setCollapsed] = useState(true)

  return (
    <div className='idx-card idx-filter-panel'>
      <button
        type='button'
        className='idx-filter-panel-toggle'
        onClick={() => setCollapsed((prevCollapsed) => !prevCollapsed)}
        aria-expanded={!isCollapsed}
      >
        <span className='idx-filter-panel-title'>
          <SlidersHorizontal size={20} aria-hidden />
          <span>Filter Kandidat</span>
        </span>
        <span className='idx-filter-panel-chevron' aria-hidden>
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      {!isCollapsed && (
        <>
          <div className='idx-filter-grid'>
            <div className='idx-filter-group'>
              <p className='idx-filter-group-title'>
                <Layers size={16} aria-hidden />
                <span>Sektor</span>
              </p>
              <p className='idx-filter-group-desc'>
                Tampilkan kandidat per sektor, pilih sektor untuk memfilter tabel di bawah.
              </p>
              <div className='idx-filter-group-fields'>
                <div className='idx-form-group'>
                  <label className='idx-form-label' htmlFor='idx-filter-sector'>
                    Pilih Sektor
                  </label>
                  <select
                    id='idx-filter-sector'
                    className='idx-select'
                    value={sectorFilter}
                    onChange={(event) => onSectorFilterChange(event.target.value)}
                  >
                    <option value=''>Semua</option>
                    {sectors.map((sectorName) => (
                      <option key={sectorName} value={sectorName}>
                        {sectorName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className='idx-filter-group'>
              <p className='idx-filter-group-title'>
                <DollarSign size={16} aria-hidden />
                <span>Valuasi</span>
              </p>
              <p className='idx-filter-group-desc'>
                Batas rasio PER (harga/earning), fokus pada saham yang dinilai wajar atau murah.
              </p>
              <div className='idx-filter-group-fields'>
                <div className='idx-form-group'>
                  <label className='idx-form-label' htmlFor='idx-filter-perMin'>
                    PER Min
                  </label>
                  <input
                    id='idx-filter-perMin'
                    type='number'
                    className='idx-input'
                    placeholder='0'
                    min={0}
                    step={1}
                    value={params.perMin ?? ''}
                    onChange={(event) =>
                      updateFilterParam(
                        'perMin',
                        event.target.value === '' ? undefined : Number(event.target.value)
                      )}
                  />
                </div>
                <div className='idx-form-group'>
                  <label className='idx-form-label' htmlFor='idx-filter-perMax'>
                    PER Max
                  </label>
                  <input
                    id='idx-filter-perMax'
                    type='number'
                    className='idx-input'
                    placeholder='25'
                    min={0}
                    step={1}
                    value={params.perMax ?? ''}
                    onChange={(event) =>
                      updateFilterParam(
                        'perMax',
                        event.target.value === '' ? undefined : Number(event.target.value)
                      )}
                  />
                </div>
              </div>
            </div>
            <div className='idx-filter-group'>
              <p className='idx-filter-group-title'>
                <PieChart size={16} aria-hidden />
                <span>Fundamental</span>
              </p>
              <p className='idx-filter-group-desc'>
                ROE minimal (profitabilitas) dan DER maksimal (risiko utang).
              </p>
              <div className='idx-filter-group-fields'>
                <div className='idx-form-group'>
                  <label className='idx-form-label' htmlFor='idx-filter-roeMin'>
                    ROE Min (%)
                  </label>
                  <input
                    id='idx-filter-roeMin'
                    type='number'
                    className='idx-input'
                    placeholder='0'
                    step={0.1}
                    value={params.roeMin ?? ''}
                    onChange={(event) =>
                      updateFilterParam(
                        'roeMin',
                        event.target.value === '' ? undefined : Number(event.target.value)
                      )}
                  />
                </div>
                <div className='idx-form-group'>
                  <label className='idx-form-label' htmlFor='idx-filter-derMax'>
                    DER Max
                  </label>
                  <input
                    id='idx-filter-derMax'
                    type='number'
                    className='idx-input'
                    placeholder='2'
                    min={0}
                    step={0.1}
                    value={params.derMax ?? ''}
                    onChange={(event) =>
                      updateFilterParam(
                        'derMax',
                        event.target.value === '' ? undefined : Number(event.target.value)
                      )}
                  />
                </div>
              </div>
            </div>
            <div className='idx-filter-group'>
              <p className='idx-filter-group-title'>
                <TrendingUp size={16} aria-hidden />
                <span>Momentum</span>
              </p>
              <p className='idx-filter-group-desc'>
                Periode return (26 atau 52 minggu) dan batas minimal momentum (%).
              </p>
              <div className='idx-filter-group-fields'>
                <div className='idx-form-group'>
                  <label className='idx-form-label' htmlFor='idx-filter-momentumWeek'>
                    Periode
                  </label>
                  <select
                    id='idx-filter-momentumWeek'
                    className='idx-select'
                    value={params.momentumWeek ?? 26}
                    onChange={(event) =>
                      updateFilterParam('momentumWeek', Number(event.target.value) as 26 | 52)}
                  >
                    <option value={26}>26 minggu</option>
                    <option value={52}>52 minggu</option>
                  </select>
                </div>
                <div className='idx-form-group'>
                  <label className='idx-form-label' htmlFor='idx-filter-momentumMin'>
                    Momentum Min (%)
                  </label>
                  <input
                    id='idx-filter-momentumMin'
                    type='number'
                    className='idx-input'
                    placeholder='0'
                    step={0.1}
                    value={params.momentumMin ?? ''}
                    onChange={(event) =>
                      updateFilterParam(
                        'momentumMin',
                        event.target.value === '' ? undefined : Number(event.target.value)
                      )}
                  />
                </div>
              </div>
            </div>
            <div className='idx-filter-group'>
              <p className='idx-filter-group-title'>
                <Droplets size={16} aria-hidden />
                <span>Likuiditas</span>
              </p>
              <p className='idx-filter-group-desc'>
                Batas minimal nilai transaksi (Rp) dan volume agar saham cukup likuid.
              </p>
              <div className='idx-filter-group-fields'>
                <div className='idx-form-group'>
                  <label className='idx-form-label' htmlFor='idx-filter-minValue'>
                    Min Value (Rp)
                  </label>
                  <input
                    id='idx-filter-minValue'
                    type='number'
                    className='idx-input'
                    placeholder='0'
                    min={0}
                    value={params.minValue ?? ''}
                    onChange={(event) =>
                      updateFilterParam(
                        'minValue',
                        event.target.value === '' ? undefined : Number(event.target.value)
                      )}
                  />
                </div>
                <div className='idx-form-group'>
                  <label className='idx-form-label' htmlFor='idx-filter-minVolume'>
                    Min Volume
                  </label>
                  <input
                    id='idx-filter-minVolume'
                    type='number'
                    className='idx-input'
                    placeholder='0'
                    min={0}
                    value={params.minVolume ?? ''}
                    onChange={(event) =>
                      updateFilterParam(
                        'minVolume',
                        event.target.value === '' ? undefined : Number(event.target.value)
                      )}
                  />
                </div>
              </div>
            </div>
            <div className='idx-filter-group'>
              <p className='idx-filter-group-title'>
                <Ban size={16} aria-hidden />
                <span>Eksklusi</span>
              </p>
              <p className='idx-filter-group-desc'>
                Sembunyikan saham dengan catatan khusus, corporate action, atau pengumuman UMA.
              </p>
              <div className='idx-checkbox-group'>
                <label className='idx-checkbox-label'>
                  <input
                    type='checkbox'
                    checked={params.excludeNotation === true}
                    onChange={(event) => updateFilterParam('excludeNotation', event.target.checked)}
                  />
                  Kecualikan Saham dengan Notation
                </label>
                <label className='idx-checkbox-label'>
                  <input
                    type='checkbox'
                    checked={params.excludeCorpAction === true}
                    onChange={(event) =>
                      updateFilterParam('excludeCorpAction', event.target.checked)}
                  />
                  Kecualikan Saham Corporate Action
                </label>
                <label className='idx-checkbox-label'>
                  <input
                    type='checkbox'
                    checked={params.excludeUma === true}
                    onChange={(event) => updateFilterParam('excludeUma', event.target.checked)}
                  />
                  Kecualikan Saham UMA
                </label>
              </div>
            </div>
          </div>
          <div className='idx-filter-actions'>
            <button type='button' className='idx-btn' onClick={onDefaultFilter}>
              <RotateCcw size={16} aria-hidden />
              <span>Reset Ke Default</span>
            </button>
            <button type='button' className='idx-btn-primary' onClick={onApply}>
              <Check size={16} aria-hidden />
              <span>Terapkan Filter</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
