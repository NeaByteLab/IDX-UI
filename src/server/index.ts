/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import { Router } from '@neabyte/deserve'
import * as Services from '@app/server/services/index.ts'
import type * as Types from '@app/server/Types.ts'

async function runFetchData(): Promise<void> {
  const fetcher = new Services.Fetcher()
  await fetcher.run()
}

const distRoot = `${Deno.cwd()}/dist`
;(Deno as unknown as Types.DenoCron).cron(
  'Fetch IDX screener and stock summary',
  '0 * * * *',
  async () => {
    try {
      await runFetchData()
    } catch (error) {
      console.error('[cron] Fetch IDX data failed:', error)
    }
  }
)
const router = new Router({
  routesDir: `${Deno.cwd()}/src/server/routes`
})

router.static('/assets', {
  path: `${distRoot}/assets`,
  etag: true,
  cacheControl: 31536000
})

router.catch(async (ctx, error) => {
  if (error.statusCode !== 404 || ctx.request.method !== 'GET') {
    return null
  }
  const accept = ctx.request.headers.get('accept') ?? ''
  const wantsHtml = accept.includes('text/html') || accept.includes('*/*') || accept === ''
  if (!wantsHtml) {
    return null
  }
  const html = await Deno.readTextFile(`${distRoot}/index.html`)
  return ctx.send.html(html, { status: 200 })
})

await router.serve(50270)
