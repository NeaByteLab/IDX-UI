/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

export class CronDate {
  static stringToDateInt(dateStr: string): number {
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (!match) {
      return 0
    }
    return parseInt(`${match[1]}${match[2]}${match[3]}`, 10)
  }

  static todayDateInt(): number {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return parseInt(`${year}${month}${day}`, 10)
  }
}
