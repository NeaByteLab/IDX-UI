/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import * as Services from '@app/server/services/index.ts'

export class Fetcher {
  private readonly client = new Services.Client()

  async run(): Promise<void> {
    const dateInt = Services.CronDate.todayDateInt()
    await Services.Screener.run(this.client)
    await Services.Summary.run(this.client, dateInt)
  }
}
