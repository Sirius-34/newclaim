// backend/src/index.ts

import { env } from './lib/env'
import * as trpcExpress from '@trpc/server/adapters/express'
import cors from 'cors'
import express from 'express'
import { createContext } from './context'
import { appRouter } from './router'

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
