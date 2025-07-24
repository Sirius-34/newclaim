import * as trpcExpress from '@trpc/server/adapters/express'
import express from 'express'
import { createContext } from './context'
import { appRouter } from './router'

const app = express()

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
)

app.listen(4000, () => {
  console.log('🚀 Server listening on http://localhost:3000')
})
