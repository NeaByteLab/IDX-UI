/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as Schemas from '@app/server/schemas/index.ts'

const libsqlClient = createClient({
  url: import.meta.resolve('@data/database.sqlite')
})

export default drizzle(libsqlClient, { schema: Schemas })
