/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import React, { useCallback, useState } from 'react'
import { BarChart2, TrendingUp } from 'lucide-react'
import * as ScreenerComps from '@app/pages/components/screener/index.ts'
import * as Hooks from '@app/pages/hooks/index.ts'
import type * as Types from '@app/pages/Types.ts'
import * as Utils from '@app/pages/utils/index.ts'

const defaultParams: Types.CandidatesParams = {
  limit: 10,
  offset: 0,
  defaultFilter: true,
  excludeNotation: true,
  excludeCorpAction: true,
  excludeUma: true,
  perMin: 1,
  perMax: 25,
  roeMin: 10,
  derMax: 2,
  momentumWeek: 26,
  momentumMin: 5,
  minValue: 1_000_000_000,
  minVolume: 100_000,
  withSectorRank: true
}

export default function Screener() {
  const [params, setParams] = useState<Types.CandidatesParams>(defaultParams)
  const [appliedParams, setAppliedParams] = useState<Types.CandidatesParams>(defaultParams)
  const [sectorWeek, setSectorWeek] = useState<26 | 52>(26)
  const [sectorFilter, setSectorFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [detailCode, setDetailCode] = useState<string | null>(null)
  const [mainTab, setMainTab] = useState<Types.MainAnalysisTab>('fundamental')
  const { data: generalData } = Hooks.useGeneral()
  const {
    data: screenerRsiData,
    loading: screenerRsiLoading,
    error: screenerRsiError,
    refetch: refetchScreenerRsi
  } = Hooks.useScreenerRsi()
  const {
    data: screenerBidOfferData,
    loading: screenerBidOfferLoading,
    error: screenerBidOfferError,
    refetch: refetchScreenerBidOffer
  } = Hooks.useScreenerBidOffer()
  const sectors = generalData?.sectors ?? []
  const {
    response: candidatesResponse,
    loading: candidatesLoading,
    error: candidatesError,
    refetch: refetchCandidates
  } = Hooks.useCandidates(appliedParams)
  const { data: sectorData, loading: sectorLoading } = Hooks.useSectorStrength(sectorWeek)
  const {
    data: detailData,
    loading: detailLoading,
    error: detailError,
    fetchDetail,
    clearDetail
  } = Hooks.useStockDetail()

  const handleParamsChange = useCallback((partial: Partial<Types.CandidatesParams>) => {
    setParams((prevParams: Types.CandidatesParams) => ({ ...prevParams, ...partial, offset: 0 }))
  }, [])

  const handleApplyFilter = useCallback(() => {
    setAppliedParams({ ...params, offset: 0 })
  }, [params])

  const handleDefaultFilter = useCallback(() => {
    const paramsToApply = { ...defaultParams, offset: 0 }
    setParams(paramsToApply)
    setAppliedParams(paramsToApply)
  }, [])

  const handlePageChange = useCallback((newOffset: number) => {
    setParams((prevParams: Types.CandidatesParams) => ({ ...prevParams, offset: newOffset }))
    setAppliedParams((prevParams: Types.CandidatesParams) => ({ ...prevParams, offset: newOffset }))
  }, [])

  const handleRowClick = useCallback(
    (code: string) => {
      setDetailCode(code)
      const responseDate = candidatesResponse?.date
      const endDate = responseDate ??
        parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''), 10)
      const startDate = Utils.Format.addDaysToDateInt(endDate, -90)
      fetchDetail(code, startDate, endDate, responseDate)
    },
    [candidatesResponse?.date, fetchDetail]
  )

  const handleCloseModal = useCallback(() => {
    setDetailCode(null)
    clearDetail()
  }, [clearDetail])

  const dataDate = candidatesResponse?.date ?? 0
  const rawData = candidatesResponse?.data ?? []
  const sectorDataFiltered = sectorFilter === ''
    ? rawData
    : rawData.filter((candidateRow: Types.CandidateRow) => candidateRow.sector === sectorFilter)
  const searchTerm = searchQuery.trim().toLowerCase()
  const filteredCandidates = searchTerm === '' ? sectorDataFiltered : sectorDataFiltered.filter(
    (candidateRow: Types.CandidateRow) =>
      (candidateRow.code && candidateRow.code.toLowerCase().includes(searchTerm)) ||
      (candidateRow.name && candidateRow.name?.toLowerCase().includes(searchTerm)) ||
      (candidateRow.sector && candidateRow.sector.toLowerCase().includes(searchTerm))
  )
  const totalCount = candidatesResponse?.totalCount ?? 0
  const limit = candidatesResponse?.limit ?? 10
  const offset = candidatesResponse?.offset ?? 0
  const displayTotalCount = searchTerm
    ? filteredCandidates.length
    : sectorFilter === ''
    ? totalCount
    : sectorDataFiltered.length

  return (
    <div className='idx-page'>
      <div className='idx-main'>
        <ScreenerComps.DashboardHeader
          totalCount={totalCount}
          date={dataDate}
          onRefresh={refetchCandidates}
          loading={candidatesLoading}
        />
        <div className='idx-tabs idx-mb-24'>
          <button
            type='button'
            className={`idx-tab idx-tab-inline ${
              mainTab === 'fundamental' ? 'idx-tab-active' : ''
            }`}
            onClick={() => setMainTab('fundamental')}
          >
            <BarChart2 size={16} aria-hidden />
            <span>Analisa Fundamental</span>
          </button>
          <button
            type='button'
            className={`idx-tab idx-tab-inline ${mainTab === 'technical' ? 'idx-tab-active' : ''}`}
            onClick={() => setMainTab('technical')}
          >
            <TrendingUp size={16} aria-hidden />
            <span>Analisa Teknikal</span>
          </button>
        </div>
        {mainTab === 'fundamental' && (
          <div className='idx-grid-main'>
            <div>
              <ScreenerComps.FilterPanel
                params={params}
                sectors={sectors}
                sectorFilter={sectorFilter}
                onSectorFilterChange={setSectorFilter}
                onParamsChange={handleParamsChange}
                onApply={handleApplyFilter}
                onDefaultFilter={handleDefaultFilter}
              />
              {!candidatesLoading && candidatesError && (
                <div className='idx-error idx-mt-16'>{candidatesError}</div>
              )}
              {candidatesLoading && filteredCandidates.length === 0 && (
                <div className='idx-loading idx-mt-16'>Memuat kandidat...</div>
              )}
              {!candidatesLoading && !candidatesError && (
                <div className='idx-mt-24'>
                  {rawData.length > 0
                    ? (
                      <ScreenerComps.CandidatesTable
                        data={filteredCandidates}
                        limit={limit}
                        offset={offset}
                        totalCount={displayTotalCount}
                        {...(sectorFilter !== '' && { totalCountLabel: `filter: ${sectorFilter}` })}
                        onPage={handlePageChange}
                        onRowClick={handleRowClick}
                        searchValue={searchQuery}
                        onSearchChange={setSearchQuery}
                      />
                    )
                    : (
                      <div className='idx-card idx-card-center'>
                        <p className='idx-p-muted'>
                          Tidak ada kandidat yang memenuhi filter. Coba longgarkan filter atau klik
                          &quot;Reset Ke Default&quot;.
                        </p>
                      </div>
                    )}
                </div>
              )}
            </div>
            <aside>
              <ScreenerComps.SectorStrength
                data={sectorData}
                loading={sectorLoading}
                week={sectorWeek}
                onWeekChange={setSectorWeek}
              />
            </aside>
          </div>
        )}
        {mainTab === 'technical' && (
          <div className='idx-technical-row'>
            <ScreenerComps.RsiMarketView
              data={screenerRsiData}
              loading={screenerRsiLoading}
              error={screenerRsiError}
              onRefetch={refetchScreenerRsi}
            />
            <ScreenerComps.BidOfferMarketView
              data={screenerBidOfferData}
              loading={screenerBidOfferLoading}
              error={screenerBidOfferError}
              onRefetch={refetchScreenerBidOffer}
            />
          </div>
        )}
      </div>
      {detailCode && (
        <ScreenerComps.StockDetailModal
          detail={detailData}
          loading={detailLoading}
          error={detailError}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}
