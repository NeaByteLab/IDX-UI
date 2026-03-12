/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import * as Services from '@app/server/services/index.ts'

export class Bootstrap {
  static async run(): Promise<void> {
    const client = new Services.Client()
    console.log('[bootstrap] Start: upsert screener (single snapshot)')
    await Bootstrap.withRetry('screenerJob', () => Services.Screener.run(client))
    const startDate = Bootstrap.twoYearsAgoStart()
    const endDate = new Date()
    endDate.setHours(0, 0, 0, 0)
    let currentDate = startDate
    let processedCount = 0
    const totalDays = Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000) + 1
    )
    while (currentDate.getTime() <= endDate.getTime()) {
      const dateInt = Bootstrap.dateIntFromDate(currentDate)
      const progress = `${processedCount + 1}/${totalDays}`
      console.log(`[bootstrap] (${progress}) stock summary date=${dateInt}`)
      await Bootstrap.withRetry(
        `stockSummary:${dateInt}`,
        () => Services.Summary.run(client, dateInt)
      )
      processedCount++
      currentDate = Bootstrap.addDays(currentDate, 1)
      await Bootstrap.sleepMs(150)
    }
    console.log('[bootstrap] Done')
  }

  private static dateIntFromDate(date: Date): number {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return parseInt(`${year}${month}${day}`, 10)
  }

  private static addDays(date: Date, days: number): Date {
    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + days)
    return nextDate
  }

  private static twoYearsAgoStart(): Date {
    const now = new Date()
    const start = new Date(now)
    start.setFullYear(now.getFullYear() - 2)
    start.setHours(0, 0, 0, 0)
    return start
  }

  private static sleepMs(delayMs: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  private static async withRetry<T>(label: string, task: () => Promise<T>): Promise<T> {
    const backoffMs = [500, 1500, 3000]
    let lastError: unknown = null
    for (let attemptIndex = 0; attemptIndex <= backoffMs.length; attemptIndex++) {
      try {
        return await task()
      } catch (error) {
        lastError = error
        if (attemptIndex === backoffMs.length) {
          break
        }
        console.warn(`[bootstrap] ${label} failed, retrying...`, error)
        await Bootstrap.sleepMs(backoffMs[attemptIndex]!)
      }
    }
    throw lastError
  }
}

if (import.meta.main) {
  await Bootstrap.run()
}
