// backend/src/index.ts

import { env } from './lib/env'
import * as trpcExpress from '@trpc/server/adapters/express'
import cors from 'cors'
import express from 'express'
import { createContext } from './context'
import { type AppContext, createAppContext } from './lib/ctx'
import { logger } from './lib/logger'
import { appRouter } from './router'
import { presetDb } from './scripts/presetDb'

void (async () => {
  let ctx: AppContext | null = null
  try {
    ctx = createAppContext()
    await presetDb(ctx)
  } catch (error) {
    logger.error('app', error)
    await ctx?.stop()
  }
})()

const app = express()

app.use(
  cors({
    origin: env.WEBAPP_URL,
    credentials: true,
  })
)

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
)

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server listening on http://localhost:${env.PORT}`)
})
