/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

export default class RSI {
  static readonly defaultPeriod = 14

  static calculate(closes: number[], period: number = RSI.defaultPeriod): (number | null)[] {
    if (closes.length === 0 || period < 1) {
      return []
    }
    const result: (number | null)[] = new Array(closes.length).fill(null)
    if (closes.length < period + 1) {
      return result
    }
    let sumGain = 0
    let sumLoss = 0
    for (let i = 1; i <= period; i++) {
      const change = closes[i]! - closes[i - 1]!
      if (change > 0) {
        sumGain += change
      } else if (change < 0) {
        sumLoss += -change
      }
    }
    let avgGain = sumGain / period
    let avgLoss = sumLoss / period
    result[period] = RSI.fromAverages(avgGain, avgLoss)
    for (let i = period + 1; i < closes.length; i++) {
      const change = closes[i]! - closes[i - 1]!
      const gain = change > 0 ? change : 0
      const loss = change < 0 ? -change : 0
      avgGain = (avgGain * (period - 1) + gain) / period
      avgLoss = (avgLoss * (period - 1) + loss) / period
      result[i] = RSI.fromAverages(avgGain, avgLoss)
    }
    return result
  }

  private static fromAverages(avgGain: number, avgLoss: number): number {
    if (avgLoss === 0) {
      return 100
    }
    const rs = avgGain / avgLoss
    return 100 - 100 / (1 + rs)
  }
}
