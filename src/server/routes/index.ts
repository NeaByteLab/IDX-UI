/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import type { Context } from '@neabyte/deserve'

export async function GET(ctx: Context) {
  const indexHtmlPath = `${Deno.cwd()}/dist/index.html`
  const indexHtml = await Deno.readTextFile(indexHtmlPath)
  return ctx.send.html(indexHtml, { status: 200 })
}
