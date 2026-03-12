/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import type { Context } from '@neabyte/deserve'

export function GET(ctx: Context) {
  const workingDir = Deno.cwd()
  return ctx.send.json({
    ok: true,
    service: 'idx-ui',
    ts: new Date().toISOString(),
    root: workingDir
  })
}
